import React, { useState, useEffect, useRef } from "react";
import type { ChatMessage, SessionSummary } from "../types";
import { api } from "../api/client";
import {
  MessageSquare,
  Send,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  User,
  RotateCcw,
  BookOpen,
  Info
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
    "What was the main objective of the FLEX investigation?",
    "Which gaseous suppressants does the FLEX record mention?",
    "What materials and measurement systems were used in SAFFIRE-I?",
    "What does SPICE investigate about co-flow conditions and smoke points?",
    "Why can flame behaviour in microgravity differ from behaviour on Earth?",
    "What are the major differences between FLEX, SAFFIRE-I, and SPICE?",
    "What evidence is relevant to a lunar-habitat partial gravity fire scenario?",
    "What are the fire safety protocols for antimatter warp drive containment?"
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
    // Process markdown-like formatting for readable aerospace technical notes
    return text.split("\n\n").map((para, idx) => {
      // Bold tags
      const formatted = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <p
          key={idx}
          style={{ marginBottom: "12px", lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
      {/* Assistant Header Card */}
      <div className="card card-elevated" style={{ marginBottom: "16px" }}>
        <div className="card-header" style={{ marginBottom: "10px", paddingBottom: "10px" }}>
          <div className="card-title">
            <MessageSquare size={18} color="var(--accent-cyan)" />
            <span>IGNIS Adaptive Research Assistant</span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span className="badge badge-green">Offline Retrieval Engine</span>
            <button
              onClick={handleNewConversation}
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "4px 10px" }}
              title="Start a fresh conversation thread with cleared context"
            >
              <RotateCcw size={13} />
              <span>New Conversation</span>
            </button>
          </div>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
          Multi-turn conversational assistant with context memory, coreference understanding, and citation-grounded synthesis. Answers are strictly verified against authentic NASA Physical Sciences Informatics (PSI) records (FLEX, SAFFIRE-I, SPICE).
        </p>

        {/* Recent Session Pills */}
        {recentSessions.length > 1 && (
          <div style={{ marginTop: "10px", display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>Recent Threads:</span>
            {recentSessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setSessionId(s.id)}
                className={`badge ${s.id === sessionId ? "badge-cyan" : "badge-purple"}`}
                style={{ cursor: "pointer", border: "1px solid var(--border-color)", textTransform: "none", padding: "3px 8px" }}
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
          gap: "16px",
          minHeight: "360px",
          marginBottom: "20px"
        }}
      >
        {messages.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "30px 24px",
              textAlign: "center",
              backgroundColor: "rgba(17, 24, 39, 0.6)",
              border: "1px dashed var(--border-color)"
            }}
          >
            <Sparkles size={28} color="var(--accent-cyan)" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "1.05rem", color: "var(--text-main)", marginBottom: "6px" }}>
              Start an Adaptive Research Session
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 20px" }}>
              You can ask technical questions in natural language, request comparisons between experiments, or ask follow-up questions using pronouns like "it", "its temperature", or "what about the other one?".
            </p>

            {/* Suggested Starter Chips */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
              {starterQuestions.map((sq, i) => (
                <button
                  key={i}
                  className="btn btn-outline"
                  style={{
                    fontSize: "0.75rem",
                    padding: "6px 12px",
                    borderRadius: "16px",
                    textAlign: "left"
                  }}
                  onClick={() => handleSend(sq)}
                >
                  <PlusCircle size={13} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
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
                  style={{
                    maxWidth: isUser ? "80%" : "100%",
                    width: isUser ? "auto" : "100%",
                    backgroundColor: isUser ? "var(--bg-elevated)" : "var(--bg-surface)",
                    border: `1px solid ${isUser ? "var(--accent-cyan)" : "var(--border-color)"}`,
                    borderRadius: "8px",
                    padding: "16px 20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                  }}
                >
                  {/* Message Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                      gap: "10px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {isUser ? (
                        <>
                          <User size={15} color="var(--accent-cyan)" />
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-cyan)" }}>
                            You (Aerospace Investigator)
                          </span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} color="var(--accent-purple)" />
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-purple)" }}>
                            IGNIS Research Engine
                          </span>
                          {msg.intent && (
                            <span className="badge" style={{ fontSize: "0.65rem", padding: "1px 6px", color: "var(--text-dim)", background: "rgba(255,255,255,0.05)" }}>
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

                  {/* Reasoning Process Accordion (for assistant) */}
                  {!isUser && msg.reasoning_steps && msg.reasoning_steps.length > 0 && (
                    <div style={{ marginBottom: "12px" }}>
                      <button
                        onClick={() => toggleReasoning(index)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--text-dim)",
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          cursor: "pointer",
                          padding: "2px 0"
                        }}
                      >
                        {expandedReasoning[index] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        <span>Internal Analytical Steps ({msg.reasoning_steps.length} steps)</span>
                      </button>

                      {expandedReasoning[index] && (
                        <div
                          style={{
                            marginTop: "6px",
                            padding: "8px 12px",
                            backgroundColor: "rgba(0,0,0,0.25)",
                            borderRadius: "4px",
                            borderLeft: "2px solid var(--accent-purple)",
                            fontSize: "0.74rem",
                            color: "var(--text-muted)"
                          }}
                        >
                          {msg.reasoning_steps.map((st, sidx) => (
                            <div key={sidx} style={{ marginBottom: "3px" }}>
                              • {st}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Answer Content */}
                  <div style={{ fontSize: "0.92rem", color: "var(--text-main)", lineHeight: 1.65 }}>
                    {formatMarkdown(msg.content)}
                  </div>

                  {/* Supporting Grounding Citations */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div style={{ marginTop: "14px", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--accent-cyan)",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          marginBottom: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <BookOpen size={13} />
                        <span>Grounding Citations ({msg.citations.length} Supporting NASA Records)</span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {msg.citations.map((cit, cidx) => (
                          <div key={cidx} className="citation-box" style={{ margin: 0, padding: "10px 14px" }}>
                            <div className="citation-header">
                              <div>
                                <span>{cit.document_title}</span>
                                {cit.investigation_id && (
                                  <span className="badge badge-cyan" style={{ marginLeft: "6px" }}>
                                    {cit.investigation_id}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
                                {cit.page ? `Page ${cit.page}` : ""} {cit.doi ? `· DOI: ${cit.doi}` : ""}
                              </div>
                            </div>

                            {cit.section && (
                              <div style={{ fontSize: "0.75rem", color: "var(--accent-purple)", fontWeight: 600, marginBottom: "3px" }}>
                                Section: {cit.section}
                              </div>
                            )}

                            <div className="citation-body" style={{ fontSize: "0.78rem" }}>
                              "{cit.excerpt}"
                            </div>

                            <div style={{ marginTop: "6px" }}>
                              <a
                                href={cit.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                                style={{ fontSize: "0.7rem", padding: "2px 8px" }}
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
                        marginTop: "12px",
                        backgroundColor: "rgba(245, 158, 11, 0.07)",
                        borderLeft: "3px solid var(--color-caution)",
                        padding: "8px 12px",
                        borderRadius: "4px"
                      }}
                    >
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-caution)", marginBottom: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Info size={12} />
                        <span>SCIENTIFIC SCOPE & INTEGRITY NOTE:</span>
                      </div>
                      {msg.limitations.map((lim, lidx) => (
                        <div key={lidx} style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                          • {lim}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Context-Aware Suggested Follow-ups */}
                  {!isUser && msg.suggested_follow_ups && msg.suggested_follow_ups.length > 0 && (
                    <div style={{ marginTop: "14px", borderTop: "1px dashed var(--border-color)", paddingTop: "10px" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginBottom: "6px" }}>
                        Suggested Follow-Up Questions (Maintains Conversation Context):
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {msg.suggested_follow_ups.map((fup, fidx) => (
                          <button
                            key={fidx}
                            onClick={() => handleSend(fup)}
                            className="btn btn-outline"
                            style={{
                              fontSize: "0.72rem",
                              padding: "4px 10px",
                              borderRadius: "14px",
                              borderColor: "var(--border-highlight)"
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              width: "fit-content"
            }}
          >
            <Sparkles size={18} color="var(--accent-cyan)" style={{ animation: "spin 2s linear infinite" }} />
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Contextualizing query and synthesizing verified NASA PSI excerpts...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div
        className="card card-elevated"
        style={{
          position: "sticky",
          bottom: "16px",
          padding: "14px 18px",
          boxShadow: "0 -4px 16px rgba(0,0,0,0.3)"
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
            placeholder="Ask a question, follow-up, or comparison (e.g. 'What was its peak temperature?')..."
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
            <span>{loading ? "Analyzing..." : "Send"}</span>
          </button>
        </form>

        <div style={{ marginTop: "6px", display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-dim)" }}>
          <span>Session: <code style={{ color: "var(--accent-cyan)" }}>{sessionId}</code> (Conversational context maintained)</span>
          <span>Press Enter to send · Offline Grounded Synthesis</span>
        </div>
      </div>
    </div>
  );
};
