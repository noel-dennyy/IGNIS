import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS, APP_ENV
from app.database import init_db
from app.services.ingest import run_ingestion
from app.routers import (
    health,
    overview,
    investigations,
    documents,
    search,
    observations,
    findings,
    compare,
    ranking,
    assistant,
    sources
)

app = FastAPI(
    title="IGNIS — Microgravity Combustion Intelligence API",
    description="Interactive, source-grounded research intelligence engine indexing NASA Physical Sciences Informatics (PSI) and NTRS microgravity combustion datasets.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if APP_ENV == "development" else CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(overview.router)
app.include_router(investigations.router)
app.include_router(documents.router)
app.include_router(search.router)
app.include_router(observations.router)
app.include_router(findings.router)
app.include_router(compare.router)
app.include_router(ranking.router)
app.include_router(assistant.router)
app.include_router(sources.router)

from starlette.staticfiles import StaticFiles
from pathlib import Path

# Mount compiled React frontend if present
frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="static")

@app.on_event("startup")
def on_startup():
    init_db()
    # Ingest if investigations table is empty
    from app.database import get_db_connection
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT count(*) FROM investigations;")
    count = c.fetchone()[0]
    conn.close()
    if count == 0:
        run_ingestion()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
