from backend.extensions import db

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Add other fields as needed
