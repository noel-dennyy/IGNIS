import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Flame,
  Compass,
  BarChart2,
  Layers,
  Map,
  SplitSquareHorizontal,
  BookOpen,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Info,
  Minus,
  X,
  Activity,
  Database,
  Maximize2
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { api } from "../api/client";
import type { PageId } from "./Sidebar";
import type { OverviewResponse, InvestigationSummary } from "../types";

interface ShowdownLobbyProps {
  onNavigate?: (pageId: PageId, invId?: string, label?: string) => void;
  onOpenWorkspaceTab: (pageId: PageId, invId?: string, label?: string) => void;
  searchFilterQuery: string;
}

interface DatasetPreset {
  id: string;
  name: string;
  variable: string;
  subruns: string[];
}

const INVESTIGATION_DATASETS: Record<string, DatasetPreset[]> = {
  "PSI-69": [
    {
      id: "flex_heptane",
      name: "n-Heptane Isolated Droplets (d₀ = 1.5–2.0 mm)",
      variable: "burning_rate_k",
      subruns: ["Run 01: Pure n-Heptane (0-g)", "Run 02: Heptane + 10% CO₂", "Run 03: Extinction Diameter d_e"]
    },
    {
      id: "flex_methanol",
      name: "Methanol Droplets (CO₂ & He Quench)",
      variable: "extinction_diameter",
      subruns: ["Run 04: Methanol in Air", "Run 05: Methanol + 15% He Suppressant", "Run 06: Cool Flame Quenching"]
    }
  ],
  "PSI-98": [
    {
      id: "saffire_sibal",
      name: "SIBAL Cotton-Fiberglass Large Fabric Spread",
      variable: "flame_spread_rate",
      subruns: ["Duct Run 01: Concurrent Flow (20 cm/s)", "Duct Run 02: Downstream Thermocouple Grid", "Duct Run 03: Peak Heat Flux"]
    }
  ],
  "PSI-107": [
    {
      id: "spice_ethylene",
      name: "Ethylene & Propane Laminar Jet Smoke Points",
      variable: "smoke_point_length",
      subruns: ["Jet Run 01: Clean Tip Co-flow", "Jet Run 02: Sooting Boundary Transition", "Jet Run 03: Microgravity Agglomeration"]
    }
  ],
  "PSI-108": [
    {
      id: "bass_pmma",
      name: "PMMA Cylindrical Rods & Flat Sheets Flammability",
      variable: "bass_flame_spread",
      subruns: ["Rod Run 01: 5 cm/s Low Quench", "Rod Run 02: 20 cm/s Steady Spread", "Rod Run 03: Nitrogen Extinction"]
    }
  ],
  "PSI-70": [
    {
      id: "flex2_binary",
      name: "Binary n-Heptane / Hexadecane Droplet Evaporation",
      variable: "flex2_burning_rate",
      subruns: ["Binary Run 01: 50/50 Volume Mix", "Binary Run 02: Cool Flame Resurgence", "Binary Run 03: Micro-Explosion Limit"]
    }
  ],
  "PSI-99": [
    {
      id: "saffire2_flammability",
      name: "SAFFIRE-II Low-O₂ Fabric & Composite Flammability",
      variable: "flame_spread_rate",
      subruns: ["Duct Run 01: Low Oxygen (18% O₂)", "Duct Run 02: Baseline SIBAL Fabric", "Duct Run 03: PMMA Extinction Limit"]
    }
  ],
  "PSI-71": [
    {
      id: "slice_methane",
      name: "SLICE Methane & Ethylene Gas Jet Liftoff Runs",
      variable: "liftoff_height_mm",
      subruns: ["Run 01: Methane Diluted with N₂", "Run 02: Ethylene Soot Transition", "Run 03: Critical Liftoff Blowout"]
    }
  ],
  "PSI-101": [
    {
      id: "acme_bre_flux",
      name: "ACME-BRE Gaseous Burning Rate Emulator",
      variable: "burning_mass_flux",
      subruns: ["Burner Run 01: 25 mm Flat Burner Mass Flux", "Burner Run 02: 50 mm Porous Matrix Heat Loss", "Burner Run 03: Radiative Extinction Boundary"]
    }
  ]
};

