from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from datetime import datetime
from database import Base
from models import PriorityLevel


class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(String(1000), nullable=True)
    priority = Column(Enum(PriorityLevel), default=PriorityLevel.MEDIUM)
    due_date = Column(DateTime, nullable=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
