import pytest
import os
import tempfile
from src import create_app, db_session
from src.models import init_db, Case, Evidence

@pytest.fixture
def app():
    # Create a temporary file to use as our database
    db_fd, db_path = tempfile.mkstemp()
    
    app = create_app('testing')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['TESTING'] = True
    
    # Create a temporary directory for uploaded files
    with tempfile.TemporaryDirectory() as temp_dir:
        app.config['UPLOAD_FOLDER'] = temp_dir
        app.static_folder = temp_dir
        
        yield app
    
    # Clean up temporary files
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def db():
    init_db()
    yield db_session
    db_session.remove()

@pytest.fixture
def sample_case(db):
    case = Case(
        title="Test Case",
        description="Test Description"
    )
    db.add(case)
    db.commit()
    return case

@pytest.fixture
def sample_evidence(db, sample_case):
    evidence = Evidence(
        title="Test Evidence",
        description="Test Evidence Description",
        case=sample_case
    )
    db.add(evidence)
    db.commit()
    return evidence