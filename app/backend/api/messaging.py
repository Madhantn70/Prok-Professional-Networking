from flask import Blueprint
from ..models.message import Message
from ..models.user import User
from ..extensions import db

messaging_bp = Blueprint('messaging', __name__)
 
# Routes will be implemented here 