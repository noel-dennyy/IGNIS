from fastapi import APIRouter, HTTPException
from app.schemas import RankRequest, RankResponse
from app.services.ranking import get_ranking_service

router = APIRouter(tags=["Ranking"])

@router.post("/api/rank", response_model=RankResponse)
def rank_evidence(req: RankRequest):
    if not req.scenario_or_query.strip():
        raise HTTPException(status_code=400, detail="Scenario or query must not be empty.")

    service = get_ranking_service()
    result = service.rank_evidence(
        scenario_or_query=req.scenario_or_query,
        target_gravity=req.target_gravity,
        target_material_type=req.target_material_type,
        min_o2_percent=req.min_o2_percent,
        max_o2_percent=req.max_o2_percent
    )

    return RankResponse(**result)
