"use client";

// =====================================================
// ENTERPRISE++ AI ANALYSIS MODAL
// =====================================================
// SAP/IBM/Siemens Enterprise Style
// Erstellt: 2025-12-02
// =====================================================

import { useState } from "react";
import { FaTimes, FaRobot, FaSpinner, FaCheck, FaFolder } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface AnalysisOption {
  id: string;
  label: string;
  description: string;
  icon?: string;
  category: "project" | "code" | "docs";
  enabled: boolean;
}

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: number;
    project_name: string;
    project_code?: string;
  };
  onAnalysisComplete?: (result: any) => void;
}

export default function AIAnalysisModal({
  isOpen,
  onClose,
  project,
  onAnalysisComplete,
}: AIAnalysisModalProps) {
  const [options, setOptions] = useState<AnalysisOption[]>([
    {
      id: "summary",
      label: "Projekt-Übersicht",
      description: "Zusammenfassung des aktuellen Projektstatus",
      category: "project",
      enabled: true,
    },
    {
      id: "timeline",
      label: "Zeitplan & Deadlines",
      description: "Analyse der Meilensteine und Termine",
      category: "project",
      enabled: true,
    },
    {
      id: "risks",
      label: "Risiko-Analyse",
      description: "Identifikation potenzieller Risiken und Probleme",
      category: "project",
      enabled: true,
    },
    {
      id: "next_steps",
      label: "Nächste Schritte",
      description: "Empfehlungen für die weiteren Aktivitäten",
      category: "project",
      enabled: true,
    },
    {
      id: "code_quality",
      label: "Code-Qualität (src/)",
      description: "Analyse der Codestruktur und Best Practices",
      category: "code",
      enabled: false,
    },
    {
      id: "docs_review",
      label: "Dokumentation (docs/)",
      description: "Prüfung der Projektdokumentation",
      category: "docs",
      enabled: false,
    },
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisInfo, setAnalysisInfo] = useState<{
    provider?: string;
    model?: string;
    tokensUsed?: number;
    costEstimate?: number;
  } | null>(null);

  const toggleOption = (id: string) => {
    setOptions(
      options.map((opt) =>
        opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
      )
    );
  };

  const selectAll = (category: "project" | "code" | "docs" | "all") => {
    setOptions(
      options.map((opt) =>
        category === "all" || opt.category === category
          ? { ...opt, enabled: true }
          : opt
      )
    );
  };

  const deselectAll = () => {
    setOptions(options.map((opt) => ({ ...opt, enabled: false })));
  };

  const runAnalysis = async () => {
    const selectedOptions = options.filter((o) => o.enabled).map((o) => o.id);

    if (selectedOptions.length === 0) {
      setError("Bitte mindestens eine Analyseoption auswählen.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setAnalysisInfo(null);

    try {
      const response = await fetch(
        `/api/admin/ai/projects/${project.id}/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysisTypes: selectedOptions,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Hole den letzten Insight
        const latestInsight = data.data?.[0];
        if (latestInsight) {
          setResult(latestInsight.content);
          setAnalysisInfo({
            provider: latestInsight.provider,
            model: latestInsight.model,
            tokensUsed: latestInsight.tokens_used,
            costEstimate: latestInsight.cost_estimate,
          });
        }
        onAnalysisComplete?.(data);
      } else {
        setError(data.error || "Fehler bei der Analyse");
      }
    } catch (err) {
      console.error("Analyse-Fehler:", err);
      setError("Verbindungsfehler bei der Analyse");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  const projectCategories = options.filter((o) => o.category === "project");
  const codeCategories = options.filter((o) => o.category === "code");
  const docsCategories = options.filter((o) => o.category === "docs");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-xl border shadow-2xl flex flex-col"
        style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "#272a33" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: "#ffd700" }}
            >
              <FaRobot className="text-lg" style={{ color: "#050509" }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#f4f4f4" }}>
                AI Projekt-Analyse
              </h2>
              <p className="text-sm" style={{ color: "#b3b3b3" }}>
                {project.project_name}{" "}
                {project.project_code && `(${project.project_code})`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-[#272a33]"
            style={{ color: "#b3b3b3" }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!result ? (
            <>
              {/* Quick Actions */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => selectAll("all")}
                  className="px-3 py-1 text-sm rounded-lg transition-colors border"
                  style={{
                    backgroundColor: "#272a33",
                    borderColor: "#3d4150",
                    color: "#f4f4f4",
                  }}
                >
                  Alle auswählen
                </button>
                <button
                  onClick={() => selectAll("project")}
                  className="px-3 py-1 text-sm rounded-lg transition-colors border"
                  style={{
                    backgroundColor: "#272a33",
                    borderColor: "#3d4150",
                    color: "#f4f4f4",
                  }}
                >
                  Nur Projekt
                </button>
                <button
                  onClick={deselectAll}
                  className="px-3 py-1 text-sm rounded-lg transition-colors border"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#3d4150",
                    color: "#b3b3b3",
                  }}
                >
                  Zurücksetzen
                </button>
              </div>

              {/* Projekt-Analyse */}
              <div>
                <div
                  className="flex items-center gap-2 mb-2"
                  style={{ color: "#ffd700" }}
                >
                  <FaFolder />
                  <span className="font-semibold">Projekt-Analyse</span>
                </div>
                <div className="space-y-2">
                  {projectCategories.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border"
                      style={{
                        backgroundColor: option.enabled
                          ? "#1f2329"
                          : "transparent",
                        borderColor: option.enabled ? "#ffd700" : "#272a33",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={option.enabled}
                        onChange={() => toggleOption(option.id)}
                        className="mt-1 w-4 h-4 rounded"
                        style={{ accentColor: "#ffd700" }}
                      />
                      <div className="flex-1">
                        <div
                          className="font-medium"
                          style={{ color: "#f4f4f4" }}
                        >
                          {option.label}
                        </div>
                        <div className="text-sm" style={{ color: "#b3b3b3" }}>
                          {option.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Code-Analyse */}
              <div>
                <div
                  className="flex items-center gap-2 mb-2"
                  style={{ color: "#8a3ffc" }}
                >
                  <FaFolder />
                  <span className="font-semibold">Code-Analyse</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: "#272a33", color: "#b3b3b3" }}
                  >
                    Optional
                  </span>
                </div>
                <div className="space-y-2">
                  {codeCategories.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border"
                      style={{
                        backgroundColor: option.enabled
                          ? "#1f2329"
                          : "transparent",
                        borderColor: option.enabled ? "#8a3ffc" : "#272a33",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={option.enabled}
                        onChange={() => toggleOption(option.id)}
                        className="mt-1 w-4 h-4 rounded"
                        style={{ accentColor: "#8a3ffc" }}
                      />
                      <div className="flex-1">
                        <div
                          className="font-medium"
                          style={{ color: "#f4f4f4" }}
                        >
                          {option.label}
                        </div>
                        <div className="text-sm" style={{ color: "#b3b3b3" }}>
                          {option.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dokumentations-Analyse */}
              <div>
                <div
                  className="flex items-center gap-2 mb-2"
                  style={{ color: "#24a148" }}
                >
                  <FaFolder />
                  <span className="font-semibold">Dokumentation</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: "#272a33", color: "#b3b3b3" }}
                  >
                    Optional
                  </span>
                </div>
                <div className="space-y-2">
                  {docsCategories.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border"
                      style={{
                        backgroundColor: option.enabled
                          ? "#1f2329"
                          : "transparent",
                        borderColor: option.enabled ? "#24a148" : "#272a33",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={option.enabled}
                        onChange={() => toggleOption(option.id)}
                        className="mt-1 w-4 h-4 rounded"
                        style={{ accentColor: "#24a148" }}
                      />
                      <div className="flex-1">
                        <div
                          className="font-medium"
                          style={{ color: "#f4f4f4" }}
                        >
                          {option.label}
                        </div>
                        <div className="text-sm" style={{ color: "#b3b3b3" }}>
                          {option.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#da1e28", color: "#fff" }}
                >
                  {error}
                </div>
              )}
            </>
          ) : (
            /* Result */
            <div className="space-y-4">
              {/* Success Header */}
              <div
                className="flex items-center gap-2 p-3 rounded-lg"
                style={{ backgroundColor: "#24a148/20", color: "#24a148" }}
              >
                <FaCheck />
                <span className="font-medium">Analyse abgeschlossen</span>
              </div>

              {/* Analysis Info */}
              {analysisInfo && (
                <div
                  className="flex flex-wrap gap-4 text-sm p-3 rounded-lg"
                  style={{ backgroundColor: "#1f2329" }}
                >
                  {analysisInfo.provider && (
                    <div>
                      <span style={{ color: "#b3b3b3" }}>Provider: </span>
                      <span style={{ color: "#ffd700" }}>
                        {analysisInfo.provider}
                      </span>
                    </div>
                  )}
                  {analysisInfo.model && (
                    <div>
                      <span style={{ color: "#b3b3b3" }}>Modell: </span>
                      <span style={{ color: "#f4f4f4" }}>
                        {analysisInfo.model}
                      </span>
                    </div>
                  )}
                  {analysisInfo.tokensUsed && (
                    <div>
                      <span style={{ color: "#b3b3b3" }}>Tokens: </span>
                      <span style={{ color: "#f4f4f4" }}>
                        {analysisInfo.tokensUsed}
                      </span>
                    </div>
                  )}
                  {analysisInfo.costEstimate != null && (
                    <div>
                      <span style={{ color: "#b3b3b3" }}>Kosten: </span>
                      <span style={{ color: "#f4f4f4" }}>
                        ~{parseFloat(String(analysisInfo.costEstimate)).toFixed(4)} $
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Markdown Result */}
              <div
                className="prose prose-invert max-w-none p-4 rounded-lg"
                style={{ backgroundColor: "#1f2329" }}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1
                        className="text-xl font-bold mb-3"
                        style={{ color: "#ffd700" }}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2
                        className="text-lg font-bold mt-4 mb-2"
                        style={{ color: "#f4f4f4" }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3
                        className="text-base font-semibold mt-3 mb-2"
                        style={{ color: "#f4f4f4" }}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-2" style={{ color: "#b3b3b3" }}>
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul
                        className="list-disc pl-4 mb-2"
                        style={{ color: "#b3b3b3" }}
                      >
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol
                        className="list-decimal pl-4 mb-2"
                        style={{ color: "#b3b3b3" }}
                      >
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => (
                      <strong style={{ color: "#f4f4f4" }}>{children}</strong>
                    ),
                    code: ({ children }) => (
                      <code
                        className="px-1 py-0.5 rounded text-sm"
                        style={{ backgroundColor: "#272a33", color: "#ffd700" }}
                      >
                        {children}
                      </code>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote
                        className="border-l-4 pl-4 my-2 italic"
                        style={{ borderColor: "#ffd700", color: "#b3b3b3" }}
                      >
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {result}
                </ReactMarkdown>
              </div>

              {/* New Analysis Button */}
              <button
                onClick={() => {
                  setResult(null);
                  setAnalysisInfo(null);
                }}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: "#272a33",
                  color: "#f4f4f4",
                  border: "1px solid #3d4150",
                }}
              >
                Neue Analyse starten
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!result && (
          <div
            className="flex items-center justify-between p-4 border-t"
            style={{ borderColor: "#272a33" }}
          >
            <div className="text-sm" style={{ color: "#b3b3b3" }}>
              {options.filter((o) => o.enabled).length} Analysen ausgewählt
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: "transparent",
                  color: "#b3b3b3",
                  border: "1px solid #272a33",
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#ffd700", color: "#050509" }}
              >
                {isAnalyzing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Analysiere...
                  </>
                ) : (
                  <>
                    <FaRobot />
                    Analysieren
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

