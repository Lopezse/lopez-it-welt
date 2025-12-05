"use client";

// =====================================================
// ENTERPRISE++ PROJEKT-ANALYZER UI
// =====================================================
// Erstellt: 2025-12-04
// Erweitert: 2025-12-04 – Projekt-Presets / Dropdown
// Route: /admin/ai/project-analyzer
// Features: Projekt-Auswahl, Code-Analyse, Risiko-Übersicht, Dev-Task-Erstellung
// Status: ✅ Production-Ready
// =====================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaShieldAlt,
  FaCode,
  FaUniversalAccess,
  FaRocket,
  FaBook,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaSpinner,
  FaArrowLeft,
  FaPlus,
  FaEye,
  FaHistory,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaBuilding,
  FaFolder,
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

type ProjectKey = "core" | "admin" | "ai_center" | "shop" | "security" | "docs";

interface ProjectPreset {
  key: ProjectKey;
  name: string;
  description: string;
  scanPaths: string[];
}

interface ProjectRiskItem {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  affectedFiles?: { path: string; hint?: string }[];
  recommendation: string;
}

interface ProjectAnalysisSummary {
  analyzedAt: string;
  projectKey: ProjectKey;
  projectName: string;
  scannedPaths: string[];
  architectureScore: number;
  securityScore: number;
  codeQualityScore: number;
  a11yScore: number;
  performanceScore: number;
  documentationScore: number;
  enterpriseScore: number;
  metrics: {
    consoleLogCount: number;
    anyTypeCount: number;
    todoCount: number;
    sqlTemplateQueries: number;
    dropTableCount: number;
    filesScanned: number;
    totalLines: number;
    mdFilesCount: number;
    tsFilesCount: number;
    tsxFilesCount: number;
  };
  risks: ProjectRiskItem[];
  riskCounts?: { critical: number; high: number; medium: number; low: number; total: number };
  duration?: number;
  savedId?: number;
}

interface HistoryItem {
  id: number;
  analyzedAt: string;
  projectKey: string;
  projectName: string;
  enterpriseScore: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  summaryText: string;
}

// =====================================================
// KONFIGURATION
// =====================================================

const SEVERITY_CONFIG = {
  critical: { label: "Kritisch", color: "#ef4444", bgColor: "#3b1c1c", icon: FaExclamationCircle },
  high: { label: "Hoch", color: "#f59e0b", bgColor: "#3b2f1c", icon: FaExclamationTriangle },
  medium: { label: "Mittel", color: "#3b82f6", bgColor: "#1c2a3b", icon: FaInfoCircle },
  low: { label: "Niedrig", color: "#6b7280", bgColor: "#27272a", icon: FaInfoCircle },
};

const CATEGORY_CONFIG: Record<string, { label: string; icon: typeof FaShieldAlt }> = {
  security: { label: "Sicherheit", icon: FaShieldAlt },
  "code-quality": { label: "Code-Qualität", icon: FaCode },
  architecture: { label: "Architektur", icon: FaBuilding },
  a11y: { label: "Barrierefreiheit", icon: FaUniversalAccess },
  performance: { label: "Performance", icon: FaRocket },
  docs: { label: "Dokumentation", icon: FaBook },
  other: { label: "Sonstiges", icon: FaInfoCircle },
};

// Lokale Preset-Liste (Fallback)
const DEFAULT_PRESETS: ProjectPreset[] = [
  { key: "core", name: "Gesamtes System (Lopez IT Welt)", description: "Kompletter Code inkl. Admin, AI Center, Shop und Docs.", scanPaths: ["src", "docs"] },
  { key: "admin", name: "Admin & Dashboard", description: "Admin-Bereich, Dashboard und Systemkonfiguration.", scanPaths: ["src/app/admin", "src/lib/admin"] },
  { key: "ai_center", name: "AI Center & Orchestrator", description: "AI Center, KI-Orchestrator und Dev-Orchestrator.", scanPaths: ["src/app/admin/ai", "src/lib/ai"] },
  { key: "shop", name: "Shop & Kundenverwaltung", description: "Kunden, Projekte, Rechnungen und Shop-Bereich.", scanPaths: ["src/app/(shop)", "src/lib/shop"] },
  { key: "security", name: "Sicherheit & Auth", description: "Authentifizierung, 2FA, RBAC, Sessions und Security.", scanPaths: ["src/lib/auth", "src/lib/security"] },
  { key: "docs", name: "Nur Dokumentation", description: "Markdown-Dokumentation und Status-Dateien.", scanPaths: ["docs"] },
];

