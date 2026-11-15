# IGNIS — Technical Documentation
## NASA Space Apps Challenge 2026

**Project:** IGNIS — Intelligent Guidance for Next-generation In-Space Safety
**Version:** 1.0.0 (Hackathon Prototype)
**Date:** November 2026

---

## 1. System Architecture

IGNIS is a decoupled full-stack application structured for scientific traceability, reproducibility, and local execution without cloud or paid API dependencies.

```
┌──────────────────────────────────────────────────────────────────┐
│                   React 19 + Vite 8 Frontend                     │
│  TypeScript 7 · Recharts 3 · Lucide React · Custom CSS Tokens    │
│                                                                  │
│  Pages: Landing · Lobby/Command Center · Investigation Explorer  │
│         Viz Dashboard · Evidence Comparison · AI Assistant       │
│         Scenario Analyzer · Evidence Gap Map · Image Gallery     │
│         Research Library · Relevance Ranking                     │
└───────────────────────────────┬──────────────────────────────────┘
                                │ JSON REST API over HTTP
┌───────────────────────────────▼──────────────────────────────────┐
│                 FastAPI Python 3.11 Backend                       │
│                                                                  │
│  Routers:                      Services:                         │
│  /api/health                   · Lexical Retrieval (TF-IDF)      │
│  /api/overview                 · Comparability Engine            │
│  /api/investigations           · Evidence Ranking (4-Factor)     │
│  /api/observations             · AI Research Assistant (RAG)     │
│  /api/documents                · Scientific Visualization        │
│  /api/search                   · Data Ingestion Pipeline         │
│  /api/compare                  · Image & Annotation Service      │
│  /api/rank                     · Evidence Gap Analysis           │
│  /api/assistant/ask                                              │
│  /api/evidence-gap                                               │
│  /api/images · /api/visualization                                │
└───────────────────────────────┬──────────────────────────────────┘
                                │ SQLite3 (PRAGMA foreign_keys = ON)
┌───────────────────────────────▼──────────────────────────────────┐
│                   Normalized SQLite Database                     │
│  investigations · source_files · documents · document_chunks     │
│  observations · research_findings · experiment_images            │
│  image_annotations · ranking_runs                                │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│                  Raw Data Layer  (data/)                         │
│  source_manifest.csv  (SRC-001 → SRC-017, with SHA-256 hashes)  │
│  data/raw/ — 17 JSON + CSV files for 8 PSI investigations        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.3.1 | UI component framework |
| TypeScript | ~7.0.2 | Type-safe frontend development |
| Vite | 8.3.6 | Build toolchain and dev server |
| Recharts | 3.10.1 | Scientific charts (line, scatter, bar, heatmap) |
| Lucide React | 1.73.0 | Scientific iconography |
| Custom CSS Tokens | — | Aerospace dark/light workstation theme |

### Backend
| Technology | Purpose |
|---|---|
| Python 3.11+ | Backend runtime |
| FastAPI | REST API framework with auto OpenAPI schema |
| Pydantic v2 | Request/response schema validation |
| scikit-learn | TF-IDF vectorizer and cosine similarity retrieval |
| SQLite3 (built-in) | Normalized relational database |
| pandas | CSV ingestion and data processing |
| numpy | Numerical computation |
| uvicorn | ASGI production server |

### Testing
| Tool | Result |
|---|---|
| Python unittest | **29/29 tests passing** |
| TypeScript `tsc -b` | Zero compilation errors (strict mode) |
| Vite production build | Clean bundle, zero warnings on code |

---

## 3. NASA Data Sources Used

### Primary Sources (Global Awards Eligible)

| Source | URL | Usage |
|---|---|---|
| NASA PSI Repository | https://psi.nasa.gov/ | Primary investigation data, DOIs, metadata, measurements |
| NASA NTRS | https://ntrs.nasa.gov/ | Peer-reviewed publications chunked for TF-IDF retrieval |
| NASA Glenn Research Center | https://www.nasa.gov/glenn/ | Combustion physics background |
| NASA ISS Research | https://www.nasa.gov/missions/station/ | Mission and experiment context |

### Ingested NASA PSI Investigations

| ID | Investigation | DOI | Platform | License | Obs. |
|---|---|---|---|---|---|
| PSI-69 | FLEX — Flame Extinguishment Experiment | 10.60555/mbq8-0451 | ISS / CIR / MDCA | CC0-1.0 | 24 |
| PSI-70 | FLEX-2 — Flame Extinguishment Experiment-2 | 10.60555/y812-q943 | ISS / CIR / MDCA | CC0-1.0 | 24 |
| PSI-98 | SAFFIRE-I — Spacecraft Fire Safety Experiment-I | 10.60555/0t15-1z43 | Cygnus OA-6 | CC0-1.0 | 18 |
| PSI-99 | SAFFIRE-II — Spacecraft Fire Safety Experiment-II | 10.60555/0t15-2z44 | Cygnus OA-5 | CC0-1.0 | 20 |
| PSI-107 | SPICE — Smoke Point in Co-flow Experiment | 10.60555/9kbh-e962 | ISS / CIR / ACME | CC0-1.0 | 16 |
| PSI-108 | BASS — Burning and Suppression of Solids | 10.60555/k489-p210 | ISS / MSG | CC0-1.0 | 20 |
| PSI-71 | SLICE — Structure & Liftoff In Combustion Experiment | 10.60555/slice-0071 | ISS / MSG | CC0-1.0 | 22 |
| PSI-101 | ACME-BRE — Burning Rate Emulator | 10.60555/acme-0101 | ISS / CIR / ACME | CC0-1.0 | 24 |

**Total:** 8 investigations · 176+ verified observations · 17 source files (SRC-001 → SRC-017)

---

## 4. Data Processing Methodology

### Ingestion Pipeline (`backend/app/services/ingest.py`)

1. **Manifest Scan** — Reads `data/source_manifest.csv` (SRC-001 → SRC-017) containing SHA-256 checksums, DOIs, license strings, and file URLs
2. **Investigation Registration** — Creates normalized `investigations` rows from JSON metadata files
3. **Source File Registration** — Links each raw file to its parent investigation with checksum
4. **Observation Insertion** — Parses CSV measurement files and inserts typed rows into `observations`
5. **Document Chunking** — Splits NASA NTRS publication text into paragraph-level chunks for retrieval
6. **Image Registration** — Registers procedural scientific illustrations with annotation pixel coordinates
7. **Clean Re-ingestion** — Clears and rebuilds all tables on every run for reproducible state

### Database Schema (normalized SQLite3)
```sql
investigations       -- NASA PSI investigation records with full metadata
source_files         -- Raw data file registry with SHA-256 integrity hashes
documents            -- NASA NTRS publication records
document_chunks      -- Page/paragraph-level text for TF-IDF retrieval
observations         -- Individual experimental measurement rows (176+)
research_findings    -- Extracted scientific conclusions per investigation
experiment_images    -- Procedural illustration registry (12 records)
image_annotations    -- Point-of-interest coordinates on illustrations
ranking_runs         -- Evidence ranking query audit log
```

---

## 5. Algorithms and Calculations

### A. Lexical Retrieval Engine (Research Assistant)
- **Algorithm:** scikit-learn `TfidfVectorizer` with cosine similarity ranking
- **Corpus:** All `document_chunks` from NASA NTRS publications and PSI investigation metadata
- **Flow:** Query → tokenize → TF-IDF vector → cosine similarity vs. corpus → top-k chunks retrieved → answer synthesized from retrieved text
- **Offline Mode:** Runs entirely without external API keys; answer is built directly from retrieved chunk excerpts
- **Evidence Gap Detection:** When no chunks score above a minimum relevance threshold, system returns `status: "insufficient_evidence"` with missing token list — never hallucinating

### B. Scientific Comparability Engine (`backend/app/services/comparison.py`)
Each investigation is classified into a physical regime:

| Regime | Investigations | Comparable Variables |
|---|---|---|
| Liquid Droplet | PSI-69, PSI-70 | Burning rate K (mm²/s), extinction diameter d_e (mm) |
| Solid Surface | PSI-98, PSI-99, PSI-108 | Flame spread rate V_f (mm/s), airflow (cm/s) |
| Gas Jet | PSI-107, PSI-71 | Smoke point length (mm), liftoff height (mm) |
| Condensed-Phase Emulator | PSI-101 | Burning mass flux g/(m²·s) |

**Cross-regime comparisons are blocked** with an explicit scientific advisory. Same-regime comparisons generate verified quantitative overlay charts.

### C. Evidence Relevance Ranking (`backend/app/services/ranking.py`)
Four-factor transparent scoring model:
- **Topic Relevance (35%)** — TF-IDF similarity of query to investigation text
- **Condition Match (30%)** — Gravity regime, fuel type, and atmospheric pressure alignment
- **Variable Coverage (20%)** — Fraction of query-requested variables present in investigation
- **Provenance Completeness (15%)** — Presence of DOI, version number, CC0 license

Output is a ranked list with per-factor breakdown, matched conditions, and corpus gap report.

### D. Evidence Gap Matrix (`backend/app/routers/evidence_gap.py`)
- **Dimensions:** 6 gravity regimes × 7 fuel/material classes × 7 atmosphere conditions = 294 theoretical combinations
- **Cell encoding:** Green (tested), Amber (partially tested), Red (critical gap — zero indexed records)
- **Notable gap identified:** Electrical wire insulation in microgravity — zero indexed experimental records

---

## 6. File Structure

```
IGNIS/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── database.py          # SQLite connection and schema
│   │   ├── schemas.py           # Pydantic v2 request/response models
│   │   ├── config.py            # Environment configuration
│   │   ├── routers/             # 14 API route handlers
│   │   └── services/            # Domain logic (retrieval, comparison, ranking, ingest)
│   ├── tests/
│   │   └── test_backend.py      # 29 automated unit tests
│   └── ignis.db                 # SQLite database (auto-generated on ingest)
├── data/
│   ├── source_manifest.csv      # SRC-001 → SRC-017 with SHA-256 checksums
│   └── raw/                     # 17 JSON + CSV source files
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Root routing and tab state
│   │   ├── api/client.ts        # Typed fetch API client
│   │   ├── components/          # Shared UI components
│   │   ├── pages/               # 12 research workspace pages
│   │   └── types/index.ts       # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   ├── architecture.md          # Technical architecture document
│   └── demo-script.md           # 3-minute demonstration script
├── submission_docs/             # NASA Space Apps submission package
├── README.md
├── SUBMISSION.md
├── DATA_AUDIT.md
└── AI_USAGE.md
```

---

## 7. Scientific Integrity Rules

1. **Zero Measurement Fabrication** — All numbers come from authentic NASA experimental datasets
2. **Missing Data Stays Null** — Incomplete sensor channels preserved as `null`, never imputed as `0.0`
3. **No Mixed Incompatible Units** — Flame spread (mm/s), burning rate (mm²/s), smoke point (mm) never share a physical axis
4. **Honest Unknowns** — Research limitations disclosed in every limitations panel
5. **Synthetic Illustration Labeling** — All procedural SVG illustrations carry: *"Scientific Illustration (Synthetic) — Not a NASA photograph"*
