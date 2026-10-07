from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time
import datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    phase: int
    category: str
    completed: bool = False
    custom: bool = False

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    class Config:
        from_attributes = True

class DailyLogBase(BaseModel):
    date: date
    hours_studied: float = 0.0
    tasks_completed: int = 0
    mood: int = 3
    energy: int = 3
    sleep_hours: float = 0.0
    water_intake: int = 0
    gym_notes: Optional[str] = None

class DailyLogCreate(DailyLogBase):
    pass

class DailyLog(DailyLogBase):
    id: int
    class Config:
        from_attributes = True

class ScheduleBlockBase(BaseModel):
    mode: str
    start_time: time
    end_time: time
    activity: str
    notes: Optional[str] = None

class ScheduleBlockCreate(ScheduleBlockBase):
    pass

class ScheduleBlock(ScheduleBlockBase):
    id: int
    class Config:
        from_attributes = True

class CollegeSubjectBase(BaseModel):
    name: str
    professor: Optional[str] = None
    exam_date: Optional[date] = None
    credit_hours: int = 3
    hours_studied: float = 0.0
    completed: bool = False

class CollegeSubjectCreate(CollegeSubjectBase):
    pass

class CollegeSubject(CollegeSubjectBase):
    id: int
    class Config:
        from_attributes = True

class ChatMessageBase(BaseModel):
    role: str
    content: str
    timestamp: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
