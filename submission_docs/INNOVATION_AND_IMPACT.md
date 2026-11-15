# IGNIS — Innovation and Impact Statement
## NASA Space Apps Challenge 2026

---

## 1. What Makes IGNIS Innovative?

### Scientific Integrity as a Core Design Principle
Most research dashboards display whatever data is available without validating physical compatibility. IGNIS implements a **Comparability Engine** that actively blocks scientifically invalid analyses. When a user attempts to compare droplet burning rates (mm²/s) against solid flame spread rates (mm/s), IGNIS refuses the overlay and explains the dimensional incompatibility with a full variable-by-variable breakdown.

This is not a warning tooltip — it is an enforced scientific constraint built into the backend comparison service. This kind of hard scientific guardrail is rare in hackathon tools and essential for responsible scientific instrumentation.

### Offline-First Citation-Grounded AI
The IGNIS Research Assistant operates entirely offline using deterministic TF-IDF retrieval over indexed NASA document chunks. No external API keys, no cloud dependency, no hallucination risk from generative models. Every claim in the assistant's answer is backed by a retrievable source passage with document title, page number, and DOI link. When no evidence exists in the corpus, the system explicitly says so and names the missing knowledge terms.

### Evidence Gap Visualization
Rather than only showing what NASA knows, IGNIS maps **what NASA does not yet know** — a 6 × 7 × 7 matrix (294 theoretical combinations of gravity × fuel × atmosphere) that reveals critical research frontiers. Electrical wire insulation — a critical material in every spacecraft — has never been tested in a microgravity combustion experiment in the indexed corpus. IGNIS makes this gap immediately visible and actionable.

### Multi-Regime Scientific Architecture with 8 Investigations
IGNIS ingests **four distinct physical combustion regimes** across eight investigations:
- Liquid droplet combustion (FLEX, FLEX-2)
- Large-scale solid material flammability (SAFFIRE-I, SAFFIRE-II, BASS)
- Laminar gas jet diffusion flames (SPICE, SLICE)
- Condensed-phase burning rate emulation (ACME-BRE)

This mirrors how published NASA microgravity combustion science is actually organized, maintaining strict physical separation between regimes while enabling intra-regime comparison.

### Transparent Relevance Ranking
Instead of a black-box AI score, IGNIS computes evidence relevance using a fully auditable 4-factor model with explicit per-factor breakdowns. Users can see exactly why one investigation ranked above another and what conditions were matched or missed.

---

## 2. How Does IGNIS Utilize NASA Data?

IGNIS uses 8 primary NASA PSI investigations and NASA NTRS technical publications as its foundational data layer.

| NASA Data Usage | Detail |
|---|---|
| **Direct Ingestion** | 17 raw NASA PSI data files (JSON metadata + CSV measurements) in a normalized SQLite database |
| **DOI Verification** | Every investigation linked to its persistent NASA DOI |
| **Source Traceability** | SHA-256 checksums stored in `source_manifest.csv` for every ingested file |
| **CC0-1.0 Compliance** | All NASA PSI data used under the CC0-1.0 public domain license |
| **Document Retrieval** | NASA NTRS papers chunked at paragraph level for TF-IDF retrieval |
| **Citation Links** | Every assistant answer links back to the original NASA PSI record or NTRS publication |

The platform never fabricates experimental measurements, never imputes missing values with zero, and never generates claims not grounded in the indexed NASA corpus.

---

## 3. What Real-World Problem Does IGNIS Solve?

### The Knowledge Access Problem
A spacecraft designer evaluating fire suppression systems for a lunar habitat must currently:
- Navigate the NASA PSI web portal manually
- Download raw data files and parse CSV/JSON formats
- Cross-reference multiple technical reports
- Manually verify dimensional compatibility before comparing experiments
- Search NTRS for relevant papers without semantic context

IGNIS compresses this process from days of expert manual work into minutes of interactive exploration.

### The Comparability Problem
Without automated enforcement, researchers risk combining incompatible measurements. Plotting FLEX droplet burning rates (mm²/s) alongside SAFFIRE solid flame spread rates (mm/s) on the same axis would appear to show a valid comparison — but it represents a fundamental physical error that could lead to incorrect safety conclusions. IGNIS catches and blocks this automatically.

### The Gap Identification Problem
Before IGNIS, identifying what microgravity combustion research is *missing* required reading dozens of papers. The Evidence Gap Heatmap makes gaps immediately visible, enabling informed decisions about future NASA experiment prioritization.

---

## 4. Who Benefits from This Solution?

| Beneficiary | Specific Benefit |
|---|---|
| **NASA Engineers & Scientists** | Faster cross-investigation literature synthesis with built-in validity checks |
| **Artemis Mission Planners** | Identification of relevant fire safety research for pressurized lunar habitat design |
| **Mars Mission Architects** | Explicit flagging of microgravity-to-partial-gravity extrapolation limits |
| **Commercial Space Sector** | Accessible structured access to NASA's open-license combustion dataset |
| **University Researchers** | Structured entry point for graduate-level microgravity combustion research |
| **Future NASA Experiment Teams** | Evidence gap map as a data-driven rationale for new flight experiment proposals |

---

## 5. Potential Future Applications

| Extension | Description |
|---|---|
| **Full PSI Corpus Ingestion** | Expand from 8 to all ~200+ NASA PSI investigations across all physical science domains |
| **Semantic Search Upgrade** | Replace TF-IDF retrieval with sentence-transformer embeddings for improved recall |
| **Live PSI API Integration** | Real-time synchronization with NASA PSI repository as new investigation versions are published |
| **Partial-Gravity Scaling Models** | Add validated aerothermal scaling equations to bridge ISS microgravity data to lunar/Martian surface conditions |
| **Collaborative Annotation** | Allow research teams to annotate observations and tag evidence gaps collaboratively |
| **Material Flammability Prediction** | Train regression models on BASS/SAFFIRE data to estimate flammability limits for new spacecraft materials |
| **Export to Safety Documentation** | Generate structured evidence summaries in formats compatible with NASA safety review boards |
