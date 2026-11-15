import React, { useState } from "react";
import { X, ChevronRight, ChevronLeft, Flame } from "lucide-react";
import type { PageId } from "./Sidebar";

interface OnboardingTourProps {
  onClose: () => void;
  onNavigate: (page: PageId) => void;
}

const STEPS = [
  {
    title: "Welcome to IGNIS 🔥",
    page: "overview" as PageId,
    emoji: "🛸",
    body: (
      <>
        <p>
          <strong>IGNIS</strong> (Intelligent Guidance for Next-generation In-Space Safety) is a
          scientific research intelligence platform for NASA microgravity combustion physics.
        </p>
        <p style={{ marginTop: 10 }}>
          It indexes verified data from three NASA Physical Sciences Informatics (PSI) investigations:
          <strong> FLEX (PSI-69)</strong>, <strong>SAFFIRE-I (PSI-98)</strong>, and <strong>SPICE (PSI-107)</strong>.
        </p>
        <p style={{ marginTop: 10 }}>
          Every claim is traceable to its NASA source. Missing data stays <code>null</code>; nothing is fabricated.
        </p>
      </>
    )
  },
  {
    title: "Step 1 → Explore Investigations",
    page: "investigations" as PageId,
    emoji: "🔭",
    body: (
      <>
        <p>
          The <strong>Investigation Explorer</strong> shows full metadata for each NASA experiment:
          apparatus, gravity regime, fuels tested, source files, and all published findings.
        </p>
        <p style={{ marginTop: 10 }}>
          Each finding links directly to its DOI at the NASA PSI repository — click <em>Verify at NASA PSI</em> to confirm.
        </p>
        <p style={{ marginTop: 10, fontStyle: "italic", color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Try it: Select <strong>SAFFIRE-I (PSI-98)</strong> to see the large-scale fabric fire experiment that burned inside a Cygnus cargo vehicle.
        </p>
      </>
    )
  },
  {
    title: "Step 2 → Ask the AI Assistant",
    page: "assistant" as PageId,
    emoji: "🤖",
    body: (
      <>
        <p>
          The <strong>IGNIS AI Research Assistant</strong> answers questions about microgravity combustion physics,
          grounded exclusively in indexed NASA documents. No hallucinated facts.
        </p>
        <p style={{ marginTop: 10 }}>
          It supports multi-turn conversations, follow-up questions with pronouns ("What was <em>its</em> burn rate?"),
          typos, and informal phrasing.
        </p>
        <p style={{ marginTop: 10, fontStyle: "italic", color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Try asking: <em>"What did SAFFIRE-I discover about flame spread and peak temperatures in the Cygnus vehicle?"</em>
        </p>
      </>
    )
  },
  {
    title: "Step 3 → Run a Mission Scenario",
    page: "scenario" as PageId,
    emoji: "🚀",
    body: (
      <>
        <p>
          The <strong>Mission Scenario Analyzer</strong> maps your hypothetical spacecraft architecture
          (Lunar habitat, Mars transit, ISS) against the indexed evidence corpus.
        </p>
        <p style={{ marginTop: 10 }}>
          IGNIS identifies the most relevant NASA research leads and critically highlights
          <strong style={{ color: "var(--color-caution)" }}> condition mismatches</strong> —
          places where the indexed data may not transfer to your scenario.
        </p>
        <p style={{ marginTop: 10, fontStyle: "italic", color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Try it: Select <em>"Artemis Pressurized Lunar Habitat"</em> to see the gravity mismatch warning.
        </p>
      </>
    )
  },
  {
    title: "Step 4 → Discover Evidence Gaps",
    page: "evidence-gap" as PageId,
    emoji: "🗺️",
    body: (
      <>
        <p>
          The <strong>Evidence Gap Heatmap</strong> visualizes which combinations of{" "}
          <strong>gravity regime × fuel/material × atmosphere</strong> have been tested in space —
          and which are completely unknown.
        </p>
        <p style={{ marginTop: 10 }}>
          <strong style={{ color: "var(--color-error)" }}>Red gaps</strong> are research frontiers.
          They show exactly where new NASA experiments would add the most safety value.
        </p>
        <p style={{ marginTop: 10, fontStyle: "italic", color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Notice: Electrical wire insulation combustion in microgravity is a gap across all indexed atmospheres —
          a critical unknown for ISS wiring safety.
        </p>
      </>
    )
  },
  {
    title: "Step 5 → Visualize & Compare",
    page: "viz" as PageId,
    emoji: "📊",
    body: (
      <>
        <p>
          The <strong>Scientific Visualization Dashboard</strong> shows real time-series telemetry,
          scatter plots, distribution charts, and heatmaps — all sourced from actual NASA observations.
        </p>
        <p style={{ marginTop: 10 }}>
          The <strong>Experiment Comparison Workspace</strong> lets you compare FLEX, SAFFIRE-I, and SPICE
          side-by-side with strict comparability warnings (you cannot accidentally plot mm²/s and mm/s on the same axis).
        </p>
        <p style={{ marginTop: 10, color: "var(--color-success)", fontWeight: 600, fontSize: "0.9rem" }}>
          You're all set! Click any page in the left sidebar to begin exploring.
        </p>
      </>
    )
  }
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onClose, onNavigate }) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      onNavigate(STEPS[step + 1].page);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setStep(s => s - 1);
      onNavigate(STEPS[step - 1].page);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "rgba(8,13,24,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)"
      }}
    >
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-highlight)",
          borderRadius: 12,
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          width: "min(90vw, 540px)",
          padding: "32px 36px",
          position: "relative"
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-dim)",
            padding: 4
          }}
          title="Skip tour"
        >
          <X size={18} />
        </button>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <Flame size={22} color="var(--accent-cyan)" />
          <span style={{ fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.06em", fontSize: "1rem" }}>
            IGNIS
          </span>
          <span style={{ color: "var(--text-dim)", fontSize: "0.8rem", marginLeft: 4 }}>
            — Guided Tour ({step + 1}/{STEPS.length})
          </span>
        </div>

        {/* Step Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: "1.8rem" }}>{current.emoji}</span>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>
            {current.title}
          </h2>
        </div>

        {/* Step Body */}
        <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          {current.body}
        </div>

        {/* Progress Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => { setStep(i); onNavigate(STEPS[i].page); }}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: i === step ? "var(--accent-cyan)" : "var(--border-highlight)",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 10 }}>
          <button
            className="btn btn-outline"
            onClick={goPrev}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>

          <button className="btn btn-primary" onClick={goNext}>
            <span>{step === STEPS.length - 1 ? "Start Exploring" : "Next"}</span>
            {step < STEPS.length - 1 && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
