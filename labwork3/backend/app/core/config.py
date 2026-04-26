from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "CompMath Lab 3"
    
    # Настройки CORS (разрешенные адреса фронтенда)
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    # Путь к .env файлу
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()