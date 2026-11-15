import React, { useState, useRef, useEffect } from "react";
import {
  Flame,
  Home,
  Compass,
  BarChart2,
  Plus,
  X,
  Search,
  MessageSquare,
  Bell,
  Sun,
  Moon,
  HelpCircle,
  Database,
  Layers,
  Map,
  SplitSquareHorizontal,
  BookOpen,
  ShieldAlert,
  User,
  CheckCircle2
} from "lucide-react";
import type { PageId } from "./Sidebar";

export interface WorkspaceTab {
  id: string;
  pageId: PageId;
  label: string;
  investigationId?: string;
  closable: boolean;
}

interface TopNavbarProps {
  tabs: WorkspaceTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onOpenWorkspace: (pageId: PageId, invId?: string, label?: string) => void;
  lightMode: boolean;
  onToggleTheme: () => void;
  onStartTour: () => void;
  dbStatus: string;
  investigationCount?: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onOpenWorkspace,
  lightMode,
  onToggleTheme,
  onStartTour,
  dbStatus,
  investigationCount = 5,
  searchQuery,
  onSearchChange
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const addMenuRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openableOptions: Array<{ pageId: PageId; invId?: string; label: string; icon: any; category: string }> = [
    { pageId: "investigations", invId: "PSI-69", label: "PSI-69: FLEX (Droplet Combustion)", icon: Compass, category: "Investigations" },
    { pageId: "investigations", invId: "PSI-98", label: "PSI-98: SAFFIRE-I (Fabric Spread)", icon: Compass, category: "Investigations" },
    { pageId: "investigations", invId: "PSI-107", label: "PSI-107: SPICE (Gas Jet Soot)", icon: Compass, category: "Investigations" },
    { pageId: "investigations", invId: "PSI-108", label: "PSI-108: BASS (Solid Polymer)", icon: Compass, category: "Investigations" },
    { pageId: "investigations", invId: "PSI-70", label: "PSI-70: FLEX-2 (Binary Droplets)", icon: Compass, category: "Investigations" },
    { pageId: "assistant", label: "AI Research Assistant", icon: MessageSquare, category: "Analysis Tools" },
    { pageId: "viz", label: "Telemetry & Multi-Channel Charts", icon: BarChart2, category: "Analysis Tools" },
    { pageId: "workspace", label: "Multi-Payload Synthesis Workspace", icon: Layers, category: "Analysis Tools" },
    { pageId: "evidence-gap", label: "Evidence Gap Frontier Map", icon: Map, category: "Analysis Tools" },
    { pageId: "image-compare", label: "Flame Morphology Comparison", icon: SplitSquareHorizontal, category: "Imagery & Literature" },
    { pageId: "library", label: "NASA Publications Library", icon: BookOpen, category: "Imagery & Literature" },
    { pageId: "scenario", label: "Mission Scenario Architecture", icon: ShieldAlert, category: "Safety & Scenarios" }
  ];

