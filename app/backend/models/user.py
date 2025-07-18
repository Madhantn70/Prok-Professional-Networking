from ..extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    # Profile fields
    title = db.Column(db.String(120), nullable=True)
    bio = db.Column(db.String(300), nullable=True)
    skills = db.Column(db.String(300), nullable=True)  # Comma-separated
    avatar = db.Column(db.String(300), nullable=True)
    location = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(32), nullable=True)
    languages = db.Column(db.String(120), nullable=True)  # Comma-separated
    connections = db.Column(db.Integer, default=0)
    mutual_connections = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<User {self.username}>'
