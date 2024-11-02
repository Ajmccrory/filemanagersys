from functools import lru_cache
from flask import (
    Blueprint, render_template, request, redirect, url_for, 
    send_file, current_app, abort, jsonify, send_from_directory
)
from werkzeug.utils import secure_filename
from sqlalchemy.exc import SQLAlchemyError
from src.models import Case, Evidence, Person, Organization, PersonFact
from src import db_session
import os
from datetime import datetime

bp = Blueprint('main', __name__)

#### CONS ####
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'xlsx'}
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'static', 'uploads')
INSTALLER_BASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'installers'))

#### UTIL ####
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handle_file_upload(file, old_filepath=None):
    if not file or not allowed_file(file.filename):
        return None
    filename = secure_filename(file.filename)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    if old_filepath and os.path.exists(old_filepath):
        os.remove(old_filepath)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    return filename

#### CACHE DECORATORS ####
@lru_cache(maxsize=32)
def get_case(case_id):
    return db_session.query(Case).get_or_404(case_id)

@lru_cache(maxsize=32)
def get_evidence(evidence_id):
    return db_session.query(Evidence).get_or_404(evidence_id)

@lru_cache(maxsize=32)
def get_filtered_entities(case_id, filter_type):
    people = (db_session.query(Person)
             .filter_by(case_id=case_id)
             .all() if filter_type in ['all', 'people'] else [])
    orgs = (db_session.query(Organization)
            .filter_by(case_id=case_id)
            .all() if filter_type in ['all', 'organizations'] else [])
    return people, orgs

@lru_cache(maxsize=2)
def get_installer_path(platform):
    platform_paths = {
        'windows': os.path.join(INSTALLER_BASE_PATH, 'windows', 'CaseMapLite_Setup.exe'),
        'mac': os.path.join(INSTALLER_BASE_PATH, 'mac', 'create_dmg.sh')
    }
    return platform_paths.get(platform)

#### CASE ROUTES ####
@bp.route('/')
def index():
    try:
        cases = db_session.query(Case).order_by(Case.date_created.desc()).all()
        return render_template('index.html', cases=cases)
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error in index: {str(e)}")
        if db_session:
            db_session.rollback()
        return render_template('error.html', message="Failed to load cases"), 500
    except Exception as e:
        current_app.logger.error(f"Error in index: {str(e)}")
        return render_template('error.html', message="An unexpected error occurred"), 500

@bp.route('/case/new', methods=['POST'])
def new_case():
    try:
        case = Case(
            title=request.form.get('title'),
            description=request.form.get('description')
        )
        
        if 'file' in request.files:
            filename = handle_file_upload(request.files['file'])
            if filename:
                case.file_path = filename

        db_session.add(case)
        db_session.commit()
        return redirect(url_for('cases.index'))
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error in new_case: {str(e)}")
        if db_session:
            db_session.rollback()
        return render_template('error.html', message="Failed to create case"), 500
    except Exception as e:
        current_app.logger.error(f"Error in new_case: {str(e)}")
        return render_template('error.html', message="An unexpected error occurred"), 500

@bp.route('/case/<int:case_id>')
def view_case(case_id):
    try:
        case = get_case(case_id)
        return render_template('cases.html', case=case)
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error in view_case: {str(e)}")
        if db_session:
            db_session.rollback()
        return render_template('error.html', message="Case not found"), 404
    except Exception as e:
        current_app.logger.error(f"Error in view_case: {str(e)}")
        return render_template('error.html', message="An unexpected error occurred"), 500

@bp.route('/case/<int:case_id>/edit', methods=['POST'])
def edit_case(case_id):
    try:
        case = get_case(case_id)
        case.title = request.form.get('title', case.title)
        case.description = request.form.get('description', case.description)
        
        if 'file' in request.files:
            old_path = os.path.join(UPLOAD_FOLDER, case.file_path) if case.file_path else None
            filename = handle_file_upload(request.files['file'], old_path)
            if filename:
                case.file_path = filename

        db_session.commit()
        get_case.cache_clear()  # Clear cache after edit
        return redirect(url_for('cases.view_case', case_id=case_id))
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error in edit_case: {str(e)}")
        if db_session:
            db_session.rollback()
        return render_template('error.html', message="Failed to edit case"), 500
    except Exception as e:
        current_app.logger.error(f"Error in edit_case: {str(e)}")
        return render_template('error.html', message="An unexpected error occurred"), 500

@bp.route('/case/<int:case_id>/delete', methods=['POST'])
def delete_case(case_id):
    case = db_session.query(Case).get_or_404(case_id)
    if case.file_path:
        file_path = os.path.join(UPLOAD_FOLDER, case.file_path)
        if os.path.exists(file_path):
            os.remove(file_path)
    db_session.delete(case)
    db_session.commit()
    return redirect(url_for('cases.index'))

@bp.route('/case/<int:case_id>/download')
def download_case_file(case_id):
    case = db_session.query(Case).get_or_404(case_id)
    if case.file_path:
        return send_file(
            os.path.join(UPLOAD_FOLDER, case.file_path),
            as_attachment=True,
            download_name=case.file_path
        )
    return redirect(url_for('cases.view_case', case_id=case_id))

