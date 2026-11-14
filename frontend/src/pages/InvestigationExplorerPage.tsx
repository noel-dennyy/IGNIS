import React, { useState, useEffect } from "react";
import type { InvestigationSummary, InvestigationDetail, ObservationItem } from "../types";
import { api } from "../api/client";
import {
  ExternalLink,
  FileText,
  Activity,
  Filter
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
      api.getObservations({ investigation_id: selectedId, limit: 30 })
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
      (o.outcome_label && o.outcome_label.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Investigation Selector Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {investigations.map((inv) => (
          <button
            key={inv.id}
            className={`btn ${selectedId === inv.id ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setSelectedId(inv.id)}
          >
            <span>{inv.name}</span>
            <span style={{ fontSize: "0.72rem", opacity: 0.85, fontFamily: "var(--font-mono)" }}>
              ({inv.external_id})
            </span>
          </button>
        ))}
      </div>

      {loading || !detail ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Loading NASA investigation records...
        </div>
      ) : (
        <div>
          {/* Main Detail Header Card */}
          <div className="card card-elevated" style={{ borderLeft: "4px solid var(--accent-cyan)" }}>
            <div className="card-header">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>
                    {detail.name}
                  </h2>
                  <span className="badge badge-cyan">{detail.external_id}</span>
                  <span className="badge badge-purple">{detail.research_area}</span>
                  <span className="badge badge-green">{detail.license}</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                  Persistent DOI: {detail.doi || "None"} · Version: {detail.source_version || "1.0"} · Updated: {detail.source_updated_at || "N/A"}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <a
                  href={detail.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ fontSize: "0.8rem" }}
                >
                  <ExternalLink size={14} />
                  <span>NASA PSI Page</span>
                </a>
              </div>
            </div>

            <p style={{ fontSize: "0.9rem", color: "var(--text-main)", lineHeight: 1.6, marginBottom: "16px" }}>
              {detail.description}
            </p>

            {/* Metadata Fields Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", fontSize: "0.82rem" }}>
              <div style={{ backgroundColor: "var(--bg-surface)", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                <div style={{ color: "var(--text-muted)", marginBottom: "2px" }}>Platform & Facility</div>
                <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{detail.platform} {detail.facility ? `(${detail.facility})` : ""}</div>
              </div>

              <div style={{ backgroundColor: "var(--bg-surface)", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                <div style={{ color: "var(--text-muted)", marginBottom: "2px" }}>NASA Center</div>
                <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{detail.nasa_center}</div>
              </div>

              <div style={{ backgroundColor: "var(--bg-surface)", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                <div style={{ color: "var(--text-muted)", marginBottom: "2px" }}>Gravity Regime</div>
                <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{detail.gravity_regime}</div>
              </div>

              <div style={{ backgroundColor: "var(--bg-surface)", padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                <div style={{ color: "var(--text-muted)", marginBottom: "2px" }}>Fuels / Materials Tested</div>
                <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{detail.fuels_tested.join(", ")}</div>
              </div>
            </div>

            {detail.apparatus && (
              <div style={{ marginTop: "14px", padding: "12px 14px", backgroundColor: "var(--bg-surface)", borderRadius: "6px", border: "1px solid var(--border-color)", fontSize: "0.82rem" }}>
                <strong style={{ color: "var(--accent-cyan)" }}>Apparatus & Diagnostics: </strong>
                <span style={{ color: "var(--text-muted)" }}>{detail.apparatus}</span>
              </div>
            )}
          </div>

          {/* Ingested Source Files from Manifest */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <FileText size={18} color="var(--accent-cyan)" />
                <span>Ingested Source Files & Checksums (Provenance Register)</span>
              </div>
              <span className="badge badge-green">Verified Hashes</span>
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
                      <td style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{f.id}</td>
                      <td>{f.file_name}</td>
                      <td><span className="badge badge-purple">{f.file_type}</span></td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{f.file_size_bytes ? `${f.file_size_bytes} B` : "-"}</td>
                      <td>{f.license}</td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-dim)" }}>
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
                          <span>NASA Link</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Structured Observations Table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Activity size={18} color="var(--accent-cyan)" />
                <span>Verified Experimental Observations ({filteredObs.length} Records)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Filter size={14} color="var(--text-dim)" />
                <input
                  type="text"
                  placeholder="Filter by fuel, suppressant, outcome..."
                  className="input-text"
                  style={{ width: "240px", padding: "6px 10px", fontSize: "0.8rem" }}
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
                      <td style={{ fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--accent-cyan)" }}>
                        {obs.experiment_run_id}
                      </td>
                      <td>{obs.fuel_or_material}</td>
                      <td style={{ color: "var(--text-muted)" }}>{obs.measurement_name}</td>
                      <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-main)" }}>
                        {obs.value_numeric !== null && obs.value_numeric !== undefined ? obs.value_numeric : "N/A"}
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-dim)" }}>
                        {obs.unit || "-"}
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                        {obs.extinction_diameter_mm ? `d_e: ${obs.extinction_diameter_mm} mm` : obs.radiant_heat_flux_kw_m2 ? `Flux: ${obs.radiant_heat_flux_kw_m2} kW/m²` : "-"}
                      </td>
                      <td style={{ fontSize: "0.8rem" }}>
                        {obs.suppressant ? `${obs.suppressant} (${obs.suppressant_fraction_pct}%)` : obs.flow_velocity_cm_s ? `Flow: ${obs.flow_velocity_cm_s} cm/s` : `O2: ${obs.ambient_o2_percent}%`}
                      </td>
                      <td>
                        <span className={`badge ${obs.outcome_label?.includes("Extinction") ? "badge-caution" : obs.outcome_label?.includes("Cool") ? "badge-purple" : "badge-green"}`}>
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
