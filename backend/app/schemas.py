from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class HealthResponse(BaseModel):
    status: str
    version: str
    database: str
    ingested_investigations: int

class OverviewResponse(BaseModel):
    investigation_count: int
    source_document_count: int
    document_chunk_count: int
    observation_count: int
    findings_count: int
    research_areas: List[str]
    platforms: List[str]
    disclaimer: str
    featured_insight: Dict[str, Any]

class InvestigationSummary(BaseModel):
    id: str
    external_id: str
    name: str
    doi: Optional[str] = None
    platform: str
    research_area: str
    subresearch_area: str
    gravity_regime: str
    source_url: str
    source_version: Optional[str] = None

class InvestigationDetail(InvestigationSummary):
    description: str
    facility: Optional[str] = None
    nasa_center: str
    license: str
    source_updated_at: Optional[str] = None
    apparatus: Optional[str] = None
    fuels_tested: List[str] = []
    source_files: List[Dict[str, Any]] = []
    documents: List[Dict[str, Any]] = []
    observation_count: int = 0

class DocumentSummary(BaseModel):
    id: str
    investigation_id: Optional[str] = None
    title: str
    authors: Optional[str] = None
    publication_date: Optional[str] = None
    journal_or_report: Optional[str] = None
    doi: Optional[str] = None
    source_url: str
    document_type: str
    abstract: Optional[str] = None

class DocumentDetail(DocumentSummary):
    chunks: List[Dict[str, Any]] = []

class SearchResult(BaseModel):
    chunk_id: str
    document_id: str
    investigation_id: Optional[str] = None
    document_title: str
    page_number: Optional[int] = None
    section_heading: Optional[str] = None
    text_snippet: str
    relevance_score: float
    source_url: str
    doi: Optional[str] = None

class ObservationItem(BaseModel):
    id: str
    investigation_id: str
    experiment_run_id: str
    fuel_or_material: str
    gravity_regime: str
    measurement_name: str
    value_numeric: Optional[float] = None
    unit: Optional[str] = None
    extinction_diameter_mm: Optional[float] = None
    suppressant: Optional[str] = None
    suppressant_fraction_pct: Optional[float] = None
    ambient_o2_percent: Optional[float] = None
    pressure_atm: Optional[float] = None
    flow_velocity_cm_s: Optional[float] = None
    peak_temperature_c: Optional[float] = None
    radiant_heat_flux_kw_m2: Optional[float] = None
    outcome_label: Optional[str] = None

class ResearchFinding(BaseModel):
    id: str
    investigation_id: Optional[str] = None
    document_id: Optional[str] = None
    page_number: Optional[int] = None
    section_heading: Optional[str] = None
    finding_text: str
    finding_type: str
    evidence_class: str
    extraction_method: str
    review_status: str
    source_url: Optional[str] = None
    created_at: str

class CompareRequest(BaseModel):
    investigation_ids: List[str]
    selected_observation_ids: Optional[List[str]] = None

class CompareVariableCompatibility(BaseModel):
    variable_name: str
    is_comparable: bool
    reason: str
    units_match: bool
    notes: Optional[str] = None

class CompareResponse(BaseModel):
    is_valid_comparison: bool
    comparability_warning: str
    investigations: List[Dict[str, Any]]
    variables_analysis: List[CompareVariableCompatibility]
    shared_observations: List[Dict[str, Any]]
    recommendation: str

class RankRequest(BaseModel):
    scenario_or_query: str
    target_gravity: Optional[str] = "Microgravity"
    target_material_type: Optional[str] = None
    min_o2_percent: Optional[float] = None
    max_o2_percent: Optional[float] = None

class RankedEvidenceItem(BaseModel):
    id: str
    type: str  # 'investigation' or 'document'
    title: str
    investigation_id: Optional[str] = None
    overall_relevance_score: float
    factor_breakdown: Dict[str, float]
    factor_explanations: List[str]
    matched_conditions: List[str]
    condition_mismatches_or_gaps: List[str]
    evidence_completeness: str  # Documented, Partially documented, Evidence gap
    source_url: str
    doi: Optional[str] = None

class RankResponse(BaseModel):
    query: str
    weighting_model_disclaimer: str
    factors_used: Dict[str, str]
    ranked_items: List[RankedEvidenceItem]
    evidence_gaps_summary: List[str]

class Citation(BaseModel):
    investigation_id: Optional[str] = None
    document_title: str
    page: Optional[int] = None
    section: Optional[str] = None
    excerpt: str
    source_url: str
    doi: Optional[str] = None

class AssistantAskRequest(BaseModel):
    question: str
    investigation_ids: Optional[List[str]] = None
    top_k: Optional[int] = 5

class AssistantAskResponse(BaseModel):
    answer: str
    status: str  # 'answered' or 'insufficient_evidence'
    citations: List[Citation]
    limitations: List[str]
    retrieval_method: str
    is_offline_fallback: bool
