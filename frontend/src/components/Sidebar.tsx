import React from "react";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  GitCompare,
  TrendingUp,
  MessageSquare,
  ShieldAlert,
  Flame,
  BarChart2,
  Images,
  SplitSquareHorizontal,
  Layers,
  Map,
  Radio
} from "lucide-react";

export type PageId =
  | "overview"
  | "investigations"
  | "library"
  | "compare"
  | "ranking"
  | "assistant"
  | "scenario"
  | "viz"
  | "gallery"
  | "image-compare"
  | "workspace"
  | "evidence-gap";

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const sections = [
    {
      group: "COMMAND & CORE",
      items: [
        { id: "overview", label: "Command Center", icon: LayoutDashboard },
        { id: "investigations", label: "Investigation Explorer", icon: Compass },
        { id: "library", label: "Research Library", icon: BookOpen },
        { id: "assistant", label: "IGNIS AI Assistant", icon: MessageSquare },
      ]
    },
    {
      group: "SCIENTIFIC TELEMETRY",
      items: [
        { id: "viz", label: "Telemetry & Charts", icon: BarChart2 },
        { id: "workspace", label: "Synthesis Workspace", icon: Layers },
        { id: "evidence-gap", label: "Evidence Gap Map", icon: Map },
        { id: "compare", label: "Physical Matrix", icon: GitCompare },
        { id: "ranking", label: "Relevance Ranking", icon: TrendingUp },
      ]
    },
    {
      group: "IMAGERY & SAFETY",
      items: [
        { id: "image-compare", label: "Image Comparison", icon: SplitSquareHorizontal },
        { id: "gallery", label: "Experiment Imagery", icon: Images },
        { id: "scenario", label: "Mission Scenarios", icon: ShieldAlert },
      ]
    }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-badge">
          <Flame size={24} className="brand-flame-icon" />
          <span>IGNIS</span>
        </div>
        <div className="brand-sub">
          // NASA FLAME IN FREEFALL
        </div>
        <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ 
            width: "6px", 
            height: "6px", 
            borderRadius: "50%", 
            background: "var(--accent-molten)",
            boxShadow: "0 0 8px var(--accent-molten)",
            display: "inline-block"
          }} />
          <span style={{ fontSize: "0.68rem", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
            CIR/MSG ONLINE
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="sidebar-nav">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} style={{ marginBottom: "14px" }}>
            <div style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "var(--text-dim)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.08em",
              padding: "4px 12px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span>{sec.group}</span>
              <span style={{ opacity: 0.4 }}>—</span>
            </div>

            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <div
                  key={item.id}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() => setActivePage(item.id as PageId)}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Chamber Status Telemetry Footer */}
      <div className="sidebar-footer">
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "6px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "var(--accent-amber)"
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Radio size={11} />
            DIAGNOSTICS
          </span>
          <span style={{ color: "var(--color-success)" }}>NOMINAL</span>
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.72rem", marginBottom: "2px" }}>
          NASA Space Apps Challenge 2026
        </div>
        <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
          Data: NASA PSI (CC0-1.0)
        </div>
      </div>
    </aside>
  );
};
