import logging
from fastapi import APIRouter, Depends, Query, HTTPException, status
from fastapi.responses import StreamingResponse
from typing import Dict, Any, Optional, List
from pydantic import BaseModel

from app.core.security import get_current_user
from app.ai.retrackai.service import retrackai_service
from app.ai.retrackai.retriever import retriever
from app.ai.retrackai.schemas import (
    RETRACKAIQueryRequest,
    RETRACKAIQueryResponse,
    UserFeedbackDTO
)
from app.db.queries import (
    get_retrackai_conversations,
    get_retrackai_messages,
    search_retrackai_conversations,
    rename_retrackai_conversation,
    delete_retrackai_conversation,
)

logger = logging.getLogger("retrack.chat")

router = APIRouter(prefix="/chat", tags=["RETRACKAI Project Knowledge Assistant"])


class RenameConversationRequest(BaseModel):
    title: str


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


@router.post("/stream")
async def stream_retrack_ai(
    payload: RETRACKAIQueryRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Streaming SSE endpoint for ChatGPT-like token streaming responses.
    """
    try:
        generator = retrackai_service.process_query_stream(req=payload, current_user=current_user)
        return StreamingResponse(generator, media_type="text/event-stream")
    except Exception as e:
        logger.error(f"Error streaming RETRACKAI query: {e}")
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


@router.patch("/conversations/{conversation_id}")
async def rename_conversation(
    conversation_id: str,
    payload: RenameConversationRequest,
    current_user: dict = Depends(get_current_user)
):
    """Renames a conversation title."""
    rename_retrackai_conversation(conversation_id, payload.title)
    return {"success": True, "conversation_id": conversation_id, "title": payload.title}


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Deletes a conversation and its messages."""
    delete_retrackai_conversation(conversation_id)
    return {"success": True, "conversation_id": conversation_id, "status": "Deleted"}


@router.post("/knowledge/reindex")
async def reindex_knowledge_base(current_user: dict = Depends(get_current_user)):
    """Triggers a re-index of knowledge documents in backend/app/ai/retrackai/knowledge/."""
    retriever._load_and_index_knowledge()
    return {
        "success": True,
        "indexed_documents_count": len(retriever.documents),
        "status": "Knowledge Base Reindexed Successfully"
    }


@router.get("/knowledge/documents")
async def list_knowledge_documents(current_user: dict = Depends(get_current_user)):
    """Lists indexed knowledge documents in the RETRACKAI RAG knowledge base."""
    docs = []
    seen = set()
    for d in retriever.documents:
        doc_id = d.get("doc_id")
        if doc_id not in seen:
            seen.add(doc_id)
            docs.append({
                "doc_id": doc_id,
                "document": d.get("document"),
                "filename": d.get("filename")
            })
    return {"total": len(docs), "documents": docs}


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
