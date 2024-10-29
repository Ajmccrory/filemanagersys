from src import db
from datetime import datetime

person_tags = db.Table('person_tags',
    db.Column('person_id', db.Integer, db.ForeignKey('person.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)

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
