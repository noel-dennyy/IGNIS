# IGNIS — Antigravity Master Project Specification

**Project type:** NASA Space Apps Challenge 2026 hackathon prototype  
**Selected challenge:** *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*  
**Official challenge URL:** https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/  
**Working project name:** IGNIS — Intelligent Guidance for Next-generation In-Space Safety  
**Developer:** One-person team  
**Build window:** NASA Space Apps Challenge weekend, 14–15 November 2026  
**Submission deadline:** 15 November 2026, 11:59 PM local time (confirm the deadline displayed on the participant's own project page)

> **Important identity note:** IGNIS is an independent hackathon prototype. It is not a NASA product, is not endorsed by NASA, and must not imply NASA approval. Do not use NASA or Space Apps logos unless the current official branding guide explicitly permits the intended use.

---

# PART A — INSTRUCTIONS FOR THE ANTIGRAVITY AGENT

## A1. Your role

Act as a senior full-stack engineer, scientific-data engineer, product designer, and careful research assistant. Help one student build a polished, working, scientifically responsible hackathon prototype under a very short deadline.

You are expected to inspect the existing workspace, create the application, run it, test it, fix errors, and document how to operate it. Do not merely return code snippets or a tutorial. Make changes in the actual project workspace when tools permit.

## A2. Primary objective

Build **IGNIS**, an interactive scientific-research intelligence dashboard that helps users discover, compare, summarize, rank, and interpret NASA microgravity-combustion research relevant to spacecraft fire safety and future human space exploration.

The selected challenge explicitly asks for an interactive, “super intelligence (SI) powered” dashboard that summarizes, ranks, and interprets microgravity-combustion findings to deliver fire-safety insights for human space exploration.

For a short hackathon prototype, interpret “SI-powered” honestly as an AI-assisted scientific-intelligence workflow using retrieval, structured data, transparent ranking, and source-grounded explanations. **Do not claim that the application is artificial general intelligence, a validated spacecraft fire model, or an operational fire-safety system.**

## A3. Non-negotiable rules

0. **Challenge-specific resource eligibility comes first.** Before selecting the research corpus, open the selected challenge’s official `Resources` tab (`https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/?tab=resources`). The NASA Space Apps Global Organizing Team has stated in its official 2026 community forum that projects seeking Global Awards must use at least one NASA data source listed in the selected challenge’s Resources; additional NASA/partner resources are encouraged. Record the exact resource title and URL in `DATA_AUDIT.md`, then actually use it in the application. Do not assume a generally relevant NASA dataset automatically satisfies this requirement. If the tab is unavailable, ask the participant to inspect it and do not claim Global Awards eligibility until confirmed.

1. **Use authentic NASA research sources.** Never fabricate experiments, measurements, source titles, DOIs, page numbers, units, scientific conclusions, or NASA API endpoints.
2. **Inspect before ingesting.** Open each NASA investigation page, inspect its actual files and metadata, and choose a manageable subset. Do not assume all datasets have the same schema or file format.
3. **Preserve provenance.** Every imported observation or extracted finding must retain its NASA source URL, investigation identifier, file name, DOI when available, page/row/record locator when available, license/usage note, and retrieval date.
4. **Separate observations from interpretations.** Raw measurements, statements made by researchers, AI summaries, and IGNIS-generated hypotheses must be distinct record types and visually labelled.
5. **Never invent missing values.** Use null/unknown/not reported. Do not silently fill values with zero or infer experimental conditions.
6. **Do not make unsafe claims.** The product is a research exploration prototype, not a fire-risk certification, spacecraft-design authority, or emergency-response tool. Never issue operational instructions for spacecraft fire suppression.
7. **Do not compare incomparable experiments.** Different fuels, apparatus, gravity regimes, airflow, pressure, oxygen fractions, scales, and protocols can make measurements non-comparable. Show the conditions and explain limitations.
8. **Make ranking transparent.** Ranking must be “evidence relevance to this query/scenario,” not “fire danger,” “safety score,” or a scientifically validated risk probability. Explain each rank and its component factors.
9. **Cite AI answers.** Every factual answer from the research assistant must cite the retrieved NASA source and page/section/file. If evidence is weak or absent, say so.
10. **No fake live data.** This is a research-library application, not a live spacecraft telemetry system. Clearly label data as archived research and display its observation/experiment date where known.
11. **Build a working vertical slice early.** Prefer one verified experiment, one usable table, one chart, one grounded assistant answer, and a functional end-to-end flow over many unfinished features.
12. **Protect secrets.** Never commit API keys. Use environment variables and `.env.example` with placeholders only.
13. **Do not add needless complexity.** No authentication, microservices, Kubernetes, paid cloud dependency, custom model training, or large-scale data lake unless an actual requirement emerges.
14. **Do not over-download.** Avoid huge video archives and multi-gigabyte raw datasets unless a small subset is essential and can be processed in time.
15. **Keep the application runnable.** After each major change, run the relevant checks and leave exact start commands in the README.

## A4. First actions before coding

1. Inspect the current workspace and installed runtimes (Python, Node, npm).
2. Check whether a project already exists; do not overwrite useful user work.
3. Open the official challenge page and NASA source URLs listed in Part C.
4. Inspect the actual PSI investigation file lists for FLEX, SAFFIRE-I, and SPICE.
5. Record which files are directly downloadable, their size, type, license, and whether they contain usable tabular data or only documentation/media.
6. Choose a small, verifiable starting corpus. Prefer one investigation with a directly accessible structured file plus two or more source documents. Expand only when ingestion is working.
7. Write a short `DATA_AUDIT.md` with the chosen files, reasons, data limitations, and source citations.
8. Then build the application.

If an official data page is temporarily unavailable, do not invent its contents. Use the accessible NASA source documents and mark the unavailable dataset as pending.

## A5. Definition of done

The prototype is complete only when all of these are true:

- A user can open the application in a browser.
- The dashboard loads real, traceable NASA investigation/document metadata.
- A user can browse investigations and view source records.
- A user can search research text and see source citations.
- A user can ask a question and receive an answer grounded in retrieved sources, or a clear “insufficient evidence” response.
- A user can compare selected findings/records without silently mixing incompatible measurements.
- A user can see an explainable evidence-relevance ranking.
- The UI labels research evidence, AI interpretation, and missing evidence separately.
- The app has a clear disclaimer and does not claim operational safety validity.
- There are no fabricated numbers or broken source links in the demo path.
- The README explains setup, run, dataset provenance, AI usage, limitations, and deployment.
- A clean demo path can be completed in under three minutes.

---

# PART B — PRODUCT AND SCIENTIFIC SPECIFICATION

## B1. Problem statement

NASA and its research partners have conducted many combustion experiments in reduced-gravity and microgravity environments. The results are spread across investigation records, scientific papers, reports, tables, images, and other archived files. Finding relevant experiments, understanding their conditions, and comparing the results can take substantial research effort.

This matters because fire behaviour in space can differ from familiar terrestrial behaviour. On Earth, buoyancy causes hot gases to rise and draws cooler air toward a flame. In microgravity, buoyancy-driven flow is greatly reduced; some low-momentum flames can become rounded or nearly spherical. Spacecraft fire-safety research informs material selection, fire growth understanding, detection, and suppression research.

**IGNIS product problem:** Give a researcher one place to explore the available evidence, understand what each experiment actually tested, compare only compatible findings, ask source-grounded questions, and identify where the indexed evidence is missing or insufficient.

## B2. Target users

1. **Combustion researcher:** wants to find prior experiments and trace statements back to original papers/data.
2. **Spacecraft systems researcher:** wants to understand which evidence may be relevant to a hypothetical habitat or mission question.
3. **Student/science communicator:** wants a reliable, understandable overview of microgravity-combustion investigations.

## B3. Product promise

“Turn scattered microgravity-combustion research into an explorable, traceable evidence library.”

Do not promise to predict spacecraft fires, certify materials, or replace expert judgement.

## B4. Core workflows

### Workflow 1 — Explore an investigation

1. Open the Command Center.
2. Select FLEX, SAFFIRE-I, SPICE, or another indexed investigation.
3. Read its objective, apparatus/context, gravity regime, and known conditions.
4. Browse its available documents/data files.
5. Open the original NASA record or publication.

### Workflow 2 — Ask a research question

1. Enter a question such as “What did FLEX investigate about gaseous fire suppressants?”
2. Retrieve relevant document passages and structured evidence.
3. Generate a concise answer based only on retrieved material.
4. Show citation cards with investigation, title, page/section, and clickable source.
5. If no reliable evidence is retrieved, state that the indexed corpus does not answer the question.

### Workflow 3 — Compare evidence

1. Select two or more records/findings.
2. Show investigation identity and experimental context first.
3. Compare only shared variables with compatible units and definitions.
4. Highlight non-comparable conditions and missing variables.
5. Never plot unlike measurements on a common scale without a justified conversion.

### Workflow 4 — Mission evidence explorer

1. User describes a hypothetical research scenario (for example, a pressurized lunar-habitat materials question).
2. IGNIS finds related experiments and research findings.
3. IGNIS ranks evidence by documented relevance and coverage.
4. IGNIS highlights known unknowns and missing experimental coverage.
5. Results are labelled as research leads, not a fire-risk prediction or safety recommendation.

## B5. Application modules

### 1. Command Center / Overview

Show:
- Number of indexed investigations.
- Number of source documents.
- Number of structured observations (only when actually ingested).
- Research areas represented.
- Recently added/updated indexed sources.
- A short “How to interpret this evidence” notice.
- A featured scientific insight with an openable source citation.

Every count must come from the database. Do not use hardcoded demo values disguised as real counts. If sample/demo records exist, label them explicitly.

### 2. Investigation Explorer

- Search and filter by investigation, research area, apparatus, fuel/material, measurement type, and source type when those values are actually present.
- Show objective, platform, research area, NASA centre, dates, DOI, license, and project metadata when available.
- List available files and indicate file type/size.
- Show a source/provenance panel.

### 3. Research Library

- Search research-document text.
- Filter by investigation/document/source type.
- Display document title, source, page, extracted text snippet, and citation.
- Allow the user to open the original NASA record/document.

### 4. Evidence Comparison

- Select records/findings to compare.
- Start with side-by-side metadata and context.
- Compare only compatible numeric values; show units and data definitions.
- Provide a warning when experimental conditions differ.
- Use Plotly/Recharts for charts only when data supports a valid comparison.
- Include a “not comparable” explanation rather than forcing a chart.

### 5. IGNIS Research Assistant

- Chat-like research interface.
- Retrieval-augmented answers over indexed NASA documents and structured records.
- Cite each meaningful claim.
- Clicking a citation opens the corresponding source and page/section if available.
- Display retrieval coverage and an “evidence insufficient” status when appropriate.
- Allow a no-LLM fallback: show top matched passages and source cards.

### 6. Mission Evidence Analyzer (stretch goal)

- Let the user create a research scenario using clearly labelled hypothetical inputs.
- Find related investigations and evidence.
- Rank sources by scenario relevance with transparent factors.
- Show known/unknown fields, condition mismatch, and gaps.
- Never produce a numeric fire-safety risk probability, safe/unsafe verdict, or material certification.

---

# PART C — NASA SOURCES AND DATA PLAN

## C1. Official challenge

**Challenge:** Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**URL:** https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/

Official challenge description states:

> NASA has studied how flames and fire behave in microgravity for decades. The accumulated results matter for future Moon and Mars exploration, but the volume makes them difficult to find, compare, and understand. Participants are challenged to create an interactive, SI-powered dashboard that summarizes, ranks, and interprets those findings to deliver fire-safety insights for human space exploration.

Challenge difficulty is listed as **Intermediate** and **Advanced**. Subject area: **Space Exploration**.

### Mandatory check: challenge-specific Resources tab

Open: https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/?tab=resources

The NASA Space Apps Global Organizing Team answered in its official 2026 community forum that, to be eligible for Global Awards, participants must use at least one NASA data source included in the Resources section for their selected challenge. Additional NASA and Space Agency Partner resources are encouraged. Therefore:

- Inspect this challenge’s exact Resources tab before finalizing the dataset list.
- Identify at least one NASA data source from that exact list.
- Actually ingest/use that source in IGNIS; merely listing it is not enough.
- Record the exact title, URL, access date, license, and how IGNIS uses it in `DATA_AUDIT.md`, `README.md`, and the submission data/references fields.
- PSI/FLEX/SAFFIRE/SPICE are excellent research leads, but do not assume a specific PSI source satisfies the challenge-resource requirement until it is confirmed on this challenge’s Resources tab.
- If the official tab cannot be accessed programmatically, ask the participant to open it and copy the listed resources into `DATA_AUDIT.md`; do not claim eligibility until verified.

Official GO Team clarification: https://github.com/nasa/spaceapps/discussions/1849

## C2. Primary source: NASA Physical Sciences Informatics (PSI)

NASA PSI investigation pages are starting points for source metadata, files, publications, versions, and data citation identifiers.

Repository: https://psi.nasa.gov/physci/repo

NASA notes that publicly available NASA-funded PSI data/software collections should be cited using their persistent identifiers (such as DOIs); the investigation page’s “Cite this Investigation” information should be used.

### Investigation 1 — FLEX

- Name: Flame Extinguishment Experiment (FLEX)
- NASA PSI identifier: PSI-69
- URL: https://psi.nasa.gov/physci/repo/data/investigations/PSI-69
- DOI shown on current PSI record: `10.60555/mbq8-0451`
- Research area: Combustion Science
- Sub-research area: Spacecraft Fire Safety
- License displayed on PSI page: CC0-1.0 (verify the actual file/version before reuse)
- Platform: International Space Station
- NASA centre: Glenn Research Center
- Broad objective: investigate liquid-fuel droplet flame behaviour/flammability limits in microgravity, including the effectiveness of gaseous suppressants such as carbon dioxide, helium, and sulfur hexafluoride; the record also describes burning-rate, extinction, radiation, soot, and temperature measurements.
- NASA PSI current record version observed during research: Version 5; updated 6 June 2025.

**Agent instructions:** Inspect file lists and choose a small structured dataset/report first. Do not assume every file is a simple CSV. Verify data fields, units, experimental conditions, and the actual license attached to each downloaded file.

### Investigation 2 — SAFFIRE-I

- Name: Spacecraft Fire Safety Experiment-I (SAFFIRE-I)
- NASA PSI identifier: PSI-98
- URL: https://psi.nasa.gov/physci/repo/data/investigations/PSI-98
- DOI shown on current PSI record: `10.60555/0t15-1z43`
- Research area: Combustion Science
- Sub-research area: Spacecraft Fire, Smoke Distribution
- License displayed on PSI page: CC0-1.0 (verify the actual file/version before reuse)
- Platform: Cygnus cargo vehicle after departure from the ISS; this was an uncrewed spacecraft fire experiment, not an ISS crew-cabin fire test.
- NASA centre: Glenn Research Center
- NASA record describes a large-scale fabric sample and measurements including flame imagery, temperatures, radiation, pressure, carbon dioxide/oxygen fractions, and airflow velocity.
- NASA PSI current record version observed during research: Version 4; updated 3 June 2025.

**Agent instructions:** This record includes many files (the search result showed 74 files added in the current version). Inspect file sizes and types. Start from metadata, reports, engineering documents, and manageable sample/derived tables. Avoid pulling every raw image/video file.

### Investigation 3 — SPICE

- Name: Smoke Point in Co-flow Experiment (SPICE)
- NASA PSI identifier: PSI-107
- URL: https://psi.nasa.gov/physci/repo/data/investigations/PSI-107
- DOI shown on current PSI record: `10.60555/9kbh-e962`
- Research area: Combustion Science
- Sub-research area: Fire Safety
- License displayed on PSI page: CC0-1.0 (verify the actual file/version before reuse)
- Objective: study laminar smoke-point properties of non-buoyant jet diffusion flames under co-flow conditions, including effects of burner diameter and co-flow velocity on luminous flame length and smoke point.
- PSI page search result displayed a total record size of approximately 6.47 GB. Treat this as potentially too large for the hackathon; do not download the full investigation.

**Agent instructions:** Use SPICE initially as a metadata/publication source unless a small, clearly relevant data file is available. Do not attempt to download the full 6.47 GB collection.

## C3. Broader NASA combustion-science context

NASA overview article: https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/

This NASA article describes work across multiple investigations, including:
- FLEX / FLEX-2 (droplet combustion/extinguishment)
- ACME investigations
- Burning and Suppression of Solids (BASS / BASS-II)
- Spacecraft Fire Experiments (Saffire series)
- SoFIE material flammability research
- Confined Combustion
- Other related investigations

Use this overview as scientific context and as a way to discover additional investigation records. Do not treat the overview article itself as a substitute for the underlying experiment data.

## C4. Additional discovery resources

- NASA Physical Sciences Informatics: https://psi.nasa.gov/physci/repo
- NASA Glenn Combustion Science overview: https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/
- NASA Technical Reports Server (NTRS): https://ntrs.nasa.gov/
- NASA Science article on combustion/fire safety: https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/
- NASA PSI on AWS registry listing: https://registry.opendata.aws/nasa-psi/
- AWS bucket mentioned in the registry: `s3://nasa-psi/` in `us-west-2`; public listing example: `aws s3 ls --no-sign-request s3://nasa-psi/`

**Important qualification:** The AWS registry page does not establish that every PSI investigation file is mirrored in that bucket. Inspect bucket contents and use it only when a matching resource is actually present.

## C5. Data acquisition process

Implement a reproducible ingestion workflow:

1. Visit the investigation record.
2. Capture title, PSI identifier, DOI, version, update date, objective, research area, platform, NASA centre, and license text.
3. Inspect all listed files and categorize them: metadata, report, science document, presentation, raw data, engineering document, reference data, image/video.
4. Record file name, size, date, download URL, content type, and whether it is accessible.
5. Prioritize small CSV/TSV/XLSX/JSON files, metadata, scientific reports, and documentation.
6. Download only the files needed for the MVP.
7. Calculate a SHA-256 checksum for every downloaded file.
8. Preserve originals under `data/raw/` without modifying them.
9. Parse copies into `data/processed/`.
10. Store source and transformation provenance.
11. Keep an ingestion log; failed parsing must be reported, not silently ignored.

Do not use generic web-scraping assumptions if the PSI portal uses dynamic content. A manual source-manifest file is acceptable for a hackathon if it is accurate and reproducible.

## C6. Suggested source manifest

Create `data/source_manifest.csv` with at least:

- `source_id`
- `investigation_id`
- `title`
- `doi`
- `source_page_url`
- `file_name`
- `file_url`
- `file_type`
- `file_size_bytes`
- `license`
- `retrieved_at_utc`
- `sha256`
- `ingestion_status`
- `notes`

## C7. Scientific caveats to explain in the UI

- Microgravity, reduced gravity, and lunar gravity are not interchangeable.
- The ISS microgravity environment is not equivalent to lunar surface gravity or Mars gravity.
- FLEX droplet experiments, SAFFIRE large-scale solid-fuel tests, and SPICE co-flow diffusion-flame tests have different apparatus, fuels/materials, geometries, and purposes.
- A measured temperature, flame length, extinction event, or smoke point has meaning only with its experimental context and unit.
- Absence of a result from IGNIS’s indexed corpus does not prove that NASA has never studied it.
- AI summaries are not peer review and must be traceable to the original source.

---

# PART D — DATA MODEL AND SCIENTIFIC INTEGRITY

## D1. Use separate entities

Do not place every kind of information into one generic “experiment” table. Recommended entities:

### `investigations`

- `id` (internal primary key)
- `external_id` (e.g. PSI-69)
- `name`
- `description`
- `research_area`
- `subresearch_area`
- `platform`
- `nasa_center`
- `start_date` / `end_date` (nullable)
- `doi`
- `license`
- `source_url`
- `source_version`
- `source_updated_at`

### `source_files`

- `id`
- `investigation_id`
- `title`
- `file_name`
- `file_type`
- `file_size_bytes`
- `source_url`
- `local_path`
- `license`
- `sha256`
- `retrieved_at`
- `parse_status`

### `documents`

- `id`
- `investigation_id` (nullable for broader source)
- `source_file_id`
- `title`
- `authors` (nullable)
- `publication_date` (nullable)
- `doi` (nullable)
- `source_url`
- `document_type`

### `document_chunks`

- `id`
- `document_id`
- `page_number` (nullable)
- `section_heading` (nullable)
- `chunk_index`
- `text`
- `token_or_word_count`
- `embedding_ref` (nullable)

### `observations`

Each row should represent one clearly defined measurement or observation. Fields:
- `id`
- `investigation_id`
- `source_file_id`
- `record_locator` (row, sheet, table, record ID, etc.)
- `experiment_run_id` (nullable)
- `measurement_name`
- `value_numeric` (nullable)
- `value_text` (nullable)
- `unit` (nullable)
- `fuel_or_material` (nullable)
- `gravity_regime` (nullable)
- `oxygen_fraction` (nullable)
- `pressure_value` / `pressure_unit` (nullable)
- `flow_value` / `flow_unit` (nullable)
- `temperature_value` / `temperature_unit` (nullable)
- `suppressant` (nullable)
- `outcome_label` (nullable)
- `observation_time_or_order` (nullable)
- `raw_metadata_json`

Only populate fields present in source data or explicitly defined by a well-documented transformation.

### `research_findings`

A finding extracted from a publication/report, not a raw observation:
- `id`
- `investigation_id` (nullable)
- `document_id`
- `page_number` / `section_heading`
- `finding_text`
- `finding_type` (reported result, interpretation, limitation, hypothesis, method)
- `extraction_method` (manual/AI-assisted)
- `review_status` (unreviewed/verified/needs-review)
- `created_at`

### `ranking_runs` (optional)

Store query/scenario, factors, weights, ranked evidence IDs, and explanation so that a score can be reproduced.

## D2. Units and normalization

- Preserve the original value and original unit.
- Add normalized values only when the conversion is unambiguous and documented.
- Store original and normalized unit fields separately.
- Do not normalize a vague or dimensionally ambiguous quantity.
- Keep Celsius/Kelvin, pressure units, velocity units, length units, and concentration definitions explicit.
- Do not assume oxygen fraction is percent by volume unless the source states it.
- Do not assume “flow” always refers to the same physical flow variable.

## D3. Evidence classes

Use these labels throughout the interface:

1. **Measured observation** — value/record present in an experimental data file.
2. **Published finding** — statement reported in a NASA/peer-reviewed research document.
3. **IGNIS summary** — generated synthesis of cited source material.
4. **IGNIS inference** — a clearly labelled system-generated interpretation from multiple records.
5. **Evidence gap** — no relevant supporting item found in the indexed subset.

Do not blur these categories.

---

# PART E — TRANSPARENT RANKING AND ANALYSIS

## E1. What the ranking means

The challenge asks the dashboard to rank findings. IGNIS should rank **how relevant a source/finding is to a user's question or research scenario**, not how dangerous a fire is or how safe a spacecraft is.

Use an explainable evidence relevance score only if enough metadata exists. Otherwise use ranked tiers (High / Medium / Low relevance) with explicit reasons.

## E2. Proposed prototype relevance factors

A configurable example model:

- Query/topic relevance: 35%
- Experimental-condition match: 30%
- Required-variable coverage: 20%
- Provenance/completeness: 15%

These are prototype product weights, **not NASA-approved weights and not a scientific standard**. Display them to the user. Make the score unavailable if the required metadata is missing rather than pretending to calculate it.

Each ranked card must explain:
- Which topic terms matched.
- Which experimental conditions matched.
- Which requested variables were present/missing.
- Which source and page support the result.
- Which conditions differ from the scenario.

## E3. Evidence completeness

Possible status labels:
- `Documented` — supporting source directly reports the condition/result.
- `Partially documented` — some relevant information exists but required fields are missing.
- `Not found in indexed corpus` — no matching information was found in IGNIS’s current indexed sources.
- `Not comparable` — data exists but the comparison is not methodologically justified.

Do not display “No NASA evidence exists” when the actual claim is only that no indexed match was found.

## E4. Comparability rules

Before charting values, check:
- Same measurement definition?
- Same units or valid conversion?
- Same or sufficiently similar experimental apparatus?
- Same fuel/material or explicit reason for comparison?
- Comparable gravity regime?
- Comparable pressure/oxygen/flow conditions?
- Similar measurement method and calibration context?

If any critical compatibility condition fails, show a side-by-side contextual comparison with a warning instead of a quantitative overlay.

---

# PART F — TECHNICAL ARCHITECTURE

## F1. Recommended stack

### Frontend
- React + Vite
- TypeScript preferred for reliable interfaces; JavaScript acceptable if it accelerates delivery.
- Tailwind CSS (use the version/setup supported by the installed package; check current official installation docs rather than mixing v3/v4 instructions).
- Recharts or Plotly for charts.
- Lucide icons.
- React Router if multiple routes are used.

### Backend
- Python 3.11+ (use installed compatible version)
- FastAPI
- Pydantic
- SQLAlchemy or SQLModel
- SQLite for hackathon persistence
- Pandas and NumPy
- PyMuPDF for PDF text extraction
- `python-multipart` only if file upload is implemented
- scikit-learn for TF-IDF retrieval fallback
- pytest and httpx for tests

### AI / retrieval

MVP:
- Text extraction + paragraph/page-aware chunks.
- TF-IDF/BM25-like lexical retrieval using scikit-learn (or a simple ranking implementation).
- Optional LLM provider behind a service interface.
- Prompt that only uses retrieved evidence and returns citations.

Stretch:
- Embedding model + local vector index or ChromaDB/FAISS.
- Reranking.
- Structured output validation.

Do not make a paid external LLM mandatory. The app must remain demonstrable without an API key by showing retrieved passages and their sources.

## F2. Suggested repository structure

```text
ignis/
├── README.md
├── DATA_AUDIT.md
├── .gitignore
├── .env.example
├── data/
│   ├── raw/                 # downloaded originals; do not modify
│   ├── processed/           # parsed outputs
│   └── source_manifest.csv
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── routers/
│   │   │   ├── health.py
│   │   │   ├── investigations.py
│   │   │   ├── documents.py
│   │   │   ├── search.py
│   │   │   ├── analytics.py
│   │   │   ├── compare.py
│   │   │   └── assistant.py
│   │   └── services/
│   │       ├── ingest.py
│   │       ├── pdf_extractor.py
│   │       ├── tabular_parser.py
│   │       ├── retrieval.py
│   │       ├── ranking.py
│   │       ├── comparison.py
│   │       ├── llm_provider.py
│   │       └── provenance.py
│   ├── tests/
│   ├── requirements.txt
│   └── run.py (optional)
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/client.ts
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── types/
│       └── styles/
└── docs/
    ├── architecture.md
    ├── scientific-method.md
    └── demo-script.md
```

The agent may simplify this structure if it can preserve separation of concerns and deliver faster.

## F3. Backend API contract

Create the following endpoints. Use typed Pydantic request/response models and consistent error responses.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check, app/version, DB readiness |
| GET | `/api/overview` | Counts derived from ingested DB records |
| GET | `/api/investigations` | List/filter investigations |
| GET | `/api/investigations/{id}` | Investigation detail and files |
| GET | `/api/documents` | List/filter documents |
| GET | `/api/documents/{id}` | Document metadata and source link |
| GET | `/api/search?q=...` | Search indexed documents/findings |
| GET | `/api/findings` | List/filter published findings |
| GET | `/api/observations` | List/filter structured observations |
| POST | `/api/compare` | Validate and compare selected records |
| POST | `/api/rank` | Rank evidence for a query/scenario; include explanations |
| POST | `/api/assistant/ask` | Retrieve evidence and generate grounded answer |
| GET | `/api/sources/{id}` | Resolve source/provenance record |

Suggested assistant request:

```json
{
  "question": "What did FLEX investigate about gaseous fire suppressants?",
  "investigation_ids": ["PSI-69"],
  "top_k": 5
}
```

Suggested assistant response:

```json
{
  "answer": "Answer based only on retrieved material...",
  "status": "answered",
  "citations": [
    {
      "investigation_id": "PSI-69",
      "document_title": "Source title as stored",
      "page": 3,
      "section": "Section if known",
      "excerpt": "Short supporting excerpt...",
      "source_url": "https://..."
    }
  ],
  "limitations": ["The indexed corpus does not contain ..."],
  "retrieval_method": "tfidf"
}
```

Use actual IDs and source titles from ingestion; the JSON above is only a response shape example.

## F4. Frontend visual direction

Create a premium but restrained scientific interface. It should resemble a research workstation, not a generic AI landing page.

Suggested palette:
- Main background: `#080D18`
- Surface: `#111827`
- Elevated surface: `#182235`
- Primary accent: `#38BDF8`
- Secondary accent: `#A78BFA`
- Caution: `#F59E0B`
- Error: `#EF4444`
- Text: `#E5E7EB`
- Muted text: `#94A3B8`

Design guidance:
- Clear left navigation: Overview, Investigations, Research Library, Compare, AI Assistant, Mission Evidence.
- Consistent typography and spacing.
- Strong hierarchy; avoid tiny text.
- Use data tables with filters and empty states.
- Use skeleton/loading states and actionable error messages.
- Show visible “archived research” and “prototype / not operational safety advice” notices.
- Source citations should be obvious and clickable.
- Avoid gratuitous animated flames, fake telemetry, fake warning counters, or made-up mission control numbers.
- Responsive enough for a laptop and a common mobile browser.

## F5. Example environment variables

`.env.example` only:

```env
APP_ENV=development
DATABASE_URL=sqlite:///./ignis.db
CORS_ORIGINS=http://localhost:5173
LLM_PROVIDER=none
LLM_API_KEY=
LLM_MODEL=
```

Never put a real key in source control or client-side JavaScript. Keep provider integration in backend only.

## F6. Local development commands

The agent must adapt commands to the actual OS/shell and package versions found in the workspace. For Windows PowerShell, suggested starting point:

```powershell
# In project root
mkdir backend, frontend, data -ErrorAction SilentlyContinue

# Backend environment
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install fastapi uvicorn[standard] pydantic pydantic-settings sqlalchemy pandas numpy pymupdf scikit-learn pytest httpx

# Start backend from backend folder
uvicorn app.main:app --reload
```

Frontend setup from project root:

```powershell
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install axios react-router-dom lucide-react recharts
```

Install and configure Tailwind according to the currently installed Tailwind major version. Do not blindly paste older Tailwind setup instructions.

---

# PART G — AI RESEARCH ASSISTANT SPECIFICATION

## G1. Retrieval pipeline

1. Extract PDF text page by page; preserve page numbers.
2. Extract tables separately where possible; preserve table captions, headers, units, and source page.
3. Split text into chunks around 400–800 words (or a suitable token count), with modest overlap. Avoid splitting a table row from its headers.
4. Store each chunk with document ID, investigation ID, page, section, title, source URL, and retrieval metadata.
5. Retrieve top-k relevant chunks for user question.
6. Optionally rerank chunks.
7. Pass only selected evidence to the LLM.
8. Ask the LLM to return a structured response with citations and limitations.
9. Validate every citation ID against the retrieved chunk IDs. Reject citations to nonexistent sources.
10. If retrieval confidence is low or no source is relevant, return “I could not find enough evidence in the currently indexed sources.”

## G2. System prompt for the LLM

Use a backend-only system instruction similar to:

```text
You are IGNIS, an AI-assisted research navigator for archived NASA
microgravity-combustion and spacecraft-fire-safety research.

You are NOT NASA, not a NASA employee, not a certified fire-safety
engineer, and not an operational spacecraft safety system.

Use only the source excerpts and structured facts supplied in the current
request. Do not use unsupported prior knowledge to fill gaps.

Rules:
1. Never invent measurements, units, experiment results, authors, DOIs,
   source titles, pages, or NASA conclusions.
2. Distinguish a measured observation from a paper's interpretation,
   hypothesis, and your own synthesis.
3. Cite factual claims with the supplied source ID and page/section.
4. State when two experiments use different apparatus, fuels/materials,
   gravity regimes, pressures, flows, or methods.
5. Do not combine incompatible measurements or compare them as if they
   were controlled experiments.
6. Do not turn missing data into zero or a negative result.
7. If the supplied evidence is insufficient, say so clearly and name
   what information would be needed.
8. Do not produce a fire-danger probability, spacecraft certification,
   operational suppression procedure, or guarantee of safety.
9. Keep conclusions cautious, concise, and understandable.
10. Return machine-readable JSON matching the required response schema.
```

## G3. Example demo questions

- What was the main objective of the FLEX investigation?
- Which gaseous suppressants does the FLEX investigation record mention?
- What materials and measurement systems were used in SAFFIRE-I?
- What does SPICE investigate about co-flow conditions and smoke points?
- Why can flame behaviour in microgravity differ from behaviour on Earth?
- What are the major differences between FLEX, SAFFIRE-I, and SPICE?
- What information would be required before comparing two flame-spread measurements?
- What evidence in the currently indexed material is relevant to a hypothetical lunar-habitat fire research question?

For the final question, the expected answer should identify both relevant evidence and important gaps, not make a lunar habitat safety prediction.

---

# PART H — BUILD PRIORITIES AND HACKATHON EXECUTION PLAN

## H1. Priority tiers

### Tier 0 — Must work

- Ingest and cite a small set of real NASA PSI sources.
- Investigation Explorer.
- Searchable Research Library.
- Grounded assistant with source citations OR reliable retrieval-only fallback.
- Functional Overview page with database-derived counts.
- README, source manifest, disclaimer, and working demo.

### Tier 1 — Strong differentiators

- Evidence relevance ranking with transparent factors.
- Validated side-by-side experiment comparison.
- Evidence gap reporting.
- Clear distinction between measured data and published findings.

### Tier 2 — Only if time remains

- Mission Evidence scenario builder.
- Semantic embeddings/vector search.
- Advanced charts.
- More investigations (BASS, BASS-II, ACME, SoFIE, Saffire series).
- Exportable evidence report.

Do not start Tier 2 while Tier 0 is broken.

## H2. Suggested one-person sprint

Adapt to actual remaining time. Work in this order, not necessarily these exact durations:

1. **Workspace + source audit:** inspect challenge, check NASA PSI pages, choose accessible files, create `DATA_AUDIT.md`.
2. **First data slice:** download a small number of source files; create manifest; parse a document and a structured file if available.
3. **Database + API:** persist investigations, source files, documents, chunks, findings, and any actual observations.
4. **Working UI:** create navigation, Overview, Investigation Explorer, and Research Library.
5. **Search and citations:** implement lexical retrieval and citation resolution.
6. **AI integration:** add optional LLM summarization; preserve no-key fallback.
7. **Ranking and comparison:** add explainable relevance ranking and comparison validation.
8. **Polish:** verify source links, empty states, responsive layout, error handling, data labels.
9. **Demo + submission:** record a short focused demonstration, update README, fill official project form, submit before deadline.

## H3. Time management guardrails

- Reserve the final 2–3 hours for testing, recording, project description, links, and submission.
- Do not begin a new major feature in the final hours.
- If a NASA download is too large or blocked, choose a smaller accessible file and document the limitation.
- If an LLM API is unavailable, demonstrate retrieval, source excerpts, and comparison instead.
- If no reliable numeric dataset is available, do not fake charts. Make document discovery, evidence summaries, and citations the centerpiece.
- Submit a functioning smaller system rather than an unfinished ambitious system.

---

# PART I — TESTING AND ACCEPTANCE CHECKLIST

## I1. Data tests

- [ ] NASA source page is recorded for every investigation.
- [ ] DOI, version, and license are stored when available.
- [ ] Downloaded original file is preserved.
- [ ] File checksum is recorded.
- [ ] Parsing failures are logged.
- [ ] Missing fields remain null/unknown.
- [ ] Units are preserved and displayed.
- [ ] Page/table/row locator is retained.
- [ ] No illustrative data is displayed as NASA data.

## I2. API tests

- [ ] Health endpoint returns healthy status.
- [ ] Overview counts match the database.
- [ ] Investigation list and detail work.
- [ ] Search returns matched snippets and provenance.
- [ ] Assistant responses cite existing source IDs only.
- [ ] Unsupported queries return an insufficient-evidence response.
- [ ] Comparison rejects incompatible or insufficient data.
- [ ] Ranking exposes factors and limitations.

## I3. UI tests

- [ ] App loads without console-breaking errors.
- [ ] Navigation works.
- [ ] Empty/loading/error states are readable.
- [ ] Search and filters work.
- [ ] Source links open correctly.
- [ ] Data tables are legible.
- [ ] Charts show correct labels, values, and units.
- [ ] Mobile layout does not hide core actions.
- [ ] Safety/disclaimer notice is visible.

## I4. Scientific review

- [ ] No “microgravity = lunar gravity” claim.
- [ ] FLEX, SAFFIRE-I, and SPICE are described as different investigations.
- [ ] No unsupported cross-experiment comparisons.
- [ ] AI output is labelled as AI-generated synthesis.
- [ ] Evidence gaps refer to the indexed corpus, not all of NASA's research.
- [ ] No safety score or fire probability is presented as validated.

---

# PART J — DEPLOYMENT, DOCUMENTATION, AND SUBMISSION

## J1. Deployment strategy

Local working demo is mandatory; cloud deployment is desirable if time permits.

Possible arrangement:
- Frontend: Vercel or another static frontend host.
- Backend: a Python-compatible application host.
- Database: SQLite for local demo; for hosted persistence, use an appropriate managed database or ensure the chosen host provides persistent storage.

Do not assume a hosting provider's free tier, current limits, or persistence behaviour. Verify current platform terms before choosing. If deployment is unstable, submit a robust local demo video and accessible source repository as permitted by the current submission guide.

Before public deployment:
- Set CORS to the exact production frontend origin.
- Keep secrets backend-only.
- Disable debug mode.
- Avoid exposing local raw data unnecessarily.
- Test source links from a private/incognito browser.

## J2. README must contain

1. Project overview and challenge chosen.
2. Problem statement and intended users.
3. Features actually implemented (not planned features).
4. Architecture diagram.
5. Technology stack.
6. Setup and run commands for Windows and/or cross-platform shell.
7. NASA datasets, investigation identifiers, DOI links, licenses, and data-use notes.
8. Data-processing methodology and schema.
9. Ranking method and its limitations.
10. AI/RAG method and model/provider disclosure.
11. Scientific limitations and safety disclaimer.
12. Screenshots/demo link.
13. Known limitations and future work.
14. Attribution and acknowledgements.

## J3. Demo narrative

Aim for a concise, coherent demo. If the official submission guide permits a video, keep within its required duration; if it permits slides, comply with slide count. The exact 2026 Project Submission Guide takes precedence over older advice or community forum replies.

Suggested live-demo path:
1. Introduce the challenge: microgravity fire research is substantial but hard to discover and compare.
2. Open IGNIS Overview and show real indexed-source counts.
3. Open FLEX and show its NASA source/DOI and objective.
4. Open SAFFIRE-I and show its different apparatus/context.
5. Ask a focused question in the research assistant and open a citation.
6. Compare two evidence records, including a warning if conditions differ.
7. Show the evidence-gap/relevance explanation.
8. End by explaining how this helps research discovery without claiming spacecraft safety certification.

## J4. Official submission details to verify

Official 2026 Space Apps page: https://www.spaceappschallenge.org/2026/  
Official resources page: https://www.spaceappschallenge.org/resources/  
Official brand guide: https://www.spaceappschallenge.org/brand/

The official 2026 event page states:
- Hackathon dates: 14–15 November 2026.
- Project submission opens 14 November at 9:00 AM local time.
- Project submission closes 15 November at 11:59 PM local time.
- Submission is through the Project tab on the participant’s Team page.
- A project must be submitted to receive a participant certificate and be eligible for Global Judging.
- Teams may have no more than six participants; an individual participant can work alone.

A NASA Space Apps support-team response in the official community forum described a demo as either a video of 30 seconds or less or a deck of up to seven slides, and advised that project details identify NASA data/resources and AI tools used. **Treat the published 2026 Project Submission Guide on the official Resources page as the controlling source**; verify the fields and media limits before final submission.

### AI tool disclosure and generated media rules

The NASA Space Apps Global Organizing Team stated in its official 2026 community forum that AI tools are permitted, but participants must clearly indicate where and how they used them. The response specifies:

- AI-generated images and videos must be visibly watermarked as AI-generated.
- AI-generated audio must be acknowledged in descriptive text and metadata.
- AI-generated code and data must be acknowledged in the project description/metadata.
- Generated content may not use, contain, or modify NASA branding/design elements such as NASA logos, flags, or mission identifiers.
- Originality, intent, and execution remain important in judging AI-assisted work.

Create `AI_USAGE.md` and disclose Antigravity (and its underlying model if known), ChatGPT/OpenAI if used, any LLM provider used in IGNIS, and any image/audio/video generation tool. Describe exactly what each tool contributed. Do not claim code/data were manually authored if an AI agent generated them. Prefer original UI graphics or properly licensed non-AI assets; if AI-generated imagery/video is used, add the required visible AI-generated label.

Official GO Team clarification: https://github.com/nasa/spaceapps/discussions/1849

## J5. Judging alignment

The official Space Apps evaluation framework identifies five core criteria:

- **Impact:** Is the problem meaningful and can the solution make a difference?
- **Creativity:** Is the approach thoughtful and original?
- **Validity:** Is the technical/scientific basis credible and feasible?
- **Relevance:** Does it directly address the selected challenge?
- **Presentation:** Can the team communicate the work clearly?

Design the project to show evidence for all five. Do not assume a visually attractive UI compensates for weak science or a weak connection to the challenge.

Suggested evidence to demonstrate:
- Impact: makes NASA research more discoverable and interpretable for future space-fire research.
- Creativity: source-grounded retrieval + transparent evidence ranking + gap identification.
- Validity: original sources, DOI citations, verified units, no fake values, careful comparability rules.
- Relevance: directly summarizes, ranks, and interprets microgravity combustion findings.
- Presentation: crisp UI, reproducible demo, short story, clickable sources.

---

# PART K — IMMEDIATE EXECUTION ORDER FOR ANTIGRAVITY

Execute this sequence now:

1. Inspect the workspace; report Python/Node versions and existing files.
2. Read the official challenge page and source pages listed above.
3. Inspect PSI-69, PSI-98, and PSI-107 file lists and choose a realistic starter corpus.
4. Inspect the challenge-specific Resources tab and satisfy the required NASA data-source requirement before implementing data features.
5. Write `DATA_AUDIT.md` and `AI_USAGE.md` before the final submission.
5. Scaffold backend and frontend.
6. Implement database models and ingestion for the chosen files.
7. Build the first working vertical slice: real investigation metadata → database → API → React investigation detail page.
8. Add source-grounded document search and citations.
9. Add optional LLM summarization with a no-key fallback.
10. Add transparent evidence ranking and validated comparison.
11. Implement the remaining UI pages only after the vertical slice works.
12. Run backend tests, frontend build, and manual browser checks.
13. Create README, demo script, AI/data attribution notes, and a submission checklist.
14. At each checkpoint, report what is actually implemented, what is unverified, and the next highest-value task.

**Do not stop after producing a plan. Build the working application in the workspace.** If a download or integration is blocked, implement a robust fallback and clearly report the limitation rather than fabricating the data.

---

# PART L — SOURCE REGISTER

Use these links as the starting point and record the date accessed in the project’s source manifest.

1. NASA Space Apps 2026 official event: https://www.spaceappschallenge.org/2026/
2. Official challenge — Flame in Freefall: https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/
3. NASA PSI repository: https://psi.nasa.gov/physci/repo
4. FLEX / PSI-69: https://psi.nasa.gov/physci/repo/data/investigations/PSI-69
5. SAFFIRE-I / PSI-98: https://psi.nasa.gov/physci/repo/data/investigations/PSI-98
6. SPICE / PSI-107: https://psi.nasa.gov/physci/repo/data/investigations/PSI-107
7. NASA — Studying Combustion and Fire Safety: https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/
8. NASA Glenn — Combustion Science: https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/
9. NASA Technical Reports Server: https://ntrs.nasa.gov/
10. NASA PSI AWS registry entry: https://registry.opendata.aws/nasa-psi/
11. Official Space Apps resources / participant guides: https://www.spaceappschallenge.org/resources/
12. Official Space Apps brand guide: https://www.spaceappschallenge.org/brand/
13. Official 2026 Space Apps community forum: https://github.com/nasa/spaceapps/discussions

**Citation requirement:** The project itself must cite original NASA investigation pages and source documents, not merely this handoff file. Use the current version/DOI displayed by the actual NASA source at the time of ingestion.
