from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, jwt
from api import auth_bp, profile_bp, posts_bp, feed_bp, jobs_bp, messaging_bp
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError, WrongTokenError, RevokedTokenError, FreshTokenRequired, CSRFError
from flask_jwt_extended import exceptions as jwt_exceptions
from flask import jsonify
from flask import send_from_directory
import os

# Allow CORS from environment variable or default
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173,https://your-frontend-url.onrender.com').split(',')

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ensure upload directories exist
    import os
    uploads_root = os.path.join(os.path.dirname(app.root_path), 'uploads')
    os.makedirs(os.path.join(uploads_root, 'profile'), exist_ok=True)
    os.makedirs(os.path.join(uploads_root, 'posts'), exist_ok=True)

    db.init_app(app)
    jwt.init_app(app)
    CORS(
        app,
        origins=ALLOWED_ORIGINS,
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        max_age=3600
    )

    # Add a test route
    @app.route('/test')
    def test():
        return jsonify({'message': 'Flask app is working!'})

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(profile_bp, url_prefix="/api")
    app.register_blueprint(posts_bp, url_prefix="/api")
    app.register_blueprint(feed_bp, url_prefix="/api")
    app.register_blueprint(jobs_bp, url_prefix="/api")
    app.register_blueprint(messaging_bp, url_prefix="/api")

    # Debug: Print all registered routes
    print("=== Registered Routes ===")
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule.rule}")
    print("========================")

    # Serve uploaded post media
    @app.route('/uploads/posts/<path:filename>')
    def uploaded_file(filename):
        upload_folder = app.config['UPLOAD_FOLDER']
        return send_from_directory(upload_folder, filename)

    # Register JWT error handlers for clear error messages and CORS
    @app.errorhandler(jwt_exceptions.NoAuthorizationError)
    def handle_no_auth_error(e):
        return jsonify({'error': 'Missing or invalid authorization token.'}), 401

    @app.errorhandler(jwt_exceptions.InvalidHeaderError)
    def handle_invalid_header(e):
        return jsonify({'error': 'Invalid authorization header.'}), 422

    @app.errorhandler(jwt_exceptions.WrongTokenError)
    def handle_wrong_token(e):
        return jsonify({'error': 'Wrong token type.'}), 422

    @app.errorhandler(jwt_exceptions.RevokedTokenError)
    def handle_revoked_token(e):
        return jsonify({'error': 'Token has been revoked.'}), 401

    @app.errorhandler(jwt_exceptions.FreshTokenRequired)
    def handle_fresh_token_required(e):
        return jsonify({'error': 'Fresh token required.'}), 401

    @app.errorhandler(jwt_exceptions.CSRFError)
    def handle_csrf_error(e):
        return jsonify({'error': 'CSRF token missing or invalid.'}), 401

    return app



