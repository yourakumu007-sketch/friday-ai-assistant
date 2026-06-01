"""FRIDAY Backend - Authentication Service"""
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID
import logging
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.models import User
from app.schemas import UserCreate, TokenData
from app.config import settings

logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service for authentication operations."""

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_user(db: Session, user_create: UserCreate) -> User:
        """Create a new user."""
        try:
            user = User(
                username=user_create.username,
                email=user_create.email,
                hashed_password=AuthService.hash_password(user_create.password),
                first_name=user_create.first_name,
                last_name=user_create.last_name,
                preferred_language=user_create.preferred_language,
                voice_preference=user_create.voice_preference,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"User created: {user.username}")
            return user
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating user: {str(e)}")
            raise

    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
        """Authenticate a user."""
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return None
        if not AuthService.verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        """Get user by username."""
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def user_exists(db: Session, username: str, email: str) -> bool:
        """Check if user already exists."""
        return (
            db.query(User).filter(
                (User.username == username) | (User.email == email)
            ).first()
            is not None
        )
