# Hackathon Foundation Playbook

**A reusable operating document for choosing, building, validating and submitting hackathon projects**  
**Edition:** 1.0 · **Reusable core + current NASA Space Apps 2026 application**  
**Current application:** IGNIS — Flame in Freefall  
**Prepared:** 14 November 2026 (IST)

> **Purpose:** Keep every future hackathon project faithful to the official challenge, grounded in evidence, realistic for the available time, technically demonstrable, and ready to submit. This document is the project's operating charter. It is not a substitute for the current competition rules, challenge statement, data licences, or submission guide.

## How to use this document

1. **For every new hackathon:** copy this document, update the Event Profile and Challenge Brief, and re-check the current official rules, deadlines, judging criteria, and required data/resources.
2. **For the AI coding agent:** place the Markdown version in the project root and tell the agent to read it before planning or editing. Treat it as a standing set of constraints, not permission to ignore official rules.
3. **For IGNIS now:** use Part 12 as the filled-in project profile and Part 13 as the immediate execution guidance. Do not spend the remaining hackathon time polishing this document; use it to make decisions quickly.
4. **When sources conflict:** the latest official competition and challenge instructions take precedence. Update this document and record the change.

---

# Part 1 — The foundation charter

## 1.1 The one objective

The project exists to solve the **specific problem described by the official challenge**, for an identifiable user, using permitted and relevant evidence, within the time available.

Use this sentence to keep the project focused:

> For **[target user]**, **[project]** uses **[required data / method]** to **[complete the challenge verb]**, so that **[useful outcome]**.

If a proposed feature does not help complete the challenge verb, improve evidence quality, make the result usable, or make the solution easier to judge, it is probably not a priority.

## 1.2 Non-negotiable principles

1. **Challenge-first:** build what the challenge asks for, not the most fashionable application you can imagine.
2. **Evidence-first:** use real, permitted, attributable sources. Verify a dataset before designing features around it.
3. **Small but complete:** finish one end-to-end user workflow before expanding the feature list.
4. **Truth over appearance:** never fabricate values, charts, citations, model performance, user testing, or impact claims.
5. **Traceability:** every important data-derived claim should be traceable to its source and transformation.
6. **Explainability:** show how rankings, predictions, recommendations, or summaries were produced and where they are uncertain.
7. **Demo-first:** the judge must be able to see the core value in a short, reliable demonstration.
8. **Time-boxed ambition:** advanced features are optional until the required workflow works.
9. **Portable engineering:** local development must work; deployment is a separate, deliberate step.
10. **Submission is part of the build:** reserve time to test and submit. An unfinished submission is not a successful project.
11. **Honest AI use:** disclose AI-assisted code, research, text, images, audio, and video according to the current event's rules.
12. **Human responsibility:** the participant owns the final code, scientific claims, decisions, sources, and submission.

## 1.3 What success means

A hackathon project is ready only when a first-time user can:

- understand the problem and intended user;
- see how the solution answers the challenge;
- complete the core workflow without the developer explaining every click;
- inspect the real data or evidence used;
- understand important limitations;
- access a working demo or a reliable recorded demonstration; and
- find the source code, documentation, credits, and required submission material.

A larger feature count is not a substitute for these outcomes.

---

# Part 2 — Establish the official source of truth

## 2.1 Authority order

Before ideation or coding, collect the current edition's official material in this order:

1. **Official challenge statement:** exact wording, required actions, audience, outputs, and constraints.
2. **Official challenge Resources/Data tab:** named datasets, APIs, tools, tutorials, or source material.
3. **Official rules and participant/submission guide:** eligibility, team requirements, content rules, AI policy, open-source requirements, deadlines, and submission fields.
4. **Official judging rubric:** criteria and any weights or scoring guidance.
5. **Official organiser announcements:** only when they are clearly from the competition organiser or authorised local lead.
6. **Primary data and research sources:** data portals, scientific papers, technical documentation, and licences.
7. **Secondary explanations:** articles, blogs, tutorials, videos, forums, and AI-generated suggestions.

Secondary sources can help you understand a topic. They do not override official requirements or primary evidence.

