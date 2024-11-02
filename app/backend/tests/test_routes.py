import pytest
import os
import sys
from app.backend.src import create_app
from app.backend.src.models import Case, Evidence, Person, Organization
from app.backend.src import db_session

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def db():
    db_session.create_all()
    yield db_session
    db_session.remove()
    db_session.drop_all()

def test_index(client):
    response = client.get('/')
    assert response.status_code == 200

def test_new_case(client, db):
    data = {
        'title': 'Test Case',
        'description': 'Test Description'
    }
    response = client.post('/case/new', data=data)
    assert response.status_code == 302
    assert Case.query.count() == 1

def test_view_case(client, db):
    case = Case(title='Test Case', description='Test Description')
    db.add(case)
    db.commit()
    
    response = client.get(f'/case/{case.id}')
    assert response.status_code == 200

def test_edit_case(client, db):
    case = Case(title='Test Case', description='Test Description')
    db.add(case)
    db.commit()
    
    data = {
        'title': 'Updated Title',
        'description': 'Updated Description'
    }
    response = client.post(f'/case/{case.id}/edit', data=data)
    assert response.status_code == 302
    
    updated_case = Case.query.get(case.id)
    assert updated_case.title == 'Updated Title'

def test_delete_case(client, db):
    case = Case(title='Test Case', description='Test Description')
    db.add(case)
    db.commit()
    
    response = client.post(f'/case/{case.id}/delete')
    assert response.status_code == 302
    assert Case.query.count() == 0

def test_new_evidence(client, db):
    case = Case(title='Test Case')
    db.add(case)
    db.commit()
    
    data = {
        'title': 'Test Evidence',
        'description': 'Test Evidence Description'
    }
    response = client.post(f'/evidence/new/{case.id}', data=data)
    assert response.status_code == 302
    assert Evidence.query.count() == 1

def test_view_entities(client, db):
    case = Case(title='Test Case')
    db.add(case)
    db.commit()
    
    response = client.get(f'/case/{case.id}/entities')
    assert response.status_code == 200

def test_add_person(client, db):
    case = Case(title='Test Case')
    db.add(case)
    db.commit()
    
    data = {
        'name': 'Test Person',
        'role': 'Test Role'
    }
    response = client.post(f'/case/{case.id}/person/add', data=data)
    assert response.status_code == 302
    assert Person.query.count() == 1

def test_download_page(client):
    response = client.get('/download')
    assert response.status_code == 200

def test_download_installer_invalid_platform(client):
    response = client.get('/download/invalid')
    assert response.status_code == 404 

def test_api_get_cases(client, db):
    # Create test cases
    case1 = Case(title='Test Case 1', description='Description 1')
    case2 = Case(title='Test Case 2', description='Description 2')
    db.add_all([case1, case2])
    db.commit()

    response = client.get('/api/cases')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 2
    assert data[0]['title'] == 'Test Case 1'
    assert data[1]['title'] == 'Test Case 2'

def test_api_get_case(client, db):
    # Create test case with evidence
    case = Case(title='Test Case', description='Description')
    evidence = Evidence(title='Test Evidence', description='Evidence Description', case=case)
    db.add_all([case, evidence])
    db.commit()

    response = client.get(f'/api/case/{case.id}')
    assert response.status_code == 200
    data = response.get_json()
    assert data['title'] == 'Test Case'
    assert len(data['evidence']) == 1
    assert data['evidence'][0]['title'] == 'Test Evidence'

def test_api_get_entities(client, db):
    # Create test case with entities
    case = Case(title='Test Case')
    person = Person(name='Test Person', role='Test Role', case=case)
    org = Organization(name='Test Org', type='Company', case=case)
    db.add_all([case, person, org])
    db.commit()

    # Test all entities
    response = client.get(f'/api/case/{case.id}/entities')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['people']) == 1
    assert len(data['organizations']) == 1
    assert data['people'][0]['name'] == 'Test Person'
    assert data['organizations'][0]['name'] == 'Test Org'

    # Test filtered entities (people only)
    response = client.get(f'/api/case/{case.id}/entities?type=people')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['people']) == 1
    assert len(data['organizations']) == 0