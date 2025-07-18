from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models.user import User
from extensions import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/test', methods=['GET'])
def test_auth():
    return jsonify({'message': 'Auth blueprint is working!'})

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
    print("/api/login route hit")
    data = request.get_json()
    print("Data received:", data)
    username = data.get('username') if data else None
    password = data.get('password') if data else None
    print("Username:", username)
    if not username or not password:
        print("Missing username or password")
        return jsonify({'error': 'Username and password required.'}), 400
    try:
        user = User.query.filter_by(username=username).first()
        print("User found:", user)
        if not user:
            hashed_pw = generate_password_hash(password)
            user = User(username=username, email=f'{username}@example.com', password_hash=hashed_pw)
            db.session.add(user)
            db.session.commit()
            print("New user created:", user)
        elif not check_password_hash(user.password_hash, password):
            print("Invalid credentials for user:", username)
            return jsonify({'error': 'Invalid credentials.'}), 401
        access_token = create_access_token(identity=str(user.id))
        print("Access token created for user:", user.id)
        return jsonify({'token': access_token, 'username': user.username}), 200
    except Exception as e:
        print("Exception in /api/login:", e)
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Internal server error'}), 500 