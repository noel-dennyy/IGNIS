# IGNIS — Demonstration Video Script
## NASA Space Apps Challenge 2026

**Duration:** 2 minutes 30 seconds – 3 minutes
**Format:** Screen recording with narration
**Tone:** Grounded, precise, scientifically credible

---

## PRE-RECORDING CHECKLIST

Before starting your recording:
- [ ] Backend running: `uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload`
- [ ] Frontend running: `npm run dev` → `http://localhost:5173`
- [ ] Browser in full-screen (1920×1080 recommended), dark mode enabled
- [ ] All browser console errors cleared
- [ ] Navigate to the Landing Page first (`http://localhost:5173/`)

---

## SCENE 1 — The Problem (0:00 – 0:30)

**Screen:** IGNIS Landing Page — Hero Section with flame animation
**Action:** Let the flame canvas animation run for 2 seconds, then slowly scroll to the introduction grid.

**Narration:**
> "Fire in space is one of the most dangerous emergencies a crew can face. Without gravity, flames behave in ways our Earth-based safety systems were never designed for — they burn spherically, produce invisible low-temperature cool flames, and soot drifts without rising to a detector.
>
> NASA has studied this for decades, running hundreds of experiments aboard the ISS and uncrewed spacecraft. But accessing and comparing this research requires specialist database knowledge most engineers don't have. IGNIS changes that."

---

## SCENE 2 — Platform Entry: The Research Lobby (0:30 – 0:55)

**Screen:** Click "ENTER IGNIS" → Research Lobby (Command Center)
**Action:** Point to the statistics bar — 8 Investigations, 176+ Observations. Scroll the investigation listing to show all 8 payloads.

**Narration:**
> "IGNIS — Intelligent Guidance for Next-generation In-Space Safety — is built on 8 real NASA Physical Sciences Informatics investigations with 176 verified experimental observations, all under the CC0 public domain license.
>
> Every metric here is computed live from an authenticated database. Nothing is hardcoded."

---

## SCENE 3 — Investigation Explorer: NASA Data Provenance (0:55 – 1:25)

**Screen:** Click "Investigation Explorer" tab → Select PSI-69 (FLEX)
**Action:**
- Point to DOI badge `10.60555/mbq8-0451` and CC0-1.0 license
- Scroll to the Source Files table showing SHA-256 checksums
- Filter the observations table by typing "Methanol" or "Extinction"
- Switch to PSI-98 (SAFFIRE-I) — scroll to thermocouple telemetry rows

**Narration:**
> "In the Investigation Explorer, every NASA experiment is documented with its persistent DOI, platform, facility, tested materials, and verified source files with SHA-256 integrity checksums.
>
> FLEX — PSI-69 — studied liquid droplet burning rates and gaseous fire suppressants including CO₂ and Helium aboard the ISS. Every row is a real experimental measurement.
>
> SAFFIRE-I — PSI-98 — went further. It burned a full half-meter fabric sheet aboard an unmanned Cygnus spacecraft, measuring flame spread and thermocouple temperatures exceeding 920 degrees Celsius."

---

## SCENE 4 — Scientific Integrity: Comparability Engine (1:25 – 1:50)

**Screen:** Navigate to Synthesis Workspace → Evidence Comparison
**Action:**
1. Select PSI-69 (FLEX) + PSI-98 (SAFFIRE-I) → let incompatibility warning appear
2. Then select PSI-69 + PSI-70 (FLEX-2) → show the valid shared chart

**Narration:**
> "A core principle of IGNIS is scientific integrity. When I compare FLEX and SAFFIRE-I — a spherical liquid droplet experiment versus a planar solid fabric experiment — IGNIS refuses to generate a combined chart. These measure fundamentally different physical processes.
>
> However, comparing FLEX with FLEX-2 — both liquid droplet combustion — is physically valid. IGNIS approves this and generates a verified shared burning rate comparison."

---

## SCENE 5 — AI Research Assistant (1:50 – 2:20)

**Screen:** Navigate to AI Research Assistant
**Action:**
1. Click demo prompt: *"What did FLEX investigate about gaseous fire suppressants?"*
2. Show the answered card and citation card with document title, page, DOI
3. Ask: *"What are fire protocols for antimatter warp drive containment?"*
4. Show the "Insufficient Evidence" response with missing token list

**Narration:**
> "The IGNIS Research Assistant runs entirely offline using deterministic retrieval over NASA document chunks — no external API keys, no fabricated answers.
>
> Ask about FLEX gaseous suppressants and IGNIS synthesizes an answer directly from papers by Williams and Nayagam, with a clickable citation showing the exact page and DOI.
>
> Ask something outside the indexed corpus — like antimatter fire protocols — and IGNIS honestly responds: 'Insufficient corpus evidence', naming what it doesn't know rather than inventing an answer."

---

## SCENE 6 — Evidence Gap Map & Mission Scenarios (2:20 – 2:50)

**Screen:** Navigate to Evidence Gap Map
**Action:**
- Show the coloured matrix — point to a red "critical gap" cell
- Navigate to Mission Scenario Analyzer → select Artemis Lunar Habitat

**Narration:**
> "The Evidence Gap Heatmap reveals what NASA has not yet tested. This red cell represents electrical wire insulation in microgravity — a critical material in every spacecraft — with zero indexed experimental records. This is a real, actionable research frontier.
>
> In the Mission Scenario Analyzer, selecting an Artemis pressurized lunar habitat surfaces relevant research leads from BASS and SAFFIRE, while explicitly flagging that orbital microgravity data cannot be directly applied to lunar 1/6g conditions without validated scaling models."

---

## SCENE 7 — Closing (2:50 – 3:00)

**Screen:** Return to Landing Page or Command Center stats bar

**Narration:**
> "IGNIS brings transparency, traceability, and scientific integrity to spacecraft fire research — grounded entirely in authentic NASA data, built to run offline, and designed to surface not just what we know, but what we still need to discover.
>
> Thank you."

---

## POST-RECORDING NOTES

| Item | Recommendation |
|---|---|
| Recording tool | OBS Studio (free) or Loom |
| Resolution | 1920×1080 at 30 fps |
| File size | Under 500 MB |
| Hosting | YouTube (unlisted or public) or Vimeo |
| Accessibility | Add captions/subtitles |
| Background music | Optional — keep subtle, royalty-free |
