import { useState, useEffect } from "react";
import { ExternalLink, Info, ZoomIn } from "lucide-react";
import { api } from "../api/client";
import type { ExperimentImage, ImageAnnotation } from "../types";

const INV_OPTIONS = [
  { value: "", label: "All Investigations" },
  { value: "PSI-69", label: "PSI-69 — FLEX (Droplet Combustion)" },
  { value: "PSI-98", label: "PSI-98 — SAFFIRE-I (Fabric Spread)" },
  { value: "PSI-107", label: "PSI-107 — SPICE (Gas Jet Soot)" },
];

function AnnotationOverlay({ annotations }: { annotations: ImageAnnotation[] }) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {annotations.map(ann => (
        <g key={ann.id}
          style={{ cursor: "pointer", pointerEvents: "all" }}
          onMouseEnter={() => setHover(ann.id)}
          onMouseLeave={() => setHover(null)}>
          <circle
            cx={`${ann.x_pct}%`} cy={`${ann.y_pct}%`}
            r={8} fill={ann.color || "#38bdf8"} fillOpacity={0.25}
            stroke={ann.color || "#38bdf8"} strokeWidth={2}
          />
          <text x={`${ann.x_pct + 2}%`} y={`${ann.y_pct - 1.5}%`}
            fill={ann.color || "#38bdf8"} fontSize={10} fontWeight={600}>
            {ann.label}
          </text>
          {hover === ann.id && (
            <foreignObject x={`${Math.min(ann.x_pct, 70)}%`} y={`${ann.y_pct + 2}%`} width="180" height="80">
              <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", padding: "6px 8px", fontSize: "11px", color: "#e2e8f0", lineHeight: 1.4 }}>
                <strong>{ann.label}:</strong> {ann.description}
              </div>
            </foreignObject>
          )}
        </g>
      ))}
    </svg>
  );
}

function ImageCard({ img, onSelect }: { img: ExperimentImage; onSelect: (img: ExperimentImage) => void }) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <div className="card" style={{ display: "flex", flexDirection: "column" }}>
        {/* Synthetic label — mandatory */}
        <div style={{
          background: "rgba(245,158,11,0.12)", color: "#f59e0b",
          fontSize: "0.68rem", padding: "3px 8px", textAlign: "center",
          borderBottom: "1px solid rgba(245,158,11,0.2)", fontWeight: 600, letterSpacing: "0.03em"
        }}>
          🔬 Scientific Illustration (Synthetic) — Not a NASA photograph
        </div>

        {/* Image area */}
        <div style={{ position: "relative", background: "#0a0f1a", minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={img.file_path} alt={img.title}
            style={{ maxWidth: "100%", maxHeight: "220px", objectFit: "contain" }}
            onError={e => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
          />
          <AnnotationOverlay annotations={img.annotations} />
          <button onClick={() => setFullscreen(true)}
            style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "4px", padding: "4px", cursor: "pointer", color: "#94a3b8" }}>
            <ZoomIn size={14} />
          </button>
        </div>

        <div style={{ padding: "0.75rem" }}>
          <h4 style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.4rem", lineHeight: 1.3 }}>{img.title}</h4>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "0.6rem" }}>{img.description}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.6rem" }}>
            <span className="badge badge-cyan">{img.investigation_id}</span>
            <span className="badge" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}>{img.gravity_regime}</span>
            {img.observation_time_s !== undefined && img.observation_time_s !== null && (
              <span className="badge" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>t={img.observation_time_s}s</span>
            )}
          </div>

          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginBottom: "0.6rem" }}>
            <div><strong>Fuel:</strong> {img.fuel_or_material}</div>
            <div><strong>Camera:</strong> {img.camera_modality}</div>
            {img.resolution && <div><strong>Resolution:</strong> {img.resolution}</div>}
          </div>

          <div style={{ borderTop: "1px solid #1e293b", paddingTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {img.doi && (
              <a href={`https://doi.org/${img.doi}`} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "var(--accent-cyan)", textDecoration: "none" }}>
                <ExternalLink size={11} /> DOI
              </a>
            )}
            <a href={img.source_url} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "var(--text-muted)", textDecoration: "none" }}>
              <ExternalLink size={11} /> NASA PSI
            </a>
            {img.paired_comparison_id && (
              <button onClick={() => onSelect(img)}
                className="btn btn-sm" style={{ marginLeft: "auto", fontSize: "0.72rem" }}>
                Compare
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen modal */}
      {fullscreen && (
        <div onClick={() => setFullscreen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", cursor: "zoom-out" }}>
          <div style={{ color: "#f59e0b", fontSize: "0.75rem", marginBottom: "0.75rem", fontWeight: 600 }}>
            🔬 Scientific Illustration (Synthetic) — Not a NASA photograph. Click anywhere to close.
          </div>
          <img src={img.file_path} alt={img.title} style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain" }} />
          <div style={{ color: "#94a3b8", fontSize: "0.78rem", marginTop: "0.75rem", textAlign: "center" }}>
            {img.title} · {img.source_citation}
          </div>
          <div style={{ color: "#64748b", fontSize: "0.72rem", marginTop: "0.3rem" }}>
            ℹ Do not infer temperatures, chemical species, or measurements from visual appearance.
          </div>
        </div>
      )}
    </>
  );
}

export function ImageGalleryPage() {
  const [images, setImages] = useState<ExperimentImage[]>([]);
  const [invFilter, setInvFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<ExperimentImage | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getImages(invFilter || undefined)
      .then(setImages)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [invFilter]);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1.4rem", marginBottom: "0.4rem" }}>
          Experiment Image Gallery
        </h2>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <select className="select-box" value={invFilter} onChange={e => setInvFilter(e.target.value)} style={{ minWidth: "240px" }}>
            {INV_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {!loading && <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{images.length} illustration{images.length !== 1 ? "s" : ""}</span>}
        </div>
        <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "flex-start", gap: "0.5rem", padding: "0.5rem 0.9rem", background: "rgba(245,158,11,0.07)", borderLeft: "3px solid #f59e0b", borderRadius: "4px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: "2px", color: "#f59e0b" }} />
          <span>All images are <strong>synthetic SVG scientific illustrations</strong> created to represent experimental geometry and phenomena. They are NOT NASA photographs or flight images. Visual color and appearance cannot be used to infer temperature, chemical composition, or quantitative measurements.</span>
        </div>
      </div>

      {loading && <div className="empty-state">Loading image gallery…</div>}
      {error && <div className="empty-state" style={{ color: "#ef4444" }}>Error: {error}</div>}
      {!loading && !error && images.length === 0 && (
        <div className="empty-state">
          <p>No images found for the selected filter.</p>
          <p style={{ fontSize: "0.78rem", marginTop: "0.5rem" }}>
            Run the ingestion pipeline to populate experiment images.
          </p>
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {images.map(img => <ImageCard key={img.id} img={img} onSelect={setSelectedForCompare} />)}
        </div>
      )}

      {selectedForCompare && (
        <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", background: "#0f172a", border: "1px solid #38bdf8", borderRadius: "10px", padding: "0.9rem 1.2rem", zIndex: 1000, maxWidth: "280px" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontWeight: 600, marginBottom: "0.4rem" }}>Image selected for comparison:</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{selectedForCompare.title}</div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
            <button className="btn btn-sm" onClick={() => {/* navigate to image-compare */ setSelectedForCompare(null);}}>
              Go to Comparison →
            </button>
            <button className="btn btn-sm btn-ghost" onClick={() => setSelectedForCompare(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
