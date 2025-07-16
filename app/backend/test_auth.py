#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models.user import User
from extensions import db
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token

app = create_app()

with app.app_context():
    # Create a test user if it doesn't exist
    user = User.query.filter_by(username='testuser').first()
    if not user:
        user = User(
            username='testuser',
            email='test@example.com',
            password_hash=generate_password_hash('password123')
        )
        db.session.add(user)
        db.session.commit()
        print("Created test user")
    else:
        print("Test user already exists")
    
    # Generate a token
    token = create_access_token(identity=str(user.id))
    print(f"Token: {token}")
    print(f"User ID: {user.id}")
    print(f"Username: {user.username}") 