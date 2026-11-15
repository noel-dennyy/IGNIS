import React from "react";
import { Database, ShieldCheck, ExternalLink, Sun, Moon, MapPin, Activity } from "lucide-react";
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
      title: "Command Center & Research Overview",
      subtitle: "NASA Physical Sciences Informatics (PSI) Microgravity Combustion Intelligence"
    },
    investigations: {
      title: "NASA PSI Investigation Explorer",
      subtitle: "Flight Experiment Telemetry, Fuel Types & Scientific Metadata"
    },
    library: {
      title: "Microgravity Scientific Research Library",
      subtitle: "Full-Text Publications, NTRS Citations & Semantic Evidence Records"
    },
    compare: {
      title: "Multi-Investigation Comparability Matrix",
      subtitle: "Cross-Payload Rigorous Physical & Environmental Parameter Matching"
    },
    ranking: {
      title: "Transparent Evidence-Relevance Ranking",
      subtitle: "Formula-Grounded Relevance Scoring with Explicit Attribution"
    },
    assistant: {
      title: "Citation-Grounded AI Research Assistant",
      subtitle: "Autonomous Spacecraft Fire Safety & Combustion Query Engine"
    },
    scenario: {
      title: "Mission Scenario & Spacecraft Safety Explorer",
      subtitle: "Deep Space Habitat, Lunar Gateway & ISS Emergency Flame Spread Analysis"
    },
    viz: {
      title: "Scientific Visualization Dashboard",
      subtitle: "Time-Dependent Thermocouple Curves, Droplet Regressions & Spread Rates"
    },
    gallery: {
      title: "Experiment Image Gallery",
      subtitle: "NASA Optical, Color & Infrared Microgravity Flame Imagery"
    },
    "image-compare": {
      title: "Side-by-Side Image Comparison",
      subtitle: "Synchronized Microgravity Flame Morphology & Spread Inspection"
    },
    workspace: {
      title: "Experiment Comparison Workspace",
      subtitle: "Multi-Investigation Telemetry Synthesis & Environmental Divergence"
    },
    "evidence-gap": {
      title: "Microgravity Evidence Gap Heatmap",
      subtitle: "Tested vs. Untested Environmental Regimes across NASA Flight Missions"
    }
  };

  const current = pageTitles[activePage] ?? { title: activePage, subtitle: "Scientific Intelligence" };

  return (
    <header className="top-header">
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ 
            fontFamily: "var(--font-mono)", 
            fontSize: "0.72rem", 
            color: "var(--accent-molten)", 
            padding: "2px 6px", 
            background: "rgba(255,118,38,0.12)", 
            borderRadius: "4px",
            border: "1px solid rgba(255,118,38,0.25)"
          }}>
            SYS://{activePage.toUpperCase()}
          </span>
          <h1 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.01em" }}>
            {current.title}
          </h1>
        </div>
        <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
          {current.subtitle}
        </p>
      </div>

      <div className="header-status">
        {/* Environment Telemetry */}
        <div className="telemetry-chip" title="Flight Facility Microgravity Condition">
          <Activity size={12} color="var(--accent-cyan)" />
          <span>µg: 10⁻⁶g (CIR/MSG)</span>
        </div>

        {/* Database Status Indicator */}
        <div className="status-indicator" title="NASA PSI Telemetry Database Connection">
          <div className="status-dot"></div>
          <span>PSI DB: {dbStatus} [{investigationCount} FLIGHT INV]</span>
        </div>

        {/* Tour button */}
        <button className="tour-btn" onClick={onStartTour} title="Start guided mission tour">
          <MapPin size={13} />
          <span>Tour</span>
        </button>

        {/* Theme toggle */}
        <button 
          className="theme-toggle" 
          onClick={onToggleTheme} 
          title={lightMode ? "Switch to dark mode" : "Switch to light mode"}
        >
          {lightMode ? <Moon size={13} /> : <Sun size={13} />}
          <span>{lightMode ? "Dark" : "Light"}</span>
        </button>

        {/* External PSI Link */}
        <a
          href="https://psi.nasa.gov/physci/repo"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ fontSize: "0.76rem", padding: "5px 11px", gap: "6px" }}
          title="Open official NASA Physical Sciences Informatics repository"
        >
          <Database size={13} color="var(--accent-cyan)" />
          <span>NASA PSI</span>
          <ExternalLink size={11} />
        </a>

        {/* Verified Data Badge */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "5px", 
            color: "var(--color-success)", 
            fontSize: "0.74rem", 
            fontFamily: "var(--font-mono)",
            padding: "4px 8px",
            background: "rgba(16, 185, 129, 0.08)",
            borderRadius: "4px",
            border: "1px solid rgba(16, 185, 129, 0.2)"
          }}
          title="Verified NASA Public Domain Data (CC0-1.0)"
        >
          <ShieldCheck size={13} />
          <span>CC0-1.0</span>
        </div>
      </div>
    </header>
  );
};
