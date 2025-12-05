"use client";

import { useEffect, useState } from "react";
import {
  FaSync,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaRobot,
  FaChartLine,
  FaLayerGroup,
  FaTasks,
  FaPlay,
  FaPlus,
  FaUser,
  FaRocket,
  FaShieldAlt,
  FaTimesCircle,
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

type AgentType = "plan" | "build" | "run";
type SollStatus = "open" | "planned" | "required";
type IstStatus = "open" | "in_progress" | "done";
type TaskStatus = "open" | "in_progress" | "done";
type Priority = "low" | "medium" | "high";

interface ModuleWithProgress {
  id: number;
  category: string;
  module_name: string;
  description: string;
  priority: Priority;
  soll_status: SollStatus;
  ist_status: IstStatus;
  progress_percent: number;
  responsible_agent: AgentType;
  comment: string;
}

interface AgentTask {
  id: number;
  title: string;
  description: string;
  assigned_agent: AgentType;
  status: TaskStatus;
  related_module_id: number | null;
  related_module_name?: string;
  priority: Priority;
  created_at: string;
}

interface Statistics {
  totalModules: number;
  modulesByStatus: Record<IstStatus, number>;
  modulesByPriority: Record<Priority, number>;
  overallProgress: number;
  tasksByAgent: Record<AgentType, { total: number; open: number; done: number }>;
  tasksByStatus: Record<TaskStatus, number>;
}

// =====================================================
// KONSTANTEN
// =====================================================

const AGENT_CONFIG: Record<AgentType, { name: string; color: string; icon: string; role: string }> = {
  plan: { name: "Agent-Plan", color: "#FFC107", icon: "🧠", role: "Analyse, Anforderungen, Roadmap, SOLL-Definition" },
  build: { name: "Agent-Build", color: "#2196F3", icon: "⚙️", role: "Umsetzung, Entwicklung, IST-Erfassung, Module bauen" },
  run: { name: "Agent-Run", color: "#4CAF50", icon: "🔍", role: "Qualitätssicherung, Tests, Betrieb, Freigaben" },
};

const IST_STATUS_CONFIG: Record<IstStatus, { label: string; color: string; bgColor: string }> = {
  open: { label: "Offen", color: "#8a8a8a", bgColor: "#2a2d35" },
  in_progress: { label: "In Arbeit", color: "#ffd700", bgColor: "#3d3a20" },
  done: { label: "Fertig", color: "#4caf50", bgColor: "#1f3a25" },
};

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  high: { label: "Hoch", color: "#f44336" },
  medium: { label: "Mittel", color: "#ffc107" },
  low: { label: "Niedrig", color: "#8a8a8a" },
};

// =====================================================
// KOMPONENTE
// =====================================================

