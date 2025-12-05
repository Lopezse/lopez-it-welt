// =====================================================
// AI CENTER - WORKFLOW ENGINE
// =====================================================
// Enterprise++ Auto-Workflow System
// Trigger-basierte Automatisierung
// =====================================================

import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// =====================================================
// TYPEN
// =====================================================

export type WorkflowTriggerType = 
  | "risk_detected"           // Risiko im Analyzer erkannt
  | "risk_critical"           // Kritisches Risiko erkannt
  | "task_created"            // Dev-Task erstellt
  | "task_completed"          // Dev-Task abgeschlossen
  | "task_failed"             // Dev-Task fehlgeschlagen
  | "cost_threshold"          // Kostengrenze erreicht
  | "agent_error"             // Agent-Fehler
  | "scheduled"               // Zeitgesteuert
  | "manual";                 // Manuell ausgelöst

export type WorkflowActionType =
  | "create_task"             // Dev-Task erstellen
  | "send_notification"       // Benachrichtigung senden
  | "run_playbook"            // Playbook ausführen
  | "start_agent"             // Agent starten
  | "create_report"           // Report erstellen
  | "log_event"               // Event loggen
  | "webhook";                // Webhook aufrufen

export type WorkflowStatus = "active" | "paused" | "disabled";

export interface WorkflowTrigger {
  type: WorkflowTriggerType;
  conditions?: Record<string, any>;  // z.B. { severity: "critical" }
  schedule?: string;                  // CRON für scheduled
}

export interface WorkflowAction {
  type: WorkflowActionType;
  config: Record<string, any>;
  order: number;
}

export interface Workflow {
  id: number;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  status: WorkflowStatus;
  last_run_at: Date | null;
  run_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface WorkflowExecution {
  id: number;
  workflow_id: number;
  trigger_data: Record<string, any>;
  status: "running" | "completed" | "failed";
  started_at: Date;
  completed_at: Date | null;
  result: Record<string, any> | null;
  error: string | null;
}

// =====================================================
// WORKFLOW ENGINE SERVICE
// =====================================================

export class WorkflowEngine {

  // -------------------------------------------------
  // WORKFLOW CRUD
  // -------------------------------------------------

  /**
   * Erstellt einen neuen Workflow
   */
  static async createWorkflow(workflow: Omit<Workflow, "id" | "last_run_at" | "run_count" | "created_at" | "updated_at">): Promise<Workflow> {
    const pool = await getConnection();
    
    const [result] = await pool.execute<ResultSetHeader>(`
      INSERT INTO ai_workflows (name, description, trigger_config, actions_config, status)
      VALUES (?, ?, ?, ?, ?)
    `, [
      workflow.name,
      workflow.description,
      JSON.stringify(workflow.trigger),
      JSON.stringify(workflow.actions),
      workflow.status
    ]);
    
    return this.getWorkflowById(result.insertId) as Promise<Workflow>;
  }

