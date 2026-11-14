import json
from typing import List, Dict, Any, Optional
from app.database import get_db_connection

class ScientificComparisonService:
    def compare_investigations(
        self,
        investigation_ids: List[str],
        selected_observation_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        conn = get_db_connection()
        cur = conn.cursor()

        placeholders = ",".join("?" for _ in investigation_ids)
        cur.execute(f"SELECT * FROM investigations WHERE id IN ({placeholders});", investigation_ids)
        investigations = [dict(r) for r in cur.fetchall()]

        # Fetch observations
        if selected_observation_ids:
            obs_placeholders = ",".join("?" for _ in selected_observation_ids)
            cur.execute(f"SELECT * FROM observations WHERE id IN ({obs_placeholders});", selected_observation_ids)
        else:
            cur.execute(f"SELECT * FROM observations WHERE investigation_id IN ({placeholders}) LIMIT 30;", investigation_ids)
        observations = [dict(r) for r in cur.fetchall()]
        conn.close()

        # Perform scientific comparability analysis
        inv_ids_set = set(inv["id"] for inv in investigations)
        is_cross_experiment = len(inv_ids_set) > 1

        variables_analysis = []
        is_valid_comparison = True
        warnings = []

        # Geometry & Fuel Phase Check
        has_flex = "PSI-69" in inv_ids_set
        has_saffire = "PSI-98" in inv_ids_set
        has_spice = "PSI-107" in inv_ids_set

        if has_flex and has_saffire:
            is_valid_comparison = False
            warnings.append(
                "CRITICAL INCOMPATIBILITY (Droplet vs. Solid Sheet): FLEX measured isolated liquid droplets (spherical symmetry, burning rate constant K [mm^2/s]), whereas SAFFIRE-I measured large-scale solid composite fabric (0.4 m x 0.94 m SIBAL cloth, surface flame spread rate [mm/s]). They cannot be plotted on a common quantitative axis."
            )
            variables_analysis.append({
                "variable_name": "Fuel State & Combustion Geometry",
                "is_comparable": False,
                "reason": "Liquid fuel droplet (spherical) vs. Solid fabric panel (planar).",
                "units_match": False,
                "notes": "FLEX uses d^2-law evaporation/combustion; SAFFIRE-I uses solid-phase pyrolysis and thermal boundary layer propagation."
            })

        if has_flex and has_spice:
            is_valid_comparison = False
            warnings.append(
                "CRITICAL INCOMPATIBILITY (Liquid Droplet vs. Gaseous Jet): FLEX evaluated liquid droplet extinguishment, while SPICE investigated gaseous hydrocarbon jet diffusion flame smoke points. Physical quantities are fundamentally non-equivalent."
            )
            variables_analysis.append({
                "variable_name": "Combustion Mode",
                "is_comparable": False,
                "reason": "Evaporating droplet vs. gaseous laminar co-flow jet.",
                "units_match": False,
                "notes": "Different governing Damköhler and Lewis numbers."
            })

        if has_saffire and has_spice:
            is_valid_comparison = False
            warnings.append(
                "CRITICAL INCOMPATIBILITY (Solid Surface Spread vs. Laminar Gas Jet): SAFFIRE-I measured solid fabric flame propagation, while SPICE measured laminar smoke emission heights in gas nozzles."
            )
            variables_analysis.append({
                "variable_name": "Flame Measurement Type",
                "is_comparable": False,
                "reason": "Solid surface flame spread (mm/s) vs. gas jet flame length (mm).",
                "units_match": False,
                "notes": "Different momentum and diffusion regimes."
            })

        # Flow Field Check
        if has_flex and (has_saffire or has_spice):
            variables_analysis.append({
                "variable_name": "Convective Flow Velocity",
                "is_comparable": False,
                "reason": "FLEX is stagnant quiescent flow (~0 cm/s), while SAFFIRE-I (20 cm/s forced duct flow) and SPICE (5-40 cm/s co-flow) feature forced convection.",
                "units_match": True,
                "notes": "Forced flow drastically alters oxygen flux, cooling rates, and flame extinction dynamics."
            })

        # Atmosphere & Oxygen Condition (Compatible variable)
        variables_analysis.append({
            "variable_name": "Ambient Oxygen Concentration (O2 %)",
            "is_comparable": True,
            "reason": "All three investigations systematically vary or monitor ambient O2 percentage under microgravity.",
            "units_match": True,
            "notes": "Can be compared contextually to assess oxygen index effects across different fuel types."
        })

        # Gravity Regime
        variables_analysis.append({
            "variable_name": "Gravity Regime",
            "is_comparable": True,
            "reason": "All three experiments were conducted in orbital microgravity (~10^-6 to 10^-5 g) aboard the ISS or Cygnus vehicle.",
            "units_match": True,
            "notes": "Buoyancy-driven natural convection is suppressed in all three investigations."
        })

        if not warnings:
            comparability_warning = "Direct quantitative comparison is scientifically valid for observations within this experimental framework."
            recommendation = "You may analyze quantitative trends, parameter variations, and sensor time-series directly."
        else:
            comparability_warning = " ".join(warnings)
            recommendation = "SCIENTIFIC INTEGRITY RULE: View these investigations side-by-side as distinct qualitative microgravity combustion mechanisms. Do not overlay burning rate constants, flame spread speeds, or smoke point lengths on the same scale."

        # Parse fuels_tested_json for response
        for inv in investigations:
            if inv.get("fuels_tested_json"):
                try:
                    inv["fuels_tested"] = json.loads(inv["fuels_tested_json"])
                except Exception:
                    inv["fuels_tested"] = []

        return {
            "is_valid_comparison": is_valid_comparison,
            "comparability_warning": comparability_warning,
            "investigations": investigations,
            "variables_analysis": variables_analysis,
            "shared_observations": observations,
            "recommendation": recommendation
        }

_comparison_service = None

def get_comparison_service() -> ScientificComparisonService:
    global _comparison_service
    if _comparison_service is None:
        _comparison_service = ScientificComparisonService()
    return _comparison_service
