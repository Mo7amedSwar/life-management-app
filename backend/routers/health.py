from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/today", response_model=schemas.DailyLog)
def get_health_today(db: Session = Depends(get_db)):
    today = date.today()
    log = db.query(models.DailyLog).filter(models.DailyLog.date == today).first()
    if not log:
        log = models.DailyLog(date=today)
        db.add(log)
        db.commit()
        db.refresh(log)
    return log

@router.post("/", response_model=schemas.DailyLog)
def update_health(log_update: schemas.DailyLogCreate, db: Session = Depends(get_db)):
    log = db.query(models.DailyLog).filter(models.DailyLog.date == log_update.date).first()
    if not log:
        log = models.DailyLog(**log_update.dict())
        db.add(log)
    else:
        log.mood = log_update.mood
        log.energy = log_update.energy
        log.sleep_hours = log_update.sleep_hours
        log.water_intake = log_update.water_intake
        log.gym_notes = log_update.gym_notes
    db.commit()
    db.refresh(log)
    return log

@router.get("/week", response_model=List[schemas.DailyLog])
def get_health_week(db: Session = Depends(get_db)):
    today = date.today()
    week_ago = today - timedelta(days=7)
    return db.query(models.DailyLog).filter(models.DailyLog.date >= week_ago).all()
