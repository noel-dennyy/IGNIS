# IGNIS — Project Overview
## NASA Space Apps Challenge 2026

**Project Title:** IGNIS — Intelligent Guidance for Next-generation In-Space Safety
**Challenge:** Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data
**Challenge URL:** https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/
**Track:** Global Awards Eligible
**Participation Type:** Virtual

---

## 1. Problem Statement

Fire aboard a crewed spacecraft or planetary habitat is one of the most catastrophic hazards in human spaceflight. Unlike terrestrial fires, microgravity flames lack buoyant convection — the upward draft of hot gases that Earth-based fire safety systems depend on. Without gravity:

- Flames form **spherical diffusion shells** rather than teardrop shapes
- Combustion products **do not rise** to ceiling-mounted detectors
- Soot agglomerates into **abnormally large particles** that contaminate air recycling systems
- Hydrocarbon fuels sustain **invisible "cool flames"** at ~800 K long after the visible flame extinguishes
- Flame spread across solid materials occurs via **surface pyrolysis** mechanisms fundamentally different from 1-g behaviour

NASA has studied these phenomena for decades aboard the ISS and uncrewed spacecraft. The resulting data — from FLEX, FLEX-2, SAFFIRE-I, SAFFIRE-II, SPICE, BASS, SLICE, and ACME-BRE — is archived across the NASA Physical Sciences Informatics (PSI) repository and NASA Technical Reports Server (NTRS). However, this knowledge remains:

- Siloed across dozens of separate investigation records with no unified interface
- Difficult to query without specialist database access
- Lacking cross-investigation comparability validation
- Inaccessible to mission architects and safety engineers without deep domain expertise

**Result:** Decades of microgravity fire research cannot be efficiently applied to protect the next generation of crewed missions — Artemis lunar habitats, Mars transit vehicles, and deep-space stations.

---

## 2. NASA Challenge Addressed

**Challenge:** *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*

The challenge asks participants to build tools that make NASA's microgravity combustion research more accessible, queryable, and actionable for spacecraft fire safety decision-making.

IGNIS directly addresses this by:
1. Ingesting and structuring authentic NASA PSI investigation data with full DOI traceability
2. Providing interactive tools to explore, compare, and query that data
3. Enforcing scientific integrity rules that prevent misleading cross-experiment analysis
4. Generating transparent, citation-grounded research intelligence

---

## 3. Proposed Solution

**IGNIS** (Intelligent Guidance for Next-generation In-Space Safety) is a full-stack interactive research intelligence platform that transforms archived NASA microgravity combustion data into an accessible, verifiable, and scientifically rigorous research workspace.

IGNIS ingests **8 verified NASA PSI investigations** (176+ experimental observations) and **NASA NTRS technical publications**, then provides six integrated research tools:

1. **Investigation Explorer** — Deep inspection of each NASA PSI experiment with verified source files and DOI links
2. **AI Research Assistant** — Offline citation-grounded query engine using TF-IDF retrieval over NASA document chunks
3. **Evidence Comparison Workspace** — Cross-investigation analysis with dimensional homogeneity enforcement
4. **Scientific Visualization Dashboard** — Time-series telemetry, scatter plots, distributions, and sensor heatmaps
5. **Evidence Gap Heatmap** — Interactive matrix mapping untested gravity × fuel × atmosphere combinations
6. **Mission Scenario Analyzer** — Hypothetical spacecraft architecture evaluation against indexed experimental data

---

## 4. Target Users

| User Type | Use Case |
|---|---|
| **Aerospace Safety Engineers** | Evaluate spacecraft material flammability data before design certification |
| **Mission Architects (Artemis, Mars)** | Identify relevant fire research leads and known gaps for new habitats |
| **NASA/Academic Researchers** | Cross-reference experimental conditions across multiple PSI investigations |
| **Graduate Students** | Access structured microgravity combustion data for thesis research |
| **Science Communicators** | Explore flame physics in space through interactive visualizations |

---

## 5. Key Features

| Feature | Description |
|---|---|
| **8 NASA PSI Investigations** | FLEX, FLEX-2, SAFFIRE-I, SAFFIRE-II, SPICE, BASS, SLICE, ACME-BRE — all CC0-1.0 |
| **176+ Verified Observations** | Authentic experimental measurements from ISS and Cygnus spacecraft |
| **Offline AI Assistant** | Deterministic TF-IDF retrieval; zero external API keys required |
| **Comparability Engine** | Blocks scientifically invalid cross-experiment quantitative overlays |
| **Transparent Rankings** | 4-factor auditable relevance scoring (Topic 35%, Conditions 30%, Variables 20%, Provenance 15%) |
| **Evidence Gap Map** | 6 gravity regimes × 7 fuel classes × 7 atmosphere conditions |
| **Mission Scenario Analyzer** | Lunar habitat, Mars transit, and ISS electronics rack profiles |
| **29/29 Backend Tests Passing** | Full automated test coverage across all API endpoints |
| **Zero TypeScript Errors** | Clean production build with strict type checking |
| **Dark/Light Mode** | Accessible aerospace-themed workstation UI with onboarding tour |

---

## 6. Expected Real-World Impact

- **Near-Term:** Provides aerospace engineers a structured way to query decades of ISS combustion research that previously required specialist database access, potentially accelerating fire suppression system design for Artemis and commercial stations.
- **Medium-Term:** The evidence gap heatmap directly reveals untested material + gravity combinations, which could inform the prioritisation of future NASA flight experiments.
- **Long-Term:** The platform architecture demonstrates how structured ingestion of PSI data, combined with scientific comparability guardrails, could scale to encompass the entire NASA microgravity combustion research corpus.

> **Disclaimer:** IGNIS is an independent research prototype created for the NASA Space Apps Challenge 2026. It is not an official NASA product, is not certified for operational spacecraft fire suppression decisions, and does not replace qualified engineering analysis.
