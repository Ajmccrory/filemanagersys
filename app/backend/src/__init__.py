from flask import Flask
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from src.config import Config
import os

# Create database engine and session
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
db_session = scoped_session(sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
))

class CaseMapApp:
    def __init__(self):
        self.app = None

    def init_db(self):
        """Initialize database connection"""
        # Import models and initialize
        from src.models import Base
        Base.metadata.create_all(bind=engine)

    def get_cases(self):
        """Helper function to get all cases for the menu"""
        from src.models import Case
        return db_session.query(Case).order_by(Case.date_created.desc()).all()

    def create_app(self, config_class=Config):
        """Create and configure the Flask application"""
        self.app = Flask(__name__)
        self.app.config.from_object(config_class)

        # Initialize database
        self.init_db()

        # Add session cleanup
        @self.app.teardown_appcontext
        def shutdown_session(exception=None):
            db_session.remove()

        # Register context processor for cases
        @self.app.context_processor
        def utility_processor():
            return {
                'get_cases': self.get_cases
            }

        # Register consolidated blueprint
        from src.routes.routes import bp
        self.app.register_blueprint(bp)

        # Ensure upload directory exists
        uploads_dir = os.path.join(self.app.root_path, 'static', 'uploads')
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)

        return self.app

# Create application instance
app_instance = CaseMapApp()

# Factory function for creating the app
def create_app(config_class=Config):
    return app_instance.create_app(config_class)

# Make session available for imports
__all__ = ['create_app', 'db_session']
