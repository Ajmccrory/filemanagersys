from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from src.models.models import Case, Person, PersonFact, Organization, OrgFact, Tag
from src import db

bp = Blueprint('entities', __name__)

@bp.route('/case/<int:case_id>/entities')
def view_entities(case_id):
    filter_type = request.args.get('filter', 'all')
    people = Person.query.filter_by(case_id=case_id).all() if filter_type in ['all', 'people'] else []
    orgs = Organization.query.filter_by(case_id=case_id).all() if filter_type in ['all', 'organizations'] else []
    return render_template('entities.html', 
                         case_id=case_id,
                         people=people,
                         organizations=orgs,
                         filter_type=filter_type)

@bp.route('/case/<int:case_id>/person/add', methods=['POST'])
def add_person(case_id):
    name = request.form.get('name')
    role = request.form.get('role')
    person = Person(name=name, role=role, case_id=case_id)
    db.session.add(person)
    db.session.commit()
    return redirect(url_for('entities.view_entities', case_id=case_id))

@bp.route('/person/<int:person_id>/facts', methods=['GET', 'POST'])
def manage_person_facts(person_id):
    if request.method == 'POST':
        content = request.form.get('content')
        fact = PersonFact(content=content, person_id=person_id)
        db.session.add(fact)
        db.session.commit()
    person = Person.query.get_or_404(person_id)
    return jsonify({
        'facts': [{'id': f.id, 'content': f.content} for f in person.facts]
    })

# TODO: Similar routes for organizations...
