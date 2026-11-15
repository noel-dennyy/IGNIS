from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas import AssistantAskRequest, AssistantAskResponse, SessionSummary, SessionDetail, ChatMessage
from app.services.assistant import get_assistant_service
from app.database import get_db_connection

router = APIRouter(tags=["Assistant"])

@router.post("/api/assistant/ask", response_model=AssistantAskResponse)
def ask_assistant(req: AssistantAskRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    service = get_assistant_service()
    result = service.answer_question(
        question=req.question,
        session_id=req.session_id,
        history=req.history,
        investigation_ids=req.investigation_ids,
        top_k=req.top_k or 5
    )

    return AssistantAskResponse(**result)

@router.get("/api/assistant/sessions", response_model=List[SessionSummary])
def list_sessions():
    service = get_assistant_service()
    return service.list_sessions()

@router.get("/api/assistant/sessions/{session_id}", response_model=SessionDetail)
def get_session(session_id: str):
    service = get_assistant_service()
    messages = service.get_session_history(session_id)

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, title, created_at, updated_at FROM conversation_sessions WHERE id = ?;", (session_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found.")

    return SessionDetail(
        id=row["id"],
        title=row["title"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
        messages=messages
    )

@router.delete("/api/assistant/sessions/{session_id}")
def delete_session(session_id: str):
    service = get_assistant_service()
    service.delete_session(session_id)
    return {"status": "deleted", "session_id": session_id}
