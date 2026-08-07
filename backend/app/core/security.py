import secrets
import string
from datetime import datetime, timedelta, timezone
from typing import Any, Union
from jose import jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet
from app.core.config import settings

# Password hashing for login credentials
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Fernet instance for encrypted vault passwords at rest
fernet = Fernet(settings.get_fernet_key())

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def encrypt_credential(plain_text: str) -> str:
    """Encrypts plaintext vault password using Fernet symmetric encryption."""
    if not plain_text:
        return ""
    encrypted_bytes = fernet.encrypt(plain_text.encode('utf-8'))
    return encrypted_bytes.decode('utf-8')

def decrypt_credential(cipher_text: str) -> str:
    """Decrypts vault password."""
    if not cipher_text:
        return ""
    decrypted_bytes = fernet.decrypt(cipher_text.encode('utf-8'))
    return decrypted_bytes.decode('utf-8')

def create_access_token(subject: Union[str, Any], role: str, expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject), "role": role}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

WORD_LIST = [
    "Sky", "Pixel", "Dragon", "Shadow", "Blaze", 
    "Storm", "Wolf", "Raven", "Frost", "Ghost", 
    "Titan", "Knight", "Fire", "Star", "Moon", 
    "Light", "Hunter", "Nova", "Rocket", "Comet"
]

def generate_nova_username() -> str:
    """
    Generates CSPRNG random username starting with Nova + Word + Number.
    Examples: NovaSky4821, NovaDragon728, NovaFrost617
    """
    word = secrets.choice(WORD_LIST)
    # Generate 3 or 4 digit number (100 - 9999)
    num = secrets.randbelow(9000) + 1000 if secrets.randbelow(2) == 0 else secrets.randbelow(900) + 100
    return f"Nova{word}{num}"

def generate_strong_password() -> str:
    """
    Generates CSPRNG strong password (14-18 chars) with uppercase, lowercase, numbers, symbols.
    Format example: Nova#Sky7Kp2!X
    """
    word1 = secrets.choice(WORD_LIST)
    word2 = secrets.choice(WORD_LIST)
    symbols = "!@#$%^&*"
    sym1 = secrets.choice(symbols)
    sym2 = secrets.choice(symbols)
    num = secrets.randbelow(90) + 10
    
    # 4 random random mixed alphanumeric chars
    char_pool = string.ascii_letters + string.digits
    suffix = "".join(secrets.choice(char_pool) for _ in range(4))
    
    return f"Nova{sym1}{word1}{num}{suffix}{sym2}"
