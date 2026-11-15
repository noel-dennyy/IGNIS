import React, { useState, useEffect, useRef } from "react";
import type { ChatMessage, SessionSummary } from "../types";
import { api } from "../api/client";
import {
  Send,
  ExternalLink,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertTriangle
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
    "What was the main scientific objective of the FLEX investigation?",
    "Which gaseous suppressants (CO2, He, SF6) were evaluated in FLEX droplet tests?",
    "What materials and thermocouple systems were deployed in SAFFIRE-I?",
    "How does SPICE characterize co-flow flame lengths and smoke point soot limits?",
    "Compare PMMA solid burn extinction in BASS against SIBAL fabric in SAFFIRE-I.",
    "Why does microgravity suppress buoyant convective draft in orbital flames?",
    "What are the fire safety implications for a 34% O2 lunar surface habitat?"
  ];

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

    api
      .getAssistantSessions()
      .then((sessions) => {
        if (Array.isArray(sessions)) setRecentSessions(sessions.slice(0, 5));
      })
      .catch(() => {});
  }, [sessionId]);

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
          content: "Unable to process the query against the NASA PSI index. Please verify your query or rephrase.",
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
        .replace(/\*\*(.*?)\*\*/g, "<strong style='color: var(--text-primary); font-weight: 600;'>$1</strong>")
        .replace(/`([^`]+)`/g, "<code style='background: rgba(255,255,255,0.06); color: var(--accent-molten); padding: 1px 4px; border-radius: 3px; font-family: var(--font-mono); font-size: 0.88em;'>$1</code>");
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
    <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "calc(100vh - 120px)" }}>
      
      {/* Session Controls Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: "12px",
        marginBottom: "20px",
        borderBottom: "1px solid var(--border-color)",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Session Thread
          </span>
          <span style={{ fontSize: "0.74rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            {sessionId}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {recentSessions.length > 1 && (
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginRight: "4px" }}>History:</span>
              {recentSessions.slice(0, 3).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSessionId(s.id)}
                  className="btn btn-outline"
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 7px",
                    borderColor: s.id === sessionId ? "var(--accent-molten)" : "var(--border-color)",
                    color: s.id === sessionId ? "var(--accent-molten)" : "var(--text-secondary)"
                  }}
                >
                  {s.title ? (s.title.length > 16 ? s.title.slice(0, 16) + "…" : s.title) : s.id.slice(0, 8)}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleNewConversation}
            className="btn btn-secondary"
            style={{ fontSize: "0.75rem", padding: "4px 9px" }}
            title="Start a fresh conversation thread with cleared context"
          >
            <RotateCcw size={12} />
            <span>New Thread</span>
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
        {messages.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
              Grounded Combustion Research Assistant
            </h3>
            <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 24px", lineHeight: 1.6 }}>
              Ask technical questions regarding microgravity flame experiments, gaseous suppressants, droplet regression rates,
              solid flammability limits, or hypothetical spacecraft fire scenarios. Answers are strictly cross-referenced against authentic NASA PSI publications.
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", maxWidth: "760px", margin: "0 auto" }}>
              {starterQuestions.map((q, i) => (
                <button
                  key={i}
                  className="btn btn-outline"
                  style={{
                    fontSize: "0.76rem",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    textAlign: "left",
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)"
                  }}
                  onClick={() => handleSend(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === "user";

            if (isUser) {
              return (
                <div key={index} style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                  <div style={{
                    maxWidth: "75%",
                    backgroundColor: "var(--bg-elevated)",
                    border: "1px solid #23344D",
                    borderRadius: "8px 8px 2px 8px",
                    padding: "10px 15px",
                    fontSize: "0.88rem",
                    color: "var(--text-primary)",
                    lineHeight: 1.55
                  }}>
                    {msg.content}
                  </div>
                </div>
              );
            }

            // Assistant Response
            return (
              <div key={index} style={{ display: "flex", flexDirection: "column", width: "100%", paddingBottom: "16px", borderBottom: "1px solid var(--border-color)" }}>
                
                {/* Response Meta Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "var(--accent-molten)", fontWeight: 600, fontSize: "0.82rem" }}>
                      <Flame size={14} />
                      <span>IGNIS</span>
                    </div>

                    {msg.evidence_strength && (
                      <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                        · Evidence: <strong style={{ color: msg.evidence_strength === "Strong" ? "var(--color-success)" : msg.evidence_strength === "Moderate" ? "var(--accent-cyan)" : "var(--accent-amber)" }}>{msg.evidence_strength}</strong>
                        {typeof msg.evidence_score === "number" && ` (${Math.round(msg.evidence_score * 100)}%)`}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {msg.status === "answered" && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "var(--color-success)" }}>
                        <CheckCircle2 size={12} /> Grounded
                      </span>
                    )}
                    {msg.status === "insufficient_evidence" && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "var(--accent-amber)" }}>
                        <AlertTriangle size={12} /> Evidence Gap
                      </span>
                    )}
                  </div>
                </div>

                {/* Analytical Steps Toggle */}
                {msg.reasoning_steps && msg.reasoning_steps.length > 0 && (
                  <div style={{ marginBottom: "12px" }}>
                    <button
                      onClick={() => toggleReasoning(index)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-dim)",
                        fontSize: "0.74rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        cursor: "pointer",
                        padding: 0
                      }}
                    >
                      {expandedReasoning[index] ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      <span>Analysis pathway ({msg.reasoning_steps.length} steps)</span>
                    </button>

                    {expandedReasoning[index] && (
                      <div style={{
                        marginTop: "6px",
                        padding: "8px 12px",
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "4px",
                        fontSize: "0.76rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5
                      }}>
                        {msg.reasoning_steps.map((st, sidx) => (
                          <div key={sidx} style={{ marginBottom: "3px" }}>
                            • {st}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Text Content */}
                <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.65 }}>
                  {formatMarkdown(msg.content)}
                </div>

                {/* Scope & Limitations Note */}
                {msg.limitations && msg.limitations.length > 0 && (
                  <div style={{
                    marginTop: "12px",
                    padding: "8px 12px",
                    backgroundColor: "rgba(245, 158, 11, 0.05)",
                    borderLeft: "2px solid var(--accent-amber)",
                    borderRadius: "3px",
                    fontSize: "0.76rem",
                    color: "var(--text-secondary)"
                  }}>
                    <strong style={{ color: "var(--accent-amber)", display: "block", marginBottom: "2px" }}>Measurement Scope &amp; Physical Bounds:</strong>
                    {msg.limitations.map((lim, lidx) => (
                      <div key={lidx} style={{ marginTop: "2px" }}>• {lim}</div>
                    ))}
                  </div>
                )}

                {/* Grounding Reference Links */}
                {msg.citations && msg.citations.length > 0 && (
                  <div style={{ marginTop: "14px" }}>
                    <div style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--text-dim)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      marginBottom: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}>
                      <BookOpen size={12} />
                      <span>References ({msg.citations.length} NASA records)</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {msg.citations.map((cit, cidx) => (
                        <div
                          key={cidx}
                          style={{
                            padding: "8px 10px",
                            backgroundColor: "var(--bg-surface)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "4px",
                            fontSize: "0.76rem"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                              {cit.document_title}
                              {cit.investigation_id && (
                                <span className="badge badge-cyan" style={{ marginLeft: "6px" }}>
                                  {cit.investigation_id}
                                </span>
                              )}
                            </span>
                            {cit.doi && (
                              <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
                                DOI: {cit.doi}
                              </span>
                            )}
                          </div>

                          <div style={{ color: "var(--text-secondary)", fontStyle: "italic", marginBottom: "4px" }}>
                            "{cit.excerpt}"
                          </div>

                          {cit.source_url && (
                            <a
                              href={cit.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--accent-cyan)", fontSize: "0.7rem" }}
                            >
                              <span>View in NASA PSI Repository</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-Ups */}
                {msg.suggested_follow_ups && msg.suggested_follow_ups.length > 0 && (
                  <div style={{ marginTop: "12px", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Related queries:</span>
                    {msg.suggested_follow_ups.map((fup, fidx) => (
                      <button
                        key={fidx}
                        onClick={() => handleSend(fup)}
                        className="btn btn-outline"
                        style={{
                          fontSize: "0.72rem",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          backgroundColor: "transparent",
                          borderColor: "var(--border-color)"
                        }}
                      >
                        {fup}
                      </button>
                    ))}
                  </div>
                )}

              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 0", color: "var(--text-dim)", fontSize: "0.82rem" }}>
            <Flame size={14} className="brand-flame-icon" />
            <span>Consulting NASA PSI repository documents...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Docked Message Composer */}
      <div style={{
        position: "sticky",
        bottom: "16px",
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "6px",
        padding: "10px 14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
      }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
        >
          <input
            type="text"
            className="input-text"
            placeholder="Ask a microgravity combustion question or follow-up..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{ flex: 1, padding: "8px 12px", fontSize: "0.86rem" }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !input.trim()}
            style={{ padding: "8px 14px", flexShrink: 0 }}
          >
            <Send size={14} />
            <span>{loading ? "Searching..." : "Send"}</span>
          </button>
        </form>

        <div style={{ marginTop: "6px", display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-dim)" }}>
          <span>Grounded in NASA TM publications &amp; verified PSI datasets</span>
          <span>Press Enter to send</span>
        </div>
      </div>

    </div>
  );
};
