import React, { useState, useEffect } from "react";
import type { CompareResponse, InvestigationSummary } from "../types";
import { api } from "../api/client";
import {
  GitCompare,
  CheckCircle2,
  XCircle,
  BarChart2,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

export const EvidenceComparePage: React.FC = () => {
  const [investigations, setInvestigations] = useState<InvestigationSummary[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(["PSI-69", "PSI-98"]);
  const [compareData, setCompareData] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getInvestigations().then((res) => setInvestigations(res));
  }, []);

  useEffect(() => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    api
      .compare(selectedIds)
      .then((res) => {
        setCompareData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Compare error:", err);
        setLoading(false);
      });
  }, [selectedIds]);

  const toggleInvestigation = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Prepare chart data for single-investigation valid comparisons
  const isFlexOnly = selectedIds.length === 1 && selectedIds[0] === "PSI-69";
  const isSaffireOnly = selectedIds.length === 1 && selectedIds[0] === "PSI-98";

  const chartData = compareData?.shared_observations
    .filter((o) => o.value_numeric !== null && o.value_numeric !== undefined)
    .map((o) => ({
      name: o.experiment_run_id,
      value: o.value_numeric,
      unit: o.unit,
      fuel: o.fuel_or_material,
      suppressant: o.suppressant || "None"
    })) || [];

  return (
    <div>
      {/* Investigation Selector Header */}
      <div className="card card-elevated">
        <div className="card-header">
          <div className="card-title">
            <GitCompare size={18} color="var(--accent-cyan)" />
            <span>Select Investigations for Comparability Analysis</span>
          </div>
          <span className="badge badge-purple">Scientific Comparability Engine</span>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
          {investigations.map((inv) => {
            const isSelected = selectedIds.includes(inv.id);
            return (
              <button
                key={inv.id}
                className={`btn ${isSelected ? "btn-primary" : "btn-secondary"}`}
                onClick={() => toggleInvestigation(inv.id)}
              >
                <span>{inv.name}</span>
                <span style={{ fontSize: "0.72rem", opacity: 0.85, fontFamily: "var(--font-mono)" }}>
                  ({inv.external_id})
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
          Select two or more investigations to test cross-experiment comparability, or select one to view verified parameter curves.
        </div>
      </div>

      {loading || !compareData ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Evaluating scientific comparability rules...
        </div>
      ) : (
        <div>
          {/* Scientific Comparability Banner */}
          {!compareData.is_valid_comparison ? (
            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                borderLeft: "4px solid var(--color-error)",
                borderTop: "1px solid var(--border-color)",
                borderRight: "1px solid var(--border-color)",
                borderBottom: "1px solid var(--border-color)",
                borderRadius: "6px",
                padding: "16px",
                marginBottom: "20px"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <XCircle size={22} color="var(--color-error)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-error)", marginBottom: "4px" }}>
                    SCIENTIFIC INTEGRITY ENFORCEMENT: QUANTITATIVE OVERLAY REFUSED
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.5, marginBottom: "8px" }}>
                    {compareData.comparability_warning}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <strong style={{ color: "var(--accent-cyan)" }}>Recommendation: </strong>
                    {compareData.recommendation}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                borderLeft: "4px solid var(--color-success)",
                borderTop: "1px solid var(--border-color)",
                borderRight: "1px solid var(--border-color)",
                borderBottom: "1px solid var(--border-color)",
                borderRadius: "6px",
                padding: "16px",
                marginBottom: "20px"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <CheckCircle2 size={22} color="var(--color-success)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-success)", marginBottom: "4px" }}>
                    VALID COMPARISON: UNIFORM EXPERIMENTAL REGIME
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.5 }}>
                    {compareData.comparability_warning}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Side-by-Side Context Matrix */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Info size={18} color="var(--accent-cyan)" />
                <span>Side-by-Side Experimental Context Matrix</span>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Parameter / Condition</th>
                    {compareData.investigations.map((inv) => (
                      <th key={inv.id} style={{ color: "var(--accent-cyan)" }}>
                        {inv.name} ({inv.external_id})
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Combustion Geometry</td>
                    {compareData.investigations.map((inv) => (
                      <td key={inv.id}>
                        {inv.id === "PSI-69" ? "Spherical Droplet" : inv.id === "PSI-98" ? "Planar Fabric Sheet (0.4 x 0.94 m)" : "Axisymmetric Gas Jet"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Fuel / Material Phase</td>
                    {compareData.investigations.map((inv) => (
                      <td key={inv.id}>
                        {inv.id === "PSI-69" ? "Liquid (Heptane, Methanol)" : inv.id === "PSI-98" ? "Solid (Cotton / Fiberglass SIBAL)" : "Gas (Ethylene, Propane)"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Flow Field Dynamics</td>
                    {compareData.investigations.map((inv) => (
                      <td key={inv.id}>
                        {inv.id === "PSI-69" ? "Quiescent (~0 cm/s)" : inv.id === "PSI-98" ? "Forced Duct Flow (20 cm/s)" : "Co-Flow Boundary (5 - 40 cm/s)"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Primary Measurement</td>
                    {compareData.investigations.map((inv) => (
                      <td key={inv.id} style={{ fontFamily: "var(--font-mono)", color: "var(--accent-purple)" }}>
                        {inv.id === "PSI-69" ? "Burning rate constant K (mm²/s)" : inv.id === "PSI-98" ? "Flame spread rate (mm/s)" : "Smoke point flame length (mm)"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Flight Platform</td>
                    {compareData.investigations.map((inv) => (
                      <td key={inv.id}>{inv.platform}</td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>DOI & License</td>
                    {compareData.investigations.map((inv) => (
                      <td key={inv.id} style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
                        {inv.doi} ({inv.license})
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Variables Comparability Evaluation */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <CheckCircle2 size={18} color="var(--accent-cyan)" />
                <span>Individual Variable Compatibility Breakdown</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {compareData.variables_analysis.map((v, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color)",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px"
                  }}
                >
                  {v.is_comparable ? (
                    <span className="badge badge-green" style={{ marginTop: "2px" }}>COMPATIBLE</span>
                  ) : (
                    <span className="badge badge-error" style={{ marginTop: "2px" }}>INCOMPATIBLE</span>
                  )}
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.88rem" }}>
                      {v.variable_name}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {v.reason}
                    </div>
                    {v.notes && (
                      <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "4px" }}>
                        Scientific note: {v.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Validated Numeric Chart (Only for single or validated compatible comparison) */}
          {compareData.is_valid_comparison && chartData.length > 0 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <BarChart2 size={18} color="var(--accent-cyan)" />
                  <span>
                    Quantitative Parameter Variation (
                    {isFlexOnly ? "FLEX Burning Rate K [mm²/s]" : isSaffireOnly ? "SAFFIRE-I Flame Spread [mm/s]" : "Smoke Point Measurements"}
                    )
                  </span>
                </div>
                <span className="badge badge-cyan">Real Measured Values</span>
              </div>

              <div style={{ height: "300px", width: "100%", marginTop: "10px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "#E5E7EB" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name={isFlexOnly ? "K (mm²/s)" : "Measurement"}
                      stroke="#38BDF8"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#38BDF8" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
