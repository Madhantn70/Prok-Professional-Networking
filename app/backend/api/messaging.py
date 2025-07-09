from flask import Blueprint
from backend.models.message import Message
from backend.models.user import User
from backend.extensions import db

messaging_bp = Blueprint('messaging', __name__)
 
# Routes will be implemented here 