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

export interface AssistantAskResponse {
  answer: string;
  status: string;
  citations: Citation[];
  limitations: string[];
  retrieval_method: string;
  is_offline_fallback: boolean;
}
