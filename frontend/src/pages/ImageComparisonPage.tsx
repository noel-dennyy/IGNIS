import { useState, useEffect, useRef, useCallback } from "react";
import { ExternalLink, Info, AlertTriangle } from "lucide-react";
import { api } from "../api/client";
import type { ExperimentImage, ImageCompareResponse } from "../types";

function SliderComparison({ imgA, imgB }: { imgA: ExperimentImage; imgB: ExperimentImage }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "340px", overflow: "hidden", cursor: "ew-resize", userSelect: "none", background: "#0a0f1a", borderRadius: "8px" }}
      onMouseDown={() => { dragging.current = true; }}
      onMouseMove={e => { if (dragging.current) handleMove(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={e => { dragging.current = true; handleMove(e.touches[0].clientX); }}
      onTouchMove={e => { if (dragging.current) handleMove(e.touches[0].clientX); }}
      onTouchEnd={() => { dragging.current = false; }}
    >
      {/* Image B — full width, behind */}
      <img src={imgB.file_path} alt={imgB.title}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain" }} />

      {/* Image A — clipped to slider position */}
      <div style={{ position: "absolute", top: 0, left: 0, width: `${sliderPos}%`, height: "100%", overflow: "hidden" }}>
        <img src={imgA.file_path} alt={imgA.title}
          style={{ position: "absolute", top: 0, left: 0, width: containerRef.current?.clientWidth || 600, height: "100%", objectFit: "contain" }} />
      </div>

      {/* Slider handle */}
      <div style={{
        position: "absolute", top: 0, left: `${sliderPos}%`, height: "100%", width: "2px",
        background: "#38bdf8", transform: "translateX(-50%)"
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "32px", height: "32px", borderRadius: "50%",
          background: "#38bdf8", border: "2px solid #0f172a",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#0f172a", fontSize: "14px", fontWeight: 700
        }}>⇔</div>
      </div>

      {/* Labels */}
      <div style={{ position: "absolute", top: 8, left: 8, fontSize: "0.72rem", background: "rgba(0,0,0,0.6)", color: "#38bdf8", padding: "2px 7px", borderRadius: "4px", pointerEvents: "none" }}>A</div>
      <div style={{ position: "absolute", top: 8, right: 8, fontSize: "0.72rem", background: "rgba(0,0,0,0.6)", color: "#a78bfa", padding: "2px 7px", borderRadius: "4px", pointerEvents: "none" }}>B</div>
    </div>
  );
}

function MetadataTable({ imgA, imgB }: { imgA: ExperimentImage; imgB: ExperimentImage }) {
  const rows = [
    { label: "Investigation", a: imgA.investigation_id, b: imgB.investigation_id },
    { label: "Title", a: imgA.title, b: imgB.title },
    { label: "Gravity Regime", a: imgA.gravity_regime, b: imgB.gravity_regime },
    { label: "Fuel / Material", a: imgA.fuel_or_material, b: imgB.fuel_or_material },
    { label: "Apparatus", a: imgA.apparatus, b: imgB.apparatus },
    { label: "Camera Modality", a: imgA.camera_modality, b: imgB.camera_modality },
    { label: "Observation Time", a: imgA.observation_time_s != null ? `${imgA.observation_time_s}s` : "—", b: imgB.observation_time_s != null ? `${imgB.observation_time_s}s` : "—" },
    { label: "Resolution", a: imgA.resolution || "—", b: imgB.resolution || "—" },
    { label: "Image Type", a: imgA.image_type_label, b: imgB.image_type_label },
  ];

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #1e293b" }}>
          <th style={{ padding: "6px 8px", color: "var(--text-muted)", textAlign: "left", width: "20%", fontWeight: 500 }}>Property</th>
          <th style={{ padding: "6px 8px", color: "#38bdf8", textAlign: "left", width: "40%" }}>Image A</th>
          <th style={{ padding: "6px 8px", color: "#a78bfa", textAlign: "left", width: "40%" }}>Image B</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.label} style={{ borderBottom: "1px solid #0f172a" }}>
            <td style={{ padding: "5px 8px", color: "var(--text-muted)" }}>{row.label}</td>
            <td style={{ padding: "5px 8px", color: row.a === row.b ? "var(--text-secondary)" : "var(--text-primary)" }}>{row.a}</td>
            <td style={{ padding: "5px 8px", color: row.a === row.b ? "var(--text-secondary)" : "var(--text-primary)" }}>{row.b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ImageComparisonPage() {
  const [allImages, setAllImages] = useState<ExperimentImage[]>([]);
  const [selectedA, setSelectedA] = useState<string>("");
  const [selectedB, setSelectedB] = useState<string>("");
  const [comparison, setComparison] = useState<ImageCompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    api.getImages()
      .then(imgs => {
        setAllImages(imgs);
        if (imgs.length >= 2) {
          setSelectedA(imgs[0].id);
          setSelectedB(imgs[1].id);
        }
      })
      .finally(() => setListLoading(false));
  }, []);

  const loadComparison = useCallback(() => {
    if (!selectedA || !selectedB || selectedA === selectedB) return;
    setLoading(true);
    api.compareImages(selectedA, selectedB)
      .then(setComparison)
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [selectedA, selectedB]);

  useEffect(() => {
    if (selectedA && selectedB && selectedA !== selectedB) {
      loadComparison();
    }
  }, [selectedA, selectedB, loadComparison]);

  if (listLoading) return <div className="empty-state">Loading images…</div>;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1.4rem", marginBottom: "0.4rem" }}>
          Image Comparison
        </h2>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", padding: "0.5rem 0.9rem", background: "rgba(245,158,11,0.07)", borderLeft: "3px solid #f59e0b", borderRadius: "4px", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: "2px", color: "#f59e0b" }} />
          <span>All images are <strong>synthetic SVG scientific illustrations</strong>. Visual colour and appearance cannot be used to infer temperature, chemical composition, or any quantitative measurement. Flame morphology in different experiments (FLEX, SAFFIRE-I, SPICE) reflects completely different physics.</span>
        </div>
      </div>

      {/* Selector row */}
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <div className="card-header">
          <h3 className="card-title">Select Images to Compare</h3>
        </div>
        <div style={{ padding: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#38bdf8", marginBottom: "0.3rem" }}>Image A</label>
            <select className="select-box" style={{ width: "100%" }} value={selectedA} onChange={e => setSelectedA(e.target.value)}>
              <option value="">— Select —</option>
              {allImages.map(img => <option key={img.id} value={img.id}>{img.investigation_id}: {img.title}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#a78bfa", marginBottom: "0.3rem" }}>Image B</label>
            <select className="select-box" style={{ width: "100%" }} value={selectedB} onChange={e => setSelectedB(e.target.value)}>
              <option value="">— Select —</option>
              {allImages.filter(img => img.id !== selectedA).map(img => (
                <option key={img.id} value={img.id}>{img.investigation_id}: {img.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Comparison Presets */}
        <div style={{ padding: "0 1rem 1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginRight: "4px" }}>Recommended Presets:</span>
          {[
            { label: "BASS: PMMA Flame vs N2 Quench", a: "IMG-BASS-01", b: "IMG-BASS-02" },
            { label: "FLEX: 0-g vs 1-g Droplet", a: "IMG-FLEX-01", b: "IMG-FLEX-02" },
            { label: "FLEX vs FLEX-2: Pure vs Binary", a: "IMG-FLEX-01", b: "IMG-FLEX2-01" },
            { label: "SAFFIRE: SIBAL vs Multi-Card", a: "IMG-SAFFIRE-02", b: "IMG-SAFFIRE2-01" },
            { label: "SPICE: Clean vs Sooting Tip", a: "IMG-SPICE-01", b: "IMG-SPICE-02" },
          ].map((preset, idx) => (
            <button
              key={idx}
              className="btn btn-outline"
              style={{ fontSize: "0.72rem", padding: "3px 8px" }}
              onClick={() => { setSelectedA(preset.a); setSelectedB(preset.b); }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {selectedA === selectedB && selectedA !== "" && (
        <div className="empty-state">Please select two different images.</div>
      )}

      {loading && <div className="empty-state">Loading comparison…</div>}

      {comparison && !loading && (
        <>
          {/* Synthetic label — mandatory */}
          <div style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", fontSize: "0.72rem", padding: "5px 10px", textAlign: "center", borderRadius: "6px", marginBottom: "0.75rem", fontWeight: 600 }}>
            🔬 Scientific Illustrations (Synthetic) — Not NASA photographs. Drag the slider to reveal differences.
          </div>

          {/* Comparability warning */}
          {!comparison.compatible_for_visual_comparison && (
            <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: "rgba(239,68,68,0.08)", borderLeft: "3px solid #ef4444", borderRadius: "4px", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              <strong style={{ color: "#ef4444" }}>⚠ Cross-Investigation Comparison</strong><br />
              {comparison.comparison_note}
            </div>
          )}
          {comparison.compatible_for_visual_comparison && (
            <div style={{ marginBottom: "1rem", padding: "0.6rem 1rem", background: "rgba(16,185,129,0.07)", borderLeft: "3px solid #10b981", borderRadius: "4px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
              {comparison.comparison_note}
            </div>
          )}

          {/* Slider */}
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <div className="card-header">
              <h3 className="card-title">Image Comparison Slider</h3>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Drag slider to reveal Image B</span>
            </div>
            <div style={{ padding: "1rem" }}>
              <SliderComparison imgA={comparison.image_a} imgB={comparison.image_b} />
            </div>
          </div>

          {/* Side-by-side view */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
            {[comparison.image_a, comparison.image_b].map((img, idx) => (
              <div key={idx} className="card">
                <div style={{ background: idx === 0 ? "rgba(56,189,248,0.08)" : "rgba(167,139,250,0.08)", padding: "0.4rem 0.75rem", borderBottom: "1px solid #1e293b", fontSize: "0.72rem", fontWeight: 700, color: idx === 0 ? "#38bdf8" : "#a78bfa" }}>
                  IMAGE {idx === 0 ? "A" : "B"}
                </div>
                <div style={{ background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", height: "180px" }}>
                  <img src={img.file_path} alt={img.title} style={{ maxWidth: "100%", maxHeight: "170px", objectFit: "contain" }} />
                </div>
                <div style={{ padding: "0.6rem 0.75rem", fontSize: "0.78rem" }}>
                  <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>{img.title}</div>
                  <div style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>{img.investigation_id} · {img.gravity_regime}</div>
                  {img.observation_time_s != null && <div style={{ color: "var(--text-dim)", fontSize: "0.72rem" }}>t = {img.observation_time_s}s</div>}
                  <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                    {img.doi && <a href={`https://doi.org/${img.doi}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.68rem", color: "var(--accent-cyan)", textDecoration: "none" }}><ExternalLink size={10} /> DOI</a>}
                    <a href={img.source_url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.68rem", color: "var(--text-muted)", textDecoration: "none" }}><ExternalLink size={10} /> NASA PSI</a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Metadata table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Side-by-Side Metadata</h3>
            </div>
            <div style={{ padding: "1rem", overflowX: "auto" }}>
              <MetadataTable imgA={comparison.image_a} imgB={comparison.image_b} />
            </div>
            <div style={{ padding: "0.5rem 1rem 0.75rem", borderTop: "1px solid #1e293b", display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-dim)" }}>
              <Info size={12} style={{ flexShrink: 0, marginTop: "2px" }} />
              {comparison.image_a.source_citation}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
