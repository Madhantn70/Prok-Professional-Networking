import os
from datetime import timedelta

class Config:
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev')
    
    # Database
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = DATABASE_URL or 'mysql://root:Maddy%40%2313@localhost/prok_db?charset=utf8mb4'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # CORS
    CORS_HEADERS = 'Content-Type' 
    
    # File Uploads
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads', 'posts')
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4'} 