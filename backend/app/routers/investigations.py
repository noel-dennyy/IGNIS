import json
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.database import get_db_connection
from app.schemas import InvestigationSummary, InvestigationDetail

router = APIRouter(tags=["Investigations"])

@router.get("/api/investigations", response_model=List[InvestigationSummary])
def list_investigations(
    research_area: Optional[str] = None,
    platform: Optional[str] = None
):
    conn = get_db_connection()
    cur = conn.cursor()

    query = "SELECT id, external_id, name, doi, platform, research_area, subresearch_area, gravity_regime, source_url, source_version FROM investigations WHERE 1=1"
    params = []
    if research_area:
        query += " AND research_area = ?"
        params.append(research_area)
    if platform:
        query += " AND platform LIKE ?"
        params.append(f"%{platform}%")

    query += " ORDER BY external_id;"
    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()

    return [InvestigationSummary(**dict(r)) for r in rows]

@router.get("/api/investigations/{id}", response_model=InvestigationDetail)
def get_investigation(id: str):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM investigations WHERE id = ? OR external_id = ?;", (id, id))
    inv_row = cur.fetchone()
    if not inv_row:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Investigation '{id}' not found.")

    inv_data = dict(inv_row)

    # Fetch source files
    cur.execute("SELECT id, title, file_name, file_type, file_size_bytes, source_url, license, sha256 FROM source_files WHERE investigation_id = ?;", (inv_data["id"],))
    source_files = [dict(r) for r in cur.fetchall()]

    # Fetch documents
    cur.execute("SELECT id, title, authors, publication_date, doi, source_url, document_type FROM documents WHERE investigation_id = ?;", (inv_data["id"],))
    documents = [dict(r) for r in cur.fetchall()]

    # Observation count
    cur.execute("SELECT count(*) FROM observations WHERE investigation_id = ?;", (inv_data["id"],))
    obs_count = cur.fetchone()[0]

    conn.close()

    fuels = []
    if inv_data.get("fuels_tested_json"):
        try:
            fuels = json.loads(inv_data["fuels_tested_json"])
        except Exception:
            fuels = []

    return InvestigationDetail(
        id=inv_data["id"],
        external_id=inv_data["external_id"],
        name=inv_data["name"],
        doi=inv_data.get("doi"),
        platform=inv_data["platform"],
        research_area=inv_data["research_area"],
        subresearch_area=inv_data["subresearch_area"],
        gravity_regime=inv_data["gravity_regime"],
        source_url=inv_data["source_url"],
        source_version=inv_data.get("source_version"),
        description=inv_data["description"],
        facility=inv_data.get("facility"),
        nasa_center=inv_data["nasa_center"],
        license=inv_data["license"],
        source_updated_at=inv_data.get("source_updated_at"),
        apparatus=inv_data.get("apparatus"),
        fuels_tested=fuels,
        source_files=source_files,
        documents=documents,
        observation_count=obs_count
    )
