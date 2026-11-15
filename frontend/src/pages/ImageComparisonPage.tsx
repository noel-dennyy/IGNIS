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
      style={{
        position: "relative",
        width: "100%",
        height: "360px",
        overflow: "hidden",
        cursor: "ew-resize",
        userSelect: "none",
        background: "#080B10",
        borderRadius: "6px",
        border: "1px solid var(--border-color)",
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)"
      }}
      onMouseDown={() => { dragging.current = true; }}
      onMouseMove={e => { if (dragging.current) handleMove(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={e => { dragging.current = true; handleMove(e.touches[0].clientX); }}
      onTouchMove={e => { if (dragging.current) handleMove(e.touches[0].clientX); }}
      onTouchEnd={() => { dragging.current = false; }}
    >
      {/* Image B — full width, behind */}
      <img
        src={imgB.file_path}
        alt={imgB.title}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain" }}
      />

      {/* Image A — clipped to slider position */}
      <div style={{ position: "absolute", top: 0, left: 0, width: `${sliderPos}%`, height: "100%", overflow: "hidden" }}>
        <img
          src={imgA.file_path}
          alt={imgA.title}
          style={{ position: "absolute", top: 0, left: 0, width: containerRef.current?.clientWidth || 700, height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Slider vertical separator */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${sliderPos}%`,
          height: "100%",
          width: "2px",
          background: "var(--accent-molten)",
          transform: "translateX(-50%)"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "var(--accent-molten)",
            border: "2px solid #080B10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#080B10",
            fontSize: "12px",
            fontWeight: 700
          }}
        >
          ⇔
        </div>
      </div>

      {/* Labels */}
      <div style={{ position: "absolute", top: 12, left: 12, fontSize: "0.72rem", background: "rgba(17,24,32,0.85)", border: "1px solid var(--accent-cyan)", color: "var(--accent-cyan)", padding: "3px 9px", borderRadius: "4px", pointerEvents: "none" }}>
        Image A: {imgA.investigation_id}
      </div>
      <div style={{ position: "absolute", top: 12, right: 12, fontSize: "0.72rem", background: "rgba(17,24,32,0.85)", border: "1px solid var(--accent-molten)", color: "var(--accent-molten)", padding: "3px 9px", borderRadius: "4px", pointerEvents: "none" }}>
        Image B: {imgB.investigation_id}
      </div>
    </div>
  );
}

function MetadataTable({ imgA, imgB }: { imgA: ExperimentImage; imgB: ExperimentImage }) {
  const rows = [
    { label: "Investigation Payload", a: imgA.investigation_id, b: imgB.investigation_id },
    { label: "Observation Title", a: imgA.title, b: imgB.title },
    { label: "Gravitational Regime", a: imgA.gravity_regime, b: imgB.gravity_regime },
    { label: "Fuel / Material Matrix", a: imgA.fuel_or_material, b: imgB.fuel_or_material },
    { label: "Apparatus / Diagnostic", a: imgA.apparatus, b: imgB.apparatus },
    { label: "Camera Modality", a: imgA.camera_modality, b: imgB.camera_modality },
    { label: "Observation Time (t)", a: imgA.observation_time_s != null ? `${imgA.observation_time_s}s` : "—", b: imgB.observation_time_s != null ? `${imgB.observation_time_s}s` : "—" },
    { label: "Image Resolution", a: imgA.resolution || "—", b: imgB.resolution || "—" },
    { label: "Scientific Attribution", a: imgA.image_type_label, b: imgB.image_type_label },
  ];

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
      <thead>
        <tr style={{ borderBottom: "1px solid var(--border-color)", background: "var(--bg-elevated)" }}>
          <th style={{ padding: "8px 12px", color: "var(--text-secondary)", textAlign: "left", width: "24%", fontWeight: 600, fontSize: "0.75rem" }}>
            Physical Parameter
          </th>
          <th style={{ padding: "8px 12px", color: "var(--accent-cyan)", textAlign: "left", width: "38%", fontWeight: 600, fontSize: "0.78rem" }}>
            Image A ({imgA.id})
          </th>
          <th style={{ padding: "8px 12px", color: "var(--accent-molten)", textAlign: "left", width: "38%", fontWeight: 600, fontSize: "0.78rem" }}>
            Image B ({imgB.id})
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.label} style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "8px 12px", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.76rem" }}>{row.label}</td>
            <td style={{ padding: "8px 12px", color: row.a === row.b ? "var(--text-secondary)" : "var(--text-primary)", fontWeight: row.a === row.b ? 400 : 600 }}>{row.a}</td>
            <td style={{ padding: "8px 12px", color: row.a === row.b ? "var(--text-secondary)" : "var(--text-primary)", fontWeight: row.a === row.b ? 400 : 600 }}>{row.b}</td>
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

  if (listLoading) return (
    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
      Loading experimental imagery catalog...
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1.3rem", marginBottom: "4px" }}>
          Experimental Flame Morphology &amp; Image Comparison
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          Compare flame geometry, soot boundaries, and spread characteristics across NASA microgravity flight investigations.
        </p>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "8px 12px", background: "rgba(245, 158, 11, 0.06)", borderLeft: "3px solid var(--accent-amber)", borderRadius: "3px", fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "10px" }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: "2px", color: "var(--accent-amber)" }} />
          <span>Scientific Note: Flame illustrations represent synthesized scientific geometries derived from flight records. Pixel brightness/color cannot be used to infer absolute gas temperatures without radiometric calibration.</span>
        </div>
      </div>

      {/* Selector row */}
      <div className="card" style={{ marginBottom: "18px" }}>
        <div className="card-header">
          <h3 className="card-title">Select Images to Compare</h3>
          <span className="badge badge-molten">12 Records Available</span>
        </div>

        <div style={{ padding: "0.5rem 0 1rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={{ display: "block", fontSize: "0.74rem", color: "var(--accent-cyan)", marginBottom: "4px" }}>
              Image A (Left)
            </label>
            <select className="select-box" style={{ width: "100%" }} value={selectedA} onChange={e => setSelectedA(e.target.value)}>
              <option value="">— Select Image —</option>
              {allImages.map(img => <option key={img.id} value={img.id}>{img.investigation_id}: {img.title}</option>)}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={{ display: "block", fontSize: "0.74rem", color: "var(--accent-molten)", marginBottom: "4px" }}>
              Image B (Right)
            </label>
            <select className="select-box" style={{ width: "100%" }} value={selectedB} onChange={e => setSelectedB(e.target.value)}>
              <option value="">— Select Frame —</option>
              {allImages.filter(img => img.id !== selectedA).map(img => (
                <option key={img.id} value={img.id}>{img.investigation_id}: {img.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Comparison Presets */}
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.74rem", color: "var(--text-dim)", marginRight: "4px" }}>
            Comparison presets:
          </span>
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
              style={{ fontSize: "0.72rem", padding: "4px 10px", backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-color)" }}
              onClick={() => { setSelectedA(preset.a); setSelectedB(preset.b); }}
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedA === selectedB && selectedA !== "" && (
        <div className="card" style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          Please select two different images to inspect differences.
        </div>
      )}

      {loading && (
        <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
          Loading visual comparison data...
        </div>
      )}

      {comparison && !loading && (
        <>
          {/* Comparability status banner */}
          {!comparison.compatible_for_visual_comparison ? (
            <div style={{ marginBottom: "1.25rem", padding: "0.85rem 1.2rem", background: "rgba(239, 68, 68, 0.08)", borderLeft: "3px solid var(--accent-flame)", borderRadius: "4px", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--accent-flame)", display: "block", marginBottom: "3px" }}>⚠ Cross-Investigation Physical Divergence:</strong>
              {comparison.comparison_note}
            </div>
          ) : (
            <div style={{ marginBottom: "1.25rem", padding: "0.85rem 1.2rem", background: "rgba(16, 185, 129, 0.08)", borderLeft: "3px solid var(--color-success)", borderRadius: "4px", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--color-success)", display: "block", marginBottom: "3px" }}>✓ Physically Grounded Direct Comparison:</strong>
              {comparison.comparison_note}
            </div>
          )}

          {/* Slider */}
          <div className="card" style={{ marginBottom: "18px" }}>
            <div className="card-header">
              <h3 className="card-title">Morphological Slider</h3>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                Drag slider handle to reveal Image B
              </span>
            </div>
            <div style={{ padding: "0.5rem 0" }}>
              <SliderComparison imgA={comparison.image_a} imgB={comparison.image_b} />
            </div>
          </div>

          {/* Side-by-side view */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "18px" }}>
            {[comparison.image_a, comparison.image_b].map((img, idx) => (
              <div key={idx} className="card" style={{ marginBottom: 0 }}>
                <div style={{
                  background: idx === 0 ? "rgba(56, 189, 248, 0.08)" : "rgba(255, 118, 38, 0.08)",
                  padding: "6px 12px",
                  borderBottom: "1px solid var(--border-color)",
                  fontSize: "0.74rem",
                  fontWeight: 600,
                  color: idx === 0 ? "var(--accent-cyan)" : "var(--accent-molten)",
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <span>Image {idx === 0 ? "A" : "B"} ({img.investigation_id})</span>
                  <span>{img.camera_modality}</span>
                </div>

                <div style={{ background: "#080B10", display: "flex", alignItems: "center", justifyContent: "center", height: "180px", padding: "10px" }}>
                  <img src={img.file_path} alt={img.title} style={{ maxWidth: "100%", maxHeight: "160px", objectFit: "contain" }} />
                </div>

                <div style={{ padding: "12px", fontSize: "0.8rem" }}>
                  <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>{img.title}</div>
                  <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>
                    {img.investigation_id} · {img.gravity_regime} · {img.fuel_or_material}
                  </div>
                  {img.observation_time_s != null && (
                    <div style={{ color: "var(--text-dim)", fontSize: "0.72rem", marginTop: "2px" }}>
                      Elapsed time: t = {img.observation_time_s}s
                    </div>
                  )}
                  <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                    {img.doi && (
                      <a href={`https://doi.org/${img.doi}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: "0.7rem", padding: "2px 7px" }}>
                        <ExternalLink size={10} /> DOI
                      </a>
                    )}
                    <a href={img.source_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: "0.7rem", padding: "2px 7px" }}>
                      <ExternalLink size={10} /> NASA PSI
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Metadata table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Side-by-Side Metadata Comparison</h3>
              <span className="badge badge-green">Verified</span>
            </div>
            <div className="table-container">
              <MetadataTable imgA={comparison.image_a} imgB={comparison.image_b} />
            </div>
            <div style={{ padding: "8px 12px", borderTop: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", color: "var(--text-dim)" }}>
              <Info size={12} color="var(--accent-cyan)" />
              <span>Citation: {comparison.image_a.source_citation}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
