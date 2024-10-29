from flask import Blueprint, request, redirect, url_for, render_template
from src.models.case import Case
from src.models.evidence import Evidence
from src import db

bp = Blueprint('evidence', __name__)

@bp.route('/evidence/new/<int:case_id>', methods=['POST'])
def new_evidence(case_id):
    case = Case.query.get_or_404(case_id)
    title = request.form.get('title')
    description = request.form.get('description')
    evidence = Evidence(title=title, description=description, case=case)
    db.session.add(evidence)
    db.session.commit()
    return redirect(url_for('cases.view_case', case_id=case_id))

@bp.route('/evidence/<int:evidence_id>')
def view_evidence(evidence_id):
    evidence = Evidence.query.get_or_404(evidence_id)
    return render_template('evidence.html', evidence=evidence)
