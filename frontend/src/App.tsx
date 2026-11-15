import React, { useState, useEffect } from "react";
import type { PageId } from "./components/Sidebar";
import { TopNavbar } from "./components/TopNavbar";
import type { WorkspaceTab } from "./components/TopNavbar";
import { CombustionBackdrop } from "./components/CombustionBackdrop";
import { ShowdownLobby } from "./components/ShowdownLobby";
import { LandingPage } from "./pages/LandingPage";
import { InvestigationExplorerPage } from "./pages/InvestigationExplorerPage";
import { ResearchLibraryPage } from "./pages/ResearchLibraryPage";
import { EvidenceComparePage } from "./pages/EvidenceComparePage";
import { EvidenceRankingPage } from "./pages/EvidenceRankingPage";
import { AssistantPage } from "./pages/AssistantPage";
import { MissionScenarioPage } from "./pages/MissionScenarioPage";
import { VisualizationDashboardPage } from "./pages/VisualizationDashboardPage";
import { ImageGalleryPage } from "./pages/ImageGalleryPage";
import { ImageComparisonPage } from "./pages/ImageComparisonPage";
import { ExperimentWorkspacePage } from "./pages/ExperimentWorkspacePage";
import { EvidenceGapPage } from "./pages/EvidenceGapPage";
import { OnboardingTour } from "./components/OnboardingTour";
import { api } from "./api/client";

