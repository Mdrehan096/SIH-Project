import logging
import os
from typing import Any, Dict, List, Optional
from app.core.config import settings

logger = logging.getLogger("retrack.db")


class DatabaseConnectionManager:
    """
    Unified Database Manager for RETRACK - RailSync-AI.
    Connects to Supabase / PostgreSQL database when valid credentials exist.
    Provides a high-performance in-memory mock fallback engine for standalone hackathon demos.
    """

    def __init__(self):
        self.is_connected = False
        self.use_mock_fallback = False
        self.supabase_client = None
        self._initialize_connection()

    def _initialize_connection(self):
        # Attempt Supabase connection if configured
        if settings.SUPABASE_URL and "your-supabase" not in settings.SUPABASE_URL and "synthetic" not in settings.SUPABASE_URL:
            try:
                from supabase import create_client, Client
                self.supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
                self.is_connected = True
                logger.info("Successfully connected to Supabase PostgreSQL database.")
                return
            except Exception as e:
                logger.warning(f"Could not connect to Supabase: {e}. Falling back to in-memory store.")
        
        # Fallback to Mock Data Store
        self.use_mock_fallback = True
        self.is_connected = True
        logger.info("Database initialized in Standalone In-Memory Prototype Mode.")

    def get_status(self) -> Dict[str, Any]:
        return {
            "connected": self.is_connected,
            "mode": "Supabase PostgreSQL" if not self.use_mock_fallback else "Standalone In-Memory Prototype Engine",
            "database_url": settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else "Local Memory",
        }


db_manager = DatabaseConnectionManager()
