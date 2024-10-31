import json
import os
import pytest
from io import BytesIO

def test_get_cases_empty(client):
    response = client.get('/api/cases')
    assert response.status_code == 200
    data = response.get_json()
    assert data['cases'] == []

def test_get_cases(client, sample_case):
    response = client.get('/api/cases')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['cases']) == 1
    assert data['cases'][0]['title'] == "Test Case"
    assert data['cases'][0]['description'] == "Test Description"

def test_create_case_without_file(client):
    data = {
        'title': 'New Case',
        'description': 'New Description'
    }
    response = client.post('/api/cases/new', data=data)
    assert response.status_code == 201
    
    data = response.get_json()
    assert data['case']['title'] == 'New Case'
    assert data['case']['description'] == 'New Description'
    assert data['case']['file_path'] is None

def test_create_case_with_file(client):
    data = {
        'title': 'Case with File',
        'description': 'Description with File'
    }
    file_content = b'Test file content'
    data['file'] = (BytesIO(file_content), 'test.txt')
    
    response = client.post('/api/cases/new', data=data, content_type='multipart/form-data')
    assert response.status_code == 201
    
    data = response.get_json()
    assert data['case']['title'] == 'Case with File'
    assert data['case']['file_path'] is not None
    assert data['case']['file_path'].startswith('uploads/')

def test_update_case(client, sample_case):
    data = {
        'title': 'Updated Case',
        'description': 'Updated Description'
    }
    response = client.put(f'/api/cases/{sample_case.id}', data=data)
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['case']['title'] == 'Updated Case'
    assert data['case']['description'] == 'Updated Description'

def test_update_case_with_file(client, sample_case):
    data = {
        'title': 'Updated Case with File'
    }
    file_content = b'Updated file content'
    data['file'] = (BytesIO(file_content), 'updated.txt')
    
    response = client.put(
        f'/api/cases/{sample_case.id}', 
        data=data,
        content_type='multipart/form-data'
    )
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['case']['file_path'] is not None
    assert 'updated.txt' in data['case']['file_path']

def test_delete_case(client, sample_case):
    # First verify case exists
    response = client.get('/api/cases')
    assert len(response.get_json()['cases']) == 1
    
    # Delete the case
    response = client.delete(f'/api/cases/{sample_case.id}')
    assert response.status_code == 200
    
    # Verify case was deleted
    response = client.get('/api/cases')
    assert len(response.get_json()['cases']) == 0

def test_delete_case_with_file(client, sample_case):
    # Add a file to the case
    file_content = b'Test file content'
    data = {'file': (BytesIO(file_content), 'test.txt')}
    client.put(
        f'/api/cases/{sample_case.id}',
        data=data,
        content_type='multipart/form-data'
    )
    
    # Get the file path
    response = client.get('/api/cases')
    file_path = response.get_json()['cases'][0]['file_path']
    full_path = os.path.join(client.application.static_folder, file_path)
    
    # Delete the case
    response = client.delete(f'/api/cases/{sample_case.id}')
    assert response.status_code == 200
    
    # Verify file was deleted
    assert not os.path.exists(full_path)

def test_create_evidence(client, sample_case):
    data = {
        'title': 'New Evidence',
        'description': 'Evidence Description'
    }
    response = client.post(
        f'/api/cases/{sample_case.id}/evidence',
        json=data
    )
    assert response.status_code == 201
    
    data = response.get_json()
    assert data['evidence']['title'] == 'New Evidence'
    assert data['evidence']['description'] == 'Evidence Description'
    assert data['evidence']['case_id'] == sample_case.id

def test_update_evidence(client, sample_evidence):
    data = {
        'title': 'Updated Evidence',
        'description': 'Updated Evidence Description'
    }
    response = client.put(
        f'/api/evidence/{sample_evidence.id}',
        json=data
    )
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['evidence']['title'] == 'Updated Evidence'
    assert data['evidence']['description'] == 'Updated Evidence Description'

def test_get_case_evidence(client, sample_case, sample_evidence):
    response = client.get(f'/api/cases/{sample_case.id}/evidence')
    assert response.status_code == 200
    
    data = response.get_json()
    assert len(data['evidence']) == 1
    assert data['evidence'][0]['title'] == sample_evidence.title
    assert data['evidence'][0]['case_id'] == sample_case.id

# Error case tests
def test_create_case_missing_title(client):
    data = {'description': 'Description only'}
    response = client.post('/api/cases/new', data=data)
    assert response.status_code == 500

def test_update_nonexistent_case(client):
    data = {'title': 'Updated Title'}
    response = client.put('/api/cases/99999', data=data)
    assert response.status_code == 404

def test_delete_nonexistent_case(client):
    response = client.delete('/api/cases/99999')
    assert response.status_code == 404

def test_create_evidence_invalid_case(client):
    data = {
        'title': 'New Evidence',
        'description': 'Description'
    }
    response = client.post('/api/cases/99999/evidence', json=data)
    assert response.status_code == 404

def test_update_nonexistent_evidence(client):
    data = {'title': 'Updated Evidence'}
    response = client.put('/api/evidence/99999', json=data)
    assert response.status_code == 404