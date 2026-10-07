from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/{mode}", response_model=List[schemas.ScheduleBlock])
def get_schedule(mode: str, db: Session = Depends(get_db)):
    blocks = db.query(models.ScheduleBlock).filter(models.ScheduleBlock.mode == mode).all()
    return blocks

@router.put("/{mode}", response_model=List[schemas.ScheduleBlock])
def update_schedule(mode: str, blocks: List[schemas.ScheduleBlockCreate], db: Session = Depends(get_db)):
    # Delete old
    db.query(models.ScheduleBlock).filter(models.ScheduleBlock.mode == mode).delete()
    
    # Add new
    new_blocks = [models.ScheduleBlock(**block.dict()) for block in blocks]
    db.add_all(new_blocks)
    db.commit()
    
    return db.query(models.ScheduleBlock).filter(models.ScheduleBlock.mode == mode).all()
