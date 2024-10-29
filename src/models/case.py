from datetime import datetime
from src import db

class Case(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    file_path = db.Column(db.String(500))  # Store path to uploaded file
    evidence = db.relationship('Evidence', backref='case', lazy=True)
    people = db.relationship('Person', backref='case', lazy=True)
    organizations = db.relationship('Organization', backref='case', lazy=True)
