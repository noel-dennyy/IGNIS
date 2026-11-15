import React, { useState, useEffect, useRef } from "react";
import type { ChatMessage, SessionSummary } from "../types";
import { api } from "../api/client";
import {
  MessageSquare,
  Send,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  User,
  RotateCcw,
  BookOpen,
  Info,
  Flame,
  Radio,
  Cpu
} from "lucide-react";

export const AssistantPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string>(() => {
    return localStorage.getItem("ignis_chat_session_id") || `sess_${Math.random().toString(36).substring(2, 10)}`;
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<number, boolean>>({});
  const [recentSessions, setRecentSessions] = useState<SessionSummary[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterQuestions = [
    "What was the primary scientific objective of the FLEX investigation?",
    "Which gaseous suppressants (CO2, He, SF6) were evaluated in FLEX droplet tests?",
    "What materials and thermocouple measurement systems were deployed in SAFFIRE-I?",
    "How does SPICE characterize co-flow flame lengths and smoke point thresholds?",
    "Compare PMMA solid burn extinction in BASS against SIBAL fabric in SAFFIRE-I.",
    "Why does microgravity suppress buoyant convective draft in orbital flames?",
    "What are the fire safety implications for a 34% O2 lunar surface habitat?"
  ];

  // Load existing session history or set welcome message
  useEffect(() => {
    localStorage.setItem("ignis_chat_session_id", sessionId);
    api
      .getAssistantSession(sessionId)
      .then((detail) => {
        if (detail && detail.messages && detail.messages.length > 0) {
          setMessages(detail.messages);
        } else {
          setMessages([]);
        }
      })
      .catch(() => {
        setMessages([]);
      });

    // Load recent sessions list
    api
      .getAssistantSessions()
      .then((sessions) => {
        if (Array.isArray(sessions)) setRecentSessions(sessions.slice(0, 5));
      })
      .catch(() => {});
  }, [sessionId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: q,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    api
      .askAssistant(q, {
        sessionId,
        history: messages
      })
      .then((res) => {
        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: res.answer,
          status: res.status,
          citations: res.citations || [],
          limitations: res.limitations || [],
          reasoning_steps: res.reasoning_steps || [],
          suggested_follow_ups: res.suggested_follow_ups || [],
          intent: res.intent,
          evidence_strength: res.evidence_strength,
          evidence_score: res.evidence_score,
          created_at: new Date().toISOString()
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setLoading(false);

        // Refresh recent sessions
        api
          .getAssistantSessions()
          .then((sessions) => {
            if (Array.isArray(sessions)) setRecentSessions(sessions.slice(0, 5));
          })
          .catch(() => {});
      })
      .catch((err) => {
        console.error("Assistant error:", err);
        const errorMsg: ChatMessage = {
          role: "assistant",
          content: "Encountered an unexpected error processing your query. Please retry or rephrase your question.",
          status: "insufficient_evidence",
          created_at: new Date().toISOString()
        };
        setMessages((prev) => [...prev, errorMsg]);
        setLoading(false);
      });
  };

  const handleNewConversation = () => {
    const newId = `sess_${Math.random().toString(36).substring(2, 10)}`;
    setSessionId(newId);
    setMessages([]);
    setInput("");
  };

  const toggleReasoning = (index: number) => {
    setExpandedReasoning((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatMarkdown = (text: string) => {
    return text.split("\n\n").map((para, idx) => {
      const formatted = para
        .replace(/\*\*(.*?)\*\*/g, "<strong style='color: var(--text-primary)'>$1</strong>")
        .replace(/`([^`]+)`/g, "<code style='background: rgba(255,118,38,0.1); color: var(--accent-molten); padding: 1px 5px; border-radius: 3px; font-family: var(--font-mono); font-size: 0.85em;'>$1</code>");
      return (
        <p
          key={idx}
          style={{ marginBottom: "12px", lineHeight: 1.65 }}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
      {/* Assistant Header HUD Card */}
      <div className="card hud-panel" style={{ marginBottom: "20px" }}>
        <div className="card-header" style={{ marginBottom: "12px", paddingBottom: "10px" }}>
          <div className="card-title">
            <Cpu size={20} color="var(--accent-molten)" />
            <span>IGNIS Autonomous Microgravity Research Engine</span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span className="badge badge-molten" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Radio size={12} />
              <span>OFFLINE RAG CORE</span>
            </span>
            <button
              onClick={handleNewConversation}
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "4px 10px" }}
              title="Start a fresh conversation thread with cleared context"
            >
              <RotateCcw size={13} />
              <span>Reset Context</span>
            </button>
          </div>
        </div>

        <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          Multi-turn conversational assistant with context memory, coreference resolution, and citation-grounded synthesis. 
          Every assertion is strictly cross-referenced against authentic NASA Physical Sciences Informatics (PSI) flight records (FLEX, FLEX-2, SAFFIRE-I, SPICE, BASS).
        </p>

        {/* Recent Session Pills */}
        {recentSessions.length > 1 && (
          <div style={{ marginTop: "12px", display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>PRIOR SESSIONS:</span>
            {recentSessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setSessionId(s.id)}
                className={`badge ${s.id === sessionId ? "badge-molten" : "badge-cyan"}`}
                style={{ cursor: "pointer", textTransform: "none", padding: "3px 8px" }}
              >
                {s.title || s.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Conversation Stream Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          minHeight: "360px",
          marginBottom: "24px"
        }}
      >
        {messages.length === 0 ? (
          <div
            className="card hud-panel"
            style={{
              padding: "36px 24px",
              textAlign: "center",
              backgroundColor: "rgba(17, 24, 32, 0.7)",
              border: "1px dashed var(--border-color)"
            }}
          >
            <Flame size={32} className="brand-flame-icon" style={{ margin: "0 auto 14px" }} />
            <h3 style={{ fontSize: "1.15rem", color: "var(--text-primary)", marginBottom: "8px", fontWeight: 700 }}>
              Autonomous Combustion Intelligence Terminal
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "640px", margin: "0 auto 24px", lineHeight: 1.6 }}>
              Submit research inquiries in natural language, request multi-variable cross-payload comparisons, or probe hypothetical spaceflight fire scenarios. 
              Maintains full conversational memory and coreference across turns.
            </p>

            {/* Suggested Starter Chips */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", maxWidth: "900px", margin: "0 auto" }}>
              {starterQuestions.map((sq, i) => (
                <button
                  key={i}
                  className="btn btn-outline"
                  style={{
                    fontSize: "0.75rem",
                    padding: "6px 12px",
                    borderRadius: "16px",
                    textAlign: "left",
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-elevated)"
                  }}
                  onClick={() => handleSend(sq)}
                >
                  <PlusCircle size={13} color="var(--accent-molten)" style={{ flexShrink: 0 }} />
                  <span>{sq}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isUser ? "flex-end" : "flex-start",
                  width: "100%"
                }}
              >
                {/* Message Bubble Container */}
                <div
                  className={!isUser ? "card hud-panel" : "card"}
                  style={{
                    maxWidth: isUser ? "80%" : "100%",
                    width: isUser ? "auto" : "100%",
                    backgroundColor: isUser ? "var(--bg-elevated)" : "var(--bg-surface)",
                    borderColor: isUser ? "var(--accent-molten)" : "var(--border-color)",
                    borderRadius: "8px",
                    padding: "18px 22px",
                    boxShadow: isUser 
                      ? "0 4px 14px rgba(255, 118, 38, 0.15)" 
                      : "0 4px 20px rgba(0, 0, 0, 0.35)",
                    marginBottom: 0
                  }}
                >
                  {/* Message Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                      gap: "10px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {isUser ? (
                        <>
                          <User size={15} color="var(--accent-molten)" />
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-molten)", fontFamily: "var(--font-mono)" }}>
                            AEROSPACE RESEARCHER
                          </span>
                        </>
                      ) : (
                        <>
                          <Flame size={15} className="brand-flame-icon" />
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-molten)", fontFamily: "var(--font-mono)" }}>
                            IGNIS COMBUSTION INTELLIGENCE
                          </span>
                          {msg.intent && (
                            <span className="badge badge-cyan" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                              {msg.intent}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {!isUser && (
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        {msg.status === "answered" ? (
                          <span className="badge badge-green" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <CheckCircle2 size={11} /> Grounded
                          </span>
                        ) : msg.status === "conversational" ? (
                          <span className="badge badge-cyan" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <MessageSquare size={11} /> Dialogue
                          </span>
                        ) : (
                          <span className="badge badge-caution" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <AlertCircle size={11} /> Evidence Gap
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Evidence Strength Indicator (for assistant) */}
                  {!isUser && msg.evidence_strength && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "14px",
                        padding: "8px 12px",
                        backgroundColor: "var(--bg-elevated)",
                        borderRadius: "6px",
                        border: "1px solid var(--border-color)",
                        fontFamily: "var(--font-mono)"
                      }}
                    >
                      <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                        EVIDENCE FIDELITY:
                      </span>
                      <span
                        className={`badge ${
                          msg.evidence_strength === "Strong"
                            ? "badge-green"
                            : msg.evidence_strength === "Moderate"
                            ? "badge-cyan"
                            : "badge-caution"
                        }`}
                        style={{ fontSize: "0.7rem", padding: "2px 8px" }}
                      >
                        {msg.evidence_strength}
                      </span>
                      {typeof msg.evidence_score === "number" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexGrow: 1, maxWidth: "180px" }}>
                          <div className="evidence-bar-track">
                            <div
                              className="evidence-bar-fill"
                              style={{
                                width: `${Math.round(msg.evidence_score * 100)}%`,
                                backgroundColor:
                                  msg.evidence_strength === "Strong"
                                    ? "var(--color-success)"
                                    : msg.evidence_strength === "Moderate"
                                    ? "var(--accent-cyan)"
                                    : "var(--accent-amber)"
                              }}
                            />
                          </div>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                            {Math.round(msg.evidence_score * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reasoning Process Accordion (for assistant) */}
                  {!isUser && msg.reasoning_steps && msg.reasoning_steps.length > 0 && (
                    <div style={{ marginBottom: "14px" }}>
                      <button
                        onClick={() => toggleReasoning(index)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--text-dim)",
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          cursor: "pointer",
                          padding: "2px 0",
                          fontFamily: "var(--font-mono)"
                        }}
                      >
                        {expandedReasoning[index] ? <ChevronDown size={14} color="var(--accent-cyan)" /> : <ChevronRight size={14} color="var(--accent-cyan)" />}
                        <span>Internal Analytical Execution ({msg.reasoning_steps.length} logic steps)</span>
                      </button>

                      {expandedReasoning[index] && (
                        <div
                          style={{
                            marginTop: "8px",
                            padding: "10px 14px",
                            backgroundColor: "rgba(8, 11, 16, 0.6)",
                            borderRadius: "4px",
                            borderLeft: "2px solid var(--accent-cyan)",
                            fontSize: "0.76rem",
                            color: "var(--text-secondary)",
                            fontFamily: "var(--font-mono)"
                          }}
                        >
                          {msg.reasoning_steps.map((st, sidx) => (
                            <div key={sidx} style={{ marginBottom: "4px" }}>
                              <span style={{ color: "var(--accent-cyan)", marginRight: "6px" }}>&gt;</span>
                              {st}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Answer Content */}
                  <div style={{ fontSize: "0.92rem", color: "var(--text-primary)", lineHeight: 1.65 }}>
                    {formatMarkdown(msg.content)}
                  </div>

                  {/* Supporting Grounding Citations */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
                      <div
                        style={{
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          color: "var(--accent-cyan)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontFamily: "var(--font-mono)"
                        }}
                      >
                        <BookOpen size={14} />
                        <span>NASA PSI Grounding Citations ({msg.citations.length} Verified Sources)</span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {msg.citations.map((cit, cidx) => (
                          <div key={cidx} className="citation-box" style={{ margin: 0, padding: "12px 16px" }}>
                            <div className="citation-header">
                              <div>
                                <span>{cit.document_title}</span>
                                {cit.investigation_id && (
                                  <span className="badge badge-molten" style={{ marginLeft: "8px" }}>
                                    {cit.investigation_id}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
                                {cit.page ? `Page ${cit.page}` : ""} {cit.doi ? `· DOI: ${cit.doi}` : ""}
                              </div>
                            </div>

                            {cit.section && (
                              <div style={{ fontSize: "0.75rem", color: "var(--accent-amber)", fontWeight: 600, marginBottom: "4px", fontFamily: "var(--font-mono)" }}>
                                SECTION: {cit.section}
                              </div>
                            )}

                            <div className="citation-body">
                              "{cit.excerpt}"
                            </div>

                            <div style={{ marginTop: "8px" }}>
                              <a
                                href={cit.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                                style={{ fontSize: "0.72rem", padding: "3px 8px" }}
                              >
                                <ExternalLink size={11} />
                                <span>Open Verified NASA Record</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scope & Limitations Disclosure */}
                  {!isUser && msg.limitations && msg.limitations.length > 0 && (
                    <div
                      style={{
                        marginTop: "14px",
                        backgroundColor: "rgba(255, 181, 71, 0.08)",
                        borderLeft: "3px solid var(--accent-amber)",
                        padding: "10px 14px",
                        borderRadius: "4px"
                      }}
                    >
                      <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--accent-amber)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-mono)" }}>
                        <Info size={13} />
                        <span>SCIENTIFIC BOUNDARY &amp; INTEGRITY DISCLOSURE:</span>
                      </div>
                      {msg.limitations.map((lim, lidx) => (
                        <div key={lidx} style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                          • {lim}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Context-Aware Suggested Follow-ups */}
                  {!isUser && msg.suggested_follow_ups && msg.suggested_follow_ups.length > 0 && (
                    <div style={{ marginTop: "16px", borderTop: "1px dashed var(--border-color)", paddingTop: "12px" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginBottom: "8px", fontFamily: "var(--font-mono)" }}>
                        SUGGESTED REASONING FOLLOW-UPS:
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {msg.suggested_follow_ups.map((fup, fidx) => (
                          <button
                            key={fidx}
                            onClick={() => handleSend(fup)}
                            className="btn btn-outline"
                            style={{
                              fontSize: "0.74rem",
                              padding: "4px 12px",
                              borderRadius: "14px",
                              backgroundColor: "var(--bg-elevated)",
                              borderColor: "var(--border-color)"
                            }}
                          >
                            <span>{fup}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {loading && (
          <div
            className="card hud-panel"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 20px",
              width: "fit-content",
              marginBottom: 0
            }}
          >
            <Flame size={20} className="brand-flame-icon" />
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
              SYNTHESIZING VERIFIED NASA PSI EXCERPTS &amp; MAPPING FLUID REGIMES...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div
        className="card hud-panel"
        style={{
          position: "sticky",
          bottom: "16px",
          padding: "14px 18px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.5)",
          zIndex: 25
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <input
            type="text"
            className="input-text"
            placeholder="Ask a technical combustion question, comparison, or follow-up (e.g. 'What was the peak burning rate?')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{ flex: 1, padding: "12px 16px" }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !input.trim()}
            style={{ padding: "12px 20px", flexShrink: 0 }}
          >
            <Send size={16} />
            <span>{loading ? "Analyzing..." : "Transmit"}</span>
          </button>
        </form>

        <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
          <span>SESSION: <code style={{ color: "var(--accent-molten)" }}>{sessionId}</code></span>
          <span>NASA PSI GROUNDED // NO HALLUCINATION DISCLOSURE</span>
        </div>
      </div>
    </div>
  );
};
