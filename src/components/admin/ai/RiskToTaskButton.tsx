"use client";

// =====================================================
// RISK TO TASK BUTTON - Enterprise++ UI Component
// =====================================================
// Erstellt einen Dev-Task aus einem Projekt-Analyzer-Risiko
// =====================================================

import { useState } from "react";
import { 
  FaClipboardList, 
  FaSpinner, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaRobot
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

export interface ProjectRisk {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  file_path?: string;
  line?: number;
}

interface RiskToTaskButtonProps {
  risk: ProjectRisk;
  projectCode?: string;
  projectPreset?: string;
  autoStartPlanning?: boolean;
  onTaskCreated?: (taskId: number) => void;
  variant?: "button" | "icon" | "inline";
  size?: "sm" | "md" | "lg";
}

// =====================================================
// KOMPONENTE
// =====================================================

export function RiskToTaskButton({
  risk,
  projectCode = "LOPEZ-IT-WELT",
  projectPreset,
  autoStartPlanning = false,
  onTaskCreated,
  variant = "button",
  size = "md"
}: RiskToTaskButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdTaskId, setCreatedTaskId] = useState<number | null>(null);

  const handleClick = async () => {
    if (isLoading || isCreated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/admin/ai/risk-to-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          risk_id: risk.id,
          risk_type: risk.type,
          risk_severity: risk.severity,
          risk_title: risk.title,
          risk_description: risk.description,
          risk_file_path: risk.file_path,
          risk_line: risk.line,
          project_code: projectCode,
          project_preset: projectPreset,
          auto_plan: autoStartPlanning,
          created_by: "project-analyzer"
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsCreated(true);
        setCreatedTaskId(data.data.task.id);
        onTaskCreated?.(data.data.task.id);
      } else {
        if (data.existing_task_id) {
          setError(`Task #${data.existing_task_id} existiert bereits`);
          setCreatedTaskId(data.existing_task_id);
        } else {
          setError(data.error || "Fehler beim Erstellen");
        }
      }
    } catch (err) {
      setError("Verbindungsfehler");
    } finally {
      setIsLoading(false);
    }
  };

  // Severity-basierte Farben
  const severityColors = {
    critical: "text-red-400",
    high: "text-orange-400",
    medium: "text-yellow-400",
    low: "text-blue-400"
  };

  // Size-basierte Klassen
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  // Icon-only Variante
  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        title={isCreated ? `Task #${createdTaskId} erstellt` : "Dev-Task erstellen"}
        className={`
          p-2 rounded-lg transition-all
          ${isCreated 
            ? "bg-green-400/10 text-green-400 cursor-default" 
            : isLoading
              ? "bg-[#272a33] text-[#b3b3b3] cursor-wait"
              : "bg-[#272a33] hover:bg-[#353840] text-[#b3b3b3] hover:text-[#ffd700]"
          }
        `}
      >
        {isLoading ? (
          <FaSpinner className="h-4 w-4 animate-spin" />
        ) : isCreated ? (
          <FaCheckCircle className="h-4 w-4" />
        ) : (
          <FaClipboardList className="h-4 w-4" />
        )}
      </button>
    );
  }

  // Inline Variante (kompakt)
  if (variant === "inline") {
    if (isCreated) {
      return (
        <a 
          href={`/admin/ai/dev-tasks?taskId=${createdTaskId}`}
          className="inline-flex items-center gap-1 text-xs text-green-400 hover:underline"
        >
          <FaCheckCircle className="h-3 w-3" />
          Task #{createdTaskId}
        </a>
      );
    }
    
    if (error && createdTaskId) {
      return (
        <a 
          href={`/admin/ai/dev-tasks?taskId=${createdTaskId}`}
          className="inline-flex items-center gap-1 text-xs text-yellow-400 hover:underline"
        >
          <FaExclamationTriangle className="h-3 w-3" />
          Task #{createdTaskId}
        </a>
      );
    }
    
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="inline-flex items-center gap-1 text-xs text-[#b3b3b3] hover:text-[#ffd700] transition-colors"
      >
        {isLoading ? (
          <>
            <FaSpinner className="h-3 w-3 animate-spin" />
            <span>Erstelle...</span>
          </>
        ) : (
          <>
            <FaClipboardList className="h-3 w-3" />
            <span>Task erstellen</span>
          </>
        )}
      </button>
    );
  }

  // Standard Button Variante
  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isLoading || isCreated}
        className={`
          inline-flex items-center gap-2 rounded-lg font-medium transition-all
          ${sizeClasses[size]}
          ${isCreated
            ? "bg-green-400/10 text-green-400 border border-green-400/30 cursor-default"
            : isLoading
              ? "bg-[#272a33] text-[#b3b3b3] cursor-wait"
              : `bg-[#272a33] hover:bg-[#353840] text-[#f4f4f4] hover:text-[#ffd700] border border-[#272a33] hover:border-[#ffd700]/50`
          }
        `}
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>Erstelle Task...</span>
          </>
        ) : isCreated ? (
          <>
            <FaCheckCircle />
            <span>Task #{createdTaskId} erstellt</span>
          </>
        ) : (
          <>
            <FaClipboardList />
            <span>Dev-Task erstellen</span>
          </>
        )}
      </button>
      
      {/* Auto-Planning Indikator */}
      {isCreated && autoStartPlanning && (
        <div className="absolute -top-1 -right-1">
          <div className="p-1 bg-amber-400/20 rounded-full" title="Agent-A Planung gestartet">
            <FaRobot className="h-3 w-3 text-amber-400" />
          </div>
        </div>
      )}
      
      {/* Error Tooltip */}
      {error && !createdTaskId && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400 whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
}

// =====================================================
// BULK RISK TO TASK
// =====================================================

interface BulkRiskToTaskProps {
  risks: ProjectRisk[];
  projectCode?: string;
  projectPreset?: string;
  onAllCreated?: (taskIds: number[]) => void;
}

export function BulkRiskToTask({
  risks,
  projectCode,
  projectPreset,
  onAllCreated
}: BulkRiskToTaskProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [createdIds, setCreatedIds] = useState<number[]>([]);

  const handleBulkCreate = async () => {
    if (isLoading || risks.length === 0) return;
    
    setIsLoading(true);
    setProgress(0);
    const taskIds: number[] = [];
    
    for (let i = 0; i < risks.length; i++) {
      const risk = risks[i];
      
      try {
        const response = await fetch("/api/admin/ai/risk-to-task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            risk_id: risk.id,
            risk_type: risk.type,
            risk_severity: risk.severity,
            risk_title: risk.title,
            risk_description: risk.description,
            risk_file_path: risk.file_path,
            risk_line: risk.line,
            project_code: projectCode,
            project_preset: projectPreset,
            created_by: "bulk-risk-to-task"
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          taskIds.push(data.data.task.id);
        } else if (data.existing_task_id) {
          taskIds.push(data.existing_task_id);
        }
      } catch (err) {
        // Einzelne Fehler überspringen
      }
      
      setProgress(Math.round(((i + 1) / risks.length) * 100));
    }
    
    setCreatedIds(taskIds);
    setIsLoading(false);
    onAllCreated?.(taskIds);
  };

  if (createdIds.length > 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-400">
        <FaCheckCircle />
        <span>{createdIds.length} Tasks erstellt</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleBulkCreate}
      disabled={isLoading || risks.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-[#ffd700]/10 hover:bg-[#ffd700]/20 text-[#ffd700] rounded-lg transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <FaSpinner className="animate-spin" />
          <span>{progress}%</span>
        </>
      ) : (
        <>
          <FaClipboardList />
          <span>Alle {risks.length} Risiken → Tasks</span>
        </>
      )}
    </button>
  );
}

export default RiskToTaskButton;







