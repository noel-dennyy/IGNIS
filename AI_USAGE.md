# IGNIS — AI Usage and Disclosure Statement

**Project:** IGNIS — Intelligent Guidance for Next-generation In-Space Safety  
**Challenge:** Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Competition:** NASA Space Apps Challenge 2026  
**Document Revision:** 1.0  
**Date:** 2026-11-14  

---

## 1. Compliance with NASA Space Apps 2026 AI Policy

In accordance with the official rules and guidelines issued by the NASA Space Apps Global Organizing (GO) Team:
- **AI-assisted code and architecture:** Fully disclosed and cataloged below.
- **AI-generated images and video:** Any generated graphics must be visibly watermarked with a clear "AI-Generated" label. No NASA logos, NASA insignias, meatball/worm marks, or official agency flags have been generated, copied, or modified by AI.
- **Data integrity:** NASA scientific data points, investigation IDs, DOIs, and experimental measurements were never synthesized or hallucinated. All dataset values are grounded directly in authentic NASA Physical Sciences Informatics (PSI) publications and records.
- **In-app AI Assistant:** Grounded strictly in retrieved text excerpts via deterministic retrieval. When evidence is missing, the system explicitly reports an evidence gap rather than hallucinating answers.

---

## 2. Tools and Models Used

| Tool / Model | Provider | Role in Project | Scope of Contribution |
|---|---|---|---|
| **Antigravity Lead Agent** (Gemini Flash / Pro) | Google DeepMind / Google Cloud | Architecture, Full-Stack Engineering, Ingestion Scripts, Testing | Orchestrated repository scaffolding, FastAPI backend, React frontend components, test suites, and documentation. |
| **Specialized Subagents** (Antigravity ecosystem) | Google DeepMind | Domain Validation & Quality Assurance | - NASA Research Agent: Verified scientific parameters against NASA PSI records.<br>- Backend Agent: Verified database schemas and REST API endpoints.<br>- Frontend Agent: Verified responsive dark-theme UI components and accessibility.<br>- Testing Agent: Executed pytest and Vite production builds.<br>- Scientific Reviewer: Checked comparability logic and citation grounding. |
| **Lexical Retrieval Engine** (scikit-learn TF-IDF / BM25) | Open Source (scikit-learn) | Grounded Search & Context Retrieval | Deterministic vector retrieval over authentic NASA document chunks; operates fully offline without external API keys. |
| **Optional LLM Inference Service** | OpenAI / Gemini API (Optional backend) | Natural Language Synthesis of Retrieved Chunks | Formulates natural-language answers strictly citing retrieved passages; system includes an offline, no-API-key fallback mode that surfaces source cards directly. |

---

## 3. Human Review and Scientific Responsibility

- **Human Participant Role:** The human participant directed the problem framing, selected the official challenge ("Flame in Freefall"), reviewed all architectural and scientific logic, verified NASA PSI source eligibility, and retains ultimate ownership and accountability for the submitted project.
- **Branding Disclaimer:** IGNIS is an independent research prototype created for the NASA Space Apps Challenge 2026. It is not an official NASA product and does not claim NASA endorsement or certification for operational spacecraft fire safety.
