from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.account import User
from app.schemas.account import LoginRequest, TokenResponse, UserResponse
from app.core.security import verify_password, get_password_hash, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

def seed_default_users(db: Session):
    """Seed initial Admin and Worker accounts if users table is empty."""
    if db.query(User).count() == 0:
        admin = User(
            email="admin@nova.vault",
            hashed_password=get_password_hash("admin123"),
            role="ADMIN",
            is_active=True
        )
        worker = User(
            email="worker@nova.vault",
            hashed_password=get_password_hash("worker123"),
            role="WORKER",
            is_active=True
        )
        db.add_all([admin, worker])
        db.commit()

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    seed_default_users(db)
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    token = create_access_token(subject=user.id, role=user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
