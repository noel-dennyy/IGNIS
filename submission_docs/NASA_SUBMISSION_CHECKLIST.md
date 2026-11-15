# NASA Space Apps Challenge 2026 — Final Submission Checklist
## IGNIS — Intelligent Guidance for Next-generation In-Space Safety

> Items marked **[YOU MUST ENTER]** require manual input on the NASA Space Apps submission portal.
> Items marked **✅ Ready** are already prepared in the project.

---

## SECTION 1 — Project Identity

| Field | Value | Status |
|---|---|---|
| Project Title | IGNIS — Intelligent Guidance for Next-generation In-Space Safety | ✅ Ready |
| Project Acronym | IGNIS | ✅ Ready |
| Challenge | Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data | ✅ Ready |
| Challenge URL | https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/ | ✅ Ready |
| Track | Global Awards Eligible | ✅ Ready |
| Participation Type | Virtual | ✅ Ready |

---

## SECTION 2 — Team Information

**[YOU MUST ENTER]** — All fields must be entered manually on the submission portal.

| Field | Your Input |
|---|---|
| Team Name | __________________ |
| Team Members (names + Space Apps accounts) | __________________ |
| Team Location / City / Country | __________________ |
| Team Leader | __________________ |
| Participation Type | Solo / Team |

---

## SECTION 3 — Project URLs

**[YOU MUST ENTER]** — These must be live before final submission.

| Field | Placeholder | Action |
|---|---|---|
| GitHub Repository | `https://github.com/YOUR_USERNAME/ignis` | Push to PUBLIC repo; ensure README.md is present |
| Demo Video | `https://youtu.be/YOUR_VIDEO_ID` | Record using DEMO_VIDEO_SCRIPT.md → upload to YouTube |
| Live Deployment | `https://your-deployment-url.com` | Optional but recommended |

**GitHub Checklist:**
- [ ] Repository is set to **Public**
- [ ] `README.md` present at root (use `submission_docs/README_GITHUB.md` as your root README)
- [ ] `AI_USAGE.md` present (Space Apps AI disclosure requirement)
- [ ] `DATA_AUDIT.md` present (data provenance register)
- [ ] All source code committed (backend + frontend + data/)
- [ ] No API keys or credentials in any committed file
- [ ] `.env.example` present (not `.env`)

---

## SECTION 4 — Project Description for Portal

**[YOU MUST ENTER]** — Write into the Space Apps project description field.

**Short Description (1–2 sentences for the project card):**
```
IGNIS is an interactive research intelligence platform that unlocks NASA's microgravity
combustion database — 8 PSI investigations, 176+ verified observations — through
citation-grounded offline AI, scientific comparability enforcement, and an evidence gap
visualization, enabling spacecraft fire safety research without specialist database access.
```

**Full Description:**
Copy the content of `SUBMISSION.md` into the project description field, or write a 300–500 word summary using `PROJECT_OVERVIEW.md`.

---

## SECTION 5 — NASA Data Sources (Copy into Portal)

```
1. NASA Physical Sciences Informatics (PSI) Repository
   URL: https://psi.nasa.gov/
   Investigations: PSI-69 (FLEX), PSI-70 (FLEX-2), PSI-98 (SAFFIRE-I),
                   PSI-99 (SAFFIRE-II), PSI-107 (SPICE), PSI-108 (BASS),
                   PSI-71 (SLICE), PSI-101 (ACME-BRE)
   License: CC0-1.0
   DOIs: 10.60555/mbq8-0451, 10.60555/y812-q943, 10.60555/0t15-1z43,
         10.60555/0t15-2z44, 10.60555/9kbh-e962, 10.60555/k489-p210,
         10.60555/slice-0071, 10.60555/acme-0101

2. NASA Technical Reports Server (NTRS)
   URL: https://ntrs.nasa.gov/
   Usage: Peer-reviewed papers and technical memorandums indexed for
          citation-grounded research assistant (TF-IDF retrieval corpus)

3. NASA Glenn Research Center — Combustion Science
   URL: https://www.nasa.gov/glenn/
   Usage: Scientific background and microgravity combustion physics context

4. NASA ISS Research — Combustion and Fire Safety
   URL: https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/
   Usage: Mission context for ISS experiments and spacecraft safety studies
```

---

## SECTION 6 — Screenshots Checklist

**[YOU MUST CAPTURE & UPLOAD]** — Follow `SCREENSHOT_GUIDE.md` for details.

