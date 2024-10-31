from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Association tables
person_tags = db.Table('person_tags',
    db.Column('person_id', db.Integer, db.ForeignKey('person.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)

org_tags = db.Table('org_tags',
    db.Column('org_id', db.Integer, db.ForeignKey('organization.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)

class Case(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    file_path = db.Column(db.String(500))
    evidence = db.relationship('Evidence', backref='case', lazy=True)
    people = db.relationship('Person', backref='case', lazy=True)
    organizations = db.relationship('Organization', backref='case', lazy=True)

class Evidence(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    case_id = db.Column(db.Integer, db.ForeignKey('case.id'), nullable=False)

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(100))
    case_id = db.Column(db.Integer, db.ForeignKey('case.id'), nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    facts = db.relationship('PersonFact', backref='person', lazy=True, cascade='all, delete-orphan')
    tags = db.relationship('Tag', secondary=person_tags, backref=db.backref('persons', lazy=True))

class PersonFact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    person_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)

class Organization(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(100))
    case_id = db.Column(db.Integer, db.ForeignKey('case.id'), nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    facts = db.relationship('OrgFact', backref='organization', lazy=True, cascade='all, delete-orphan')
    tags = db.relationship('Tag', secondary=org_tags, backref=db.backref('organizations', lazy=True))

class OrgFact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    org_id = db.Column(db.Integer, db.ForeignKey('organization.id'), nullable=False)

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True) 