"""FRIDAY Backend - Memory Model"""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base


class Memory(Base):
    """Memory model for storing user preferences and personalization data."""

    __tablename__ = "memory"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    key = Column(String(100), nullable=False)  # e.g., "favorite_music", "preferences"
    value = Column(JSON, nullable=False)  # Flexible JSON storage
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", backref="memory_items")

    __table_args__ = (  # Unique constraint on user_id + key
        # UniqueConstraint('user_id', 'key', name='uq_user_key'),
    )

    def __repr__(self):
        return f"<Memory(user_id={self.user_id}, key={self.key})>"
