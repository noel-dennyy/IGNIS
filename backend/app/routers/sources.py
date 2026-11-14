from typing import Dict, Any
from fastapi import APIRouter, HTTPException
from app.database import get_db_connection

router = APIRouter(tags=["Sources"])

@router.get("/api/sources/{id}")
def get_source_file(id: str) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM source_files WHERE id = ?;", (id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail=f"Source file '{id}' not found in manifest register.")

    return dict(row)
