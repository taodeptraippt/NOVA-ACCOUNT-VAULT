import os
import base64
from pydantic_settings import BaseSettings, SettingsConfigDict
from cryptography.fernet import Fernet

class Settings(BaseSettings):
    PROJECT_NAME: str = "NOVA ACCOUNT VAULT"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "nova_vault_super_secret_jwt_key_2026_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Encryption key for vault credentials (Must be 32 url-safe base64 bytes for Fernet)
    # Default provided for immediate zero-config use
    CREDENTIAL_ENCRYPTION_KEY: str = "Z083a216c3NldmVudGVlbmdlbmVyYXRlZHZhdWx0a2V5MjAyNg==" 
    DATABASE_URL: str = "sqlite:///./nova_vault.db"
    CORS_ORIGINS: str = "*"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    def get_fernet_key(self) -> bytes:
        """Ensures key is 32 bytes valid Fernet key."""
        try:
            raw = self.CREDENTIAL_ENCRYPTION_KEY.encode('utf-8')
            # Check if Fernet accepts it directly
            Fernet(raw)
            return raw
        except Exception:
            # Fallback to generating a deterministic 32-byte urlsafe base64 key from key string
            key_32 = self.CREDENTIAL_ENCRYPTION_KEY.ljust(32)[:32].encode('utf-8')
            return base64.urlsafe_b64encode(key_32)

settings = Settings()
