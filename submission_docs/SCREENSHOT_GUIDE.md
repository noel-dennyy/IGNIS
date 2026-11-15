# IGNIS — Screenshot Capture Guide
## NASA Space Apps Challenge 2026

---

## PREPARATION

Before capturing screenshots:
- [ ] Backend running: `uvicorn app.main:app --host 127.0.0.1 --port 8000`
- [ ] Frontend running: `npm run dev` → `http://localhost:5173`
- [ ] Dark mode enabled (default)
- [ ] Browser window: 1920×1080 or 1440×900
- [ ] Wait for all API data to load before capturing

---

## SCREENSHOT 1 — Landing Page Hero

**URL:** `http://localhost:5173/`
**Filename:** `01_landing_page_hero.png`
**What to show:** Cinematic landing page with flame animation canvas, the headline "UNDERSTANDING FIRE BEYOND EARTH", ENTER IGNIS button, stats ticker (8 Investigations / 176+ Observations).
**Why it matters:** First impression — establishes platform identity and NASA PSI connection.

---

## SCREENSHOT 2 — Research Lobby (Command Center)

**URL:** `http://localhost:5173/app`
**Filename:** `02_research_lobby.png`
**What to show:** Full lobby with Research Operations left panel (investigation selector, dataset dropdowns), statistics bar (8 investigations, 176 observations), and NASA PSI Flight Investigations listing on the right showing all 8 payloads.
**Why it matters:** Shows the full platform scope at a glance.

---

## SCREENSHOT 3 — Investigation Explorer: FLEX (PSI-69)

**URL:** Open "Investigation Explorer" tab → select PSI-69
**Filename:** `03_investigation_flex_psi69.png`
**What to show:** FLEX investigation detail — DOI badge `10.60555/mbq8-0451`, platform (ISS / CIR / MDCA), apparatus description, source files table with SHA-256 checksums, and filterable observations table.
**Why it matters:** Demonstrates NASA data provenance and scientific traceability.

---

## SCREENSHOT 4 — Investigation Explorer: SAFFIRE-I (PSI-98)

**URL:** Investigation Explorer → select PSI-98
**Filename:** `04_investigation_saffire_psi98.png`
**What to show:** SAFFIRE-I detail — Cygnus OA-6 platform, SIBAL fabric details, thermocouple telemetry observations with temperature values and flame spread rates.
**Why it matters:** Shows large-scale spacecraft fire experiment data.

---

## SCREENSHOT 5 — Comparability Engine: Valid Comparison (FLEX + FLEX-2)

**URL:** Synthesis Workspace → select PSI-69 + PSI-70
**Filename:** `05_comparison_valid_flex_flex2.png`
**What to show:** Green compatibility indicators, shared burning rate constant chart, variables analysis panel showing "COMPATIBLE" status for droplet K (mm²/s).
**Why it matters:** Shows valid intra-regime cross-investigation comparisons working correctly.

---

## SCREENSHOT 6 — Comparability Engine: Blocked Invalid Comparison

**URL:** Synthesis Workspace → select PSI-69 (FLEX) + PSI-98 (SAFFIRE-I)
**Filename:** `06_comparison_blocked_incompatible.png`
**What to show:** The incompatibility warning, "QUANTITATIVE OVERLAY REFUSED" advisory, and variable analysis cards showing mismatched physical dimensions (mm²/s vs. mm/s).
**Why it matters:** The scientific integrity enforcement is a unique and critical feature — capture it clearly.

---

## SCREENSHOT 7 — Scientific Visualization Dashboard

**URL:** Telemetry Analysis tab → PSI-98 time-series or PSI-69 scatter
**Filename:** `07_visualization_dashboard.png`
**What to show:** Live interactive chart — SAFFIRE-I thermocouple time-series showing 920°C peak, or FLEX droplet d₀ vs. K scatter — with axis labels and NASA investigation context.
**Why it matters:** Demonstrates real NASA measurement data visualized interactively.

---

## SCREENSHOT 8 — AI Assistant: Answered Query with Citations

**URL:** AI Research Assistant page
**Filename:** `08_assistant_answered_query.png`
**What to show:** Completed answer to "What did FLEX investigate about gaseous fire suppressants?" — answer text, evidence strength indicator, and at least one citation card with document title, page number, and DOI link.
**Why it matters:** Shows citation-grounded offline AI operating over NASA NTRS documents.

---

## SCREENSHOT 9 — AI Assistant: Insufficient Evidence Response

**URL:** AI Research Assistant → ask an out-of-corpus question
**Filename:** `09_assistant_evidence_gap_response.png`
**What to show:** The "Insufficient Corpus Evidence" response — missing knowledge terms listed, no fabricated answer.
**Why it matters:** Demonstrates responsible AI — explicitly acknowledging limits.

---

## SCREENSHOT 10 — Evidence Gap Heatmap

**URL:** Evidence Gap Map page
**Filename:** `10_evidence_gap_heatmap.png`
**What to show:** Full matrix with green/amber/red colour coding, legend, and at least one clearly red critical gap cell visible (wire insulation in microgravity).
**Why it matters:** Innovative gap visualization unique to IGNIS — shows what NASA has NOT yet tested.

---

## SCREENSHOT 11 — Mission Scenario Analyzer

**URL:** Mission Scenarios → select Artemis Lunar Habitat
**Filename:** `11_mission_scenario_artemis.png`
**What to show:** Lunar habitat scenario parameters (1/6g, 32% O₂, 56.5 kPa), matched research leads from BASS and SAFFIRE, and explicit aerothermal mismatch / scaling gap warning.
**Why it matters:** Shows real-world engineering application of the NASA data.

---

## SCREENSHOT 12 — Relevance Ranking Engine

**URL:** Evidence Ranking page → enter a query
**Filename:** `12_evidence_ranking.png`
**What to show:** Ranked results with 4-factor breakdown pills (Topic 35%, Conditions 30%, Variables 20%, Provenance 15%) and evidence gap summary at the bottom.
**Why it matters:** Transparent, explainable relevance scoring — not a black-box score.

---

## OPTIONAL SCREENSHOTS

| Filename | Description |
|---|---|
| `13_image_gallery.png` | The 12 procedural scientific illustrations with synthetic labels |
| `14_image_comparison.png` | Split-screen slider comparing two flame morphology illustrations |
| `15_light_mode.png` | Lobby or assistant view in light mode (accessibility) |
| `16_backend_api_docs.png` | FastAPI `/docs` page showing all 15+ API routes |
| `17_test_suite_pass.png` | Terminal showing `29/29 tests passing` |

---

## RECOMMENDED UPLOAD ORDER

Upload in this order on the NASA Space Apps portal:
1. Landing page hero
2. Research lobby
3. Investigation Explorer — FLEX
4. Valid comparison
5. Blocked comparison (key differentiator!)
6. Visualization dashboard
7. AI Assistant — answered query
8. AI Assistant — insufficient evidence
9. Evidence Gap Heatmap
10. Mission Scenario
11. Relevance Ranking
12. Any optional screenshots
