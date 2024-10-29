from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from src.config import Config
import os

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize database
    db.init_app(app)

    # Register blueprints
    from src.routes import case_routes, evidence_routes
    app.register_blueprint(case_routes.bp)
    app.register_blueprint(evidence_routes.bp)

    # Ensure upload directory exists
    if not os.path.exists('src/static/uploads'):
        os.makedirs('src/static/uploads')

    # Create or update database
    with app.app_context():
        # Drop all tables if they exist
        db.drop_all()
        # Create all tables with current schema
        db.create_all()

    # Add this context processor
    @app.context_processor
    def utility_processor():
        def get_cases():
            from src.models.case import Case
            return Case.query.order_by(Case.date_created.desc()).all()
        return dict(get_cases=get_cases)

    return app