export const App: React.FC = () => {
  // Routing state: determines whether user is on external landing page or inside main research platform
  const [currentRoute, setCurrentRoute] = useState<"landing" | "app">(() => {
    const path = window.location.pathname;
    if (path.startsWith("/app")) {
      return "app";
    }
    return "landing";
  });

  // Tabs state for the main research platform
  const [tabs, setTabs] = useState<WorkspaceTab[]>([
    {
      id: "home",
      pageId: "overview",
      label: "Home",
      closable: false
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("home");

  // Selected investigation ID for deep explorer
  const [selectedInvId, setSelectedInvId] = useState<string>("PSI-69");
  const [dbStatus, setDbStatus] = useState<string>("Online");
  const [invCount, setInvCount] = useState<number>(5);
  const [globalSearch, setGlobalSearch] = useState<string>("");

  const [lightMode, setLightMode] = useState<boolean>(() => {
    return localStorage.getItem("ignis_theme_mode") === "light";
  });

  const [showTour, setShowTour] = useState<boolean>(() => {
    return localStorage.getItem("ignis_tour_seen") !== "true";
  });

  // Handle browser Back / Forward history navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith("/app")) {
        setCurrentRoute("app");
      } else {
        setCurrentRoute("landing");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Handle theme
  useEffect(() => {
    if (lightMode) {
      document.body.classList.add("light-mode");
      localStorage.setItem("ignis_theme_mode", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("ignis_theme_mode", "dark");
    }
  }, [lightMode]);

  // Load backend health
  useEffect(() => {
    api
      .getHealth()
      .then((h) => {
        setDbStatus(h.status === "healthy" ? "Online" : "Degraded");
        setInvCount(h.ingested_investigations);
      })
      .catch(() => {
        setDbStatus("Offline / Demo Fallback");
      });
  }, []);

  // Check URL search params for deep links on initial mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inv = params.get("inv");
    const page = params.get("page") as PageId | null;

    if (inv) {
      setSelectedInvId(inv);
    }

    if (page && page !== "overview") {
      handleOpenWorkspace(page, inv || undefined);
    }
  }, []);

  // Navigate to external Landing Gateway
  const handleNavigateToLanding = () => {
    window.history.pushState({}, "", "/");
    setCurrentRoute("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Enter main research platform
  const handleEnterPlatform = (pageId?: string, invId?: string, label?: string) => {
    window.history.pushState({}, "", "/app");
    setCurrentRoute("app");

    if (pageId && pageId !== "overview") {
      handleOpenWorkspace(pageId as PageId, invId, label);
    }
  };

  // Open a workspace tab inside the platform
  const handleOpenWorkspace = (pageId: PageId, invId?: string, label?: string) => {
    if (pageId === "overview") {
      setActiveTabId("home");
      return;
    }

    if (invId) {
      setSelectedInvId(invId);
    }

    const tabId = invId ? `tab-${pageId}-${invId}` : `tab-${pageId}`;
    const displayLabel = label || (invId ? `${invId} Explorer` : pageId.charAt(0).toUpperCase() + pageId.slice(1));

    // If tab already exists, just switch to it
    const existing = tabs.find((t) => t.id === tabId);
    if (existing) {
      setActiveTabId(tabId);
      return;
    }

    // Otherwise add new tab
    const newTab: WorkspaceTab = {
      id: tabId,
      pageId,
      label: displayLabel,
      investigationId: invId,
      closable: true
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(tabId);
  };

  // Close workspace tab
  const handleCloseTab = (tabId: string) => {
    const idx = tabs.findIndex((t) => t.id === tabId);
    if (idx === -1) return;

    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      // Switch to previous tab or home
      const nextTab = newTabs[Math.max(0, idx - 1)] || newTabs[0];
      setActiveTabId(nextTab ? nextTab.id : "home");
    }
  };

  const handleToggleTheme = () => {
    setLightMode((prev) => !prev);
  };

  const handleCloseTour = () => {
    setShowTour(false);
    localStorage.setItem("ignis_tour_seen", "true");
  };

  // ── Render 1: External Cinematic Landing Page (Route: `/`) ──────────────
  if (currentRoute === "landing") {
    return <LandingPage onEnterPlatform={handleEnterPlatform} />;
  }

  // ── Render 2: Main Research Platform (Route: `/app`) ────────────────────
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className="showdown-app-container">
      {/* Subtle combustion-inspired animated visual background */}
      <CombustionBackdrop />

      {/* Top Navigation Bar across entire screen */}
      <TopNavbar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={handleCloseTab}
        onOpenWorkspace={handleOpenWorkspace}
        onNavigateToLanding={handleNavigateToLanding}
        lightMode={lightMode}
        onToggleTheme={handleToggleTheme}
        onStartTour={() => setShowTour(true)}
        dbStatus={dbStatus}
        investigationCount={invCount}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
      />

      {/* Main Content Area */}
      <main className="showdown-main-viewport">
        {activeTab.id === "home" ? (
          <ShowdownLobby
            onNavigate={handleOpenWorkspace}
            onOpenWorkspaceTab={handleOpenWorkspace}
            searchFilterQuery={globalSearch}
          />
        ) : (
          <div className="showdown-subpage-container">
            {activeTab.pageId === "investigations" && (
              <InvestigationExplorerPage
                initialInvestigationId={activeTab.investigationId || selectedInvId}
              />
            )}

            {activeTab.pageId === "library" && <ResearchLibraryPage />}

            {activeTab.pageId === "compare" && <EvidenceComparePage />}

            {activeTab.pageId === "ranking" && <EvidenceRankingPage />}

            {activeTab.pageId === "assistant" && <AssistantPage />}

            {activeTab.pageId === "scenario" && <MissionScenarioPage />}

            {activeTab.pageId === "evidence-gap" && <EvidenceGapPage />}

            {activeTab.pageId === "viz" && <VisualizationDashboardPage />}

            {activeTab.pageId === "gallery" && <ImageGalleryPage />}

            {activeTab.pageId === "image-compare" && <ImageComparisonPage />}

            {activeTab.pageId === "workspace" && <ExperimentWorkspacePage />}
          </div>
        )}
      </main>

      {showTour && (
        <OnboardingTour
          onClose={handleCloseTour}
          onNavigate={(page) => handleOpenWorkspace(page)}
        />
      )}
    </div>
  );
};

export default App;
