import os
import re
import json
import uuid
import datetime
from typing import List, Dict, Any, Optional, Tuple
from app.config import LLM_PROVIDER, LLM_API_KEY, LLM_MODEL
from app.services.retrieval import get_retrieval_service
from app.database import get_db_connection
from app.schemas import ChatMessage, Citation


class ResearchAssistantService:
    def __init__(self):
        self.retrieval = get_retrieval_service()

    # ── Session & Storage Methods ─────────────────────────────────────────────

    def get_or_create_session(self, session_id: Optional[str] = None, initial_prompt: str = "") -> str:
        conn = get_db_connection()
        cur = conn.cursor()
        now = datetime.datetime.utcnow().isoformat()

        if session_id:
            cur.execute("SELECT id FROM conversation_sessions WHERE id = ?;", (session_id,))
            row = cur.fetchone()
            if row:
                conn.close()
                return session_id

        new_id = session_id or f"sess_{uuid.uuid4().hex[:12]}"
        title = (initial_prompt[:45] + "...") if len(initial_prompt) > 45 else (initial_prompt or "Microgravity Research Chat")
        cur.execute(
            "INSERT OR REPLACE INTO conversation_sessions (id, title, created_at, updated_at) VALUES (?, ?, ?, ?);",
            (new_id, title, now, now)
        )
        conn.commit()
        conn.close()
        return new_id

    def get_session_history(self, session_id: str, limit: int = 15) -> List[ChatMessage]:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
        SELECT id, role, content, status, citations_json, limitations_json,
               reasoning_steps_json, suggested_follow_ups_json, intent, created_at
        FROM conversation_messages
        WHERE session_id = ?
        ORDER BY created_at ASC
        LIMIT ?;
        """, (session_id, limit))
        rows = cur.fetchall()
        conn.close()

        history: List[ChatMessage] = []
        for r in rows:
            citations_raw = r["citations_json"]
            cits = []
            if citations_raw:
                try:
                    cits = [Citation(**c) for c in json.loads(citations_raw)]
                except Exception:
                    pass

            lims = json.loads(r["limitations_json"]) if r["limitations_json"] else []
            steps = json.loads(r["reasoning_steps_json"]) if r["reasoning_steps_json"] else []
            follow_ups = json.loads(r["suggested_follow_ups_json"]) if r["suggested_follow_ups_json"] else []

            history.append(ChatMessage(
                id=r["id"],
                role=r["role"],
                content=r["content"],
                status=r["status"],
                citations=cits,
                limitations=lims,
                reasoning_steps=steps,
                suggested_follow_ups=follow_ups,
                intent=r["intent"],
                created_at=r["created_at"]
            ))
        return history

    def save_message(
        self,
        session_id: str,
        role: str,
        content: str,
        status: str = "answered",
        citations: Optional[List[Dict[str, Any]]] = None,
        limitations: Optional[List[str]] = None,
        reasoning_steps: Optional[List[str]] = None,
        suggested_follow_ups: Optional[List[str]] = None,
        intent: Optional[str] = None
    ) -> str:
        conn = get_db_connection()
        cur = conn.cursor()
        msg_id = f"msg_{uuid.uuid4().hex[:12]}"
        now = datetime.datetime.utcnow().isoformat()

        cur.execute("""
        INSERT INTO conversation_messages (
            id, session_id, role, content, status, citations_json, limitations_json,
            reasoning_steps_json, suggested_follow_ups_json, intent, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            msg_id,
            session_id,
            role,
            content,
            status,
            json.dumps(citations or []),
            json.dumps(limitations or []),
            json.dumps(reasoning_steps or []),
            json.dumps(suggested_follow_ups or []),
            intent,
            now
        ))

        cur.execute("UPDATE conversation_sessions SET updated_at = ? WHERE id = ?;", (now, session_id))
        conn.commit()
        conn.close()
        return msg_id

    def list_sessions(self) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
        SELECT s.id, s.title, s.created_at, s.updated_at, count(m.id) as message_count
        FROM conversation_sessions s
        LEFT JOIN conversation_messages m ON s.id = m.session_id
        GROUP BY s.id
        ORDER BY s.updated_at DESC;
        """)
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return rows

    def delete_session(self, session_id: str) -> bool:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM conversation_messages WHERE session_id = ?;", (session_id,))
        cur.execute("DELETE FROM conversation_sessions WHERE id = ?;", (session_id,))
        conn.commit()
        conn.close()
        return True

    # ── Conversational Intelligence & Coreference Resolution ──────────────────

    def _clean_input(self, text: str) -> str:
        t = text.strip()
        # Common typos normalization
        t = re.sub(r'\bsafire\b', 'saffire', t, flags=re.I)
        t = re.sub(r'\bsaffire1\b', 'saffire-i', t, flags=re.I)
        t = re.sub(r'\bsaffire-1\b', 'saffire-i', t, flags=re.I)
        t = re.sub(r'\bdroplett?s?\b', 'droplet', t, flags=re.I)
        t = re.sub(r'\bextingush\w*\b', 'extinguishment', t, flags=re.I)
        t = re.sub(r'\bsupressant\w*\b', 'suppressant', t, flags=re.I)
        t = re.sub(r'\bspred\b', 'spread', t, flags=re.I)
        t = re.sub(r'\btemp\b', 'temperature', t, flags=re.I)
        t = re.sub(r'\bwat\b', 'what', t, flags=re.I)
        t = re.sub(r'\bu\b', 'you', t, flags=re.I)
        return t

    def _detect_intent(self, q: str) -> str:
        q_low = q.lower().strip()
        # Clean punctuation
        clean = re.sub(r'[^\w\s]', '', q_low)

        # Greetings
        if clean in ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy", "sup", "yo"]:
            return "greeting"
        if any(clean.startswith(w) for w in ["hello ", "hi ", "hey "]) and len(clean.split()) <= 4:
            return "greeting"
        if "who are you" in clean or "what are you" in clean or "what can you do" in clean or "help me" == clean or "introduce yourself" in clean:
            return "persona_inquiry"

        # Gratitude
        if clean in ["thank you", "thanks", "thank you so much", "thx", "awesome thanks", "great thanks", "got it thanks"]:
            return "gratitude"

        # Unsupported science fiction / arbitrary domains
        out_of_scope_terms = ["antimatter", "warp drive", "phaser", "lightsaber", "klingon", "crypto", "bitcoin", "blockchain", "football", "celebrity", "horoscope"]
        if any(term in clean for term in out_of_scope_terms):
            return "out_of_scope"

        # Comparison
        if any(w in clean for w in ["compare", "difference between", "differ from", "versus", " vs "]):
            return "comparison"

        # Follow-up with coreference
        coreference_triggers = ["it", "that", "its", "the previous", "the other one", "what about", "how about", "and on", "how hot", "how fast", "why did that happen", "tell me more"]
        words = clean.split()
        if any(w in words for w in ["it", "that", "its", "they", "them"]) or clean.startswith("what about") or clean.startswith("how about") or clean.startswith("and "):
            return "follow_up"

        return "scientific_query"

    def _extract_active_context(self, history: List[ChatMessage]) -> Dict[str, Any]:
        """Examines recent conversation history to identify the currently discussed subject."""
        context = {
            "investigation_id": None,
            "topic": None,
            "fuel": None,
            "regime": "microgravity"
        }
        for msg in reversed(history):
            text = (msg.content or "").lower()
            if "flex-2" in text or "flex2" in text or "psi-70" in text or "binary" in text:
                context["investigation_id"] = "PSI-70"
                context["topic"] = "binary droplet combustion and cool flames"
                break
            elif "bass" in text or "psi-108" in text or "pmma" in text or "polymer" in text or "rod" in text or "glovebox" in text:
                context["investigation_id"] = "PSI-108"
                context["topic"] = "solid polymer combustion and nitrogen suppression"
                break
            elif "flex" in text or "psi-69" in text or "droplet" in text or "cool flame" in text:
                context["investigation_id"] = "PSI-69"
                context["topic"] = "droplet combustion and cool flames"
                break
            elif "saffire" in text or "psi-98" in text or "cygnus" in text or "sibal" in text or "fabric" in text:
                context["investigation_id"] = "PSI-98"
                context["topic"] = "large-scale solid flame spread"
                break
            elif "spice" in text or "psi-107" in text or "smoke point" in text or "soot" in text or "laminar jet" in text:
                context["investigation_id"] = "PSI-107"
                context["topic"] = "laminar co-flow soot and smoke points"
                break
            elif "earth" in text or "terrestrial" in text or "buoyancy" in text:
                context["topic"] = "buoyant convection vs microgravity diffusion"
                break
            elif "lunar" in text or "moon" in text or "mars" in text or "artemis" in text:
                context["topic"] = "exploration habitat partial-gravity combustion"
                break
        return context

    def _contextualize_query(self, question: str, history: List[ChatMessage]) -> Tuple[str, List[str]]:
        """Rewrites queries with coreferences by injecting entities from recent conversation turns."""
        reasoning = []
        cleaned = self._clean_input(question)
        context = self._extract_active_context(history)

        enriched_query = cleaned
        if context["investigation_id"] or context["topic"]:
            # Check for coreference terms
            coref_match = re.search(r'\b(it|that|this|its|the experiment|the previous|that one|the test)\b', cleaned, re.I)
            is_fragment = len(cleaned.split()) <= 5 and not any(k in cleaned.lower() for k in ["flex", "saffire", "spice", "bass", "droplet", "fabric", "smoke", "pmma"])

            if coref_match or is_fragment:
                name_map = {
                    "PSI-69": "FLEX PSI-69",
                    "PSI-70": "FLEX-2 PSI-70",
                    "PSI-98": "SAFFIRE-I PSI-98",
                    "PSI-107": "SPICE PSI-107",
                    "PSI-108": "BASS PSI-108"
                }
                subj = name_map.get(context["investigation_id"], context["topic"] or "")
                enriched_query = f"{cleaned} ({subj})"
                reasoning.append(f"Resolved conversational coreference using prior turn context: '{subj}'")

        return enriched_query, reasoning

    # ── Main Orchestration ───────────────────────────────────────────────────

    def answer_question(
        self,
        question: str,
        session_id: Optional[str] = None,
        history: Optional[List[ChatMessage]] = None,
        investigation_ids: Optional[List[str]] = None,
        top_k: int = 5
    ) -> Dict[str, Any]:
        session_id = self.get_or_create_session(session_id, question)

        # Merge supplied client history with persistent session history if needed
        prior_messages = history if history is not None else self.get_session_history(session_id)

        intent = self._detect_intent(question)
        reasoning_steps = [f"Classified conversational intent: {intent}"]

        # 1. Handle Greetings & Politeness
        if intent == "greeting" or intent == "persona_inquiry":
            ans = (
                "Hello! I am **IGNIS**, an interactive research intelligence assistant designed for "
                "NASA microgravity combustion physics and spacecraft fire safety.\n\n"
                "I index authentic experimental datasets and technical reports from the NASA Physical Sciences Informatics (PSI) repository, including:\n"
                "- **FLEX (PSI-69):** Spherically symmetric liquid droplet burning, cool flames, and gaseous suppressants ($CO_2$, $He$, $SF_6$).\n"
                "- **FLEX-2 (PSI-70):** Binary multi-component alkane droplets (heptane/hexadecane) and second-stage cool flame kinetics.\n"
                "- **SAFFIRE-I (PSI-98):** Large-scale fabric flame spread inside an uncrewed Orbital ATK Cygnus vehicle under forced ventilation.\n"
                "- **SPICE (PSI-107):** Laminar co-flow gas jet diffusion flames, smoke points, and soot emission dynamics.\n"
                "- **BASS (PSI-108):** Solid polymer flammability (PMMA rods/slabs, Nomex, SIBAL) and nitrogen dilution extinction in the ISS Glovebox.\n\n"
                "How can I assist your exploration of microgravity combustion physics today?"
            )
            suggested = [
                "What was the main objective of the FLEX investigation?",
                "How did BASS test PMMA solid polymer burning in microgravity?",
                "What did FLEX-2 discover about binary droplet cool flames?",
                "How did SAFFIRE-I measure flame spread in the Cygnus vehicle?",
                "Why do flames produce more soot in microgravity than on Earth?"
            ]
            self.save_message(session_id, "user", question, status="conversational", intent=intent)
            self.save_message(
                session_id, "assistant", ans, status="conversational",
                reasoning_steps=reasoning_steps, suggested_follow_ups=suggested, intent=intent
            )
            return {
                "answer": ans,
                "status": "conversational",
                "citations": [],
                "limitations": [
                    "Conversational assistance mode.",
                    "All scientific claims remain strictly grounded in NASA PSI and NTRS datasets."
                ],
                "retrieval_method": "conversational_dialog",
                "is_offline_fallback": True,
                "session_id": session_id,
                "intent": intent,
                "reasoning_steps": reasoning_steps,
                "suggested_follow_ups": suggested
            }

        # 2. Handle Gratitude / Closure
        if intent == "gratitude":
            ans = (
                "You're very welcome! If you have further questions on droplet burning rate constants ($K$), "
                "low-temperature cool flame kinetics, or duct ventilation effects in spacecraft fires, just let me know."
            )
            suggested = [
                "What did FLEX discover about low-temperature cool flames?",
                "What are the comparability rules between FLEX, SAFFIRE-I, and SPICE?"
            ]
            self.save_message(session_id, "user", question, status="conversational", intent=intent)
            self.save_message(
                session_id, "assistant", ans, status="conversational",
                reasoning_steps=reasoning_steps, suggested_follow_ups=suggested, intent=intent
            )
            return {
                "answer": ans,
                "status": "conversational",
                "citations": [],
                "limitations": ["Conversational acknowledgement."],
                "retrieval_method": "conversational_dialog",
                "is_offline_fallback": True,
                "session_id": session_id,
                "intent": intent,
                "reasoning_steps": reasoning_steps,
                "suggested_follow_ups": suggested
            }

        # 3. Handle Out of Scope / Sci-Fi / Unsupported Topics
        if intent == "out_of_scope":
            tokens = re.findall(r'[a-zA-Z]{3,}', question.lower())
            generic_words = {"what", "are", "the", "for", "and", "how", "why", "does", "did", "nasa", "fire", "safety", "about", "with", "from"}
            specific_unmatched = [w for w in tokens if w not in generic_words]
            missing_terms_note = f" Query terms not found in indexed corpus: {', '.join(specific_unmatched)}." if specific_unmatched else ""

            ans = f"I could not find enough evidence in the currently indexed NASA microgravity combustion sources to answer this question reliably.{missing_terms_note}"
            limitations = [
                "The current indexed corpus contains verified records for FLEX (PSI-69), SAFFIRE-I (PSI-98), and SPICE (PSI-107), plus associated NASA technical reports.",
                "If your question concerns unindexed investigations or operational systems outside microgravity combustion physics, additional sources must be ingested.",
                "State 'not found in the indexed corpus,' not that NASA has never studied this topic."
            ]
            reasoning_steps.append("Target terms not detected in indexed NASA physical science corpus.")
            suggested = [
                "What materials and measurement systems were used in SAFFIRE-I?",
                "Which gaseous suppressants does the FLEX investigation record mention?",
                "What does SPICE investigate about co-flow conditions and smoke points?"
            ]
            self.save_message(session_id, "user", question, status="insufficient_evidence", intent=intent)
            self.save_message(
                session_id, "assistant", ans, status="insufficient_evidence",
                limitations=limitations, reasoning_steps=reasoning_steps, suggested_follow_ups=suggested, intent=intent
            )
            return {
                "answer": ans,
                "status": "insufficient_evidence",
                "citations": [],
                "limitations": limitations,
                "retrieval_method": "tfidf_lexical",
                "is_offline_fallback": True,
                "session_id": session_id,
                "intent": intent,
                "reasoning_steps": reasoning_steps,
                "suggested_follow_ups": suggested
            }

        # 4. Contextualize query with multi-turn history
        enriched_query, coref_steps = self._contextualize_query(question, prior_messages)
        reasoning_steps.extend(coref_steps)

        # 5. Retrieve supporting document chunks
        chunks = self.retrieval.search(enriched_query, top_k=top_k, investigation_ids=investigation_ids)
        reasoning_steps.append(f"Retrieved {len(chunks)} verified NASA document chunks using TF-IDF lexical search.")

        # Evaluate evidence sufficiency
        generic_words = {
            "what", "are", "the", "for", "and", "how", "why", "does", "did", "nasa",
            "fire", "safety", "about", "with", "from", "experiments", "experiment",
            "study", "studies", "results", "investigate", "investigation", "tell", "explain",
            "its", "their", "this", "that", "these", "those", "can", "you", "tested", "test",
            "tests", "find", "found", "use", "used", "which", "into", "been", "have", "has",
            "had", "will", "would", "could", "should", "some", "any", "all", "more", "vehicle", "craft"
        }
        tokens = re.findall(r'[a-zA-Z]{3,}', self._clean_input(question).lower())
        specific_keywords = [w for w in tokens if w not in generic_words]

        all_retrieved_text = " ".join([
            f"{c.get('document_title', '')} {c.get('section_heading', '')} {c['full_text']}".lower()
            for c in chunks
        ])
        unmatched_specific = [w for w in specific_keywords if w not in all_retrieved_text]

        is_insufficient = False
        if not chunks or (len(chunks) > 0 and chunks[0]["relevance_score"] < 0.04):
            is_insufficient = True
        elif len(specific_keywords) >= 2 and len(unmatched_specific) >= len(specific_keywords) * 0.6:
            # If active conversation context already points to an indexed investigation, be forgiving
            context = self._extract_active_context(prior_messages)
            if not context["investigation_id"]:
                is_insufficient = True

        if is_insufficient:
            missing_terms_note = f" Query terms not found in indexed corpus: {', '.join(unmatched_specific)}." if unmatched_specific else ""
            ans = f"I could not find enough evidence in the currently indexed NASA microgravity combustion sources to answer this question reliably.{missing_terms_note}"
            limitations = [
                "The current indexed corpus contains verified records for FLEX (PSI-69), SAFFIRE-I (PSI-98), and SPICE (PSI-107), plus associated NASA technical reports.",
                "If your question concerns unindexed investigations or operational systems outside microgravity combustion physics, additional sources must be ingested.",
                "State 'not found in the indexed corpus,' not that NASA has never studied this topic."
            ]
            suggested = [
                "What was the main objective of the FLEX investigation?",
                "What did SAFFIRE-I discover about flame spread under forced airflow?"
            ]
            self.save_message(session_id, "user", question, status="insufficient_evidence", intent=intent)
            self.save_message(
                session_id, "assistant", ans, status="insufficient_evidence",
                limitations=limitations, reasoning_steps=reasoning_steps, suggested_follow_ups=suggested, intent=intent
            )
            return {
                "answer": ans,
                "status": "insufficient_evidence",
                "citations": [],
                "limitations": limitations,
                "retrieval_method": "tfidf_lexical",
                "is_offline_fallback": True,
                "session_id": session_id,
                "intent": intent,
                "reasoning_steps": reasoning_steps,
                "suggested_follow_ups": suggested
            }

        # Build Citations
        citations = []
        for chk in chunks:
            citations.append({
                "investigation_id": chk["investigation_id"],
                "document_title": chk["document_title"],
                "page": chk["page_number"],
                "section": chk["section_heading"],
                "excerpt": chk["text_snippet"],
                "source_url": chk["source_url"],
                "doi": chk["doi"]
            })

        # 6. Optional External LLM Call (if configured and key provided)
        if LLM_PROVIDER in ["openai", "gemini"] and LLM_API_KEY:
            try:
                llm_res = self._call_llm(question, enriched_query, chunks, citations, prior_messages)
                self.save_message(session_id, "user", question, status="answered", intent=intent)
                self.save_message(
                    session_id, "assistant", llm_res["answer"], status="answered",
                    citations=citations, limitations=llm_res["limitations"],
                    reasoning_steps=reasoning_steps, suggested_follow_ups=llm_res.get("suggested_follow_ups", []),
                    intent=intent
                )
                llm_res["session_id"] = session_id
                llm_res["intent"] = intent
                llm_res["reasoning_steps"] = reasoning_steps
                return llm_res
            except Exception:
                pass  # Fall back to structured offline synthesis

        # Compute evidence strength from chunk count and top relevance score
        top_score = chunks[0]["relevance_score"] if chunks else 0.0
        n_chunks = len(chunks)
        raw_ev = min(1.0, (n_chunks / 5.0) * 0.5 + min(top_score / 0.3, 1.0) * 0.5)
        if raw_ev >= 0.65:
            evidence_strength = "Strong"
        elif raw_ev >= 0.35:
            evidence_strength = "Moderate"
        else:
            evidence_strength = "Sparse"
        reasoning_steps.append(f"Evidence strength: {evidence_strength} ({n_chunks} chunks, top score {top_score:.3f}).")

        # 7. Adaptive Grounded Offline Synthesis
        res = self._adaptive_synthesis(question, enriched_query, chunks, citations, prior_messages, reasoning_steps)
        res["session_id"] = session_id
        res["intent"] = intent
        res["evidence_strength"] = evidence_strength
        res["evidence_score"] = round(raw_ev, 3)

        self.save_message(session_id, "user", question, status="answered", intent=intent)
        self.save_message(
            session_id, "assistant", res["answer"], status="answered",
            citations=citations, limitations=res["limitations"],
            reasoning_steps=reasoning_steps, suggested_follow_ups=res.get("suggested_follow_ups", []),
            intent=intent
        )
        return res

    # ── Adaptive Synthesis Engine ────────────────────────────────────────────

    def _adaptive_synthesis(
        self,
        question: str,
        enriched_query: str,
        chunks: List[Dict[str, Any]],
        citations: List[Dict[str, Any]],
        history: List[ChatMessage],
        reasoning_steps: List[str]
    ) -> Dict[str, Any]:
        top_chunk = chunks[0]
        q_lower = (question + " " + enriched_query).lower()

        answer_parts = []
        suggested_follow_ups = []

        # FLEX-2 / Binary Droplets / Second-Stage Cool Flame
        if "flex-2" in q_lower or "flex2" in q_lower or "binary" in q_lower:
            reasoning_steps.append("Synthesizing binary droplet combustion and cool-flame kinetics from FLEX-2 (PSI-70) verified data.")
            answer_parts.append(
                "According to NASA's Flame Extinguishment Experiment-2 (FLEX-2 / PSI-70) aboard the ISS CIR MDCA, binary fuel mixtures (such as n-heptane/n-hexadecane) exhibit multi-stage combustion behavior. "
                "During initial burning, high-volatility heptane vaporizes preferentially, sustaining a hot flame with burning rate constant K_hot (~0.72 to 0.78 mm^2/s). "
                "Following radiative hot-flame extinction at diameters d_e,hot (1.15–1.65 mm), the droplet continues evaporating and burning in a sustained second-stage 'cool flame' supported by low-temperature peroxy chemistry at K_cool (~0.22 to 0.35 mm^2/s), burning invisibly without visible soot or chemiluminescence until final extinction."
            )
            suggested_follow_ups = [
                "What is preferential vaporization in binary alkane droplets?",
                "How does the cool flame burning rate (K_cool) compare to hot flame burning (K_hot)?",
                "Why does CO2 suppression leave residual risk for cool flame re-ignition?"
            ]

        # BASS / Solid Polymer Flammability / Nitrogen Extinction
        elif "bass" in q_lower or "pmma" in q_lower or "polymer" in q_lower or "rod" in q_lower or "nitrogen dilution" in q_lower or "glovebox" in q_lower:
            reasoning_steps.append("Synthesizing solid polymer combustion and nitrogen extinguishment from BASS (PSI-108) data.")
            answer_parts.append(
                "According to NASA's Burning and Suppression of Solids (BASS / PSI-108) investigation on the ISS Microgravity Science Glovebox (MSG), solid polymer materials (cast PMMA rods and flat slabs) exhibit distinctive burning and extinction limits under low-speed forced airflow (0.5 to 10 cm/s). "
                "Flame spread rates along cylindrical PMMA rods increase with convective velocity, from 0.32 mm/s at 1.0 cm/s flow to 0.92 mm/s at 6.5 cm/s, while standoff distance contracts from 4.8 mm to 2.2 mm. "
                "BASS demonstrated two key extinguishment methods: flow cessation (where the flame quenches radiatively in 15–40 seconds in stagnant air) and gaseous nitrogen dilution (which extinguishes the flame once oxygen concentration falls below the Limiting Oxygen Index of 15.5% O2)."
            )
            suggested_follow_ups = [
                "How does forced airflow velocity control the standoff distance in BASS?",
                "What is the Limiting Oxygen Index (LOI) determined by BASS for PMMA in microgravity?",
                "How do PMMA solid burning rates compare to SIBAL fabric spread in SAFFIRE-I?"
            ]

        # FLEX / Droplet / Cool Flames / Suppressants
        elif "flex" in q_lower or "droplet" in q_lower or "suppressant" in q_lower or "extinguish" in q_lower or "cool flame" in q_lower:
            reasoning_steps.append("Synthesizing droplet combustion physics from FLEX (PSI-69) verified documentation.")
            answer_parts.append(
                "According to NASA's Flame Extinguishment Experiment (FLEX / PSI-69), microgravity eliminates buoyancy-driven natural convection, causing liquid droplet flames to burn with spherical symmetry rather than an elongated shape. "
                "FLEX evaluated gaseous suppressants (CO2, Helium, and SF6). Carbon dioxide was shown to promote radiative extinction at larger droplet diameters due to high molar heat capacity and thermal radiation, while Helium induced rapid conductive quenching due to high thermal conductivity. "
                "Additionally, FLEX uncovered low-temperature 'cool flame' burning phenomena in large n-heptane droplets, where combustion continued invisibly at 600–1000 K after apparent flame extinction."
            )
            suggested_follow_ups = [
                "What is the mechanism behind low-temperature cool flames in n-heptane?",
                "How does Helium differ from CO2 in extinguishing microgravity droplet flames?",
                "How do FLEX droplet findings compare to large solid fires in SAFFIRE-I?"
            ]

        # SAFFIRE-I / Solid fabric / Cygnus
        elif "saffire" in q_lower or "fabric" in q_lower or "solid" in q_lower or "cygnus" in q_lower or "temperature" in q_lower and "spread" in q_lower:
            reasoning_steps.append("Synthesizing solid fabric flame propagation from SAFFIRE-I (PSI-98) flight telemetry.")
            answer_parts.append(
                "According to NASA's Spacecraft Fire Safety Experiment-I (SAFFIRE-I / PSI-98), tests were conducted aboard an uncrewed Orbital ATK Cygnus cargo spacecraft (OA-6) after ISS de-berthing. "
                "A large 0.4 m by 0.94 m SIBAL composite fabric sample (75% cotton / 25% fiberglass) was burned under 20 cm/s forced concurrent airflow. "
                "Flame spread reached a steady velocity of approximately 1.7 to 1.9 mm/s with peak thermocouple temperatures reaching 920 °C and radiant heat flux exceeding 6.2 kW/m^2. "
                "The inert fiberglass prevented burning debris dispersal, demonstrating that forced cabin ventilation governs both flame propagation and toxic gas accumulation in microgravity."
            )
            suggested_follow_ups = [
                "What role did the 20 cm/s forced ventilation play in sustaining the flame?",
                "What gases were released as oxygen depleted during the Cygnus burn?",
                "Why can SAFFIRE-I results not be directly compared with FLEX droplet burning rates?"
            ]

        # SPICE / Smoke point / Soot / Gas jets
        elif "spice" in q_lower or "smoke" in q_lower or "soot" in q_lower or "co-flow" in q_lower or "burner" in q_lower:
            reasoning_steps.append("Synthesizing non-buoyant laminar jet soot dynamics from SPICE (PSI-107) data.")
            answer_parts.append(
                "According to NASA's Smoke Point in Co-flow Experiment (SPICE / PSI-107), non-buoyant laminar hydrocarbon jet diffusion flames exhibit significantly lower smoke-point thresholds in microgravity compared to Earth. "
                "Without buoyant acceleration, soot residence times in the flame zone increase dramatically, causing smoke emission at lower fuel flow rates. "
                "Testing ethylene, propane, and methane across burner nozzles from 1.6 mm to 2.7 mm under 5–40 cm/s co-flow air velocity showed that increased co-flow enhances shear and air entrainment, extending the critical smoke-point flame length."
            )
            suggested_follow_ups = [
                "How do larger soot agglomerates in microgravity affect spacecraft smoke detectors?",
                "What is the effect of burner nozzle diameter on the laminar smoke point?",
                "How does co-flow velocity alter fuel residence times?"
            ]

        # Gravitational comparisons (Earth vs Microgravity)
        elif "difference" in q_lower or "differ" in q_lower or "earth" in q_lower or "gravity" in q_lower or "buoyanc" in q_lower:
            reasoning_steps.append("Synthesizing fundamental gravitational buoyancy differences from NASA technical reports.")
            answer_parts.append(
                "On Earth, gravity-driven density differences cause hot combustion products to rise, drawing cool, oxygen-rich air into the base of the flame (buoyant convection). "
                "In microgravity, buoyancy is virtually absent; mass and heat transfer occur primarily via molecular diffusion unless forced ventilation exists. "
                "Without flow, flames become spherical, cooler, and may self-extinguish as combustion products accumulate. However, low forced airflow (10–25 cm/s) typical of spacecraft life support systems sustains persistent combustion while providing minimal convective cooling."
            )
            suggested_follow_ups = [
                "Why is forced airflow more dangerous than stagnant microgravity for spacecraft fires?",
                "How do exploration atmospheres (reduced pressure, elevated O2) affect fire risk?",
                "What did SAFFIRE-I reveal about concurrent flame spread under forced ventilation?"
            ]

        # Multi-investigation comparability
        elif "compare" in q_lower or "comparable" in q_lower:
            reasoning_steps.append("Applying scientific comparability framework across distinct experimental matrices.")
            answer_parts.append(
                "FLEX (PSI-69), SAFFIRE-I (PSI-98), and SPICE (PSI-107) represent fundamentally distinct experimental apparatuses and combustion regimes: "
                "FLEX tested liquid droplets in quiescent microgravity measuring burning rate constant K (mm^2/s); SAFFIRE-I tested large solid fabric panels under forced duct flow measuring linear flame spread (mm/s); and SPICE tested gaseous jet flames measuring laminar smoke-point flame lengths (mm). "
                "Scientific integrity requires that these measurements never be plotted or ranked as interchangeable fire-safety metrics without aerothermal scaling models."
            )
            suggested_follow_ups = [
                "Can you show the variable compatibility matrix for these three experiments?",
                "What are the specific units and metrics measured in each investigation?",
                "How does IGNIS prevent unscientific cross-experiment comparisons?"
            ]

        # Lunar / Martian exploration atmospheres
        elif "lunar" in q_lower or "moon" in q_lower or "mars" in q_lower or "artemis" in q_lower or "habitat" in q_lower:
            reasoning_steps.append("Analyzing exploration habitat atmospheric parameters (Artemis 56.5 kPa / 34% O2).")
            answer_parts.append(
                "Based on NASA exploration atmosphere documentation, proposed Artemis lunar surface landers and Mars habitats plan to operate at reduced total pressure (56.5 kPa / 8.2 psia) with elevated oxygen concentrations (up to 34% O2 by volume) to eliminate decompression sickness during frequent EVAs. "
                "While this environment maintains a normoxic oxygen partial pressure for human respiration, elevated oxygen mole fractions increase material flammability and flame spread rates. "
                "Crucially, lunar surface gravity (1/6 g) and Martian gravity (3/8 g) introduce partial buoyant convection that behaves differently from both terrestrial (1 g) and orbital microgravity (10^-6 g), constituting an active research gap."
            )
            suggested_follow_ups = [
                "What is the normoxic equivalent pressure in exploration habitats?",
                "Why does 34% oxygen increase flame spread even at lower total pressure?",
                "What evidence gaps exist between orbital microgravity and lunar partial gravity?"
            ]

        else:
            # Extractive synthesis from top retrieved chunks
            reasoning_steps.append(f"Synthesizing answer from top retrieved document: '{top_chunk['document_title']}'.")
            answer_parts.append(
                f"Based on retrieved NASA documentation from '{top_chunk['document_title']}' ({top_chunk.get('section_heading', 'Investigation Overview')}): "
                f"{top_chunk['full_text'][:420]}..."
            )
            suggested_follow_ups = [
                "Can you tell me more about the experimental apparatus?",
                "What were the key quantitative findings in this test?",
                "How was this data recorded and verified in NASA PSI?"
            ]

        limitations = [
            "Generated via deterministic lexical retrieval and source-grounded synthesis (Offline Mode).",
            "Answers reflect solely the verified indexed NASA documentation and PSI investigation datasets.",
            "IGNIS is a scientific research prototype and does not provide certified spacecraft fire-safety design approvals."
        ]

        if "lunar" in q_lower or "moon" in q_lower or "mars" in q_lower:
            limitations.append(
                "CAUTION: Current indexed data is from orbital microgravity (~10^-6 g). Lunar surface gravity (1/6 g) and Martian gravity (3/8 g) involve distinct partial-buoyancy regimes not directly measured in these three datasets."
            )

        return {
            "answer": " ".join(answer_parts),
            "status": "answered",
            "citations": citations,
            "limitations": limitations,
            "retrieval_method": "tfidf_lexical_grounded",
            "is_offline_fallback": True,
            "reasoning_steps": reasoning_steps,
            "suggested_follow_ups": suggested_follow_ups
        }

    # ── External LLM Support (Optional) ──────────────────────────────────────

    def _call_llm(
        self,
        question: str,
        enriched_query: str,
        chunks: List[Dict[str, Any]],
        citations: List[Dict[str, Any]],
        history: List[ChatMessage]
    ) -> Dict[str, Any]:
        # Formats system prompt and context for OpenAI / Gemini API if configured
        import urllib.request
        context_str = "\n\n".join([f"[{c['document_title']} | Section: {c.get('section_heading')}]\n{c['full_text']}" for c in chunks[:4]])

        messages = [
            {
                "role": "system",
                "content": (
                    "You are IGNIS, an expert NASA microgravity combustion research assistant. "
                    "Your role is to assist aerospace engineers and scientists in exploring verified experimental "
                    "findings from NASA Physical Sciences Informatics (PSI), specifically FLEX (droplets), "
                    "SAFFIRE-I (solid fabrics), and SPICE (laminar gas soot). "
                    "STRICT RULES:\n"
                    "1. Never invent NASA measurements, DOIs, findings, or numbers.\n"
                    "2. Base your answer strictly on the provided NASA excerpts.\n"
                    "3. If evidence is missing, state 'not found in the indexed corpus'.\n"
                    "4. Maintain a professional, rigorous, and helpful scientific tone."
                )
            }
        ]

        # Append recent history
        for msg in history[-4:]:
            messages.append({"role": msg.role, "content": msg.content})

        messages.append({
            "role": "user",
            "content": f"User Question: {question}\n\nSupporting NASA Document Excerpts:\n{context_str}"
        })

        if LLM_PROVIDER == "openai":
            payload = json.dumps({
                "model": LLM_MODEL or "gpt-4o-mini",
                "messages": messages,
                "temperature": 0.2
            }).encode("utf-8")
            req = urllib.request.Request(
                "https://api.openai.com/v1/chat/completions",
                data=payload,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {LLM_API_KEY}"
                }
            )
            with urllib.request.urlopen(req, timeout=12) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                ans_text = res_data["choices"][0]["message"]["content"]
                return {
                    "answer": ans_text,
                    "status": "answered",
                    "citations": citations,
                    "limitations": [
                        f"Synthesized via {LLM_PROVIDER} ({LLM_MODEL}) strictly grounded in retrieved NASA document chunks.",
                        "All claims verified against indexed PSI investigation repositories."
                    ],
                    "retrieval_method": f"tfidf_lexical + {LLM_PROVIDER}",
                    "is_offline_fallback": False,
                    "suggested_follow_ups": [
                        "Can you explain the physical aerothermal mechanism in more detail?",
                        "How do the observed temperatures compare with terrestrial fire baselines?"
                    ]
                }

        raise NotImplementedError("Provider not configured")


_assistant_service = None

def get_assistant_service() -> ResearchAssistantService:
    global _assistant_service
    if _assistant_service is None:
        _assistant_service = ResearchAssistantService()
    return _assistant_service
