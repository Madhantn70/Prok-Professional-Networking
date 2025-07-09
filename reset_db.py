import sys
sys.path.insert(0, './app/backend')
from app.backend.app import create_app
from app.backend.extensions import db
from app.backend.models.user import User

app = create_app()
with app.app_context():
    db.drop_all()
    db.create_all()
print('Database reset complete.') 