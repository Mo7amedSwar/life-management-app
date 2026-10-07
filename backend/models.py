from sqlalchemy import Boolean, Column, Integer, String, Date, Float, Text
from .database import Base
import datetime


class Task(Base):
    __tablename__ = "tasks"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String(500), nullable=False, index=True)
    description = Column(Text, nullable=True)
    phase       = Column(Integer, nullable=False)          # 0–5
    category    = Column(String(50), nullable=False)       # DevOps | AI/ML | Business | College
    completed   = Column(Boolean, default=False, nullable=False)
    custom      = Column(Boolean, default=False, nullable=False)


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id             = Column(Integer, primary_key=True, index=True)
    date           = Column(Date, unique=True, index=True, nullable=False)
    hours_studied  = Column(Float, default=0.0)
    tasks_completed = Column(Integer, default=0)
    mood           = Column(Integer, default=3)   # 1–5
    energy         = Column(Integer, default=3)   # 1–5
    sleep_hours    = Column(Float, default=0.0)
    water_intake   = Column(Integer, default=0)   # glasses
    gym_notes      = Column(Text, nullable=True)


class CollegeSubject(Base):
    __tablename__ = "college_subjects"

    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(200), nullable=False, index=True)
    professor     = Column(String(200), nullable=True)
    exam_date     = Column(Date, nullable=True)
    credit_hours  = Column(Integer, default=3)
    hours_studied = Column(Float, default=0.0)
    completed     = Column(Boolean, default=False)
    notes         = Column(Text, nullable=True)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id        = Column(Integer, primary_key=True, index=True)
    role      = Column(String(10), nullable=False)   # "user" | "model"
    content   = Column(Text, nullable=False)
    timestamp = Column(String(30), nullable=True)
