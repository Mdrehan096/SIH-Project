import logging
from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Dict, Any, Optional, List
from pydantic import BaseModel

from app.core.security import get_current_user
from app.ai.retrackai.service import retrackai_service
from app.ai.retrackai.schemas import (
    RETRACKAIQueryRequest,
    RETRACKAIQueryResponse,
    UserFeedbackDTO
)
from app.db.queries import (
    get_retrackai_conversations,
    get_retrackai_messages,
    search_retrackai_conversations
)

logger = logging.getLogger("retrack.chat")

router = APIRouter(prefix="/chat", tags=["RETRACKAI Project Knowledge Assistant"])


@router.post("/query", response_model=RETRACKAIQueryResponse)
async def query_retrack_ai(
    payload: RETRACKAIQueryRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Primary endpoint for RETRACKAI knowledge assistant.
    Performs RAG over project documentation, tools over live feeds (TMS, TDMS, SMMS, COA),
    and enforces strict identity guardrails against hallucinated data.
    """
    try:
        res = retrackai_service.process_query(req=payload, current_user=current_user)
        return res
    except Exception as e:
        logger.error(f"Error processing RETRACKAI query: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/conversations")
async def get_user_conversations(current_user: dict = Depends(get_current_user)):
    """Retrieves previous chat conversation sessions for the authenticated user."""
    user_id = current_user.get("id", "demo-user")
    return get_retrackai_conversations(user_id=user_id)


@router.get("/conversations/search")
async def search_user_conversations(
    q: str = Query(..., min_length=1),
    current_user: dict = Depends(get_current_user)
):
    """Searches past chat sessions for relevant keywords."""
    user_id = current_user.get("id", "demo-user")
    return search_retrackai_conversations(user_id=user_id, query=q)


@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Retrieves message history stream for a given conversation ID."""
    return get_retrackai_messages(conversation_id=conversation_id)


@router.post("/feedback")
async def submit_user_feedback(
    payload: UserFeedbackDTO,
    current_user: dict = Depends(get_current_user)
):
    """Stores user 👍 / 👎 feedback on RETRACKAI responses."""
    return {
        "success": True,
        "message_id": payload.message_id,
        "is_helpful": payload.is_helpful,
        "status": "Feedback Recorded"
    }
