from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import engine, get_db, Base
from models import Task, TaskCreate, TaskUpdate, PriorityLevel
from task_model import TaskModel

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Friday Assistant API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============= Task Endpoints =============

@app.get("/api/tasks", response_model=List[Task])
def get_tasks(
    db: Session = Depends(get_db),
    completed: bool = Query(None),
    priority: PriorityLevel = Query(None),
    skip: int = Query(0),
    limit: int = Query(10)
):
    """Get all tasks with optional filtering by completion status and priority."""
    query = db.query(TaskModel)
    
    if completed is not None:
        query = query.filter(TaskModel.completed == completed)
    
    if priority is not None:
        query = query.filter(TaskModel.priority == priority)
    
    tasks = query.offset(skip).limit(limit).all()
    return tasks


@app.get("/api/tasks/{task_id}", response_model=Task)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Get a specific task by ID."""
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.post("/api/tasks", response_model=Task)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task."""
    db_task = TaskModel(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@app.put("/api/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    """Update an existing task."""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task


@app.patch("/api/tasks/{task_id}/complete", response_model=Task)
def complete_task(task_id: int, db: Session = Depends(get_db)):
    """Mark a task as complete."""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.completed = True
    db_task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    return db_task


@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task."""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}


@app.get("/api/tasks/statistics/summary")
def get_task_summary(db: Session = Depends(get_db)):
    """Get task statistics."""
    total = db.query(TaskModel).count()
    completed = db.query(TaskModel).filter(TaskModel.completed == True).count()
    pending = total - completed
    
    by_priority = {}
    for priority in PriorityLevel:
        count = db.query(TaskModel).filter(TaskModel.priority == priority).count()
        by_priority[priority.value] = count
    
    return {
        "total": total,
        "completed": completed,
        "pending": pending,
        "by_priority": by_priority
    }


@app.get("/")
def root():
    """Health check endpoint."""
    return {"message": "Friday Assistant API is running"}
