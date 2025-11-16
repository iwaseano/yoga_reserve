from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List, Union, Literal
from pydantic import field_validator
import json
import os


class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: Literal["local", "azure", "mock"] = "local"

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/yoga_reserve"
    AZURE_DATABASE_URL: str = ""

    # JWT
    SECRET_KEY: str = (
        "your-secret-key-change-in-production-please-use-secure-random-string"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: Union[str, List[str]] = ["http://localhost:3000"]
    AZURE_CORS_ORIGINS: Union[str, List[str]] = []

    @field_validator("CORS_ORIGINS", "AZURE_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [v] if v else []
        return v if v else []

    # App
    API_V1_PREFIX: str = ""
    PROJECT_NAME: str = "Yoga Reservation API"

    class Config:
        env_file = ".env"

    def get_database_url(self) -> str:
        """環境に応じたデータベースURLを取得"""
        if self.ENVIRONMENT == "azure" and self.AZURE_DATABASE_URL:
            return self.AZURE_DATABASE_URL
        return self.DATABASE_URL

    def get_cors_origins(self) -> List[str]:
        """環境に応じたCORS設定を取得"""
        if self.ENVIRONMENT == "azure" and self.AZURE_CORS_ORIGINS:
            return (
                self.AZURE_CORS_ORIGINS
                if isinstance(self.AZURE_CORS_ORIGINS, list)
                else [self.AZURE_CORS_ORIGINS]
            )
        return (
            self.CORS_ORIGINS
            if isinstance(self.CORS_ORIGINS, list)
            else [self.CORS_ORIGINS]
        )


@lru_cache()
def get_settings():
    return Settings()


# Export settings instance
settings = get_settings()
