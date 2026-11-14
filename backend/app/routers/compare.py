from fastapi import APIRouter, HTTPException
from app.schemas import CompareRequest, CompareResponse
from app.services.comparison import get_comparison_service

router = APIRouter(tags=["Comparison"])

@router.post("/api/compare", response_model=CompareResponse)
def compare_investigations(req: CompareRequest):
    if not req.investigation_ids:
        raise HTTPException(status_code=400, detail="At least one investigation_id must be provided for comparison.")

    service = get_comparison_service()
    result = service.compare_investigations(
        investigation_ids=req.investigation_ids,
        selected_observation_ids=req.selected_observation_ids
    )

    return CompareResponse(**result)
