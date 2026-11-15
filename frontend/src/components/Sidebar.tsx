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
  const navItems = [
    { id: "overview", label: "Command Center", icon: LayoutDashboard },
    { id: "investigations", label: "Investigation Explorer", icon: Compass },
    { id: "library", label: "Research Library", icon: BookOpen },
    { id: "compare", label: "Evidence Comparison", icon: GitCompare },
    { id: "ranking", label: "Relevance Ranking", icon: TrendingUp },
    { id: "assistant", label: "IGNIS AI Assistant", icon: MessageSquare },
    { id: "scenario", label: "Mission Scenario Analyzer", icon: ShieldAlert },
    { id: "evidence-gap", label: "Evidence Gap Heatmap", icon: Map },
    { id: "viz", label: "Scientific Visualizations", icon: BarChart2 },
    { id: "gallery", label: "Image Gallery", icon: Images },
    { id: "image-compare", label: "Image Comparison", icon: SplitSquareHorizontal },
    { id: "workspace", label: "Experiment Workspace", icon: Layers },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-badge">
          <Flame size={22} className="text-cyan-400" />
          <span>IGNIS</span>
        </div>
        <div className="brand-sub">
          Microgravity Combustion Intelligence
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setActivePage(item.id as PageId)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: "4px", color: "var(--text-muted)" }}>NASA Space Apps 2026</div>
        <div>Flame in Freefall Challenge</div>
        <div style={{ marginTop: "6px", fontSize: "0.68rem", color: "var(--text-dim)" }}>
          Data Source: NASA PSI &amp; NTRS
        </div>
      </div>
    </aside>
  );
};