export default function AgentSystemPage() {
  const [modules, setModules] = useState<ModuleWithProgress[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initResult, setInitResult] = useState<{ 
    tablesCreated: string[]; 
    modulesInserted: number; 
    modulesUpdated?: number;
    migrated?: number;
    totalModules?: number;
    progress?: { updated: number; inserted: number; skipped: number };
  } | null>(null);
  const [seedingProgress, setSeedingProgress] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    project: string;
    overall_progress: number;
    categories: Record<string, number>;
    doneCount: number;
    inProgressCount: number;
    openCount: number;
    highRiskCount: number;
    totalModules: number;
    statusText: string;
    snapshotId?: number;
  } | null>(null);

  // Enterprise++ Risiko & Go-Live
  const [checkingGoLive, setCheckingGoLive] = useState(false);
  const [goLiveResult, setGoLiveResult] = useState<{
    go_live_ready: boolean;
    required_modules_total: number;
    blocking_modules: Array<{
      module_name: string;
      priority_level: string;
      maturity_level: string;
      risk_level: string;
      progress_percent: number;
    }>;
    blocking_count: number;
    summary: string;
    stats: {
      P0_total: number;
      P0_ready: number;
      P0_blocking: number;
      P1_total: number;
      P1_ready: number;
      P1_blocking: number;
    };
    category_readiness: Record<string, { total: number; ready: number; blocking: number }>;
  } | null>(null);
  const [riskStats, setRiskStats] = useState<{
    total: number;
    byRisk: Record<string, number>;
    byPriority: Record<string, number>;
    byCategory: Record<string, { total: number; avgMaturity: number; maxRisk: string; criticalCount: number }>;
    goLiveRequired: number;
    goLiveReady: number;
  } | null>(null);

  // Auto-Complete System
  const [showAutoCompletePanel, setShowAutoCompletePanel] = useState(false);
  const [checkingAutoComplete, setCheckingAutoComplete] = useState(false);
  const [autoCompleteData, setAutoCompleteData] = useState<{
    auto: Array<{ id: number; module_name: string; priority_level: string; progress_percent: number }>;
    requires_approval: Array<{ id: number; module_name: string; priority_level: string; progress_percent: number }>;
    blocked: Array<{ id: number; module_name: string; priority_level: string; progress_percent: number; block_reasons: string[] }>;
    already_done: Array<{ id: number; module_name: string; priority_level: string }>;
    summary: { total: number; auto_count: number; approval_count: number; blocked_count: number; done_count: number };
  } | null>(null);
  const [completingModule, setCompletingModule] = useState<number | null>(null);
  const [batchCompleting, setBatchCompleting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ moduleId: number; moduleName: string; priority: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"modules" | "tasks">("modules");

  // Daten laden
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Module laden
      const modulesRes = await fetch("/api/admin/agent-system");
      const modulesData = await modulesRes.json();
      if (modulesData.success) {
        setModules(modulesData.data);
      }

      // Tasks laden
      const tasksRes = await fetch("/api/admin/agent-system?view=tasks");
      const tasksData = await tasksRes.json();
      if (tasksData.success) {
        setTasks(tasksData.data);
      }

      // Statistiken laden
      const statsRes = await fetch("/api/admin/agent-system?view=statistics");
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStatistics(statsData.data);
      }
    } catch (err) {
      setError("Fehler beim Laden der Daten");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Tabellen initialisieren (nur SOLL)
  const initializeSystem = async () => {
    try {
      setInitializing(true);
      setInitResult(null);

      const res = await fetch("/api/admin/agent-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "init" }),
      });

      const data = await res.json();

      if (data.success) {
        setInitResult(data.data);
        await loadData();
      } else {
        setError(data.error || "Initialisierung fehlgeschlagen");
      }
    } catch (err) {
      setError("Fehler beim Initialisieren");
      console.error(err);
    } finally {
      setInitializing(false);
    }
  };

  // Vollständige Initialisierung (SOLL + IST)
  const fullInitialize = async () => {
    try {
      setInitializing(true);
      setSeedingProgress(true);
      setInitResult(null);

      const res = await fetch("/api/admin/agent-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "full-init" }),
      });

      const data = await res.json();

      if (data.success) {
        setInitResult(data.data);
        await loadData();
      } else {
        setError(data.error || "Vollständige Initialisierung fehlgeschlagen");
      }
    } catch (err) {
      setError("Fehler bei vollständiger Initialisierung");
      console.error(err);
    } finally {
      setInitializing(false);
      setSeedingProgress(false);
    }
  };

  // Projektanalyse ausführen
  const runProjectAnalysis = async () => {
    try {
      setAnalyzing(true);
      setAnalysisResult(null);
      setError(null);

      const res = await fetch("/api/admin/project-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (data.success) {
        setAnalysisResult(data.data);
      } else {
        setError(data.error || "Projektanalyse fehlgeschlagen");
      }
    } catch (err) {
      setError("Fehler bei der Projektanalyse");
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Go-Live-Check ausführen
  const runGoLiveCheck = async () => {
    try {
      setCheckingGoLive(true);
      setGoLiveResult(null);
      setError(null);

      const res = await fetch("/api/admin/go-live-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (data.success) {
        setGoLiveResult(data.data);
        // Auch Risiko-Stats laden
        loadRiskStats();
      } else {
        setError(data.error || "Go-Live-Check fehlgeschlagen");
      }
    } catch (err) {
      setError("Fehler beim Go-Live-Check");
      console.error(err);
    } finally {
      setCheckingGoLive(false);
    }
  };

  // Risiko-Statistiken laden
  const loadRiskStats = async () => {
    try {
      const res = await fetch("/api/admin/go-live-check");
      const data = await res.json();
      if (data.success) {
        setRiskStats(data.data);
      }
    } catch (err) {
      console.error("Fehler beim Laden der Risiko-Stats:", err);
    }
  };

  // Auto-Complete Check - Toggle Panel und Daten laden
  const runAutoCompleteCheck = async () => {
    // Toggle: Wenn Panel offen ist, schließen
    if (showAutoCompletePanel && autoCompleteData) {
      setShowAutoCompletePanel(false);
      return;
    }

    // Panel öffnen
    setShowAutoCompletePanel(true);

    try {
      setCheckingAutoComplete(true);
      setError(null);

      console.log("🔄 Auto-Complete Check gestartet...");

      const res = await fetch("/api/admin/module-auto-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      console.log("📥 API Response Status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("📊 API Response Data:", data);

      if (data.success) {
        console.log("✅ Auto-Complete Daten geladen:", data.data.summary);
        setAutoCompleteData(data.data);
      } else {
        const errorMsg = data.error || "Auto-Complete Check fehlgeschlagen";
        console.error("❌ API Fehler:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unbekannter Fehler";
      console.error("❌ Auto-Complete Check Fehler:", err);
      setError("Fehler beim Auto-Complete Check: " + errorMsg);
    } finally {
      setCheckingAutoComplete(false);
    }
  };

  // Einzelnes Modul abschließen (Enterprise++ Direct Action)
  const completeModule = async (moduleId: number, force: boolean = false) => {
    try {
      setCompletingModule(moduleId);
      setError(null);
      setConfirmDialog(null);

      console.log(`🚀 Fertigstellen Modul ${moduleId} (force=${force})...`);

      const res = await fetch("/api/admin/module-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module_id: moduleId, force }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("📥 Response:", data);

      if (data.success) {
        console.log(`✅ Modul ${moduleId} erfolgreich abgeschlossen!`);
        // Daten neu laden
        await loadData();
        // Auto-Complete Panel aktualisieren falls offen
        if (showAutoCompletePanel) {
          await runAutoCompleteCheck();
        }
      } else {
        const errorMsg = data.error || "Modul konnte nicht abgeschlossen werden";
        console.error("❌ Fehler:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unbekannter Fehler";
      console.error("❌ Fehler beim Abschließen:", err);
      setError("Fehler beim Abschließen: " + errorMsg);
    } finally {
      setCompletingModule(null);
    }
  };

  // Direkt-Fertigstellen mit Prüfung (Enterprise++ Siemens-Style)
  const handleDirectComplete = (moduleId: number, moduleName: string, priority: string, progressPercent: number) => {
    // Bereits fertig?
    if (progressPercent >= 100) {
      return;
    }

    // P0/P1 brauchen Bestätigung
    if (priority === "high") {
      setConfirmDialog({ moduleId, moduleName, priority: "P0/P1" });
    } else {
      // P2/P3 direkt abschließen
      completeModule(moduleId, true);
    }
  };

  // Batch Auto-Complete (alle P2/P3)
  const runBatchComplete = async () => {
    try {
      setBatchCompleting(true);
      setError(null);

      const res = await fetch("/api/admin/module-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "batch" }),
      });

      const data = await res.json();

      if (data.success) {
        // Daten neu laden
        await runAutoCompleteCheck();
        await loadData();
      } else {
        setError(data.error || "Batch-Complete fehlgeschlagen");
      }
    } catch (err) {
      setError("Fehler beim Batch-Complete");
      console.error(err);
    } finally {
      setBatchCompleting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Gruppierte Module nach Kategorie
  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, ModuleWithProgress[]>);

  if (loading) {
    return (
      <div className="p-6 min-h-screen" style={{ backgroundColor: "#0d0f12" }}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffd700]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#0d0f12" }}>
      
      {/* Bestätigungsdialog für P0/P1 Module (Enterprise++ IBM-Style) */}
      {confirmDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <div 
            className="p-6 rounded-lg border max-w-md w-full mx-4"
            style={{ backgroundColor: "#111217", borderColor: "#f44336" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-2xl" style={{ color: "#f44336" }} />
              <h3 className="font-bold text-lg" style={{ color: "#f4f4f4" }}>
                Kritisches Modul fertigstellen
              </h3>
            </div>
            
            <p className="mb-4" style={{ color: "#b3b3b3" }}>
              <strong style={{ color: "#f44336" }}>{confirmDialog.priority}</strong> Module sind geschäftskritisch. 
              Bist du sicher, dass du folgendes Modul als fertig markieren möchtest?
            </p>
            
            <div className="p-3 rounded mb-4" style={{ backgroundColor: "#1a1d23" }}>
              <p className="font-medium" style={{ color: "#ffd700" }}>{confirmDialog.moduleName}</p>
            </div>
            
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded font-medium"
                style={{ backgroundColor: "#272a33", color: "#f4f4f4" }}
              >
                Abbrechen
              </button>
              <button
                onClick={() => completeModule(confirmDialog.moduleId, true)}
                disabled={completingModule === confirmDialog.moduleId}
                className="px-4 py-2 rounded font-medium flex items-center gap-2"
                style={{ 
                  backgroundColor: completingModule === confirmDialog.moduleId ? "#2a2d35" : "#4CAF50", 
                  color: "#fff" 
                }}
              >
                {completingModule === confirmDialog.moduleId ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Wird fertiggestellt...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Ja, fertigstellen
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "#f4f4f4" }}>
            <FaRobot style={{ color: "#ffd700" }} />
            Enterprise++ Agent-System – PLAN • BUILD • RUN
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8a8a8a" }}>
            IBM / SAP / Siemens Standard – Prozessbasierte Modulsteuerung
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0 flex-wrap">
          <button
            onClick={initializeSystem}
            disabled={initializing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm"
            style={{
              backgroundColor: initializing ? "#2a2d35" : "#272a33",
              color: initializing ? "#8a8a8a" : "#f4f4f4",
            }}
          >
            <FaSync className={initializing ? "animate-spin" : ""} />
            SOLL
          </button>
          <button
            onClick={fullInitialize}
            disabled={initializing || seedingProgress}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm"
            style={{
              backgroundColor: (initializing || seedingProgress) ? "#2a2d35" : "#272a33",
              color: (initializing || seedingProgress) ? "#8a8a8a" : "#f4f4f4",
            }}
          >
            <FaSync className={(initializing || seedingProgress) ? "animate-spin" : ""} />
            SOLL+IST
          </button>
          <button
            onClick={runProjectAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm"
            style={{
              backgroundColor: analyzing ? "#2a2d35" : "#272a33",
              color: analyzing ? "#8a8a8a" : "#f4f4f4",
            }}
          >
            <FaChartLine className={analyzing ? "animate-pulse" : ""} />
            Analyse
          </button>
          <button
            onClick={runGoLiveCheck}
            disabled={checkingGoLive}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm"
            style={{
              backgroundColor: checkingGoLive ? "#2a2d35" : "#4CAF50",
              color: checkingGoLive ? "#8a8a8a" : "#fff",
            }}
          >
            <FaRocket className={checkingGoLive ? "animate-pulse" : ""} />
            Go-Live
          </button>
          <button
            onClick={runAutoCompleteCheck}
            disabled={checkingAutoComplete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm"
            style={{
              backgroundColor: checkingAutoComplete ? "#2a2d35" : "#9c27b0",
              color: checkingAutoComplete ? "#8a8a8a" : "#fff",
            }}
          >
            <FaCheckCircle className={checkingAutoComplete ? "animate-pulse" : ""} />
            {checkingAutoComplete ? "Prüft..." : "Auto-Complete"}
          </button>
        </div>
      </div>

      {/* Init-Ergebnis */}
      {initResult && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{ backgroundColor: "#1f3a25", borderColor: "#4caf50" }}
        >
          <div className="flex items-center gap-2" style={{ color: "#4caf50" }}>
            <FaCheckCircle />
            <span className="font-medium">
              Enterprise++ Module Registry seeding completed: {initResult.totalModules || initResult.modulesInserted} modules upserted.
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: "#b3b3b3" }}>
            📋 SOLL: {initResult.modulesInserted} neu
            {initResult.modulesUpdated ? ` | 🔄 ${initResult.modulesUpdated} aktualisiert` : ""}
            {initResult.migrated ? ` | 🔀 ${initResult.migrated} migriert` : ""}
          </p>
          {initResult.progress && (
            <p className="text-sm mt-1" style={{ color: "#FFC107" }}>
              📊 IST: {initResult.progress.updated} aktualisiert | {initResult.progress.inserted} neu eingefügt
              {initResult.progress.skipped > 0 ? ` | ⚠️ ${initResult.progress.skipped} übersprungen` : ""}
            </p>
          )}
          <p className="text-xs mt-1" style={{ color: "#666" }}>
            Tabellen: {initResult.tablesCreated.join(", ")}
          </p>
        </div>
      )}

      {/* Analyse-Ergebnis */}
      {analysisResult && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{ backgroundColor: "#111217", borderColor: "#ffd700" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2" style={{ color: "#ffd700" }}>
              <FaChartLine />
              <span className="font-medium">Projektanalyse: {analysisResult.project}</span>
            </div>
            {analysisResult.snapshotId && (
              <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#272a33", color: "#8a8a8a" }}>
                Snapshot #{analysisResult.snapshotId}
              </span>
            )}
          </div>

          {/* Gesamtfortschritt */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm" style={{ color: "#b3b3b3" }}>Gesamtfortschritt</span>
              <span className="text-2xl font-bold" style={{ color: "#ffd700" }}>{analysisResult.overall_progress}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#272a33" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${analysisResult.overall_progress}%`,
                  backgroundColor: analysisResult.overall_progress >= 80 ? "#4caf50" : analysisResult.overall_progress >= 50 ? "#ffd700" : "#f44336",
                }}
              />
            </div>
          </div>

          {/* Statistiken */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="p-2 rounded" style={{ backgroundColor: "#1f3a25" }}>
              <div className="text-xs" style={{ color: "#8a8a8a" }}>Fertig</div>
              <div className="text-lg font-bold" style={{ color: "#4caf50" }}>{analysisResult.doneCount}</div>
            </div>
            <div className="p-2 rounded" style={{ backgroundColor: "#3d3a20" }}>
              <div className="text-xs" style={{ color: "#8a8a8a" }}>In Arbeit</div>
              <div className="text-lg font-bold" style={{ color: "#ffd700" }}>{analysisResult.inProgressCount}</div>
            </div>
            <div className="p-2 rounded" style={{ backgroundColor: "#2a2d35" }}>
              <div className="text-xs" style={{ color: "#8a8a8a" }}>Offen</div>
              <div className="text-lg font-bold" style={{ color: "#8a8a8a" }}>{analysisResult.openCount}</div>
            </div>
            <div className="p-2 rounded" style={{ backgroundColor: analysisResult.highRiskCount > 0 ? "#3a1f1f" : "#2a2d35" }}>
              <div className="text-xs" style={{ color: "#8a8a8a" }}>High-Risk</div>
              <div className="text-lg font-bold" style={{ color: analysisResult.highRiskCount > 0 ? "#f44336" : "#4caf50" }}>
                {analysisResult.highRiskCount}
              </div>
            </div>
          </div>

          {/* Kategorien */}
          <div className="space-y-2">
            <div className="text-xs font-medium mb-2" style={{ color: "#8a8a8a" }}>Fortschritt nach Kategorie</div>
            {Object.entries(analysisResult.categories)
              .sort(([, a], [, b]) => b - a)
              .map(([category, progress]) => (
                <div key={category} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="truncate" style={{ color: "#b3b3b3" }}>{category}</span>
                      <span style={{ color: progress >= 60 ? "#4caf50" : progress >= 20 ? "#ffd700" : "#8a8a8a" }}>
                        {progress}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#272a33" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: progress >= 60 ? "#4caf50" : progress >= 20 ? "#ffd700" : "#8a8a8a",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Status-Text */}
          <div className="mt-4 p-3 rounded" style={{ backgroundColor: "#1a1d23" }}>
            <div className="text-xs font-medium mb-1" style={{ color: "#8a8a8a" }}>Status-Zusammenfassung</div>
            <p className="text-sm" style={{ color: "#f4f4f4" }}>{analysisResult.statusText}</p>
          </div>
        </div>
      )}

      {/* Go-Live-Ergebnis */}
      {goLiveResult && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{
            backgroundColor: goLiveResult.go_live_ready ? "#1f3a25" : "#3a1f1f",
            borderColor: goLiveResult.go_live_ready ? "#4CAF50" : "#f44336",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {goLiveResult.go_live_ready ? (
                <FaCheckCircle className="text-2xl" style={{ color: "#4CAF50" }} />
              ) : (
                <FaTimesCircle className="text-2xl" style={{ color: "#f44336" }} />
              )}
              <div>
                <h3 className="font-bold text-lg" style={{ color: goLiveResult.go_live_ready ? "#4CAF50" : "#f44336" }}>
                  {goLiveResult.go_live_ready ? "✅ GO-LIVE BEREIT" : "⛔ GO-LIVE BLOCKIERT"}
                </h3>
                <p className="text-sm" style={{ color: "#b3b3b3" }}>{goLiveResult.summary}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: "#f4f4f4" }}>
                {goLiveResult.required_modules_total - goLiveResult.blocking_count}/{goLiveResult.required_modules_total}
              </div>
              <div className="text-xs" style={{ color: "#8a8a8a" }}>Module bereit</div>
            </div>
          </div>

          {/* P0/P1 Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="p-2 rounded" style={{ backgroundColor: "#1a1d23" }}>
              <div className="text-xs" style={{ color: "#f44336" }}>P0 (Kritisch)</div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold" style={{ color: "#4CAF50" }}>{goLiveResult.stats.P0_ready}</span>
                <span style={{ color: "#8a8a8a" }}>/</span>
                <span style={{ color: "#8a8a8a" }}>{goLiveResult.stats.P0_total}</span>
                {goLiveResult.stats.P0_blocking > 0 && (
                  <span className="text-xs px-1 rounded" style={{ backgroundColor: "#f44336", color: "#fff" }}>
                    {goLiveResult.stats.P0_blocking} ⚠️
                  </span>
                )}
              </div>
            </div>
            <div className="p-2 rounded" style={{ backgroundColor: "#1a1d23" }}>
              <div className="text-xs" style={{ color: "#ff9800" }}>P1 (Wichtig)</div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold" style={{ color: "#4CAF50" }}>{goLiveResult.stats.P1_ready}</span>
                <span style={{ color: "#8a8a8a" }}>/</span>
                <span style={{ color: "#8a8a8a" }}>{goLiveResult.stats.P1_total}</span>
                {goLiveResult.stats.P1_blocking > 0 && (
                  <span className="text-xs px-1 rounded" style={{ backgroundColor: "#ff9800", color: "#fff" }}>
                    {goLiveResult.stats.P1_blocking} ⚠️
                  </span>
                )}
              </div>
            </div>
            <div className="p-2 rounded" style={{ backgroundColor: "#1a1d23" }}>
              <div className="text-xs" style={{ color: "#8a8a8a" }}>Blockierend</div>
              <div className="text-lg font-bold" style={{ color: goLiveResult.blocking_count > 0 ? "#f44336" : "#4CAF50" }}>
                {goLiveResult.blocking_count}
              </div>
            </div>
            <div className="p-2 rounded" style={{ backgroundColor: "#1a1d23" }}>
              <div className="text-xs" style={{ color: "#8a8a8a" }}>Erforderlich</div>
              <div className="text-lg font-bold" style={{ color: "#f4f4f4" }}>{goLiveResult.required_modules_total}</div>
            </div>
          </div>

          {/* Kategorie-Readiness */}
          <div className="mb-4">
            <div className="text-xs font-medium mb-2" style={{ color: "#8a8a8a" }}>Kategorie-Status</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {Object.entries(goLiveResult.category_readiness).map(([category, data]) => (
                <div
                  key={category}
                  className="p-2 rounded text-center"
                  style={{
                    backgroundColor: data.blocking > 0 ? "#3a1f1f" : "#1f3a25",
                  }}
                >
                  <div className="text-xs truncate" style={{ color: "#8a8a8a" }}>{category.split(" ")[0]}</div>
                  <div className="font-bold" style={{ color: data.blocking > 0 ? "#f44336" : "#4CAF50" }}>
                    {data.ready}/{data.total}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blocker-Liste */}
          {goLiveResult.blocking_modules.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-2" style={{ color: "#f44336" }}>
                🚫 Top Blocker ({goLiveResult.blocking_count})
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {goLiveResult.blocking_modules.slice(0, 10).map((mod, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded text-sm"
                    style={{ backgroundColor: "#1a1d23" }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-bold"
                        style={{
                          backgroundColor: mod.priority_level === "P0" ? "#f44336" : "#ff9800",
                          color: "#fff",
                        }}
                      >
                        {mod.priority_level}
                      </span>
                      <span style={{ color: "#f4f4f4" }}>{mod.module_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: "#8a8a8a" }}>{mod.maturity_level}</span>
                      <span
                        className="px-1.5 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: mod.risk_level === "critical" ? "#f44336" : "#ff9800",
                          color: "#fff",
                        }}
                      >
                        {mod.risk_level}
                      </span>
                      <span style={{ color: "#ffd700" }}>{mod.progress_percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Risiko-Übersicht (wenn Stats geladen) */}
      {riskStats && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FaShieldAlt style={{ color: "#ffd700" }} />
            <h3 className="font-medium" style={{ color: "#f4f4f4" }}>Enterprise++ Risiko-Übersicht</h3>
          </div>

          {/* Risiko-Kacheln */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded" style={{ backgroundColor: "#3a1f1f" }}>
              <div className="text-xs" style={{ color: "#8a8a8a" }}>🔴 Critical</div>
              <div className="text-2xl font-bold" style={{ color: "#f44336" }}>{riskStats.byRisk.critical || 0}</div>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: "#3a2f1a" }}>
              <div className="text-xs" style={{ color: "#8a8a8a" }}>🟠 High</div>
              <div className="text-2xl font-bold" style={{ color: "#ff9800" }}>{riskStats.byRisk.high || 0}</div>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: "#3d3a20" }}>
              <div className="text-xs" style={{ color: "#8a8a8a" }}>🟡 Medium</div>
              <div className="text-2xl font-bold" style={{ color: "#ffc107" }}>{riskStats.byRisk.medium || 0}</div>
            </div>
            <div className="p-3 rounded" style={{ backgroundColor: "#1f3a25" }}>
              <div className="text-xs" style={{ color: "#8a8a8a" }}>🟢 Low</div>
              <div className="text-2xl font-bold" style={{ color: "#4CAF50" }}>{riskStats.byRisk.low || 0}</div>
            </div>
          </div>

          {/* Prioritäts-Verteilung */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {["P0", "P1", "P2", "P3"].map((p) => (
              <div key={p} className="p-2 rounded text-center" style={{ backgroundColor: "#1a1d23" }}>
                <div className="text-xs" style={{ color: "#8a8a8a" }}>{p}</div>
                <div className="font-bold" style={{ color: "#f4f4f4" }}>{riskStats.byPriority[p] || 0}</div>
              </div>
            ))}
          </div>

          {/* Go-Live-Progress */}
          <div className="p-3 rounded" style={{ backgroundColor: "#1a1d23" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#8a8a8a" }}>Go-Live-Bereitschaft</span>
              <span className="font-bold" style={{ color: "#ffd700" }}>
                {riskStats.goLiveReady}/{riskStats.goLiveRequired} Module
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#272a33" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${riskStats.goLiveRequired > 0 ? (riskStats.goLiveReady / riskStats.goLiveRequired) * 100 : 0}%`,
                  backgroundColor: riskStats.goLiveReady === riskStats.goLiveRequired ? "#4CAF50" : "#ffd700",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Auto-Complete Panel - Wird angezeigt wenn showAutoCompletePanel true ist */}
      {showAutoCompletePanel && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{ backgroundColor: "#111217", borderColor: "#9c27b0" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaCheckCircle style={{ color: "#9c27b0" }} className={checkingAutoComplete ? "animate-spin" : ""} />
              <h3 className="font-medium" style={{ color: "#f4f4f4" }}>
                Enterprise++ Auto-Complete
                {checkingAutoComplete && <span className="ml-2 text-sm" style={{ color: "#9c27b0" }}>Wird geladen...</span>}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {autoCompleteData && (
                <>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#1f3a25", color: "#4CAF50" }}>
                    ✅ {autoCompleteData.summary.done_count} Fertig
                  </span>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#2d1f3a", color: "#9c27b0" }}>
                    🔄 {autoCompleteData.summary.auto_count} Auto
                  </span>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#3a2f1a", color: "#ff9800" }}>
                    ⚠️ {autoCompleteData.summary.approval_count} P0/P1
                  </span>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#3a1f1f", color: "#f44336" }}>
                    🚫 {autoCompleteData.summary.blocked_count} Blockiert
                  </span>
                </>
              )}
              <button
                onClick={() => setShowAutoCompletePanel(false)}
                className="ml-2 px-2 py-1 rounded text-xs"
                style={{ backgroundColor: "#272a33", color: "#8a8a8a" }}
              >
                ✕ Schließen
              </button>
            </div>
          </div>

          {/* Ladeindikator */}
          {checkingAutoComplete && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: "#9c27b0" }}></div>
              <span className="ml-3" style={{ color: "#9c27b0" }}>Auto-Complete-Daten werden geladen...</span>
            </div>
          )}

          {/* Automatisch abschließbar (P2/P3) */}
          {!checkingAutoComplete && autoCompleteData && autoCompleteData.auto.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: "#9c27b0" }}>
                  🔄 Automatisch abschließbar (P2/P3)
                </span>
                <button
                  onClick={runBatchComplete}
                  disabled={batchCompleting}
                  className="px-3 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: batchCompleting ? "#2a2d35" : "#9c27b0",
                    color: batchCompleting ? "#8a8a8a" : "#fff",
                  }}
                >
                  {batchCompleting ? "Wird abgeschlossen..." : `Alle ${autoCompleteData.auto.length} abschließen`}
                </button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {autoCompleteData.auto.map((mod) => (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between p-2 rounded text-sm"
                    style={{ backgroundColor: "#1a1d23" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: "#2196F3", color: "#fff" }}>
                        {mod.priority_level}
                      </span>
                      <span style={{ color: "#f4f4f4" }}>{mod.module_name}</span>
                    </div>
                    <span style={{ color: "#ffd700" }}>{mod.progress_percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benötigt Freigabe (P0/P1) */}
          {!checkingAutoComplete && autoCompleteData && autoCompleteData.requires_approval.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-medium block mb-2" style={{ color: "#ff9800" }}>
                ⚠️ Benötigt Freigabe (P0/P1 – kritische Module)
              </span>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {autoCompleteData.requires_approval.map((mod) => (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between p-2 rounded text-sm"
                    style={{ backgroundColor: "#1a1d23" }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-bold"
                        style={{
                          backgroundColor: mod.priority_level === "P0" ? "#f44336" : "#ff9800",
                          color: "#fff",
                        }}
                      >
                        {mod.priority_level}
                      </span>
                      <span style={{ color: "#f4f4f4" }}>{mod.module_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: "#ffd700" }}>{mod.progress_percent}%</span>
                      <button
                        onClick={() => completeModule(mod.id, true)}
                        disabled={completingModule === mod.id}
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: completingModule === mod.id ? "#2a2d35" : "#4CAF50",
                          color: completingModule === mod.id ? "#8a8a8a" : "#fff",
                        }}
                      >
                        {completingModule === mod.id ? "..." : "Freigeben"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blockiert */}
          {!checkingAutoComplete && autoCompleteData && autoCompleteData.blocked.length > 0 && (
            <div>
              <span className="text-sm font-medium block mb-2" style={{ color: "#f44336" }}>
                🚫 Blockiert ({autoCompleteData.blocked.length})
              </span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {autoCompleteData.blocked.slice(0, 10).map((mod) => (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between p-2 rounded text-sm"
                    style={{ backgroundColor: "#1a1d23" }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: mod.priority_level === "P0" ? "#f44336" : mod.priority_level === "P1" ? "#ff9800" : "#2196F3",
                          color: "#fff",
                        }}
                      >
                        {mod.priority_level}
                      </span>
                      <span style={{ color: "#f4f4f4" }}>{mod.module_name}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap justify-end">
                      {mod.block_reasons.map((reason, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: "#3a1f1f", color: "#f44336" }}
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {autoCompleteData.blocked.length > 10 && (
                  <div className="text-xs text-center py-1" style={{ color: "#8a8a8a" }}>
                    ... und {autoCompleteData.blocked.length - 10} weitere
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bereits fertig */}
          {!checkingAutoComplete && autoCompleteData && autoCompleteData.already_done.length > 0 && (
            <div className="mt-4 pt-3 border-t" style={{ borderColor: "#272a33" }}>
              <span className="text-xs" style={{ color: "#4CAF50" }}>
                ✅ {autoCompleteData.already_done.length} Module bereits abgeschlossen
              </span>
            </div>
          )}

          {/* Keine Daten Hinweis */}
          {!checkingAutoComplete && autoCompleteData && 
           autoCompleteData.auto.length === 0 && 
           autoCompleteData.requires_approval.length === 0 && 
           autoCompleteData.blocked.length === 0 && (
            <div className="text-center py-4" style={{ color: "#8a8a8a" }}>
              Alle Module sind bereits abgeschlossen oder haben keine Auto-Complete-Berechtigung.
            </div>
          )}

          {/* Refresh Button */}
          {!checkingAutoComplete && autoCompleteData && (
            <div className="mt-4 pt-3 border-t flex justify-end" style={{ borderColor: "#272a33" }}>
              <button
                onClick={() => {
                  setAutoCompleteData(null);
                  runAutoCompleteCheck();
                }}
                className="px-3 py-1 rounded text-xs font-medium"
                style={{ backgroundColor: "#272a33", color: "#f4f4f4" }}
              >
                🔄 Aktualisieren
              </button>
            </div>
          )}
        </div>
      )}

      {/* Fehler */}
      {error && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{ backgroundColor: "#3a1f1f", borderColor: "#f44336" }}
        >
          <div className="flex items-center gap-2" style={{ color: "#f44336" }}>
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Agenten-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {(Object.entries(AGENT_CONFIG) as [AgentType, typeof AGENT_CONFIG[AgentType]][]).map(([agent, config]) => {
          const agentStats = statistics?.tasksByAgent[agent] || { total: 0, open: 0, done: 0 };
          return (
            <div
              key={agent}
              className="p-4 rounded-lg border"
              style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <h3 className="font-semibold" style={{ color: config.color }}>
                      {config.name}
                    </h3>
                    <p className="text-xs" style={{ color: "#8a8a8a" }}>
                      {config.role}
                    </p>
                  </div>
                </div>
                <div
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: config.color + "20", color: config.color }}
                >
                  {agentStats.open} offen
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span style={{ color: "#8a8a8a" }}>Tasks: {agentStats.total}</span>
                <span style={{ color: "#4caf50" }}>✓ {agentStats.done}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistik-Karten */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Gesamtfortschritt */}
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#8a8a8a" }}>Gesamtfortschritt</span>
              <FaChartLine style={{ color: "#ffd700" }} />
            </div>
            <div className="text-3xl font-bold" style={{ color: "#ffd700" }}>
              {statistics.overallProgress}%
            </div>
            <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#272a33" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${statistics.overallProgress}%`,
                  backgroundColor: statistics.overallProgress >= 80 ? "#4caf50" : statistics.overallProgress >= 50 ? "#ffd700" : "#f44336",
                }}
              />
            </div>
          </div>

          {/* Module */}
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#8a8a8a" }}>SOLL-Module</span>
              <FaLayerGroup style={{ color: "#007bff" }} />
            </div>
            <div className="text-3xl font-bold" style={{ color: "#f4f4f4" }}>
              {statistics.totalModules}
            </div>
            <div className="text-sm mt-1" style={{ color: "#4caf50" }}>
              {statistics.modulesByStatus.done || 0} fertig
            </div>
          </div>

          {/* In Arbeit */}
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#8a8a8a" }}>In Arbeit</span>
              <FaPlay style={{ color: "#ffd700" }} />
            </div>
            <div className="text-3xl font-bold" style={{ color: "#ffd700" }}>
              {statistics.modulesByStatus.in_progress || 0}
            </div>
            <div className="text-sm mt-1" style={{ color: "#8a8a8a" }}>
              {statistics.modulesByStatus.open || 0} offen
            </div>
          </div>

          {/* Tasks */}
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#8a8a8a" }}>Offene Tasks</span>
              <FaTasks style={{ color: "#f44336" }} />
            </div>
            <div className="text-3xl font-bold" style={{ color: "#f44336" }}>
              {statistics.tasksByStatus.open || 0}
            </div>
            <div className="text-sm mt-1" style={{ color: "#4caf50" }}>
              {statistics.tasksByStatus.done || 0} erledigt
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab("modules")}
          className="px-4 py-2 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: activeTab === "modules" ? "#ffd700" : "#272a33",
            color: activeTab === "modules" ? "#111217" : "#b3b3b3",
          }}
        >
          <FaLayerGroup className="inline mr-2" />
          SOLL/IST Module
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className="px-4 py-2 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: activeTab === "tasks" ? "#ffd700" : "#272a33",
            color: activeTab === "tasks" ? "#111217" : "#b3b3b3",
          }}
        >
          <FaTasks className="inline mr-2" />
          Agent-Tasks
        </button>
      </div>

      {/* Module-Tab */}
      {activeTab === "modules" && (
        <div className="space-y-6">
          {Object.entries(groupedModules).map(([category, categoryModules]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "#f4f4f4" }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffd700" }} />
                {category}
                <span
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{ backgroundColor: "#272a33", color: "#8a8a8a" }}
                >
                  {categoryModules.length}
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryModules.map((module) => {
                  const istConfig = IST_STATUS_CONFIG[module.ist_status];
                  const prioConfig = PRIORITY_CONFIG[module.priority];
                  const agentConfig = AGENT_CONFIG[module.responsible_agent];

                  return (
                    <div
                      key={module.id}
                      className="p-4 rounded-lg border transition-all hover:border-[#ffd700]"
                      style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium" style={{ color: "#f4f4f4" }}>
                            {module.module_name}
                          </h4>
                          <p className="text-sm" style={{ color: "#8a8a8a" }}>
                            {module.description}
                          </p>
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: prioConfig.color + "20", color: prioConfig.color }}
                        >
                          {prioConfig.label}
                        </span>
                      </div>

                      {/* Fortschritt */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span style={{ color: "#8a8a8a" }}>IST-Fortschritt</span>
                          <span style={{ color: istConfig.color }}>{module.progress_percent}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#272a33" }}>
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${module.progress_percent}%`,
                              backgroundColor: istConfig.color,
                            }}
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ backgroundColor: istConfig.bgColor, color: istConfig.color }}
                          >
                            {istConfig.label}
                          </span>
                          <span
                            className="text-xs px-2 py-1 rounded flex items-center gap-1"
                            style={{ backgroundColor: agentConfig.color + "20", color: agentConfig.color }}
                          >
                            {agentConfig.icon} {agentConfig.name}
                          </span>
                        </div>
                        
                        {/* Enterprise++ Direct Action Button (Siemens-Style) */}
                        {module.progress_percent < 100 ? (
                          <button
                            onClick={() => handleDirectComplete(module.id, module.module_name, module.priority, module.progress_percent)}
                            disabled={completingModule === module.id}
                            className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-all hover:scale-105"
                            style={{
                              backgroundColor: completingModule === module.id ? "#2a2d35" : "#4CAF50",
                              color: completingModule === module.id ? "#8a8a8a" : "#fff",
                              cursor: completingModule === module.id ? "wait" : "pointer",
                            }}
                          >
                            {completingModule === module.id ? (
                              <>
                                <span className="animate-spin">⏳</span>
                                Wird fertiggestellt...
                              </>
                            ) : (
                              <>
                                <FaCheckCircle />
                                Fertigstellen
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium" style={{ backgroundColor: "#1f3a25", color: "#4CAF50" }}>
                            <FaCheckCircle />
                            100% Fertig
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {modules.length === 0 && (
            <div
              className="p-8 rounded-lg border text-center"
              style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
            >
              <FaRobot className="mx-auto text-4xl mb-4" style={{ color: "#8a8a8a" }} />
              <p style={{ color: "#8a8a8a" }}>Keine Module gefunden.</p>
              <p className="text-sm mt-1" style={{ color: "#666" }}>
                Klicke auf "System initialisieren" um die SOLL-Module anzulegen.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tasks-Tab */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => {
              const agentConfig = AGENT_CONFIG[task.assigned_agent];
              const prioConfig = PRIORITY_CONFIG[task.priority];
              const statusConfig = IST_STATUS_CONFIG[task.status];

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border"
                  style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: agentConfig.color + "20", color: agentConfig.color }}
                        >
                          {agentConfig.icon} {agentConfig.name}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: prioConfig.color + "20", color: prioConfig.color }}
                        >
                          {prioConfig.label}
                        </span>
                      </div>
                      <h4 className="font-medium" style={{ color: "#f4f4f4" }}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm mt-1" style={{ color: "#8a8a8a" }}>
                          {task.description}
                        </p>
                      )}
                      {task.related_module_name && (
                        <p className="text-xs mt-2" style={{ color: "#007bff" }}>
                          📦 Modul: {task.related_module_name}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className="p-8 rounded-lg border text-center"
              style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
            >
              <FaTasks className="mx-auto text-4xl mb-4" style={{ color: "#8a8a8a" }} />
              <p style={{ color: "#8a8a8a" }}>Keine Tasks vorhanden.</p>
              <p className="text-sm mt-1" style={{ color: "#666" }}>
                Tasks können über die API erstellt werden.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

