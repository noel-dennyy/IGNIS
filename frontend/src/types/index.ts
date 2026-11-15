export interface HealthResponse {
  status: string;
  version: string;
  database: string;
  ingested_investigations: number;
}

export interface OverviewResponse {
  investigation_count: number;
  source_document_count: number;
  document_chunk_count: number;
  observation_count: number;
  findings_count: number;
  research_areas: string[];
  platforms: string[];
  disclaimer: string;
  featured_insight: {
    title: string;
    investigation_id: string;
    investigation_name: string;
    summary: string;
    source_citation: string;
    doi: string;
    source_url: string;
  };
}

export interface InvestigationSummary {
  id: string;
  external_id: string;
  name: string;
  doi?: string;
  platform: string;
  research_area: string;
  subresearch_area: string;
  gravity_regime: string;
  source_url: string;
  source_version?: string;
}

export interface InvestigationDetail extends InvestigationSummary {
  description: string;
  facility?: string;
  nasa_center: string;
  license: string;
  source_updated_at?: string;
  apparatus?: string;
  fuels_tested: string[];
  source_files: Array<{
    id: string;
    title: string;
    file_name: string;
    file_type: string;
    file_size_bytes?: number;
    source_url: string;
    license: string;
    sha256?: string;
  }>;
  documents: Array<{
    id: string;
    title: string;
    authors?: string;
    publication_date?: string;
    doi?: string;
    source_url: string;
    document_type: string;
  }>;
  observation_count: number;
}

export interface DocumentSummary {
  id: string;
  investigation_id?: string;
  title: string;
  authors?: string;
  publication_date?: string;
  journal_or_report?: string;
  doi?: string;
  source_url: string;
  document_type: string;
  abstract?: string;
}

export interface DocumentDetail extends DocumentSummary {
  chunks: Array<{
    id: string;
    page_number?: number;
    section_heading?: string;
    chunk_index: number;
    text: string;
    word_count?: number;
  }>;
}

export interface SearchResult {
  chunk_id: string;
  document_id: string;
  investigation_id?: string;
  document_title: string;
  page_number?: number;
  section_heading?: string;
  text_snippet: string;
  relevance_score: number;
  source_url: string;
  doi?: string;
}

export interface ObservationItem {
  id: string;
  investigation_id: string;
  experiment_run_id: string;
  fuel_or_material: string;
  gravity_regime: string;
  measurement_name: string;
  value_numeric?: number;
  unit?: string;
  extinction_diameter_mm?: number;
  suppressant?: string;
  suppressant_fraction_pct?: number;
  ambient_o2_percent?: number;
  pressure_atm?: number;
  flow_velocity_cm_s?: number;
  peak_temperature_c?: number;
  radiant_heat_flux_kw_m2?: number;
  outcome_label?: string;
}

export interface CompareVariableCompatibility {
  variable_name: string;
  is_comparable: boolean;
  reason: string;
  units_match: boolean;
  notes?: string;
}

export interface CompareResponse {
  is_valid_comparison: boolean;
  comparability_warning: string;
  investigations: any[];
  variables_analysis: CompareVariableCompatibility[];
  shared_observations: ObservationItem[];
  recommendation: string;
}

export interface RankedEvidenceItem {
  id: string;
  type: string;
  title: string;
  investigation_id?: string;
  overall_relevance_score: number;
  factor_breakdown: {
    topic_relevance: number;
    condition_match: number;
    variable_coverage: number;
    provenance_completeness: number;
  };
  factor_explanations: string[];
  matched_conditions: string[];
  condition_mismatches_or_gaps: string[];
  evidence_completeness: string;
  source_url: string;
  doi?: string;
}

export interface RankResponse {
  query: string;
  weighting_model_disclaimer: string;
  factors_used: Record<string, string>;
  ranked_items: RankedEvidenceItem[];
  evidence_gaps_summary: string[];
}

export interface Citation {
  investigation_id?: string;
  document_title: string;
  page?: number;
  section?: string;
  excerpt: string;
  source_url: string;
  doi?: string;
}

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  status?: string;
  citations?: Citation[];
  limitations?: string[];
  reasoning_steps?: string[];
  suggested_follow_ups?: string[];
  intent?: string;
  created_at?: string;
}

export interface AssistantAskResponse {
  answer: string;
  status: string;
  citations: Citation[];
  limitations: string[];
  retrieval_method: string;
  is_offline_fallback: boolean;
  session_id?: string;
  intent?: string;
  reasoning_steps?: string[];
  suggested_follow_ups?: string[];
}

export interface SessionSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface SessionDetail {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

// ── Experiment Images ────────────────────────────────────────────────────────

export interface ImageAnnotation {
  id: string;
  label: string;
  description: string;
  x_pct: number;
  y_pct: number;
  color?: string;
}

export interface ExperimentImage {
  id: string;
  investigation_id: string;
  title: string;
  description: string;
  file_path: string;
  thumbnail_path?: string;
  observation_time_s?: number;
  gravity_regime: string;
  fuel_or_material: string;
  apparatus: string;
  camera_modality: string;
  resolution?: string;
  source_citation: string;
  doi?: string;
  source_url: string;
  annotations: ImageAnnotation[];
  paired_comparison_id?: string;
  image_type_label: string;
}

export interface ImageCompareResponse {
  image_a: ExperimentImage;
  image_b: ExperimentImage;
  comparison_note: string;
  compatible_for_visual_comparison: boolean;
  shared_investigation: boolean;
}

// ── Visualization ────────────────────────────────────────────────────────────

export interface VizChannel {
  key: string;
  name: string;
  unit: string;
  color: string;
}

export interface TimeSeriesResponse {
  investigation_id: string;
  title: string;
  x_axis: { label: string; unit: string };
  channels: VizChannel[];
  data: Record<string, number | string | null>[];
  source_note: string;
}

export interface ScatterResponse {
  dataset_type: string;
  title: string;
  x_axis: { key: string; label: string; unit: string };
  y_axis: { key: string; label: string; unit: string };
  group_by?: string;
  color_dimension?: string;
  points: Record<string, number | string | null>[];
  source_note: string;
}

export interface DistributionBin {
  bin_min: number;
  bin_max: number;
  count: number;
  label: string;
}

export interface DistributionResponse {
  variable_name: string;
  title: string;
  unit: string;
  bins: DistributionBin[];
  statistics: {
    count: number;
    min: number;
    max: number;
    mean: number;
    median: number;
    std_dev: number;
  };
  source_note: string;
}

export interface HeatmapCell {
  row: string;
  col: string;
  value: number | null;
}

export interface HeatmapResponse {
  heatmap_type: string;
  title: string;
  row_label: string;
  col_label: string;
  value_label: string;
  unit: string;
  cells: HeatmapCell[];
  source_note: string;
}

export interface ScientificInsight {
  view_id: string;
  what_graph_displays: string;
  important_trends: string[];
  differences_between_experiments: string[];
  potential_correlations: string[];
  limitations: string[];
  conclusions_not_drawable: string[];
  source_references: string[];
}
