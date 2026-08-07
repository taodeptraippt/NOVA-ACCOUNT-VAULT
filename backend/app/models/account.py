from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from app.db.session import Base

def utc_now():
    return datetime.now(timezone.utc)

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    nova_id = Column(String(50), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    encrypted_password = Column(Text, nullable=False)
    status = Column(String(20), default="ACTIVE", index=True, nullable=False)
    notes = Column(Text, nullable=True, default="")
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)
    last_used_at = Column(DateTime(timezone=True), nullable=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="WORKER", nullable=False)  # ADMIN, WORKER
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
