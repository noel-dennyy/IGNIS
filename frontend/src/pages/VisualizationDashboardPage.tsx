import { useState, useEffect, useCallback, Fragment } from "react";
import {
  LineChart, Line, ScatterChart, Scatter, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from "recharts";
import { api } from "../api/client";
import type {
  TimeSeriesResponse, ScatterResponse, DistributionResponse,
  HeatmapResponse, ScientificInsight
} from "../types";
import { Flame, Activity, AlertTriangle } from "lucide-react";

type TabId = "time-series" | "scatter" | "distribution" | "heatmap";

const TAB_LABELS: Record<TabId, { label: string; desc: string }> = {
  "time-series": { label: "Time Series Telemetry", desc: "SAFFIRE-I Thermocouple & Spread Curves" },
  "scatter": { label: "Multi-Variable Scatter", desc: "Droplet Regressions & Airflow Correlation" },
  "distribution": { label: "Parameter Distributions", desc: "Statistical Bins, LOI & Burn Rates" },
  "heatmap": { label: "Spatial & Correlation Heatmap", desc: "Duct Temperatures & Variable Covariance" }
};

const HEATMAP_COLORS = (v: number | null): string => {
  if (v === null) return "#19232D";
  if (v > 800) return "#EF4444";
  if (v > 600) return "#FF7626";
  if (v > 400) return "#FFB547";
  if (v > 200) return "#10B981";
  if (v > 0.5) return "#39C5E8"; // high correlation
  if (v > 0.2) return "#38BDF8";
  if (v < -0.5) return "#EF4444";
  if (v < -0.2) return "#FB7185";
  return "#253344";
};

const CleanChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "4px",
        padding: "8px 12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        fontSize: "0.78rem"
      }}>
        {label !== undefined && (
          <div style={{ color: "var(--text-dim)", marginBottom: "4px", borderBottom: "1px solid var(--border-color)", paddingBottom: "3px", fontFamily: "var(--font-mono)" }}>
            Parameter: {label}
          </div>
        )}
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: "12px", color: entry.color || "var(--text-primary)", marginTop: "2px" }}>
            <span>{entry.name}:</span>
            <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>
              {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function ScientificInsightsPanel({ insight }: { insight: ScientificInsight | null }) {
  if (!insight) return null;
  return (
    <div className="card" style={{ marginTop: "1.25rem", borderLeft: "3px solid var(--accent-cyan)" }}>
      <div className="card-header">
        <h3 className="card-title" style={{ fontSize: "0.9rem" }}>
          <Activity size={16} color="var(--accent-cyan)" />
          <span>Scientific Insight &amp; Physical Bounds</span>
        </h3>
        <span className="badge badge-cyan">NASA Grounded</span>
      </div>
      <div style={{ fontSize: "0.86rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
        <p style={{ marginBottom: "0.85rem" }}>
          <strong style={{ color: "var(--text-primary)" }}>What This Graph Shows:</strong> {insight.what_graph_displays}
        </p>

        {insight.important_trends.length > 0 && (
          <div style={{ marginBottom: "0.85rem" }}>
            <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>Key Experimental Trends:</strong>
            <ul style={{ margin: "0 0 0 1.2rem", display: "flex", flexDirection: "column", gap: "4px" }}>
              {insight.important_trends.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}

        {insight.potential_correlations.length > 0 && (
          <div style={{ marginBottom: "0.85rem" }}>
            <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>Correlation vs. Causation Analysis:</strong>
            {insight.potential_correlations.map((c, i) => (
              <p key={i} style={{ marginTop: "2px" }}>{c}</p>
            ))}
          </div>
        )}

        {insight.limitations.length > 0 && (
          <div style={{ marginTop: "0.85rem", padding: "0.75rem 1rem", background: "rgba(255, 181, 71, 0.08)", borderLeft: "3px solid var(--accent-amber)", borderRadius: "4px" }}>
            <strong style={{ color: "var(--accent-amber)", display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertTriangle size={14} /> Measurement Limitations &amp; Boundary Conditions:
            </strong>
            {insight.limitations.map((l, i) => (
              <p key={i} style={{ margin: "0.3rem 0 0", fontSize: "0.82rem" }}>{l}</p>
            ))}
          </div>
        )}

        {insight.conclusions_not_drawable.length > 0 && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem 1rem", background: "rgba(239, 68, 68, 0.08)", borderLeft: "3px solid var(--accent-flame)", borderRadius: "4px" }}>
            <strong style={{ color: "var(--accent-flame)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Flame size={14} /> Conclusions NOT Supported by Current Data:
            </strong>
            {insight.conclusions_not_drawable.map((c, i) => (
              <p key={i} style={{ margin: "0.3rem 0 0", fontSize: "0.82rem" }}>{c}</p>
            ))}
          </div>
        )}

        {insight.source_references.length > 0 && (
          <div style={{ marginTop: "0.85rem", fontSize: "0.76rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            <strong>Official NASA References:</strong> {insight.source_references.join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
}

function TimeSeriesTab() {
  const [data, setData] = useState<TimeSeriesResponse | null>(null);
  const [activeChannels, setActiveChannels] = useState<Set<string>>(new Set(["flame_spread_rate_mm_s", "peak_temperature_c"]));
  const [insight, setInsight] = useState<ScientificInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getTimeSeries("PSI-98"), api.getInsights("time_series")])
      .then(([ts, ins]) => { setData(ts); setInsight(ins); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
      Loading SAFFIRE-I telemetry...
    </div>
  );
  if (error) return (
    <div className="card" style={{ padding: "40px", color: "var(--color-error)", fontFamily: "var(--font-mono)" }}>
      Error loading telemetry: {error}
    </div>
  );
  if (!data || data.data.length === 0) return <div className="card">No time-series data available.</div>;

  const toggleChannel = (key: string) => {
    setActiveChannels(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <>
      <div className="card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h3 className="card-title">{data.title}</h3>
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
              Facility: Cygnus OA-6 Cargo Craft · Forced flow: 20 cm/s · O₂: 21.0%
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {data.channels.map(ch => {
              const active = activeChannels.has(ch.key);
              return (
                <button
                  key={ch.key}
                  onClick={() => toggleChannel(ch.key)}
                  className="btn"
                  style={{
                    backgroundColor: active ? "var(--bg-elevated)" : "transparent",
                    borderColor: active ? ch.color : "var(--border-color)",
                    color: active ? ch.color : "var(--text-dim)",
                    fontSize: "0.74rem",
                    padding: "3px 9px",
                  }}
                >
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: active ? ch.color : "var(--border-color)" }} />
                  <span>{ch.name} ({ch.unit})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: "0.5rem 0" }}>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={data.data} margin={{ top: 15, right: 25, bottom: 25, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="time_elapsed_s"
                label={{ value: `${data.x_axis.label} (${data.x_axis.unit})`, position: "insideBottom", offset: -12, fill: "#64748B", fontSize: 11 }}
                stroke="#1E293B"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
              />
              <YAxis
                stroke="#1E293B"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
              />
              <Tooltip content={<CleanChartTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "10px", color: "#94A3B8", fontSize: "0.78rem" }} />
              {data.channels.filter(ch => activeChannels.has(ch.key)).map(ch => (
                <Line
                  key={ch.key}
                  type="monotone"
                  dataKey={ch.key}
                  stroke={ch.color}
                  dot={false}
                  name={`${ch.name} (${ch.unit})`}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.5rem" }}>
            Source: {data.source_note}
          </p>
        </div>
      </div>
      <ScientificInsightsPanel insight={insight} />
    </>
  );
}

function ScatterTab() {
  const [dataset, setDataset] = useState("flex_droplet");
  const [data, setData] = useState<ScatterResponse | null>(null);
  const [insight, setInsight] = useState<ScientificInsight | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback((ds: string) => {
    setLoading(true);
    Promise.all([api.getScatterData(ds), api.getInsights("scatter")])
      .then(([sc, ins]) => { setData(sc); setInsight(ins); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(dataset); }, [dataset, load]);

  const fuelColors: Record<string, string> = {
    "Methanol": "#39C5E8",
    "n-Heptane": "#FF7626",
    "n-Decane": "#FFB547",
    "Ethanol": "#10B981",
    "Ethylene": "#EF4444",
    "Propane": "#FB923C",
    "PMMA": "#A78BFA",
    "Heptane/Hexadecane": "#38BDF8"
  };

  if (loading) return (
    <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
      Loading scatter regression data...
    </div>
  );
  if (!data) return <div className="card">No scatter data available.</div>;

  const xKey = data.x_axis.key;
  const yKey = data.y_axis.key;

  return (
    <>
      <div className="card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h3 className="card-title">{data.title}</h3>
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
              Cross-run variable regression &amp; droplet residuals
            </span>
          </div>

          <select className="select-box" value={dataset} onChange={e => setDataset(e.target.value)} style={{ minWidth: "240px" }}>
            <option value="flex_droplet">FLEX (PSI-69) — Droplet d₀ vs K</option>
            <option value="flex2_binary">FLEX-2 (PSI-70) — Binary Droplet d₀ vs K</option>
            <option value="bass_solid">BASS (PSI-108) — Airflow vs Flame Spread</option>
            <option value="spice_smoke_point">SPICE (PSI-107) — Jet Velocity vs Smoke Length</option>
          </select>
        </div>

        <div style={{ padding: "0.5rem 0" }}>
          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 15, right: 25, bottom: 35, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis
                type="number"
                dataKey={xKey}
                name={data.x_axis.label}
                unit={` ${data.x_axis.unit}`}
                label={{ value: `${data.x_axis.label} (${data.x_axis.unit})`, position: "insideBottom", offset: -18, fill: "#64748B", fontSize: 11 }}
                stroke="#1E293B"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey={yKey}
                name={data.y_axis.label}
                unit={` ${data.y_axis.unit}`}
                label={{ value: `${data.y_axis.label} (${data.y_axis.unit})`, angle: -90, position: "insideLeft", fill: "#64748B", fontSize: 11 }}
                stroke="#1E293B"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CleanChartTooltip />} />
              <Scatter data={data.points as Record<string, number>[]}>
                {data.points.map((pt, i) => (
                  <Cell key={i} fill={fuelColors[pt["fuel"] as string] || "#39C5E8"} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>

          {/* Fuel Color Legend */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "10px", padding: "8px 12px", background: "var(--bg-elevated)", borderRadius: "4px" }}>
            {Object.entries(fuelColors).map(([fuel, color]) => (
              <span key={fuel} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" }} />
                <span>{fuel}</span>
              </span>
            ))}
          </div>

          <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.5rem" }}>
            Source: {data.source_note}
          </p>
        </div>
      </div>
      <ScientificInsightsPanel insight={insight} />
    </>
  );
}

function DistributionTab() {
  const [variable, setVariable] = useState("burning_rate_k");
  const [data, setData] = useState<DistributionResponse | null>(null);
  const [insight, setInsight] = useState<ScientificInsight | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback((v: string) => {
    setLoading(true);
    Promise.all([api.getDistribution(v), api.getInsights("distribution")])
      .then(([d, ins]) => { setData(d); setInsight(ins); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(variable); }, [variable, load]);

  if (loading) return (
    <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
      Computing statistical distribution...
    </div>
  );
  if (!data) return <div className="card">No distribution data available.</div>;

  const stats = data.statistics;

  return (
    <>
      <div className="card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h3 className="card-title">{data.title}</h3>
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
              Sample distributions &amp; statistical moments
            </span>
          </div>

          <select className="select-box" value={variable} onChange={e => setVariable(e.target.value)} style={{ minWidth: "240px" }}>
            <option value="burning_rate_k">FLEX — Burning Rate K (mm²/s)</option>
            <option value="flex2_burning_rate">FLEX-2 — Binary Burning Rate K (mm²/s)</option>
            <option value="extinction_diameter">FLEX — Extinction Diameter d_e (mm)</option>
            <option value="flame_spread_rate">SAFFIRE-I — Flame Spread Rate (mm/s)</option>
            <option value="bass_flame_spread">BASS — Solid Flame Spread Rate (mm/s)</option>
            <option value="smoke_point_length">SPICE — Smoke-Point Length (mm)</option>
          </select>
        </div>

        <div style={{ padding: "0.5rem 0" }}>
          {/* Statistical Metric Pills */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
            {[
              { label: "Sample size (n)", val: stats.count, color: "var(--text-primary)" },
              { label: `Mean (${data.unit})`, val: stats.mean, color: "var(--accent-molten)" },
              { label: `Median (${data.unit})`, val: stats.median, color: "var(--accent-amber)" },
              { label: `Std Dev (σ)`, val: stats.std_dev, color: "var(--text-secondary)" },
              { label: `Min`, val: stats.min, color: "var(--text-dim)" },
              { label: `Max`, val: stats.max, color: "var(--text-dim)" },
            ].map(s => (
              <div 
                key={s.label} 
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  minWidth: "90px",
                  textAlign: "center",
                  flex: "1 1 0"
                }}
              >
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: s.color, fontFamily: "var(--font-mono)" }}>
                  {s.val}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.bins} margin={{ top: 15, right: 25, bottom: 35, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#1E293B"
                tick={{ fill: "#94A3B8", fontSize: 10 }}
                label={{ value: `${data.unit}`, position: "insideBottom", offset: -18, fill: "#64748B", fontSize: 11 }}
              />
              <YAxis
                stroke="#1E293B"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                label={{ value: "Count", angle: -90, position: "insideLeft", fill: "#64748B", fontSize: 11 }}
              />
              <Tooltip content={<CleanChartTooltip />} />
              <Bar dataKey="count" name="Observations">
                {data.bins.map((_, i) => (
                  <Cell 
                    key={i} 
                    fill={i % 2 === 0 ? "var(--accent-molten)" : "var(--accent-amber)"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.5rem" }}>
            Source: {data.source_note}
          </p>
        </div>
      </div>
      <ScientificInsightsPanel insight={insight} />
    </>
  );
}

function HeatmapTab() {
  const [heatmapType, setHeatmapType] = useState("duct_temperature_grid");
  const [data, setData] = useState<HeatmapResponse | null>(null);
  const [insight, setInsight] = useState<ScientificInsight | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback((ht: string) => {
    setLoading(true);
    Promise.all([api.getHeatmap(ht), api.getInsights("heatmap")])
      .then(([d, ins]) => { setData(d); setInsight(ins); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(heatmapType); }, [heatmapType, load]);

  if (loading) return (
    <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
      Loading heatmap data...
    </div>
  );
  if (!data || data.cells.length === 0) return <div className="card">No heatmap data available.</div>;

  const rows = Array.from(new Set(data.cells.map(c => c.row)));
  const cols = Array.from(new Set(data.cells.map(c => c.col)));
  const cellMap = new Map(data.cells.map(c => [`${c.row}||${c.col}`, c.value]));
  const isCorr = heatmapType === "correlation_matrix";

  return (
    <>
      <div className="card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h3 className="card-title">{data.title}</h3>
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
              {isCorr ? "Variable cross-correlation matrix" : "Duct thermocouple temperature gradient (°C)"}
            </span>
          </div>

          <select className="select-box" value={heatmapType} onChange={e => setHeatmapType(e.target.value)} style={{ minWidth: "240px" }}>
            <option value="duct_temperature_grid">SAFFIRE-I — Flow Duct Temperature Grid</option>
            <option value="correlation_matrix">FLEX — Correlation Matrix</option>
          </select>
        </div>

        <div style={{ padding: "0.5rem 0", overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: `160px repeat(${cols.length}, 1fr)`, gap: "3px", minWidth: "550px" }}>
            {/* Header row */}
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", padding: "6px", fontFamily: "var(--font-mono)" }}>
              {data.row_label}
            </div>
            {cols.map(col => (
              <div key={col} style={{ fontSize: "0.7rem", color: "var(--text-dim)", padding: "6px", textAlign: "center", wordBreak: "break-word", fontFamily: "var(--font-mono)" }}>
                {col}
              </div>
            ))}

            {/* Data rows */}
            {rows.map(row => (
              <Fragment key={row}>
                <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", padding: "6px", display: "flex", alignItems: "center", fontFamily: "var(--font-mono)" }}>
                  {row}
                </div>
                {cols.map(col => {
                  const val = cellMap.get(`${row}||${col}`) ?? null;
                  return (
                    <div
                      key={col}
                      title={val !== null ? `${val} ${data.unit}` : "No measurement recorded"}
                      style={{
                        background: isCorr
                          ? `rgba(${val !== null && val > 0 ? "57,197,232" : "239,68,68"}, ${val !== null ? Math.max(0.15, Math.abs(val) * 0.85) : 0})`
                          : HEATMAP_COLORS(val),
                        borderRadius: "4px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.72rem",
                        color: "#F2F5F7",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        border: "1px solid rgba(0,0,0,0.25)"
                      }}
                    >
                      {val !== null ? (isCorr ? val.toFixed(2) : Math.round(val)) : "—"}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", fontSize: "0.72rem", color: "var(--text-dim)", flexWrap: "wrap", alignItems: "center" }}>
            <span>Measurement unit: <strong style={{ color: "var(--text-primary)" }}>{data.value_label} ({data.unit})</strong></span>
            <span>— : No observation recorded</span>
          </div>

          <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "0.5rem" }}>
            Source: {data.source_note}
          </p>
        </div>
      </div>
      <ScientificInsightsPanel insight={insight} />
    </>
  );
}

export function VisualizationDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("time-series");

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1.3rem", marginBottom: "4px" }}>
          Scientific Telemetry &amp; Measurements
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          Interactive multi-channel charts from verified NASA Physical Sciences Informatics (PSI) flight records.
          Experiments are isolated to maintain dimensional integrity and avoid invalid shared quantitative axes.
        </p>
      </div>

      {/* Clean Tab Bar */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px", flexWrap: "wrap" }}>
        {(Object.entries(TAB_LABELS) as [TabId, { label: string; desc: string }][]).map(([id, meta]) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="btn"
              style={{
                backgroundColor: isActive ? "var(--bg-elevated)" : "transparent",
                borderColor: isActive ? "var(--border-color)" : "transparent",
                color: isActive ? "var(--accent-molten)" : "var(--text-secondary)",
                padding: "6px 12px",
                borderRadius: "4px",
                fontWeight: isActive ? 600 : 400
              }}
            >
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "time-series" && <TimeSeriesTab />}
      {activeTab === "scatter" && <ScatterTab />}
      {activeTab === "distribution" && <DistributionTab />}
      {activeTab === "heatmap" && <HeatmapTab />}
    </div>
  );
}
