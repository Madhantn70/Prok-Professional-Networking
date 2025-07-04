from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.backend.extensions import db, limiter
from app.backend.models.user import User
from flask_jwt_extended import create_access_token
import bleach
import re

auth_bp = Blueprint('auth', __name__)

# Password complexity check
PASSWORD_REGEX = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$')

def is_password_complex(password):
    return bool(PASSWORD_REGEX.match(password))

@auth_bp.route('/api/signup', methods=['POST'])
@limiter.limit("5 per minute")
def signup():
    data = request.get_json()
    username = bleach.clean(data.get('username', ''))
    email = bleach.clean(data.get('email', ''))
    password = data.get('password', '')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    if not is_password_complex(password):
        return jsonify({'error': 'Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.'}), 400

    # Check for existing user
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'error': 'Username or email already exists'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/api/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.get_json()
    identifier = bleach.clean(data.get('username') or data.get('email', ''))
    password = data.get('password', '')

    if not identifier or not password:
        return jsonify({'error': 'Missing username/email or password'}), 401

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id)
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email
    }
    return jsonify({'token': access_token, 'user': user_data}), 200

# Routes will be implemented here 