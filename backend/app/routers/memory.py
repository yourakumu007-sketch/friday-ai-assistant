"""FRIDAY Backend - Memory Router"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.database import get_db
from app.models import Memory
from app.services import JWTHandler
from fastapi.security import HTTPBearer, HTTPAuthCredentials

logger = logging.getLogger(__name__)
security = HTTPBearer()

router = APIRouter(
    prefix="/memory",
    tags=["Memory"],
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


@router.get("/{key}", response_model=dict)
async def get_memory(
    key: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Get memory by key."""
    memory = db.query(Memory).filter(
        (Memory.user_id == current_user.user_id) & (Memory.key == key)
    ).first()
    
    if not memory:
        return {
            "success": False,
            "message": "Memory not found",
            "data": None,
        }
    
    return {
        "success": True,
        "message": "Memory retrieved",
        "data": memory,
    }


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def save_memory(
    memory_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Save or update memory."""
    try:
        key = memory_data.get("key")
        
        # Check if memory exists
        existing = db.query(Memory).filter(
            (Memory.user_id == current_user.user_id) & (Memory.key == key)
        ).first()
        
        if existing:
            existing.value = memory_data.get("value")
            existing.description = memory_data.get("description")
            db.commit()
            db.refresh(existing)
            message = "Memory updated successfully"
            memory = existing
        else:
            memory = Memory(
                user_id=current_user.user_id,
                key=key,
                value=memory_data.get("value"),
                description=memory_data.get("description"),
            )
            db.add(memory)
            db.commit()
            db.refresh(memory)
            message = "Memory created successfully"
        
        logger.info(f"Memory saved: {key}")
        
        return {
            "success": True,
            "message": message,
            "data": memory,
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error saving memory: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error saving memory",
        )
