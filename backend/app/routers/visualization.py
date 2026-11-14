"""
Visualization Router
Provides chart-ready data from the SQLite observations table.
All data originates from actual NASA PSI records — no fabricated measurements.
"""
from fastapi import APIRouter, Query
from typing import Optional
from app.services.visualization import ScientificVisualizationService
from app.schemas import (
    TimeSeriesResponse, ScatterResponse, DistributionResponse,
    HeatmapResponse, ScientificInsightsResponse, CompareResponse
)
from app.schemas import CompareRequest

router = APIRouter(tags=["Visualization"])
_svc = ScientificVisualizationService()


@router.get("/api/viz/time-series", response_model=TimeSeriesResponse)
def get_time_series(investigation_id: str = Query("PSI-98")):
    data = _svc.get_time_series(investigation_id)
    data.setdefault("source_note", (
        "Data source: NASA Physical Sciences Informatics (PSI) repository. "
        "Measured values from SAFFIRE-I onboard instrumentation during Cygnus OA-6 mission. "
        "Retrieval: 2025-10. License: NASA Open Data."
    ))
    return TimeSeriesResponse(**data)


@router.get("/api/viz/scatter", response_model=ScatterResponse)
def get_scatter(dataset_type: str = Query("flex_droplet")):
    data = _svc.get_scatter_data(dataset_type)
    data.setdefault("source_note", (
        "Data source: NASA PSI — FLEX (PSI-69) or SPICE (PSI-107). "
        "Values are measured experimental observations. License: NASA Open Data."
    ))
    return ScatterResponse(**data)


@router.get("/api/viz/distribution", response_model=DistributionResponse)
def get_distribution(variable: str = Query("burning_rate_k")):
    data = _svc.get_distribution(variable)
    if "error" in data:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=data["error"])
    # Map field names: service returns 'variable' but schema uses 'variable_name'
    if "variable" in data and "variable_name" not in data:
        data["variable_name"] = data.pop("variable")
    # Ensure bins have required keys: schema expects bin_min/bin_max/count/label
    # service returns bin_start/bin_end/count/label — remap
    for b in data.get("bins", []):
        if "bin_start" in b and "bin_min" not in b:
            b["bin_min"] = b.pop("bin_start")
        if "bin_end" in b and "bin_max" not in b:
            b["bin_max"] = b.pop("bin_end")
    data.setdefault("source_note",
        "Distribution computed from verified NASA PSI observation records. "
        "Bin boundaries and counts reflect actual data, not imputed values."
    )
    data.pop("raw_values", None)  # not part of response schema
    return DistributionResponse(**data)


@router.get("/api/viz/heatmap", response_model=HeatmapResponse)
def get_heatmap(heatmap_type: str = Query("duct_temperature_grid")):
    data = _svc.get_heatmap(heatmap_type)
    if "error" in data:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=data["error"])
    # Normalize to HeatmapResponse schema (cells list)
    cells = []
    if heatmap_type == "duct_temperature_grid":
        for row in data.get("matrix", []):
            time_label = row["time_s"]
            for key, val in row.items():
                if key != "time_s":
                    cells.append({"row": time_label, "col": key, "value": val})
        return HeatmapResponse(
            heatmap_type=data["heatmap_type"],
            title=data["title"],
            row_label="Elapsed Time",
            col_label="Duct Station",
            value_label="Temperature",
            unit="°C",
            cells=cells,
            source_note=(
                "Data source: SAFFIRE-I onboard thermocouple array (Cygnus OA-6). "
                "Missing cells = no measurement at that station/time."
            )
        )
    elif heatmap_type == "correlation_matrix":
        for row in data.get("matrix", []):
            var_name = row["variable"]
            for col_key, val in row.items():
                if col_key != "variable":
                    cells.append({"row": var_name, "col": col_key, "value": val})
        return HeatmapResponse(
            heatmap_type=data["heatmap_type"],
            title=data["title"],
            row_label="Variable",
            col_label="Variable",
            value_label="Pearson r",
            unit="dimensionless",
            cells=cells,
            source_note="Computed from FLEX (PSI-69) verified observations. Correlation ≠ causation."
        )
    return HeatmapResponse(
        heatmap_type=heatmap_type, title="Heatmap", row_label="", col_label="",
        value_label="", unit="", cells=[], source_note=""
    )


@router.get("/api/viz/insights/{view_id}", response_model=ScientificInsightsResponse)
def get_insights(view_id: str):
    data = _svc.get_scientific_insights(view_id)
    # Map service field names to schema fields
    mapped = {
        "view_id": data.get("view_id", view_id),
        "what_graph_displays": data.get("what_graph_displays", ""),
        "important_trends": data.get("key_trends", []),
        "differences_between_experiments": [],
        "potential_correlations": [data.get("correlation_vs_causation", "")],
        "limitations": [data.get("measurement_limitations", "")],
        "conclusions_not_drawable": [data.get("unwarranted_conclusions", "")],
        "source_references": [
            "NASA Physical Sciences Informatics (PSI) repository — https://psi.nasa.gov",
            "PSI-69 (FLEX), PSI-98 (SAFFIRE-I), PSI-107 (SPICE). License: NASA Open Data."
        ]
    }
    return ScientificInsightsResponse(**mapped)


@router.post("/api/viz/multi-compare")
def multi_compare(body: CompareRequest):
    """
    Returns visualization-ready comparison data for 2-3 investigations.
    Only includes variables with compatible units and measurement definitions.
    """
    from app.services.comparison import ComparisonService
    svc = ComparisonService()
    result = svc.compare(body.investigation_ids)
    return result
