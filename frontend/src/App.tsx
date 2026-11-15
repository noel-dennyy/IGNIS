import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import type { PageId } from "./components/Sidebar";
import { Header } from "./components/Header";
import { OverviewPage } from "./pages/OverviewPage";
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
  const [activePage, setActivePage] = useState<PageId>("overview");
  const [selectedInvId, setSelectedInvId] = useState<string>("PSI-69");
  const [dbStatus, setDbStatus] = useState<string>("Online");
  const [invCount, setInvCount] = useState<number>(3);
  
  const [lightMode, setLightMode] = useState<boolean>(() => {
    return localStorage.getItem("ignis_theme_mode") === "light";
  });

  const [showTour, setShowTour] = useState<boolean>(() => {
    return localStorage.getItem("ignis_tour_seen") !== "true";
  });

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add("light-mode");
      localStorage.setItem("ignis_theme_mode", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("ignis_theme_mode", "dark");
    }
  }, [lightMode]);

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

  const handleSelectInvestigation = (id: string) => {
    setSelectedInvId(id);
    setActivePage("investigations");
  };

  const handleToggleTheme = () => {
    setLightMode((prev) => !prev);
  };

  const handleCloseTour = () => {
    setShowTour(false);
    localStorage.setItem("ignis_tour_seen", "true");
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        <Header
          activePage={activePage}
          dbStatus={dbStatus}
          investigationCount={invCount}
          lightMode={lightMode}
          onToggleTheme={handleToggleTheme}
          onStartTour={() => setShowTour(true)}
        />

        <div className="content-body">
          {activePage === "overview" && (
            <OverviewPage
              onNavigate={setActivePage}
              onSelectInvestigation={handleSelectInvestigation}
            />
          )}

          {activePage === "investigations" && (
            <InvestigationExplorerPage initialInvestigationId={selectedInvId} />
          )}

          {activePage === "library" && <ResearchLibraryPage />}

          {activePage === "compare" && <EvidenceComparePage />}

          {activePage === "ranking" && <EvidenceRankingPage />}

          {activePage === "assistant" && <AssistantPage />}

          {activePage === "scenario" && <MissionScenarioPage />}

          {activePage === "evidence-gap" && <EvidenceGapPage />}

          {activePage === "viz" && <VisualizationDashboardPage />}

          {activePage === "gallery" && <ImageGalleryPage />}

          {activePage === "image-compare" && <ImageComparisonPage />}

          {activePage === "workspace" && <ExperimentWorkspacePage />}
        </div>
      </main>

      {showTour && (
        <OnboardingTour
          onClose={handleCloseTour}
          onNavigate={(page) => setActivePage(page)}
        />
      )}
    </div>
  );
};

export default App;
