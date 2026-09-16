"""
RETRACK – RailSync-AI Digital PN Controller (MVC: Controller Layer)
Manages cryptographic Private Number generation and 2-factor Station Master verification.
"""

from typing import Dict, Any
from app.services.pn_service import pn_service


class PNController:
    """Controller handling Digital PN handshake logic."""

    def generate_pn(self, block_id: str, user_name: str) -> Dict[str, Any]:
        return pn_service.generate_pn(block_id=block_id, user_name=user_name)

    def verify_pn(self, block_id: str, pn_code: str, station_code: str, user_name: str) -> Dict[str, Any]:
        return pn_service.verify_pn(
            block_id=block_id,
            pn_code=pn_code,
            station_code=station_code,
            user_name=user_name
        )

    def get_pn_status(self, block_id: str) -> Dict[str, Any]:
        return pn_service.get_pn_status(block_id=block_id)


pn_controller_instance = PNController()
