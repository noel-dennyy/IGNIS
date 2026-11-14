import React, { useState } from "react";
import type { AssistantAskResponse } from "../types";
import { api } from "../api/client";
import {
  MessageSquare,
  Send,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const AssistantPage: React.FC = () => {
  const [question, setQuestion] = useState("What did FLEX investigate about gaseous fire suppressants?");
  const [response, setResponse] = useState<AssistantAskResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const demoQuestions = [
    "What was the main objective of the FLEX investigation?",
    "Which gaseous suppressants does the FLEX investigation record mention?",
    "What materials and measurement systems were used in SAFFIRE-I?",
    "What does SPICE investigate about co-flow conditions and smoke points?",
    "Why can flame behaviour in microgravity differ from behaviour on Earth?",
    "What are the major differences between FLEX, SAFFIRE-I, and SPICE?",
    "What evidence in the currently indexed material is relevant to a hypothetical lunar-habitat fire research question?",
    "What are the fire safety protocols for antimatter warp drive containment?"
  ];

  const handleAsk = (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    api
      .askAssistant(q)
      .then((res) => {
        setResponse(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Assistant error:", err);
        setLoading(false);
      });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(question);
  };

  return (
    <div>
      {/* Header Info Card */}
      <div className="card card-elevated">
        <div className="card-header">
          <div className="card-title">
            <MessageSquare size={18} color="var(--accent-cyan)" />
            <span>IGNIS Citation-Grounded Research Assistant</span>
          </div>
          <span className="badge badge-green">Offline Mode (No API Key Required)</span>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "14px", lineHeight: 1.5 }}>
          Ask scientific questions regarding microgravity combustion physics, gaseous extinguishment, large-scale solid flame spread, or soot emissions. Answers are strictly synthesized from retrieved NASA document chunks with verifiable citations.
        </p>

        {/* Input Form */}
        <form onSubmit={onSubmit} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            className="input-text"
            placeholder="Ask a question about NASA microgravity combustion research..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ flexShrink: 0 }}>
            <Send size={16} />
            <span>{loading ? "Retrieving..." : "Ask IGNIS"}</span>
          </button>
        </form>

        {/* Suggested Demo Prompts */}
        <div style={{ marginTop: "14px" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "6px" }}>
            Click a verified question to test retrieval and citation grounding:
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {demoQuestions.map((dq) => (
              <button
                key={dq}
                className="btn btn-outline"
                style={{ padding: "4px 10px", fontSize: "0.75rem", borderRadius: "14px" }}
                onClick={() => {
                  setQuestion(dq);
                  handleAsk(dq);
                }}
              >
                {dq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Output Section */}
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          <Sparkles size={24} color="var(--accent-cyan)" style={{ animation: "spin 2s linear infinite", margin: "0 auto 10px" }} />
          <div>Retrieving verified passages and synthesizing grounded answer...</div>
        </div>
      ) : response ? (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              {response.status === "answered" ? (
                <CheckCircle2 size={18} color="var(--color-success)" />
              ) : (
                <AlertCircle size={18} color="var(--color-caution)" />
              )}
              <span>
                {response.status === "answered" ? "Grounded Research Synthesis" : "Insufficient Corpus Evidence Notice"}
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span className="badge badge-purple">{response.retrieval_method}</span>
              <span className={`badge ${response.status === "answered" ? "badge-green" : "badge-caution"}`}>
                {response.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Main Answer Paragraph */}
          <div
            style={{
              fontSize: "0.95rem",
              color: "var(--text-main)",
              lineHeight: 1.65,
              padding: "16px",
              backgroundColor: "var(--bg-elevated)",
              borderRadius: "6px",
              marginBottom: "16px",
              border: "1px solid var(--border-color)"
            }}
          >
            {response.answer}
          </div>

          {/* Verified Source Citations */}
          {response.citations.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                Grounding Citations ({response.citations.length} Supporting Documents)
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {response.citations.map((cit, i) => (
                  <div key={i} className="citation-box" style={{ margin: 0 }}>
                    <div className="citation-header">
                      <div>
                        <span>{cit.document_title}</span>
                        {cit.investigation_id && (
                          <span className="badge badge-cyan" style={{ marginLeft: "8px" }}>{cit.investigation_id}</span>
                        )}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                        {cit.page ? `Page ${cit.page}` : ""} {cit.doi ? `· DOI: ${cit.doi}` : ""}
                      </div>
                    </div>

                    {cit.section && (
                      <div style={{ fontSize: "0.78rem", color: "var(--accent-purple)", fontWeight: 600, marginBottom: "4px" }}>
                        Section: {cit.section}
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
                        <ExternalLink size={12} />
                        <span>Open Verified NASA Record</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Limitations and Integrity Notes */}
          {response.limitations.length > 0 && (
            <div
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.08)",
                borderLeft: "3px solid var(--color-caution)",
                padding: "12px 14px",
                borderRadius: "4px"
              }}
            >
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-caution)", marginBottom: "4px" }}>
                SCIENTIFIC SCOPE & LIMITATIONS:
              </div>
              {response.limitations.map((lim, i) => (
                <div key={i} style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  • {lim}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
