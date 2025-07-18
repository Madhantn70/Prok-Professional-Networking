from flask import Blueprint, request, jsonify, current_app, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from ..models.post import Post
from ..models.user import User
from ..extensions import db
from datetime import datetime
from collections import Counter
import threading
from typing import Optional, List, Dict

posts_bp = Blueprint('posts', __name__)

# Simple in-memory cache for categories and tags
_cache: Dict[str, Optional[List[str]]] = {'categories': None, 'tags': None}
_cache_lock = threading.Lock()

def allowed_file(filename):
    allowed = current_app.config['ALLOWED_EXTENSIONS']
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed

@posts_bp.route('/posts/categories', methods=['GET'])
def get_categories():
    with _cache_lock:
        if _cache['categories'] is not None:
            return jsonify({'categories': _cache['categories']}), 200
    categories = db.session.query(Post.category).filter(Post.category.isnot(None)).distinct().all()
    categories = [c[0] for c in categories if c[0]]
    with _cache_lock:
        _cache['categories'] = categories
    return jsonify({'categories': categories}), 200

@posts_bp.route('/posts/popular-tags', methods=['GET'])
def get_popular_tags():
    with _cache_lock:
        if _cache['tags'] is not None:
            return jsonify({'tags': _cache['tags']}), 200
    all_tags = db.session.query(Post.tags).filter(Post.tags.isnot(None)).all()
    tag_counter = Counter()
    for tag_str in all_tags:
        if tag_str[0]:
            tag_list = [t.strip() for t in tag_str[0].split(',') if t.strip()]
            tag_counter.update(tag_list)
    popular_tags = [tag for tag, _ in tag_counter.most_common(20)]
    with _cache_lock:
        _cache['tags'] = popular_tags
    return jsonify({'tags': popular_tags}), 200

@posts_bp.route('/posts', methods=['GET'])
@jwt_required()
def get_posts():
    user_id = get_jwt_identity()
    # Query params
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    search = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip()
    visibility = request.args.get('visibility', '').strip()
    tag = request.args.get('tag', '').strip()
    sort = request.args.get('sort', 'newest').strip()

    query = Post.query
    # Visibility: public/private or all
    if visibility == 'public':
        query = query.filter_by(public_post=True)
    elif visibility == 'private':
        query = query.filter_by(public_post=False)
    # Category filter
    if category:
        query = query.filter(Post.category == category)
    # Tag filter (simple contains for now)
    if tag:
        query = query.filter(Post.tags.like(f'%{tag}%'))
    # Search (title/content)
    if search:
        query = query.filter((Post.title.ilike(f'%{search}%')) | (Post.content.ilike(f'%{search}%')))
    # Sorting
    if sort == 'oldest':
        query = query.order_by(Post.created_at.asc())
    elif sort == 'likes':
        query = query.order_by(Post.likes_count.desc())
    elif sort == 'views':
        query = query.order_by(Post.views_count.desc())
    else:
        query = query.order_by(Post.created_at.desc())
    # Pagination
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    posts = paginated.items
    posts_data = []
    for post in posts:
        posts_data.append({
            'id': post.id,
            'user_id': post.user_id,
            'title': post.title,
            'content': post.content,
            'media_url': post.media_url,
            'allow_comments': post.allow_comments,
            'public_post': post.public_post,
            'created_at': post.created_at.isoformat(),
            'category': post.category,
            'tags': post.tags.split(',') if post.tags else [],
            'likes_count': post.likes_count,
            'views_count': post.views_count
        })
    return jsonify({'posts': posts_data}), 200

@posts_bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    title = request.form.get('title', '').strip()
    content = request.form.get('content', '').strip()
    allow_comments = request.form.get('allow_comments', 'true').lower() == 'true'
    public_post = request.form.get('public_post', 'true').lower() == 'true'
    if not title:
        return jsonify({'error': 'Title is required.'}), 400
    if not content:
        return jsonify({'error': 'Content is required.'}), 400

    file = request.files.get('media')
    media_url = None
    if file:
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type.'}), 400
        if file.content_length and file.content_length > current_app.config['MAX_CONTENT_LENGTH']:
            return jsonify({'error': 'File too large.'}), 400
        filename = secure_filename(f"{user_id}_{int(datetime.utcnow().timestamp())}_{file.filename}")
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        media_url = f"/uploads/posts/{filename}"

    post = Post(user_id=user_id, title=title, content=content, media_url=media_url, allow_comments=allow_comments, public_post=public_post)
    db.session.add(post)
    db.session.commit()
    # Invalidate category/tag cache
    with _cache_lock:
        _cache['categories'] = None
        _cache['tags'] = None
    return jsonify({
        'id': post.id,
        'user_id': post.user_id,
        'title': post.title,
        'content': post.content,
        'media_url': post.media_url,
        'allow_comments': post.allow_comments,
        'public_post': post.public_post,
        'created_at': post.created_at.isoformat()
    }), 201 