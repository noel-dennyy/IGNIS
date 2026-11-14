from typing import List, Optional
from fastapi import APIRouter, Query
from app.database import get_db_connection
from app.schemas import ObservationItem

router = APIRouter(tags=["Observations"])

@router.get("/api/observations", response_model=List[ObservationItem])
def list_observations(
    investigation_id: Optional[str] = None,
    fuel_or_material: Optional[str] = None,
    suppressant: Optional[str] = None,
    limit: int = 50
):
    conn = get_db_connection()
    cur = conn.cursor()

    query = "SELECT * FROM observations WHERE 1=1"
    params = []

    if investigation_id:
        query += " AND investigation_id = ?"
        params.append(investigation_id)
    if fuel_or_material:
        query += " AND fuel_or_material LIKE ?"
        params.append(f"%{fuel_or_material}%")
    if suppressant:
        query += " AND suppressant LIKE ?"
        params.append(f"%{suppressant}%")

    query += " ORDER BY id LIMIT ?;"
    params.append(limit)

    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()

    return [ObservationItem(**dict(r)) for r in rows]
