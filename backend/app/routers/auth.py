"""FRIDAY Backend - Authentication Router"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.database import get_db
from app.schemas import UserCreate, UserResponse, UserLogin, Token
from app.services import AuthService, JWTHandler
from app.utils import Validators

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(user_create: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Validate username
    if not Validators.validate_username(user_create.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid username format",
        )
    
    # Validate password
    is_valid, message = Validators.validate_password(user_create.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )
    
    # Validate language
    if not Validators.validate_language(user_create.preferred_language):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid language",
        )
    
    # Check if user exists
    if AuthService.user_exists(db, user_create.username, user_create.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered",
        )
    
    # Create user
    try:
        user = AuthService.create_user(db, user_create)
        access_token = JWTHandler.create_access_token(user.id, user.username)
        refresh_token = JWTHandler.create_refresh_token(user.id)
        
        return {
            "success": True,
            "message": "User registered successfully",
            "data": {
                "user": UserResponse.from_orm(user),
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
            },
        }
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user",
        )


@router.post("/login", response_model=dict)
async def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """Login user and return tokens."""
    user = AuthService.authenticate_user(db, user_login.username, user_login.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )
    
    access_token = JWTHandler.create_access_token(user.id, user.username)
    refresh_token = JWTHandler.create_refresh_token(user.id)
    
    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "user": UserResponse.from_orm(user),
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        },
    }


@router.post("/refresh", response_model=dict)
async def refresh_token(token: str, db: Session = Depends(get_db)):
    """Refresh access token."""
    token_data = JWTHandler.decode_token(token)
    
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    user = AuthService.get_user_by_id(db, token_data.user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    access_token = JWTHandler.create_access_token(user.id, user.username)
    
    return {
        "success": True,
        "message": "Token refreshed",
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
        },
    }
