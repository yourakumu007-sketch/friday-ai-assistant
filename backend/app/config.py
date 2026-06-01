"""FRIDAY Backend - Configuration Settings"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "FRIDAY AI Assistant"
    APP_VERSION: str = "1.0.0"
    FASTAPI_ENV: str = Field(default="development", env="FASTAPI_ENV")

    # Database
    DATABASE_URL: str = Field(
        default="sqlite:///./friday.db",
        env="DATABASE_URL",
    )
    DB_ECHO: bool = Field(default=False, env="DB_ECHO")

    # Security
    SECRET_KEY: str = Field(
        default="your-secret-key-change-in-production",
        env="SECRET_KEY",
    )
    ALGORITHM: str = Field(default="HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7, env="REFRESH_TOKEN_EXPIRE_DAYS")

    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:5173"],
        env="CORS_ORIGINS",
    )
    ALLOWED_HOSTS: List[str] = Field(
        default=["localhost", "127.0.0.1"],
        env="ALLOWED_HOSTS",
    )

    # API Keys
    OPENAI_API_KEY: str = Field(default="", env="OPENAI_API_KEY")
    GOOGLE_CLOUD_API_KEY: str = Field(default="", env="GOOGLE_CLOUD_API_KEY")
    WEATHER_API_KEY: str = Field(default="", env="WEATHER_API_KEY")
    SPOTIFY_CLIENT_ID: str = Field(default="", env="SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET: str = Field(default="", env="SPOTIFY_CLIENT_SECRET")

    # Email
    SMTP_SERVER: str = Field(default="smtp.gmail.com", env="SMTP_SERVER")
    SMTP_PORT: int = Field(default=587, env="SMTP_PORT")
    EMAIL_ADDRESS: str = Field(default="", env="EMAIL_ADDRESS")
    EMAIL_PASSWORD: str = Field(default="", env="EMAIL_PASSWORD")

    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 1000
    RATE_LIMIT_PERIOD: int = 3600  # 1 hour

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
