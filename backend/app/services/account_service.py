from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate
from app.core.security import encrypt_credential, decrypt_credential, generate_nova_username

def get_next_nova_id(db: Session) -> str:
    """
    Generates non-random sequential ID: NOVA-0001, NOVA-0002, NOVA-0003...
    """
    last_account = db.query(Account).order_by(desc(Account.id)).first()
    if not last_account:
        next_num = 1
    else:
        next_num = last_account.id + 1
    return f"NOVA-{next_num:04d}"

def is_username_exists(db: Session, username: str, exclude_id: Optional[int] = None) -> bool:
    query = db.query(Account).filter(Account.username == username)
    if exclude_id:
        query = query.filter(Account.id != exclude_id)
    return query.first() is not None

def generate_unique_nova_username(db: Session) -> str:
    """Generates a Nova username and guarantees it is unique in database."""
    for _ in range(50):
        uname = generate_nova_username()
        if not is_username_exists(db, uname):
            return uname
    # Fallback with timestamp if extremely crowded
    import time
    return f"NovaSky{int(time.time()) % 10000}"

def create_account(db: Session, account_in: AccountCreate) -> Account:
    if is_username_exists(db, account_in.username):
        raise ValueError(f"Username '{account_in.username}' already exists.")

    nova_id = get_next_nova_id(db)
    encrypted_pwd = encrypt_credential(account_in.password)

    db_account = Account(
        nova_id=nova_id,
        username=account_in.username,
        encrypted_password=encrypted_pwd,
        status=account_in.status,
        notes=account_in.notes or "",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def get_accounts(
    db: Session,
    query: Optional[str] = None,
    status: Optional[str] = None,
    sort_by: str = "newest"
) -> List[Account]:
    q = db.query(Account)

    if status and status.upper() != "ALL":
        q = q.filter(Account.status == status.upper())

    if query:
        search = f"%{query.strip()}%"
        q = q.filter(
            or_(
                Account.nova_id.ilike(search),
                Account.username.ilike(search),
                Account.notes.ilike(search)
            )
        )

    if sort_by == "oldest":
        q = q.order_by(asc(Account.id))
    elif sort_by == "username_asc":
        q = q.order_by(asc(Account.username))
    elif sort_by == "username_desc":
        q = q.order_by(desc(Account.username))
    else:  # newest
        q = q.order_by(desc(Account.id))

    return q.all()

def get_account_by_id(db: Session, account_id: int) -> Optional[Account]:
    return db.query(Account).filter(Account.id == account_id).first()

def get_account_credential(db: Session, account_id: int) -> Tuple[Account, str]:
    account = get_account_by_id(db, account_id)
    if not account:
        raise ValueError("Account not found.")
    
    # Touch last_used_at timestamp
    account.last_used_at = datetime.now(timezone.utc)
    db.commit()
    
    decrypted_password = decrypt_credential(account.encrypted_password)
    return account, decrypted_password

def update_account(db: Session, account_id: int, account_in: AccountUpdate) -> Account:
    account = get_account_by_id(db, account_id)
    if not account:
        raise ValueError("Account not found.")

    if account_in.username and account_in.username != account.username:
        if is_username_exists(db, account_in.username, exclude_id=account_id):
            raise ValueError(f"Username '{account_in.username}' already exists.")
        account.username = account_in.username

    if account_in.password:
        account.encrypted_password = encrypt_credential(account_in.password)

    if account_in.status:
        account.status = account_in.status

    if account_in.notes is not None:
        account.notes = account_in.notes

    account.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(account)
    return account

def archive_account(db: Session, account_id: int) -> Account:
    """Soft delete by archiving the account."""
    account = get_account_by_id(db, account_id)
    if not account:
        raise ValueError("Account not found.")

    account.status = "ARCHIVED"
    account.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(account)
    return account

def get_account_stats(db: Session) -> dict:
    total = db.query(Account).count()
    active = db.query(Account).filter(Account.status == "ACTIVE").count()
    paused = db.query(Account).filter(Account.status == "PAUSED").count()
    archived = db.query(Account).filter(Account.status == "ARCHIVED").count()
    return {"total": total, "active": active, "paused": paused, "archived": archived}
