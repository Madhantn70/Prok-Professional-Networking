from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from backend.models.user import User
from backend.extensions import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
        return jsonify({'error': 'All fields are required.'}), 400
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'error': 'Username or email already exists.'}), 400
    hashed_pw = generate_password_hash(password)
    user = User(username=username, email=email, password_hash=hashed_pw)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created successfully.'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required.'}), 400
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials.'}), 401
    access_token = create_access_token(identity=str(user.id))
    return jsonify({'token': access_token, 'username': user.username}), 200 