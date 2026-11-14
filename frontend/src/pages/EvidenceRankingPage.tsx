import React, { useState, useEffect } from "react";
import type { RankResponse } from "../types";
import { api } from "../api/client";
import {
  TrendingUp,
  Search,
  ExternalLink,
  Layers
} from "lucide-react";

export const EvidenceRankingPage: React.FC = () => {
  const [query, setQuery] = useState("gaseous fire suppressants and droplet burning rates in microgravity");
  const [targetGravity, setTargetGravity] = useState("Microgravity");
  const [data, setData] = useState<RankResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleRank(query, targetGravity);
  }, []);

  const handleRank = (q: string, grav: string) => {
    if (!q.trim()) return;
    setLoading(true);
    api
      .rank(q, grav)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ranking error:", err);
        setLoading(false);
      });
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRank(query, targetGravity);
  };

  return (
    <div>
      {/* Search & Scenario Input */}
      <div className="card card-elevated">
        <div className="card-header">
          <div className="card-title">
            <TrendingUp size={18} color="var(--accent-cyan)" />
            <span>Transparent Evidence-Relevance Ranking Engine</span>
          </div>
          <span className="badge badge-cyan">Explainable Multi-Factor Model</span>
        </div>

        <form onSubmit={onFormSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
          <div style={{ flexGrow: 1, minWidth: "300px" }}>
            <input
              type="text"
              className="input-text"
              placeholder="Enter scenario or research query (e.g. 'fabric flame propagation under forced flow')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            className="select-box"
            value={targetGravity}
            onChange={(e) => setTargetGravity(e.target.value)}
          >
            <option value="Microgravity">Orbital Microgravity (~10^-6 g)</option>
            <option value="Lunar">Lunar Surface Gravity (1/6 g)</option>
            <option value="Martian">Martian Gravity (3/8 g)</option>
          </select>

          <button type="submit" className="btn btn-primary">
            <Search size={16} />
            <span>Calculate Relevance Ranks</span>
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: "0.78rem" }}>
          <span style={{ color: "var(--text-dim)" }}>Example scenarios:</span>
          {[
            "gaseous fire suppressants and droplet burning rates in microgravity",
            "large-scale solid fabric flame spread with cabin ventilation",
            "co-flow smoke point and soot detection in habitat air ducts",
            "lunar habitat pressurized cabin fire safety with 32% O2"
          ].map((scen) => (
            <button
              key={scen}
              className="btn btn-outline"
              style={{ padding: "2px 8px", fontSize: "0.75rem" }}
              onClick={() => {
                setQuery(scen);
                handleRank(scen, targetGravity);
              }}
            >
              {scen.substring(0, 35)}...
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Calculating transparent relevance weights against NASA evidence corpus...
        </div>
      ) : (
        <div>
          {/* Transparent Model Disclaimer */}
          <div
            style={{
              backgroundColor: "rgba(56, 189, 248, 0.08)",
              borderLeft: "4px solid var(--accent-cyan)",
              borderRadius: "6px",
              padding: "14px 18px",
              marginBottom: "20px",
              fontSize: "0.82rem",
              color: "var(--text-main)",
              lineHeight: 1.5
            }}
          >
            <strong style={{ color: "var(--accent-cyan)" }}>MODEL TRANSPARENCY NOTICE: </strong>
            {data.weighting_model_disclaimer}
          </div>

          {/* Evidence Gaps Alert (if applicable) */}
          {data.evidence_gaps_summary.length > 0 && (
            <div
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.12)",
                borderLeft: "4px solid var(--color-caution)",
                borderRadius: "6px",
                padding: "14px 18px",
                marginBottom: "20px"
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-caution)", marginBottom: "4px" }}>
                IDENTIFIED CORPUS GAPS FOR THIS SCENARIO
              </div>
              {data.evidence_gaps_summary.map((gap, i) => (
                <div key={i} style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  • {gap}
                </div>
              ))}
            </div>
          )}

          {/* Factor Weights Legend */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Layers size={18} color="var(--accent-cyan)" />
                <span>Configured Relevance Factor Weights</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", fontSize: "0.8rem" }}>
              {Object.entries(data.factors_used).map(([k, desc]) => (
                <div
                  key={k}
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  <div style={{ fontWeight: 600, color: "var(--accent-cyan)", marginBottom: "2px" }}>{k}</div>
                  <div style={{ color: "var(--text-dim)" }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranked Evidence Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {data.ranked_items.map((item, idx) => (
              <div
                key={item.id}
                className="card"
                style={{
                  borderLeft: `4px solid ${idx === 0 ? "var(--accent-cyan)" : idx === 1 ? "var(--accent-purple)" : "var(--border-color)"}`
                }}
              >
                <div className="card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        color: idx === 0 ? "var(--accent-cyan)" : "var(--text-muted)"
                      }}
                    >
                      #{idx + 1}
                    </span>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                      {item.title}
                    </h3>
                    <span
                      className={`badge ${item.evidence_completeness === "Documented" ? "badge-green" : "badge-caution"}`}
                    >
                      {item.evidence_completeness}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span className="score-pill">
                      Relevance: {item.overall_relevance_score} / 100
                    </span>
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                    >
                      <ExternalLink size={12} />
                      <span>NASA PSI Record</span>
                    </a>
                  </div>
                </div>

                {/* Score Factor Breakdown Pills */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
                  <span className="badge badge-cyan">
                    Topic Match: {item.factor_breakdown.topic_relevance} / 35
                  </span>
                  <span className="badge badge-purple">
                    Condition Match: {item.factor_breakdown.condition_match} / 30
                  </span>
                  <span className="badge badge-green">
                    Variable Coverage: {item.factor_breakdown.variable_coverage} / 20
                  </span>
                  <span className="badge badge-caution">
                    Provenance: {item.factor_breakdown.provenance_completeness} / 15
                  </span>
                </div>

                {/* Matched Conditions vs Mismatches */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px", fontSize: "0.82rem", marginBottom: "14px" }}>
                  <div style={{ backgroundColor: "rgba(16, 185, 129, 0.08)", padding: "10px 14px", borderRadius: "6px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                    <div style={{ fontWeight: 600, color: "var(--color-success)", marginBottom: "4px" }}>
                      Matched Conditions & Capabilities:
                    </div>
                    {item.matched_conditions.map((m, i) => (
                      <div key={i} style={{ color: "var(--text-muted)" }}>• {m}</div>
                    ))}
                  </div>

                  {item.condition_mismatches_or_gaps.length > 0 && (
                    <div style={{ backgroundColor: "rgba(245, 158, 11, 0.08)", padding: "10px 14px", borderRadius: "6px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                      <div style={{ fontWeight: 600, color: "var(--color-caution)", marginBottom: "4px" }}>
                        Condition Mismatches / Limitations:
                      </div>
                      {item.condition_mismatches_or_gaps.map((m, i) => (
                        <div key={i} style={{ color: "var(--text-muted)" }}>• {m}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Factor Explanations */}
                <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: 1.4 }}>
                  {item.factor_explanations.map((exp, i) => (
                    <div key={i}>{exp}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
