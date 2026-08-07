from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class AccountBase(BaseModel):
    username: str
    status: str = "ACTIVE"
    notes: Optional[str] = ""

class AccountCreate(AccountBase):
    password: str

class AccountUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class AccountResponse(AccountBase):
    id: int
    nova_id: str
    created_at: datetime
    updated_at: datetime
    last_used_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class CredentialResponse(BaseModel):
    id: int
    nova_id: str
    username: str
    password: str

class StatsResponse(BaseModel):
    total: int
    active: int
    paused: int
    archived: int

class UserBase(BaseModel):
    email: str
    role: str

class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class GeneratedUsernameResponse(BaseModel):
    username: str

class GeneratedPasswordResponse(BaseModel):
    password: str
