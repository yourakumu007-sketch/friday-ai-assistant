from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_

from models.memory import Memory
from schemas.memory import MemoryCreate, MemoryUpdate, MemoryResponse
from database import get_db

router = APIRouter(
    prefix="/api/memory",
    tags=["memory"]
)


@router.post("/", response_model=MemoryResponse, status_code=status.HTTP_201_CREATED)
def create_memory(
    memory: MemoryCreate,
    db: Session = Depends(get_db)
):
    """Create a new memory record."""
    db_memory = Memory(
        user_id=memory.user_id,
        key=memory.key,
        value=memory.value
    )
    db.add(db_memory)
    db.commit()
    db.refresh(db_memory)
    return db_memory


@router.get("/{memory_id}", response_model=MemoryResponse)
def get_memory(
    memory_id: int,
    db: Session = Depends(get_db)
):
    """Get a memory record by ID."""
    memory = db.query(Memory).filter(Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memory not found"
        )
    return memory


@router.get("/user/{user_id}", response_model=list[MemoryResponse])
def get_user_memories(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get all memory records for a specific user."""
    memories = db.query(Memory).filter(Memory.user_id == user_id).all()
    return memories


@router.get("/user/{user_id}/key/{key}", response_model=MemoryResponse)
def get_memory_by_key(
    user_id: int,
    key: str,
    db: Session = Depends(get_db)
):
    """Get a memory record by user ID and key."""
    memory = db.query(Memory).filter(
        and_(Memory.user_id == user_id, Memory.key == key)
    ).first()
    if not memory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memory not found"
        )
    return memory


@router.put("/{memory_id}", response_model=MemoryResponse)
def update_memory(
    memory_id: int,
    memory_update: MemoryUpdate,
    db: Session = Depends(get_db)
):
    """Update a memory record."""
    memory = db.query(Memory).filter(Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memory not found"
        )
    
    if memory_update.key is not None:
        memory.key = memory_update.key
    if memory_update.value is not None:
        memory.value = memory_update.value
    
    db.commit()
    db.refresh(memory)
    return memory


@router.delete("/{memory_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_memory(
    memory_id: int,
    db: Session = Depends(get_db)
):
    """Delete a memory record."""
    memory = db.query(Memory).filter(Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Memory not found"
        )
    
    db.delete(memory)
    db.commit()
    return None


@router.delete("/user/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_memories(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Delete all memory records for a specific user."""
    memories = db.query(Memory).filter(Memory.user_id == user_id).all()
    if not memories:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No memories found for this user"
        )
    
    for memory in memories:
        db.delete(memory)
    db.commit()
    return None