## 2.2 The challenge extraction sheet

Copy the challenge's exact text into a project note and extract:

| Field | What to record |
|---|---|
| Challenge name / ID | Exact official title and link |
| Problem | What problem does the challenge say exists? |
| Target user | Who should benefit? |
| Required verbs | e.g., map, compare, model, summarize, rank, interpret |
| Required output | App, dashboard, model, map, prototype, story, etc. |
| Required data/resources | Exact official resources and any mandatory source |
| Constraints | Scientific, technical, legal, platform, safety, or scope constraints |
| Judging criteria | Exact criteria and weights, if published |
| Submission | Fields, video, demo, source code, licences, and deadline |

## 2.3 Requirement traceability

Turn each official requirement into a testable row. Do not rely on memory.

| Official requirement | Product feature | Evidence in demo | Test / verification | Status |
|---|---|---|---|---|
| [Quote or summarize requirement] | [Feature] | [Screen / output] | [How checked] | Not started / Working / Verified |

**Rule:** no major feature is “complete” merely because code exists. It is complete when the required user outcome can be demonstrated and checked.

## 2.4 Confirm, do not assume

- Open the current challenge's Resources tab; record exact titles and URLs.
- Verify data access, file size, schema, units, temporal coverage, update date, and licence.
- Confirm whether a resource is required, recommended, or merely an example.
- Confirm whether public deployment, open-source code, or particular AI disclosures are required.
- Verify the submission timezone shown for the registered team/event.
- Save a link or screenshot of important organiser clarifications.

If a rule or resource cannot be verified, label it **unconfirmed** and ask the organiser or avoid making an eligibility claim.

---

# Part 3 — Choose the right solution

## 3.1 Define the user and job

Write down:

- **Primary user:** one person or role, not “everyone.”
- **User's problem:** one sentence describing the current difficulty.
- **Job to be done:** what the user needs to accomplish.
- **Current workaround:** how the user does it today, if known.
- **Useful outcome:** what changes after using your project.

Do not claim a user need was validated through interviews unless interviews actually happened. You can label an assumption as an assumption.

## 3.2 Score ideas using an internal decision tool

Score each candidate idea from 1 (weak) to 5 (strong). These weights are an internal prioritisation aid, **not the competition's official judging weights**.

| Internal factor | Suggested weight | Question |
|---|---:|---|
| Challenge fit | 25% | Does it directly fulfil the official requirements? |
| Data access / evidence | 20% | Can the required data be accessed and verified now? |
| Feasibility in time | 15% | Can one person/team finish a complete workflow? |
| Validity | 15% | Can the science, logic, or engineering be defended? |
| User impact | 10% | Does it solve a meaningful problem? |
| Originality | 10% | Is there a useful, distinctive approach? |
| Demonstrability | 5% | Can its value be shown quickly? |

Reject or rescope an idea when it has weak challenge fit, unavailable data, or an untestable central claim—even if it looks impressive.

## 3.3 Write the minimum viable solution

Define the smallest complete workflow that answers the challenge. A useful MVP has:

1. a real input or real data source;
2. a functioning processing step;
3. an output that answers the challenge;
4. an interface or demonstration a judge can use;
5. evidence and limitations; and
6. a reproducible way to run it.

Do not start with login, user profiles, payments, admin panels, microservices, complex cloud infrastructure, or custom model training unless the challenge truly requires them.

---

# Part 4 — Scope control and feature priority

Put every proposed feature in one of four buckets:

| Priority | Meaning | Rule |
|---|---|---|
| P0 — Required | Directly fulfils a challenge requirement or makes the demo run | Must be done first |
| P1 — Differentiator | Adds clear scientific, technical, or user value | Do after P0 works |
| P2 — Polish | Improves clarity, accessibility, speed, or presentation | Do only if time remains |
| P3 — Later | Nice-to-have, speculative, or high-risk | Do not build during the hackathon |

Maintain a **do-not-build list**. Examples: fake real-time data, unsupported predictions, decorative charts with no data, unnecessary authentication, complex hosting, and features unrelated to the challenge.

