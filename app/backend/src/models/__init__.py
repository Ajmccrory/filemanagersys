from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

# Import all models
from .models import Case, Evidence, Person, PersonFact, Organization, OrgFact, Tag

def init_db(engine):
    """Initialize the database, creating all tables"""
    Base.metadata.create_all(bind=engine)

# Make models available at package level
__all__ = ['Case', 'Evidence', 'Person', 'PersonFact', 
           'Organization', 'OrgFact', 'Tag', 'init_db']
