from flask import Blueprint, request, jsonify, current_app, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from backend.models.post import Post
from backend.models.user import User
from backend.extensions import db
from datetime import datetime

posts_bp = Blueprint('posts', __name__)

def allowed_file(filename):
    allowed = current_app.config['ALLOWED_EXTENSIONS']
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed

@posts_bp.route('/posts', methods=['GET'])
@jwt_required()
def get_posts():
    user_id = get_jwt_identity()
    posts = Post.query.filter_by(user_id=user_id).order_by(Post.created_at.desc()).all()
    
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
            'created_at': post.created_at.isoformat()
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