**Scope lock:** once the MVP is agreed, new features require a written reason: which official requirement or demonstrated user need does this improve, what will it displace, and can it be tested before the deadline?

---

# Part 5 — Data, research, and scientific integrity

## 5.1 Build a source register

For every dataset, article, report, API, image, or code library, record:

- source title and organisation;
- exact URL and access date;
- source type (dataset, paper, API, software, image, etc.);
- licence / usage terms;
- DOI or persistent identifier, if available;
- file name, version, and checksum where practical;
- data period and units;
- extraction/cleaning steps;
- where it appears in the product; and
- known limitations.

## 5.2 Keep evidence types separate

Never mix these as if they were the same thing:

- **Observation:** measured or directly recorded data.
- **Published finding:** a conclusion stated by the original research authors.
- **Derived result:** a value calculated by your code from identified inputs and a documented method.
- **AI summary:** a language-model explanation of retrieved evidence.
- **Hypothesis:** a possible explanation or future research question that is not established.

Label each type visibly in the interface and documentation.

## 5.3 Data quality rules

- Missing values remain null / unknown, never silently become zero.
- Preserve original units and document conversions.
- Record time, location, experimental conditions, and measurement definitions where available.
- Detect duplicate records and invalid ranges; do not silently delete unusual values.
- Do not combine different measurement definitions or incompatible experimental conditions without justification.
- Display data coverage and source limitations.
- Never create a chart from placeholder values and present it as measured data.
- If evidence is not in the indexed corpus, say **“not found in the indexed sources”**, not “the phenomenon has never been studied.”

## 5.4 AI and retrieval guardrails

When an AI model is used:

- retrieve evidence before generating an answer;
- cite source title, page/section, and a direct link where possible;
- distinguish direct evidence from inference;
- refuse to invent missing measurements or citations;
- say when evidence is insufficient or conflicting;
- preserve a non-AI fallback where feasible;
- record model/provider and what AI was used for; and
- follow the current event's AI disclosure and generated-media rules.

AI can accelerate research and coding; it does not verify its own outputs. The participant must check the important claims.

---

# Part 6 — Architecture and engineering strategy

## 6.1 Local-first, portable by design

Build and test locally first. Deployment is a separate phase. Do not let cloud accounts, hosting configuration, or paid APIs block a working local prototype.

Use configuration rather than hardcoded environment-specific values:

- frontend API base URL in an environment variable;
- backend database URL, secret keys, allowed origins, host, and port in configuration;
- `.env.example` with placeholders only;
- `.gitignore` for secrets, local databases, virtual environments, build outputs, and dependencies.

Choose the simplest architecture that satisfies the challenge. Keep modules separated enough to test, but do not over-engineer.

## 6.2 Recommended engineering loop

1. Inspect the existing workspace before changing files.
2. Write the smallest plan and identify unknowns.
3. Implement one vertical slice end-to-end.
4. Run the app and tests.
5. Inspect the real output and compare it to the official requirement.
6. Fix defects before adding more features.
7. Record what changed, what works, and what remains.
8. Commit a known-good state regularly.

## 6.3 A vertical slice beats disconnected modules

A vertical slice means one user action works from the interface through the processing logic to a meaningful result, with real data and traceable evidence. Example: select an experiment → load its verified metadata → show a finding → open the original source.

Do not build five empty screens or five disconnected backend modules and call the prototype complete.

## 6.4 Use AI coding agents safely

Give the agent:

- this foundation document;
- the exact official challenge statement and rules;
- the requirement traceability table;
- the verified source register;
- the MVP and do-not-build list; and
- the acceptance tests.

Agent rules:

1. Read the foundation and challenge files before coding.
2. Inspect before overwriting; never delete working user changes without permission.
3. Do not invent data, sources, requirements, test results, or deployment status.
4. Explain risky commands and request approval before destructive actions.
5. Work in small, reviewable changes.
6. Run relevant tests and report actual outputs.
7. Keep source files, README, data audit, and AI-use log updated.
8. Ask only when a missing decision or credential genuinely blocks progress; otherwise choose a reversible default and document it.
9. Do not deploy, publish a repo, or incur cost unless explicitly authorised.
10. The human participant reviews the final output and owns the submission.

