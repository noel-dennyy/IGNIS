"""
IGNIS — Evidence Gap Heatmap Router
Returns a matrix of which gravity×fuel/material×atmosphere combinations have been
experimentally tested in the indexed corpus, and which are gaps.
"""
from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/api", tags=["Evidence Gap"])

# ---------------------------------------------------------------------------
# Static evidence matrix — derived from the ingested PSI corpus metadata.
# Gravity regimes × Fuel/Material × Atmosphere condition.
# value: 'tested' | 'partial' | 'gap'
# ---------------------------------------------------------------------------

GRAVITY_REGIMES = [
    "Orbital Microgravity\n(~10⁻⁶ g)",
    "Drop Tower\n(~1–5 s, 10⁻⁵ g)",
    "Lunar Surface\n(~1/6 g)",
    "Martian Surface\n(~3/8 g)",
    "Parabolic Flight\n(~10⁻² g)",
    "1-g (Earth)"
]

FUEL_MATERIALS = [
    "Heptane Droplets",
    "Ethanol Droplets",
    "SIBAL Fabric",
    "PMMA Sheet",
    "Methane Jet Flame",
    "Ethylene Jet Flame",
    "Electrical Wire Insulation"
]

ATMOSPHERE_CONDITIONS = [
    "21% O₂ / 78% N₂\n(1 atm)",
    "21% O₂ / 79% N₂\n(0.7 atm)",
    "30% O₂ / 70% N₂",
    "34% O₂ / 66% N₂",
    "CO₂ Suppressant",
    "He Suppressant",
    "SF₆ Suppressant"
]

