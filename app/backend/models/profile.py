from extensions import db

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bio = db.Column(db.String(300), nullable=True)
    skills = db.Column(db.String(300), nullable=True)
    location = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(32), nullable=True)
    languages = db.Column(db.String(120), nullable=True)

    user = db.relationship('User', backref=db.backref('profile', uselist=False))

    def __repr__(self):
        return f'<Profile {self.id} for User {self.user_id}>'
