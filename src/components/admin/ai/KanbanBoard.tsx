"use client";

// =====================================================
// KANBAN BOARD - Enterprise++ Dev-Tasks
// =====================================================
// Visualisiert Dev-Tasks im Kanban-Stil
// Status-Flow: OPEN → PLANNING → PLANNED → CODING → REVIEW → DONE
// =====================================================

import { useState, useCallback, useEffect } from "react";
import {
  FaClipboardList,
  FaRobot,
  FaFileAlt,
  FaCode,
  FaSearch,
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowRight,
  FaTimes,
  FaExternalLinkAlt
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

type DevTaskStatus = "open" | "planning" | "planned" | "coding" | "review" | "done" | "cancelled";
type DevTaskPriority = "low" | "medium" | "high" | "critical";
type DevTaskType = "bug" | "feature" | "refactor" | "documentation" | "security";

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

interface KanbanColumn {
  id: DevTaskStatus;
  title: string;
  icon: typeof FaClipboardList;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface KanbanBoardProps {
  onTaskClick?: (task: DevTask) => void;
  showCancelled?: boolean;
}

// =====================================================
// KONFIGURATION
// =====================================================

const COLUMNS: KanbanColumn[] = [
  {
    id: "open",
    title: "Offen",
    icon: FaClipboardList,
    color: "text-gray-400",
    bgColor: "bg-gray-400/10",
    borderColor: "border-gray-400/30"
  },
  {
    id: "planning",
    title: "Planung (Agent-A)",
    icon: FaRobot,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/30"
  },
  {
    id: "planned",
    title: "Geplant",
    icon: FaFileAlt,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30"
  },
  {
    id: "coding",
    title: "Coding (Agent-B)",
    icon: FaCode,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30"
  },
  {
    id: "review",
    title: "Review (Agent-C)",
    icon: FaSearch,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/30"
  },
  {
    id: "done",
    title: "Fertig",
    icon: FaCheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30"
  }
];

const PRIORITY_CONFIG: Record<DevTaskPriority, { color: string; label: string }> = {
  critical: { color: "bg-red-500", label: "Kritisch" },
  high: { color: "bg-orange-500", label: "Hoch" },
  medium: { color: "bg-yellow-500", label: "Mittel" },
  low: { color: "bg-blue-500", label: "Niedrig" }
};

const TYPE_CONFIG: Record<DevTaskType, { icon: string; label: string }> = {
  bug: { icon: "🐛", label: "Bug" },
  feature: { icon: "✨", label: "Feature" },
  refactor: { icon: "♻️", label: "Refactor" },
  documentation: { icon: "📚", label: "Doku" },
  security: { icon: "🔒", label: "Security" }
};

// =====================================================
// TASK CARD KOMPONENTE
// =====================================================

interface TaskCardProps {
  task: DevTask;
  onClick?: () => void;
  onStatusChange?: (newStatus: DevTaskStatus) => void;
  isUpdating?: boolean;
}

function TaskCard({ task, onClick, onStatusChange, isUpdating }: TaskCardProps) {
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const typeConfig = TYPE_CONFIG[task.type];
  
  // Nächster Status im Workflow
  const getNextStatus = (): DevTaskStatus | null => {
    const flow: DevTaskStatus[] = ["open", "planning", "planned", "coding", "review", "done"];
    const currentIndex = flow.indexOf(task.status);
    if (currentIndex < flow.length - 1) {
      return flow[currentIndex + 1];
    }
    return null;
  };
  
  const nextStatus = getNextStatus();
  
  return (
    <div 
      className="bg-[#0a0a0e] border border-[#272a33] rounded-lg p-3 hover:border-[#ffd700]/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{typeConfig.icon}</span>
          <span className="text-xs font-mono text-[#71717a]">#{task.id}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${priorityConfig.color}`} title={priorityConfig.label} />
      </div>
      
      {/* Title */}
      <h4 className="text-sm font-medium text-[#f4f4f4] line-clamp-2 mb-2">
        {task.title}
      </h4>
      
      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-[#71717a]">
        <span>{task.project_code}</span>
        {task.steps_count !== undefined && task.steps_count > 0 && (
          <span className="flex items-center gap-1">
            <FaFileAlt className="h-3 w-3" />
            {task.steps_count} Schritte
          </span>
        )}
      </div>
      
      {/* Quick Actions (on hover) */}
      {nextStatus && onStatusChange && (
        <div className="mt-2 pt-2 border-t border-[#272a33] opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(nextStatus);
            }}
            disabled={isUpdating}
            className="flex items-center gap-1 text-xs text-[#ffd700] hover:text-[#ffed4a] disabled:opacity-50"
          >
            {isUpdating ? (
              <FaSpinner className="h-3 w-3 animate-spin" />
            ) : (
              <>
                <FaArrowRight className="h-3 w-3" />
                <span>→ {COLUMNS.find(c => c.id === nextStatus)?.title}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// =====================================================
// KANBAN COLUMN KOMPONENTE
// =====================================================

interface KanbanColumnProps {
  column: KanbanColumn;
  tasks: DevTask[];
  onTaskClick?: (task: DevTask) => void;
  onTaskStatusChange?: (taskId: number, newStatus: DevTaskStatus) => void;
  updatingTaskId?: number | null;
}

function KanbanColumnComponent({ 
  column, 
  tasks, 
  onTaskClick,
  onTaskStatusChange,
  updatingTaskId
}: KanbanColumnProps) {
  const Icon = column.icon;
  
  return (
    <div className={`flex-shrink-0 w-72 bg-[#111217] border ${column.borderColor} rounded-xl overflow-hidden`}>
      {/* Column Header */}
      <div className={`p-3 ${column.bgColor} border-b ${column.borderColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${column.color}`} />
            <span className={`font-medium ${column.color}`}>{column.title}</span>
          </div>
          <span className={`text-sm ${column.color}`}>{tasks.length}</span>
        </div>
      </div>
      
      {/* Tasks */}
      <div className="p-3 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-4 text-[#71717a] text-sm">
            Keine Tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick?.(task)}
              onStatusChange={(newStatus) => onTaskStatusChange?.(task.id, newStatus)}
              isUpdating={updatingTaskId === task.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

// =====================================================
// HAUPT-KOMPONENTE
// =====================================================

export function KanbanBoard({ onTaskClick, showCancelled = false }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<DevTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<DevTask | null>(null);

  // Tasks laden
  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/dev-tasks");
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.data || []);
      } else {
        setError(data.error || "Fehler beim Laden");
      }
    } catch (err) {
      setError("Verbindungsfehler");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Task-Status ändern
  const handleStatusChange = async (taskId: number, newStatus: DevTaskStatus) => {
    setUpdatingTaskId(taskId);
    
    try {
      const response = await fetch(`/api/admin/dev-tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Optimistisches Update
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, status: newStatus } : t
        ));
      } else {
        setError(data.error || "Status-Änderung fehlgeschlagen");
      }
    } catch (err) {
      setError("Verbindungsfehler");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Tasks nach Status gruppieren
  const getTasksByStatus = (status: DevTaskStatus): DevTask[] => {
    return tasks
      .filter(t => t.status === status)
      .sort((a, b) => {
        // Priorität sortieren (critical zuerst)
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="h-8 w-8 text-[#ffd700] animate-spin" />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
        <div className="flex items-center gap-2 text-red-400">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
        <button 
          onClick={loadTasks}
          className="mt-2 text-sm text-[#ffd700] hover:underline"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  // Columns zum Anzeigen
  const visibleColumns = showCancelled 
    ? [...COLUMNS, { id: "cancelled" as DevTaskStatus, title: "Abgebrochen", icon: FaTimes, color: "text-red-400", bgColor: "bg-red-400/10", borderColor: "border-red-400/30" }]
    : COLUMNS;

  return (
    <div className="relative">
      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {visibleColumns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.id)}
            onTaskClick={(task) => {
              setSelectedTask(task);
              onTaskClick?.(task);
            }}
            onTaskStatusChange={handleStatusChange}
            updatingTaskId={updatingTaskId}
          />
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111217] border border-[#272a33] rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[#111217] border-b border-[#272a33] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{TYPE_CONFIG[selectedTask.type].icon}</span>
                <div>
                  <h3 className="font-semibold text-[#f4f4f4]">Task #{selectedTask.id}</h3>
                  <span className="text-xs text-[#71717a]">{selectedTask.project_code}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-2 hover:bg-[#272a33] rounded-lg"
              >
                <FaTimes className="h-4 w-4 text-[#71717a]" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Title */}
              <h2 className="text-lg font-medium text-[#f4f4f4]">{selectedTask.title}</h2>
              
              {/* Meta */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${PRIORITY_CONFIG[selectedTask.priority].color} text-white`}>
                  {PRIORITY_CONFIG[selectedTask.priority].label}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-[#272a33] text-[#b3b3b3]">
                  {TYPE_CONFIG[selectedTask.type].label}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-[#272a33] text-[#b3b3b3]">
                  {COLUMNS.find(c => c.id === selectedTask.status)?.title || selectedTask.status}
                </span>
              </div>
              
              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-[#b3b3b3] mb-2">Beschreibung</h4>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-[#a1a1aa] whitespace-pre-wrap">{selectedTask.description}</p>
                </div>
              </div>
              
              {/* Steps */}
              {selectedTask.steps_count !== undefined && selectedTask.steps_count > 0 && (
                <div className="p-3 bg-[#0a0a0e] rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#b3b3b3]">Geplante Schritte</span>
                    <span className="text-sm font-medium text-[#f4f4f4]">{selectedTask.steps_count}</span>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#272a33]">
                <a
                  href={`/admin/ai/dev-tasks?taskId=${selectedTask.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#ffd700] hover:bg-[#ffed4a] text-black font-medium rounded-lg transition-colors"
                >
                  <FaExternalLinkAlt className="h-3 w-3" />
                  Details anzeigen
                </a>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 bg-[#272a33] hover:bg-[#353840] text-[#f4f4f4] rounded-lg transition-colors"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-4 p-3 bg-[#111217] border border-[#272a33] rounded-lg flex items-center justify-between text-sm">
        <span className="text-[#b3b3b3]">
          {tasks.length} Tasks insgesamt
        </span>
        <div className="flex items-center gap-4">
          <span className="text-green-400">{getTasksByStatus("done").length} fertig</span>
          <span className="text-amber-400">{tasks.filter(t => ["planning", "coding", "review"].includes(t.status)).length} in Arbeit</span>
          <span className="text-gray-400">{getTasksByStatus("open").length} offen</span>
        </div>
      </div>
    </div>
  );
}

export default KanbanBoard;