  return (
    <header className="showdown-top-bar">
      {/* ── LEFT: Branding & Main Navigation Tabs ────────────────────── */}
      <div className="top-bar-left">
        <div
          className="brand-pill"
          onClick={() => onSelectTab("home")}
          title="IGNIS — NASA Physical Sciences Informatics Platform"
        >
          <div className="brand-logo-wrap">
            <Flame size={17} className="brand-flame" />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">IGNIS</span>
            <span className="brand-sub-badge">NASA PSI</span>
          </div>
        </div>

        {/* Primary Navigation shortcuts styled like Showdown home tab */}
        <button
          className={`top-nav-btn ${activeTabId === "home" ? "active" : ""}`}
          onClick={() => onSelectTab("home")}
          title="Return to Main Research Lobby"
        >
          <Home size={14} />
          <span>Home</span>
        </button>

        <button
          className="top-nav-btn"
          onClick={() => onOpenWorkspace("investigations", "PSI-69", "Investigation Explorer")}
          title="Open NASA PSI Investigation Explorer"
        >
          <Compass size={14} />
          <span>Explorer</span>
        </button>

        <button
          className="top-nav-btn"
          onClick={() => onOpenWorkspace("viz", undefined, "Telemetry Dashboard")}
          title="Open Scientific Telemetry & Charts"
        >
          <BarChart2 size={14} />
          <span>Dashboard</span>
        </button>
      </div>

      {/* ── CENTER: Active Workspace Tabs + Plus Control ─────────────── */}
      <div className="top-bar-center">
        <div className="tabs-scroll-area">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                className={`showdown-tab ${isActive ? "active" : ""}`}
                onClick={() => onSelectTab(tab.id)}
                title={tab.label}
              >
                <span className="tab-label">{tab.label}</span>
                {tab.closable && (
                  <button
                    className="tab-close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    title="Close workspace tab"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Showdown-style '+' button to add room/tab */}
        <div className="add-tab-wrapper" ref={addMenuRef}>
          <button
            className={`add-tab-btn ${showAddMenu ? "open" : ""}`}
            onClick={() => setShowAddMenu(!showAddMenu)}
            title="Open new investigation or research workspace tab"
          >
            <Plus size={15} />
          </button>

          {showAddMenu && (
            <div className="add-tab-dropdown">
              <div className="dropdown-header">
                <span>Open Research Workspace</span>
              </div>
              <div className="dropdown-scroll">
                {openableOptions.map((opt, idx) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={idx}
                      className="dropdown-item"
                      onClick={() => {
                        onOpenWorkspace(opt.pageId, opt.invId, opt.label);
                        setShowAddMenu(false);
                      }}
                    >
                      <Icon size={14} color="var(--accent-cyan)" />
                      <div className="item-text">
                        <span className="item-title">{opt.label}</span>
                        <span className="item-cat">{opt.category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Search, Assistant, Notifications, Settings, Profile ── */}
      <div className="top-bar-right">
        {/* Compact Search Input */}
        <div className={`top-search-box ${searchFocused ? "focused" : ""}`}>
          <Search size={13} className="search-icon" />
          <input
            type="text"
            placeholder="Search PSI data..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => onSearchChange("")}>
              <X size={11} />
            </button>
          )}
        </div>

        {/* AI Research Assistant Quick Pill */}
        <button
          className="top-assistant-pill"
          onClick={() => onOpenWorkspace("assistant", undefined, "Research Assistant")}
          title="Launch IGNIS AI Combustion Assistant"
        >
          <MessageSquare size={13} color="var(--accent-molten)" />
          <span className="assistant-text">AI Assistant</span>
          <span className="assistant-badge">Online</span>
        </button>

        {/* Notifications / Ingestion status */}
        <div className="dropdown-wrapper" ref={notifRef}>
          <button
            className="top-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="NASA Ingestion & System Activity"
          >
            <Bell size={14} />
            <span className="notif-dot"></span>
          </button>

          {showNotifications && (
            <div className="notifications-popover">
              <div className="popover-header">
                <span>NASA Ingestion Activity</span>
                <span className="badge badge-green" style={{ fontSize: "0.68rem" }}>
                  {dbStatus} ({investigationCount} Ingested)
                </span>
              </div>
              <div className="popover-body">
                <div className="notif-entry">
                  <CheckCircle2 size={13} color="var(--color-success)" />
                  <div>
                    <div className="notif-title">PSI-108 & PSI-70 Ingested</div>
                    <div className="notif-desc">110+ verified observations with CC0-1.0 provenance synced.</div>
                    <div className="notif-time">Today, 12:18 PM</div>
                  </div>
                </div>
                <div className="notif-entry">
                  <Database size={13} color="var(--accent-cyan)" />
                  <div>
                    <div className="notif-title">Dimensional Commensurability Gate Active</div>
                    <div className="notif-desc">Multi-investigation synthesis enforcing physical units check.</div>
                    <div className="notif-time">Yesterday, 04:30 PM</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Guided Tour */}
        <button className="top-icon-btn" onClick={onStartTour} title="Walkthrough Guide">
          <HelpCircle size={14} />
        </button>

        {/* Theme Toggle */}
        <button
          className="top-icon-btn"
          onClick={onToggleTheme}
          title={lightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {lightMode ? <Moon size={14} /> : <Sun size={14} />}
        </button>

        {/* User Profile / Showdown 'Choose name' pill */}
        <div className="dropdown-wrapper" ref={userMenuRef}>
          <button
            className="user-profile-pill"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="User Session Profile"
          >
            <div className="user-avatar">
              <User size={13} />
            </div>
            <span className="user-name">NASA Investigator</span>
            <span className="user-caret">▾</span>
          </button>

          {showUserMenu && (
            <div className="user-popover">
              <div className="user-popover-header">
                <strong>Dr. Investigator (Guest)</strong>
                <span>Role: PSI Research Fellow</span>
              </div>
              <div className="user-popover-item">
                <span>Active Database:</span>
                <strong style={{ color: "var(--accent-cyan)" }}>ignis.db (SQLite)</strong>
              </div>
              <div className="user-popover-item">
                <span>Repository:</span>
                <span>NASA PSI Public Domain</span>
              </div>
              <div className="user-popover-footer">
                <a
                  href="https://psi.nasa.gov/physci/repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ width: "100%", justifyContent: "center", fontSize: "0.74rem" }}
                >
                  <Database size={12} />
                  <span>NASA PSI Portal</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
