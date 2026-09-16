import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    PROJECT_NAME: str = "RETRACK - RailSync-AI API"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str) and v.startswith("["):
            return json.loads(v)
        return v

    SUPABASE_URL: str = "https://aevaeyhswuasgjbkgiqq.supabase.co"
    SUPABASE_ANON_KEY: str = "sb_publishable_nq5c4ydgZ6VRH8aUTkIAVg_An1qU9_4"
    SUPABASE_PUBLISHABLE_KEY: str = "sb_publishable_nq5c4ydgZ6VRH8aUTkIAVg_An1qU9_4"
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_SECRET_KEY: str = ""
    SUPABASE_JWKS_URL: str = "https://aevaeyhswuasgjbkgiqq.supabase.co/auth/v1/.well-known/jwks.json"
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/postgres"
    DIRECT_URL: str = "postgresql://postgres:password@localhost:5432/postgres"

    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DATABASE: str = "retrack_db"

    MAPBOX_TOKEN: str = "pk.eyJ1IjoicmFpbHN5bmMiLCJhIjoiY2xzemhkdWp6MHdpaTJrbjJpdGZxeGV0biJ9.dummy_mapbox_token"

    AI_PROVIDER: str = "google_gemini"
    AI_API_KEY: str = "demo-ai-api-key"
    AI_MODEL: str = "gemini-1.5-pro"

    SIMULATION_ENABLED: bool = True
    SIMULATION_INTERVAL: int = 10

    JWT_SECRET: str = "retrack_railsync_ai_hackathon_super_secret_jwt_key_2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440


settings = Settings()
