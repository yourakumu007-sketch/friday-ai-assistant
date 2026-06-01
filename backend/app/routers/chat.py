"""FRIDAY Backend - Chat Router"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.database import get_db
from app.models import ChatMessage
from app.services import JWTHandler
from fastapi.security import HTTPBearer, HTTPAuthCredentials

logger = logging.getLogger(__name__)
security = HTTPBearer()

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
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


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def send_message(
    message_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Send a chat message."""
    try:
        # TODO: Integrate with OpenAI API for AI responses
        assistant_response = "I'm FRIDAY, your AI assistant. How can I help you?"
        
        chat_message = ChatMessage(
            user_id=current_user.user_id,
            user_message=message_data.get("message"),
            assistant_response=assistant_response,
            language=message_data.get("language", "en"),
            message_type=message_data.get("message_type", "text"),
        )
        db.add(chat_message)
        db.commit()
        db.refresh(chat_message)
        
        logger.info(f"Chat message saved for user: {current_user.user_id}")
        
        return {
            "success": True,
            "message": "Message processed",
            "data": {
                "id": str(chat_message.id),
                "user_message": chat_message.user_message,
                "assistant_response": chat_message.assistant_response,
                "timestamp": chat_message.created_at,
            },
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error processing chat message: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing message",
        )


@router.get("/history", response_model=dict)
async def get_chat_history(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    limit: int = 50,
):
    """Get chat history."""
    try:
        messages = db.query(ChatMessage).filter(
            ChatMessage.user_id == current_user.user_id
        ).order_by(ChatMessage.created_at.desc()).limit(limit).all()
        
        return {
            "success": True,
            "message": "Chat history retrieved",
            "data": messages,
        }
    except Exception as e:
        logger.error(f"Error fetching chat history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching chat history",
        )
