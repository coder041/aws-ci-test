"""Application settings from environment. Principal: single source of truth, no hardcoded secrets."""
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Load from env; .env for local dev."""

    app_name: str = "aws-ci-test"
    debug: bool = False

    # Database
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/aws_ci_test"

    # Auth: JWT
    secret_key: str = "change-me-in-production-use-openssl-rand-hex-32"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # CORS (comma-separated origins, or * for dev)
    cors_origins: str = "*"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
