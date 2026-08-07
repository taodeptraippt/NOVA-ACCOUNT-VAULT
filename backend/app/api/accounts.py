from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.account import User
from app.api.deps import get_current_user
from app.schemas.account import (
    AccountCreate, AccountUpdate, AccountResponse, CredentialResponse, 
    StatsResponse, GeneratedUsernameResponse, GeneratedPasswordResponse
)
from app.services.account_service import (
    create_account, get_accounts, get_account_by_id, get_account_credential,
    update_account, archive_account, get_account_stats, generate_unique_nova_username
)
from app.core.security import generate_strong_password

router = APIRouter(prefix="/accounts", tags=["Accounts"])

@router.get("", response_model=List[AccountResponse])
def list_accounts(
    query: Optional[str] = Query(None, description="Search term for NOVA ID, username, or notes"),
    status: Optional[str] = Query(None, description="Filter status: ALL, ACTIVE, PAUSED, ARCHIVED"),
    sort_by: Optional[str] = Query("newest", description="Sort order: newest, oldest, username_asc, username_desc"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    accounts = get_accounts(db, query=query, status=status, sort_by=sort_by)
    return [AccountResponse.model_validate(acc) for acc in accounts]

@router.get("/stats", response_model=StatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stats = get_account_stats(db)
    return StatsResponse(**stats)

@router.post("/generate-username", response_model=GeneratedUsernameResponse)
def generate_username(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    username = generate_unique_nova_username(db)
    return {"username": username}

@router.post("/generate-password", response_model=GeneratedPasswordResponse)
def generate_password(
    current_user: User = Depends(get_current_user)
):
    password = generate_strong_password()
    return {"password": password}

@router.post("", response_model=AccountResponse, status_code=status.HTTP_201_CREATED)
def create_new_account(
    account_in: AccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        acc = create_account(db, account_in)
        return AccountResponse.model_validate(acc)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{id}", response_model=AccountResponse)
def get_account(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    acc = get_account_by_id(db, id)
    if not acc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    return AccountResponse.model_validate(acc)

@router.get("/{id}/credential", response_model=CredentialResponse)
def get_credential(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        acc, decrypted_pwd = get_account_credential(db, id)
        return CredentialResponse(
            id=acc.id,
            nova_id=acc.nova_id,
            username=acc.username,
            password=decrypted_pwd
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.patch("/{id}", response_model=AccountResponse)
def update_existing_account(
    id: int,
    account_in: AccountUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        acc = update_account(db, id, account_in)
        return AccountResponse.model_validate(acc)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{id}", response_model=AccountResponse)
def archive_existing_account(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        acc = archive_account(db, id)
        return AccountResponse.model_validate(acc)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
