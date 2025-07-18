from ..extensions import db
from datetime import datetime

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    media_url = db.Column(db.String(300), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    allow_comments = db.Column(db.Boolean, default=True, nullable=False)
    public_post = db.Column(db.Boolean, default=True, nullable=False)
    category = db.Column(db.String(100), nullable=True)
    tags = db.Column(db.String(300), nullable=True)  # Comma-separated tags
    likes_count = db.Column(db.Integer, default=0, nullable=False)
    views_count = db.Column(db.Integer, default=0, nullable=False)

    user = db.relationship('User', backref=db.backref('posts', lazy=True))

    def __repr__(self):
        return f'<Post {self.id} by User {self.user_id}>'
