from flask import Flask
from app.backend.config import Config
from app.backend.extensions import db, migrate, limiter, jwt
from flask_cors import CORS

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)
    jwt.init_app(app)
    print("JWTManager initialized for app:", app.name)
    print("JWT_SECRET_KEY:", app.config.get("JWT_SECRET_KEY"))

    # Set up CORS for frontend
    CORS(app, origins=["http://localhost:5173"])  # Adjust as needed

    # Import models inside app context for migrations
    with app.app_context():
        from app.backend.models import user
        # Import blueprints
        from app.backend.api import auth_bp
        app.register_blueprint(auth_bp)

    return app

# For CLI/legacy support
_app = None
def get_app():
    global _app
    if _app is None:
        _app = create_app()
    return _app 