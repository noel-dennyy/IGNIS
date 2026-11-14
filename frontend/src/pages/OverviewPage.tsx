import React, { useEffect, useState } from "react";
import type { OverviewResponse } from "../types";
import { api } from "../api/client";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import {
  Layers,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Sparkles
} from "lucide-react";
import type { PageId } from "../components/Sidebar";

interface OverviewPageProps {
  onNavigate: (page: PageId) => void;
  onSelectInvestigation: (id: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate, onSelectInvestigation }) => {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getOverview()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        Loading verified NASA combustion records...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "40px", color: "var(--color-error)" }}>
        Failed to load overview data: {error || "Unknown error"}
      </div>
    );
  }

  return (
    <div>
      <DisclaimerBanner text={data.disclaimer} />

      {/* Top Stats Grid */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">Indexed Investigations</div>
          <div className="stat-val">{data.investigation_count}</div>
          <div className="stat-sub">FLEX, SAFFIRE-I, SPICE</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Source Documents</div>
          <div className="stat-val">{data.source_document_count}</div>
          <div className="stat-sub">NASA TM & Peer-Reviewed Papers</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Document Chunks</div>
          <div className="stat-val">{data.document_chunk_count}</div>
          <div className="stat-sub">Paragraph & Page Indexed</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Structured Observations</div>
          <div className="stat-val">{data.observation_count}</div>
          <div className="stat-sub">Verified Sensor Telemetry Points</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Published Findings</div>
          <div className="stat-val">{data.findings_count}</div>
          <div className="stat-sub">Traceable to Official DOIs</div>
        </div>
      </div>

      {/* Featured Insight Card */}
      <div className="card card-elevated" style={{ borderLeft: "4px solid var(--accent-cyan)" }}>
        <div className="card-header">
          <div className="card-title">
            <Sparkles size={18} color="var(--accent-cyan)" />
            <span>Featured Scientific Discovery: {data.featured_insight.title}</span>
          </div>
          <span className="badge badge-cyan">{data.featured_insight.investigation_id}</span>
        </div>

        <p style={{ fontSize: "0.92rem", color: "var(--text-main)", lineHeight: 1.6, marginBottom: "14px" }}>
          {data.featured_insight.summary}
        </p>

        <div className="citation-box">
          <div className="citation-header">
            <span>Primary Reference (NASA Ingested Publication)</span>
            <span style={{ fontFamily: "var(--font-mono)" }}>DOI: {data.featured_insight.doi}</span>
          </div>
          <div className="citation-body">
            "{data.featured_insight.source_citation}"
          </div>
          <div style={{ marginTop: "8px", display: "flex", gap: "12px" }}>
            <a
              href={`https://doi.org/${data.featured_insight.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
            >
              <span>View DOI Record</span>
              <ExternalLink size={12} />
            </a>
            <a
              href={data.featured_insight.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
            >
              <span>NASA PSI Investigation Page</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Ingested Investigations & Scientific Principles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" }}>
        {/* Left Column: Primary Investigations */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers size={18} color="var(--accent-cyan)" />
              <span>Ingested NASA Investigations</span>
            </div>
            <button
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
              onClick={() => onNavigate("investigations")}
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                padding: "12px",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                cursor: "pointer"
              }}
              onClick={() => {
                onSelectInvestigation("PSI-69");
                onNavigate("investigations");
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>FLEX (PSI-69)</span>
                <span className="badge badge-cyan">ISS / CIR / MDCA</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Flame Extinguishment Experiment — Droplet burning rates (K) and gaseous suppressants (CO2, He, SF6).
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/mbq8-0451 · 24 Verified Runs
              </div>
            </div>

            <div
              style={{
                padding: "12px",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                cursor: "pointer"
              }}
              onClick={() => {
                onSelectInvestigation("PSI-98");
                onNavigate("investigations");
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>SAFFIRE-I (PSI-98)</span>
                <span className="badge badge-purple">Cygnus OA-6 Cargo Craft</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Spacecraft Fire Safety Experiment-I — Large-scale fabric flame spread (0.4 m x 0.94 m SIBAL cloth) under 20 cm/s flow.
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/0t15-1z43 · 18 Flight Telemetry Points
              </div>
            </div>

            <div
              style={{
                padding: "12px",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                cursor: "pointer"
              }}
              onClick={() => {
                onSelectInvestigation("PSI-107");
                onNavigate("investigations");
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>SPICE (PSI-107)</span>
                <span className="badge badge-green">ISS / CIR / ACME</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Smoke Point in Co-flow Experiment — Laminar hydrocarbon jet diffusion flames and soot emission thresholds.
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/9kbh-e962 · 16 Smoke Point Tests
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: How to Interpret Evidence */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen size={18} color="var(--accent-purple)" />
              <span>How to Interpret Microgravity Evidence</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <span className="badge badge-caution" style={{ alignSelf: "flex-start", marginTop: "2px" }}>CAUTION</span>
              <div>
                <strong style={{ color: "var(--text-main)" }}>Microgravity ≠ Lunar / Mars Gravity:</strong> Orbital microgravity (~10^-6 g) suppresses natural convection entirely. Lunar surface gravity (1/6 g) and Martian gravity (3/8 g) have weak buoyancy, creating distinct flow regimes.
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span className="badge badge-error" style={{ alignSelf: "flex-start", marginTop: "2px" }}>RULE</span>
              <div>
                <strong style={{ color: "var(--text-main)" }}>Do Not Mix Incomparable Data:</strong> Droplet burning rates (mm^2/s), fabric flame spread rates (mm/s), and smoke point lengths (mm) are physically distinct. IGNIS refuses to plot them on a common axis.
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span className="badge badge-cyan" style={{ alignSelf: "flex-start", marginTop: "2px" }}>FACT</span>
              <div>
                <strong style={{ color: "var(--text-main)" }}>Transparent Evidence Ranking:</strong> Scores indicate relevance to your search query or hypothetical scenario, NOT a prediction of fire risk or safety probability.
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <span className="badge badge-green" style={{ alignSelf: "flex-start", marginTop: "2px" }}>PROVENANCE</span>
              <div>
                <strong style={{ color: "var(--text-main)" }}>Every Observation Traceable:</strong> Every record retains its NASA PSI URL, DOI, file name, row/time locator, and CC0-1.0 license status.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
