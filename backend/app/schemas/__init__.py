"""Initialize schemas package."""
from app.schemas.user import UserCreate, UserResponse, UserLogin, Token
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.schemas.response import APIResponse, ErrorResponse, PaginatedResponse

__all__ = [
    "UserCreate",
    "UserResponse",
    "UserLogin",
    "Token",
    "TaskCreate",
    "TaskUpdate",
    "TaskResponse",
    "APIResponse",
    "ErrorResponse",
    "PaginatedResponse",
]
