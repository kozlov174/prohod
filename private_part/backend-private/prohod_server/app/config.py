import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv(override=True)

class Settings(BaseSettings):
    SECRET_KEY: str = "your-secret-key"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 30

settings = Settings()

class AppConfig(BaseSettings):
    TITLE: str = "Prohod"
    VERSION: str = "0.0.1"
    DESCRIPTION: str = "Prohod server"
    load_dotenv()

    POSTGRES_HOST: str = "host.docker.internal"
    POSTGRES_PORT: int = os.environ.get("POSTGRES_PORT")
    POSTGRES_DB: str = os.environ.get("POSTGRES_DB")
    POSTGRES_USER: str = os.environ.get("POSTGRES_USER")
    POSTGRES_PASSWORD: str = os.environ.get("POSTGRES_PASSWORD")

    class Config:
        env_file = str(Path(__file__).resolve().parent / ".env")
        env_file_encoding = "utf-8"

app_config = AppConfig()
