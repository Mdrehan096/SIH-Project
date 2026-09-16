"""
RETRACKAI Query Rewriter Service
Rewrites conversational follow-up questions into standalone queries before RAG retrieval.
"""

import re
from typing import List, Dict, Any, Optional


class QueryRewriter:
    """Rewrites follow-up queries using conversation history context."""

    PRONOUNS = ["it", "this", "that", "them", "these", "those", "they", "its"]

    def rewrite(self, query: str, conversation_history: Optional[List[Dict[str, Any]]] = None) -> str:
        q_lower = query.lower().strip()

        if not conversation_history:
            return query

        # Check if query contains follow-up pronouns or short ambiguous phrases
        has_pronoun = any(re.search(rf"\b{p}\b", q_lower) for p in self.PRONOUNS)
        is_short_followup = len(query.split()) <= 4 and any(w in q_lower for w in ["why", "how", "what", "next", "after"])

        if not (has_pronoun or is_short_followup):
            return query

        # Extract last subject topic from previous conversation
        last_topic = self._extract_last_topic(conversation_history)
        if not last_topic:
            return query

        # Rewrite follow-up query into standalone query
        if "why" in q_lower and ("needed" in q_lower or "used" in q_lower):
            return f"Why is {last_topic} needed in the RETRACK railway maintenance system?"
        elif "how" in q_lower and ("work" in q_lower or "connect" in q_lower):
            return f"How does {last_topic} work in the RETRACK railway maintenance system?"
        elif "after" in q_lower or "next" in q_lower:
            return f"What happens after {last_topic} in the RETRACK railway maintenance workflow?"

        # Default pronoun substitution
        for p in self.PRONOUNS:
            query = re.sub(rf"\b{p}\b", last_topic, query, flags=re.IGNORECASE)

        return query

    def _extract_last_topic(self, history: List[Dict[str, Any]]) -> Optional[str]:
        # Iterate backwards through assistant or user messages
        for msg in reversed(history):
            content = msg.get("content", "").lower()
            if "cp-sat" in content:
                return "CP-SAT optimization"
            elif "risk score" in content or "predictive risk" in content:
                return "predictive risk scoring"
            elif "bundling" in content or "5 km" in content:
                return "5 km spatial bundling"
            elif "tdms" in content or "defect" in content:
                return "TDMS track defects"
            elif "tms" in content:
                return "TMS civil engineering"
            elif "digital pn" in content or "pn code" in content:
                return "Digital PN handshake"
            elif "coa" in content or "train" in content:
                return "COA train tracking"
        return None


query_rewriter = QueryRewriter()
