from backend.extensions import db

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Add other fields as needed