// =====================================================
// KOMPONENTE
// =====================================================

export default function ProjectAnalyzerPage() {
  // State
  const [presets, setPresets] = useState<ProjectPreset[]>(DEFAULT_PRESETS);
  const [selectedProjectKey, setSelectedProjectKey] = useState<ProjectKey>("core");
  const [analysis, setAnalysis] = useState<ProjectAnalysisSummary | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter und UI State
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [expandedRiskId, setExpandedRiskId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [creatingTask, setCreatingTask] = useState<string | null>(null);

  // Ausgewähltes Preset
  const selectedPreset = presets.find((p) => p.key === selectedProjectKey) || presets[0];

  // =====================================================
  // DATEN LADEN
  // =====================================================

  const loadPresets = async () => {
    try {
      const response = await fetch("/api/admin/project-analysis?view=presets");
      const data = await response.json();
      if (data.success && data.data) {
        setPresets(data.data);
      }
    } catch (err) {
      console.error("Presets laden fehlgeschlagen:", err);
    }
  };

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await fetch("/api/admin/project-analysis?limit=10");
      const data = await response.json();
      if (data.success) {
        setHistory(data.data || []);
      }
    } catch (err) {
      console.error("History laden fehlgeschlagen:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadAnalysisById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/project-analysis?id=${id}`);
      const data = await response.json();
      if (data.success) {
        setAnalysis(data.data);
        setSelectedProjectKey(data.data.projectKey || "core");
        setShowHistory(false);
      } else {
        setError(data.error || "Fehler beim Laden der Analyse");
      }
    } catch (err) {
      setError("Fehler beim Laden der Analyse");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresets();
    loadHistory();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // =====================================================
  // ANALYSE STARTEN
  // =====================================================

  const startAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      setAnalysis(null);

      const response = await fetch("/api/admin/project-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectKey: selectedProjectKey }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
        setSuccessMessage(`✅ Analyse für "${data.data.projectName}" abgeschlossen in ${data.data.duration}ms`);
        loadHistory();
      } else {
        setError(data.error || "Fehler bei der Analyse");
      }
    } catch (err) {
      setError("Fehler bei der Projektanalyse");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ENTWICKLUNGSAUFTRAG ERSTELLEN (via Risk-to-Task API)
  // =====================================================

  const createDevTask = async (risk: ProjectRiskItem) => {
    try {
      setCreatingTask(risk.id);
      
      // Verwende die neue Risk-to-Task API für bessere Integration
      const response = await fetch("/api/admin/ai/risk-to-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          risk_id: risk.id,
          risk_type: risk.category,
          risk_severity: risk.severity,
          risk_title: risk.title,
          risk_description: `${risk.description}\n\n**Empfehlung:**\n${risk.recommendation}`,
          risk_file_path: risk.affectedFiles?.[0]?.path,
          project_code: "LOPEZ-IT-WELT",
          project_preset: selectedPreset,
          auto_plan: true,  // Agent-A automatisch starten
          created_by: "project-analyzer"
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        const taskId = data.data.task.id;
        setSuccessMessage(`✅ Dev-Task #${taskId} erstellt für "${risk.id}"${data.data.planning_started ? " – Agent-A Planung gestartet" : ""}`);
      } else if (data.existing_task_id) {
        setSuccessMessage(`ℹ️ Task #${data.existing_task_id} existiert bereits für "${risk.id}"`);
      } else {
        setError(data.error || "Fehler beim Erstellen des Auftrags");
      }
    } catch (err) {
      setError("Fehler beim Erstellen des Entwicklungsauftrags");
    } finally {
      setCreatingTask(null);
    }
  };

  // Gefilterte Risiken
  const filteredRisks = analysis?.risks.filter((risk) => severityFilter === "all" || risk.severity === severityFilter) || [];

  // Score Farbe
  const getScoreColor = (score: number) => {
    if (score < 5) return "#ef4444";
    if (score < 7) return "#f59e0b";
    return "#22c55e";
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e4e4e7]">
      {/* Header */}
      <div className="border-b border-[#27272a] bg-[#111113]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/ai" className="p-2 hover:bg-[#27272a] rounded-lg transition-colors">
                <FaArrowLeft className="h-4 w-4" />
              </Link>
              <div className="p-3 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-xl">
                <FaSearch className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Projekt-Analyzer</h1>
                <p className="text-sm text-[#71717a]">Enterprise++ Code-, Architektur- und Sicherheitsanalyse</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs rounded-full">
                🔒 READ-ONLY – keine Dateien werden verändert
              </span>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 border border-[#27272a] rounded-lg hover:bg-[#27272a] transition-colors"
              >
                <FaHistory />
                Historie
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Projekt-Auswahl */}
        <div className="mb-6 p-4 bg-[#111113] border border-[#27272a] rounded-xl">
          <div className="flex items-start gap-6 flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium mb-2">Projekt auswählen</label>
              <select
                value={selectedProjectKey}
                onChange={(e) => setSelectedProjectKey(e.target.value as ProjectKey)}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[#27272a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] disabled:opacity-50"
              >
                {presets.map((preset) => (
                  <option key={preset.key} value={preset.key}>
                    {preset.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#71717a] mt-2">{selectedPreset.description}</p>
            </div>
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FaFolder className="text-[#3b82f6]" />
                Zu scannende Ordner
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedPreset.scanPaths.map((p) => (
                  <span key={p} className="px-2 py-1 bg-[#27272a] text-[#a1a1aa] text-xs rounded font-mono">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={startAnalysis}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Analysiere...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    Analyse starten
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Erfolgs-Meldung */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 flex items-center gap-3">
            <FaCheckCircle />
            {successMessage}
          </div>
        )}

        {/* Fehler-Meldung */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaExclamationCircle />
              {error}
            </div>
            <button onClick={() => setError(null)} className="hover:underline">
              Schließen
            </button>
          </div>
        )}

        {/* Historie-Panel */}
        {showHistory && (
          <div className="mb-6 bg-[#111113] border border-[#27272a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium flex items-center gap-2">
                <FaHistory className="text-[#3b82f6]" />
                Letzte Analysen
              </h3>
              <button onClick={() => setShowHistory(false)} className="text-[#71717a] hover:text-white">
                <FaTimes />
              </button>
            </div>
            {loadingHistory ? (
              <div className="text-center py-4">
                <FaSpinner className="animate-spin mx-auto text-[#3b82f6]" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-[#71717a] text-center py-4">Noch keine Analysen durchgeführt</p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg hover:bg-[#1a1a1f] cursor-pointer"
                    onClick={() => loadAnalysisById(item.id)}
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-0.5 bg-[#27272a] text-[#a1a1aa] text-xs rounded">{item.projectKey}</span>
                        <span className="font-medium">{item.projectName}</span>
                      </div>
                      <div className="text-xs text-[#71717a] mt-1">
                        {new Date(item.analyzedAt).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold" style={{ color: getScoreColor(item.enterpriseScore) }}>
                        {item.enterpriseScore}/10
                      </span>
                      <div className="flex gap-1 text-xs">
                        {item.criticalCount > 0 && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded">{item.criticalCount} krit.</span>
                        )}
                        {item.highCount > 0 && (
                          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">{item.highCount} hoch</span>
                        )}
                      </div>
                      <FaEye className="text-[#71717a]" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Keine Analyse */}
        {!analysis && !loading && (
          <div className="text-center py-16">
            <FaSearch className="h-16 w-16 text-[#27272a] mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Keine Analyse vorhanden</h3>
            <p className="text-[#71717a] mb-6">Wähle ein Projekt und starte die Analyse.</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <FaSpinner className="h-12 w-12 text-[#3b82f6] mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium mb-2">Analysiere "{selectedPreset.name}"...</h3>
            <p className="text-[#71717a]">Scanne: {selectedPreset.scanPaths.join(", ")}</p>
          </div>
        )}

        {/* Analyse-Ergebnisse */}
        {analysis && !loading && (
          <>
            {/* Analyse-Header */}
            <div className="mb-6 p-4 bg-[#111113] border border-[#27272a] rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-[#71717a]">Projekt</div>
                  <div className="font-medium">{analysis.projectName}</div>
                </div>
                <div>
                  <div className="text-xs text-[#71717a]">Analysiert am</div>
                  <div className="font-medium">
                    {new Date(analysis.analyzedAt).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#71717a]">Dateien gescannt</div>
                  <div className="font-medium">{analysis.metrics.filesScanned.toLocaleString()}</div>
                </div>
                {analysis.duration && (
                  <div>
                    <div className="text-xs text-[#71717a]">Dauer</div>
                    <div className="font-medium">{analysis.duration}ms</div>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-[#27272a]">
                <div className="text-xs text-[#71717a] mb-1 flex items-center gap-2">
                  <FaFolder className="text-[#3b82f6]" />
                  Geprüfte Ordner
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.scannedPaths.map((p) => (
                    <span key={p} className="px-2 py-1 bg-[#27272a] text-[#a1a1aa] text-xs rounded font-mono">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Score-Kacheln */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              <div className="bg-[#111113] border border-[#27272a] rounded-xl p-4 col-span-2 md:col-span-1">
                <div className="text-xs text-[#71717a] mb-1">Enterprise Score</div>
                <div className="text-3xl font-bold" style={{ color: getScoreColor(analysis.enterpriseScore) }}>
                  {analysis.enterpriseScore}/10
                </div>
              </div>
              {[
                { key: "securityScore", label: "Security", icon: FaShieldAlt },
                { key: "codeQualityScore", label: "Code", icon: FaCode },
                { key: "architectureScore", label: "Architektur", icon: FaBuilding },
                { key: "a11yScore", label: "A11y", icon: FaUniversalAccess },
                { key: "performanceScore", label: "Performance", icon: FaRocket },
                { key: "documentationScore", label: "Docs", icon: FaBook },
              ].map(({ key, label, icon: Icon }) => {
                const score = analysis[key as keyof ProjectAnalysisSummary] as number;
                return (
                  <div key={key} className="bg-[#111113] border border-[#27272a] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-xs text-[#71717a] mb-1">
                      <Icon className="h-3 w-3" />
                      {label}
                    </div>
                    <div className="text-2xl font-bold" style={{ color: getScoreColor(score) }}>
                      {score}/10
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Metriken */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-[#111113] border border-[#27272a] rounded-xl p-3">
                <div className="text-xs text-[#71717a]">console.log</div>
                <div className="text-xl font-bold text-orange-400">{analysis.metrics.consoleLogCount}</div>
              </div>
              <div className="bg-[#111113] border border-[#27272a] rounded-xl p-3">
                <div className="text-xs text-[#71717a]">any Types</div>
                <div className="text-xl font-bold text-orange-400">{analysis.metrics.anyTypeCount}</div>
              </div>
              <div className="bg-[#111113] border border-[#27272a] rounded-xl p-3">
                <div className="text-xs text-[#71717a]">TODO/FIXME</div>
                <div className="text-xl font-bold text-blue-400">{analysis.metrics.todoCount}</div>
              </div>
              <div className="bg-[#111113] border border-[#27272a] rounded-xl p-3">
                <div className="text-xs text-[#71717a]">SQL Template</div>
                <div className="text-xl font-bold text-red-400">{analysis.metrics.sqlTemplateQueries}</div>
              </div>
              <div className="bg-[#111113] border border-[#27272a] rounded-xl p-3">
                <div className="text-xs text-[#71717a]">DROP TABLE</div>
                <div className="text-xl font-bold text-red-400">{analysis.metrics.dropTableCount}</div>
              </div>
            </div>

            {/* Risiko-Filter */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="text-sm text-[#71717a]">Filter:</span>
              {["all", "critical", "high", "medium", "low"].map((sev) => {
                const count = sev === "all" ? analysis.risks.length : analysis.risks.filter((r) => r.severity === sev).length;
                const config = sev === "all" ? { label: "Alle", color: "#71717a", bgColor: "#27272a" } : SEVERITY_CONFIG[sev as keyof typeof SEVERITY_CONFIG];
                return (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${severityFilter === sev ? "ring-2 ring-offset-2 ring-offset-[#0a0a0f]" : "opacity-60 hover:opacity-100"}`}
                    style={{ backgroundColor: config.bgColor, color: config.color }}
                  >
                    {config.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Risiko-Liste */}
            <div className="space-y-3">
              {filteredRisks.length === 0 ? (
                <div className="text-center py-8 text-[#71717a]">Keine Risiken in dieser Kategorie</div>
              ) : (
                filteredRisks.map((risk) => {
                  const sevConfig = SEVERITY_CONFIG[risk.severity];
                  const catConfig = CATEGORY_CONFIG[risk.category] || CATEGORY_CONFIG.other;
                  const SevIcon = sevConfig.icon;
                  const CatIcon = catConfig.icon;
                  const isExpanded = expandedRiskId === risk.id;

                  return (
                    <div key={risk.id} className="bg-[#111113] border border-[#27272a] rounded-xl overflow-hidden">
                      <div onClick={() => setExpandedRiskId(isExpanded ? null : risk.id)} className="p-4 cursor-pointer hover:bg-[#1a1a1f] transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: sevConfig.bgColor }}>
                            <SevIcon className="h-5 w-5" style={{ color: sevConfig.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs text-[#71717a]">{risk.id}</span>
                              <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: sevConfig.bgColor, color: sevConfig.color }}>
                                {sevConfig.label}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-[#71717a]">
                                <CatIcon className="h-3 w-3" />
                                {catConfig.label}
                              </span>
                            </div>
                            <h4 className="font-medium">{risk.title}</h4>
                            <p className="text-sm text-[#71717a] line-clamp-2">{risk.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {risk.affectedFiles && risk.affectedFiles.length > 0 && (
                              <span className="text-xs text-[#71717a]">{risk.affectedFiles.length} Dateien</span>
                            )}
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          </div>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-[#27272a] bg-[#0a0a0f] p-4">
                          <div className="mb-4">
                            <h5 className="text-sm font-medium mb-2">Beschreibung</h5>
                            <p className="text-sm text-[#a1a1aa]">{risk.description}</p>
                          </div>
                          {risk.affectedFiles && risk.affectedFiles.length > 0 && (
                            <div className="mb-4">
                              <h5 className="text-sm font-medium mb-2">Betroffene Dateien</h5>
                              <div className="space-y-1 max-h-40 overflow-y-auto">
                                {risk.affectedFiles.map((file, i) => (
                                  <div key={i} className="flex items-center justify-between text-sm font-mono p-2 bg-[#111113] rounded">
                                    <span className="text-[#71717a]">{file.path}</span>
                                    {file.hint && <span className="text-xs text-[#52525b]">{file.hint}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="mb-4">
                            <h5 className="text-sm font-medium mb-2">Empfehlung</h5>
                            <p className="text-sm text-[#a1a1aa] p-3 bg-[#111113] rounded-lg border-l-2 border-[#3b82f6]">{risk.recommendation}</p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => createDevTask(risk)}
                              disabled={creatingTask === risk.id}
                              className="flex items-center gap-2 px-4 py-2 bg-[#ffd700] hover:bg-[#ffed4a] text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                              {creatingTask === risk.id ? (
                                <>
                                  <FaSpinner className="animate-spin" />
                                  Erstelle...
                                </>
                              ) : (
                                <>
                                  <FaPlus />
                                  Als Entwicklungsauftrag anlegen
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
