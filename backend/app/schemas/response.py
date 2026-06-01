"""FRIDAY Backend - Response Schemas"""
from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, List, Any
from datetime import datetime

T = TypeVar('T')


class APIResponse(BaseModel, Generic[T]):
    """Generic API response schema."""
    success: bool
    message: str
    data: Optional[T] = None
    timestamp: datetime = datetime.utcnow()


class ErrorResponse(BaseModel):
    """Error response schema."""
    success: bool = False
    message: str
    detail: Optional[str] = None
    errors: Optional[List[dict]] = None
    timestamp: datetime = datetime.utcnow()


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response schema."""
    success: bool
    message: str
    total: int
    page: int
    limit: int
    total_pages: int
    items: List[T]
    timestamp: datetime = datetime.utcnow()