| # | Screenshot | Captured | Uploaded |
|---|---|---|---|
| 1 | Landing Page Hero | ☐ | ☐ |
| 2 | Research Lobby (all 8 investigations visible) | ☐ | ☐ |
| 3 | Investigation Explorer — FLEX (PSI-69) with DOI | ☐ | ☐ |
| 4 | Investigation Explorer — SAFFIRE-I (PSI-98) | ☐ | ☐ |
| 5 | Valid Comparison (FLEX + FLEX-2 — green status) | ☐ | ☐ |
| 6 | Blocked Invalid Comparison (red warning) | ☐ | ☐ |
| 7 | Visualization Dashboard (time-series or scatter) | ☐ | ☐ |
| 8 | AI Assistant — answered query with citations | ☐ | ☐ |
| 9 | AI Assistant — insufficient evidence response | ☐ | ☐ |
| 10 | Evidence Gap Heatmap (red critical gaps visible) | ☐ | ☐ |
| 11 | Mission Scenario Analyzer — Artemis Lunar Habitat | ☐ | ☐ |
| 12 | Relevance Ranking — 4-factor breakdown visible | ☐ | ☐ |

---

## SECTION 7 — Demo Video Checklist

**[YOU MUST RECORD & UPLOAD]**

| Requirement | Status |
|---|---|
| Duration: 2:30 – 3:00 minutes | ☐ |
| Covers all 7 scenes from DEMO_VIDEO_SCRIPT.md | ☐ |
| Uploaded to YouTube (public or unlisted) OR Vimeo | ☐ |
| Video URL added to Space Apps submission portal | ☐ |
| Video URL added to README.md | ☐ |

---

## SECTION 8 — AI Usage Disclosure (Space Apps Requirement)

| Requirement | Status |
|---|---|
| `AI_USAGE.md` committed to GitHub | ✅ Present |
| AI tools listed: Antigravity Lead Agent (Gemini), Specialized Subagents | ✅ Documented |
| No NASA logos or insignia generated by AI | ✅ Confirmed |
| All synthetic illustrations labeled "Scientific Illustration (Synthetic)" | ✅ Implemented |
| AI usage disclosure checkbox confirmed on portal | ☐ |

---

## SECTION 9 — Technical Verification

| Check | Status |
|---|---|
| Backend tests: 29/29 passing | ✅ Verified |
| Frontend build: zero TypeScript errors | ✅ Verified |
| All 8 investigations appear in `/api/investigations` | ✅ Verified |
| 176+ observations in database | ✅ Verified |
| Comparability engine blocks invalid comparisons | ✅ Verified |
| AI assistant runs offline (no API keys needed) | ✅ Verified |
| `DATA_AUDIT.md` present with full provenance | ✅ Present |
| No secrets/API keys committed to repository | ☐ Verify before push |
| `.env` excluded from git (check `.gitignore`) | ☐ Verify |

---

## SECTION 10 — Final Submission Steps (In Order)

Perform these steps on the NASA Space Apps portal:

```
Step 1 → Log in to spaceappschallenge.org
Step 2 → Create or update your project
Step 3 → Select challenge: "Flame in Freefall"
Step 4 → Fill in project title and short description
Step 5 → Paste full description from SUBMISSION.md
Step 6 → Add GitHub repository URL (ensure it is PUBLIC)
Step 7 → Record demo video using DEMO_VIDEO_SCRIPT.md
Step 8 → Upload demo video → paste URL into portal
Step 9 → Capture screenshots using SCREENSHOT_GUIDE.md
Step 10 → Upload screenshots in recommended order
Step 11 → Add NASA data sources (copy from Section 5 above)
Step 12 → Add team member names and locations
Step 13 → Confirm AI usage disclosure checkbox
Step 14 → Review all fields → SUBMIT
```

> ⚠️ **DEADLINE:** Confirm the official submission deadline at https://www.spaceappschallenge.org/2026/
> Do not wait until the final hour — submit with time to spare.

---

## DOCUMENT INDEX

| Document | Location | Purpose |
|---|---|---|
| `PROJECT_OVERVIEW.md` | submission_docs/ | Problem statement, solution, features, impact |
| `TECHNICAL_DOCUMENTATION.md` | submission_docs/ | Architecture, stack, algorithms, data processing |
| `INNOVATION_AND_IMPACT.md` | submission_docs/ | Innovation, NASA data usage, beneficiaries |
| `DEMO_VIDEO_SCRIPT.md` | submission_docs/ | 7-scene narration script for demo recording |
| `SCREENSHOT_GUIDE.md` | submission_docs/ | 12 required screenshots with filenames and descriptions |
| `README_GITHUB.md` | submission_docs/ | Professional GitHub README (copy to repo root) |
| `NASA_SUBMISSION_CHECKLIST.md` | submission_docs/ | This file — final submission checklist |
| `DATA_AUDIT.md` | project root | Full data provenance and checksum register |
| `AI_USAGE.md` | project root | AI tool disclosure (required by Space Apps) |
| `SUBMISSION.md` | project root | Executive brief for evaluators |
