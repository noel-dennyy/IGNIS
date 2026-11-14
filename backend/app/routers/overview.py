import json
from fastapi import APIRouter
from app.database import get_db_connection
from app.schemas import OverviewResponse

router = APIRouter(tags=["Overview"])

@router.get("/api/overview", response_model=OverviewResponse)
def get_overview():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT count(*) FROM investigations;")
    inv_count = cur.fetchone()[0]

    cur.execute("SELECT count(*) FROM documents;")
    doc_count = cur.fetchone()[0]

    cur.execute("SELECT count(*) FROM document_chunks;")
    chunk_count = cur.fetchone()[0]

    cur.execute("SELECT count(*) FROM observations;")
    obs_count = cur.fetchone()[0]

    cur.execute("SELECT count(*) FROM research_findings;")
    fnd_count = cur.fetchone()[0]

    cur.execute("SELECT DISTINCT research_area FROM investigations;")
    areas = [r[0] for r in cur.fetchall() if r[0]]

    cur.execute("SELECT DISTINCT platform FROM investigations;")
    platforms = [r[0] for r in cur.fetchall() if r[0]]

    conn.close()

    featured_insight = {
        "title": "Low-Temperature Cool Flames in Microgravity",
        "investigation_id": "PSI-69",
        "investigation_name": "Flame Extinguishment Experiment (FLEX)",
        "summary": "Droplet combustion experiments aboard the ISS demonstrated that liquid alkane droplets can continue burning in an invisible, low-temperature regime (600–1000 K) following apparent visual flame extinction. This creates a critical spacecraft safety risk: apparent fire extinguishment without thermal cessation.",
        "source_citation": "Nayagam, V., Dietrich, D. L., Hicks, M. C., & Williams, F. A. (2012). Combustion and Flame, 159(11), 3406-3414.",
        "doi": "10.1016/j.combustflame.2012.06.012",
        "source_url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69"
    }

    disclaimer = (
        "IGNIS RESEARCH NOTICE: This interactive intelligence dashboard indexes archived NASA Physical Sciences Informatics (PSI) "
        "and NASA Technical Reports Server (NTRS) records. It is a research discovery and evidence navigation tool built for the "
        "NASA Space Apps Challenge 2026. It does not provide certified spacecraft fire-safety design approvals or operational suppression procedures."
    )

    return OverviewResponse(
        investigation_count=inv_count,
        source_document_count=doc_count,
        document_chunk_count=chunk_count,
        observation_count=obs_count,
        findings_count=fnd_count,
        research_areas=areas,
        platforms=platforms,
        disclaimer=disclaimer,
        featured_insight=featured_insight
    )
