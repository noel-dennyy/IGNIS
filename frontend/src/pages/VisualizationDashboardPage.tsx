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

type TabId = "time-series" | "scatter" | "distribution" | "heatmap";

const TAB_LABELS: Record<TabId, string> = {
  "time-series": "Time Series",
  "scatter": "Scatter Plot",
  "distribution": "Distribution",
  "heatmap": "Heatmap"
};

const HEATMAP_COLORS = (v: number | null): string => {
  if (v === null) return "#1e293b";
  if (v > 800) return "#ef4444";
  if (v > 600) return "#f97316";
  if (v > 400) return "#eab308";
  if (v > 200) return "#22c55e";
  if (v > 0.5) return "#38bdf8"; // correlation
  if (v > 0.2) return "#818cf8";
  if (v < -0.5) return "#fb7185";
  if (v < -0.2) return "#f9a8d4";
  return "#334155";
};

function ScientificInsightsPanel({ insight }: { insight: ScientificInsight | null }) {
  if (!insight) return null;
  return (
    <div className="card" style={{ marginTop: "1.5rem" }}>
      <div className="card-header">
        <h3 className="card-title">🔬 Scientific Insights</h3>
      </div>
      <div style={{ padding: "1rem", fontSize: "0.875rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
        <p style={{ marginBottom: "0.75rem" }}><strong style={{ color: "var(--text-primary)" }}>What This Graph Shows:</strong> {insight.what_graph_displays}</p>
        {insight.important_trends.length > 0 && (
          <>
            <strong style={{ color: "var(--text-primary)" }}>Key Trends:</strong>
            <ul style={{ margin: "0.5rem 0 0.75rem 1.2rem" }}>
              {insight.important_trends.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </>
        )}
        {insight.potential_correlations.length > 0 && (
          <>
            <strong style={{ color: "var(--text-primary)" }}>Correlation vs Causation:</strong>
            {insight.potential_correlations.map((c, i) => <p key={i} style={{ marginTop: "0.4rem" }}>{c}</p>)}
          </>
        )}
        {insight.limitations.length > 0 && (
          <div style={{ marginTop: "0.75rem", padding: "0.6rem 0.9rem", background: "rgba(245,158,11,0.08)", borderLeft: "3px solid #f59e0b", borderRadius: "4px" }}>
            <strong style={{ color: "#f59e0b" }}>⚠ Measurement Limitations:</strong>
            {insight.limitations.map((l, i) => <p key={i} style={{ margin: "0.3rem 0 0" }}>{l}</p>)}
          </div>
        )}
        {insight.conclusions_not_drawable.length > 0 && (
          <div style={{ marginTop: "0.75rem", padding: "0.6rem 0.9rem", background: "rgba(239,68,68,0.08)", borderLeft: "3px solid #ef4444", borderRadius: "4px" }}>
            <strong style={{ color: "#ef4444" }}>✗ Conclusions NOT Supported:</strong>
            {insight.conclusions_not_drawable.map((c, i) => <p key={i} style={{ margin: "0.3rem 0 0" }}>{c}</p>)}
          </div>
        )}
        {insight.source_references.length > 0 && (
          <div style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            <strong>Sources:</strong> {insight.source_references.join(" · ")}
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

  if (loading) return <div className="empty-state">Loading SAFFIRE-I telemetry…</div>;
  if (error) return <div className="empty-state" style={{ color: "#ef4444" }}>Error: {error}</div>;
  if (!data || data.data.length === 0) return <div className="empty-state">No time-series data available.</div>;

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
        <div className="card-header" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
          <h3 className="card-title">{data.title}</h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {data.channels.map(ch => (
              <button key={ch.key} onClick={() => toggleChannel(ch.key)}
                className={`btn btn-sm ${activeChannels.has(ch.key) ? "" : "btn-ghost"}`}
                style={{ borderColor: ch.color, color: activeChannels.has(ch.key) ? ch.color : "var(--text-muted)", fontSize: "0.75rem" }}>
                {ch.name} ({ch.unit})
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: "1rem" }}>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={data.data} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time_elapsed_s" label={{ value: `${data.x_axis.label} (${data.x_axis.unit})`, position: "insideBottom", offset: -10, fill: "#64748b" }} stroke="#334155" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis stroke="#334155" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }} />
              <Legend wrapperStyle={{ paddingTop: "10px", color: "#94a3b8", fontSize: "0.78rem" }} />
              {data.channels.filter(ch => activeChannels.has(ch.key)).map(ch => (
                <Line key={ch.key} type="monotone" dataKey={ch.key} stroke={ch.color} dot={false} name={`${ch.name} (${ch.unit})`} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
            📎 {data.source_note}
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
    "Methanol": "#38bdf8", "n-Heptane": "#f59e0b", "n-Decane": "#a78bfa",
    "Ethanol": "#10b981", "Ethylene": "#ef4444", "Propane": "#fb923c"
  };

  if (loading) return <div className="empty-state">Loading scatter data…</div>;
  if (!data) return <div className="empty-state">No scatter data.</div>;

  const xKey = data.x_axis.key;
  const yKey = data.y_axis.key;

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{data.title}</h3>
          <select className="select-box" value={dataset} onChange={e => setDataset(e.target.value)} style={{ minWidth: "200px" }}>
            <option value="flex_droplet">FLEX — Droplet d₀ vs K</option>
            <option value="flex2_binary">FLEX-2 — Binary Droplet d₀ vs K</option>
            <option value="bass_solid">BASS — Airflow vs Flame Spread (Solid)</option>
            <option value="spice_smoke_point">SPICE — Velocity vs Smoke Length</option>
          </select>
        </div>
        <div style={{ padding: "1rem" }}>
          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" dataKey={xKey} name={data.x_axis.label} unit={` ${data.x_axis.unit}`}
                label={{ value: `${data.x_axis.label} (${data.x_axis.unit})`, position: "insideBottom", offset: -15, fill: "#64748b" }}
                stroke="#334155" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis type="number" dataKey={yKey} name={data.y_axis.label} unit={` ${data.y_axis.unit}`}
                label={{ value: `${data.y_axis.label} (${data.y_axis.unit})`, angle: -90, position: "insideLeft", fill: "#64748b" }}
                stroke="#334155" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }}
                formatter={(value: any, name: any) => [`${value}`, `${name}`]} />
              <Scatter data={data.points as Record<string, number>[]}>
                {data.points.map((pt, i) => (
                  <Cell key={i} fill={fuelColors[pt["fuel"] as string] || "#38bdf8"} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
            {Object.entries(fuelColors).map(([fuel, color]) => (
              <span key={fuel} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} /> {fuel}
              </span>
            ))}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>📎 {data.source_note}</p>
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

  if (loading) return <div className="empty-state">Loading distribution…</div>;
  if (!data) return <div className="empty-state">No distribution data.</div>;

  const stats = data.statistics;

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{data.title}</h3>
          <select className="select-box" value={variable} onChange={e => setVariable(e.target.value)}>
            <option value="burning_rate_k">FLEX — Burning Rate K (mm²/s)</option>
            <option value="flex2_burning_rate">FLEX-2 — Binary Burning Rate K (mm²/s)</option>
            <option value="extinction_diameter">FLEX — Extinction Diameter d_e (mm)</option>
            <option value="flame_spread_rate">SAFFIRE-I — Flame Spread Rate (mm/s)</option>
            <option value="bass_flame_spread">BASS — Solid Flame Spread Rate (mm/s)</option>
            <option value="smoke_point_length">SPICE — Smoke-Point Length (mm)</option>
          </select>
        </div>
        <div style={{ padding: "1rem" }}>
          <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {[
              { label: "n", val: stats.count },
              { label: `Mean (${data.unit})`, val: stats.mean },
              { label: `Median (${data.unit})`, val: stats.median },
              { label: `Std Dev`, val: stats.std_dev },
              { label: `Min`, val: stats.min },
              { label: `Max`, val: stats.max },
            ].map(s => (
              <div key={s.label} className="metric-card" style={{ minWidth: "80px", textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-cyan)" }}>{s.val}</div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.bins} margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#334155" tick={{ fill: "#94a3b8", fontSize: 10 }}
                label={{ value: `${data.unit}`, position: "insideBottom", offset: -15, fill: "#64748b" }} />
              <YAxis stroke="#334155" tick={{ fill: "#94a3b8", fontSize: 11 }}
                label={{ value: "Count", angle: -90, position: "insideLeft", fill: "#64748b" }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", color: "#e2e8f0" }} />
              <Bar dataKey="count" name="Observations">
                {data.bins.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? "#38bdf8" : "#0ea5e9"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>📎 {data.source_note}</p>
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

  if (loading) return <div className="empty-state">Loading heatmap…</div>;
  if (!data || data.cells.length === 0) return <div className="empty-state">No heatmap data.</div>;

  const rows = Array.from(new Set(data.cells.map(c => c.row)));
  const cols = Array.from(new Set(data.cells.map(c => c.col)));
  const cellMap = new Map(data.cells.map(c => [`${c.row}||${c.col}`, c.value]));

  const isCorr = heatmapType === "correlation_matrix";

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{data.title}</h3>
          <select className="select-box" value={heatmapType} onChange={e => setHeatmapType(e.target.value)}>
            <option value="duct_temperature_grid">SAFFIRE-I — Duct Temperature Grid</option>
            <option value="correlation_matrix">FLEX — Correlation Matrix</option>
          </select>
        </div>
        <div style={{ padding: "1rem", overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: `140px repeat(${cols.length}, 1fr)`, gap: "2px", minWidth: "500px" }}>
            {/* Header row */}
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", padding: "4px" }}>{data.row_label}</div>
            {cols.map(col => (
              <div key={col} style={{ fontSize: "0.65rem", color: "var(--text-muted)", padding: "4px", textAlign: "center", wordBreak: "break-word" }}>{col}</div>
            ))}
            {/* Data rows */}
            {rows.map(row => (
              <Fragment key={row}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", padding: "4px", display: "flex", alignItems: "center" }}>{row}</div>
                {cols.map(col => {
                  const val = cellMap.get(`${row}||${col}`) ?? null;
                  return (
                    <div key={col} title={val !== null ? `${val} ${data.unit}` : "No data"}
                      style={{
                        background: isCorr
                          ? `rgba(${val !== null && val > 0 ? "56,189,248" : "239,68,68"}, ${val !== null ? Math.abs(val) * 0.9 : 0})`
                          : HEATMAP_COLORS(val),
                        borderRadius: "3px", height: "32px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.65rem", color: "#e2e8f0", fontWeight: 600
                      }}>
                      {val !== null ? (isCorr ? val.toFixed(2) : Math.round(val)) : "—"}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", fontSize: "0.72rem", color: "var(--text-muted)", flexWrap: "wrap", alignItems: "center" }}>
            <span>Unit: <strong style={{ color: "var(--text-secondary)" }}>{data.value_label} ({data.unit})</strong></span>
            <span>—= No measurement (not zero)</span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>📎 {data.source_note}</p>
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
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1.4rem", marginBottom: "0.4rem" }}>
          Scientific Visualization Dashboard
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Interactive charts from verified NASA PSI records. All measurements are real experimental observations.
          No data is fabricated or imputed.
        </p>
        <div style={{ marginTop: "0.75rem", padding: "0.5rem 0.9rem", background: "rgba(56,189,248,0.07)", borderLeft: "3px solid #38bdf8", borderRadius: "4px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          ⚠ Experiments (FLEX, SAFFIRE-I, SPICE) have different apparatus, fuels, and measurement domains.
          They are shown on <strong>separate tabs</strong> and are not plotted on shared quantitative axes.
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", borderBottom: "1px solid #1e293b", paddingBottom: "0" }}>
        {(Object.entries(TAB_LABELS) as [TabId, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`btn btn-sm ${activeTab === id ? "" : "btn-ghost"}`}
            style={{ borderRadius: "6px 6px 0 0", borderBottom: activeTab === id ? "2px solid var(--accent-cyan)" : "2px solid transparent" }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "time-series" && <TimeSeriesTab />}
      {activeTab === "scatter" && <ScatterTab />}
      {activeTab === "distribution" && <DistributionTab />}
      {activeTab === "heatmap" && <HeatmapTab />}
    </div>
  );
}
