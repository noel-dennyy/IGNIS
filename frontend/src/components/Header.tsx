import React from "react";
import { Database, ShieldCheck, ExternalLink } from "lucide-react";
import type { PageId } from "./Sidebar";

interface HeaderProps {
  activePage: PageId;
  dbStatus: string;
  investigationCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activePage, dbStatus, investigationCount }) => {
  const pageTitles: Record<PageId, string> = {
    overview: "Command Center & Research Overview",
    investigations: "NASA PSI Investigation Explorer",
    library: "Microgravity Scientific Research Library",
    compare: "Multi-Investigation Comparability Matrix",
    ranking: "Transparent Evidence-Relevance Ranking",
    assistant: "Citation-Grounded AI Research Assistant",
    scenario: "Mission Scenario & Spacecraft Safety Explorer",
    viz: "Scientific Visualization Dashboard",
    gallery: "Experiment Image Gallery",
    "image-compare": "Side-by-Side Image Comparison",
    workspace: "Experiment Comparison Workspace",
  };

  return (
    <header className="top-header">
      <div>
        <h1 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)" }}>
          {pageTitles[activePage]}
        </h1>
      </div>

      <div className="header-status">
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>Database: {dbStatus} ({investigationCount} Investigations)</span>
        </div>

        <a
          href="https://psi.nasa.gov/physci/repo"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ fontSize: "0.78rem", padding: "4px 10px" }}
        >
          <Database size={14} />
          <span>NASA PSI Repository</span>
          <ExternalLink size={12} />
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-dim)", fontSize: "0.75rem" }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>CC0-1.0 Verified</span>
        </div>
      </div>
    </header>
  );
};