---

# Part 7 — Time and execution management

## 7.1 Suggested allocation for a 48-hour hackathon

| Phase | Share of available time | Outcome |
|---|---:|---|
| Understand challenge and verify sources | 10% | Challenge brief and source audit |
| Define user, MVP, and architecture | 10% | Scope lock and acceptance tests |
| Build core vertical slice | 40% | Working end-to-end demo path |
| Add one or two differentiators | 15% | Clear competitive distinction |
| Integrate, test, and fix | 10% | Reliable build |
| Story, video, and submission | 10% | Complete submission package |
| Buffer | 5% | Unexpected problems |

This is a planning heuristic. If data access is uncertain, move time toward source verification. If the deadline is near, freeze feature development and submit a stable MVP.

## 7.2 Solo-builder adjustment

For one developer:

- select one primary user and one core workflow;
- use managed services only when they save time and are necessary;
- prefer familiar languages/frameworks;
- use a small verified dataset instead of a large unverified collection;
- defer custom model training and advanced infrastructure;
- keep a written cut list; and
- protect time for testing and submission.

## 7.3 Daily or checkpoint log

At each checkpoint record:

- completed and verified;
- not completed;
- blockers and decisions needed;
- data/source changes;
- known defects;
- next three actions; and
- time remaining to submission.

---

# Part 8 — Judging alignment and presentation

## 8.1 Map the project to the actual rubric

Copy the current competition's official criteria and weights into a matrix. Do not assume a previous year's scoring system applies.

For NASA Space Apps 2026, official event information identifies five core criteria: **Impact, Creativity, Validity, Relevance, and Presentation**. Confirm the precise current instructions shown for the registered Local Event and official judging guide; do not invent percentage weights.

| Criterion | Evidence your project should show |
|---|---|
| Impact | Who benefits and what problem becomes easier/better? |
| Creativity | What is distinctive and why is it useful? |
| Validity | Are the data, method, assumptions, and outputs defensible? |
| Relevance | Does the prototype directly answer the chosen challenge? |
| Presentation | Can a judge understand and verify the value quickly? |

## 8.2 Three-minute demo structure

1. **Problem (20–30 sec):** what is difficult today and for whom?
2. **Challenge connection (15–20 sec):** quote or map the official requirement.
3. **Live workflow (60–90 sec):** demonstrate the core user journey using real data.
4. **Evidence and method (30–40 sec):** show where data came from and how output is produced.
5. **Impact and limitations (20–30 sec):** explain value without overclaiming.
6. **Close (10 sec):** what is working now and what can be extended next.

Record a backup video in case the live demo, internet, or hosting fails.

## 8.3 Presentation assets

Prepare:

- one-sentence pitch;
- short and long project description;
- one architecture diagram;
- one data/source-flow diagram;
- 3–5 meaningful screenshots;
- a concise demo script;
- a limitations statement; and
- acknowledgements, licences, and AI-use disclosure.

---

# Part 9 — Quality, security, and release gates

## 9.1 Minimum acceptance tests

- Fresh setup instructions work on another machine or clean environment.
- The main user journey completes without developer intervention.
- Required data/resources are used and attributed.
- Every important result can be explained and traced.
- Empty, unavailable, and error states are handled.
- No fake counts, charts, live status, or performance metrics appear.
- No secrets are committed or exposed to the browser.
- The app works at common screen sizes.
- Source links and external dependencies are checked.
- The production build succeeds if a web deployment is included.

## 9.2 Release gates

**Gate A — Objective:** official requirements mapped to features and tests.  
**Gate B — Evidence:** data access, permissions, source register, and limitations checked.  
**Gate C — Function:** core workflow works end-to-end.  
**Gate D — Trust:** claims, charts, citations, and AI outputs reviewed.  
**Gate E — Submission:** all required fields and links open; deadline and timezone confirmed.

Do not claim “complete,” “deployed,” “validated,” or “tested” unless the corresponding gate has actually passed.

---

# Part 10 — Submission discipline

