from flask import Blueprint
from models.job import Job
from models.user import User
from extensions import db

jobs_bp = Blueprint('jobs', __name__)
 
# Routes will be implemented here 