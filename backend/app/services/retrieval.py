import sqlite3
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.database import get_db_connection

class LexicalRetrievalService:
    def __init__(self):
        self.vectorizer = None
        self.chunk_ids = []
        self.chunks_data = []
        self.tfidf_matrix = None
        self._build_index()

    def _build_index(self):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
        SELECT c.id, c.document_id, c.investigation_id, c.page_number, c.section_heading, c.text,
               d.title as doc_title, d.source_url, d.doi
        FROM document_chunks c
        JOIN documents d ON c.document_id = d.id
        ORDER BY c.document_id, c.chunk_index;
        """)
        rows = cur.fetchall()
        conn.close()

        if not rows:
            return

        corpus = []
        self.chunk_ids = []
        self.chunks_data = []

        for r in rows:
            self.chunk_ids.append(r["id"])
            item = {
                "chunk_id": r["id"],
                "document_id": r["document_id"],
                "investigation_id": r["investigation_id"],
                "page_number": r["page_number"],
                "section_heading": r["section_heading"],
                "text": r["text"],
                "document_title": r["doc_title"],
                "source_url": r["source_url"],
                "doi": r["doi"]
            }
            self.chunks_data.append(item)
            # Combine heading, title, and body for robust retrieval
            combined_text = f"{r['doc_title']} {r['section_heading'] or ''} {r['text']}"
            corpus.append(combined_text)

        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)

    def search(self, query: str, top_k: int = 5, investigation_ids: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        if not self.vectorizer or self.tfidf_matrix is None or not self.chunks_data:
            self._build_index()
            if not self.chunks_data:
                return []

        query_vec = self.vectorizer.transform([query])
        scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        results = []
        for idx, score in enumerate(scores):
            if score > 0.01:
                item = self.chunks_data[idx]
                if investigation_ids and item["investigation_id"] and item["investigation_id"] not in investigation_ids:
                    continue
                snippet = item["text"]
                if len(snippet) > 280:
                    snippet = snippet[:280] + "..."
                results.append({
                    "chunk_id": item["chunk_id"],
                    "document_id": item["document_id"],
                    "investigation_id": item["investigation_id"],
                    "document_title": item["document_title"],
                    "page_number": item["page_number"],
                    "section_heading": item["section_heading"],
                    "text_snippet": snippet,
                    "full_text": item["text"],
                    "relevance_score": round(float(score), 4),
                    "source_url": item["source_url"],
                    "doi": item["doi"]
                })

        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        return results[:top_k]

_retrieval_service = None

def get_retrieval_service() -> LexicalRetrievalService:
    global _retrieval_service
    if _retrieval_service is None:
        _retrieval_service = LexicalRetrievalService()
    return _retrieval_service