Create a submission checklist from the current platform. Common items include:

- correct challenge selected;
- project title and tagline;
- problem and solution description;
- target users and impact;
- how required data/resources were used;
- source code / repository link if requested;
- live demo link if available;
- demo video and screenshots;
- architecture and technical explanation;
- data-source credits and licences;
- AI-use disclosure;
- known limitations;
- teammate/participant details; and
- final submit confirmation visible on the official platform.

**Do not leave submission until the last minute.** Upload the minimum complete and truthful submission early, then improve it only if the official platform permits edits before the deadline.

---

# Part 11 — Reusable event profile template

Copy and fill this section for every new hackathon.

## Event profile

- Competition name / edition: **[FILL]**
- Official website: **[FILL]**
- Registered Local Event / timezone: **[FILL]**
- Start and submission deadline: **[FILL; verify on official platform]**
- Team size / eligibility: **[FILL]**
- Official rules and submission guide: **[FILL]**
- Current judging criteria / weights: **[FILL]**
- AI, IP, open-source, privacy, and generated-media rules: **[FILL]**

## Challenge profile

- Exact challenge title / ID: **[FILL]**
- Official challenge link: **[FILL]**
- Challenge statement copied verbatim: **[FILL]**
- Target user: **[FILL]**
- Problem to solve: **[FILL]**
- Required verbs / outputs: **[FILL]**
- Required or recommended sources: **[FILL]**
- Constraints and exclusions: **[FILL]**
- Questions for organisers / mentors: **[FILL]**

## Product profile

- Project name: **[FILL]**
- One-sentence objective: **[FILL]**
- Primary user journey: **[FILL]**
- MVP (P0): **[FILL]**
- Differentiator (P1): **[FILL]**
- Deferred features (P2/P3): **[FILL]**
- Success/acceptance tests: **[FILL]**
- Main risks and fallback: **[FILL]**

## Source register

| Source title | Official URL | Licence | Access verified? | Used in feature | Limitation |
|---|---|---|---|---|---|
| [FILL] | [FILL] | [FILL] | Yes / No | [FILL] | [FILL] |

## Decision log

| Date/time | Decision | Evidence/reason | Impact | Revisit? |
|---|---|---|---|---|
| [FILL] | [FILL] | [FILL] | [FILL] | Yes / No |

---

# Part 12 — Current application: NASA Space Apps Challenge 2026 / IGNIS

> This section applies the reusable foundation to the current hackathon. Re-check the official platform before submission; the event's rules and submission status are authoritative.

## 12.1 Verified event facts

- **Event:** NASA Space Apps Challenge 2026.
- **Theme:** The Next Frontier.
- **Dates:** 14–15 November 2026.
- **Submission:** the official 2026 event page states that project submission opens Saturday 14 November at 9:00 AM and closes Sunday 15 November at 11:59 PM local time. Submit via the Project tab on the team's page. The event page says submission is required for a participant certificate and Global Judging eligibility.
- **Team size:** up to six participants according to the official event page; this project is being developed by one participant.
- **Challenge:** *Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data*.
- **Challenge difficulty / subject:** the challenge page lists Intermediate and Advanced; Space Exploration.
- **Official challenge requirement:** create an interactive, “super intelligence (SI) powered” dashboard that summarizes, ranks, and interprets microgravity-combustion findings to deliver fire-safety insights for human space exploration.

Official links:
- Event: https://www.spaceappschallenge.org/2026/
- Challenge: https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/
- Challenge resources tab: https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/?tab=resources

## 12.2 IGNIS objective lock

**Working name:** IGNIS — Intelligent Guidance for Next-generation In-Space Safety.  
**One-sentence objective:** For researchers and space-safety learners, IGNIS makes microgravity-combustion research easier to explore by indexing verified NASA evidence, summarizing and ranking relevant findings transparently, and showing the sources and limitations behind each interpretation.

**The required verbs are the build checklist:**

