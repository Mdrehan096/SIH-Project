import math
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any
from app.core.security import get_current_user

router = APIRouter(prefix="/distance", tags=["Distance & Route Analysis"])

STATION_COORDINATES = {
    "NDLS": {"name": "New Delhi", "lat": 28.6139, "lon": 77.2090, "division": "Delhi Division"},
    "GZB": {"name": "Ghaziabad Junction", "lat": 28.6692, "lon": 77.4538, "division": "Delhi Division"},
    "ALJN": {"name": "Aligarh Junction", "lat": 27.8974, "lon": 78.0880, "division": "Prayagraj Division"},
    "TDL": {"name": "Tundla Junction", "lat": 27.2066, "lon": 78.2407, "division": "Prayagraj Division"},
    "AGC": {"name": "Agra Cantt", "lat": 27.1577, "lon": 78.0076, "division": "Agra Division"},
    "CNB": {"name": "Kanpur Central", "lat": 26.4542, "lon": 80.3500, "division": "Prayagraj Division"},
    "PRYJ": {"name": "Prayagraj Junction", "lat": 25.4358, "lon": 81.8463, "division": "Prayagraj Division"},
    "LKO": {"name": "Lucknow Charbagh", "lat": 26.8306, "lon": 80.9208, "division": "Lucknow Division"},
    "UMB": {"name": "Ambala Cantt", "lat": 30.3400, "lon": 76.8400, "division": "Ambala Division"},
    "MB": {"name": "Moradabad Junction", "lat": 28.8350, "lon": 78.7750, "division": "Moradabad Division"},
}


class DistanceRequest(BaseModel):
    origin_code: str
    destination_code: str


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0  # Earth's radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


@router.post("/calculate", response_model=Dict[str, Any])
async def calculate_distance(payload: DistanceRequest, current_user: dict = Depends(get_current_user)):
    orig_key = payload.origin_code.upper()
    dest_key = payload.destination_code.upper()

    if orig_key not in STATION_COORDINATES or dest_key not in STATION_COORDINATES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Station code not found. Available codes: {list(STATION_COORDINATES.keys())}",
        )

    st1 = STATION_COORDINATES[orig_key]
    st2 = STATION_COORDINATES[dest_key]

    straight_km = haversine_distance_km(st1["lat"], st1["lon"], st2["lat"], st2["lon"])
    # Railway tracks follow curvature and terrain (~1.18x factor)
    railway_route_km = round(straight_km * 1.18, 1) if straight_km > 0 else 0.0
    est_hours = round(railway_route_km / 80.0, 1)  # ~80 km/h avg train speed

    return {
        "origin": {"code": orig_key, "name": st1["name"], "lat": st1["lat"], "lon": st1["lon"], "division": st1["division"]},
        "destination": {"code": dest_key, "name": st2["name"], "lat": st2["lat"], "lon": st2["lon"], "division": st2["division"]},
        "straight_line_km": round(straight_km, 1),
        "railway_route_km": railway_route_km,
        "estimated_travel_hours": est_hours,
        "calculation_method": "Geographical Haversine + Railway Track Curvature Factor (1.18x)",
    }
