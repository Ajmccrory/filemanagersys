from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Association tables
person_tags = Table('person_tags', Base.metadata,
    Column('person_id', Integer, ForeignKey('person.id')),
    Column('tag_id', Integer, ForeignKey('tag.id'))
)

org_tags = Table('org_tags', Base.metadata,
    Column('org_id', Integer, ForeignKey('organization.id')),
    Column('tag_id', Integer, ForeignKey('tag.id'))
)

class Case(Base):
    __tablename__ = 'case'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    date_created = Column(DateTime, default=datetime.utcnow)
    file_path = Column(String(500))
    evidence = relationship('Evidence', backref='case', lazy=True)
    people = relationship('Person', backref='case', lazy=True)
    organizations = relationship('Organization', backref='case', lazy=True)

class Evidence(Base):
    __tablename__ = 'evidence'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    date_added = Column(DateTime, default=datetime.utcnow)
    case_id = Column(Integer, ForeignKey('case.id'), nullable=False)

class Person(Base):
    __tablename__ = 'person'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    role = Column(String(100))
    case_id = Column(Integer, ForeignKey('case.id'), nullable=False)
    date_added = Column(DateTime, default=datetime.utcnow)
    facts = relationship('PersonFact', backref='person', lazy=True, cascade='all, delete-orphan')
    tags = relationship('Tag', secondary=person_tags, backref='persons')

class PersonFact(Base):
    __tablename__ = 'person_fact'
    
    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    date_added = Column(DateTime, default=datetime.utcnow)
    person_id = Column(Integer, ForeignKey('person.id'), nullable=False)

class Organization(Base):
    __tablename__ = 'organization'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    role = Column(String(100))
    case_id = Column(Integer, ForeignKey('case.id'), nullable=False)
    date_added = Column(DateTime, default=datetime.utcnow)
    facts = relationship('OrgFact', backref='organization', lazy=True, cascade='all, delete-orphan')
    tags = relationship('Tag', secondary=org_tags, backref='organizations')

class OrgFact(Base):
    __tablename__ = 'org_fact'
    
    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    date_added = Column(DateTime, default=datetime.utcnow)
    org_id = Column(Integer, ForeignKey('organization.id'), nullable=False)

class Tag(Base):
    __tablename__ = 'tag'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)