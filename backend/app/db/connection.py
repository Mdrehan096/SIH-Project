import logging
import os
from typing import Any, Dict, List, Optional
from app.core.config import settings

logger = logging.getLogger("retrack.db")


class DatabaseConnectionManager:
    """
    Unified Database Manager for RETRACK - RailSync-AI.
    Connects to Supabase PostgreSQL or MongoDB database when valid credentials exist.
    Provides a high-performance in-memory mock fallback engine for standalone hackathon demos.
    """

    def __init__(self):
        self.is_connected = False
        self.use_mock_fallback = False
        self.supabase_client = None
        self.mongo_client = None
        self.mongo_db = None
        self.db_engine_name = "Standalone In-Memory Prototype Engine"
        self._initialize_connection()

    def _initialize_connection(self):
        # 1. Attempt Supabase connection if configured with valid credentials
        if (
            settings.SUPABASE_URL 
            and "your-supabase" not in settings.SUPABASE_URL 
            and "synthetic" not in settings.SUPABASE_URL
            and settings.SUPABASE_URL.startswith("http")
        ):
            try:
                from supabase import create_client, Client
                key = settings.SUPABASE_SERVICE_ROLE_KEY if (settings.SUPABASE_SERVICE_ROLE_KEY and "synthetic" not in settings.SUPABASE_SERVICE_ROLE_KEY) else settings.SUPABASE_ANON_KEY
                self.supabase_client: Client = create_client(settings.SUPABASE_URL, key)
                self.is_connected = True
                self.use_mock_fallback = False
                self.db_engine_name = "Supabase PostgreSQL"
                logger.info(f"Successfully connected to Supabase PostgreSQL at {settings.SUPABASE_URL}")
                return
            except Exception as e:
                logger.warning(f"Could not connect to Supabase: {e}. Checking secondary database options.")

        # 2. Attempt MongoDB connection if configured
        if settings.MONGODB_URI and "mongodb://" in settings.MONGODB_URI:
            try:
                import pymongo
                self.mongo_client = pymongo.MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=1000)
                # Quick ping test
                self.mongo_client.admin.command('ping')
                self.mongo_db = self.mongo_client[settings.MONGODB_DATABASE]
                self.is_connected = True
                self.use_mock_fallback = False
                self.db_engine_name = f"MongoDB ({settings.MONGODB_DATABASE})"
                logger.info(f"Successfully connected to MongoDB server at {settings.MONGODB_URI}")
                return
            except Exception as e:
                logger.debug(f"MongoDB connection attempt failed: {e}. Falling back to prototype engine.")

        # 3. Fallback to In-Memory Store
        self.use_mock_fallback = True
        self.is_connected = True
        self.db_engine_name = "Standalone In-Memory Engine"
        logger.info("Database initialized in Standalone In-Memory Prototype Mode.")

    def get_status(self) -> Dict[str, Any]:
        return {
            "connected": self.is_connected,
            "mode": self.db_engine_name,
            "supabase_url": settings.SUPABASE_URL if self.supabase_client else None,
            "mongodb_uri": settings.MONGODB_URI if self.mongo_client else None,
            "database": settings.MONGODB_DATABASE if self.mongo_client else "in_memory",
        }


db_manager = DatabaseConnectionManager()
