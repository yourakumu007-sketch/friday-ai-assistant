from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_

from models.memory import Memory
from schemas.memory import MemoryCreate, MemoryUpdate


class MemoryService:
    """Service layer for Memory operations."""

    @staticmethod
    def save(db: Session, user_id: int, key: str, value: str) -> Memory:
        """
        Save a new memory record.
        
        Args:
            db: Database session
            user_id: User ID
            key: Memory key
            value: Memory value
            
        Returns:
            Memory: Created memory record
        """
        memory = Memory(
            user_id=user_id,
            key=key,
            value=value
        )
        db.add(memory)
        db.commit()
        db.refresh(memory)
        return memory

    @staticmethod
    def get(db: Session, memory_id: int) -> Memory | None:
        """
        Get a memory record by ID.
        
        Args:
            db: Database session
            memory_id: Memory ID
            
        Returns:
            Memory: Memory record or None if not found
        """
        return db.query(Memory).filter(Memory.id == memory_id).first()

    @staticmethod
    def get_by_key(db: Session, user_id: int, key: str) -> Memory | None:
        """
        Get a memory record by user ID and key.
        
        Args:
            db: Database session
            user_id: User ID
            key: Memory key
            
        Returns:
            Memory: Memory record or None if not found
        """
        return db.query(Memory).filter(
            and_(Memory.user_id == user_id, Memory.key == key)
        ).first()

    @staticmethod
    def get_all_by_user(db: Session, user_id: int) -> list[Memory]:
        """
        Get all memory records for a specific user.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            list[Memory]: List of memory records
        """
        return db.query(Memory).filter(Memory.user_id == user_id).all()

    @staticmethod
    def update(
        db: Session,
        memory_id: int,
        key: str | None = None,
        value: str | None = None
    ) -> Memory | None:
        """
        Update a memory record.
        
        Args:
            db: Database session
            memory_id: Memory ID
            key: New key (optional)
            value: New value (optional)
            
        Returns:
            Memory: Updated memory record or None if not found
        """
        memory = db.query(Memory).filter(Memory.id == memory_id).first()
        if not memory:
            return None
        
        if key is not None:
            memory.key = key
        if value is not None:
            memory.value = value
        
        memory.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(memory)
        return memory

    @staticmethod
    def update_by_key(
        db: Session,
        user_id: int,
        key: str,
        new_value: str
    ) -> Memory | None:
        """
        Update a memory record by user ID and key.
        
        Args:
            db: Database session
            user_id: User ID
            key: Memory key
            new_value: New value
            
        Returns:
            Memory: Updated memory record or None if not found
        """
        memory = db.query(Memory).filter(
            and_(Memory.user_id == user_id, Memory.key == key)
        ).first()
        if not memory:
            return None
        
        memory.value = new_value
        memory.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(memory)
        return memory

    @staticmethod
    def delete(db: Session, memory_id: int) -> bool:
        """
        Delete a memory record.
        
        Args:
            db: Database session
            memory_id: Memory ID
            
        Returns:
            bool: True if deleted, False if not found
        """
        memory = db.query(Memory).filter(Memory.id == memory_id).first()
        if not memory:
            return False
        
        db.delete(memory)
        db.commit()
        return True

    @staticmethod
    def delete_by_key(db: Session, user_id: int, key: str) -> bool:
        """
        Delete a memory record by user ID and key.
        
        Args:
            db: Database session
            user_id: User ID
            key: Memory key
            
        Returns:
            bool: True if deleted, False if not found
        """
        memory = db.query(Memory).filter(
            and_(Memory.user_id == user_id, Memory.key == key)
        ).first()
        if not memory:
            return False
        
        db.delete(memory)
        db.commit()
        return True

    @staticmethod
    def delete_all_by_user(db: Session, user_id: int) -> int:
        """
        Delete all memory records for a specific user.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            int: Number of records deleted
        """
        memories = db.query(Memory).filter(Memory.user_id == user_id).all()
        count = len(memories)
        
        for memory in memories:
            db.delete(memory)
        db.commit()
        
        return count

    @staticmethod
    def exists(db: Session, user_id: int, key: str) -> bool:
        """
        Check if a memory record exists.
        
        Args:
            db: Database session
            user_id: User ID
            key: Memory key
            
        Returns:
            bool: True if exists, False otherwise
        """
        return db.query(Memory).filter(
            and_(Memory.user_id == user_id, Memory.key == key)
        ).first() is not None
