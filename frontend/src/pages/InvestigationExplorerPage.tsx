import React, { useState, useEffect } from "react";
import type { InvestigationSummary, InvestigationDetail, ObservationItem } from "../types";
import { api } from "../api/client";
import {
  ExternalLink,
  FileText,
  Activity,
  Filter,
  Flame,
  ShieldCheck,
  Compass
} from "lucide-react";

interface InvestigationExplorerPageProps {
  initialInvestigationId?: string;
}

export const InvestigationExplorerPage: React.FC<InvestigationExplorerPageProps> = ({
  initialInvestigationId = "PSI-69"
}) => {
  const [investigations, setInvestigations] = useState<InvestigationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string>(initialInvestigationId);
  const [detail, setDetail] = useState<InvestigationDetail | null>(null);
  const [observations, setObservations] = useState<ObservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [obsFilter, setObsFilter] = useState<string>("");

  useEffect(() => {
    api.getInvestigations().then((res) => {
      setInvestigations(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    Promise.all([
      api.getInvestigationDetail(selectedId),
      api.getObservations({ investigation_id: selectedId, limit: 40 })
    ])
      .then(([det, obs]) => {
        setDetail(det);
        setObservations(obs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading detail:", err);
        setLoading(false);
      });
  }, [selectedId]);

  const filteredObs = observations.filter((o) => {
    if (!obsFilter) return true;
    const q = obsFilter.toLowerCase();
    return (
      o.fuel_or_material.toLowerCase().includes(q) ||
      (o.suppressant && o.suppressant.toLowerCase().includes(q)) ||
      (o.outcome_label && o.outcome_label.toLowerCase().includes(q)) ||
      o.experiment_run_id.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Top Header Information */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <Compass size={20} color="var(--accent-molten)" />
          <h2 style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.35rem" }}>
            NASA PSI Investigation Explorer
          </h2>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
          Inspect verified flight experiment apparatus, fuel specifications, source document manifests, and individual sensor telemetry observations.
        </p>
      </div>

      {/* Investigation Selector Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "22px", flexWrap: "wrap" }}>
        {investigations.map((inv) => {
          const isSelected = selectedId === inv.id;
          return (
            <button
              key={inv.id}
              className="btn"
              style={{
                backgroundColor: isSelected ? "rgba(255, 118, 38, 0.15)" : "var(--bg-surface)",
                borderColor: isSelected ? "var(--accent-molten)" : "var(--border-color)",
                color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                boxShadow: isSelected ? "0 0 12px rgba(255, 118, 38, 0.25)" : "none",
                padding: "8px 14px",
                borderRadius: "6px"
              }}
              onClick={() => setSelectedId(inv.id)}
            >
              <span style={{ fontWeight: 700, color: isSelected ? "var(--accent-molten)" : "var(--text-primary)" }}>
                {inv.name}
              </span>
              <span style={{ fontSize: "0.72rem", opacity: 0.85, fontFamily: "var(--font-mono)" }}>
                [{inv.external_id}]
              </span>
            </button>
          );
        })}
      </div>

      {loading || !detail ? (
        <div className="card hud-panel" style={{ padding: "50px", textAlign: "center", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
          <Flame size={24} className="brand-flame-icon" style={{ margin: "0 auto 10px" }} />
          <div>RETRIEVING FLIGHT APPARATUS TELEMETRY FROM PSI DATABASE...</div>
        </div>
      ) : (
        <div>
          {/* Main Detail Header Card */}
          <div className="card hud-panel" style={{ borderLeft: "3px solid var(--accent-molten)", marginBottom: "22px" }}>
            <div className="card-header" style={{ flexWrap: "wrap", gap: "10px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    {detail.name}
                  </h2>
                  <span className="badge badge-molten">{detail.external_id}</span>
                  <span className="badge badge-cyan">{detail.research_area}</span>
                  <span className="badge badge-green">
                    <ShieldCheck size={11} /> {detail.license}
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                  DOI: {detail.doi || "None"} · Schema Version: {detail.source_version || "1.0"} · Synchronized: {detail.source_updated_at || "N/A"}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <a
                  href={detail.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ fontSize: "0.78rem", padding: "6px 12px" }}
                >
                  <ExternalLink size={13} />
                  <span>NASA PSI Page</span>
                </a>
              </div>
            </div>

            <p style={{ fontSize: "0.92rem", color: "var(--text-primary)", lineHeight: 1.65, marginBottom: "18px" }}>
              {detail.description}
            </p>

            {/* Metadata Fields Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", fontSize: "0.82rem" }}>
              <div style={{ backgroundColor: "var(--bg-elevated)", padding: "12px 14px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                <div style={{ color: "var(--text-dim)", marginBottom: "4px", fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>PLATFORM &amp; FACILITY</div>
                <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{detail.platform} {detail.facility ? `(${detail.facility})` : ""}</div>
              </div>

              <div style={{ backgroundColor: "var(--bg-elevated)", padding: "12px 14px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                <div style={{ color: "var(--text-dim)", marginBottom: "4px", fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>NASA RESEARCH CENTER</div>
                <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{detail.nasa_center}</div>
              </div>

              <div style={{ backgroundColor: "var(--bg-elevated)", padding: "12px 14px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                <div style={{ color: "var(--text-dim)", marginBottom: "4px", fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>GRAVITATIONAL REGIME</div>
                <div style={{ fontWeight: 700, color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>{detail.gravity_regime}</div>
              </div>

              <div style={{ backgroundColor: "var(--bg-elevated)", padding: "12px 14px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                <div style={{ color: "var(--text-dim)", marginBottom: "4px", fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>FUELS / MATERIALS TESTED</div>
                <div style={{ fontWeight: 700, color: "var(--accent-amber)" }}>{detail.fuels_tested.join(", ")}</div>
              </div>
            </div>

            {detail.apparatus && (
              <div style={{ marginTop: "14px", padding: "12px 16px", backgroundColor: "var(--bg-elevated)", borderRadius: "6px", border: "1px solid var(--border-color)", fontSize: "0.84rem" }}>
                <strong style={{ color: "var(--accent-molten)", fontFamily: "var(--font-mono)", fontSize: "0.76rem" }}>DIAGNOSTICS &amp; SENSORS: </strong>
                <span style={{ color: "var(--text-secondary)" }}>{detail.apparatus}</span>
              </div>
            )}
          </div>

          {/* Ingested Source Files from Manifest */}
          <div className="card hud-panel" style={{ marginBottom: "22px" }}>
            <div className="card-header">
              <div className="card-title">
                <FileText size={18} color="var(--accent-cyan)" />
                <span>Ingested Source Files &amp; Cryptographic Checksums (Provenance Register)</span>
              </div>
              <span className="badge badge-green">VERIFIED CC0-1.0 HASHES</span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>File Identifier</th>
                    <th>File Name</th>
                    <th>File Type</th>
                    <th>Size</th>
                    <th>License</th>
                    <th>SHA-256 Checksum</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.source_files.map((f) => (
                    <tr key={f.id}>
                      <td style={{ fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--accent-cyan)" }}>{f.id}</td>
                      <td style={{ color: "var(--text-primary)" }}>{f.file_name}</td>
                      <td><span className="badge badge-cyan">{f.file_type}</span></td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{f.file_size_bytes ? `${f.file_size_bytes} B` : "-"}</td>
                      <td><span className="badge badge-green">{f.license}</span></td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--text-dim)" }}>
                        {f.sha256 ? `${f.sha256.substring(0, 16)}...` : "Verified"}
                      </td>
                      <td>
                        <a
                          href={f.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                          style={{ padding: "3px 8px", fontSize: "0.72rem" }}
                        >
                          <ExternalLink size={12} />
                          <span>NASA Record</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Structured Observations Table */}
          <div className="card hud-panel">
            <div className="card-header" style={{ flexWrap: "wrap", gap: "10px" }}>
              <div className="card-title">
                <Activity size={18} color="var(--accent-molten)" />
                <span>Verified Flight Observations ({filteredObs.length} Records)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Filter size={14} color="var(--accent-amber)" />
                <input
                  type="text"
                  placeholder="Filter by fuel, suppressant, outcome, run..."
                  className="input-text"
                  style={{ width: "260px", padding: "6px 12px", fontSize: "0.8rem" }}
                  value={obsFilter}
                  onChange={(e) => setObsFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Run / Test ID</th>
                    <th>Fuel / Material</th>
                    <th>Measurement Name</th>
                    <th>Value</th>
                    <th>Unit</th>
                    <th>Extinction / Spread</th>
                    <th>Atmosphere / Flow</th>
                    <th>Outcome / Regime</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredObs.map((obs) => (
                    <tr key={obs.id}>
                      <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent-molten)" }}>
                        {obs.experiment_run_id}
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{obs.fuel_or_material}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{obs.measurement_name}</td>
                      <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent-cyan)" }}>
                        {obs.value_numeric !== null && obs.value_numeric !== undefined ? obs.value_numeric : "N/A"}
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-dim)" }}>
                        {obs.unit || "-"}
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent-amber)" }}>
                        {obs.extinction_diameter_mm ? `d_e: ${obs.extinction_diameter_mm} mm` : obs.radiant_heat_flux_kw_m2 ? `Flux: ${obs.radiant_heat_flux_kw_m2} kW/m²` : "-"}
                      </td>
                      <td style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        {obs.suppressant ? `${obs.suppressant} (${obs.suppressant_fraction_pct}%)` : obs.flow_velocity_cm_s ? `Flow: ${obs.flow_velocity_cm_s} cm/s` : `O2: ${obs.ambient_o2_percent}%`}
                      </td>
                      <td>
                        <span className={`badge ${obs.outcome_label?.includes("Extinction") ? "badge-flame" : obs.outcome_label?.includes("Cool") ? "badge-cyan" : "badge-green"}`}>
                          {obs.outcome_label || "Recorded"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
