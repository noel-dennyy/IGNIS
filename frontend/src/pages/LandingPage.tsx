import React from "react";
import {
  Flame,
  Compass,
  BarChart2,
  Layers,
  Map,
  SplitSquareHorizontal,
  MessageSquare,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Activity,
  Sparkles
} from "lucide-react";
import { CinematicFlameCanvas } from "../components/CinematicFlameCanvas";

interface LandingPageProps {
  onEnterPlatform: (pageId?: string, invId?: string, label?: string) => void;
}

const RESEARCH_HIGHLIGHTS = [
  {
    id: "PSI-69",
    name: "Flame Extinguishment Experiment (FLEX)",
    discipline: "Droplet Combustion & Extinction",
    platform: "International Space Station (ISS) · CIR / MDCA",
    records: 24,
    fuels: "n-Heptane, Methanol, Heptane-Decane",
    doi: "10.60555/mbq8-0451",
    description: "Evaluated spherical isolated droplet burning rates (K), d² law evaporation, and gaseous suppressant (CO₂, He) extinction boundaries in orbital 0-g.",
    color: "#39C5E8"
  },
  {
    id: "PSI-98",
    name: "Spacecraft Fire Safety Experiment-I (SAFFIRE-I)",
    discipline: "Large-Scale Solid Flame Spread",
    platform: "Cygnus OA-6 Cargo Spacecraft (S.S. Rick Husband)",
    records: 18,
    fuels: "SIBAL Fabric (Cotton-Fiberglass)",
    doi: "10.60555/0t15-1z43",
    description: "Demonstrated concurrent flame spread along large fabric samples in an uncrewed space vehicle flow duct with forced 20 cm/s ventilation, reaching temperatures > 940 °C.",
    color: "#FF7626"
  },
  {
    id: "PSI-107",
    name: "Smoke Point in Co-flow Experiment (SPICE)",
    discipline: "Laminar Gas Jet Flames & Soot Inception",
    platform: "International Space Station (ISS) · Microgravity Science Glovebox",
    records: 16,
    fuels: "Ethylene, Propane, Methane",
    doi: "10.60555/9kbh-e962",
    description: "Mapped laminar smoke-point transitions and soot agglomeration in microgravity co-flow jets. Established that microgravity soot particles grow larger than in 1-g.",
    color: "#FFB547"
  },
  {
    id: "PSI-108",
    name: "Burning and Suppression of Solids (BASS)",
    discipline: "Solid Polymer Flammability & Quenching",
    platform: "International Space Station (ISS) · MSG Chamber",
    records: 28,
    fuels: "PMMA Cylindrical Rods & Flat Sheets",
    doi: "10.60555/bass-0108",
    description: "Characterized surface pyrolytic spread and gaseous nitrogen/CO₂ quenching velocities on solid polymethyl methacrylate (PMMA) fuel geometries.",
    color: "#A78BFA"
  },
  {
    id: "PSI-70",
    name: "Flame Extinguishment Experiment-2 (FLEX-2)",
    discipline: "Binary Droplets & Cool Flame Kinetics",
    platform: "International Space Station (ISS) · CIR Chamber",
    records: 24,
    fuels: "Binary n-Heptane / Hexadecane Mixtures",
    doi: "10.60555/mbq8-0452",
    description: "Uncovered multi-stage droplet vaporization and low-temperature secondary combustion ('cool flames') persisting long after visible hot flame radiation ceases.",
    color: "#38BDF8"
  }
];

