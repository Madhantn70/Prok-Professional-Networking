from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.message import Message
from models.user import User
from extensions import db

messaging_bp = Blueprint('messaging', __name__)
 
# Routes will be implemented here 