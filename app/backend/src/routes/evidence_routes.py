from functools import lru_cache
from flask import Blueprint, request, redirect, url_for, render_template, current_app
from src.models import Case, Evidence
from src import db_session

bp = Blueprint('evidence', __name__)

@lru_cache(maxsize=32)
def get_evidence(evidence_id):
    """Cached evidence retrieval"""
    return db_session.query(Evidence).get_or_404(evidence_id)

@lru_cache(maxsize=32)
def get_case_evidence(case_id):
    """Cached case evidence retrieval"""
    return db_session.query(Case).get_or_404(case_id)

@bp.route('/evidence/new/<int:case_id>', methods=['POST'])
def new_evidence(case_id):
    try:
        case = get_case_evidence(case_id)
        evidence = Evidence(
            title=request.form.get('title'),
            description=request.form.get('description'),
            case=case
        )
        
        db_session.add(evidence)
        db_session.commit()
        get_case_evidence.cache_clear()  # Clear cache after adding new evidence
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
        get_case_evidence.cache_clear()
        return redirect(url_for('cases.view_case', case_id=case_id))
    except Exception as e:
        current_app.logger.error(f"Error in delete_evidence: {str(e)}")
        db_session.rollback()
        return render_template('error.html', message="Failed to delete evidence"), 500
