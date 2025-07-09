from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from extensions import db
import os
import imghdr
import time
from werkzeug.utils import secure_filename

profile_bp = Blueprint('profile', __name__)

def allowed_file(filename):
    allowed = current_app.config['ALLOWED_EXTENSIONS']
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed

@profile_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    import sys
    print('Authorization header:', request.headers.get('Authorization'), file=sys.stderr)
    user_id = get_jwt_identity()
    print('JWT user_id:', user_id, file=sys.stderr)
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'error': 'User not found'}), 404
    profile_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'title': user.title,
        'bio': user.bio,
        'skills': user.skills,
        'avatar': user.avatar,
        'location': user.location,
        'phone': user.phone,
        'languages': user.languages,
        'connections': user.connections,
        'mutualConnections': user.mutual_connections
    }
    # Return as { user: {...}, activity: [] } to match frontend
    return jsonify({'user': profile_data, 'activity': []}), 200

@profile_bp.route('/profile/image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['image']
    if not file or not isinstance(file.filename, str) or file.filename.strip() == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[1].lower()
        # Use timestamp for uniqueness
        new_filename = f"profile_{int(time.time())}.{ext}"
        upload_folder = current_app.config['UPLOAD_FOLDER']
        file_path = os.path.join(upload_folder, new_filename)
        file.save(file_path)
        # Validate file type
        if imghdr.what(file_path) not in current_app.config['ALLOWED_EXTENSIONS']:
            os.remove(file_path)
            return jsonify({'error': 'Invalid image type'}), 400
        # Optionally: image compression/resizing can be added here
        # Update user avatar
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({'error': 'User not found'}), 404
        user.avatar = f"/api/profile/image/{new_filename}"
        db.session.commit()
        return jsonify({'image_url': user.avatar}), 200
    else:
        return jsonify({'error': 'Invalid file type or size'}), 400

@profile_bp.route('/profile/image/<filename>', methods=['GET'])
def serve_profile_image(filename):
    upload_folder = current_app.config['UPLOAD_FOLDER']
    return send_from_directory(upload_folder, filename)

@profile_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    # Simple validation and partial update
    for field in ['title', 'bio', 'skills', 'avatar', 'location', 'phone', 'languages', 'connections', 'mutual_connections']:
        if field in data:
            setattr(user, field, data[field])
    db.session.commit()
    # Return updated profile (excluding password_hash)
    profile_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'title': user.title,
        'bio': user.bio,
        'skills': user.skills,
        'avatar': user.avatar,
        'location': user.location,
        'phone': user.phone,
        'languages': user.languages,
        'connections': user.connections,
        'mutual_connections': user.mutual_connections
    }
    return jsonify(profile_data), 200 