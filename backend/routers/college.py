from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/subjects", response_model=List[schemas.CollegeSubject])
def get_subjects(db: Session = Depends(get_db)):
    return db.query(models.CollegeSubject).all()

@router.post("/subjects", response_model=schemas.CollegeSubject)
def create_subject(subject: schemas.CollegeSubjectCreate, db: Session = Depends(get_db)):
    db_subject = models.CollegeSubject(**subject.dict())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.put("/subjects/{subject_id}", response_model=schemas.CollegeSubject)
def update_subject(subject_id: int, subject: schemas.CollegeSubjectCreate, db: Session = Depends(get_db)):
    db_subject = db.query(models.CollegeSubject).filter(models.CollegeSubject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    for key, value in subject.dict().items():
        setattr(db_subject, key, value)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.delete("/subjects/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    db_subject = db.query(models.CollegeSubject).filter(models.CollegeSubject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(db_subject)
    db.commit()
    return {"message": "Deleted"}
