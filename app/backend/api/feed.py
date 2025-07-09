from flask import Blueprint
from backend.models.post import Post
from backend.models.user import User
from backend.extensions import db

feed_bp = Blueprint('feed', __name__)
 
# Routes will be implemented here 