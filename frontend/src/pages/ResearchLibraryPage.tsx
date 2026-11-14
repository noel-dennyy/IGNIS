import React, { useState, useEffect } from "react";
import type { SearchResult, DocumentSummary } from "../types";
import { api } from "../api/client";
import {
  BookOpen,
  Search,
  ExternalLink,
  FileText
} from "lucide-react";

export const ResearchLibraryPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("droplet extinction suppressants");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedInv, setSelectedInv] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    api.getDocuments().then((docs) => setDocuments(docs));
    // Initial search
    handleSearch("droplet extinction suppressants", "");
  }, []);

  const handleSearch = (query: string, invFilter: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    api
      .search(query, invFilter || undefined, 10)
      .then((res) => {
        setSearchResults(res);
        setIsSearching(false);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setIsSearching(false);
      });
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery, selectedInv);
  };

  return (
    <div>
      {/* Search Header Form */}
      <div className="card card-elevated">
        <div className="card-header">
          <div className="card-title">
            <Search size={18} color="var(--accent-cyan)" />
            <span>Search NASA Technical Reports & Peer-Reviewed Literature</span>
          </div>
          <span className="badge badge-cyan">TF-IDF Vector Retrieval</span>
        </div>

        <form onSubmit={onFormSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ flexGrow: 1, minWidth: "280px" }}>
            <input
              type="text"
              className="input-text"
              placeholder="e.g. 'cool flame discovery', 'saffire flame spread rate', 'smoke point co-flow'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="select-box"
            value={selectedInv}
            onChange={(e) => {
              setSelectedInv(e.target.value);
              handleSearch(searchQuery, e.target.value);
            }}
          >
            <option value="">All Investigations</option>
            <option value="PSI-69">FLEX (PSI-69)</option>
            <option value="PSI-98">SAFFIRE-I (PSI-98)</option>
            <option value="PSI-107">SPICE (PSI-107)</option>
          </select>

          <button type="submit" className="btn btn-primary">
            <Search size={16} />
            <span>Search Corpus</span>
          </button>
        </form>

        {/* Suggested Quick Searches */}
        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: "0.78rem" }}>
          <span style={{ color: "var(--text-dim)" }}>Suggested queries:</span>
          {["gaseous suppressants CO2 He", "cool flames low temperature", "large-scale solid flame spread", "co-flow velocity smoke point"].map((q) => (
            <button
              key={q}
              className="btn btn-outline"
              style={{ padding: "2px 8px", fontSize: "0.75rem" }}
              onClick={() => {
                setSearchQuery(q);
                handleSearch(q, selectedInv);
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <BookOpen size={18} color="var(--accent-purple)" />
            <span>Retrieved Evidence Passages ({searchResults.length} Matches)</span>
          </div>
        </div>

        {isSearching ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            Searching authentic NASA documents...
          </div>
        ) : searchResults.length === 0 && hasSearched ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            No matching passages found in the indexed corpus. Try adjusting your query terms.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {searchResults.map((hit) => (
              <div
                key={hit.chunk_id}
                className="citation-box"
                style={{ backgroundColor: "var(--bg-elevated)", borderLeft: "3px solid var(--accent-cyan)", margin: 0 }}
              >
                <div className="citation-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>
                      {hit.document_title}
                    </span>
                    {hit.investigation_id && (
                      <span className="badge badge-cyan">{hit.investigation_id}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                    {hit.page_number && <span>Page: {hit.page_number}</span>}
                    <span className="score-pill" style={{ fontSize: "0.75rem", padding: "2px 6px" }}>
                      Score: {hit.relevance_score}
                    </span>
                  </div>
                </div>

                {hit.section_heading && (
                  <div style={{ fontSize: "0.8rem", color: "var(--accent-purple)", fontWeight: 600, marginBottom: "4px" }}>
                    Section: {hit.section_heading}
                  </div>
                )}

                <div className="citation-body" style={{ color: "var(--text-main)", fontStyle: "normal", fontSize: "0.85rem" }}>
                  "{hit.text_snippet}"
                </div>

                <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
                  <a
                    href={hit.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ fontSize: "0.75rem", padding: "3px 8px" }}
                  >
                    <ExternalLink size={12} />
                    <span>Open NASA Source ({hit.doi || "NTRS"})</span>
                  </a>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                    Chunk ID: {hit.chunk_id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Indexed Document Catalog */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FileText size={18} color="var(--accent-cyan)" />
            <span>Indexed NASA Publication Corpus ({documents.length} Documents)</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                padding: "14px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <span className="badge badge-purple">{doc.document_type}</span>
                {doc.investigation_id && <span className="badge badge-cyan">{doc.investigation_id}</span>}
              </div>
              <h3 style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "4px" }}>
                {doc.title}
              </h3>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                Authors: {doc.authors || "NASA Glenn Research Center"} ({doc.publication_date})
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", lineHeight: 1.4, marginBottom: "10px" }}>
                {doc.abstract ? `${doc.abstract.substring(0, 140)}...` : ""}
              </p>
              <a
                href={doc.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ fontSize: "0.75rem", padding: "4px 8px" }}
              >
                <span>Read Original Document</span>
                <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