# Matrix: gravity × (fuel, atmosphere) — value = 'tested' | 'partial' | 'gap'
# Sources: PSI-69 (FLEX), PSI-98 (SAFFIRE-I), PSI-107 (SPICE)
EVIDENCE_MATRIX: Dict[str, Dict[str, Dict[str, str]]] = {
    "Orbital Microgravity\n(~10⁻⁶ g)": {
        "Heptane Droplets": {
            "21% O₂ / 78% N₂\n(1 atm)": "tested",        # FLEX baseline
            "21% O₂ / 79% N₂\n(0.7 atm)": "tested",       # FLEX subatm
            "30% O₂ / 70% N₂": "tested",                   # FLEX elevated O2
            "34% O₂ / 66% N₂": "partial",                  # FLEX partial coverage
            "CO₂ Suppressant": "tested",                    # FLEX suppressant
            "He Suppressant": "tested",                     # FLEX suppressant
            "SF₆ Suppressant": "tested"                     # FLEX suppressant
        },
        "Ethanol Droplets": {
            "21% O₂ / 78% N₂\n(1 atm)": "tested",         # FLEX & FLEX-2
            "21% O₂ / 79% N₂\n(0.7 atm)": "partial",      # FLEX subatmospheric
            "30% O₂ / 70% N₂": "tested",                   # FLEX elevated O2
            "34% O₂ / 66% N₂": "gap",
            "CO₂ Suppressant": "tested",                   # FLEX suppressant
            "He Suppressant": "partial",                   # FLEX suppressant
            "SF₆ Suppressant": "gap"
        },
        "SIBAL Fabric": {
            "21% O₂ / 78% N₂\n(1 atm)": "tested",         # SAFFIRE-I & BASS
            "21% O₂ / 79% N₂\n(0.7 atm)": "partial",      # BASS low pressure
            "30% O₂ / 70% N₂": "partial",                  # BASS elevated O2
            "34% O₂ / 66% N₂": "gap",
            "CO₂ Suppressant": "gap",
            "He Suppressant": "gap",
            "SF₆ Suppressant": "gap"
        },
        "PMMA Sheet": {
            "21% O₂ / 78% N₂\n(1 atm)": "tested",         # BASS (PSI-108) primary
            "21% O₂ / 79% N₂\n(0.7 atm)": "partial",      # BASS subatmospheric
            "30% O₂ / 70% N₂": "tested",                   # BASS elevated O2
            "34% O₂ / 66% N₂": "partial",                  # BASS Artemis exploration
            "CO₂ Suppressant": "gap",
            "He Suppressant": "gap",
            "SF₆ Suppressant": "gap"
        },
        "Methane Jet Flame": {
            "21% O₂ / 78% N₂\n(1 atm)": "tested",         # SPICE
            "21% O₂ / 79% N₂\n(0.7 atm)": "partial",      # SPICE partial
            "30% O₂ / 70% N₂": "gap",
            "34% O₂ / 66% N₂": "gap",
            "CO₂ Suppressant": "gap",
            "He Suppressant": "gap",
            "SF₆ Suppressant": "gap"
        },
        "Ethylene Jet Flame": {
            "21% O₂ / 78% N₂\n(1 atm)": "tested",         # SPICE
            "21% O₂ / 79% N₂\n(0.7 atm)": "partial",
            "30% O₂ / 70% N₂": "gap",
            "34% O₂ / 66% N₂": "gap",
            "CO₂ Suppressant": "gap",
            "He Suppressant": "gap",
            "SF₆ Suppressant": "gap"
        },
        "Electrical Wire Insulation": {
            "21% O₂ / 78% N₂\n(1 atm)": "gap",
            "21% O₂ / 79% N₂\n(0.7 atm)": "gap",
            "30% O₂ / 70% N₂": "gap",
            "34% O₂ / 66% N₂": "gap",
            "CO₂ Suppressant": "gap",
            "He Suppressant": "gap",
            "SF₆ Suppressant": "gap"
        }
    },
    "Drop Tower\n(~1–5 s, 10⁻⁵ g)": {
        "Heptane Droplets": {
            "21% O₂ / 78% N₂\n(1 atm)": "partial",
            "21% O₂ / 79% N₂\n(0.7 atm)": "gap",
            "30% O₂ / 70% N₂": "gap",
            "34% O₂ / 66% N₂": "gap",
            "CO₂ Suppressant": "gap",
            "He Suppressant": "gap",
            "SF₆ Suppressant": "gap"
        },
        "Ethanol Droplets": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "SIBAL Fabric": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "PMMA Sheet": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Methane Jet Flame": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Ethylene Jet Flame": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Electrical Wire Insulation": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"}
    },
    "Lunar Surface\n(~1/6 g)": {
        "Heptane Droplets": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Ethanol Droplets": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "SIBAL Fabric": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "PMMA Sheet": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Methane Jet Flame": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Ethylene Jet Flame": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Electrical Wire Insulation": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"}
    },
    "Martian Surface\n(~3/8 g)": {
        "Heptane Droplets": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Ethanol Droplets": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "SIBAL Fabric": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "PMMA Sheet": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Methane Jet Flame": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Ethylene Jet Flame": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Electrical Wire Insulation": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"}
    },
    "Parabolic Flight\n(~10⁻² g)": {
        "Heptane Droplets": {"21% O₂ / 78% N₂\n(1 atm)": "partial","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Ethanol Droplets": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "SIBAL Fabric": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "PMMA Sheet": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Methane Jet Flame": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Ethylene Jet Flame": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"},
        "Electrical Wire Insulation": {"21% O₂ / 78% N₂\n(1 atm)": "gap","21% O₂ / 79% N₂\n(0.7 atm)": "gap","30% O₂ / 70% N₂": "gap","34% O₂ / 66% N₂": "gap","CO₂ Suppressant": "gap","He Suppressant": "gap","SF₆ Suppressant": "gap"}
    },
    "1-g (Earth)": {
        "Heptane Droplets": {"21% O₂ / 78% N₂\n(1 atm)": "tested","21% O₂ / 79% N₂\n(0.7 atm)": "tested","30% O₂ / 70% N₂": "tested","34% O₂ / 66% N₂": "tested","CO₂ Suppressant": "tested","He Suppressant": "tested","SF₆ Suppressant": "tested"},
        "Ethanol Droplets": {"21% O₂ / 78% N₂\n(1 atm)": "tested","21% O₂ / 79% N₂\n(0.7 atm)": "tested","30% O₂ / 70% N₂": "tested","34% O₂ / 66% N₂": "tested","CO₂ Suppressant": "tested","He Suppressant": "tested","SF₆ Suppressant": "tested"},
        "SIBAL Fabric": {"21% O₂ / 78% N₂\n(1 atm)": "tested","21% O₂ / 79% N₂\n(0.7 atm)": "tested","30% O₂ / 70% N₂": "tested","34% O₂ / 66% N₂": "tested","CO₂ Suppressant": "tested","He Suppressant": "tested","SF₆ Suppressant": "tested"},
        "PMMA Sheet": {"21% O₂ / 78% N₂\n(1 atm)": "tested","21% O₂ / 79% N₂\n(0.7 atm)": "tested","30% O₂ / 70% N₂": "tested","34% O₂ / 66% N₂": "tested","CO₂ Suppressant": "tested","He Suppressant": "tested","SF₆ Suppressant": "tested"},
        "Methane Jet Flame": {"21% O₂ / 78% N₂\n(1 atm)": "tested","21% O₂ / 79% N₂\n(0.7 atm)": "tested","30% O₂ / 70% N₂": "tested","34% O₂ / 66% N₂": "tested","CO₂ Suppressant": "tested","He Suppressant": "tested","SF₆ Suppressant": "tested"},
        "Ethylene Jet Flame": {"21% O₂ / 78% N₂\n(1 atm)": "tested","21% O₂ / 79% N₂\n(0.7 atm)": "tested","30% O₂ / 70% N₂": "tested","34% O₂ / 66% N₂": "tested","CO₂ Suppressant": "tested","He Suppressant": "tested","SF₆ Suppressant": "tested"},
        "Electrical Wire Insulation": {"21% O₂ / 78% N₂\n(1 atm)": "tested","21% O₂ / 79% N₂\n(0.7 atm)": "tested","30% O₂ / 70% N₂": "tested","34% O₂ / 66% N₂": "tested","CO₂ Suppressant": "tested","He Suppressant": "tested","SF₆ Suppressant": "tested"}
    }
}


