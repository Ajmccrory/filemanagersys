from src.models import Case, Evidence, Person, Organization

def test_case_creation(db):
    case = Case(title="Test Case", description="Test Description")
    db.add(case)
    db.commit()
    
    assert case.id is not None
    assert case.title == "Test Case"
    assert case.description == "Test Description"

def test_evidence_creation(db, sample_case):
    evidence = Evidence(
        title="Test Evidence",
        description="Test Description",
        case=sample_case
    )
    db.add(evidence)
    db.commit()
    
    assert evidence.id is not None
    assert evidence.case_id == sample_case.id