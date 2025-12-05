"use client";

// =====================================================
// ENTWICKLUNGSAUFTRÄGE – Enterprise++ Dev-Orchestrator
// =====================================================
// Erstellt: 2025-12-04
// Route: /admin/ai/dev-tasks
// Features: Auftrags-Liste, Neuer Auftrag, Agent-A/B/C Workflow
// SAP/IBM/Siemens Enterprise-Terminologie
// =====================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaRobot,
  FaPlus,
  FaBug,
  FaLightbulb,
  FaTools,
  FaBook,
  FaShieldAlt,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaCode,
  FaSearch,
  FaListOl,
  FaArrowLeft,
  FaSync,
  FaPlay,
  FaChevronDown,
  FaChevronUp,
  FaCog,
  FaEye,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

type DevTaskType = "bug" | "feature" | "refactor" | "documentation" | "security";
type DevTaskStatus = "open" | "planning" | "planned" | "coding" | "review" | "done" | "cancelled";
type DevTaskPriority = "low" | "medium" | "high" | "critical";

interface DevTask {
  id: number;
  title: string;
  description: string;
  type: DevTaskType;
  status: DevTaskStatus;
  priority: DevTaskPriority;
  project_code: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  steps_count?: number;
}

interface DevTaskStep {
  id: number;
  task_id: number;
  step_number: number;
  title: string;
  details: string | null;
  estimated_effort: string | null;
  status: string;
  agent_notes: string | null;
}

interface CodeChange {
  id: number;
  file_path: string;
  code_type: string;
  status: string;
  explanation: string;
}

interface Review {
  id: number;
  change_id: number;
  review_status: string;
  quality_score: number;
  feedback: string;
}

interface Statistics {
  total: number;
  byStatus: Record<DevTaskStatus, number>;
  byType: Record<DevTaskType, number>;
  totalSteps: number;
}

// =====================================================
// KONFIGURATION
// =====================================================

const TYPE_CONFIG: Record<DevTaskType, { label: string; icon: typeof FaBug; color: string; bgColor: string }> = {
  bug: { label: "Bug", icon: FaBug, color: "#ef4444", bgColor: "#3b1c1c" },
  feature: { label: "Feature", icon: FaLightbulb, color: "#22c55e", bgColor: "#1c3b24" },
  refactor: { label: "Refactor", icon: FaTools, color: "#3b82f6", bgColor: "#1c2a3b" },
  documentation: { label: "Dokumentation", icon: FaBook, color: "#a855f7", bgColor: "#2d1c3b" },
  security: { label: "Security", icon: FaShieldAlt, color: "#f59e0b", bgColor: "#3b2f1c" },
};

const STATUS_CONFIG: Record<DevTaskStatus, { label: string; color: string; bgColor: string; icon: typeof FaRobot }> = {
  open: { label: "Offen", color: "#9ca3af", bgColor: "#27272a", icon: FaClock },
  planning: { label: "Agent-A plant...", color: "#fbbf24", bgColor: "#3b341c", icon: FaRobot },
  planned: { label: "Geplant", color: "#60a5fa", bgColor: "#1c2a3b", icon: FaCheckCircle },
  coding: { label: "Agent-B codet...", color: "#a78bfa", bgColor: "#2d1c3b", icon: FaCog },
  review: { label: "Agent-C prüft...", color: "#fb923c", bgColor: "#3b2a1c", icon: FaEye },
  done: { label: "Fertig ✓", color: "#4ade80", bgColor: "#1c3b24", icon: FaCheck },
  cancelled: { label: "Abgebrochen", color: "#6b7280", bgColor: "#1f1f1f", icon: FaTimes },
};

const PRIORITY_CONFIG: Record<DevTaskPriority, { label: string; color: string }> = {
  low: { label: "Niedrig", color: "#6b7280" },
  medium: { label: "Mittel", color: "#3b82f6" },
  high: { label: "Hoch", color: "#f59e0b" },
  critical: { label: "Kritisch", color: "#ef4444" },
};

// =====================================================
// KOMPONENTE
// =====================================================

