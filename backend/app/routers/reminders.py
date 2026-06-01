"""FRIDAY Backend - Reminders Router"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
import logging

from app.database import get_db
from app.models import Reminder
from app.services import JWTHandler
from fastapi.security import HTTPBearer, HTTPAuthCredentials

logger = logging.getLogger(__name__)
security = HTTPBearer()

router = APIRouter(
    prefix="/reminders",
    tags=["Reminders"],
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
async def get_reminders(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get user's reminders."""
    try:
        reminders = db.query(Reminder).filter(
            Reminder.user_id == current_user.user_id
        ).all()
        
        return {
            "success": True,
            "message": "Reminders retrieved",
            "data": reminders,
        }
    except Exception as e:
        logger.error(f"Error fetching reminders: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching reminders",
        )


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    reminder_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Create a new reminder."""
    try:
        reminder = Reminder(
            user_id=current_user.user_id,
            title=reminder_data.get("title"),
            description=reminder_data.get("description"),
            reminder_time=reminder_data.get("reminder_time"),
            is_recurring=reminder_data.get("is_recurring", False),
            recurrence_pattern=reminder_data.get("recurrence_pattern"),
        )
        db.add(reminder)
        db.commit()
        db.refresh(reminder)
        
        logger.info(f"Reminder created: {reminder.id}")
        
        return {
            "success": True,
            "message": "Reminder created successfully",
            "data": reminder,
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating reminder: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating reminder",
        )
