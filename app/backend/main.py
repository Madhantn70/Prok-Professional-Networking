from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import models
from app import create_app
from extensions import db
from models.user import User

app = create_app()

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'resetdb':
        with app.app_context():
            db.drop_all()
            db.create_all()
        print('Database reset complete.')
    else:
        with app.app_context():
            db.create_all()
        app.run(debug=True, port=5050, host="0.0.0.0") 