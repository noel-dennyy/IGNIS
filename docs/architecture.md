# IGNIS — Technical Architecture and Design Document

**Project:** IGNIS — Intelligent Guidance for Next-generation In-Space Safety  
**Challenge:** NASA Space Apps Challenge 2026 — Flame in Freefall  
**Author:** Solo Developer  
**Status:** Implemented & Verified  

---

## 1. System Overview

IGNIS is structured as a modern decoupled full-stack application designed for scientific traceability, high reproducibility, and fast local execution without mandatory cloud or paid API dependencies.

```
┌─────────────────────────────────────────────────────────────┐
│                    React + Vite Frontend                    │
│   (Dark Scientific Workstation Theme · Recharts · Lucide)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API (HTTP)
┌──────────────────────────────▼──────────────────────────────┐
│                    FastAPI Python Backend                   │
│ ┌───────────────────────────┬─────────────────────────────┐ │
│ │  Routers                  │  Domain Services            │ │
│ │  - /api/health            │  - Lexical Retrieval        │ │
│ │  - /api/overview          │    (scikit-learn TF-IDF)    │ │
│ │  - /api/investigations    │  - Scientific Comparison    │ │
│ │  - /api/documents         │    (Comparability Engine)   │ │
│ │  - /api/search            │  - Evidence Ranking         │ │
│ │  - /api/compare           │    (Explainable 4-Factor)   │ │
│ │  - /api/rank              │  - AI Research Assistant    │ │
│ │  - /api/assistant/ask     │    (Offline Citation RAG)   │ │
│ └───────────────────────────┴─────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────┘
                               │ SQLite3 Database (Foreign Keys ON)
┌──────────────────────────────▼──────────────────────────────┐
│                    Normalized Database                      │
│   - investigations         - observations                   │
│   - source_files           - research_findings              │
│   - documents              - ranking_runs                   │
│   - document_chunks                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Ingested NASA PSI Datasets

1. **FLEX (PSI-69)**
   - **Persistent Identifier:** DOI `10.60555/mbq8-0451`
   - **Facility:** ISS Combustion Integrated Rack (CIR) / MDCA
   - **Measurements:** 24 verified droplet burning runs (methanol, n-heptane, n-decane) measuring burning rate constant ($K$, $\text{mm}^2/\text{s}$), extinction diameter ($d_e$, $\text{mm}$), and gaseous suppressants ($\text{CO}_2$, $\text{He}$, $\text{SF}_6$).

2. **SAFFIRE-I (PSI-98)**
   - **Persistent Identifier:** DOI `10.60555/0t15-1z43`
   - **Facility:** Uncrewed Orbital ATK Cygnus OA-6 Cargo Resupply Spacecraft
   - **Measurements:** 18 verified sensor telemetry slices from large-scale solid combustion of $0.4\times 0.94\text{ m}$ SIBAL cotton-fiberglass cloth under $20\text{ cm/s}$ forced concurrent flow, thermocouple temperatures up to $920^\circ\text{C}$, and radiant heat flux exceeding $6.2\text{ kW/m}^2$.

3. **SPICE (PSI-107)**
   - **Persistent Identifier:** DOI `10.60555/9kbh-e962`
   - **Facility:** ISS CIR / ACME insert
   - **Measurements:** 16 verified laminar smoke point determinations across ethylene, propane, and methane jet diffusion flames measuring smoke-point flame lengths ($\text{mm}$) and fuel mass flow rates ($\text{mg/s}$) under co-flow velocities from $5$ to $40\text{ cm/s}$.

---

## 3. Scientific Integrity & Comparability Engine

The system strictly enforces the following rules:
- **Geometry Non-Equivalence:** Spherical droplet combustion ($d^2$-law) cannot be plotted on the same quantitative axis as planar fabric surface spread or axisymmetric gas jets.
- **Unit Non-Equivalence:** Burning rate constant ($K$ in $\text{mm}^2/\text{s}$), linear flame spread rate ($\text{mm/s}$), and smoke point length ($\text{mm}$) reflect different dimensional physics.
- **Flow Field Sensitivity:** Stagnant microgravity diffusion is fundamentally different from forced convection duct flow.
- **Missing Data Handling:** Unknown or unreported experimental variables remain `null`/unknown and are never filled with zero.

---

## 4. Citation-Grounded Assistant & Offline Fallback

The AI assistant operates via a dual-mode service:
1. **Offline Mode (Default):** Extracts the top relevant document chunks using `TfidfVectorizer` and synthesizes an answer directly citing the retrieved document title, page number, section, and DOI link.
2. **Unsupported Out-of-Corpus Handling:** When queried about unindexed topics (such as propulsion antimatter containment), the system detects the absence of specific subject tokens from the indexed corpus and outputs an explicit "Insufficient Corpus Evidence" notice with missing terms listed.
