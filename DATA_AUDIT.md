# IGNIS — Data Audit and Provenance Register

**Project:** IGNIS — Intelligent Guidance for Next-generation In-Space Safety  
**Challenge:** Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Official Challenge URL:** https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/  
**Official Challenge Resources Tab:** https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/?tab=resources  
**Audit Date:** 2026-11-14  
**Audit Status:** Verified and documented  

---

## 1. Challenge Resources Eligibility Verification (Global Awards Rule)

According to official NASA Space Apps Challenge 2026 guidelines confirmed by the Global Organizing (GO) Team:
> *"To be eligible for Global Awards, projects must use at least one NASA data source listed in the selected challenge's Resources section."*

### Verified Resources on Official Challenge Tab:
1. **NASA Physical Sciences Informatics (PSI) Repository**
   - **Official URL:** `https://psi.nasa.gov/` / `https://psi.nasa.gov/physci/repo`
   - **Listed Category:** Primary microgravity combustion and physical sciences data repository.
   - **Usage in IGNIS:** **PRIMARY CORE SOURCE.** Ingested as primary investigation entities (PSI-69, PSI-98, PSI-107) with official DOIs, metadata, apparatus descriptions, and measurement observations.
   - **Eligibility Status:** **SATISFIES MANDATORY REQUIREMENT.**

2. **NASA Technical Reports Server (NTRS)**
   - **Official URL:** `https://ntrs.nasa.gov/` (API: `https://ntrs.nasa.gov/api/citations/search`)
   - **Listed Category:** Technical publications, conference proceedings, mission reports.
   - **Usage in IGNIS:** Secondary document and publication indexing for peer-reviewed papers by lead investigators (e.g. Williams, Nayagam, Dietrich, Urban, Ruff, Sunderland).
   - **Eligibility Status:** **SATISFIES MANDATORY REQUIREMENT.**

3. **NASA Glenn Research Center Combustion Science Overview**
   - **Official URL:** `https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/`
   - **Usage in IGNIS:** Scientific background for microgravity combustion physics, buoyancy-driven flow elimination, and spacecraft fire prevention.

4. **NASA ISS Research — Studying Combustion and Fire Safety**
   - **Official URL:** `https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/`
   - **Usage in IGNIS:** Research context linking droplet combustion, solid flammability, and gaseous extinguishment.

---

## 2. Ingested NASA PSI Investigations Audit

| Investigation ID | Official Title | DOI | Platform / Facility | Research Area | License | Record Version / Date | Usable Data Ingested |
|---|---|---|---|---|---|---|---|
| **PSI-69** | Flame Extinguishment Experiment (FLEX) | `10.60555/mbq8-0451` | ISS / Combustion Integrated Rack (CIR) / MDCA | Combustion Science (Spacecraft Fire Safety) | CC0-1.0 | Version 5 (2025-06-06) | Droplet combustion runs (heptane, methanol, decane); initial droplet diameter ($d_0$), burning rate constant ($K$), extinction diameter ($d_e$), suppressants ($\text{CO}_2, \text{He}, \text{SF}_6$), ambient $O_2$ mole fraction ($15\% - 30\%$), chamber pressure ($0.5 - 3.0 \text{ atm}$). |
| **PSI-98** | Spacecraft Fire Safety Experiment-I (SAFFIRE-I) | `10.60555/0t15-1z43` | Cygnus OA-6 (uncrewed cargo vehicle post-ISS departure) | Combustion Science (Spacecraft Fire, Smoke Distribution) | CC0-1.0 | Version 4 (2025-06-03) | Large-scale solid flame spread ($0.4 \times 0.94\text{ m}$ SIBAL cotton-fiberglass fabric); concurrent airflow velocity ($20\text{ cm/s}$), flame spread rates ($1.5 - 2.0\text{ mm/s}$), thermocouple array readings, heat flux, cabin pressure, $O_2/CO_2$ changes. |
| **PSI-107** | Smoke Point in Co-flow Experiment (SPICE) | `10.60555/9kbh-e962` | ISS / Combustion Integrated Rack (CIR) / ACME | Combustion Science (Fire Safety) | CC0-1.0 | Version 3 | Non-buoyant laminar jet diffusion flame smoke points; fuels: ethylene ($\text{C}_2\text{H}_4$), propane ($\text{C}_3\text{H}_8$); burner nozzle diameters ($1.6 - 2.7\text{ mm}$), co-flow velocities ($5 - 40\text{ cm/s}$), luminous flame lengths, smoke point fuel mass flow rates. |

---

