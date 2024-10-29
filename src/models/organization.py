from src import db
from datetime import datetime

org_tags = db.Table('org_tags',
    db.Column('org_id', db.Integer, db.ForeignKey('organization.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)

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
