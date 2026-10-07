from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/today", response_model=schemas.DailyLog)
def get_log_today(db: Session = Depends(get_db)):
    today = date.today()
    log = db.query(models.DailyLog).filter(models.DailyLog.date == today).first()
    if not log:
        log = models.DailyLog(date=today)
        db.add(log)
        db.commit()
        db.refresh(log)
    return log

@router.post("/daily", response_model=schemas.DailyLog)
def update_daily_log(log_update: schemas.DailyLogCreate, db: Session = Depends(get_db)):
    log = db.query(models.DailyLog).filter(models.DailyLog.date == log_update.date).first()
    if not log:
        log = models.DailyLog(**log_update.dict())
        db.add(log)
    else:
        for key, value in log_update.dict().items():
            setattr(log, key, value)
    db.commit()
    db.refresh(log)
    return log

@router.get("/week", response_model=List[schemas.DailyLog])
def get_log_week(db: Session = Depends(get_db)):
    today = date.today()
    week_ago = today - timedelta(days=7)
    return db.query(models.DailyLog).filter(models.DailyLog.date >= week_ago).all()

@router.get("/month", response_model=List[schemas.DailyLog])
def get_log_month(db: Session = Depends(get_db)):
    today = date.today()
    month_ago = today - timedelta(days=30)
    return db.query(models.DailyLog).filter(models.DailyLog.date >= month_ago).all()

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    logs = db.query(models.DailyLog).all()
    tasks = db.query(models.Task).all()
    
    total_hours = sum(log.hours_studied for log in logs)
    total_tasks = len(tasks)
    completed_tasks = len([t for t in tasks if t.completed])
    
    category_counts = {}
    for t in tasks:
        if t.completed:
            category_counts[t.category] = category_counts.get(t.category, 0) + 1
            
    return {
        "total_hours": total_hours,
        "completed_tasks": completed_tasks,
        "total_tasks": total_tasks,
        "category_breakdown": category_counts
    }
