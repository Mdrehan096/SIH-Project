"""
RETRACKAI Conversation Memory & Search Recall Service
Manages context window token limits, conversation history pruning, and query memory recall.
"""

from typing import List, Dict, Any, Optional
from app.db.queries import get_retrackai_messages, search_retrackai_conversations


class ConversationMemoryService:
    """Manages sliding conversation context windows and query history recall."""

    MAX_CONTEXT_MESSAGES = 10

    def get_trimmed_history(self, conversation_id: str) -> List[Dict[str, Any]]:
        history = get_retrackai_messages(conversation_id)
        if len(history) > self.MAX_CONTEXT_MESSAGES:
            return history[-self.MAX_CONTEXT_MESSAGES:]
        return history

    def recall_previous_queries(self, user_id: str, query: str) -> List[Dict[str, Any]]:
        return search_retrackai_conversations(user_id=user_id, query=query)


memory_service = ConversationMemoryService()
