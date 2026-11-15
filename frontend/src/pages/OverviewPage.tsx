import React, { useEffect, useState } from "react";
import type { OverviewResponse } from "../types";
import { api } from "../api/client";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import {
  Layers,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Sparkles,
  Flame,
  Activity,
  BarChart2,
  SplitSquareHorizontal,
  MessageSquare,
  ShieldCheck,
  Radio
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
      <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-secondary)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-mono)" }}>
          <Flame size={20} className="brand-flame-icon" />
          <span>INITIALIZING IGNIS COMBUSTION INTELLIGENCE CORE...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "40px", color: "var(--color-error)", fontFamily: "var(--font-mono)" }}>
        [ALERT] Failed to load overview data: {error || "Unknown error"}
      </div>
    );
  }

  return (
    <div>
      <DisclaimerBanner text={data.disclaimer} />

      {/* Cinematic Command Center Hero */}
      <div 
        className="card hud-panel" 
        style={{ 
          background: "linear-gradient(135deg, rgba(17,24,32,0.95) 0%, rgba(25,35,45,0.85) 100%)",
          marginBottom: "24px",
          padding: "28px 32px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ maxWidth: "800px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span className="badge badge-molten">
                <Flame size={12} />
                NASA PSI INTELLIGENCE
              </span>
              <span className="badge badge-cyan">
                <Activity size={12} />
                MICROGRAVITY COMBUSTION LAB
              </span>
              <span className="badge badge-green">
                <ShieldCheck size={12} />
                NASA FLAME IN FREEFALL 2026
              </span>
            </div>

            <h2 style={{ 
              fontSize: "1.75rem", 
              fontWeight: 800, 
              color: "var(--text-primary)", 
              letterSpacing: "-0.01em",
              marginBottom: "10px",
              lineHeight: 1.2
            }}>
              Autonomous Microgravity Combustion Research &amp; Spacecraft Fire Safety Intelligence
            </h2>

            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>
              Comprehensive synthesis platform indexing verified NASA Physical Sciences Informatics (PSI) flight records across 
              the ISS Combustion Integrated Rack (CIR), Microgravity Science Glovebox (MSG), and Cygnus spaceflight missions. 
              Extracts extinction limits, soot emission thresholds, and laminar flame spread kinetics.
            </p>

            {/* Quick-Launch Action HUD */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button 
                className="btn btn-primary"
                onClick={() => onNavigate("assistant")}
              >
                <MessageSquare size={16} />
                <span>Query AI Assistant</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => onNavigate("viz")}
              >
                <BarChart2 size={16} />
                <span>Scientific Telemetry</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => onNavigate("image-compare")}
              >
                <SplitSquareHorizontal size={16} />
                <span>Image Comparison</span>
              </button>

              <button 
                className="btn btn-outline"
                onClick={() => onNavigate("investigations")}
              >
                <Layers size={16} />
                <span>Explore All 5 Payloads</span>
              </button>
            </div>
          </div>

          {/* Environmental Telemetry Diagnostic Box */}
          <div style={{
            background: "rgba(8, 11, 16, 0.7)",
            border: "1px solid var(--border-color)",
            borderRadius: "6px",
            padding: "16px 20px",
            minWidth: "260px",
            fontFamily: "var(--font-mono)"
          }}>
            <div style={{ 
              fontSize: "0.72rem", 
              color: "var(--accent-amber)", 
              fontWeight: 700, 
              letterSpacing: "0.08em", 
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span>FACILITY TELEMETRY</span>
              <Radio size={12} className="brand-flame-icon" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.76rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-dim)" }}>GRAVITY:</span>
                <span style={{ color: "var(--accent-cyan)" }}>10⁻⁶ g (Orbital µg)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-dim)" }}>BUOYANCY:</span>
                <span style={{ color: "var(--accent-molten)" }}>SUPPRESSED (Gr ≈ 0)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-dim)" }}>FLIGHT LABS:</span>
                <span style={{ color: "var(--text-primary)" }}>ISS CIR / MSG / Cygnus</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-dim)" }}>OXIDIZER:</span>
                <span style={{ color: "var(--accent-cyan)" }}>16.0% – 40.0% O₂</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-dim)" }}>PROVENANCE:</span>
                <span style={{ color: "var(--color-success)" }}>NASA PSI / CC0-1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">Flight Investigations</div>
          <div className="stat-val">{data.investigation_count}</div>
          <div className="stat-sub">FLEX, FLEX-2, SAFFIRE-I, SPICE, BASS</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Source Documents</div>
          <div className="stat-val cyan">{data.source_document_count}</div>
          <div className="stat-sub">NASA TM &amp; Peer-Reviewed Papers</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Indexed Chunks</div>
          <div className="stat-val">{data.document_chunk_count}</div>
          <div className="stat-sub">Paragraph &amp; Table Indexed</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Verified Telemetry Runs</div>
          <div className="stat-val cyan">{data.observation_count}</div>
          <div className="stat-sub">Combustion Sensor Datapoints</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Scientific Findings</div>
          <div className="stat-val">{data.findings_count}</div>
          <div className="stat-sub">Traceable to Official DOIs</div>
        </div>
      </div>

      {/* Featured Insight Card */}
      <div className="card hud-panel" style={{ borderLeft: "3px solid var(--accent-molten)" }}>
        <div className="card-header">
          <div className="card-title">
            <Sparkles size={18} color="var(--accent-molten)" />
            <span>Featured Microgravity Discovery: {data.featured_insight.title}</span>
          </div>
          <span className="badge badge-molten">{data.featured_insight.investigation_id}</span>
        </div>

        <p style={{ fontSize: "0.92rem", color: "var(--text-primary)", lineHeight: 1.6, marginBottom: "16px" }}>
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
          <div style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a
              href={`https://doi.org/${data.featured_insight.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "4px 10px" }}
            >
              <span>View DOI Record</span>
              <ExternalLink size={12} />
            </a>
            <a
              href={data.featured_insight.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "4px 10px" }}
            >
              <span>NASA PSI Repository Entry</span>
              <ExternalLink size={12} />
            </a>
            <button
              className="btn btn-secondary"
              style={{ fontSize: "0.75rem", padding: "4px 10px" }}
              onClick={() => {
                onSelectInvestigation(data.featured_insight.investigation_id);
                onNavigate("investigations");
              }}
            >
              <span>Inspect Investigation Telemetry</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Ingested Investigations & Scientific Principles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "22px" }}>
        {/* Left Column: Primary Investigations */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers size={18} color="var(--accent-cyan)" />
              <span>NASA Flight Investigations (5 Active Payloads)</span>
            </div>
            <button
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "4px 10px" }}
              onClick={() => onNavigate("investigations")}
            >
              <span>View Explorer</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* PSI-69 */}
            <div
              style={{
                padding: "14px",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                transition: "border-color 0.2s ease, transform 0.15s ease"
              }}
              onClick={() => {
                onSelectInvestigation("PSI-69");
                onNavigate("investigations");
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>FLEX (PSI-69)</span>
                <span className="badge badge-cyan">ISS CIR / MDCA</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Flame Extinguishment Experiment — Spherical droplet burning rates (K), d² law regressions, and gaseous suppressants (CO₂, He, SF₆).
              </div>
              <div style={{ fontSize: "0.73rem", color: "var(--text-dim)", marginTop: "6px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/mbq8-0451 · 24 Verified Droplet Runs
              </div>
            </div>

            {/* PSI-70 */}
            <div
              style={{
                padding: "14px",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                cursor: "pointer"
              }}
              onClick={() => {
                onSelectInvestigation("PSI-70");
                onNavigate("investigations");
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>FLEX-2 (PSI-70)</span>
                <span className="badge badge-cyan">ISS CIR / MDCA</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Flame Extinguishment Experiment-2 — Binary multicomponent fuels (heptane/hexadecane), preferential vaporization, and cool flame regime.
              </div>
              <div style={{ fontSize: "0.73rem", color: "var(--text-dim)", marginTop: "6px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/y812-q943 · 20 Binary Droplet Runs
              </div>
            </div>

            {/* PSI-98 */}
            <div
              style={{
                padding: "14px",
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
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>SAFFIRE-I (PSI-98)</span>
                <span className="badge badge-molten">Cygnus Spacecraft</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Spacecraft Fire Safety Experiment-I — Large-scale fabric flame spread (0.4 m × 0.94 m SIBAL cotton-fiberglass) under 20 cm/s forced flow.
              </div>
              <div style={{ fontSize: "0.73rem", color: "var(--text-dim)", marginTop: "6px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/0t15-1z43 · 18 Flight Telemetry Points
              </div>
            </div>

            {/* PSI-107 */}
            <div
              style={{
                padding: "14px",
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
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>SPICE (PSI-107)</span>
                <span className="badge badge-amber">ISS CIR / ACME</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Smoke Point in Co-flow Experiment — Gaseous hydrocarbon jet diffusion flames and soot emission thresholds under low strain.
              </div>
              <div style={{ fontSize: "0.73rem", color: "var(--text-dim)", marginTop: "6px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/9kbh-e962 · 16 Smoke Point Tests
              </div>
            </div>

            {/* PSI-108 */}
            <div
              style={{
                padding: "14px",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                cursor: "pointer"
              }}
              onClick={() => {
                onSelectInvestigation("PSI-108");
                onNavigate("investigations");
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>BASS (PSI-108)</span>
                <span className="badge badge-molten">ISS MSG Glovebox</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Burning and Suppression of Solids — Solid PMMA cylindrical rods, flat slabs, and Cotton-fiberglass limiting oxygen index (LOI) extinction.
              </div>
              <div style={{ fontSize: "0.73rem", color: "var(--text-dim)", marginTop: "6px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/k489-p210 · 20 Verified Burns &amp; LOI Runs
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: How to Interpret Evidence & Physical Laws */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen size={18} color="var(--accent-amber)" />
              <span>Scientific Interpretation &amp; Physical Integrity</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span className="badge badge-amber" style={{ flexShrink: 0, marginTop: "2px" }}>CAUTION</span>
              <div>
                <strong style={{ color: "var(--text-primary)" }}>Microgravity ≠ Lunar / Mars Gravity:</strong> Orbital microgravity (~10⁻⁶ g) eliminates buoyant upward draft. Lunar surface gravity (1/6 g) and Martian gravity (3/8 g) generate weak buoyant flows that shift extinction limits.
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span className="badge badge-flame" style={{ flexShrink: 0, marginTop: "2px" }}>RULE</span>
              <div>
                <strong style={{ color: "var(--text-primary)" }}>Non-Commensurate Physical Metrics:</strong> Droplet regression (mm²/s), fabric flame spread rate (mm/s), PMMA rod regression (mm/s), and smoke point flame length (mm) cannot be placed on a single axis. IGNIS enforces separate physical axes.
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span className="badge badge-cyan" style={{ flexShrink: 0, marginTop: "2px" }}>FACT</span>
              <div>
                <strong style={{ color: "var(--text-primary)" }}>Deterministic Evidence Scoring:</strong> Relevance scores reflect contextual keyword and scenario match strength, not stochastic predictive risk.
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span className="badge badge-green" style={{ flexShrink: 0, marginTop: "2px" }}>VERIFIED</span>
              <div>
                <strong style={{ color: "var(--text-primary)" }}>End-to-End NASA Provenance:</strong> Every observation and citation links to NASA PSI records, official NTRS publications, or peer-reviewed journals under open CC0-1.0 terms.
              </div>
            </div>

            {/* Quick Diagnostic Callout */}
            <div style={{ 
              marginTop: "8px", 
              padding: "12px", 
              background: "var(--bg-elevated)", 
              borderRadius: "6px", 
              border: "1px dashed var(--border-color)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.74rem",
              color: "var(--text-dim)"
            }}>
              <div>// SENSOR TELEMETRY SYNC: 110 FLIGHT RECORDS ACTIVE</div>
              <div>// EXPERIMENTAL IMAGERY: 12 HIGH-RES CALIBRATED FRAMES</div>
              <div>// CHALLENGE: NASA SPACE APPS 2026 // FLAME IN FREEFALL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
