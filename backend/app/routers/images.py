"""
Experiment Images Router
Serves verified SVG scientific illustrations with metadata and annotations.
All images are SYNTHETIC ILLUSTRATIONS — not NASA photographs.
"""
import json
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.database import get_db_connection
from app.schemas import ExperimentImageRecord, ImageAnnotation, ImageCompareResponse

router = APIRouter(tags=["Images"])


def _row_to_image(row: dict) -> ExperimentImageRecord:
    annotations_raw = row.get("annotations_json") or "[]"
    try:
        ann_list = json.loads(annotations_raw)
    except Exception:
        ann_list = []
    annotations = [ImageAnnotation(**a) for a in ann_list if isinstance(a, dict)]

    meta_raw = row.get("metadata_json") or "{}"
    try:
        meta = json.loads(meta_raw)
    except Exception:
        meta = {}

    return ExperimentImageRecord(
        id=row["id"],
        investigation_id=row["investigation_id"],
        title=row["title"],
        description=row["description"],
        file_path=row["file_path"],
        thumbnail_path=row.get("thumbnail_path"),
        observation_time_s=row.get("observation_time_s"),
        gravity_regime=row["gravity_regime"],
        fuel_or_material=row["fuel_or_material"],
        apparatus=row["apparatus"],
        camera_modality=row["camera_modality"],
        resolution=row.get("resolution"),
        source_citation=row["source_citation"],
        doi=row.get("doi"),
        source_url=row["source_url"],
        annotations=annotations,
        paired_comparison_id=meta.get("paired_comparison_id"),
        image_type_label="Scientific Illustration (Synthetic) — Not a NASA photograph",
    )


@router.get("/api/images", response_model=List[ExperimentImageRecord])
def list_images(investigation_id: Optional[str] = None):
    conn = get_db_connection()
    cur = conn.cursor()
    if investigation_id:
        cur.execute(
            "SELECT * FROM experiment_images WHERE investigation_id = ? ORDER BY id;",
            (investigation_id,)
        )
    else:
        cur.execute("SELECT * FROM experiment_images ORDER BY investigation_id, id;")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return [_row_to_image(r) for r in rows]


@router.get("/api/images/{image_id}", response_model=ExperimentImageRecord)
def get_image(image_id: str):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM experiment_images WHERE id = ?;", (image_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail=f"Image '{image_id}' not found.")
    return _row_to_image(dict(row))


@router.get("/api/images/{image_id}/compare/{compare_id}", response_model=ImageCompareResponse)
def compare_images(image_id: str, compare_id: str):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM experiment_images WHERE id IN (?, ?);", (image_id, compare_id))
    rows = {dict(r)["id"]: dict(r) for r in cur.fetchall()}
    conn.close()

    if image_id not in rows:
        raise HTTPException(status_code=404, detail=f"Image '{image_id}' not found.")
    if compare_id not in rows:
        raise HTTPException(status_code=404, detail=f"Image '{compare_id}' not found.")

    img_a = _row_to_image(rows[image_id])
    img_b = _row_to_image(rows[compare_id])
    shared_inv = img_a.investigation_id == img_b.investigation_id

    if shared_inv:
        note = (
            f"Both images are from the same investigation ({img_a.investigation_id}) "
            "and show the same experiment under comparable conditions. "
            "Visual differences may reflect changes in flame morphology over time or "
            "different gravity regimes. These are SYNTHETIC ILLUSTRATIONS — not photographs. "
            "Do not infer temperatures, chemical species, or measurements from visual appearance."
        )
        compatible = True
    else:
        note = (
            f"Images are from DIFFERENT investigations ({img_a.investigation_id} vs "
            f"{img_b.investigation_id}) with different apparatus, fuels, and measurement domains. "
            "FLEX measures droplet combustion; SAFFIRE-I measures fabric flame spread; "
            "SPICE measures gas-jet smoke points. These experiments are NOT directly comparable "
            "on shared quantitative axes. Visual comparison is for qualitative illustration only. "
            "These are SYNTHETIC ILLUSTRATIONS — not NASA photographs."
        )
        compatible = False

    return ImageCompareResponse(
        image_a=img_a,
        image_b=img_b,
        comparison_note=note,
        compatible_for_visual_comparison=compatible,
        shared_investigation=shared_inv,
    )