- **Interactive:** the user can explore records and perform a meaningful query/comparison.
- **Summarize:** concise explanations grounded in retrieved material.
- **Rank:** transparent ranking of evidence relevance/coverage, not a fabricated fire-danger score.
- **Interpret:** contextual explanation that distinguishes evidence, inference, and uncertainty.
- **Fire-safety insights:** research implications for human space exploration, not operational spacecraft procedures or certification.

## 12.3 Current source plan — verify before relying on it

First inspect the exact official challenge Resources tab and current rules. Record every named source, whether it is required or recommended, its working URL, licence, and how IGNIS actually uses it. Do not claim a source satisfies a challenge-specific requirement until this is verified.

Candidate NASA PSI supplemental investigation records already identified:

| Investigation | Record | What it concerns | Important caveat |
|---|---|---|---|
| FLEX | https://psi.nasa.gov/physci/repo/data/investigations/PSI-69 | Droplet flame extinguishment in microgravity; liquid-fuel droplets and gaseous suppressant studies | Inspect individual files and actual metadata; do not assume all files are small or tabular |
| SAFFIRE-I | https://psi.nasa.gov/physci/repo/data/investigations/PSI-98 | Spacecraft fire / smoke research and large-scale low-gravity fire behaviour | Distinguish smoke/fire-growth experiments from droplet experiments |
| SPICE | https://psi.nasa.gov/physci/repo/data/investigations/PSI-107 | Non-buoyant/co-flow flame and smoke-point research | The repository page has indicated a multi-gigabyte collection; inspect metadata and small documents before downloading bulk files |

These are candidate supplementary sources. Do not assume they are the challenge's required resources or directly comparable with one another. Confirm current file versions, licence, DOI, downloadable formats, and provenance on each NASA record.

## 12.4 IGNIS MVP — solo scope

Build one complete evidence workflow first:

1. A verified, small corpus containing at least one relevant official challenge resource and any carefully selected supplemental investigation documents.
2. An experiment/document explorer showing title, objective, context, source, date/version, licence, and available data types.
3. Search over the indexed documents and records.
4. A source-grounded answer or summary with page/section-level citations where available.
5. A transparent relevance ranking with visible factors (for example, topical match, condition match, and metadata completeness).
6. A basic comparison view only for genuinely compatible variables/conditions.
7. A clear “evidence not found in this indexed corpus” state.
8. A compact dashboard with counts calculated from the ingested source records—not manually invented.

**Optional differentiator after MVP:** mission-question evidence coverage and evidence-gap report. It must say “not found in the indexed corpus” rather than asserting that NASA has never studied the condition.

## 12.5 Scientific guardrails for IGNIS

- Microgravity is not identical to lunar gravity or Martian gravity.
- FLEX, SAFFIRE-I, and SPICE have different apparatus, materials/fuels, experimental objectives, and measurement contexts. Do not compare their numbers indiscriminately.
- Keep measurements, author conclusions, derived calculations, AI summaries, and hypotheses separately labelled.
- Never invent missing conditions, values, units, dates, DOIs, page numbers, or source citations.
- An AI-generated summary is not itself experimental evidence.
- An evidence-relevance score is not a fire-risk probability, safety certification, or mission readiness score.
- Do not provide operational spacecraft fire-suppression instructions.
- IGNIS is an independent hackathon prototype, not a NASA product or NASA-endorsed safety system.

## 12.6 Suggested technology choices

Use the participant's familiar tools and keep architecture simple:

- Frontend: React + Vite.
- Backend: Python + FastAPI.
- Local database: SQLite through a database abstraction; keep production migration possible.
- Processing: Pandas / NumPy where actual tabular data warrants it.
- PDF extraction: PyMuPDF, with manual verification of tables and page references.
- Initial retrieval: lexical search (for example TF-IDF/BM25); add embeddings only if they improve retrieval and time permits.
- Charts: Recharts or Plotly only for real, interpretable data.
- AI: optional backend-only LLM integration; maintain a retrieval-only fallback.

Do not add account systems, custom model training, microservices, Kubernetes, or public deployment before the MVP works.

## 12.7 Immediate priorities for the remaining 2026 hackathon window

At the time this document is prepared (14 November 2026, IST), the hackathon is underway and the official submission deadline is the following day. Prioritise in this order:

