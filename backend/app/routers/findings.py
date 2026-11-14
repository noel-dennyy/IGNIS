from typing import List, Optional
from fastapi import APIRouter, Query
from app.database import get_db_connection
from app.schemas import ResearchFinding

router = APIRouter(tags=["Findings"])

@router.get("/api/findings", response_model=List[ResearchFinding])
def list_findings(
    investigation_id: Optional[str] = None,
    evidence_class: Optional[str] = None,
    limit: int = 50
):
    conn = get_db_connection()
    cur = conn.cursor()

    query = "SELECT * FROM research_findings WHERE 1=1"
    params = []

    if investigation_id:
        query += " AND investigation_id = ?"
        params.append(investigation_id)
    if evidence_class:
        query += " AND evidence_class = ?"
        params.append(evidence_class)

    query += " ORDER BY id LIMIT ?;"
    params.append(limit)

    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()

    return [ResearchFinding(**dict(r)) for r in rows]
