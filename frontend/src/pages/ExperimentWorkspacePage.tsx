import { useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { api } from "../api/client";
import type { CompareResponse } from "../types";

const ALL_INVESTIGATIONS = [
  { id: "PSI-69", label: "PSI-69 — FLEX (Droplet Combustion)" },
  { id: "PSI-70", label: "PSI-70 — FLEX-2 (Binary Droplets & Cool Flames)" },
  { id: "PSI-98", label: "PSI-98 — SAFFIRE-I (Large Fabric Spread)" },
  { id: "PSI-107", label: "PSI-107 — SPICE (Gas Jet Smoke Points)" },
  { id: "PSI-108", label: "PSI-108 — BASS (Solid Polymer Flammability)" },
];

const INV_COLORS: Record<string, string> = {
  "PSI-69": "#38bdf8",
  "PSI-70": "#60a5fa",
  "PSI-98": "#f59e0b",
  "PSI-107": "#a78bfa",
  "PSI-108": "#34d399"
};

function ConditionGrid({ investigations }: { investigations: any[] }) {
  const fields = [
    { key: "gravity_regime", label: "Gravity Regime" },
    { key: "platform", label: "Platform" },
    { key: "research_area", label: "Research Area" },
    { key: "facility", label: "Facility" },
    { key: "nasa_center", label: "NASA Center" },
    { key: "apparatus", label: "Apparatus" },
    { key: "fuels_tested", label: "Fuels / Materials" },
  ];

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #1e293b" }}>
          <th style={{ padding: "6px 8px", color: "var(--text-muted)", textAlign: "left", fontWeight: 500, width: "22%" }}>Property</th>
          {investigations.map((inv: any) => (
            <th key={inv.external_id || inv.id} style={{ padding: "6px 8px", textAlign: "left", color: INV_COLORS[inv.external_id] || "#38bdf8" }}>
              {inv.name || inv.external_id || inv.id}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {fields.map(f => (
          <tr key={f.key} style={{ borderBottom: "1px solid #0f172a" }}>
            <td style={{ padding: "5px 8px", color: "var(--text-muted)" }}>{f.label}</td>
            {investigations.map((inv: any) => {
              const val = inv[f.key];
              const display = Array.isArray(val) ? val.join(", ") : (val || "—");
              return (
                <td key={inv.external_id || inv.id} style={{ padding: "5px 8px", color: "var(--text-secondary)" }}>
                  {display}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CompatibilityMatrix({ variables }: { variables: any[] }) {
  if (!variables || variables.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {variables.map((v: any) => (
        <div key={v.variable_name} style={{
          display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.6rem 0.9rem",
          background: v.is_comparable ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)",
          borderLeft: `3px solid ${v.is_comparable ? "#10b981" : "#ef4444"}`,
          borderRadius: "4px", fontSize: "0.8rem"
        }}>
          <span style={{ fontWeight: 700, color: v.is_comparable ? "#10b981" : "#ef4444", minWidth: "16px" }}>
            {v.is_comparable ? "✓" : "✗"}
          </span>
          <div>
            <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>{v.variable_name}</div>
            <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>{v.reason}</div>
            {v.notes && <div style={{ color: "var(--text-dim)", fontSize: "0.72rem", marginTop: "2px" }}>{v.notes}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function SharedObservationsChart({ observations, selectedIds }: { observations: any[]; selectedIds: string[] }) {
  if (!observations || observations.length === 0) return (
    <div className="empty-state">No shared comparable observations between the selected investigations.</div>
  );

  // Group by measurement_name and investigation_id for grouped bar chart
  const measurements = Array.from(new Set(observations.map((o: any) => o.measurement_name)));
  const chartData = measurements.slice(0, 8).map(m => {
    const row: Record<string, string | number> = { name: m };
    selectedIds.forEach(id => {
      const obs = observations.find((o: any) => o.measurement_name === m && o.investigation_id === id);
      if (obs && obs.value_numeric != null) {
        row[id] = obs.value_numeric;
      }
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 40, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="name" stroke="#334155" tick={{ fill: "#94a3b8", fontSize: 10 }} angle={-30} textAnchor="end" />
        <YAxis stroke="#334155" tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }} />
        <Legend wrapperStyle={{ paddingTop: "10px", color: "#94a3b8", fontSize: "0.78rem" }} />
        {selectedIds.map(id => (
          <Bar key={id} dataKey={id} name={id} fill={INV_COLORS[id] || "#38bdf8"} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ExperimentWorkspacePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["PSI-69", "PSI-98"]);
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInv = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev; // need at least 2
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 3) return prev; // max 3
      return [...prev, id];
    });
  };

  const runComparison = useCallback(() => {
    if (selectedIds.length < 2) return;
    setLoading(true);
    setError(null);
    api.compare(selectedIds)
      .then(setResult)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedIds]);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1.4rem", marginBottom: "0.4rem" }}>
          Experiment Comparison Workspace
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Select 2–3 investigations to compare experimental conditions, measurement domains, and recorded observations.
          Incompatible variables are clearly identified — no invalid cross-experiment quantitative overlays.
        </p>
      </div>

      {/* Investigation selector */}
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <div className="card-header">
          <h3 className="card-title">Select Investigations (2–3)</h3>
        </div>
        <div style={{ padding: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {ALL_INVESTIGATIONS.map(inv => {
            const selected = selectedIds.includes(inv.id);
            return (
              <button key={inv.id} onClick={() => toggleInv(inv.id)}
                className={`btn ${selected ? "" : "btn-ghost"}`}
                style={{ borderColor: INV_COLORS[inv.id], color: selected ? INV_COLORS[inv.id] : "var(--text-muted)", minWidth: "280px", justifyContent: "flex-start" }}>
                <span style={{ marginRight: "0.5rem" }}>{selected ? "✓" : "○"}</span>
                {inv.label}
              </button>
            );
          })}
        </div>
        <div style={{ padding: "0 1rem 1rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button className="btn" onClick={runComparison} disabled={loading || selectedIds.length < 2}>
            {loading ? "Comparing…" : "Run Comparison →"}
          </button>
          {selectedIds.length < 2 && <span style={{ fontSize: "0.78rem", color: "#ef4444" }}>Select at least 2 investigations.</span>}
          {selectedIds.length > 3 && <span style={{ fontSize: "0.78rem", color: "#ef4444" }}>Maximum 3 investigations.</span>}
        </div>
      </div>

      {error && <div className="empty-state" style={{ color: "#ef4444" }}>Error: {error}</div>}

      {result && (
        <>
          {/* Comparability warning */}
          <div style={{ marginBottom: "1.25rem", padding: "0.75rem 1rem", background: result.is_valid_comparison ? "rgba(16,185,129,0.07)" : "rgba(239,68,68,0.07)", borderLeft: `3px solid ${result.is_valid_comparison ? "#10b981" : "#ef4444"}`, borderRadius: "4px", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
            {!result.is_valid_comparison && <AlertTriangle size={16} style={{ color: "#ef4444", flexShrink: 0, marginTop: "1px" }} />}
            <div>
              <strong style={{ color: result.is_valid_comparison ? "#10b981" : "#ef4444" }}>
                {result.is_valid_comparison ? "Valid Comparison" : "⚠ Incompatible Domains"}:
              </strong>{" "}
              {result.comparability_warning}
            </div>
          </div>

          {/* Experimental Conditions */}
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <div className="card-header"><h3 className="card-title">Experimental Conditions</h3></div>
            <div style={{ padding: "1rem", overflowX: "auto" }}>
              <ConditionGrid investigations={result.investigations} />
            </div>
          </div>

          {/* Variable Compatibility Matrix */}
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <div className="card-header">
              <h3 className="card-title">Variable Compatibility Analysis</h3>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Which measurements can be directly compared?</span>
            </div>
            <div style={{ padding: "1rem" }}>
              <CompatibilityMatrix variables={result.variables_analysis} />
            </div>
          </div>

          {/* Shared Observations Chart (only for compatible comparisons) */}
          {result.is_valid_comparison && result.shared_observations.length > 0 && (
            <div className="card" style={{ marginBottom: "1.25rem" }}>
              <div className="card-header">
                <h3 className="card-title">Comparable Observations Chart</h3>
                <span style={{ fontSize: "0.72rem", color: "#10b981" }}>Only variables with compatible units and measurement definitions are shown.</span>
              </div>
              <div style={{ padding: "1rem" }}>
                <SharedObservationsChart observations={result.shared_observations} selectedIds={selectedIds} />
              </div>
            </div>
          )}

          {!result.is_valid_comparison && (
            <div className="empty-state" style={{ marginBottom: "1.25rem" }}>
              <strong style={{ color: "#ef4444" }}>No shared quantitative axes.</strong><br />
              <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                These experiments measure fundamentally different physical quantities (droplet K, fabric spread rate, gas smoke-point length).
                They cannot be plotted on the same axis without scientific misrepresentation.
              </span>
            </div>
          )}

          {/* Recommendation */}
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <div className="card-header"><h3 className="card-title">Scientific Recommendation</h3></div>
            <div style={{ padding: "1rem", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {result.recommendation}
            </div>
          </div>

          {/* Source links */}
          <div className="card">
            <div className="card-header"><h3 className="card-title">Source Citations</h3></div>
            <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {result.investigations.map((inv: any) => (
                <div key={inv.external_id || inv.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.82rem" }}>
                  <span className="badge" style={{ background: `${INV_COLORS[inv.external_id]}22`, color: INV_COLORS[inv.external_id], border: `1px solid ${INV_COLORS[inv.external_id]}55`, minWidth: "60px", justifyContent: "center" }}>
                    {inv.external_id || inv.id}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{inv.name}</span>
                  {inv.source_url && (
                    <a href={inv.source_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: "3px", color: "var(--accent-cyan)", textDecoration: "none", fontSize: "0.75rem", marginLeft: "auto" }}>
                      <ExternalLink size={12} /> NASA PSI
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!result && !loading && (
        <div className="empty-state">
          Select investigations above and click <strong>Run Comparison</strong> to begin analysis.
        </div>
      )}
    </div>
  );
}