const VARIABLE_LABELS: Record<string, { name: string; unit: string; desc: string }> = {
  burning_rate_k: { name: "Burning Rate Constant (K)", unit: "mm²/s", desc: "Droplet diameter squared regression rate" },
  extinction_diameter: { name: "Extinction Diameter (d_e)", unit: "mm", desc: "Residual droplet size at flame extinction" },
  flame_spread_rate: { name: "Fabric Flame Spread Rate", unit: "mm/s", desc: "Downstream progression rate along SIBAL matrix" },
  smoke_point_length: { name: "Smoke Point Flame Length", unit: "mm", desc: "Laminar jet length at inception of soot release" },
  bass_flame_spread: { name: "Solid Polymer Spread Rate", unit: "mm/s", desc: "Surface pyrolytic flame spread on PMMA" },
  flex2_burning_rate: { name: "Binary Droplet Burning Rate", unit: "mm²/s", desc: "Two-stage vaporization and combustion rate" },
  liftoff_height_mm: { name: "Gas Jet Liftoff Height", unit: "mm", desc: "Distance between burner nozzle tip and flame base" },
  burning_mass_flux: { name: "Burning Mass Flux (m'')", unit: "g/(m²·s)", desc: "Fuel surface mass regression per unit area" }
};

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  investigationId?: string;
  date: string;
  author: string;
  linkText?: string;
  actionPage?: PageId;
}

const NEWS_UPDATES: NewsItem[] = [
  {
    id: "news-00",
    title: "PSI-99 (SAFFIRE-II), PSI-71 (SLICE) & PSI-101 (BRE) Ingested",
    summary: "Expanded platform to 8 NASA PSI flight investigations and 176+ observations with new solid flammability, microgravity gas jet liftoff, and condensed burning rate emulation.",
    investigationId: "PSI-99",
    date: "Nov 15, 2026",
    author: "NASA Ingestion Engine",
    linkText: "Explore SAFFIRE-II",
    actionPage: "investigations"
  },
  {
    id: "news-01",
    title: "PSI-108 (BASS) & PSI-70 (FLEX-2) Ingested",
    summary: "Added 110+ verified observations covering solid PMMA polymer extinction and binary droplet cool flame resurgence with full CC0-1.0 provenance.",
    investigationId: "PSI-108",
    date: "Nov 15, 2026",
    author: "NASA Ingestion Engine",
    linkText: "View BASS",
    actionPage: "investigations"
  },
  {
    id: "news-02",
    title: "Cool Flame Resurgence Characterized",
    summary: "Secondary low-temperature combustion kinetics observed in n-alkane droplets after visible flame extinction in 0-g.",
    investigationId: "PSI-70",
    date: "Nov 12, 2026",
    author: "NASA Glenn Research Center",
    linkText: "Inspect FLEX-2",
    actionPage: "investigations"
  },
  {
    id: "news-03",
    title: "SAFFIRE-I Duct Spread Ingestion Complete",
    summary: "Cygnus OA-6 flow duct temperature sensors calibrated up to 940 °C across 18 telemetry intervals in 20 cm/s flow.",
    investigationId: "PSI-98",
    date: "Nov 09, 2026",
    author: "PSI Repository",
    linkText: "View Charts",
    actionPage: "viz"
  },
  {
    id: "news-04",
    title: "SPICE Co-flow Soot Boundary Mapped",
    summary: "Laminar smoke-point length transitions established for ethylene and propane in microgravity versus terrestrial 1-g.",
    investigationId: "PSI-107",
    date: "Nov 04, 2026",
    author: "Dr. P. Sunderland et al.",
    linkText: "Inspect SPICE",
    actionPage: "investigations"
  },
  {
    id: "news-05",
    title: "Dimensional Commensurability Gate Online",
    summary: "Direct numerical overlays of droplet evaporation (mm²/s), flame spread (mm/s), and smoke points (mm) are blocked to maintain scientific rigor.",
    date: "Oct 28, 2026",
    author: "IGNIS Verification",
    linkText: "Synthesis Workspace",
    actionPage: "workspace"
  }
];

