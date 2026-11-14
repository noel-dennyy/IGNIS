# IGNIS — Intelligent Guidance for Next-generation In-Space Safety

> **NASA Space Apps Challenge 2026 Hackathon Prototype**  
> **Challenge:** *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*  
> **Official Challenge URL:** [https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/)  
> **Developer:** Solo Participant  
> **Repository:** [https://github.com/ignis-space-safety/ignis](https://github.com/ignis-space-safety/ignis) *(Demo / Submission Repo)*

---

## 1. Project Overview & Challenge Statement

NASA has studied how flames and fire behave in microgravity for decades. The accumulated results matter for future Moon and Mars exploration, but the sheer volume makes them difficult to find, compare, and understand.

On Earth, gravity-driven density differences cause hot combustion products to rise, drawing cool, oxygen-rich air into the base of the flame (buoyant convection). In microgravity (~10⁻⁶ g), buoyancy is virtually absent: flames become rounded or spherical, burn cooler, generate larger soot agglomerates, and can remain undetected in low-temperature "cool flame" regimes.

**IGNIS** solves this challenge by providing an interactive, source-grounded scientific research intelligence dashboard that:
1. **Discovers and ingests authentic NASA Physical Sciences Informatics (PSI) data:** Focusing on landmark investigations **FLEX (PSI-69)**, **SAFFIRE-I (PSI-98)**, and **SPICE (PSI-107)** with official DOIs and verified SHA-256 checksums.
2. **Enforces scientific comparability rules:** Refuses to mix incomparable measurements (e.g. liquid droplet burning rates vs. solid fabric flame spread) and warns researchers against invalid cross-experiment overlays.
3. **Provides citation-grounded research assistance:** Answers scientific inquiries strictly citing retrieved NASA technical report passages, with a 100% offline fallback requiring zero API keys.
4. **Calculates transparent evidence-relevance rankings:** Evaluates query/scenario fit using an auditable 4-factor model, explicitly identifying corpus gaps rather than estimating speculative safety probabilities.

> **Operational Safety Disclaimer:** IGNIS is an independent research prototype created for the NASA Space Apps Challenge 2026. It is not an official NASA product, is not certified by NASA, and does not provide operational spacecraft fire suppression instructions, material certifications, or safety guarantees.

---

## 2. Global Awards Mandatory Data Eligibility Verification

As confirmed by the NASA Space Apps Global Organizing Team:
> *"To be eligible for Global Awards, projects must use at least one NASA data source listed in the selected challenge's Resources section."*

IGNIS uses **two primary NASA data sources** explicitly listed on the official *Flame in Freefall* Resources tab:
1. **NASA Physical Sciences Informatics (PSI) Repository:**
   - Ingested primary investigations: **FLEX (PSI-69)**, **SAFFIRE-I (PSI-98)**, and **SPICE (PSI-107)**.
   - Grounded with persistent DOIs: `10.60555/mbq8-0451`, `10.60555/0t15-1z43`, and `10.60555/9kbh-e962`.
   - Open access license: **CC0-1.0**.
2. **NASA Technical Reports Server (NTRS):**
   - Ingested peer-reviewed papers and NASA Technical Memorandums (e.g., NASA/TM-2017-219502, NASA/TP-2023-220411).
   - Traceable citations with publication years, page numbers, and author attributions.

Full provenance, SHA-256 checksums, and download records are documented in [DATA_AUDIT.md](DATA_AUDIT.md).

---

## 3. Implemented Modules and Features

| Module | Purpose & Capabilities | Scientific Grounding |
|---|---|---|
| **Command Center (Overview)** | Live metrics computed directly from database records (3 investigations, 4 documents, 12 chunks, 58 observations, 12 findings). Features highlighted discovery of low-temperature cool flames. | No hardcoded counts; every metric queries SQLite database. |
| **Investigation Explorer** | Deep inspection of FLEX, SAFFIRE-I, and SPICE. Displays platforms, facilities, apparatus descriptions, tested fuels, and verified source files with SHA-256 hashes. Filterable table of 58 physical measurements. | Grounded in official NASA PSI investigation versions (Versions 3–5). |
| **Research Library** | Lexical retrieval engine (scikit-learn TF-IDF) over paragraph and page-aware chunks. Displays text snippets, page numbers, section headings, and clickable NASA source links. | Cites original authors (Williams, Nayagam, Dietrich, Urban, Ruff, Sunderland). |
| **Evidence Comparison** | Side-by-side comparability matrix. Automatically detects geometric and dimensional incompatibilities (liquid droplet vs. solid fabric vs. gas jet). Refuses to generate false overlays and displays verified parameter plots only when valid. | Implements rigorous microgravity aerothermal comparability rules. |
| **Relevance Ranking Engine** | Transparent 4-factor scoring: Topic Relevance (35%), Condition Match (30%), Variable Coverage (20%), and Provenance (15%). Explains matched conditions and highlights corpus gaps. | Transparent relevance to research queries, NOT fire danger or safety score. |
| **IGNIS AI Research Assistant** | Citation-grounded research synthesizer with pre-loaded demo queries. Operates offline without external API keys. Declares "insufficient corpus evidence" on out-of-domain queries. | Strict retrieval grounding; rejects unsupported claims. |
| **Mission Scenario Explorer** | Evaluates hypothetical exploration architectures (e.g. Artemis Pressurized Lunar Habitat with 32% O₂ at 56.5 kPa). Surfaces relevant microgravity research leads and flags partial-gravity scaling gaps. | Explicitly distinguishes orbital microgravity (~10⁻⁶ g) from lunar surface gravity (1/6 g). |

---

## 4. Architecture & Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind-aligned CSS workstation design tokens, Lucide icons, Recharts for validated numeric time-series.
- **Backend:** FastAPI, Python 3.11, Pydantic, scikit-learn (TF-IDF vectorizer & cosine similarity), pandas, numpy.
- **Database:** SQLite3 with strict foreign key constraints and normalized relational schema (`investigations`, `source_files`, `documents`, `document_chunks`, `observations`, `research_findings`).
- **Testing:** Python unittest test suite with 10 passing tests covering all API endpoints, comparability validation, and error handling.

---

## 5. Local Setup and Quickstart Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### Step 1: Clone Repository
```bash
git clone https://github.com/ignis-space-safety/ignis.git
cd ignis
```

### Step 2: Backend Setup
```powershell
# From project root
cd backend
python -m pip install fastapi uvicorn pydantic scikit-learn pandas numpy httpx

# Ingest authentic NASA datasets into SQLite
python -c "import sys; sys.path.insert(0, '.'); from app.services.ingest import run_ingestion; run_ingestion()"

# Run backend unit tests
python -m unittest tests/test_backend.py

# Start FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Step 3: Frontend Setup
```powershell
# Open a new terminal from project root
cd frontend
npm install
npm run build
npm run dev
```

Open your browser to `http://localhost:5173` to explore the IGNIS workstation!

*(Note: The FastAPI backend also serves the compiled frontend at `http://127.0.0.1:8000/` automatically).*

---

## 6. Scientific Limitations & Responsible AI Notice

- **Microgravity vs. Planetary Gravity:** Orbital microgravity aboard the ISS (~10⁻⁶ g) eliminates buoyant flow entirely. Lunar gravity (1/6 g) and Martian gravity (3/8 g) feature weak natural convection that creates upward flame tilting. Microgravity findings cannot be applied directly to lunar or Martian surface habitats without validated scaling models.
- **Apparatus Dependency:** Droplet burning rate constants ($K$), solid fabric flame spread rates, and gaseous smoke-point flame lengths represent fundamentally distinct physical transport mechanisms.
- **AI Tool Disclosure:** In compliance with Space Apps 2026 rules, all AI tool usage (Antigravity lead agent, subagents) is fully disclosed in [AI_USAGE.md](AI_USAGE.md). No official NASA flags, logos, or insignia were generated by AI.
- **Missing Data:** Missing experimental values remain `null`/unknown and are never filled with zero.

---

## 7. Submission Package & Links

- **NASA Space Apps Challenge 2026:** [Flame in Freefall](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/)
- **Data Audit & Provenance:** [DATA_AUDIT.md](DATA_AUDIT.md)
- **AI Disclosure Statement:** [AI_USAGE.md](AI_USAGE.md)
- **3-Minute Demo Script:** [docs/demo-script.md](docs/demo-script.md)
- **Technical Architecture Guide:** [docs/architecture.md](docs/architecture.md)
- **Project Status & Milestones:** [PROJECT_STATUS.md](PROJECT_STATUS.md)
