"""
RETRACKAI Pydantic DTO Schemas
Defines request/response models, conversation items, tool parameters, and feedback schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class ChatActionDTO(BaseModel):
    label: str
    target_path: str
    action_code: Optional[str] = None


class RETRACKAIQueryRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    model: Optional[str] = "gemini-1.5-pro"
    user_role: Optional[str] = "CONTROLLER"
    explainer_mode: Optional[str] = None  # e.g. "ARCHITECTURE", "WORKFLOW", "CP_SAT", "SECURITY"
    summary_mode: Optional[str] = None    # e.g. "30SEC", "1MIN", "2MIN", "5MIN"


class KnowledgeSourceMetadata(BaseModel):
    source: str
    document: str
    section: Optional[str] = None
    module: Optional[str] = None


class RETRACKAIQueryResponse(BaseModel):
    conversation_id: str
    message_id: str
    response: str
    model_used: str = "gemini-1.5-pro"
    data_type: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    sources: List[KnowledgeSourceMetadata] = []
    suggested_actions: List[ChatActionDTO] = []


class ConversationSessionDTO(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: str
    updated_at: str


class ConversationMessageDTO(BaseModel):
    id: str
    conversation_id: str
    role: str  # USER or ASSISTANT
    content: str
    data_type: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    sources: List[KnowledgeSourceMetadata] = []
    created_at: str


class UserFeedbackDTO(BaseModel):
    message_id: str
    is_helpful: bool
    feedback_text: Optional[str] = None
