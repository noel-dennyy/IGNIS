from typing import List, Optional
from fastapi import APIRouter, Query
from app.services.retrieval import get_retrieval_service
from app.schemas import SearchResult

router = APIRouter(tags=["Search"])

@router.get("/api/search", response_model=List[SearchResult])
def search_documents(
    q: str = Query(..., description="Query string to search within indexed NASA documents"),
    investigation_id: Optional[str] = Query(None, description="Optional investigation filter (e.g. PSI-69)"),
    top_k: int = Query(8, ge=1, le=25)
):
    inv_ids = [investigation_id] if investigation_id else None
    retrieval = get_retrieval_service()
    hits = retrieval.search(query=q, top_k=top_k, investigation_ids=inv_ids)

    return [
        SearchResult(
            chunk_id=h["chunk_id"],
            document_id=h["document_id"],
            investigation_id=h.get("investigation_id"),
            document_title=h["document_title"],
            page_number=h.get("page_number"),
            section_heading=h.get("section_heading"),
            text_snippet=h["text_snippet"],
            relevance_score=h["relevance_score"],
            source_url=h["source_url"],
            doi=h.get("doi")
        )
        for h in hits
    ]