  /**
   * Holt Workflow nach ID
   */
  static async getWorkflowById(id: number): Promise<Workflow | null> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM ai_workflows WHERE id = ?
    `, [id]);
    
    if (rows.length === 0) return null;
    
    return this.mapRowToWorkflow(rows[0]);
  }

  /**
   * Listet alle Workflows
   */
  static async listWorkflows(status?: WorkflowStatus): Promise<Workflow[]> {
    const pool = await getConnection();
    
    let query = "SELECT * FROM ai_workflows";
    const params: any[] = [];
    
    if (status) {
      query += " WHERE status = ?";
      params.push(status);
    }
    
    query += " ORDER BY created_at DESC";
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    
    return rows.map(row => this.mapRowToWorkflow(row));
  }

  /**
   * Aktualisiert Workflow
   */
  static async updateWorkflow(id: number, updates: Partial<Workflow>): Promise<Workflow | null> {
    const pool = await getConnection();
    
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.name !== undefined) {
      fields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push("description = ?");
      values.push(updates.description);
    }
    if (updates.trigger !== undefined) {
      fields.push("trigger_config = ?");
      values.push(JSON.stringify(updates.trigger));
    }
    if (updates.actions !== undefined) {
      fields.push("actions_config = ?");
      values.push(JSON.stringify(updates.actions));
    }
    if (updates.status !== undefined) {
      fields.push("status = ?");
      values.push(updates.status);
    }
    
    if (fields.length === 0) return this.getWorkflowById(id);
    
    values.push(id);
    
    await pool.execute(`
      UPDATE ai_workflows SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?
    `, values);
    
    return this.getWorkflowById(id);
  }

  /**
   * Löscht Workflow
   */
  static async deleteWorkflow(id: number): Promise<boolean> {
    const pool = await getConnection();
    
    const [result] = await pool.execute<ResultSetHeader>(`
      DELETE FROM ai_workflows WHERE id = ?
    `, [id]);
    
    return result.affectedRows > 0;
  }

  // -------------------------------------------------
  // WORKFLOW EXECUTION
  // -------------------------------------------------

  /**
   * Findet passende Workflows für einen Trigger
   */
  static async findWorkflowsForTrigger(triggerType: WorkflowTriggerType, data: Record<string, any>): Promise<Workflow[]> {
    const workflows = await this.listWorkflows("active");
    
    return workflows.filter(workflow => {
      if (workflow.trigger.type !== triggerType) return false;
      
      // Conditions prüfen
      if (workflow.trigger.conditions) {
        for (const [key, value] of Object.entries(workflow.trigger.conditions)) {
          if (data[key] !== value) return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Führt einen Workflow aus
   */
  static async executeWorkflow(workflowId: number, triggerData: Record<string, any>): Promise<WorkflowExecution> {
    const pool = await getConnection();
    const workflow = await this.getWorkflowById(workflowId);
    
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} nicht gefunden`);
    }
    
    // Execution starten
    const [execResult] = await pool.execute<ResultSetHeader>(`
      INSERT INTO ai_workflow_executions (workflow_id, trigger_data, status)
      VALUES (?, ?, 'running')
    `, [workflowId, JSON.stringify(triggerData)]);
    
    const executionId = execResult.insertId;
    const results: Record<string, any>[] = [];
    let error: string | null = null;
    
    try {
      // Actions ausführen (sortiert nach order)
      const sortedActions = [...workflow.actions].sort((a, b) => a.order - b.order);
      
      for (const action of sortedActions) {
        const actionResult = await this.executeAction(action, triggerData, workflow);
        results.push({ action: action.type, result: actionResult });
      }
      
      // Erfolgreich
      await pool.execute(`
        UPDATE ai_workflow_executions 
        SET status = 'completed', completed_at = NOW(), result = ?
        WHERE id = ?
      `, [JSON.stringify(results), executionId]);
      
      // Workflow-Counter aktualisieren
      await pool.execute(`
        UPDATE ai_workflows SET last_run_at = NOW(), run_count = run_count + 1 WHERE id = ?
      `, [workflowId]);
      
    } catch (err) {
      error = err instanceof Error ? err.message : "Unbekannter Fehler";
      
      await pool.execute(`
        UPDATE ai_workflow_executions 
        SET status = 'failed', completed_at = NOW(), error = ?
        WHERE id = ?
      `, [error, executionId]);
    }
    
    // Execution zurückgeben
    const [execRows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM ai_workflow_executions WHERE id = ?
    `, [executionId]);
    
    return this.mapRowToExecution(execRows[0]);
  }

  /**
   * Führt eine einzelne Action aus
   */
  private static async executeAction(action: WorkflowAction, triggerData: Record<string, any>, workflow: Workflow): Promise<any> {
    switch (action.type) {
      case "create_task":
        return this.actionCreateTask(action.config, triggerData);
      
      case "send_notification":
        return this.actionSendNotification(action.config, triggerData);
      
      case "run_playbook":
        return this.actionRunPlaybook(action.config, triggerData);
      
      case "log_event":
        return this.actionLogEvent(action.config, triggerData, workflow);
      
      case "start_agent":
        return this.actionStartAgent(action.config, triggerData);
      
      case "create_report":
        return { status: "pending", message: "Report-Erstellung noch nicht implementiert" };
      
      case "webhook":
        return this.actionWebhook(action.config, triggerData);
      
      default:
        return { status: "skipped", message: `Unbekannte Action: ${action.type}` };
    }
  }

  // -------------------------------------------------
  // ACTION IMPLEMENTATIONS
  // -------------------------------------------------

  private static async actionCreateTask(config: Record<string, any>, triggerData: Record<string, any>): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/ai/risk-to-task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        risk_id: triggerData.risk_id || `AUTO-${Date.now()}`,
        risk_type: config.task_type || triggerData.risk_type || "refactor",
        risk_severity: config.priority || triggerData.severity || "medium",
        risk_title: config.title || triggerData.title || "Auto-generierter Task",
        risk_description: config.description || triggerData.description || "Automatisch erstellt durch Workflow",
        project_code: config.project_code || "LOPEZ-IT-WELT",
        auto_plan: config.auto_plan !== false,
        created_by: "workflow-engine"
      })
    });
    
    return response.json();
  }

  private static async actionSendNotification(config: Record<string, any>, triggerData: Record<string, any>): Promise<any> {
    // In-App Notification (Audit-Log)
    const pool = await getConnection();
    
    await pool.execute(`
      INSERT INTO lopez_audit_logs (user_id, action, entity_type, entity_id, details)
      VALUES (?, 'WORKFLOW_NOTIFICATION', 'notification', 0, ?)
    `, [
      1,
      JSON.stringify({
        type: config.notification_type || "info",
        title: config.title || "Workflow-Benachrichtigung",
        message: config.message || triggerData.message || "Ein Workflow wurde ausgeführt",
        channel: config.channel || "in_app",
        trigger_data: triggerData
      })
    ]);
    
    return { status: "sent", channel: config.channel || "in_app" };
  }

  private static async actionRunPlaybook(config: Record<string, any>, triggerData: Record<string, any>): Promise<any> {
    const playbookId = config.playbook_id;
    
    if (!playbookId) {
      return { status: "error", message: "playbook_id nicht angegeben" };
    }
    
    // Playbook ausführen (über PlaybookService)
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/ai/playbooks/${playbookId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: triggerData,
        dry_run: config.dry_run || false
      })
    });
    
    return response.json();
  }

  private static async actionLogEvent(config: Record<string, any>, triggerData: Record<string, any>, workflow: Workflow): Promise<any> {
    const pool = await getConnection();
    
    await pool.execute(`
      INSERT INTO lopez_audit_logs (user_id, action, entity_type, entity_id, details)
      VALUES (?, ?, 'workflow', ?, ?)
    `, [
      1,
      config.event_type || "WORKFLOW_EVENT",
      workflow.id,
      JSON.stringify({
        workflow_name: workflow.name,
        event: config.event || "executed",
        trigger_data: triggerData,
        ...config.extra_data
      })
    ]);
    
    return { status: "logged" };
  }

  private static async actionStartAgent(config: Record<string, any>, triggerData: Record<string, any>): Promise<any> {
    const agentName = config.agent_name;
    const taskId = config.task_id || triggerData.task_id;
    
    if (!agentName) {
      return { status: "error", message: "agent_name nicht angegeben" };
    }
    
    // Agent-spezifische Endpoints
    const agentEndpoints: Record<string, string> = {
      "Agent-A": "/api/admin/dev-tasks/run-plan",
      "Agent-B": "/api/admin/dev-tasks/run-code",
      "Agent-C": "/api/admin/dev-tasks/run-review"
    };
    
    const endpoint = agentEndpoints[agentName];
    if (!endpoint) {
      return { status: "error", message: `Unbekannter Agent: ${agentName}` };
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId })
    });
    
    return response.json();
  }

  private static async actionWebhook(config: Record<string, any>, triggerData: Record<string, any>): Promise<any> {
    const url = config.url;
    
    if (!url) {
      return { status: "error", message: "webhook url nicht angegeben" };
    }
    
    try {
      const response = await fetch(url, {
        method: config.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: JSON.stringify({
          event: config.event || "workflow_triggered",
          timestamp: new Date().toISOString(),
          data: triggerData
        })
      });
      
      return { 
        status: response.ok ? "success" : "error", 
        statusCode: response.status 
      };
    } catch (err) {
      return { 
        status: "error", 
        message: err instanceof Error ? err.message : "Webhook fehlgeschlagen" 
      };
    }
  }

  // -------------------------------------------------
  // HELPER
  // -------------------------------------------------

  private static mapRowToWorkflow(row: RowDataPacket): Workflow {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      trigger: JSON.parse(row.trigger_config || "{}"),
      actions: JSON.parse(row.actions_config || "[]"),
      status: row.status,
      last_run_at: row.last_run_at,
      run_count: row.run_count || 0,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  private static mapRowToExecution(row: RowDataPacket): WorkflowExecution {
    return {
      id: row.id,
      workflow_id: row.workflow_id,
      trigger_data: JSON.parse(row.trigger_data || "{}"),
      status: row.status,
      started_at: row.started_at,
      completed_at: row.completed_at,
      result: row.result ? JSON.parse(row.result) : null,
      error: row.error
    };
  }
}

// =====================================================
// TRIGGER HELPER
// =====================================================

/**
 * Feuert einen Trigger und führt passende Workflows aus
 */
export async function fireTrigger(triggerType: WorkflowTriggerType, data: Record<string, any>): Promise<WorkflowExecution[]> {
  const workflows = await WorkflowEngine.findWorkflowsForTrigger(triggerType, data);
  const executions: WorkflowExecution[] = [];
  
  for (const workflow of workflows) {
    try {
      const execution = await WorkflowEngine.executeWorkflow(workflow.id, data);
      executions.push(execution);
    } catch (err) {
      console.error(`Workflow ${workflow.id} fehlgeschlagen:`, err);
    }
  }
  
  return executions;
}

export default WorkflowEngine;

