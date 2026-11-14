from fastapi import APIRouter
from app.database import get_db_connection
from app.schemas import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/api/health", response_model=HealthResponse)
def get_health():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT count(*) FROM investigations;")
    inv_count = cur.fetchone()[0]
    conn.close()

    return HealthResponse(
        status="healthy",
        version="1.0.0",
        database="connected",
        ingested_investigations=inv_count
    )
