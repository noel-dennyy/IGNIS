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
        has_flex2 = "PSI-70" in inv_ids_set
        has_saffire = "PSI-98" in inv_ids_set
        has_saffire2 = "PSI-99" in inv_ids_set
        has_bass = "PSI-108" in inv_ids_set
        has_spice = "PSI-107" in inv_ids_set
        has_slice = "PSI-71" in inv_ids_set
        has_bre = "PSI-101" in inv_ids_set

        # Compatible Pair 1: FLEX & FLEX-2 (Both are microgravity droplet combustion)
        if (has_flex or has_flex2) and len(inv_ids_set - {"PSI-69", "PSI-70"}) == 0:
            variables_analysis.append({
                "variable_name": "Droplet Burning Rate Constant (K)",
                "is_comparable": True,
                "reason": "Both FLEX and FLEX-2 evaluated isolated droplets in the CIR MDCA using the classical d^2-law burning rate constant K [mm^2/s].",
                "units_match": True,
                "notes": "Directly comparable across pure alkanes (heptane, decane) and binary alkane mixtures."
            })
            variables_analysis.append({
                "variable_name": "Initial Droplet Diameter (d_0)",
                "is_comparable": True,
                "reason": "Both investigations systematically deployed droplets in the 1.8 to 3.5 mm diameter range on 14-micron SiC filaments.",
                "units_match": True,
                "notes": "Allows direct scaling comparisons of initial diameter effects on extinction."
            })
            variables_analysis.append({
                "variable_name": "Low-Temperature Cool Flame Transition",
                "is_comparable": True,
                "reason": "Both investigations characterized radiative hot-flame extinction followed by sustained cool-flame droplet consumption.",
                "units_match": True,
                "notes": "FLEX discovered the phenomenon; FLEX-2 quantified burning rate K_cool for binary mixtures."
            })

        # Compatible Pair 2: SAFFIRE-I, SAFFIRE-II & BASS (All are solid material flame spread under forced airflow)
        if (has_saffire or has_saffire2 or has_bass) and len(inv_ids_set - {"PSI-98", "PSI-99", "PSI-108"}) == 0:
            variables_analysis.append({
                "variable_name": "Flame Spread Rate (V_f)",
                "is_comparable": True,
                "reason": "SAFFIRE-I, SAFFIRE-II, and BASS measured surface flame propagation velocities [mm/s] across solid materials in microgravity duct flow.",
                "units_match": True,
                "notes": "All tested composite fabric/PMMA; enables direct comparison across oxygen concentrations (21% to 28% O2) and duct geometries."
            })
            variables_analysis.append({
                "variable_name": "Forced Convective Flow Velocity",
                "is_comparable": True,
                "reason": "These investigations evaluate concurrent/opposed forced airflow velocity [cm/s] as the primary oxidizer transport mechanism.",
                "units_match": True,
                "notes": "BASS varied flow between 0.5 and 10 cm/s; SAFFIRE evaluated steady 20 cm/s Cygnus duct flow."
            })
            variables_analysis.append({
                "variable_name": "Peak Flame Temperature & Heat Flux",
                "is_comparable": True,
                "reason": "Recorded thermocouple rake telemetry and calibrated radiometers in the boundary layer above solid fuels.",
                "units_match": True,
                "notes": "Peak temperatures between 780 °C and 955 °C reflect consistent aerothermal reaction kinetics."
            })

        # Compatible Pair 3: SPICE & SLICE (Both are gaseous jet diffusion flames in microgravity)
        if (has_spice or has_slice) and len(inv_ids_set - {"PSI-107", "PSI-71"}) == 0:
            variables_analysis.append({
                "variable_name": "Gas Jet Flame Structure & Soot Inception",
                "is_comparable": True,
                "reason": "Both SPICE and SLICE tested ethylene and methane round gas jet diffusion flames in the ISS Microgravity Science Glovebox (MSG).",
                "units_match": True,
                "notes": "Directly comparable across co-flow velocities, burner diameters, and soot inception thresholds."
            })
            variables_analysis.append({
                "variable_name": "Co-flow Air Velocity",
                "is_comparable": True,
                "reason": "Both investigated forced laminar co-flow air streams to examine flame stabilization without buoyant natural convection.",
                "units_match": True,
                "notes": "Co-flow velocities between 5 cm/s and 30 cm/s."
            })

        # Incompatible combinations across different physical phases:
        has_droplets = has_flex or has_flex2 or has_bre
        has_solids = has_saffire or has_saffire2 or has_bass
        has_gases = has_spice or has_slice

        if has_droplets and has_solids:
            is_valid_comparison = False
            warnings.append(
                "CRITICAL INCOMPATIBILITY (Droplet vs. Solid Sheet / Material): Liquid droplets burn with spherical symmetry via evaporating d^2-law surface regression (K in mm^2/s), whereas solid materials burn via surface pyrolysis and boundary layer flame propagation (V_f in mm/s). They cannot be plotted on a shared quantitative axis."
            )
            variables_analysis.append({
                "variable_name": "Combustion Mode & Phase",
                "is_comparable": False,
                "reason": "Liquid fuel droplet (spherical) vs. Solid material surface spread (planar).",
                "units_match": False,
                "notes": "FLEX/FLEX-2 use d^2 evaporation kinetics; SAFFIRE/BASS use solid pyrolysis and forward heat conduction."
            })

        if has_droplets and has_gases:
            is_valid_comparison = False
            warnings.append(
                "CRITICAL INCOMPATIBILITY (Liquid Droplet vs. Gas Jet): Droplet investigations evaluate liquid phase-change and spherical quenching, while SPICE investigated non-buoyant gaseous jet diffusion flame smoke points. Physical quantities are fundamentally non-equivalent."
            )
            variables_analysis.append({
                "variable_name": "Combustion Mode",
                "is_comparable": False,
                "reason": "Evaporating droplet vs. gaseous laminar co-flow jet.",
                "units_match": False,
                "notes": "Different governing Damköhler and Lewis numbers."
            })

        if has_solids and has_gases:
            is_valid_comparison = False
            warnings.append(
                "CRITICAL INCOMPATIBILITY (Solid Surface Spread vs. Laminar Gas Jet): Solid investigations measure flame spread rates (mm/s), while SPICE measures soot emission smoke-point flame lengths (mm) from gas burners."
            )
            variables_analysis.append({
                "variable_name": "Flame Measurement Type",
                "is_comparable": False,
                "reason": "Solid surface flame spread (mm/s) vs. gas jet flame length (mm).",
                "units_match": False,
                "notes": "Different momentum and diffusion transport regimes."
            })

        # Flow Field Check
        if has_droplets and (has_solids or has_gases):
            variables_analysis.append({
                "variable_name": "Convective Flow Velocity",
                "is_comparable": False,
                "reason": "FLEX and FLEX-2 are stagnant quiescent chambers (~0 cm/s), while SAFFIRE, BASS, and SPICE feature forced or co-flow convective airflow (0.5 to 40 cm/s).",
                "units_match": True,
                "notes": "Forced flow fundamentally alters oxygen flux, convective cooling, and extinction limits."
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
