import type {
  HealthResponse,
  OverviewResponse,
  InvestigationSummary,
  InvestigationDetail,
  DocumentSummary,
  DocumentDetail,
  SearchResult,
  ObservationItem,
  CompareResponse,
  RankResponse,
  AssistantAskResponse
} from "../types";

const API_BASE = "http://127.0.0.1:8000";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const resp = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`API Error [${resp.status}]: ${errorText || resp.statusText}`);
  }

  return resp.json();
}

export const api = {
  getHealth: () => request<HealthResponse>("/api/health"),
  getOverview: () => request<OverviewResponse>("/api/overview"),
  getInvestigations: (params?: { research_area?: string; platform?: string }) => {
    const q = new URLSearchParams();
    if (params?.research_area) q.append("research_area", params.research_area);
    if (params?.platform) q.append("platform", params.platform);
    return request<InvestigationSummary[]>(`/api/investigations?${q.toString()}`);
  },
  getInvestigationDetail: (id: string) => request<InvestigationDetail>(`/api/investigations/${id}`),
  getDocuments: (investigation_id?: string) => {
    const q = investigation_id ? `?investigation_id=${investigation_id}` : "";
    return request<DocumentSummary[]>(`/api/documents${q}`);
  },
  getDocumentDetail: (id: string) => request<DocumentDetail>(`/api/documents/${id}`),
  search: (query: string, investigation_id?: string, top_k = 8) => {
    const q = new URLSearchParams({ q: query, top_k: top_k.toString() });
    if (investigation_id) q.append("investigation_id", investigation_id);
    return request<SearchResult[]>(`/api/search?${q.toString()}`);
  },
  getObservations: (params?: { investigation_id?: string; fuel_or_material?: string; suppressant?: string; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.investigation_id) q.append("investigation_id", params.investigation_id);
    if (params?.fuel_or_material) q.append("fuel_or_material", params.fuel_or_material);
    if (params?.suppressant) q.append("suppressant", params.suppressant);
    if (params?.limit) q.append("limit", params.limit.toString());
    return request<ObservationItem[]>(`/api/observations?${q.toString()}`);
  },
  compare: (investigation_ids: string[], selected_observation_ids?: string[]) =>
    request<CompareResponse>("/api/compare", {
      method: "POST",
      body: JSON.stringify({ investigation_ids, selected_observation_ids })
    }),
  rank: (scenario_or_query: string, target_gravity = "Microgravity", target_material_type?: string) =>
    request<RankResponse>("/api/rank", {
      method: "POST",
      body: JSON.stringify({ scenario_or_query, target_gravity, target_material_type })
    }),
  askAssistant: (question: string, investigation_ids?: string[], top_k = 5) =>
    request<AssistantAskResponse>("/api/assistant/ask", {
      method: "POST",
      body: JSON.stringify({ question, investigation_ids, top_k })
    })
};
