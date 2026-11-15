import { useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ExternalLink, AlertTriangle, Layers, Activity, CheckCircle2, XCircle } from "lucide-react";
import { api } from "../api/client";
import type { CompareResponse } from "../types";

const ALL_INVESTIGATIONS = [
  { id: "PSI-69", label: "PSI-69 — FLEX (Droplet Combustion & Extinction)" },
  { id: "PSI-70", label: "PSI-70 — FLEX-2 (Binary Droplets & Cool Flames)" },
  { id: "PSI-98", label: "PSI-98 — SAFFIRE-I (Large Fabric Flame Spread)" },
  { id: "PSI-107", label: "PSI-107 — SPICE (Gas Jet Smoke Points)" },
  { id: "PSI-108", label: "PSI-108 — BASS (Solid Polymer Flammability)" },
];

const INV_COLORS: Record<string, string> = {
  "PSI-69": "#39C5E8",
  "PSI-70": "#38BDF8",
  "PSI-98": "#FF7626",
  "PSI-107": "#FFB547",
  "PSI-108": "#A78BFA"
};

function ConditionGrid({ investigations }: { investigations: any[] }) {
  const fields = [
    { key: "gravity_regime", label: "Gravity Regime" },
    { key: "platform", label: "Platform & Vehicle" },
    { key: "research_area", label: "Research Discipline" },
    { key: "facility", label: "Chamber / Facility" },
    { key: "nasa_center", label: "Lead NASA Center" },
    { key: "apparatus", label: "Apparatus & Diagnostics" },
    { key: "fuels_tested", label: "Fuels / Target Materials" },
  ];

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
      <thead>
        <tr style={{ borderBottom: "1px solid var(--border-color)", background: "var(--bg-elevated)" }}>
          <th style={{ padding: "8px 12px", color: "var(--text-secondary)", textAlign: "left", fontWeight: 600, width: "22%", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
            PARAMETER
          </th>
          {investigations.map((inv: any) => (
            <th key={inv.external_id || inv.id} style={{ padding: "8px 12px", textAlign: "left", color: INV_COLORS[inv.external_id] || "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>
              {inv.name || inv.external_id || inv.id}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {fields.map(f => (
          <tr key={f.key} style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "8px 12px", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.76rem" }}>{f.label}</td>
            {investigations.map((inv: any) => {
              const val = inv[f.key];
              const display = Array.isArray(val) ? val.join(", ") : (val || "—");
              return (
                <td key={inv.external_id || inv.id} style={{ padding: "8px 12px", color: "var(--text-primary)" }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {variables.map((v: any) => (
        <div key={v.variable_name} style={{
          display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 14px",
          background: v.is_comparable ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
          borderLeft: `3px solid ${v.is_comparable ? "var(--color-success)" : "var(--accent-flame)"}`,
          borderRadius: "4px", fontSize: "0.82rem"
        }}>
          <span style={{ fontWeight: 700, color: v.is_comparable ? "var(--color-success)" : "var(--accent-flame)", minWidth: "18px" }}>
            {v.is_comparable ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          </span>
          <div>
            <div style={{ color: "var(--text-primary)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{v.variable_name}</div>
            <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>{v.reason}</div>
            {v.notes && <div style={{ color: "var(--text-dim)", fontSize: "0.74rem", marginTop: "3px", fontFamily: "var(--font-mono)" }}>{v.notes}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function SharedObservationsChart({ observations, selectedIds }: { observations: any[]; selectedIds: string[] }) {
  if (!observations || observations.length === 0) return (
    <div className="card" style={{ padding: "30px", textAlign: "center", color: "var(--text-secondary)" }}>
      No shared comparable quantitative observations between the selected investigations.
    </div>
  );

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
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 15, right: 25, bottom: 45, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
        <XAxis dataKey="name" stroke="#1E293B" tick={{ fill: "#94A3B8", fontSize: 10 }} angle={-25} textAnchor="end" />
        <YAxis stroke="#1E293B" tick={{ fill: "#94A3B8", fontSize: 11 }} />
        <Tooltip contentStyle={{ background: "rgba(17,24,32,0.95)", border: "1px solid var(--accent-molten)", borderRadius: "4px", color: "#F2F5F7", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }} />
        <Legend wrapperStyle={{ paddingTop: "12px", color: "#94A3B8", fontSize: "0.78rem", fontFamily: "var(--font-mono)" }} />
        {selectedIds.map(id => (
          <Bar key={id} dataKey={id} name={id} fill={INV_COLORS[id] || "var(--accent-cyan)"} />
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
        if (prev.length <= 2) return prev;
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 3) return prev;
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <Layers size={20} color="var(--accent-molten)" />
          <h2 style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.35rem" }}>
            Multi-Investigation Synthesis Workspace
          </h2>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
          Select 2–3 NASA investigations to compare experimental geometries, environmental chambers, and physical measurement domains.
          Strictly prevents false overlays of non-commensurate physical quantities.
        </p>
      </div>

      {/* Investigation selector */}
      <div className="card hud-panel" style={{ marginBottom: "22px" }}>
        <div className="card-header">
          <h3 className="card-title">Select Active Payloads (2 to 3)</h3>
          <span className="badge badge-molten">{selectedIds.length} SELECTED</span>
        </div>

        <div style={{ padding: "0.5rem 0 1rem", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {ALL_INVESTIGATIONS.map(inv => {
            const selected = selectedIds.includes(inv.id);
            return (
              <button
                key={inv.id}
                onClick={() => toggleInv(inv.id)}
                className="btn"
                style={{
                  backgroundColor: selected ? "rgba(25, 35, 45, 0.95)" : "var(--bg-surface)",
                  borderColor: selected ? INV_COLORS[inv.id] : "var(--border-color)",
                  color: selected ? "var(--text-primary)" : "var(--text-secondary)",
                  minWidth: "290px",
                  justifyContent: "flex-start",
                  boxShadow: selected ? `0 0 10px ${INV_COLORS[inv.id]}44` : "none"
                }}
              >
                <span style={{ color: INV_COLORS[inv.id], marginRight: "6px", fontWeight: 700 }}>
                  {selected ? "✓" : "○"}
                </span>
                <span style={{ fontSize: "0.82rem" }}>{inv.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px", display: "flex", gap: "12px", alignItems: "center" }}>
          <button className="btn btn-primary" onClick={runComparison} disabled={loading || selectedIds.length < 2}>
            <Activity size={15} />
            <span>{loading ? "Synthesizing Telemetry..." : "Execute Cross-Payload Analysis →"}</span>
          </button>
          {selectedIds.length < 2 && <span style={{ fontSize: "0.78rem", color: "var(--accent-flame)", fontFamily: "var(--font-mono)" }}>[ALERT] Select at least 2 flight investigations.</span>}
        </div>
      </div>

      {error && (
        <div className="card" style={{ padding: "20px", color: "var(--accent-flame)", fontFamily: "var(--font-mono)" }}>
          Error executing comparison: {error}
        </div>
      )}

      {result && (
        <>
          {/* Comparability warning */}
          <div style={{
            marginBottom: "20px",
            padding: "14px 18px",
            background: result.is_valid_comparison ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
            borderLeft: `3px solid ${result.is_valid_comparison ? "var(--color-success)" : "var(--accent-flame)"}`,
            borderRadius: "4px",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            display: "flex",
            gap: "10px",
            alignItems: "flex-start"
          }}>
            {!result.is_valid_comparison && <AlertTriangle size={18} style={{ color: "var(--accent-flame)", flexShrink: 0, marginTop: "2px" }} />}
            <div>
              <strong style={{ color: result.is_valid_comparison ? "var(--color-success)" : "var(--accent-flame)", display: "block", marginBottom: "3px" }}>
                {result.is_valid_comparison ? "VALID COMPARISON DOMAIN" : "INCOMMENSURATE PHYSICAL DOMAINS"}:
              </strong>
              {result.comparability_warning}
            </div>
          </div>

          {/* Experimental Conditions */}
          <div className="card hud-panel" style={{ marginBottom: "22px" }}>
            <div className="card-header">
              <h3 className="card-title">Cross-Investigation Environmental Conditions</h3>
              <span className="badge badge-cyan">FLIGHT METADATA</span>
            </div>
            <div className="table-container">
              <ConditionGrid investigations={result.investigations} />
            </div>
          </div>

          {/* Variable Compatibility Matrix */}
          <div className="card hud-panel" style={{ marginBottom: "22px" }}>
            <div className="card-header">
              <h3 className="card-title">Physical Variable Compatibility Matrix</h3>
              <span style={{ fontSize: "0.74rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                CAN THESE QUANTITATIVE METRICS BE DIRECTLY OVERLAID?
              </span>
            </div>
            <div style={{ padding: "0.5rem 0" }}>
              <CompatibilityMatrix variables={result.variables_analysis} />
            </div>
          </div>

          {/* Shared Observations Chart (only for compatible comparisons) */}
          {result.is_valid_comparison && result.shared_observations.length > 0 && (
            <div className="card hud-panel" style={{ marginBottom: "22px" }}>
              <div className="card-header">
                <h3 className="card-title">Comparable Observations Telemetry</h3>
                <span className="badge badge-green">COMPATIBLE UNITS</span>
              </div>
              <div style={{ padding: "0.5rem 0" }}>
                <SharedObservationsChart observations={result.shared_observations} selectedIds={selectedIds} />
              </div>
            </div>
          )}

          {!result.is_valid_comparison && (
            <div className="card hud-panel" style={{ marginBottom: "22px", textAlign: "center", padding: "26px" }}>
              <strong style={{ color: "var(--accent-flame)", display: "block", marginBottom: "6px" }}>
                PROHIBITED QUANTITATIVE OVERLAY: NO SHARED PHYSICAL AXIS
              </strong>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", maxWidth: "650px", display: "inline-block", lineHeight: 1.6 }}>
                These flight payloads measure fundamentally divergent physical quantities (droplet evaporation K in mm²/s vs. solid flame spread in mm/s vs. soot smoke point in mm). 
                Plotting them on a shared numerical axis violates dimensional homogeneity and scientific integrity.
              </span>
            </div>
          )}

          {/* Recommendation */}
          <div className="card hud-panel" style={{ marginBottom: "22px" }}>
            <div className="card-header">
              <h3 className="card-title">NASA Scientific Synthesis Recommendation</h3>
            </div>
            <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", lineHeight: 1.7 }}>
              {result.recommendation}
            </div>
          </div>

          {/* Source links */}
          <div className="card hud-panel">
            <div className="card-header">
              <h3 className="card-title">Source Citations &amp; Provenance</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {result.investigations.map((inv: any) => (
                <div key={inv.external_id || inv.id} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.82rem", padding: "6px 10px", background: "var(--bg-elevated)", borderRadius: "4px" }}>
                  <span className="badge" style={{ background: `${INV_COLORS[inv.external_id]}22`, color: INV_COLORS[inv.external_id], border: `1px solid ${INV_COLORS[inv.external_id]}55`, minWidth: "65px", justifyContent: "center" }}>
                    {inv.external_id || inv.id}
                  </span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{inv.name}</span>
                  {inv.source_url && (
                    <a href={inv.source_url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline" style={{ fontSize: "0.72rem", padding: "2px 8px", marginLeft: "auto" }}>
                      <ExternalLink size={11} /> NASA Record
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!result && !loading && (
        <div className="card" style={{ padding: "36px", textAlign: "center", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
          SELECT 2–3 NASA INVESTIGATIONS ABOVE AND TRANSMIT QUERY TO SYNTHESIZE EXPERIMENTAL CONDITIONS.
        </div>
      )}
    </div>
  );
}
