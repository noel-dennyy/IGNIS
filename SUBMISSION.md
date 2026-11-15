# IGNIS — Project Submission & Executive Brief

**Challenge:** Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Competition:** NASA International Space Apps Challenge 2026  
**Project Name:** **IGNIS** (Intelligent Guidance for Next-generation In-Space Safety)  
**Track:** Global Awards Eligible  
**Status:** Complete, Verified, Fully Runnable Prototype  

---

## 1. Executive Summary

Fire is among the most lethal hazards in human spaceflight. Inside an enclosed spacecraft or planetary habitat, smoke cannot simply rise to a ceiling detector; without buoyant natural convection, flames burn symmetrically, soot agglomerates into abnormally large particles, and pyrolyzed fuel vapors pool around ignition sources.

**IGNIS** is an interactive, source-grounded research intelligence platform built to unlock decades of NASA microgravity combustion physics for aerospace engineers, safety officers, and flight architects. 

By directly indexing authentic experimental data and technical reports from the **NASA Physical Sciences Informatics (PSI)** repository—specifically **FLEX (PSI-69)**, **SAFFIRE-I (PSI-98)**, and **SPICE (PSI-107)**—IGNIS transforms siloed research data into:
- An **Adaptive, Multi-Turn Conversational Assistant** with pronouns resolution, transparent reasoning steps, and evidence strength scoring.
- An **Evidence Gap Heatmap** mapping the frontiers of untested gravity × fuel × atmosphere combinations.
- A **Mission Scenario Analyzer** matching spacecraft architectures (Lunar Artemis habitat, Mars transit, ISS electronics standoff) against experimental telemetry.
- An **Interactive Scientific Visualization Dashboard & Image Comparison System** with strict scientific comparability safeguards.

---

## 2. Mandatory NASA Data Source Alignment (Global Awards Eligibility)

In strict accordance with the Space Apps Global Organizing Team criteria, IGNIS grounds all findings in primary sources listed under the official challenge Resources tab:

