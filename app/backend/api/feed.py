from flask import Blueprint
from ..models.post import Post
from ..models.user import User
from ..extensions import db

feed_bp = Blueprint('feed', __name__)
 
# Routes will be implemented here 