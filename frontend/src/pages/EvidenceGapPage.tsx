import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import type { EvidenceGapResponse } from "../types";
import { AlertTriangle, CheckCircle2, Minus, ExternalLink, Info } from "lucide-react";

type FocusDim = "gravity" | "fuel" | "atmosphere";

const STATUS_COLOR: Record<string, string> = {
  tested: "#10B981",
  partial: "#F59E0B",
  gap: "#EF4444"
};
const STATUS_BG: Record<string, string> = {
  tested: "rgba(16,185,129,0.18)",
  partial: "rgba(245,158,11,0.18)",
  gap: "rgba(239,68,68,0.15)"
};

const StatusCell: React.FC<{ status: string; tooltip?: string }> = ({ status, tooltip }) => (
  <div
    title={tooltip}
    style={{
      width: 28,
      height: 28,
      borderRadius: 4,
      backgroundColor: STATUS_BG[status] || "transparent",
      border: `1.5px solid ${STATUS_COLOR[status] || "#374151"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      cursor: "default"
    }}
  >
    {status === "tested" && <CheckCircle2 size={14} color={STATUS_COLOR.tested} />}
    {status === "partial" && <Minus size={14} color={STATUS_COLOR.partial} />}
    {status === "gap" && <AlertTriangle size={14} color={STATUS_COLOR.gap} />}
  </div>
);

export const EvidenceGapPage: React.FC = () => {
  const [data, setData] = useState<EvidenceGapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusDim, setFocusDim] = useState<FocusDim>("gravity");
  const [selectedGravity, setSelectedGravity] = useState<string>("");
  const [selectedFuel, setSelectedFuel] = useState<string>("");
  const [selectedAtm, setSelectedAtm] = useState<string>("");

  useEffect(() => {
    api.getEvidenceGap()
      .then(d => {
        setData(d);
        setSelectedGravity(d.gravity_regimes[0]);
        setSelectedFuel(d.fuels_materials[0]);
        setSelectedAtm(d.atmosphere_conditions[0]);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: 40, color: "var(--text-muted)" }}>Loading evidence gap matrix…</div>;
  if (error || !data) return <div style={{ padding: 40, color: "var(--color-error)" }}>Error: {error}</div>;

  // Flatten cells for selected filter
  const getSlice = (): Array<{ rowLabel: string; colLabel: string; status: string }> => {
    if (focusDim === "gravity") {
      // rows = fuels, cols = atmospheres, filter by gravity
      return data.fuels_materials.flatMap(fuel =>
        data.atmosphere_conditions.map(atm => {
          const cell = data.cells.find(c => c.gravity === selectedGravity && c.fuel === fuel && c.atmosphere === atm);
          return { rowLabel: fuel, colLabel: atm, status: cell?.status ?? "gap" };
        })
      );
    } else if (focusDim === "fuel") {
      // rows = gravity, cols = atmospheres, filter by fuel
      return data.gravity_regimes.flatMap(grav =>
        data.atmosphere_conditions.map(atm => {
          const cell = data.cells.find(c => c.gravity === grav && c.fuel === selectedFuel && c.atmosphere === atm);
          return { rowLabel: grav, colLabel: atm, status: cell?.status ?? "gap" };
        })
      );
    } else {
      // rows = gravity, cols = fuels, filter by atmosphere
      return data.gravity_regimes.flatMap(grav =>
        data.fuels_materials.map(fuel => {
          const cell = data.cells.find(c => c.gravity === grav && c.fuel === fuel && c.atmosphere === selectedAtm);
          return { rowLabel: grav, colLabel: fuel, status: cell?.status ?? "gap" };
        })
      );
    }
  };

  const slice = getSlice();
  const rows = Array.from(new Set(slice.map(s => s.rowLabel)));
  const cols = Array.from(new Set(slice.map(s => s.colLabel)));

  const { summary } = data;

  return (
    <div>
      {/* Header Card */}
      <div className="card card-elevated" style={{ borderLeft: "4px solid var(--color-error)" }}>
        <div className="card-header">
          <div className="card-title">
            <AlertTriangle size={18} color="var(--color-error)" />
            <span>Microgravity Combustion Evidence Gap Heatmap</span>
          </div>
          <span className="badge badge-caution">Research Frontier Map</span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 16 }}>
          This map shows which combinations of <strong>gravity regime × fuel/material × atmosphere</strong> have been
          experimentally tested in the indexed NASA corpus (PSI-69, PSI-98, PSI-107).
          <strong style={{ color: "var(--color-error)" }}> Red gaps</strong> indicate no indexed experiment exists —
          critical unknowns for spacecraft fire safety design.
        </p>

        {/* Summary Stats */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: "rgba(16,185,129,0.12)", borderRadius: 8, border: "1px solid rgba(16,185,129,0.3)" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-success)" }}>{summary.tested}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tested</div>
          </div>
          <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: "rgba(245,158,11,0.12)", borderRadius: 8, border: "1px solid rgba(245,158,11,0.3)" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-caution)" }}>{summary.partial}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Partial</div>
          </div>
          <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: "rgba(239,68,68,0.12)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-error)" }}>{summary.gap}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Evidence Gaps</div>
          </div>
          <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: "var(--bg-elevated)", borderRadius: 8, border: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent-cyan)" }}>{summary.coverage_pct}%</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Coverage</div>
          </div>
          <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: "var(--bg-elevated)", borderRadius: 8, border: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-muted)" }}>{summary.total_combinations}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Combos</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><Info size={16} color="var(--accent-purple)" /><span>Heatmap View Controls</span></div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
              Fix Dimension (slice by)
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["gravity", "fuel", "atmosphere"] as FocusDim[]).map(dim => (
                <button
                  key={dim}
                  className={`btn ${focusDim === dim ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: "0.8rem", padding: "4px 12px", textTransform: "capitalize" }}
                  onClick={() => setFocusDim(dim)}
                >
                  {dim}
                </button>
              ))}
            </div>
          </div>

          {focusDim === "gravity" && (
            <div>
              <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Gravity Regime</label>
              <select className="select-box" value={selectedGravity} onChange={e => setSelectedGravity(e.target.value)}>
                {data.gravity_regimes.map(g => <option key={g} value={g}>{g.replace(/\n/g, " ")}</option>)}
              </select>
            </div>
          )}
          {focusDim === "fuel" && (
            <div>
              <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Fuel / Material</label>
              <select className="select-box" value={selectedFuel} onChange={e => setSelectedFuel(e.target.value)}>
                {data.fuels_materials.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          )}
          {focusDim === "atmosphere" && (
            <div>
              <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Atmosphere Condition</label>
              <select className="select-box" value={selectedAtm} onChange={e => setSelectedAtm(e.target.value)}>
                {data.atmosphere_conditions.map(a => <option key={a} value={a}>{a.replace(/\n/g, " ")}</option>)}
              </select>
            </div>
          )}

          {/* Legend */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginLeft: "auto" }}>
            {["tested", "partial", "gap"].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <StatusCell status={s} />
                <span style={{ textTransform: "capitalize" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="card" style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 600 }}>
          {/* Column Headers */}
          <div style={{ display: "flex", gap: 4, marginBottom: 6, paddingLeft: 180 }}>
            {cols.map(col => (
              <div
                key={col}
                style={{
                  width: 32,
                  flexShrink: 0,
                  fontSize: "0.65rem",
                  color: "var(--text-dim)",
                  textAlign: "center",
                  lineHeight: 1.2,
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  height: 90,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  wordBreak: "break-word"
                }}
              >
                {col.replace(/\n/g, " ")}
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map(row => (
            <div key={row} style={{ display: "flex", gap: 4, marginBottom: 4, alignItems: "center" }}>
              <div
                style={{
                  width: 176,
                  flexShrink: 0,
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textAlign: "right",
                  paddingRight: 8,
                  lineHeight: 1.2
                }}
              >
                {row.replace(/\n/g, " ")}
              </div>
              {cols.map(col => {
                const cell = slice.find(s => s.rowLabel === row && s.colLabel === col);
                const status = cell?.status ?? "gap";
                return (
                  <StatusCell
                    key={col}
                    status={status}
                    tooltip={`${row.replace(/\n/g, " ")} × ${col.replace(/\n/g, " ")}: ${status.toUpperCase()}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Data Note + Sources */}
      <div className="card">
        <div
          style={{
            backgroundColor: "var(--color-caution-bg)",
            borderLeft: "4px solid var(--color-caution)",
            borderRadius: 6,
            padding: "12px 16px",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            lineHeight: 1.5,
            marginBottom: 14
          }}
        >
          <strong style={{ color: "var(--color-caution)" }}>Data Integrity Note: </strong>
          {data.data_note}
        </div>

        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-dim)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Source Investigations
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {data.source_investigations.map(inv => (
            <a
              key={inv.id}
              href={inv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ fontSize: "0.78rem", padding: "4px 10px" }}
            >
              <ExternalLink size={12} />
              <span>{inv.name} ({inv.id}) · DOI: {inv.doi}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
