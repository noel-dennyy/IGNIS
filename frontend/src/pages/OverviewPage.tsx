import React, { useEffect, useState } from "react";
import type { OverviewResponse } from "../types";
import { api } from "../api/client";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import {
  ExternalLink,
  ArrowRight,
  BookOpen,
  MessageSquare,
  BarChart2,
  SplitSquareHorizontal,
  Layers,
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
      <div style={{ padding: "48px 0", textAlign: "center", color: "var(--text-secondary)" }}>
        Loading verified NASA combustion investigations...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "32px", color: "var(--color-error)" }}>
        Failed to load overview data: {error || "Unknown error"}
      </div>
    );
  }

  return (
    <div>
      <DisclaimerBanner text={data.disclaimer} />

      {/* Page Header & Mission Summary */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ maxWidth: "880px" }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
            Microgravity Combustion Intelligence Platform
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "16px" }}>
            IGNIS synthesizes verified NASA Physical Sciences Informatics (PSI) flight records across the International Space Station
            Combustion Integrated Rack (CIR), Microgravity Science Glovebox (MSG), and Cygnus spacecraft missions.
            Enables reproducible discovery of droplet burning rates, solid fabric flame spread, and gas jet smoke point thresholds.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => onNavigate("assistant")}>
              <MessageSquare size={15} />
              <span>Ask Research Assistant</span>
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate("viz")}>
              <BarChart2 size={15} />
              <span>Scientific Telemetry &amp; Charts</span>
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate("image-compare")}>
              <SplitSquareHorizontal size={15} />
              <span>Compare Flame Images</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Repository Statistics Strip */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">Flight Investigations</div>
          <div className="stat-val accent">{data.investigation_count}</div>
          <div className="stat-sub">FLEX, FLEX-2, SAFFIRE-I, SPICE, BASS</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Verified Telemetry Runs</div>
          <div className="stat-val cyan">{data.observation_count}</div>
          <div className="stat-sub">Individual flight sensor records</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Source Publications</div>
          <div className="stat-val">{data.source_document_count}</div>
          <div className="stat-sub">NASA TM &amp; peer-reviewed papers</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Indexed Findings</div>
          <div className="stat-val">{data.findings_count}</div>
          <div className="stat-sub">Directly traceable to DOIs</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Experimental Imagery</div>
          <div className="stat-val">12</div>
          <div className="stat-sub">Calibrated flame morphology frames</div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px", alignItems: "start" }}>
        
        {/* Left Column: Flight Investigations */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers size={17} color="var(--accent-molten)" />
              <span>Ingested Flight Investigations (5 Payloads)</span>
            </div>
            <button
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "3px 8px" }}
              onClick={() => onNavigate("investigations")}
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            
            {/* PSI-69: FLEX */}
            <div
              style={{
                padding: "12px 14px",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "5px",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                transition: "border-color 0.12s ease"
              }}
              onClick={() => {
                onSelectInvestigation("PSI-69");
                onNavigate("investigations");
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>FLEX (PSI-69)</span>
                <span className="badge badge-cyan">ISS CIR / MDCA</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                Flame Extinguishment Experiment — Spherical isolated droplet burning rates (K), d² law regression, and gaseous suppressants (CO₂, He, SF₆).
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "5px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/mbq8-0451 · 24 Droplet Burns · Heptane &amp; Methanol
              </div>
            </div>

            {/* PSI-70: FLEX-2 */}
            <div
              style={{
                padding: "12px 14px",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "5px",
                border: "1px solid var(--border-color)",
                cursor: "pointer"
              }}
              onClick={() => {
                onSelectInvestigation("PSI-70");
                onNavigate("investigations");
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>FLEX-2 (PSI-70)</span>
                <span className="badge badge-cyan">ISS CIR / MDCA</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                Flame Extinguishment Experiment-2 — Binary multicomponent fuel droplets (heptane/hexadecane), preferential vaporization, and low-temperature cool flames.
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "5px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/y812-q943 · 20 Binary Runs · Cool Flame Kinetics
              </div>
            </div>

            {/* PSI-98: SAFFIRE-I */}
            <div
              style={{
                padding: "12px 14px",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "5px",
                border: "1px solid var(--border-color)",
                cursor: "pointer"
              }}
              onClick={() => {
                onSelectInvestigation("PSI-98");
                onNavigate("investigations");
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>SAFFIRE-I (PSI-98)</span>
                <span className="badge badge-molten">Cygnus OA-6 Spacecraft</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                Spacecraft Fire Safety Experiment-I — Large-scale fabric flame spread (0.4 m × 0.94 m SIBAL cotton-fiberglass) under 20 cm/s forced airflow.
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "5px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/0t15-1z43 · 18 Flight Observations · Duct Thermocouples
              </div>
            </div>

            {/* PSI-107: SPICE */}
            <div
              style={{
                padding: "12px 14px",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "5px",
                border: "1px solid var(--border-color)",
                cursor: "pointer"
              }}
              onClick={() => {
                onSelectInvestigation("PSI-107");
                onNavigate("investigations");
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>SPICE (PSI-107)</span>
                <span className="badge badge-amber">ISS CIR / ACME</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                Smoke Point in Co-flow Experiment — Laminar hydrocarbon jet diffusion flames and soot emission thresholds under microgravity co-flow.
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "5px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/9kbh-e962 · 16 Smoke Point Tests · Ethylene &amp; Propane
              </div>
            </div>

            {/* PSI-108: BASS */}
            <div
              style={{
                padding: "12px 14px",
                backgroundColor: "var(--bg-elevated)",
                borderRadius: "5px",
                border: "1px solid var(--border-color)",
                cursor: "pointer"
              }}
              onClick={() => {
                onSelectInvestigation("PSI-108");
                onNavigate("investigations");
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>BASS (PSI-108)</span>
                <span className="badge badge-purple">ISS MSG Glovebox</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                Burning and Suppression of Solids — PMMA cylindrical rods, flat slabs, and limiting oxygen index (LOI) extinction under variable flow and nitrogen suppression.
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "5px", fontFamily: "var(--font-mono)" }}>
                DOI: 10.60555/k489-p210 · 20 Verified Burns · PMMA &amp; Cotton-Fiberglass
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Featured Research & Interpretation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          
          {/* Featured Insight */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Sparkles size={16} color="var(--accent-molten)" />
                <span>Featured Research Insight</span>
              </div>
              <span className="badge badge-cyan">{data.featured_insight.investigation_id}</span>
            </div>

            <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.88rem", marginBottom: "6px" }}>
              {data.featured_insight.title}
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: "12px" }}>
              {data.featured_insight.summary}
            </p>

            <div className="citation-box">
              <div className="citation-header">
                <span>NASA Reference</span>
                <span style={{ fontFamily: "var(--font-mono)" }}>DOI: {data.featured_insight.doi}</span>
              </div>
              <div className="citation-body">
                "{data.featured_insight.source_citation}"
              </div>
              <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                <a
                  href={`https://doi.org/${data.featured_insight.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ fontSize: "0.72rem", padding: "3px 8px" }}
                >
                  <span>DOI Link</span>
                  <ExternalLink size={11} />
                </a>
                <a
                  href={data.featured_insight.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ fontSize: "0.72rem", padding: "3px 8px" }}
                >
                  <span>PSI Record</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>

          {/* Scientific Interpretation Guidelines */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <BookOpen size={16} color="var(--accent-amber)" />
                <span>Scientific Interpretation Rules</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              <div>
                <strong style={{ color: "var(--text-primary)" }}>Microgravity vs. Planetary Gravity:</strong> Orbital microgravity (~10⁻⁶ g) eliminates buoyant natural convection. Lunar (1/6 g) and Martian (3/8 g) environments introduce weak buoyancy that shifts extinction boundaries.
              </div>

              <div>
                <strong style={{ color: "var(--text-primary)" }}>Incommensurate Physical Quantities:</strong> Droplet burning rates (mm²/s), fabric spread rates (mm/s), and smoke points (mm) represent physically distinct regimes and cannot be plotted on a single quantitative axis.
              </div>

              <div>
                <strong style={{ color: "var(--text-primary)" }}>Transparent Provenance:</strong> Every observation retains direct links to NASA PSI records, original file names, row/time locators, and open CC0-1.0 public domain licensing.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