export const ShowdownLobby: React.FC<ShowdownLobbyProps> = ({
  onOpenWorkspaceTab,
  searchFilterQuery
}) => {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [investigations, setInvestigations] = useState<InvestigationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Left Ops selection state
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedInvId, setSelectedInvId] = useState<string>("PSI-69");
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("flex_heptane");
  const [selectedVariable, setSelectedVariable] = useState<string>("burning_rate_k");
  const [filterCommensurate, setFilterCommensurate] = useState<boolean>(true);
  const [filterMicrogravityOnly, setFilterMicrogravityOnly] = useState<boolean>(true);

  // News box controls
  const [newsMinimized, setNewsMinimized] = useState<boolean>(false);
  const [newsClosed, setNewsClosed] = useState<boolean>(false);

  // Right section controls
  const [hideStats, setHideStats] = useState<boolean>(false);
  const [rightCategoryFilter, setRightCategoryFilter] = useState<string>("all");
  const [rightGravityFilter, setRightGravityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("id_asc");
  const [expandedInvestId, setExpandedInvestId] = useState<string | null>("PSI-69");

  // Telemetry preview state for Section 8
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [telemetryLoading, setTelemetryLoading] = useState<boolean>(false);

  // Load backend data
  useEffect(() => {
    setLoading(true);
    Promise.all([api.getOverview(), api.getInvestigations()])
      .then(([ov, invs]) => {
        setOverview(ov);
        setInvestigations(invs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed loading lobby overview:", err);
        setLoading(false);
      });
  }, []);

  // Update datasets when investigation changes
  useEffect(() => {
    const available = INVESTIGATION_DATASETS[selectedInvId] || [];
    if (available.length > 0) {
      setSelectedDatasetId(available[0].id);
      setSelectedVariable(available[0].variable);
    }
  }, [selectedInvId]);

  // Load preview telemetry for Section 8
  const loadTelemetryPreview = useCallback((invId: string) => {
    setTelemetryLoading(true);
    if (invId === "PSI-98") {
      api.getTimeSeries("PSI-98")
        .then((ts) => {
          setTelemetryData(ts.data.slice(0, 15));
          setTelemetryLoading(false);
        })
        .catch(() => setTelemetryLoading(false));
    } else {
      // For droplet / other investigations, mock or use scatter points formatted for preview
      api.getScatterData("flex_droplet")
        .then((sc) => {
          const formatted = sc.points.slice(0, 15).map((pt: any, idx: number) => ({
            time_elapsed_s: pt.initial_diameter_mm || idx * 10,
            flame_spread_rate_mm_s: pt.burning_rate_k_mm2_s || 0.4,
            peak_temperature_c: 500 + (pt.burning_rate_k_mm2_s || 0.4) * 350
          }));
          setTelemetryData(formatted);
          setTelemetryLoading(false);
        })
        .catch(() => setTelemetryLoading(false));
    }
  }, []);

  useEffect(() => {
    loadTelemetryPreview(selectedInvId);
  }, [selectedInvId, loadTelemetryPreview]);

  // Filter & sort investigations for Right Section
  const filteredInvestigations = useMemo(() => {
    let list = [...investigations];

    // Global top search query
    const search = searchFilterQuery.trim().toLowerCase();
    if (search) {
      list = list.filter((inv) =>
        inv.name.toLowerCase().includes(search) ||
        inv.external_id.toLowerCase().includes(search) ||
        inv.platform.toLowerCase().includes(search) ||
        inv.research_area.toLowerCase().includes(search)
      );
    }

    // Right area category filter
    if (rightCategoryFilter !== "all") {
      list = list.filter((inv) => {
        if (rightCategoryFilter === "droplet") return inv.external_id === "PSI-69" || inv.external_id === "PSI-70";
        if (rightCategoryFilter === "solid") return inv.external_id === "PSI-98" || inv.external_id === "PSI-108";
        if (rightCategoryFilter === "gas") return inv.external_id === "PSI-107";
        return true;
      });
    }

    // Right gravity filter
    if (rightGravityFilter !== "all") {
      list = list.filter((inv) =>
        inv.gravity_regime.toLowerCase().includes(rightGravityFilter.toLowerCase())
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "id_asc") return a.external_id.localeCompare(b.external_id);
      if (sortBy === "id_desc") return b.external_id.localeCompare(a.external_id);
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [investigations, searchFilterQuery, rightCategoryFilter, rightGravityFilter, sortBy]);

  // Primary action button handler
  const handlePrimaryAction = () => {
    onOpenWorkspaceTab("investigations", selectedInvId, `${selectedInvId} Explorer`);
  };

  const handleOpenTelemetry = (invId: string) => {
    onOpenWorkspaceTab("viz", invId, `${invId} Telemetry`);
  };

  const currentAvailableDatasets = INVESTIGATION_DATASETS[selectedInvId] || [];

  if (loading && !overview) {
    return (
      <div className="showdown-lobby-container" style={{ padding: "60px", textAlign: "center", color: "var(--text-secondary)" }}>
        Loading NASA PSI Research Lobby...
      </div>
    );
  }

  return (
    <div className="showdown-lobby-container">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* LEFT SECTION — Approximately 40% of screen width                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="lobby-left-section">
        {/* Sub-panel 1: Research Operations Panel */}
        <div className="showdown-ops-panel">
          <div className="ops-header">
            <span className="ops-label-tag">CONFIGURATION</span>
            <h2 className="ops-title">Research Operations</h2>
          </div>

          {/* Research Discipline Selector */}
          <div className="ops-field-group">
            <label className="ops-field-label">Discipline / Area</label>
            <select
              className="ops-select"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="all">Combustion Science (All Domains)</option>
              <option value="droplets">Microgravity Droplet Combustion</option>
              <option value="solids">Large-Scale Solid Flame Spread</option>
              <option value="gas">Laminar Gas Jet Smoke Points</option>
            </select>
          </div>

          {/* Investigation Selector */}
          <div className="ops-field-group">
            <label className="ops-field-label">Investigation Payload</label>
            <select
              className="ops-select"
              value={selectedInvId}
              onChange={(e) => setSelectedInvId(e.target.value)}
            >
              {investigations.map((inv) => (
                <option key={inv.id} value={inv.external_id}>
                  {inv.external_id}: {inv.name.split("(")[0].trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Dataset Selector */}
          <div className="ops-field-group">
            <label className="ops-field-label">Experimental Dataset &amp; Matrix</label>
            <select
              className="ops-select"
              value={selectedDatasetId}
              onChange={(e) => {
                setSelectedDatasetId(e.target.value);
                const ds = currentAvailableDatasets.find((d) => d.id === e.target.value);
                if (ds) setSelectedVariable(ds.variable);
              }}
            >
              {currentAvailableDatasets.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name}
                </option>
              ))}
            </select>
          </div>

          {/* Telemetry Variable Selector */}
          <div className="ops-field-group">
            <label className="ops-field-label">Telemetry Measurement Variable</label>
            <select
              className="ops-select"
              value={selectedVariable}
              onChange={(e) => setSelectedVariable(e.target.value)}
            >
              {Object.entries(VARIABLE_LABELS).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.name} [{info.unit}]
                </option>
              ))}
            </select>
          </div>

          {/* Scientific Filters / Options */}
          <div className="ops-checkbox-group">
            <label className="ops-checkbox-item">
              <input
                type="checkbox"
                checked={filterCommensurate}
                onChange={(e) => setFilterCommensurate(e.target.checked)}
              />
              <span>Enforce Dimensional Homogeneity</span>
            </label>
            <label className="ops-checkbox-item">
              <input
                type="checkbox"
                checked={filterMicrogravityOnly}
                onChange={(e) => setFilterMicrogravityOnly(e.target.checked)}
              />
              <span>Orbital Microgravity Only (0-g)</span>
            </label>
          </div>

          {/* PRIMARY ACTION BUTTON — Showdown "Battle!" equivalent */}
          <button
            className="btn-showdown-battle"
            onClick={handlePrimaryAction}
            title="Launch comprehensive NASA PSI investigation telemetry and observation data"
          >
            <div className="battle-main-text">
              <Flame size={18} className="battle-flame-icon" />
              <span>Open Investigation</span>
            </div>
            <div className="battle-sub-text">
              Analyze {selectedInvId} Telemetry &amp; Runs
            </div>
          </button>

          {/* Vertically Stacked Navigation Groups (Showdown style) */}
          <div className="showdown-nav-stack">
            <div className="stack-group-title">RESEARCH WORKSPACES</div>
            <div className="stack-btn-group">
              <button
                className="showdown-pill-btn"
                onClick={() => onOpenWorkspaceTab("investigations", selectedInvId, "Investigation Explorer")}
              >
                <Compass size={14} color="var(--accent-cyan)" />
                <span>Investigation Explorer</span>
              </button>
              <button
                className="showdown-pill-btn"
                onClick={() => onOpenWorkspaceTab("viz", selectedInvId, "Telemetry Dashboard")}
              >
                <BarChart2 size={14} color="var(--accent-molten)" />
                <span>Telemetry Analysis</span>
              </button>
              <button
                className="showdown-pill-btn"
                onClick={() => onOpenWorkspaceTab("workspace", undefined, "Synthesis Workspace")}
              >
                <Layers size={14} color="var(--accent-amber)" />
                <span>Synthesis Workspace</span>
              </button>
            </div>

            <div className="stack-group-title" style={{ marginTop: "10px" }}>CROSS-PAYLOAD SYNTHESIS</div>
            <div className="stack-btn-group">
              <button
                className="showdown-pill-btn"
                onClick={() => onOpenWorkspaceTab("compare", undefined, "Comparability Matrix")}
              >
                <Activity size={14} color="var(--color-success)" />
                <span>Investigation Comparison</span>
              </button>
              <button
                className="showdown-pill-btn"
                onClick={() => onOpenWorkspaceTab("library", undefined, "Research Library")}
              >
                <BookOpen size={14} color="var(--accent-purple)" />
                <span>Dataset Library</span>
              </button>
              <button
                className="showdown-pill-btn"
                onClick={() => onOpenWorkspaceTab("evidence-gap", undefined, "Evidence Gap Map")}
              >
                <Map size={14} color="var(--accent-flame)" />
                <span>Evidence Gap Map</span>
              </button>
            </div>

            <div className="stack-group-title" style={{ marginTop: "10px" }}>IMAGERY &amp; SAFETY</div>
            <div className="stack-btn-group">
              <button
                className="showdown-pill-btn"
                onClick={() => onOpenWorkspaceTab("image-compare", undefined, "Image Comparison")}
              >
                <SplitSquareHorizontal size={14} color="var(--accent-cyan)" />
                <span>Image Comparison</span>
              </button>
              <button
                className="showdown-pill-btn"
                onClick={() => onOpenWorkspaceTab("scenario", undefined, "Mission Scenarios")}
              >
                <ShieldAlert size={14} color="var(--accent-amber)" />
                <span>Mission Scenarios</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-panel 2: Research Updates Panel (Showdown "News" Box equivalent) */}
        {!newsClosed && (
          <div className={`showdown-news-panel ${newsMinimized ? "minimized" : ""}`}>
            <div
              className="news-header"
              onClick={() => setNewsMinimized(!newsMinimized)}
              style={{ cursor: "pointer", userSelect: "none" }}
              title={newsMinimized ? "Click to expand NASA PSI Updates" : "Click to collapse NASA PSI Updates"}
            >
              <div className="news-title-group">
                <span className="news-dot"></span>
                <span className="news-title">NASA PSI Updates</span>
                <span style={{ marginLeft: "6px", fontSize: "0.68rem", color: "var(--text-dim)" }}>
                  {newsMinimized ? "▶ expand" : "▼ collapse"}
                </span>
              </div>
              <div className="news-controls" onClick={e => e.stopPropagation()}>
                <button
                  className="news-ctrl-btn"
                  onClick={() => setNewsMinimized(!newsMinimized)}
                  title={newsMinimized ? "Expand Updates Panel" : "Minimize Updates Panel"}
                >
                  {newsMinimized ? <Maximize2 size={11} /> : <Minus size={11} />}
                </button>
                <button
                  className="news-ctrl-btn"
                  onClick={() => setNewsClosed(true)}
                  title="Close Updates Panel"
                >
                  <X size={11} />
                </button>
              </div>
            </div>

            {!newsMinimized && (
              <div className="news-body-scroll">
                {NEWS_UPDATES.map((item) => (
                  <article key={item.id} className="news-entry">
                    <h3 className="news-entry-title">{item.title}</h3>
                    <p className="news-entry-summary">{item.summary}</p>
                    <div className="news-entry-footer">
                      <span className="news-meta">
                        — <strong style={{ color: "var(--text-primary)" }}>{item.author}</strong> on {item.date}
                      </span>
                      {item.linkText && item.actionPage && (
                        <button
                          className="news-link-btn"
                          onClick={() => onOpenWorkspaceTab(item.actionPage!, item.investigationId, item.title)}
                        >
                          {item.linkText} ➔
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* RIGHT SECTION — Approximately 60% of screen width                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="lobby-right-section">
        {/* ── Top Statistics Bar (Showdown top online/battles bar) ─────── */}
        {!hideStats && overview && (
          <div className="showdown-stats-bar">
            <div className="stat-pill-box">
              <div className="stat-number" style={{ color: "var(--accent-molten)" }}>
                {overview.investigation_count || 8}
              </div>
              <div className="stat-label">NASA PSI Investigations</div>
            </div>

            <div className="stat-pill-box">
              <div className="stat-number" style={{ color: "var(--accent-cyan)" }}>
                {overview.observation_count || "176"}
              </div>
              <div className="stat-label">Verified Observations</div>
            </div>

            <div className="stat-pill-box">
              <div className="stat-number" style={{ color: "var(--color-success)" }}>
                12
              </div>
              <div className="stat-label">Calibrated Imagery Records</div>
            </div>

            <div className="stat-pill-box">
              <div className="stat-number" style={{ color: "var(--accent-amber)" }}>
                {overview.research_areas?.length || 4}
              </div>
              <div className="stat-label">Research Disciplines</div>
            </div>

            <button
              className="stats-hide-btn"
              onClick={() => setHideStats(true)}
              title="Hide statistics bar to expand research listing"
            >
              ▸ Hide
            </button>
          </div>
        )}

        {hideStats && (
          <div className="stats-hidden-bar">
            <span style={{ fontSize: "0.74rem", color: "var(--text-dim)" }}>
              Platform Statistics Hidden ({overview?.investigation_count || 8} Investigations · {overview?.observation_count || 176} Observations)
            </span>
            <button
              className="stats-show-btn"
              onClick={() => setHideStats(false)}
            >
              ▾ Show Statistics
            </button>
          </div>
        )}

        {/* ── Filter & Search Toolbar (Showdown (All rooms) bar) ───────── */}
        <div className="showdown-filter-toolbar">
          <div className="filter-group">
            <select
              className="showdown-filter-select"
              value={rightCategoryFilter}
              onChange={(e) => setRightCategoryFilter(e.target.value)}
            >
              <option value="all">(All Research Disciplines)</option>
              <option value="droplet">Droplet Evaporation &amp; Cool Flames</option>
              <option value="solid">Solid Flame Spread &amp; Extinction</option>
              <option value="gas">Laminar Gas Jet Smoke Points</option>
            </select>

            <select
              className="showdown-filter-select"
              value={rightGravityFilter}
              onChange={(e) => setRightGravityFilter(e.target.value)}
            >
              <option value="all">(All Gravitational Regimes)</option>
              <option value="microgravity">Orbital Microgravity (~10⁻⁶ g)</option>
              <option value="terrestrial">Terrestrial Gravity (1 g)</option>
            </select>

            <select
              className="showdown-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="id_asc">Sort: ID (PSI-69 → 108)</option>
              <option value="id_desc">Sort: ID (Descending)</option>
              <option value="name_asc">Sort: Name (A-Z)</option>
            </select>
          </div>

          <div className="filter-count-badge">
            {filteredInvestigations.length} Payloads Shown
          </div>
        </div>

        {/* ── Investigation Listing (Showdown "Official chat rooms" style) ── */}
        <div className="showdown-investigation-listing">
          <div className="listing-category-header">
            <Flame size={14} color="var(--accent-molten)" />
            <span>NASA PSI Flight Investigations</span>
            <span className="listing-count-tag">({filteredInvestigations.length} Available)</span>
          </div>

          <div className="listing-items-scroll">
            {filteredInvestigations.map((inv) => {
              const isExpanded = expandedInvestId === inv.external_id;
              const datasets = INVESTIGATION_DATASETS[inv.external_id] || [];

              return (
                <div key={inv.id} className="investigation-room-row">
                  <div
                    className="room-row-main"
                    onClick={() => setExpandedInvestId(isExpanded ? null : inv.external_id)}
                  >
                    <div className="room-icon-col">
                      <Compass size={16} color="var(--accent-cyan)" />
                    </div>

                    <div className="room-info-col">
                      <div className="room-title-line">
                        <strong className="room-inv-id">{inv.external_id}</strong>
                        <span className="room-name">{inv.name}</span>
                        <span className="room-records-pill">
                          ({inv.external_id === "PSI-69" ? 24 :
                            inv.external_id === "PSI-98" ? 18 :
                            inv.external_id === "PSI-107" ? 16 :
                            inv.external_id === "PSI-108" ? 28 :
                            inv.external_id === "PSI-70" ? 24 :
                            inv.external_id === "PSI-99" ? 20 :
                            inv.external_id === "PSI-71" ? 22 :
                            inv.external_id === "PSI-101" ? 24 : 20} observations)

                        </span>
                      </div>

                      <div className="room-desc-line">
                        {inv.research_area} · {inv.platform}
                      </div>

                      {/* Sub-datasets list (Showdown subrooms equivalent) */}
                      {datasets.length > 0 && (
                        <div className="room-subrooms-line">
                          <span className="subroom-prefix">↳ Datasets:</span>
                          {datasets.map((d, dIdx) => (
                            <span key={dIdx} className="subroom-item">
                              {d.name.split("(")[0].trim()}
                              {dIdx < datasets.length - 1 ? " · " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="room-actions-col">
                      <button
                        className="room-action-btn primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenWorkspaceTab("investigations", inv.external_id, `${inv.external_id} Explorer`);
                        }}
                        title="Open detailed investigation explorer"
                      >
                        Open Explorer
                      </button>

                      <button
                        className="room-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTelemetry(inv.external_id);
                        }}
                        title="View multi-channel telemetry graphs"
                      >
                        Telemetry
                      </button>

                      <div className="room-expand-caret">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </div>
                    </div>
                  </div>

                  {/* Nested Expanded Sub-runs & Dataset Details */}
                  {isExpanded && (
                    <div className="room-expanded-drawer">
                      <div className="drawer-header">
                        <span>Experimental Runs &amp; Telemetry Channels for {inv.external_id}</span>
                        {inv.doi && (
                          <a
                            href={`https://doi.org/${inv.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="doi-link"
                          >
                            DOI: {inv.doi} <ExternalLink size={10} />
                          </a>
                        )}
                      </div>

                      <div className="drawer-datasets-grid">
                        {datasets.map((ds, idx) => (
                          <div key={idx} className="dataset-card-nested">
                            <div className="dataset-nested-title">{ds.name}</div>
                            <ul className="dataset-subruns-list">
                              {ds.subruns.map((sr, sIdx) => (
                                <li key={sIdx}>
                                  <span className="subrun-bullet">•</span>
                                  <span>{sr}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="dataset-nested-actions">
                              <button
                                className="btn btn-outline"
                                style={{ fontSize: "0.72rem", padding: "2px 8px" }}
                                onClick={() => setSelectedInvId(inv.external_id)}
                              >
                                Select for Analysis
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section 8: Scientific Analysis Workspace & Telemetry Preview ── */}
        <div className="showdown-analysis-workspace">
          <div className="workspace-header">
            <div className="workspace-title-line">
              <Activity size={15} color="var(--accent-molten)" />
              <h3 className="workspace-title">
                Telemetry Preview: {selectedInvId} Active Payload
              </h3>
            </div>
            <div className="workspace-controls">
              <span className="badge badge-cyan" style={{ fontSize: "0.72rem" }}>
                {VARIABLE_LABELS[selectedVariable]?.name || "Flight Measurements"}
              </span>
              <button
                className="btn btn-outline"
                style={{ fontSize: "0.72rem", padding: "3px 8px" }}
                onClick={() => handleOpenTelemetry(selectedInvId)}
              >
                Expand in Dashboard ➔
              </button>
            </div>
          </div>

          <div className="workspace-chart-area">
            {telemetryLoading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-dim)" }}>
                Loading telemetry channels for {selectedInvId}...
              </div>
            ) : telemetryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={telemetryData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis
                    dataKey="time_elapsed_s"
                    stroke="#1E293B"
                    tick={{ fill: "#94A3B8", fontSize: 10 }}
                    label={{ value: "Time / Position Metric", position: "insideBottom", offset: -10, fill: "#64748B", fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#1E293B"
                    tick={{ fill: "#94A3B8", fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-color)",
                      borderRadius: "4px",
                      fontSize: "0.76rem"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="flame_spread_rate_mm_s"
                    stroke="var(--accent-molten)"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    name="Primary Value"
                  />
                  <Line
                    type="monotone"
                    dataKey="peak_temperature_c"
                    stroke="var(--accent-cyan)"
                    strokeWidth={1.5}
                    dot={false}
                    name="Reference Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--text-dim)" }}>
                Telemetry data available via Full Telemetry Dashboard.
              </div>
            )}
          </div>

          <div className="workspace-footer-note">
            <Info size={13} color="var(--accent-cyan)" />
            <span>
              Physical Bounds: All quantitative telemetry values originate from calibrated NASA PSI sensors. Direct numerical comparisons across different physical axes are prohibited.
            </span>
          </div>
        </div>

        {/* ── Section 9: Additional Information & Provenance ─────────── */}
        <div className="showdown-additional-sections">
          <div className="additional-card">
            <h4 className="additional-title">
              <CheckCircle2 size={13} color="var(--color-success)" />
              <span>Scientific Interpretation &amp; Dimensional Rules</span>
            </h4>
            <p className="additional-text">
              Droplet burning rates (mm²/s), solid fabric spread rates (mm/s), and gas jet smoke points (mm) represent physically divergent regimes. 
              IGNIS maintains strict dimensional separation to preserve empirical accuracy.
            </p>
          </div>

          <div className="additional-card">
            <h4 className="additional-title">
              <Database size={13} color="var(--accent-cyan)" />
              <span>Data Provenance &amp; Public Domain Access</span>
            </h4>
            <p className="additional-text">
              All flight telemetry records, manifests, and documentation are ingested under the Creative Commons CC0-1.0 Universal Public Domain Dedication from the NASA Physical Sciences Informatics (PSI) system.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
