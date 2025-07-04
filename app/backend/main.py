from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from app.backend.config import Config
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import models
from app.backend.app import create_app
from app.backend.extensions import db
from app.backend.models.user import User

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True) 