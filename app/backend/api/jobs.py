from flask import Blueprint
from backend.models.job import Job
from backend.extensions import db

jobs_bp = Blueprint('jobs', __name__)
 
# Routes will be implemented here 