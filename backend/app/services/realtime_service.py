import logging
from typing import Any, Dict, List
from datetime import datetime, timezone

logger = logging.getLogger("retrack.realtime")


class RealtimeBroadcaster:
    """
    Realtime Event Broadcaster for RETRACK - RailSync-AI.
    Publishes live operational events (train positions, block approvals, PN verifications)
    to Supabase Realtime / WebSockets.
    """

    def __init__(self):
        self.event_history: List[Dict[str, Any]] = []

    def broadcast_event(self, event_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        event = {
            "event_id": f"EVT-{len(self.event_history) + 1:04d}",
            "event_type": event_type,
            "payload": payload,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        self.event_history.append(event)
        logger.info(f"Broadcasted Realtime Event '{event_type}': {payload.get('title', payload.get('block_id', ''))}")
        return event

    def get_recent_events(self, limit: int = 10) -> List[Dict[str, Any]]:
        return self.event_history[-limit:]


realtime_service = RealtimeBroadcaster()
