from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from src.config import Config
import os
from src.models.models import Case

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize database
    db.init_app(app)

    # Register blueprints
    from src.routes import case_routes, evidence_routes, download_routes, entities_routes
    app.register_blueprint(case_routes.bp)
    app.register_blueprint(evidence_routes.bp)
    app.register_blueprint(download_routes.bp)
    app.register_blueprint(entities_routes.bp)

    # Create upload directory if it doesn't exist
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Add template context processor
    @app.context_processor
    def utility_processor():
        def get_cases():
            return Case.query.order_by(Case.date_created.desc()).all()
        return dict(get_cases=get_cases)

    # Create or update database
    with app.app_context():
        db.create_all()

    return app