| Investigation | NASA PSI Repo Link | Official DOI | Platform / Facility | Research Focus |
|---|---|---|---|---|
| **FLEX (PSI-69)** | [NASA PSI Record](https://psi.nasa.gov/physci/repo/data/investigations/PSI-69) | `10.60555/mbq8-0451` | ISS / CIR / MDCA | Droplet burning rates ($K$), cool flame kinetics, and gaseous extinguishment ($\text{CO}_2, \text{He}, \text{SF}_6$). |
| **FLEX-2 (PSI-70)** | [NASA PSI Record](https://psi.nasa.gov/physci/repo/data/investigations/PSI-70) | `10.60555/y812-q943` | ISS / CIR / MDCA | Binary alkane droplets (heptane/hexadecane), preferential vaporization, and quantitative cool flame burning. |
| **SAFFIRE-I (PSI-98)** | [NASA PSI Record](https://psi.nasa.gov/physci/repo/data/investigations/PSI-98) | `10.60555/0t15-1z43` | Cygnus OA-6 Cargo Craft | Large-scale solid flame spread ($0.4 \times 0.94\text{ m}$ SIBAL fabric) under low-speed forced airflow ($20\text{ cm/s}$). |
| **SPICE (PSI-107)** | [NASA PSI Record](https://psi.nasa.gov/physci/repo/data/investigations/PSI-107) | `10.60555/9kbh-e962` | ISS / CIR / ACME | Non-buoyant laminar gas jet diffusion flames, soot thresholds, and smoke-point lengths. |
| **BASS (PSI-108)** | [NASA PSI Record](https://psi.nasa.gov/physci/repo/data/investigations/PSI-108) | `10.60555/k489-p210` | ISS / MSG Glovebox | Solid polymer combustion (cast PMMA rods/slabs, Nomex, SIBAL) and nitrogen dilution extinguishment (LOI = 15.5% $O_2$). |
| **NASA Technical Reports Server (NTRS)** | [NASA NTRS](https://ntrs.nasa.gov/) | Multiple | Glenn Research Center & Partners | Ingested technical publications, author findings, and experimental methodologies. |

*Full data provenance, file checksums, and CC0-1.0 license compliance are cataloged in `DATA_AUDIT.md`.*

---

## 3. Platform Capabilities & Feature Architecture

### 1. Adaptive AI Research Assistant (`/assistant`)
- **Multi-Turn Memory & Coreference:** Understands follow-up questions referencing previous concepts (e.g., *"What was its temperature?"* correctly resolves to the active investigation).
- **Transparent Reasoning Steps:** Users can expand an internal reasoning accordion showing intent classification, coreference resolution, and chunk scoring.
- **Evidence Strength Bar:** Visual indicator (Strong, Moderate, Sparse) based on retrieved chunk density and TF-IDF relevance scores.
- **Strict Evidence Guard:** When asked about unindexed topics or sci-fi systems (e.g., "antimatter containment"), IGNIS explicitly acknowledges the lack of indexed NASA evidence rather than hallucinating.
- **100% Offline Capable:** Uses deterministic scikit-learn TF-IDF lexical search over verified NASA chunks; an external LLM (OpenAI/Gemini) is optional and backend-only.

### 2. Evidence Gap Heatmap (`/evidence-gap`)
- Interactive matrix of **6 Gravity Regimes × 7 Fuel/Material Classes × 7 Atmospheric Conditions**.
- Color-coded cells: **Green (Tested)**, **Amber (Partial)**, **Red (Critical Gap)**.
- Filterable slices by gravity, material, or atmosphere.
- Highlights that critical operational materials—such as **electrical wire insulation**—remain completely untested in microgravity combustion records, signaling priority areas for future NASA experiments.

### 3. Mission Scenario Analyzer (`/scenario`)
- Pre-configured hypothetical mission profiles:
  1. **Artemis Pressurized Lunar Habitat** (Partial $1/6\text{ g}$, $32\%\text{ O}_2$, $56.5\text{ kPa}$).
  2. **Mars Long-Duration Transit Vehicle** (Zero-g transit, $21\%\text{ O}_2$, $101.3\text{ kPa}$).
  3. **ISS Electronics Rack Standoff & Wire Harness Overheat** ($10^{-6}\text{ g}$, near-zero flow dead zone).
- Identifies transferred research leads while explicitly flagging **aerothermal mismatches** and boundary limits.

### 4. Scientific Visualization & Analytics (`/viz`)
- **Time-Series Telemetry:** Flame front positions, thermocouple temperatures ($920^\circ\text{C}$ peak), and chamber pressures from SAFFIRE-I flight data.
- **Scatter Explorations:** Initial droplet diameter ($d_0$) versus burning rate constant ($K$) across oxygen fractions in FLEX.
- **Statistical Distributions:** Droplet burning rates and extinction diameters.
- **2D Sensor Heatmaps:** Multi-channel temperature gradients across the Cygnus combustion duct.

### 5. Experiment Image Comparison & Workspace (`/image-compare`, `/workspace`)
- Synchronized split-screen slider comparison between experimental illustrations.
- Interactive point-of-interest annotations.
- Prominent compliance labeling on all procedural graphics: *"Scientific Illustration (Synthetic) — Not a NASA photograph"*.
- Strict multi-investigation comparability matrix: blocks erroneous quantitative cross-plotting between non-comparable dimensions (e.g., droplet burning area loss $\text{mm}^2/\text{s}$ vs. linear solid flame spread $\text{mm}/\text{s}$).

### 6. Built-in Usability & Design
- **Dark & Light Mode Toggle:** Seamless aerospace dark interface with an accessible daylight mode.
- **Interactive Guided Tour (5 Steps):** Walkthrough overlay for evaluators and new users.
- **Direct NASA Provenance Links:** Every view links to the primary NASA PSI and DOI records.

---

## 4. Scientific Integrity & Data Rules

1. **Zero Measurement Fabrication:** All numbers come from authentic NASA experimental datasets.
2. **Missing Data Stays Null:** Incomplete sensor channels are preserved as `null`, never imputed as `0.0`.
3. **No Mixed Incompatible Units:** Flame spread velocity ($\text{mm}/\text{s}$), droplet consumption rates ($\text{mm}^2/\text{s}$), and smoke point lengths ($\text{mm}$) are never combined on shared physical axes.
4. **Honest Unknowns:** Research limitations are always disclosed in an accompanying limitations panel.

---

## 5. Technology Stack & Verification

- **Backend:** Python 3.11, FastAPI, raw SQLite (`ignis.db`), scikit-learn TF-IDF, Pydantic v2.
- **Frontend:** React 19, Vite 8, TypeScript 7, Recharts, Lucide React icons.
- **Test Coverage:** **28/28 backend automated unit tests passing** (`test_backend.py`).
- **Build Quality:** Zero TypeScript compilation errors (`tsc -b && vite build` clean).

---

## 6. How to Run the Prototype

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Server
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*The database automatically initializes and ingests the verified NASA dataset upon startup.*

### 2. Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Automated Test Suite
```bash
python -m unittest discover -s backend/tests -p "test_*.py" -v
```

---

## 7. AI Usage and Disclosure Statement

All artificial intelligence tools utilized during the creation of IGNIS are disclosed in full compliance with Space Apps 2026 guidelines in **`AI_USAGE.md`**. No NASA logos or mission insignia were generated. All scientific figures are authentic SVGs clearly labeled as synthetic illustrations.
