// =====================================================
// AI CENTER - RISK TO TASK API
// =====================================================
// POST /api/admin/ai/risk-to-task
// Erstellt einen Dev-Task aus einem Projekt-Analyzer-Risiko
// =====================================================
// Enterprise++ Workflow: Risiko → Entwicklungsauftrag
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { DevTasksService, DevTaskType, DevTaskPriority } from "@/lib/dev-tasks-service";
import { getConnection } from "@/lib/database";

// =====================================================
// TYPEN
// =====================================================

interface RiskToTaskRequest {
  // Risiko-Daten
  risk_id: string;
  risk_type: string;           // 'security', 'performance', 'accessibility', 'maintainability', etc.
  risk_severity: string;       // 'critical', 'high', 'medium', 'low'
  risk_title: string;
  risk_description: string;
  risk_file_path?: string;
  risk_line?: number;
  
  // Projekt-Kontext
  project_code?: string;
  project_preset?: string;     // 'core', 'admin', 'ai_center', etc.
  
  // Optionen
  auto_plan?: boolean;         // Automatisch Agent-A starten
  created_by?: string;
}

// =====================================================
// MAPPING-FUNKTIONEN
// =====================================================

/**
 * Mappt Risiko-Typ auf DevTask-Typ
 */
function mapRiskTypeToTaskType(riskType: string): DevTaskType {
  const mapping: Record<string, DevTaskType> = {
    "security": "security",
    "sec": "security",
    "vulnerability": "security",
    "xss": "security",
    "injection": "security",
    
    "performance": "refactor",
    "perf": "refactor",
    "optimization": "refactor",
    
    "accessibility": "feature",
    "a11y": "feature",
    
    "maintainability": "refactor",
    "code_quality": "refactor",
    "complexity": "refactor",
    
    "documentation": "documentation",
    "docs": "documentation",
    
    "bug": "bug",
    "error": "bug",
    "defect": "bug"
  };
  
  const lowerType = riskType.toLowerCase();
  return mapping[lowerType] || "refactor";
}

/**
 * Mappt Risiko-Severity auf Task-Priorität
 */
function mapSeverityToPriority(severity: string): DevTaskPriority {
  const mapping: Record<string, DevTaskPriority> = {
    "critical": "critical",
    "high": "high",
    "medium": "medium",
    "low": "low",
    "info": "low"
  };
  
  return mapping[severity.toLowerCase()] || "medium";
}

/**
 * Generiert Task-Titel aus Risiko
 */
function generateTaskTitle(riskType: string, riskTitle: string): string {
  const prefixes: Record<string, string> = {
    "security": "[SEC]",
    "performance": "[PERF]",
    "accessibility": "[A11Y]",
    "maintainability": "[REFACTOR]",
    "documentation": "[DOC]",
    "bug": "[BUG]"
  };
  
  const prefix = prefixes[riskType.toLowerCase()] || "[RISK]";
  
  // Titel kürzen wenn zu lang
  const cleanTitle = riskTitle.length > 80 
    ? riskTitle.substring(0, 77) + "..."
    : riskTitle;
  
  return `${prefix} ${cleanTitle}`;
}

/**
 * Generiert Task-Beschreibung aus Risiko
 */
function generateTaskDescription(request: RiskToTaskRequest): string {
  let description = `## Automatisch generiert aus Projekt-Analyzer

### Risiko-Details
- **Typ:** ${request.risk_type}
- **Severity:** ${request.risk_severity}
- **Risk-ID:** ${request.risk_id}

### Beschreibung
${request.risk_description}
`;

  if (request.risk_file_path) {
    description += `
### Betroffene Datei
- **Pfad:** \`${request.risk_file_path}\``;
    if (request.risk_line) {
      description += `
- **Zeile:** ${request.risk_line}`;
    }
  }

  if (request.project_preset) {
    description += `

### Projekt-Kontext
- **Preset:** ${request.project_preset}`;
  }

  description += `

---
*Erstellt via Risk-to-Task | Enterprise++ AI Center*`;

  return description;
}

// =====================================================
// POST - Risiko zu Task konvertieren
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body: RiskToTaskRequest = await request.json();
    
    // Validierung
    if (!body.risk_id || !body.risk_type || !body.risk_title) {
      return NextResponse.json(
        { 
          success: false, 
          error: "risk_id, risk_type und risk_title sind erforderlich" 
        },
        { status: 400 }
      );
    }
    
    // Prüfe ob bereits ein Task für dieses Risiko existiert
    const pool = await getConnection();
    try {
      // @sql-safe: risk_id wird als Parameter-Wert verwendet (über ? Platzhalter)
      // Der Template-Literal konstruiert nur den LIKE-Pattern-String, nicht die SQL-Query
      const likePattern = `%Risk-ID:** ${body.risk_id}%`;
      const [existing] = await pool.execute(
        `SELECT id FROM dev_tasks WHERE description LIKE ?`,
        [likePattern]
      );
      
      if ((existing as any[]).length > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Für dieses Risiko existiert bereits ein Task",
            existing_task_id: (existing as any[])[0].id
          },
          { status: 409 }
        );
      }
    } catch (e) {
      // Tabelle existiert möglicherweise nicht - OK
    }
    
    // Task-Daten vorbereiten
    const taskType = mapRiskTypeToTaskType(body.risk_type);
    const taskPriority = mapSeverityToPriority(body.risk_severity || "medium");
    const taskTitle = generateTaskTitle(body.risk_type, body.risk_title);
    const taskDescription = generateTaskDescription(body);
    
    // Task erstellen
    const task = await DevTasksService.createTask({
      title: taskTitle,
      description: taskDescription,
      type: taskType,
      priority: taskPriority,
      project_code: body.project_code || "LOPEZ-IT-WELT",
      created_by: body.created_by || "risk-to-task"
    });
    
    // Audit-Log
    try {
      await pool.execute(`
        INSERT INTO lopez_audit_logs (user_id, action, entity_type, entity_id, details)
        VALUES (?, 'AI_RISK_TO_TASK_CREATED', 'dev_task', ?, ?)
      `, [
        1,
        task.id,
        JSON.stringify({
          risk_id: body.risk_id,
          risk_type: body.risk_type,
          risk_severity: body.risk_severity,
          task_type: taskType,
          task_priority: taskPriority
        })
      ]);
    } catch (e) {
      // Audit optional
    }
    
    console.log(`✅ Risk-to-Task: Task #${task.id} erstellt für Risiko ${body.risk_id}`);
    
    // Optional: Agent-A automatisch starten
    let planningStarted = false;
    if (body.auto_plan) {
      try {
        // Agent-A Planung anstoßen (async, nicht blockierend)
        fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/dev-tasks/run-plan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId: task.id })
        }).catch(() => {
          // Async, Fehler ignorieren
        });
        planningStarted = true;
      } catch (e) {
        // Planung optional
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Dev-Task #${task.id} aus Risiko erstellt`,
      data: {
        task,
        mapping: {
          risk_type: body.risk_type,
          task_type: taskType,
          risk_severity: body.risk_severity,
          task_priority: taskPriority
        },
        planning_started: planningStarted
      }
    });
    
  } catch (error) {
    console.error("❌ Risk-to-Task Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Fehler beim Erstellen des Tasks"
      },
      { status: 500 }
    );
  }
}





