"""FRIDAY Backend - JWT Handler"""
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID
import logging
from jose import JWTError, jwt

from app.config import settings
from app.schemas import TokenData

logger = logging.getLogger(__name__)


class JWTHandler:
    """Service for JWT token operations."""

    @staticmethod
    def create_access_token(user_id: UUID, username: str, expires_delta: Optional[timedelta] = None) -> str:
        """Create an access token."""
        to_encode = {"sub": str(user_id), "username": username}
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM,
        )
        return encoded_jwt

    @staticmethod
    def create_refresh_token(user_id: UUID) -> str:
        """Create a refresh token."""
        to_encode = {"sub": str(user_id), "type": "refresh"}
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM,
        )
        return encoded_jwt

    @staticmethod
    def decode_token(token: str) -> Optional[TokenData]:
        """Decode and verify a token."""
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM],
            )
            user_id: str = payload.get("sub")
            username: str = payload.get("username")
            
            if user_id is None:
                return None
            
            return TokenData(user_id=user_id, username=username)
        except JWTError as e:
            logger.error(f"Token decode error: {str(e)}")
            return None
