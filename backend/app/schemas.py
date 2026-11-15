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

class ChatMessage(BaseModel):
    id: Optional[str] = None
    role: str  # 'user', 'assistant', 'system'
    content: str
    status: Optional[str] = "answered"
    citations: List[Citation] = []
    limitations: List[str] = []
    reasoning_steps: List[str] = []
    suggested_follow_ups: List[str] = []
    intent: Optional[str] = None
    created_at: Optional[str] = None

class AssistantAskRequest(BaseModel):
    question: str
    session_id: Optional[str] = None
    history: Optional[List[ChatMessage]] = None
    investigation_ids: Optional[List[str]] = None
    top_k: Optional[int] = 5

class AssistantAskResponse(BaseModel):
    answer: str
    status: str  # 'answered', 'insufficient_evidence', 'conversational', 'clarification'
    citations: List[Citation] = []
    limitations: List[str] = []
    retrieval_method: str
    is_offline_fallback: bool
    session_id: Optional[str] = None
    intent: Optional[str] = None
    reasoning_steps: List[str] = []
    suggested_follow_ups: List[str] = []

class SessionSummary(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str
    message_count: int

class SessionDetail(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str
    messages: List[ChatMessage]


# ── Experiment Images ────────────────────────────────────────────────────────

class ImageAnnotation(BaseModel):
    id: str
    label: str
    description: str
    x_pct: float
    y_pct: float
    color: Optional[str] = "#38BDF8"

class ExperimentImageRecord(BaseModel):
    id: str
    investigation_id: str
    title: str
    description: str
    file_path: str
    thumbnail_path: Optional[str] = None
    observation_time_s: Optional[float] = None
    gravity_regime: str
    fuel_or_material: str
    apparatus: str
    camera_modality: str
    resolution: Optional[str] = None
    source_citation: str
    doi: Optional[str] = None
    source_url: str
    annotations: List[ImageAnnotation] = []
    paired_comparison_id: Optional[str] = None
    image_type_label: str = "Scientific Illustration (Synthetic) — Not a NASA photograph"

class ImageCompareResponse(BaseModel):
    image_a: ExperimentImageRecord
    image_b: ExperimentImageRecord
    comparison_note: str
    compatible_for_visual_comparison: bool
    shared_investigation: bool


# ── Visualization ────────────────────────────────────────────────────────────

class VizChannel(BaseModel):
    key: str
    name: str
    unit: str
    color: str

class TimeSeriesResponse(BaseModel):
    investigation_id: str
    title: str
    x_axis: Dict[str, str]
    channels: List[VizChannel]
    data: List[Dict[str, Any]]
    source_note: str = ""

class ScatterPoint(BaseModel):
    id: str
    fuel_or_material: str
    x: Optional[float] = None
    y: Optional[float] = None
    color_key: Optional[str] = None
    outcome_label: Optional[str] = None
    suppressant: Optional[str] = None
    o2_pct: Optional[float] = None

class ScatterResponse(BaseModel):
    dataset_type: str
    title: str
    x_axis: Dict[str, str]
    y_axis: Dict[str, str]
    color_dimension: Optional[str] = None
    points: List[Dict[str, Any]]
    source_note: str = ""

class DistributionBin(BaseModel):
    bin_min: float
    bin_max: float
    count: int
    label: str

class DistributionResponse(BaseModel):
    variable_name: str
    title: str
    unit: str
    bins: List[Dict[str, Any]]
    statistics: Dict[str, Any]
    source_note: str = ""

class HeatmapCell(BaseModel):
    row: str
    col: str
    value: Optional[float] = None

class HeatmapResponse(BaseModel):
    heatmap_type: str
    title: str
    row_label: str
    col_label: str
    value_label: str
    unit: str
    cells: List[Dict[str, Any]]
    source_note: str = ""

class ScientificInsightsResponse(BaseModel):
    view_id: str
    what_graph_displays: str
    important_trends: List[str]
    differences_between_experiments: List[str]
    potential_correlations: List[str]
    limitations: List[str]
    conclusions_not_drawable: List[str]
    source_references: List[str]