1. Re-open the official challenge and Resources tab; verify the exact requirements and resources.
2. Select a small set of downloadable, relevant files; create `DATA_AUDIT.md` with source, version, licence, data type, and what is actually used.
3. Build a working end-to-end vertical slice: verified source → ingestion → searchable record → cited summary → usable interface.
4. Add transparent ranking only after retrieval works.
5. Add comparison only when variables and conditions are compatible.
6. Test the demo path, source links, empty states, and local run instructions.
7. Complete the official project submission before the displayed local deadline; keep a buffer for upload or platform issues.

Do not spend the remaining time trying to ingest every NASA record or build every proposed IGNIS page. A smaller, honest, complete prototype is stronger than an ambitious but unverifiable one.

## 12.8 Current judging alignment

Official 2026 Space Apps event information identifies five core criteria: **Impact, Creativity, Validity, Relevance, Presentation**. Use the registered Local Event's current judging guide for exact interpretation and any weights.

| Criterion | IGNIS evidence |
|---|---|
| Impact | Reduces effort to discover and understand research relevant to space fire safety |
| Creativity | Combines source-grounded retrieval, transparent evidence ranking, and evidence-gap exploration |
| Validity | Real NASA sources, provenance, units, compatible comparisons, limitations, citation checks |
| Relevance | Directly performs the challenge verbs: summarize, rank, interpret, and present fire-safety research insights |
| Presentation | A short live workflow showing a real record, a cited answer, ranking explanation, and limitations |

---

# Part 13 — Copy/paste instruction for any AI coding agent

```text
Read HACKATHON_FOUNDATION_PLAYBOOK.md completely before making changes.
Treat it as the operating charter for this hackathon project.
Also read the current official challenge statement, resource list,
rules, submission guide, and judging rubric provided in the workspace.

Your priorities are:
1. Preserve the official challenge objective and convert every requirement
   into a feature and test.
2. Verify all source data, licences, formats, units, and limitations before
   building features around them.
3. Build the smallest complete, testable end-to-end workflow first.
4. Never invent data, source citations, model results, test results, or
   deployment status.
5. Keep observations, published findings, derived results, AI summaries,
   and hypotheses distinct.
6. Keep the project runnable locally. Deployment is separate and requires
   explicit authorisation.
7. Work incrementally, inspect existing files before overwriting, and run
   tests after meaningful changes.
8. Maintain README.md, DATA_AUDIT.md, AI_USAGE.md, a source register,
   and a decision/change log as applicable.
9. Report what is verified, what is assumed, what is blocked, and what
   remains incomplete at every checkpoint.
10. Protect the submission deadline: stop adding features early enough
    to test, document, and submit a reliable project.

Do not optimise for the number of features. Optimise for challenge fit,
evidence quality, a working demonstration, technical validity, and a
clear explanation of impact and limitations.
```

---

# Part 14 — Reference links for the current IGNIS application

**Primary competition sources**

- NASA Space Apps 2026 event page: https://www.spaceappschallenge.org/2026/
- NASA Space Apps 2026 challenge — Flame in Freefall: https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/
- Challenge Resources tab: https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/?tab=resources
- NASA Space Apps overview: https://www.spaceappschallenge.org/about/

**Candidate NASA research sources**

- NASA PSI-69 — FLEX: https://psi.nasa.gov/physci/repo/data/investigations/PSI-69  
  DOI: 10.60555/mbq8-0451
- NASA PSI-98 — SAFFIRE-I: https://psi.nasa.gov/physci/repo/data/investigations/PSI-98  
  DOI: 10.60555/0t15-1z43
- NASA PSI-107 — SPICE: https://psi.nasa.gov/physci/repo/data/investigations/PSI-107  
  DOI: 10.60555/9kbh-e962
- NASA Technical Reports Server: https://ntrs.nasa.gov/

**Document maintenance**

- Version: 1.0
- Prepared: 14 November 2026
- Change this document whenever official requirements, data resources, scope, or a key technical decision changes.
- For future hackathons, duplicate the file, clear Part 12, and complete Part 11 before choosing the project.
