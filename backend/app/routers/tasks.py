"""FRIDAY Backend - Tasks Router"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID
import logging

from app.database import get_db
from app.models import Task
from app.schemas import TaskCreate, TaskUpdate, TaskResponse
from app.services import JWTHandler
from fastapi.security import HTTPBearer, HTTPAuthCredentials

logger = logging.getLogger(__name__)
security = HTTPBearer()

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


def get_current_user(credentials: HTTPAuthCredentials = Depends(security)):
    """Get current user from token."""
    token = credentials.credentials
    token_data = JWTHandler.decode_token(token)
    
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    
    return token_data


@router.get("/", response_model=dict)
async def get_tasks(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: str = Query(None),
    priority: str = Query(None),
):
    """Get user's tasks."""
    try:
        query = db.query(Task).filter(Task.user_id == current_user.user_id)
        
        if status:
            query = query.filter(Task.status == status)
        
        if priority:
            query = query.filter(Task.priority == priority)
        
        total = query.count()
        tasks = query.offset(skip).limit(limit).all()
        
        return {
            "success": True,
            "message": "Tasks retrieved",
            "data": {
                "total": total,
                "skip": skip,
                "limit": limit,
                "items": [TaskResponse.from_orm(task) for task in tasks],
            },
        }
    except Exception as e:
        logger.error(f"Error fetching tasks: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching tasks",
        )


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_create: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Create a new task."""
    try:
        task = Task(
            user_id=current_user.user_id,
            title=task_create.title,
            description=task_create.description,
            priority=task_create.priority,
            status=task_create.status,
            due_date=task_create.due_date,
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        
        logger.info(f"Task created: {task.id} by user {current_user.user_id}")
        
        return {
            "success": True,
            "message": "Task created successfully",
            "data": TaskResponse.from_orm(task),
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating task: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating task",
        )


@router.get("/{task_id}", response_model=dict)
async def get_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get a specific task."""
    task = db.query(Task).filter(
        (Task.id == task_id) & (Task.user_id == current_user.user_id)
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    
    return {
        "success": True,
        "message": "Task retrieved",
        "data": TaskResponse.from_orm(task),
    }


@router.put("/{task_id}", response_model=dict)
async def update_task(
    task_id: UUID,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Update a task."""
    task = db.query(Task).filter(
        (Task.id == task_id) & (Task.user_id == current_user.user_id)
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    
    try:
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)
        
        db.commit()
        db.refresh(task)
        
        logger.info(f"Task updated: {task.id}")
        
        return {
            "success": True,
            "message": "Task updated successfully",
            "data": TaskResponse.from_orm(task),
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating task: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating task",
        )


@router.delete("/{task_id}", response_model=dict)
async def delete_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Delete a task."""
    task = db.query(Task).filter(
        (Task.id == task_id) & (Task.user_id == current_user.user_id)
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    
    try:
        db.delete(task)
        db.commit()
        
        logger.info(f"Task deleted: {task_id}")
        
        return {
            "success": True,
            "message": "Task deleted successfully",
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting task: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting task",
        )
