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
  Map
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
      group: "Core Research",
      items: [
        { id: "overview", label: "Research Overview", icon: LayoutDashboard },
        { id: "investigations", label: "Investigation Explorer", icon: Compass },
        { id: "library", label: "Research Library", icon: BookOpen },
        { id: "assistant", label: "Research Assistant", icon: MessageSquare },
      ]
    },
    {
      group: "Analysis & Telemetry",
      items: [
        { id: "viz", label: "Telemetry & Charts", icon: BarChart2 },
        { id: "workspace", label: "Synthesis Workspace", icon: Layers },
        { id: "evidence-gap", label: "Evidence Gap Map", icon: Map },
        { id: "compare", label: "Comparability Matrix", icon: GitCompare },
        { id: "ranking", label: "Relevance Ranking", icon: TrendingUp },
      ]
    },
    {
      group: "Imagery & Safety",
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
          <Flame size={20} className="brand-flame-icon" />
          <span>IGNIS</span>
        </div>
        <div className="brand-sub">
          Microgravity Combustion Intelligence
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="sidebar-nav">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} style={{ marginBottom: "16px" }}>
            <div style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "4px 12px 6px",
            }}>
              {sec.group}
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
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div style={{ color: "var(--text-secondary)", fontWeight: 500, marginBottom: "2px" }}>
          NASA Space Apps 2026
        </div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
          Source: NASA PSI Repository (CC0-1.0)
        </div>
      </div>
    </aside>
  );
};
