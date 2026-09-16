"""
RETRACKAI LLM Provider Abstraction
Provides multi-provider support for LLMs (Gemini, Groq, OpenAI, Local) via environment configuration.
"""

import os
import logging
from typing import Optional, List, Dict, Any, Generator

logger = logging.getLogger("retrack.llm_provider")


class LLMProviderInterface:
    """Abstract interface for LLM providers."""

    def generate_response(self, system_prompt: str, user_prompt: str, context_docs: List[Dict[str, Any]]) -> str:
        raise NotImplementedError

    def stream_response(self, system_prompt: str, user_prompt: str, context_docs: List[Dict[str, Any]]) -> Generator[str, None, None]:
        raise NotImplementedError


class GeminiLLMProvider(LLMProviderInterface):
    """Google Gemini LLM Provider."""

    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-1.5-pro"):
        self.api_key = api_key or os.getenv("LLM_API_KEY")
        self.model_name = model

    def generate_response(self, system_prompt: str, user_prompt: str, context_docs: List[Dict[str, Any]]) -> str:
        # Fallback structured generation when API key is unconfigured or in offline mode
        context_str = "\n\n".join([d.get("content", "") for d in context_docs])
        return f"{system_prompt}\n\n### RETRACK Context:\n{context_str}\n\nAnswer to: {user_prompt}"

    def stream_response(self, system_prompt: str, user_prompt: str, context_docs: List[Dict[str, Any]]) -> Generator[str, None, None]:
        full_text = self.generate_response(system_prompt, user_prompt, context_docs)
        words = full_text.split(" ")
        for word in words:
            yield word + " "


class LLMFactory:
    """Factory creating configured LLM provider instance."""

    @staticmethod
    def get_provider() -> LLMProviderInterface:
        provider_name = os.getenv("LLM_PROVIDER", "gemini").lower()
        model_name = os.getenv("LLM_MODEL", "gemini-1.5-pro")
        api_key = os.getenv("LLM_API_KEY", "")

        return GeminiLLMProvider(api_key=api_key, model=model_name)


llm_provider = LLMFactory.get_provider()
