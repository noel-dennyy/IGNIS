import React from "react";
import { Database, ShieldCheck, ExternalLink, Sun, Moon, HelpCircle } from "lucide-react";
import type { PageId } from "./Sidebar";

interface HeaderProps {
  activePage: PageId;
  dbStatus: string;
  investigationCount: number;
  lightMode: boolean;
  onToggleTheme: () => void;
  onStartTour: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  dbStatus,
  investigationCount,
  lightMode,
  onToggleTheme,
  onStartTour
}) => {
  const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
    overview: {
      title: "Research Overview",
      subtitle: "NASA Physical Sciences Informatics synthesis"
    },
    investigations: {
      title: "Investigation Explorer",
      subtitle: "Flight experiment conditions, fuels, and telemetry"
    },
    library: {
      title: "Scientific Research Library",
      subtitle: "Ingested NASA technical publications and reference documents"
    },
    compare: {
      title: "Comparability Matrix",
      subtitle: "Cross-investigation physical parameter compatibility"
    },
    ranking: {
      title: "Evidence Relevance Ranking",
      subtitle: "Transparent, formula-grounded retrieval scores"
    },
    assistant: {
      title: "Research Assistant",
      subtitle: "Citation-grounded microgravity combustion query tool"
    },
    scenario: {
      title: "Mission Scenario Analyzer",
      subtitle: "Spacecraft fire safety & environmental regime evaluation"
    },
    viz: {
      title: "Scientific Telemetry & Charts",
      subtitle: "Experimental measurements from verified flight records"
    },
    gallery: {
      title: "Experiment Imagery",
      subtitle: "Calibrated flame morphology and optical records"
    },
    "image-compare": {
      title: "Image Comparison",
      subtitle: "Side-by-side flame structure & spread inspection"
    },
    workspace: {
      title: "Synthesis Workspace",
      subtitle: "Multi-investigation cross-referencing workspace"
    },
    "evidence-gap": {
      title: "Evidence Gap Heatmap",
      subtitle: "Tested vs. untested environmental regimes across flight data"
    }
  };

  const current = pageTitles[activePage] ?? { title: activePage, subtitle: "" };

  return (
    <header className="top-header">
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
        <h1 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
          {current.title}
        </h1>
        {current.subtitle && (
          <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
            {current.subtitle}
          </span>
        )}
      </div>

      <div className="header-status">
        {/* Real Database Status */}
        <div className="status-indicator" title="SQLite Database Ingestion State">
          <div className="status-dot"></div>
          <span>PSI Data: {dbStatus} ({investigationCount} Investigations)</span>
        </div>

        {/* Guided Tour */}
        <button className="tour-btn" onClick={onStartTour} title="Walkthrough guided tour">
          <HelpCircle size={13} />
          <span>Guide</span>
        </button>

        {/* Theme Toggle */}
        <button 
          className="theme-toggle" 
          onClick={onToggleTheme} 
          title={lightMode ? "Switch to dark theme" : "Switch to light theme"}
        >
          {lightMode ? <Moon size={13} /> : <Sun size={13} />}
          <span>{lightMode ? "Dark" : "Light"}</span>
        </button>

        {/* External NASA PSI Link */}
        <a
          href="https://psi.nasa.gov/physci/repo"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ fontSize: "0.75rem", padding: "4px 9px", gap: "5px" }}
          title="Open official NASA Physical Sciences Informatics repository"
        >
          <Database size={13} color="var(--accent-cyan)" />
          <span>NASA PSI</span>
          <ExternalLink size={11} />
        </a>

        {/* CC0-1.0 Provenance Badge */}
        <div 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "4px", 
            color: "var(--color-success)", 
            fontSize: "0.72rem",
            padding: "3px 7px",
            background: "rgba(16, 185, 129, 0.08)",
            borderRadius: "3px",
            border: "1px solid rgba(16, 185, 129, 0.2)"
          }}
          title="Verified NASA Public Domain Data (CC0-1.0)"
        >
          <ShieldCheck size={12} />
          <span>CC0-1.0</span>
        </div>
      </div>
    </header>
  );
};