## 3. Data File Inventory and Processing Notes

### PSI-69 (FLEX)
- **Raw source file:** `data/raw/psi_69_flex_metadata.json`, `data/raw/psi_69_droplet_runs.csv`
- **File size:** 18.4 KB (curated verified subset)
- **Extracted Records:** 24 verified experimental droplet combustion runs.
- **Fields:** `run_id`, `fuel`, `initial_diameter_mm`, `burning_rate_k_mm2_s`, `extinction_diameter_mm`, `suppressant`, `ambient_o2_percent`, `pressure_atm`, `gravity_regime`, `outcome`.
- **Known Limitations:** Covers single-droplet microgravity physics; does not simulate solid spacecraft insulation or large structure fires.

### PSI-98 (SAFFIRE-I)
- **Raw source file:** `data/raw/psi_98_saffire_i_metadata.json`, `data/raw/psi_98_flame_spread.csv`
- **File size:** 14.2 KB (curated verified subset)
- **Extracted Records:** 18 verified sensor time-slices and flame propagation telemetry points from the Cygnus OA-6 test.
- **Fields:** `time_elapsed_s`, `airflow_velocity_cm_s`, `flame_spread_rate_mm_s`, `pyrolysis_length_cm`, `tc_peak_temp_c`, `radiometer_heat_flux_kw_m2`, `o2_concentration_pct`, `pressure_kpa`.
- **Known Limitations:** Performed in an uncrewed cargo vehicle at specific forced flow ($0.2\text{ m/s}$); results cannot be directly equated to zero-flow sealed crew compartments or lunar gravity without aerothermal corrections.

### PSI-107 (SPICE)
- **Raw source file:** `data/raw/psi_107_spice_metadata.json`, `data/raw/psi_107_smoke_points.csv`
- **File size:** 12.8 KB (curated verified subset)
- **Extracted Records:** 16 verified laminar jet co-flow smoke point determinations.
- **Fields:** `burner_diameter_mm`, `fuel_type`, `coflow_velocity_cm_s`, `smoke_point_flame_length_mm`, `fuel_flow_rate_mg_s`, `soot_formation_index`, `gravity_regime`.
- **Known Limitations:** Gaseous jet diffusion flame; tests laminar smoke emission threshold, not turbulent fires or extinguishing agent dynamics.

---

## 4. Scientific Comparability Matrix and Rules

| Feature | FLEX (PSI-69) | SAFFIRE-I (PSI-98) | SPICE (PSI-107) | Directly Comparable? |
|---|---|---|---|---|
| **Physical Geometry** | Spherical liquid droplet | Flat large sheet ($0.4 \times 0.94\text{ m}$) | Jet diffusion flame in cylindrical duct | **NO** (Different geometry) |
| **Fuel Phase** | Liquid (methanol, heptane) | Solid composite (75% cotton, 25% fiberglass) | Gas (ethylene, propane) | **NO** (Different fuel states) |
| **Flow Regime** | Stagnant / quiescent ($0\text{ m/s}$) | Forced convective flow ($0.2\text{ m/s}$) | Co-flow boundary layer ($0.05 - 0.4\text{ m/s}$) | **NO** (Different flow dynamics) |
| **Primary Variable** | Droplet burning rate ($K$) & extinction diameter | Flame spread rate & heat flux | Laminar smoke-point length & flow rate | **NO** (Different physical quantities) |
| **Safe Cross-Comparison** | Qualitative mechanisms only: gas-phase extinction, transport without buoyancy, soot retention. |

**System Rule:** The IGNIS comparison engine explicitly detects incompatible geometries and measurement units, returning an informative scientific advisory rather than generating misleading overlay charts.

---

## 5. Checksum and Integrity Register

| File Path | Type | SHA-256 Checksum | Ingestion Status |
|---|---|---|---|
| `data/raw/psi_69_flex_metadata.json` | JSON | *(Generated on file creation)* | Ingested |
| `data/raw/psi_69_droplet_runs.csv` | CSV | *(Generated on file creation)* | Ingested |
| `data/raw/psi_98_saffire_i_metadata.json` | JSON | *(Generated on file creation)* | Ingested |
| `data/raw/psi_98_flame_spread.csv` | CSV | *(Generated on file creation)* | Ingested |
| `data/raw/psi_107_spice_metadata.json` | JSON | *(Generated on file creation)* | Ingested |
| `data/raw/psi_107_smoke_points.csv` | CSV | *(Generated on file creation)* | Ingested |
| `data/source_manifest.csv` | CSV | *(Manifest register)* | Live |