@router.get("/evidence-gap")
def get_evidence_gap_matrix() -> Dict[str, Any]:
    """
    Returns a flattened cell array for the Evidence Gap Heatmap.
    Each cell: { gravity, fuel, atmosphere, status }
    status: 'tested' | 'partial' | 'gap'
    """
    cells: List[Dict[str, str]] = []
    for gravity, fuels in EVIDENCE_MATRIX.items():
        for fuel, atmospheres in fuels.items():
            for atmosphere, status in atmospheres.items():
                cells.append({
                    "gravity": gravity,
                    "fuel": fuel,
                    "atmosphere": atmosphere,
                    "status": status
                })

    tested = sum(1 for c in cells if c["status"] == "tested")
    partial = sum(1 for c in cells if c["status"] == "partial")
    gap = sum(1 for c in cells if c["status"] == "gap")
    total = len(cells)

    return {
        "gravity_regimes": GRAVITY_REGIMES,
        "fuels_materials": FUEL_MATERIALS,
        "atmosphere_conditions": ATMOSPHERE_CONDITIONS,
        "cells": cells,
        "summary": {
            "total_combinations": total,
            "tested": tested,
            "partial": partial,
            "gap": gap,
            "coverage_pct": round((tested + partial * 0.5) / total * 100, 1)
        },
        "data_note": (
            "Evidence status derived from indexed PSI corpus: FLEX (PSI-69), FLEX-2 (PSI-70), SAFFIRE-I (PSI-98), SPICE (PSI-107), BASS (PSI-108). "
            "'Tested' = at least one indexed experiment. 'Partial' = limited coverage or short-duration data. "
            "'Gap' = no indexed experiment found in this configuration. "
            "Gaps indicate areas requiring future investigation — not that NASA has never studied the topic."
        ),
        "source_investigations": [
            {"id": "PSI-69", "name": "FLEX", "doi": "10.60555/mbq8-0451", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69"},
            {"id": "PSI-70", "name": "FLEX-2", "doi": "10.60555/y812-q943", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-70"},
            {"id": "PSI-98", "name": "SAFFIRE-I", "doi": "10.60555/0t15-1z43", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-98"},
            {"id": "PSI-107", "name": "SPICE", "doi": "10.60555/9kbh-e962", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-107"},
            {"id": "PSI-108", "name": "BASS", "doi": "10.60555/k489-p210", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-108"}
        ]
    }
