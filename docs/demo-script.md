# IGNIS — 3-Minute Live Demonstration Script

**Competition:** NASA Space Apps Challenge 2026  
**Challenge:** Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Format:** Live walkthrough or video recording (~150–180 seconds)  
**Presenter Tone:** Grounded, scientific, precise, cautious, enthusiastic about space safety.

---

## Act 1 — The Problem & Challenge Context (0:00 – 0:35)

- **Screen:** Command Center / Overview Page (`http://localhost:5173`)
- **Spoken Narrative:**
  > *"Welcome to IGNIS — Intelligent Guidance for Next-generation In-Space Safety, created for the NASA Space Apps Challenge 2026 'Flame in Freefall'.
  >
  > For decades, NASA has conducted combustion experiments on the ISS and automated spacecraft. In microgravity, buoyancy disappears: flames lose their upward draft, become rounded or spherical, and burn cooler while producing more soot. But this vital knowledge is scattered across decades of Technical Memorandums, sensor tables, and repository entries.
  >
  > IGNIS transforms this archived research into a source-grounded, verifiable research intelligence dashboard. Everything you see here is drawn from real database records — indexing NASA's Physical Sciences Informatics (PSI) repository and Technical Reports Server (NTRS)."*

- **Visual Action:**
  - Point to the live count metrics: **3 Indexed Investigations, 4 Source Documents, 12 Paragraph Chunks, 58 Verified Observations, 12 Published Findings**.
  - Highlight the **Scientific Disclaimer Banner**: *"Archived research prototype — not operational safety advice."*

---

## Act 2 — Investigation Explorer & Source Provenance (0:35 – 1:10)

- **Screen:** Investigation Explorer Page
- **Spoken Narrative:**
  > *"Let's explore our primary ingested NASA experiments.
  >
  > Here is FLEX (PSI-69), the Flame Extinguishment Experiment conducted aboard the ISS in the Combustion Integrated Rack. Notice the persistent DOI `10.60555/mbq8-0451` and CC0-1.0 license. FLEX analyzed droplet burning rate constants and gaseous fire suppressants like CO2 and Helium. Below, every row represents a verified physical test run with droplet diameters and extinction thresholds.
  >
  > Next, we switch to SAFFIRE-I (PSI-98). Unlike small laboratory tests, SAFFIRE burned an entire 0.94-meter fabric sheet aboard an uncrewed Cygnus resupply ship after ISS departure. Notice the flight telemetry: airflow velocity, thermocouple temperatures up to 920 °C, and radiometer heat flux."*

- **Visual Action:**
  - Click between **FLEX (PSI-69)** and **SAFFIRE-I (PSI-98)**.
  - Scroll to the **Ingested Source Files** table to show verified SHA-256 checksums and direct links to NASA's PSI portal.
  - Filter observations table by typing `"Methanol"` or `"Extinction"`.

---

## Act 3 — Scientific Integrity: Evidence Comparison (1:10 – 1:45)

- **Screen:** Evidence Comparison Page
- **Spoken Narrative:**
  > *"A critical scientific integrity requirement of IGNIS is that we never combine incomparable experiments.
  >
  > When we select both FLEX and SAFFIRE-I, IGNIS's comparison engine activates. Instead of fabricating a misleading joint chart, the system issues a clear Scientific Integrity Enforcement: 'Droplet vs. Solid Sheet Incompatibility'.
  >
  > A spherical liquid droplet burning in quiescent zero-flow cannot be plotted on the same axis as a planar fabric burning in a 20 cm/s forced-flow duct. IGNIS breaks down the variables, showing that while ambient oxygen is contextually comparable, the geometries and burning mechanisms are fundamentally distinct."*

- **Visual Action:**
  - Show the red incompatibility warning banner: *"QUANTITATIVE OVERLAY REFUSED"*.
  - Scroll through the variable analysis cards showing which variables match and which cannot be quantitatively plotted together.
  - Select single investigation (FLEX) to show the verified quantitative parameter curve.

---

## Act 4 — AI Assistant with Grounded Citations (1:45 – 2:25)

- **Screen:** IGNIS AI Assistant Page
- **Spoken Narrative:**
  > *"Next, let's query the IGNIS Research Assistant. We built IGNIS to operate offline without external API keys, using deterministic lexical retrieval over indexed NASA document chunks.
  >
  > Let's ask: 'What did FLEX investigate about gaseous fire suppressants?'
  >
  > In milliseconds, IGNIS synthesizes an answer directly from the papers of Williams and Nayagam. Notice every claim is backed by a clickable citation card showing the exact document title, page number, and DOI link.
  >
  > Now watch what happens when we ask an unsupported out-of-corpus question, like 'antimatter warp drive fire protocols'. IGNIS does not hallucinate; it states honestly: 'I could not find enough evidence in the currently indexed NASA corpus', naming the missing terms."*

- **Visual Action:**
  - Click the demo prompt: *"What did FLEX investigate about gaseous fire suppressants?"*.
  - Show the answered card and the clickable citation card with DOI `10.1016/j.combustflame.2012.06.012`.
  - Click the demo prompt: *"What are the fire safety protocols for antimatter warp drive containment?"* to demonstrate honest evidence gap detection.

---

## Act 5 — Transparent Ranking & Mission Scenario Closing (2:25 – 3:00)

- **Screen:** Relevance Ranking & Mission Scenario Pages
- **Spoken Narrative:**
  > *"Finally, our Relevance Ranking Engine breaks down evidence relevance into four transparent, auditable factors: Topic Relevance (35%), Condition Match (30%), Variable Coverage (20%), and Provenance (15%). It never outputs an arbitrary 'safety probability'.
  >
  > In our Mission Scenario Analyzer, engineers exploring a pressurized lunar habitat can immediately discover relevant research leads while being alerted to critical gaps — such as the fact that orbital microgravity data cannot be directly equated to lunar 1/6 g partial gravity without aerothermal corrections.
  >
  > IGNIS brings transparency, traceability, and scientific integrity to spacecraft fire research. Thank you."*

- **Visual Action:**
  - Show the factor breakdown pills on the Ranked Evidence cards.
  - Navigate to Mission Scenario Analyzer to highlight the Lunar Base and Mars Transit evaluations.
