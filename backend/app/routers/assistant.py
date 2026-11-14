from fastapi import APIRouter, HTTPException
from app.schemas import AssistantAskRequest, AssistantAskResponse
from app.services.assistant import get_assistant_service

router = APIRouter(tags=["Assistant"])

@router.post("/api/assistant/ask", response_model=AssistantAskResponse)
def ask_assistant(req: AssistantAskRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    service = get_assistant_service()
    result = service.answer_question(
        question=req.question,
        investigation_ids=req.investigation_ids,
        top_k=req.top_k or 5
    )

    return AssistantAskResponse(**result)
