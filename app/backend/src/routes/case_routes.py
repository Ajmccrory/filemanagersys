import os
from functools import lru_cache
from flask import Blueprint, render_template, request, redirect, url_for, send_file, current_app
from werkzeug.utils import secure_filename
from sqlalchemy.exc import SQLAlchemyError
from src.models import Case, Evidence
from src import db_session

bp = Blueprint('cases', __name__)

# Constants moved to config
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'xlsx'}
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'static', 'uploads')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handle_file_upload(file, old_filepath=None):
    """Centralized file upload handling"""
    if not file or not allowed_file(file.filename):
        return None
        
    filename = secure_filename(file.filename)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    if old_filepath and os.path.exists(old_filepath):
        os.remove(old_filepath)
        
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    return filename

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

@lru_cache(maxsize=32)
def get_case(case_id):
    """Cached case retrieval"""
    return db_session.query(Case).get_or_404(case_id)

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

