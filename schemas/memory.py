from datetime import datetime
from pydantic import BaseModel, Field


class MemoryBase(BaseModel):
    """Base schema for Memory with common fields."""
    user_id: int
    key: str = Field(..., min_length=1, max_length=255)
    value: str


class MemoryCreate(MemoryBase):
    """Schema for creating a new Memory."""
    pass


class MemoryUpdate(BaseModel):
    """Schema for updating a Memory."""
    key: str | None = Field(None, min_length=1, max_length=255)
    value: str | None = None


class MemoryResponse(MemoryBase):
    """Schema for Memory response with timestamps."""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MemoryInDB(MemoryResponse):
    """Schema for Memory stored in database."""
    pass
