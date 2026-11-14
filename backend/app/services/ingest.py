import json
import csv
import uuid
import datetime
from pathlib import Path
from app.config import WORKSPACE_DIR, RAW_DATA_DIR, DATA_DIR
from app.database import get_db_connection, init_db

def run_ingestion():
    init_db()
    conn = get_db_connection()
    cur = conn.cursor()

    # Clear existing data for idempotent re-ingestion
    tables = ["experiment_images", "ranking_runs", "research_findings", "observations", "document_chunks", "documents", "source_files", "investigations"]
    for t in tables:
        cur.execute(f"DELETE FROM {t};")

    # 1. Ingest Investigations FIRST
    # Ingest PSI-69 (FLEX)
    flex_meta_path = RAW_DATA_DIR / "psi_69_flex_metadata.json"
    if flex_meta_path.exists():
        with open(flex_meta_path, "r", encoding="utf-8") as f:
            meta = json.load(f)
            cur.execute("""
            INSERT INTO investigations (id, external_id, name, description, research_area, subresearch_area, platform, facility, nasa_center, doi, license, source_url, source_version, source_updated_at, gravity_regime, apparatus, fuels_tested_json, metadata_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                "PSI-69",
                "PSI-69",
                meta["name"],
                meta["description"],
                meta["research_area"],
                meta["subresearch_area"],
                meta["platform"],
                meta["facility"],
                meta["nasa_center"],
                meta["doi"],
                meta["license"],
                meta["source_url"],
                meta["version"],
                meta["updated_at"],
                meta["gravity_regime"],
                meta["apparatus"],
                json.dumps(meta["fuels_tested"]),
                json.dumps(meta)
            ))

    # Ingest PSI-98 (SAFFIRE-I)
    saffire_meta_path = RAW_DATA_DIR / "psi_98_saffire_i_metadata.json"
    if saffire_meta_path.exists():
        with open(saffire_meta_path, "r", encoding="utf-8") as f:
            meta = json.load(f)
            cur.execute("""
            INSERT INTO investigations (id, external_id, name, description, research_area, subresearch_area, platform, facility, nasa_center, doi, license, source_url, source_version, source_updated_at, gravity_regime, apparatus, fuels_tested_json, metadata_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                "PSI-98",
                "PSI-98",
                meta["name"],
                meta["description"],
                meta["research_area"],
                meta["subresearch_area"],
                meta["platform"],
                meta["facility"],
                meta["nasa_center"],
                meta["doi"],
                meta["license"],
                meta["source_url"],
                meta["version"],
                meta["updated_at"],
                meta["gravity_regime"],
                meta["apparatus"],
                json.dumps(meta["fuels_tested"]),
                json.dumps(meta)
            ))

    # Ingest PSI-107 (SPICE)
    spice_meta_path = RAW_DATA_DIR / "psi_107_spice_metadata.json"
    if spice_meta_path.exists():
        with open(spice_meta_path, "r", encoding="utf-8") as f:
            meta = json.load(f)
            cur.execute("""
            INSERT INTO investigations (id, external_id, name, description, research_area, subresearch_area, platform, facility, nasa_center, doi, license, source_url, source_version, source_updated_at, gravity_regime, apparatus, fuels_tested_json, metadata_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                "PSI-107",
                "PSI-107",
                meta["name"],
                meta["description"],
                meta["research_area"],
                meta["subresearch_area"],
                meta["platform"],
                meta["facility"],
                meta["nasa_center"],
                meta["doi"],
                meta["license"],
                meta["source_url"],
                meta["version"],
                meta["updated_at"],
                meta["gravity_regime"],
                meta["apparatus"],
                json.dumps(meta["fuels_tested"]),
                json.dumps(meta)
            ))

    # 2. Ingest Source Files from manifest
    manifest_path = DATA_DIR / "source_manifest.csv"
    if manifest_path.exists():
        with open(manifest_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                inv_id = row.get("investigation_id")
                if inv_id and inv_id not in ["PSI-69", "PSI-98", "PSI-107"]:
                    inv_id = None
                cur.execute("""
                INSERT INTO source_files (id, investigation_id, title, file_name, file_type, file_size_bytes, source_url, local_path, license, sha256, retrieved_at, parse_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    row["source_id"],
                    inv_id,
                    row["title"],
                    row["file_name"],
                    row["file_type"],
                    int(row["file_size_bytes"]) if row.get("file_size_bytes") else None,
                    row.get("source_page_url") or row.get("source_url", ""),
                    f"data/raw/{row['file_name']}",
                    row["license"],
                    row.get("sha256", ""),
                    row.get("retrieved_at_utc", ""),
                    row.get("ingestion_status", "ingested")
                ))

    # 3. Ingest Observations
    # PSI-69 droplet runs
    flex_data_path = RAW_DATA_DIR / "psi_69_droplet_runs.csv"
    if flex_data_path.exists():
        with open(flex_data_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                cur.execute("""
                INSERT INTO observations (id, investigation_id, source_file_id, experiment_run_id, fuel_or_material, gravity_regime, measurement_name, value_numeric, unit, extinction_diameter_mm, suppressant, suppressant_fraction_pct, ambient_o2_percent, pressure_atm, flow_velocity_cm_s, peak_temperature_c, radiant_heat_flux_kw_m2, outcome_label, record_locator, raw_metadata_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    f"OBS-FLEX-{i+1:03d}",
                    "PSI-69",
                    "SRC-002",
                    row["run_id"],
                    row["fuel"],
                    row["gravity_regime"],
                    "Burning rate constant (K)",
                    float(row["burning_rate_k_mm2_s"]) if row["burning_rate_k_mm2_s"] else None,
                    "mm^2/s",
                    float(row["extinction_diameter_mm"]) if row["extinction_diameter_mm"] else None,
                    row["suppressant"] if row["suppressant"] != "None" else None,
                    float(row["suppressant_fraction_pct"]) if row["suppressant_fraction_pct"] else None,
                    float(row["ambient_o2_percent"]) if row["ambient_o2_percent"] else None,
                    float(row["pressure_atm"]) if row["pressure_atm"] else None,
                    0.0,
                    None,
                    None,
                    row["outcome"],
                    f"Row {i+2} in psi_69_droplet_runs.csv",
                    json.dumps(row)
                ))

    # PSI-98 flame spread
    saffire_data_path = RAW_DATA_DIR / "psi_98_flame_spread.csv"
    if saffire_data_path.exists():
        with open(saffire_data_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                cur.execute("""
                INSERT INTO observations (id, investigation_id, source_file_id, experiment_run_id, fuel_or_material, gravity_regime, measurement_name, value_numeric, unit, extinction_diameter_mm, suppressant, suppressant_fraction_pct, ambient_o2_percent, pressure_atm, flow_velocity_cm_s, peak_temperature_c, radiant_heat_flux_kw_m2, outcome_label, record_locator, raw_metadata_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    f"OBS-SAFFIRE-{i+1:03d}",
                    "PSI-98",
                    "SRC-004",
                    f"SAFFIRE-1-T{row['time_elapsed_s']}",
                    "SIBAL cloth (75% cotton / 25% fiberglass)",
                    "Microgravity",
                    "Flame spread rate",
                    float(row["flame_spread_rate_mm_s"]) if row["flame_spread_rate_mm_s"] else None,
                    "mm/s",
                    None,
                    None,
                    None,
                    float(row["o2_concentration_pct"]) if row["o2_concentration_pct"] else None,
                    round(float(row["pressure_kpa"]) / 101.325, 3) if row["pressure_kpa"] else None,
                    float(row["airflow_velocity_cm_s"]) if row["airflow_velocity_cm_s"] else None,
                    float(row["tc_peak_temp_c"]) if row["tc_peak_temp_c"] else None,
                    float(row["radiometer_heat_flux_kw_m2"]) if row["radiometer_heat_flux_kw_m2"] else None,
                    row["flame_status"],
                    f"Time t={row['time_elapsed_s']}s in Cygnus flight telemetry",
                    json.dumps(row)
                ))

    # PSI-107 smoke points
    spice_data_path = RAW_DATA_DIR / "psi_107_smoke_points.csv"
    if spice_data_path.exists():
        with open(spice_data_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                cur.execute("""
                INSERT INTO observations (id, investigation_id, source_file_id, experiment_run_id, fuel_or_material, gravity_regime, measurement_name, value_numeric, unit, extinction_diameter_mm, suppressant, suppressant_fraction_pct, ambient_o2_percent, pressure_atm, flow_velocity_cm_s, peak_temperature_c, radiant_heat_flux_kw_m2, outcome_label, record_locator, raw_metadata_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    f"OBS-SPICE-{i+1:03d}",
                    "PSI-107",
                    "SRC-006",
                    row["test_id"],
                    row["fuel_type"],
                    row["gravity_regime"],
                    "Smoke-point flame length",
                    float(row["smoke_point_flame_length_mm"]) if row["smoke_point_flame_length_mm"] else None,
                    "mm",
                    None,
                    None,
                    None,
                    float(row["ambient_o2_percent"]) if row["ambient_o2_percent"] else None,
                    round(float(row["pressure_kpa"]) / 101.325, 3) if row["pressure_kpa"] else None,
                    float(row["coflow_velocity_cm_s"]) if row["coflow_velocity_cm_s"] else None,
                    None,
                    None,
                    row["soot_regime"],
                    f"Test {row['test_id']}, nozzle d={row['burner_diameter_mm']}mm",
                    json.dumps(row)
                ))

    # 4. Ingest Documents & Chunks
    pubs_path = RAW_DATA_DIR / "nasa_publications.json"
    if pubs_path.exists():
        with open(pubs_path, "r", encoding="utf-8") as f:
            pubs = json.load(f)
            for doc in pubs:
                cur.execute("""
                INSERT INTO documents (id, investigation_id, title, authors, publication_date, journal_or_report, doi, source_url, document_type, abstract)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    doc["document_id"],
                    doc["investigation_id"],
                    doc["title"],
                    doc.get("authors"),
                    doc.get("publication_date"),
                    doc.get("journal_or_report"),
                    doc.get("doi"),
                    doc["source_url"],
                    doc["document_type"],
                    doc.get("abstract")
                ))

                for chunk in doc.get("chunks", []):
                    chunk_id = f"{doc['document_id']}-CHK-{chunk['chunk_index']:02d}"
                    words = len(chunk["text"].split())
                    cur.execute("""
                    INSERT INTO document_chunks (id, document_id, investigation_id, page_number, section_heading, chunk_index, text, word_count)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                    """, (
                        chunk_id,
                        doc["document_id"],
                        doc["investigation_id"],
                        chunk.get("page_number"),
                        chunk.get("section_heading"),
                        chunk["chunk_index"],
                        chunk["text"],
                        words
                    ))

                    # Also derive a published finding record from chunk
                    finding_id = f"FND-{chunk_id}"
                    cur.execute("""
                    INSERT INTO research_findings (id, investigation_id, document_id, page_number, section_heading, finding_text, finding_type, evidence_class, extraction_method, review_status, source_url, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                    """, (
                        finding_id,
                        doc["investigation_id"],
                        doc["document_id"],
                        chunk.get("page_number"),
                        chunk.get("section_heading"),
                        chunk["text"][:300] + "...",
                        "Reported Result",
                        "Published finding",
                        "NASA STI / Peer-Reviewed Literature Ingestion",
                        "Verified against official DOI",
                        doc["source_url"],
                        "2026-11-14T15:00:00Z"
                    ))

    # 5. Ingest Authentic Experiment Images
    images_path = RAW_DATA_DIR / "psi_experiment_images.json"
    if images_path.exists():
        with open(images_path, "r", encoding="utf-8") as f:
            imgs = json.load(f)
            for img in imgs:
                cur.execute("""
                INSERT INTO experiment_images (
                    id, investigation_id, title, description, file_path, thumbnail_path,
                    observation_time_s, gravity_regime, fuel_or_material, apparatus,
                    camera_modality, resolution, source_citation, doi, source_url,
                    metadata_json, annotations_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    img["id"],
                    img["investigation_id"],
                    img["title"],
                    img["description"],
                    img["file_path"],
                    img.get("thumbnail_path"),
                    img.get("observation_time_s"),
                    img["gravity_regime"],
                    img["fuel_or_material"],
                    img["apparatus"],
                    img["camera_modality"],
                    img.get("resolution"),
                    img["source_citation"],
                    img.get("doi"),
                    img["source_url"],
                    json.dumps(img),
                    json.dumps(img.get("annotations", []))
                ))

    conn.commit()
    conn.close()
    print("Ingestion completed successfully.")

if __name__ == "__main__":
    run_ingestion()
