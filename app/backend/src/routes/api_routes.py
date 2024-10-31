from flask import Blueprint, jsonify, request, current_app, send_from_directory
from src.models import Case, Evidence, Person, Organization, PersonFact, Tag
from src import db_session
from werkzeug.utils import secure_filename
from datetime import datetime
import os

bp = Blueprint('api', __name__)

# Case endpoints
@bp.route('/cases', methods=['GET'])
def get_cases():
    try:
        cases = db_session.query(Case).order_by(Case.date_created.desc()).all()
        return jsonify({
            'cases': [{
                'id': case.id,
                'title': case.title,
                'description': case.description,
                'date_created': case.date_created.isoformat(),
                'file_path': case.file_path
            } for case in cases]
        })
    except Exception as e:
        current_app.logger.error(f"Error in get_cases: {str(e)}")
        return jsonify({'error': 'Failed to fetch cases'}), 500

@bp.route('/cases/new', methods=['POST'])
def create_case():
    try:
        data = request.form
        file = request.files.get('file')
        
        case = Case(
            title=data['title'],
            description=data.get('description', '')
        )
        
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join('uploads', filename)
            file.save(os.path.join(current_app.static_folder, file_path))
            case.file_path = file_path
            
        db_session.add(case)
        db_session.commit()
        
        return jsonify({
            'message': 'Case created successfully',
            'case': {
                'id': case.id,
                'title': case.title,
                'description': case.description,
                'date_created': case.date_created.isoformat(),
                'file_path': case.file_path
            }
        }), 201
    except Exception as e:
        current_app.logger.error(f"Error in create_case: {str(e)}")
        db_session.rollback()
        return jsonify({'error': 'Failed to create case'}), 500

@bp.route('/cases/<int:case_id>', methods=['PUT'])
def update_case(case_id):
    try:
        case = db_session.query(Case).get_or_404(case_id)
        data = request.form
        file = request.files.get('file')
        
        case.title = data.get('title', case.title)
        case.description = data.get('description', case.description)
        
        if file:
            # Delete old file if it exists
            if case.file_path:
                old_file_path = os.path.join(current_app.static_folder, case.file_path)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
            
            filename = secure_filename(file.filename)
            file_path = os.path.join('uploads', filename)
            file.save(os.path.join(current_app.static_folder, file_path))
            case.file_path = file_path
        
        db_session.commit()
        return jsonify({
            'message': 'Case updated successfully',
            'case': {
                'id': case.id,
                'title': case.title,
                'description': case.description,
                'date_created': case.date_created.isoformat(),
                'file_path': case.file_path
            }
        })
    except Exception as e:
        current_app.logger.error(f"Error in update_case: {str(e)}")
        db_session.rollback()
        return jsonify({'error': 'Failed to update case'}), 500

@bp.route('/cases/<int:case_id>', methods=['DELETE'])
def delete_case(case_id):
    try:
        case = db_session.query(Case).get_or_404(case_id)
        
        # Delete associated file if it exists
        if case.file_path:
            file_path = os.path.join(current_app.static_folder, case.file_path)
            if os.path.exists(file_path):
                os.remove(file_path)
        
        db_session.delete(case)
        db_session.commit()
        return jsonify({'message': 'Case deleted successfully'})
    except Exception as e:
        current_app.logger.error(f"Error in delete_case: {str(e)}")
        db_session.rollback()
        return jsonify({'error': 'Failed to delete case'}), 500

# Evidence endpoints
@bp.route('/cases/<int:case_id>/evidence', methods=['POST'])
def create_evidence(case_id):
    try:
        data = request.get_json()
        evidence = Evidence(
            title=data['title'],
            description=data.get('description', ''),
            case_id=case_id,
            date_added=datetime.utcnow()
        )
        db_session.add(evidence)
        db_session.commit()
        
        return jsonify({
            'message': 'Evidence created successfully',
            'evidence': {
                'id': evidence.id,
                'title': evidence.title,
                'description': evidence.description,
                'date_added': evidence.date_added.isoformat(),
                'case_id': evidence.case_id
            }
        }), 201
    except Exception as e:
        current_app.logger.error(f"Error in create_evidence: {str(e)}")
        db_session.rollback()
        return jsonify({'error': 'Failed to create evidence'}), 500

@bp.route('/evidence/<int:evidence_id>', methods=['PUT'])
def update_evidence(evidence_id):
    try:
        evidence = db_session.query(Evidence).get_or_404(evidence_id)
        data = request.get_json()
        
        evidence.title = data.get('title', evidence.title)
        evidence.description = data.get('description', evidence.description)
        
        db_session.commit()
        return jsonify({
            'message': 'Evidence updated successfully',
            'evidence': {
                'id': evidence.id,
                'title': evidence.title,
                'description': evidence.description,
                'date_added': evidence.date_added.isoformat(),
                'case_id': evidence.case_id
            }
        })
    except Exception as e:
        current_app.logger.error(f"Error in update_evidence: {str(e)}")
        db_session.rollback()
        return jsonify({'error': 'Failed to update evidence'}), 500

