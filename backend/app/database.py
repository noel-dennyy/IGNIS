import sqlite3
from typing import Generator
from app.config import DB_PATH

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def get_db() -> Generator[sqlite3.Connection, None, None]:
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS investigations (
        id TEXT PRIMARY KEY,
        external_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        research_area TEXT NOT NULL,
        subresearch_area TEXT NOT NULL,
        platform TEXT NOT NULL,
        facility TEXT,
        nasa_center TEXT NOT NULL,
        doi TEXT,
        license TEXT NOT NULL,
        source_url TEXT NOT NULL,
        source_version TEXT,
        source_updated_at TEXT,
        gravity_regime TEXT NOT NULL,
        apparatus TEXT,
        fuels_tested_json TEXT,
        metadata_json TEXT
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS source_files (
        id TEXT PRIMARY KEY,
        investigation_id TEXT,
        title TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size_bytes INTEGER,
        source_url TEXT NOT NULL,
        local_path TEXT,
        license TEXT NOT NULL,
        sha256 TEXT,
        retrieved_at TEXT,
        parse_status TEXT NOT NULL,
        FOREIGN KEY(investigation_id) REFERENCES investigations(id)
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        investigation_id TEXT,
        title TEXT NOT NULL,
        authors TEXT,
        publication_date TEXT,
        journal_or_report TEXT,
        doi TEXT,
        source_url TEXT NOT NULL,
        document_type TEXT NOT NULL,
        abstract TEXT,
        FOREIGN KEY(investigation_id) REFERENCES investigations(id)
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS document_chunks (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        investigation_id TEXT,
        page_number INTEGER,
        section_heading TEXT,
        chunk_index INTEGER NOT NULL,
        text TEXT NOT NULL,
        word_count INTEGER,
        FOREIGN KEY(document_id) REFERENCES documents(id)
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS observations (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        source_file_id TEXT,
        experiment_run_id TEXT NOT NULL,
        fuel_or_material TEXT NOT NULL,
        gravity_regime TEXT NOT NULL,
        measurement_name TEXT NOT NULL,
        value_numeric REAL,
        unit TEXT,
        extinction_diameter_mm REAL,
        suppressant TEXT,
        suppressant_fraction_pct REAL,
        ambient_o2_percent REAL,
        pressure_atm REAL,
        flow_velocity_cm_s REAL,
        peak_temperature_c REAL,
        radiant_heat_flux_kw_m2 REAL,
        outcome_label TEXT,
        record_locator TEXT,
        raw_metadata_json TEXT,
        FOREIGN KEY(investigation_id) REFERENCES investigations(id)
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS research_findings (
        id TEXT PRIMARY KEY,
        investigation_id TEXT,
        document_id TEXT,
        page_number INTEGER,
        section_heading TEXT,
        finding_text TEXT NOT NULL,
        finding_type TEXT NOT NULL,
        evidence_class TEXT NOT NULL,
        extraction_method TEXT NOT NULL,
        review_status TEXT NOT NULL,
        source_url TEXT,
        created_at TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS ranking_runs (
        id TEXT PRIMARY KEY,
        query_text TEXT NOT NULL,
        factors_json TEXT NOT NULL,
        ranked_evidence_json TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS experiment_images (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        file_path TEXT NOT NULL,
        thumbnail_path TEXT,
        observation_time_s REAL,
        gravity_regime TEXT NOT NULL,
        fuel_or_material TEXT NOT NULL,
        apparatus TEXT NOT NULL,
        camera_modality TEXT NOT NULL,
        resolution TEXT,
        source_citation TEXT NOT NULL,
        doi TEXT,
        source_url TEXT NOT NULL,
        metadata_json TEXT,
        annotations_json TEXT,
        FOREIGN KEY(investigation_id) REFERENCES investigations(id)
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS conversation_sessions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS conversation_messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'answered',
        citations_json TEXT,
        limitations_json TEXT,
        reasoning_steps_json TEXT,
        suggested_follow_ups_json TEXT,
        intent TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(session_id) REFERENCES conversation_sessions(id) ON DELETE CASCADE
    );
    """)

    conn.commit()
    conn.close()