export default function DevTasksPage() {
  // State
  const [tasks, setTasks] = useState<DevTask[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Neuer Task Form
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    type: "feature" as DevTaskType,
    priority: "medium" as DevTaskPriority,
  });
  const [creating, setCreating] = useState(false);
  
  // Task Detail
  const [selectedTask, setSelectedTask] = useState<DevTask | null>(null);
  const [selectedTaskSteps, setSelectedTaskSteps] = useState<DevTaskStep[]>([]);
  const [selectedTaskChanges, setSelectedTaskChanges] = useState<CodeChange[]>([]);
  const [selectedTaskReviews, setSelectedTaskReviews] = useState<Review[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  
  // Expandierte Tasks
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  
  // Agent Aktionen
  const [runningAgentB, setRunningAgentB] = useState<number | null>(null);
  const [runningAgentC, setRunningAgentC] = useState<number | null>(null);

  // =====================================================
  // DATEN LADEN
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tasks laden
      const tasksRes = await fetch("/api/admin/dev-tasks?limit=50");
      const tasksData = await tasksRes.json();
      
      if (tasksData.success) {
        setTasks(tasksData.data.tasks);
      }

      // Statistiken laden
      const statsRes = await fetch("/api/admin/dev-tasks?view=stats");
      const statsData = await statsRes.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      }

    } catch (err) {
      setError("Fehler beim Laden der Daten");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // =====================================================
  // TASK ERSTELLEN
  // =====================================================

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title.trim() || !newTask.description.trim()) {
      setError("Bitte Titel und Beschreibung ausfüllen");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const response = await fetch("/api/admin/dev-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTask,
          use_mock: true,
          start_planning: true
        })
      });

      const data = await response.json();

      if (data.success) {
        setNewTask({
          title: "",
          description: "",
          type: "feature",
          priority: "medium",
        });
        setShowNewTaskForm(false);
        setSuccessMessage("✅ Auftrag erstellt – Agent-A hat den Plan erstellt!");
        
        await loadData();
        
        if (data.data?.task?.id) {
          setExpandedTaskId(data.data.task.id);
          loadTaskDetails(data.data.task.id);
        }
      } else {
        setError(data.error || "Fehler beim Erstellen");
      }

    } catch (err) {
      setError("Fehler beim Erstellen des Tasks");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // TASK DETAILS LADEN
  // =====================================================

  const loadTaskDetails = async (taskId: number) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
      return;
    }

    try {
      setLoadingDetail(true);
      
      // Task Details laden
      const response = await fetch(`/api/admin/dev-tasks?view=detail&id=${taskId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedTask(data.data.task);
        setSelectedTaskSteps(data.data.steps || []);
        setExpandedTaskId(taskId);
      }
      
      // Code-Changes laden (falls vorhanden)
      try {
        const changesRes = await fetch(`/api/admin/dev-tasks/run-build?taskId=${taskId}`);
        const changesData = await changesRes.json();
        if (changesData.success) {
          setSelectedTaskChanges(changesData.data.code_changes || []);
        }
      } catch (e) {
        setSelectedTaskChanges([]);
      }
      
      // Reviews laden (falls vorhanden)
      try {
        const reviewsRes = await fetch(`/api/admin/dev-tasks/run-review?taskId=${taskId}`);
        const reviewsData = await reviewsRes.json();
        if (reviewsData.success) {
          setSelectedTaskReviews(reviewsData.data.reviews || []);
        }
      } catch (e) {
        setSelectedTaskReviews([]);
      }
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // =====================================================
  // AGENT-B BUILD
  // =====================================================

  const handleRunAgentB = async (taskId: number) => {
    try {
      setRunningAgentB(taskId);
      setError(null);

      const response = await fetch("/api/admin/dev-tasks/run-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, use_mock: true })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`🔧 Agent-B: ${data.data.changes_count} Code-Änderungen generiert!`);
        await loadData();
        loadTaskDetails(taskId);
      } else {
        setError(data.error || "Agent-B Fehler");
      }

    } catch (err) {
      setError("Agent-B konnte nicht gestartet werden");
      console.error(err);
    } finally {
      setRunningAgentB(null);
    }
  };

  // =====================================================
  // AGENT-C REVIEW
  // =====================================================

  const handleRunAgentC = async (taskId: number) => {
    try {
      setRunningAgentC(taskId);
      setError(null);

      const response = await fetch("/api/admin/dev-tasks/run-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, use_mock: true })
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.quality_gate_passed) {
          setSuccessMessage(`✅ Agent-C: Quality Gate BESTANDEN! Score: ${data.data.overall_score}/100`);
        } else {
          setSuccessMessage(`⚠️ Agent-C: Review abgeschlossen – Score: ${data.data.overall_score}/100`);
        }
        await loadData();
        loadTaskDetails(taskId);
      } else {
        setError(data.error || "Agent-C Fehler");
      }

    } catch (err) {
      setError("Agent-C konnte nicht gestartet werden");
      console.error(err);
    } finally {
      setRunningAgentC(null);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e4e4e7]">
      {/* Header */}
      <div className="border-b border-[#27272a] bg-[#111113]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/ai"
                className="p-2 hover:bg-[#27272a] rounded-lg transition-colors"
              >
                <FaArrowLeft className="h-4 w-4" />
              </Link>
              <div className="p-3 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] rounded-xl">
                <FaRobot className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Entwicklungsaufträge</h1>
                <p className="text-sm text-[#71717a]">
                  Enterprise++ Orchestrator • Agent-A → Agent-B → Agent-C
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="p-2 hover:bg-[#27272a] rounded-lg transition-colors"
                title="Aktualisieren"
              >
                <FaSync className={loading ? "animate-spin" : ""} />
              </button>
              <button
                onClick={() => setShowNewTaskForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#ffd700] hover:bg-[#ffed4a] text-black font-medium rounded-lg transition-colors"
              >
                <FaPlus className="h-4 w-4" />
                Neuer Auftrag
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Erfolgs-Anzeige */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 flex items-center gap-3">
            <FaCheckCircle />
            {successMessage}
          </div>
        )}
        
        {/* Fehler-Anzeige */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle />
              {error}
            </div>
            <button onClick={() => setError(null)} className="underline">
              Schließen
            </button>
          </div>
        )}

        {/* Statistiken */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-[#111113] border border-[#27272a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#71717a] text-sm">Aufträge</span>
                <FaListOl className="h-4 w-4 text-[#ffd700]" />
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-[#111113] border border-[#27272a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#71717a] text-sm">Geplant</span>
                <FaCheckCircle className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold">{stats.byStatus.planned || 0}</div>
            </div>
            <div className="bg-[#111113] border border-[#27272a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#71717a] text-sm">In Entwicklung</span>
                <FaCog className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold">{stats.byStatus.coding || 0}</div>
            </div>
            <div className="bg-[#111113] border border-[#27272a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#71717a] text-sm">Im Review</span>
                <FaEye className="h-4 w-4 text-orange-400" />
              </div>
              <div className="text-2xl font-bold">{stats.byStatus.review || 0}</div>
            </div>
            <div className="bg-[#111113] border border-[#27272a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#71717a] text-sm">Fertig</span>
                <FaCheck className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold">{stats.byStatus.done || 0}</div>
            </div>
          </div>
        )}

        {/* Workflow-Legende */}
        <div className="mb-6 p-4 bg-[#111113] border border-[#27272a] rounded-xl">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-[#71717a]">Workflow:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#3b341c] text-[#fbbf24] rounded text-xs">Agent-A</span>
              <span className="text-[#52525b]">Plant</span>
            </div>
            <span className="text-[#52525b]">→</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#2d1c3b] text-[#a78bfa] rounded text-xs">Agent-B</span>
              <span className="text-[#52525b]">Codet</span>
            </div>
            <span className="text-[#52525b]">→</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#3b2a1c] text-[#fb923c] rounded text-xs">Agent-C</span>
              <span className="text-[#52525b]">Prüft</span>
            </div>
            <span className="text-[#52525b]">→</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#1c3b24] text-[#4ade80] rounded text-xs">✓ Fertig</span>
            </div>
          </div>
        </div>

        {/* Neuer Task Modal */}
        {showNewTaskForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#111113] border border-[#27272a] rounded-2xl p-6 w-full max-w-2xl mx-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaPlus className="text-[#ffd700]" />
                Neuer Entwicklungsauftrag
              </h2>
              
              <form onSubmit={handleCreateTask}>
                <div className="space-y-4">
                  {/* Titel */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Titel</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="z.B. Login-Seite optimieren"
                      className="w-full px-4 py-2 bg-[#0a0a0f] border border-[#27272a] rounded-lg focus:border-[#ffd700] focus:outline-none"
                    />
                  </div>

                  {/* Beschreibung */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Beschreibung</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Beschreibe die Aufgabe so detailliert wie möglich..."
                      rows={5}
                      className="w-full px-4 py-2 bg-[#0a0a0f] border border-[#27272a] rounded-lg focus:border-[#ffd700] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Typ & Priorität */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Typ</label>
                      <select
                        value={newTask.type}
                        onChange={(e) => setNewTask({ ...newTask, type: e.target.value as DevTaskType })}
                        className="w-full px-4 py-2 bg-[#0a0a0f] border border-[#27272a] rounded-lg focus:border-[#ffd700] focus:outline-none"
                      >
                        {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                          <option key={key} value={key}>{config.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Priorität</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as DevTaskPriority })}
                        className="w-full px-4 py-2 bg-[#0a0a0f] border border-[#27272a] rounded-lg focus:border-[#ffd700] focus:outline-none"
                      >
                        {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                          <option key={key} value={key}>{config.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg text-sm">
                    <div className="flex items-center gap-2 text-[#ffd700] font-medium mb-1">
                      <FaRobot /> Agent-A Planungsautomatik
                    </div>
                    <p className="text-[#71717a]">
                      Nach dem Erstellen analysiert Agent-A Ihren Auftrag und erstellt automatisch einen strukturierten Arbeitsplan.
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewTaskForm(false)}
                    className="px-4 py-2 border border-[#27272a] rounded-lg hover:bg-[#27272a] transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex items-center gap-2 px-4 py-2 bg-[#ffd700] hover:bg-[#ffed4a] text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {creating ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Agent-A plant...
                      </>
                    ) : (
                      <>
                        <FaPlay />
                        Erstellen & Planen
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Task-Liste */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="h-8 w-8 text-[#ffd700] animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <FaRobot className="h-12 w-12 text-[#27272a] mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Noch keine Entwicklungsaufträge</h3>
            <p className="text-[#71717a] mb-4">
              Erstelle deinen ersten Auftrag und lass die Agenten arbeiten.
            </p>
            <button
              onClick={() => setShowNewTaskForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffd700] hover:bg-[#ffed4a] text-black font-medium rounded-lg transition-colors"
            >
              <FaPlus />
              Ersten Auftrag erstellen
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const typeConfig = TYPE_CONFIG[task.type];
              const statusConfig = STATUS_CONFIG[task.status];
              const priorityConfig = PRIORITY_CONFIG[task.priority];
              const TypeIcon = typeConfig.icon;
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className="bg-[#111113] border border-[#27272a] rounded-xl overflow-hidden"
                >
                  {/* Task Header */}
                  <div
                    onClick={() => loadTaskDetails(task.id)}
                    className="p-4 cursor-pointer hover:bg-[#1a1a1f] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Typ Icon */}
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: typeConfig.bgColor }}
                      >
                        <TypeIcon className="h-5 w-5" style={{ color: typeConfig.color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">{task.title}</span>
                          <span
                            className="px-2 py-0.5 text-xs rounded-full flex items-center gap-1"
                            style={{
                              backgroundColor: statusConfig.bgColor,
                              color: statusConfig.color,
                            }}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </span>
                          {task.steps_count && task.steps_count > 0 && (
                            <span className="text-xs text-[#71717a]">
                              {task.steps_count} Schritte
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#71717a] truncate">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-[#52525b]">
                          <span style={{ color: priorityConfig.color }}>
                            {priorityConfig.label}
                          </span>
                          <span>•</span>
                          <span>#{task.id}</span>
                          <span>•</span>
                          <span>{new Date(task.created_at).toLocaleDateString("de-DE")}</span>
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <div className="text-[#52525b]">
                        {loadingDetail && expandedTaskId === null ? (
                          <FaSpinner className="animate-spin" />
                        ) : isExpanded ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-[#27272a]">
                      {/* Agent Actions */}
                      <div className="p-4 bg-[#0a0a0f] border-b border-[#27272a]">
                        <div className="flex items-center gap-3">
                          {/* Agent-B Button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRunAgentB(task.id); }}
                            disabled={task.status !== "planned" || runningAgentB === task.id}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              task.status === "planned"
                                ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
                                : "bg-[#27272a] text-[#52525b] cursor-not-allowed"
                            }`}
                          >
                            {runningAgentB === task.id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaCog />
                            )}
                            Agent-B: Code generieren
                          </button>

                          {/* Agent-C Button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRunAgentC(task.id); }}
                            disabled={task.status !== "coding" || runningAgentC === task.id}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              task.status === "coding"
                                ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30"
                                : "bg-[#27272a] text-[#52525b] cursor-not-allowed"
                            }`}
                          >
                            {runningAgentC === task.id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaEye />
                            )}
                            Agent-C: Code prüfen
                          </button>

                          {/* Status Info */}
                          <span className="ml-auto text-xs text-[#71717a]">
                            {task.status === "planned" && "→ Bereit für Agent-B"}
                            {task.status === "coding" && "→ Bereit für Agent-C Review"}
                            {task.status === "review" && "→ Review läuft..."}
                            {task.status === "done" && "✓ Auftrag abgeschlossen"}
                          </span>
                        </div>
                      </div>

                      {/* Plan-Schritte */}
                      {selectedTaskSteps.length > 0 && (
                        <div className="p-4 bg-[#0a0a0f]">
                          <h4 className="text-sm font-medium text-[#ffd700] mb-3 flex items-center gap-2">
                            <FaListOl />
                            Plan-Schritte (Agent-A)
                          </h4>
                          <div className="space-y-2">
                            {selectedTaskSteps.map((step) => (
                              <div
                                key={step.id}
                                className="flex items-start gap-3 p-3 bg-[#111113] rounded-lg"
                              >
                                <div className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center text-xs font-medium">
                                  {step.step_number}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{step.title}</div>
                                  {step.details && (
                                    <p className="text-xs text-[#71717a] mt-1">{step.details}</p>
                                  )}
                                  {step.estimated_effort && (
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-[#27272a] rounded text-xs text-[#a1a1aa]">
                                      ⏱️ {step.estimated_effort}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Code-Changes */}
                      {selectedTaskChanges.length > 0 && (
                        <div className="p-4 bg-[#0a0a0f] border-t border-[#27272a]">
                          <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                            <FaCode />
                            Code-Änderungen (Agent-B)
                          </h4>
                          <div className="space-y-2">
                            {selectedTaskChanges.map((change) => (
                              <div
                                key={change.id}
                                className="flex items-center gap-3 p-3 bg-[#111113] rounded-lg"
                              >
                                <FaCode className="text-purple-400" />
                                <div className="flex-1">
                                  <div className="font-mono text-sm text-purple-300">{change.file_path}</div>
                                  <p className="text-xs text-[#71717a]">{change.explanation}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded ${
                                  change.status === "approved" ? "bg-green-500/20 text-green-400" :
                                  change.status === "rejected" ? "bg-red-500/20 text-red-400" :
                                  "bg-[#27272a] text-[#71717a]"
                                }`}>
                                  {change.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reviews */}
                      {selectedTaskReviews.length > 0 && (
                        <div className="p-4 bg-[#0a0a0f] border-t border-[#27272a]">
                          <h4 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                            <FaEye />
                            Reviews (Agent-C)
                          </h4>
                          <div className="space-y-2">
                            {selectedTaskReviews.map((review) => (
                              <div
                                key={review.id}
                                className="p-3 bg-[#111113] rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    review.review_status === "approved" ? "bg-green-500/20 text-green-400" :
                                    review.review_status === "rejected" ? "bg-red-500/20 text-red-400" :
                                    "bg-orange-500/20 text-orange-400"
                                  }`}>
                                    {review.review_status}
                                  </span>
                                  <span className="text-sm font-bold" style={{
                                    color: review.quality_score >= 80 ? "#4ade80" : 
                                           review.quality_score >= 60 ? "#fbbf24" : "#ef4444"
                                  }}>
                                    Score: {review.quality_score}/100
                                  </span>
                                </div>
                                <pre className="text-xs text-[#71717a] whitespace-pre-wrap font-mono">
                                  {review.feedback}
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty State */}
                      {selectedTaskSteps.length === 0 && (
                        <div className="p-4 text-center text-[#71717a]">
                          Keine Details vorhanden
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
