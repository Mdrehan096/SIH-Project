"""
RETRACKAI Intent Classifier
Classifies user query into discrete RETRACK project domain intents.
"""

import re
from typing import Dict, Any


class IntentClassifier:
    """Classifies user queries into discrete RETRACK intents."""

    INTENTS = {
        "PROJECT_OVERVIEW": ["what is retrack", "project overview", "about retrack", "sih 2026", "problem statement"],
        "ARCHITECTURE": ["architecture", "mvc", "layers", "backend", "frontend", "system design"],
        "WORKFLOW": ["workflow", "pipeline", "end to end", "how does retrack work", "process"],
        "MODULE_EXPLANATION": ["tms", "tdms", "smms", "coa", "difference between", "module"],
        "TECHNOLOGY": ["technology", "tech stack", "fastapi", "react", "supabase", "python"],
        "AI_ML": ["ai", "machine learning", "random forest", "predictive risk", "risk score", "ml model"],
        "OPTIMIZATION": ["cp-sat", "or-tools", "optimizer", "bundling", "5 km", "milp", "possession block"],
        "SAFETY": ["safety", "safety buffer", "15 min", "conflict", "collision", "constraint"],
        "DATABASE": ["database", "postgresql", "supabase", "tables", "schema", "sql"],
        "API": ["api", "endpoints", "fastapi", "pydantic", "rest"],
        "FUTURE_SCOPE": ["future scope", "future", "roadmap", "upcoming", "cris", "websocket"],
        "LIMITATIONS": ["limitations", "drawbacks", "constraints", "tradeoffs"],
        "VIVA": ["viva", "presentation", "exam", "prepare me", "interview", "questions"],
        "HISTORY_SEARCH": ["what did i search", "previous question", "asked earlier", "chat history"],
        "GENERAL_PROJECT_QUERY": ["explain", "help", "how to"],
    }

    def classify(self, query: str) -> str:
        q_lower = query.lower().strip()

        # Check keyword intent rules
        for intent, keywords in self.INTENTS.items():
            if any(k in q_lower for k in keywords):
                return intent

        return "GENERAL_PROJECT_QUERY"


intent_classifier = IntentClassifier()
