from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.database import get_db_connection
from app.schemas import DocumentSummary, DocumentDetail

router = APIRouter(tags=["Documents"])

@router.get("/api/documents", response_model=List[DocumentSummary])
def list_documents(investigation_id: Optional[str] = None):
    conn = get_db_connection()
    cur = conn.cursor()

    if investigation_id:
        cur.execute("SELECT * FROM documents WHERE investigation_id = ? ORDER BY publication_date DESC;", (investigation_id,))
    else:
        cur.execute("SELECT * FROM documents ORDER BY publication_date DESC;")

    rows = cur.fetchall()
    conn.close()

    return [DocumentSummary(**dict(r)) for r in rows]

@router.get("/api/documents/{id}", response_model=DocumentDetail)
def get_document(id: str):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM documents WHERE id = ?;", (id,))
    doc_row = cur.fetchone()
    if not doc_row:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Document '{id}' not found.")

    doc_data = dict(doc_row)

    cur.execute("SELECT id, page_number, section_heading, chunk_index, text, word_count FROM document_chunks WHERE document_id = ? ORDER BY chunk_index;", (id,))
    chunks = [dict(r) for r in cur.fetchall()]
    conn.close()

    return DocumentDetail(
        id=doc_data["id"],
        investigation_id=doc_data.get("investigation_id"),
        title=doc_data["title"],
        authors=doc_data.get("authors"),
        publication_date=doc_data.get("publication_date"),
        journal_or_report=doc_data.get("journal_or_report"),
        doi=doc_data.get("doi"),
        source_url=doc_data["source_url"],
        document_type=doc_data["document_type"],
        abstract=doc_data.get("abstract"),
        chunks=chunks
    )
