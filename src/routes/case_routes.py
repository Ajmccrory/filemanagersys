import os
from flask import Blueprint, render_template, request, redirect, url_for, send_file
from werkzeug.utils import secure_filename
from src.models.models import Case, Evidence
from src import db

bp = Blueprint('cases', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'static', 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'xlsx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/')
def index():
    cases = Case.query.order_by(Case.date_created.desc()).all()
    return render_template('index.html', cases=cases)

@bp.route('/case/new', methods=['POST'])
def new_case():
    title = request.form.get('title')
    description = request.form.get('description')
    case = Case(title=title, description=description)
    
    if 'file' in request.files:
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            case.file_path = filename

    db.session.add(case)
    db.session.commit()
    return redirect(url_for('cases.index'))

@bp.route('/case/<int:case_id>')
def view_case(case_id):
    case = Case.query.get_or_404(case_id)
    return render_template('cases.html', case=case)

@bp.route('/case/<int:case_id>/edit', methods=['POST'])
def edit_case(case_id):
    case = Case.query.get_or_404(case_id)
    case.title = request.form.get('title', case.title)
    case.description = request.form.get('description', case.description)
    
    if 'file' in request.files:
        file = request.files['file']
        if file and allowed_file(file.filename):
            # Remove old file if it exists
            if case.file_path:
                old_file_path = os.path.join(UPLOAD_FOLDER, case.file_path)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
            
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            case.file_path = filename

    db.session.commit()
    return redirect(url_for('cases.view_case', case_id=case_id))

@bp.route('/case/<int:case_id>/delete', methods=['POST'])
def delete_case(case_id):
    case = Case.query.get_or_404(case_id)
    if case.file_path:
        file_path = os.path.join(UPLOAD_FOLDER, case.file_path)
        if os.path.exists(file_path):
            os.remove(file_path)
    db.session.delete(case)
    db.session.commit()
    return redirect(url_for('cases.index'))

@bp.route('/case/<int:case_id>/download')
def download_case_file(case_id):
    case = Case.query.get_or_404(case_id)
    if case.file_path:
        return send_file(
            os.path.join(UPLOAD_FOLDER, case.file_path),
            as_attachment=True,
            download_name=case.file_path
        )
    return redirect(url_for('cases.view_case', case_id=case_id))