#### EVIDENCE ROUTES ####
@bp.route('/evidence/new/<int:case_id>', methods=['POST'])
def new_evidence(case_id):
    try:
        case = get_evidence(case_id)
        evidence = Evidence(
            title=request.form.get('title'),
            description=request.form.get('description'),
            case=case
        )
        
        db_session.add(evidence)
        db_session.commit()
        get_evidence.cache_clear()  # Clear cache after adding new evidence
        return redirect(url_for('cases.view_case', case_id=case_id))
    except Exception as e:
        current_app.logger.error(f"Error in new_evidence: {str(e)}")
        db_session.rollback()
        return render_template('error.html', message="Failed to create evidence"), 500

@bp.route('/evidence/<int:evidence_id>')
def view_evidence(evidence_id):
    try:
        evidence = get_evidence(evidence_id)
        return render_template('evidence.html', evidence=evidence)
    except Exception as e:
        current_app.logger.error(f"Error in view_evidence: {str(e)}")
        return render_template('error.html', message="Evidence not found"), 404

@bp.route('/evidence/<int:evidence_id>/edit', methods=['POST'])
def edit_evidence(evidence_id):
    try:
        evidence = get_evidence(evidence_id)
        evidence.title = request.form.get('title', evidence.title)
        evidence.description = request.form.get('description', evidence.description)
        
        db_session.commit()
        get_evidence.cache_clear()  # Clear cache after edit
        return redirect(url_for('evidence.view_evidence', evidence_id=evidence_id))
    except Exception as e:
        current_app.logger.error(f"Error in edit_evidence: {str(e)}")
        db_session.rollback()
        return render_template('error.html', message="Failed to edit evidence"), 500

@bp.route('/evidence/<int:evidence_id>/delete', methods=['POST'])
def delete_evidence(evidence_id):
    try:
        evidence = get_evidence(evidence_id)
        case_id = evidence.case_id
        db_session.delete(evidence)
        db_session.commit()
        get_evidence.cache_clear()
        get_evidence.cache_clear()
        return redirect(url_for('cases.view_case', case_id=case_id))
    except Exception as e:
        current_app.logger.error(f"Error in delete_evidence: {str(e)}")
        db_session.rollback()
        return render_template('error.html', message="Failed to delete evidence"), 500

#### ENTITY ROUTES ####
@bp.route('/case/<int:case_id>/entities')
def view_entities(case_id):
    try:
        filter_type = request.args.get('filter', 'all')
        people, orgs = get_filtered_entities(case_id, filter_type)
        
        return render_template('entities.html',
                             case_id=case_id,
                             people=people,
                             organizations=orgs,
                             filter_type=filter_type)
    except Exception as e:
        current_app.logger.error(f"Error in view_entities: {str(e)}")
        return render_template('error.html', message="Failed to load entities"), 500

@bp.route('/case/<int:case_id>/person/add', methods=['POST'])
def add_person(case_id):
    name = request.form.get('name')
    role = request.form.get('role')
    person = Person(name=name, role=role, case_id=case_id)
    db_session.add(person)
    db_session.commit()
    return redirect(url_for('entities.view_entities', case_id=case_id))

@bp.route('/person/<int:person_id>/facts', methods=['GET', 'POST'])
def manage_person_facts(person_id):
    if request.method == 'POST':
        content = request.form.get('content')
        fact = PersonFact(content=content, person_id=person_id)
        db_session.add(fact)
        db_session.commit()
    person = db_session.query(Person).get_or_404(person_id)
    return jsonify({
        'facts': [{'id': f.id, 'content': f.content} for f in person.facts]
    })

##### DOWNLOAD ROUTES ####
@bp.route('/download', methods=["GET"])
def download_page():
    try:
        windows_available = get_installer_path('windows')
        mac_available = get_installer_path('mac')
        return render_template('download.html', 
                             windows_available=windows_available,
                             mac_available=mac_available)
    except Exception as e:
        current_app.logger.error(f"Error in download_page: {str(e)}")
        return render_template('error.html', message="Failed to load download page"), 500

@bp.route('/download/<platform>', methods=['GET'])
def download_installer(platform):
    try:
        if platform not in ['windows', 'mac'] or not get_installer_path(platform):
            abort(404)
        installer_dir = os.path.join(INSTALLER_BASE_PATH, platform)
        filename = 'CaseMapLite_Setup.exe' if platform == 'windows' else 'create_dmg.sh'
        return send_from_directory(directory=installer_dir, path=filename, as_attachment=True)
    except Exception as e:
        current_app.logger.error(f"Error in download_{platform}: {str(e)}")
        return render_template('error.html', message=f"Failed to download {platform} installer"), 500

#### API ROUTES ####
@bp.route('/api/cases', methods=['GET'])
def api_get_cases():
    cases = db_session.query(Case).all()
    return jsonify([{
        'id': case.id,
        'title': case.title,
        'description': case.description,
        'created_at': case.created_at.isoformat() if case.created_at else None
    } for case in cases])

@bp.route('/api/case/<int:case_id>', methods=['GET'])
def api_get_case(case_id):
    case = get_case(case_id)
    return jsonify({
        'id': case.id,
        'title': case.title,
        'description': case.description,
        'created_at': case.created_at.isoformat() if case.created_at else None,
        'evidence': [{
            'id': e.id,
            'title': e.title,
            'description': e.description
        } for e in case.evidence]
    })

@bp.route('/api/case/<int:case_id>/entities', methods=['GET'])
def api_get_entities(case_id):
    filter_type = request.args.get('type', 'all')
    people, organizations = get_filtered_entities(case_id, filter_type)
    
    return jsonify({
        'people': [{
            'id': p.id,
            'name': p.name,
            'role': p.role
        } for p in people],
        'organizations': [{
            'id': o.id,
            'name': o.name,
            'type': o.type
        } for o in organizations]
    })