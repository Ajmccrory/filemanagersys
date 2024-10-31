from functools import lru_cache
from flask import Blueprint, render_template, request, jsonify, redirect, url_for, current_app
from src.models import Person, PersonFact, Organization
from src import db_session

bp = Blueprint('entities', __name__)

@lru_cache(maxsize=32)
def get_filtered_entities(case_id, filter_type):
    """Cached entity retrieval"""
    people = (db_session.query(Person)
             .filter_by(case_id=case_id)
             .all() if filter_type in ['all', 'people'] else [])
             
    orgs = (db_session.query(Organization)
            .filter_by(case_id=case_id)
            .all() if filter_type in ['all', 'organizations'] else [])
            
    return people, orgs

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

# TODO: Similar routes for organizations...