const PLATFORM_FEATURES = [
  {
    title: "NASA PSI Investigation Explorer",
    desc: "Inspect verified apparatus geometry, chamber volumes, fuel compositions, and source document manifests for active flight experiments.",
    icon: Compass,
    color: "#39C5E8",
    pageId: "investigations"
  },
  {
    title: "Experimental Telemetry & Analytics",
    desc: "Analyze multi-channel thermocouple time-series, droplet d² law regression curves, and statistical distributions with CleanChart interactive graphs.",
    icon: BarChart2,
    color: "#FF7626",
    pageId: "viz"
  },
  {
    title: "Scientific Visualization & Morphology",
    desc: "Inspect synthesized flame geometries, soot boundaries, and interactive morphological sliders comparing microgravity vs. normal gravity flames.",
    icon: SplitSquareHorizontal,
    color: "#FFB547",
    pageId: "image-compare"
  },
  {
    title: "Multi-Payload Synthesis Workspace",
    desc: "Cross-reference experimental conditions with automated dimensional homogeneity checks that strictly block invalid multi-axis physical overlays.",
    icon: Layers,
    color: "#10B981",
    pageId: "workspace"
  },
  {
    title: "AI Combustion Research Assistant",
    desc: "Ask deep combustion science questions grounded in peer-reviewed literature, with conversation memory, evidence strength scoring, and direct DOI citations.",
    icon: MessageSquare,
    color: "#A78BFA",
    pageId: "assistant"
  },
  {
    title: "Evidence Gap Frontier Map",
    desc: "Explore a dynamic 3D matrix of gravity regime × fuel × atmosphere combinations to identify critical untested zones for spacecraft fire protection.",
    icon: Map,
    color: "#EF4444",
    pageId: "evidence-gap"
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterPlatform }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-page-root">
      {/* ── EXTERNAL HEADER ────────────────────────────────────────────── */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-brand">
            <div className="landing-brand-icon">
              <Flame size={20} color="var(--accent-molten)" />
            </div>
            <div className="landing-brand-text">
              <span className="landing-brand-name">IGNIS</span>
              <span className="landing-brand-tag">NASA PSI</span>
            </div>
          </div>

          <nav className="landing-nav">
            <button className="landing-nav-link" onClick={() => scrollToSection("about")}>
              About
            </button>
            <button className="landing-nav-link" onClick={() => scrollToSection("features")}>
              Features
            </button>
            <button className="landing-nav-link" onClick={() => scrollToSection("research")}>
              Research
            </button>
            <button className="landing-nav-link" onClick={() => scrollToSection("science")}>
              Microgravity Physics
            </button>
          </nav>

          <div className="landing-header-actions">
            <button
              className="btn btn-primary landing-enter-header-btn"
              onClick={() => onEnterPlatform()}
            >
              <span>ENTER PLATFORM</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ── CINEMATIC HERO SECTION ──────────────────────────────────────── */}
      <section className="landing-hero-section">
        {/* Animated Background Canvas */}
        <CinematicFlameCanvas />

        <div className="landing-hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={13} color="var(--accent-molten)" />
            <span>NASA PHYSICAL SCIENCES INFORMATICS (PSI) RESEARCH</span>
          </div>

          <h1 className="landing-hero-title">
            UNDERSTANDING FIRE <br />
            <span className="title-gradient">BEYOND EARTH</span>
          </h1>

          <p className="landing-hero-desc">
            An advanced microgravity combustion intelligence platform synthesizing NASA Physical Sciences Informatics flight experiments, 
            spherical droplet extinction kinetics, and large-scale spacecraft fire safety telemetry from the International Space Station and Cygnus missions.
          </p>

          <div className="landing-hero-ctas">
            <button
              className="landing-cta-primary"
              onClick={() => onEnterPlatform()}
              title="Launch the IGNIS Research Workspace and Investigation Lobby"
            >
              <div className="cta-icon-wrap">
                <Flame size={20} />
              </div>
              <div className="cta-text-wrap">
                <span className="cta-main">ENTER IGNIS</span>
                <span className="cta-sub">Launch Research Platform</span>
              </div>
              <ArrowRight size={18} className="cta-arrow" />
            </button>

            <button
              className="landing-cta-secondary"
              onClick={() => scrollToSection("research")}
            >
              <span>EXPLORE THE RESEARCH</span>
            </button>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="hero-stats-ticker">
            <div className="ticker-item">
              <strong style={{ color: "var(--accent-molten)" }}>5</strong>
              <span>Verified NASA Investigations</span>
            </div>
            <div className="ticker-sep">/</div>
            <div className="ticker-item">
              <strong style={{ color: "var(--accent-cyan)" }}>110+</strong>
              <span>Quantitative Observations</span>
            </div>
            <div className="ticker-sep">/</div>
            <div className="ticker-item">
              <strong style={{ color: "var(--color-success)" }}>CC0-1.0</strong>
              <span>Open Public Domain Provenance</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: ABOUT / INTRODUCTION ────────────────────────────── */}
      <section id="about" className="landing-section landing-about-section">
        <div className="landing-container">
          <div className="section-eyebrow">THE SCIENCE OF FLAME IN FREEFALL</div>
          <h2 className="section-heading">Why Microgravity Combustion Matters</h2>
          
          <div className="about-grid">
            <div className="about-card">
              <div className="about-card-num">01</div>
              <h3 className="about-card-title">Absence of Buoyancy</h3>
              <p className="about-card-text">
                On Earth, hot combustion products rise rapidly due to natural buoyancy, producing the familiar teardrop flame. 
                In orbital microgravity (~10⁻⁶ g), buoyancy vanishes. Flames form quiet, perfectly spherical diffusion shells governed solely by molecular transport.
              </p>
            </div>

            <div className="about-card">
              <div className="about-card-num">02</div>
              <h3 className="about-card-title">Discovery of Cool Flames</h3>
              <p className="about-card-text">
                NASA ISS experiments (FLEX and FLEX-2) discovered that hydrocarbon droplets can continue burning in a low-temperature regime (~800 K) 
                after the visible hot flame extinguishes, creating a critical challenge for space habitat fire detection.
              </p>
            </div>

            <div className="about-card">
              <div className="about-card-num">03</div>
              <h3 className="about-card-title">Spacecraft Fire Safety</h3>
              <p className="about-card-text">
                The SAFFIRE experiments aboard uncrewed Cygnus resupply vehicles evaluate large-scale fabric flame spread in forced ventilation flow ducts, 
                yielding peak temperatures exceeding 940 °C and providing critical data for Artemis and Mars missions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PLATFORM CAPABILITIES & FEATURES ────────────────── */}
      <section id="features" className="landing-section landing-features-section">
        <div className="landing-container">
          <div className="section-eyebrow">RESEARCH ARCHITECTURE</div>
          <h2 className="section-heading">Engineered for Rigorous Scientific Analysis</h2>
          <p className="section-subtext">
            IGNIS provides a full suite of analytical instruments designed to inspect, compare, and interrogate authentic NASA flight data.
          </p>

          <div className="features-grid">
            {PLATFORM_FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="feature-card">
                  <div className="feature-icon-wrap" style={{ color: feat.color, backgroundColor: `${feat.color}15` }}>
                    <Icon size={22} />
                  </div>
                  <h3 className="feature-title">{feat.title}</h3>
                  <p className="feature-desc">{feat.desc}</p>
                  <button
                    className="feature-action-btn"
                    onClick={() => onEnterPlatform(feat.pageId, undefined, feat.title)}
                  >
                    <span>Launch Tool</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: RESEARCH HIGHLIGHTS ─────────────────────────────── */}
      <section id="research" className="landing-section landing-research-section">
        <div className="landing-container">
          <div className="section-eyebrow">INGESTED NASA INVESTIGATIONS</div>
          <h2 className="section-heading">Verified PSI Flight Payloads</h2>
          <p className="section-subtext">
            Directly access structured datasets, experimental observation tables, and thermocouple records from verified NASA missions.
          </p>

          <div className="research-cards-list">
            {RESEARCH_HIGHLIGHTS.map((inv) => (
              <div key={inv.id} className="research-highlight-card">
                <div className="rh-main-col">
                  <div className="rh-header-row">
                    <span className="rh-id-badge" style={{ color: inv.color, borderColor: `${inv.color}44`, backgroundColor: `${inv.color}12` }}>
                      {inv.id}
                    </span>
                    <h3 className="rh-title">{inv.name}</h3>
                    <span className="rh-records-tag">
                      {inv.records} Flight Records
                    </span>
                  </div>

                  <p className="rh-desc">{inv.description}</p>

                  <div className="rh-meta-row">
                    <span className="rh-meta-item">
                      <strong>Platform:</strong> {inv.platform}
                    </span>
                    <span className="rh-meta-item">
                      <strong>Discipline:</strong> {inv.discipline}
                    </span>
                    <span className="rh-meta-item">
                      <strong>Target Fuels:</strong> {inv.fuels}
                    </span>
                  </div>
                </div>

                <div className="rh-actions-col">
                  <button
                    className="btn btn-primary rh-open-btn"
                    onClick={() => onEnterPlatform("investigations", inv.id, `${inv.id} Explorer`)}
                  >
                    <span>Open in Platform</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    className="btn btn-outline rh-telemetry-btn"
                    onClick={() => onEnterPlatform("viz", inv.id, `${inv.id} Telemetry`)}
                  >
                    <Activity size={13} />
                    <span>Telemetry</span>
                  </button>
                  {inv.doi && (
                    <a
                      href={`https://doi.org/${inv.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rh-doi-link"
                    >
                      DOI: {inv.doi} <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: CALL TO ACTION BANNER ───────────────────────────── */}
      <section className="landing-cta-banner-section">
        <div className="landing-container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <h2 className="cta-banner-title">
                Explore Microgravity Combustion Intelligence
              </h2>
              <p className="cta-banner-desc">
                Step into the full IGNIS research platform with multi-workspace tabs, operations panels, live telemetry charts, and AI assistance.
              </p>
            </div>
            <div className="cta-banner-action">
              <button
                className="btn btn-primary cta-banner-btn"
                onClick={() => onEnterPlatform()}
              >
                <Flame size={18} />
                <span>ENTER RESEARCH PLATFORM</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXTERNAL FOOTER ────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-top-row">
            <div className="footer-brand-col">
              <div className="footer-brand-header">
                <Flame size={20} color="var(--accent-molten)" />
                <span className="footer-brand-title">IGNIS</span>
              </div>
              <p className="footer-tagline">
                NASA Physical Sciences Informatics (PSI) Microgravity Combustion Research &amp; Intelligence Platform.
              </p>
              <div className="footer-provenance-tag">
                <ShieldCheck size={14} color="var(--color-success)" />
                <span>CC0-1.0 Universal Public Domain Dedication</span>
              </div>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-links-heading">Platform Workspaces</h4>
              <ul className="footer-links-list">
                <li>
                  <button onClick={() => onEnterPlatform("overview")}>Research Lobby</button>
                </li>
                <li>
                  <button onClick={() => onEnterPlatform("investigations", "PSI-69", "Investigation Explorer")}>Investigation Explorer</button>
                </li>
                <li>
                  <button onClick={() => onEnterPlatform("viz", undefined, "Telemetry Dashboard")}>Telemetry &amp; Charts</button>
                </li>
                <li>
                  <button onClick={() => onEnterPlatform("workspace", undefined, "Synthesis Workspace")}>Synthesis Workspace</button>
                </li>
                <li>
                  <button onClick={() => onEnterPlatform("assistant", undefined, "Research Assistant")}>AI Combustion Assistant</button>
                </li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-links-heading">Scientific Data</h4>
              <ul className="footer-links-list">
                <li>
                  <a href="https://psi.nasa.gov/physci/repo" target="_blank" rel="noopener noreferrer">
                    NASA PSI Repository <ExternalLink size={10} />
                  </a>
                </li>
                <li>
                  <a href="https://ntrs.nasa.gov" target="_blank" rel="noopener noreferrer">
                    NASA Technical Reports Server <ExternalLink size={10} />
                  </a>
                </li>
                <li>
                  <button onClick={() => onEnterPlatform("evidence-gap", undefined, "Evidence Gap Map")}>Evidence Gap Map</button>
                </li>
                <li>
                  <button onClick={() => onEnterPlatform("library", undefined, "Research Library")}>Document Library</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-row">
            <div className="footer-copyright">
              Developed for the NASA Space Apps Challenge 2026 — Flame in Freefall.
            </div>
            <div className="footer-disclaimer">
              Derived from NASA Physical Sciences Informatics open telemetry. Not for operational life-support or spacecraft flight certification.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
