// =====================================================
// DEV-TASKS SERVICE – Enterprise++ Dev-Orchestrator
// =====================================================
// Erstellt: 2025-12-04
// Zweck: Service für Dev-Tasks und Agent-A Integration
// Status: ✅ PHASE 1 – Planung
// =====================================================
// 
// SICHERHEITSHINWEISE:
// - Arbeitet NUR mit lopez_it_welt_dev
// - KEINE destruktiven Operationen
// - KEINE init/reset Funktionen
// =====================================================

import { getConnection } from "./database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// =====================================================
// TYPEN
// =====================================================

export type DevTaskType = "bug" | "feature" | "refactor" | "documentation" | "security";
export type DevTaskStatus = "open" | "planning" | "planned" | "coding" | "review" | "done" | "cancelled";
export type DevTaskPriority = "low" | "medium" | "high" | "critical";
export type StepStatus = "pending" | "in_progress" | "done" | "skipped";

export interface DevTask {
  id: number;
  title: string;
  description: string;
  type: DevTaskType;
  status: DevTaskStatus;
  priority: DevTaskPriority;
  project_code: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  steps_count?: number;
}

export interface DevTaskStep {
  id: number;
  task_id: number;
  step_number: number;
  title: string;
  details: string | null;
  estimated_effort: string | null;
  status: StepStatus;
  agent_notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDevTaskInput {
  title: string;
  description: string;
  type: DevTaskType;
  priority?: DevTaskPriority;
  project_code?: string;
  created_by?: string;
}

export interface CreateDevTaskStepInput {
  task_id: number;
  step_number: number;
  title: string;
  details?: string;
  estimated_effort?: string;
  agent_notes?: string;
}

// =====================================================
// DEV-TASKS SERVICE
// =====================================================

export class DevTasksService {
  
  // -------------------------------------------------
  // TASK CRUD
  // -------------------------------------------------

  /**
   * Erstellt einen neuen Dev-Task
   */
  static async createTask(input: CreateDevTaskInput): Promise<DevTask> {
    const pool = await getConnection();
    
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO dev_tasks 
        (title, description, type, status, priority, project_code, created_by) 
       VALUES (?, ?, ?, 'open', ?, ?, ?)`,
      [
        input.title,
        input.description,
        input.type,
        input.priority || "medium",
        input.project_code || "LOPEZ-IT-WELT",
        input.created_by || "system"
      ]
    );

    const taskId = result.insertId;
    const task = await this.getTaskById(taskId);
    
    if (!task) {
      throw new Error("Task wurde erstellt, konnte aber nicht geladen werden");
    }
    
    return task;
  }

  /**
   * Holt einen Task nach ID
   */
  static async getTaskById(id: number): Promise<DevTask | null> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        t.*,
        (SELECT COUNT(*) FROM dev_task_steps WHERE task_id = t.id) as steps_count
       FROM dev_tasks t 
       WHERE t.id = ?`,
      [id]
    );

    if (rows.length === 0) return null;
    return rows[0] as DevTask;
  }

  /**
   * Holt alle Tasks (mit Pagination)
   */
  static async getTasks(options: {
    limit?: number;
    offset?: number;
    status?: DevTaskStatus;
    type?: DevTaskType;
  } = {}): Promise<{ tasks: DevTask[]; total: number }> {
    const pool = await getConnection();
    const { limit = 20, offset = 0, status, type } = options;

    let whereClause = "1=1";
    const params: (string | number)[] = [];

    if (status) {
      whereClause += " AND t.status = ?";
      params.push(status);
    }
    if (type) {
      whereClause += " AND t.type = ?";
      params.push(type);
    }

    // Zähle Gesamtanzahl
    const [countResult] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM dev_tasks t WHERE ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Hole Tasks mit Steps-Count
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        t.*,
        (SELECT COUNT(*) FROM dev_task_steps WHERE task_id = t.id) as steps_count
       FROM dev_tasks t 
       WHERE ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      tasks: rows as DevTask[],
      total
    };
  }

  /**
   * Aktualisiert den Status eines Tasks
   */
  static async updateTaskStatus(id: number, status: DevTaskStatus): Promise<void> {
    const pool = await getConnection();
    
    await pool.execute(
      `UPDATE dev_tasks SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, id]
    );
  }

  // -------------------------------------------------
  // TASK STEPS CRUD
  // -------------------------------------------------

  /**
   * Erstellt einen Plan-Schritt
   */
  static async createStep(input: CreateDevTaskStepInput): Promise<DevTaskStep> {
    const pool = await getConnection();
    
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO dev_task_steps 
        (task_id, step_number, title, details, estimated_effort, agent_notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        input.task_id,
        input.step_number,
        input.title,
        input.details || null,
        input.estimated_effort || null,
        input.agent_notes || null
      ]
    );

    const stepId = result.insertId;
    const step = await this.getStepById(stepId);
    
    if (!step) {
      throw new Error("Step wurde erstellt, konnte aber nicht geladen werden");
    }
    
    return step;
  }

  /**
   * Holt einen Step nach ID
   */
  static async getStepById(id: number): Promise<DevTaskStep | null> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM dev_task_steps WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) return null;
    return rows[0] as DevTaskStep;
  }

  /**
   * Holt alle Steps für einen Task
   */
  static async getStepsForTask(taskId: number): Promise<DevTaskStep[]> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM dev_task_steps WHERE task_id = ? ORDER BY step_number ASC`,
      [taskId]
    );

    return rows as DevTaskStep[];
  }

  /**
   * Speichert mehrere Steps für einen Task (Agent-A Output)
   */
  static async saveStepsForTask(taskId: number, steps: Omit<CreateDevTaskStepInput, "task_id">[]): Promise<DevTaskStep[]> {
    const createdSteps: DevTaskStep[] = [];
    
    for (const step of steps) {
      const created = await this.createStep({
        task_id: taskId,
        ...step
      });
      createdSteps.push(created);
    }
    
    return createdSteps;
  }

  // -------------------------------------------------
  // STATISTIKEN
  // -------------------------------------------------

  /**
   * Holt Statistiken zu Dev-Tasks
   */
  static async getStatistics(): Promise<{
    total: number;
    byStatus: Record<DevTaskStatus, number>;
    byType: Record<DevTaskType, number>;
    totalSteps: number;
  }> {
    const pool = await getConnection();

    // Gesamt und nach Status
    const [statusStats] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as status_open,
        SUM(CASE WHEN status = 'planning' THEN 1 ELSE 0 END) as status_planning,
        SUM(CASE WHEN status = 'planned' THEN 1 ELSE 0 END) as status_planned,
        SUM(CASE WHEN status = 'coding' THEN 1 ELSE 0 END) as status_coding,
        SUM(CASE WHEN status = 'review' THEN 1 ELSE 0 END) as status_review,
        SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as status_done,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as status_cancelled
      FROM dev_tasks
    `);

    // Nach Typ
    const [typeStats] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        SUM(CASE WHEN type = 'bug' THEN 1 ELSE 0 END) as type_bug,
        SUM(CASE WHEN type = 'feature' THEN 1 ELSE 0 END) as type_feature,
        SUM(CASE WHEN type = 'refactor' THEN 1 ELSE 0 END) as type_refactor,
        SUM(CASE WHEN type = 'documentation' THEN 1 ELSE 0 END) as type_documentation,
        SUM(CASE WHEN type = 'security' THEN 1 ELSE 0 END) as type_security
      FROM dev_tasks
    `);

    // Steps zählen
    const [stepsCount] = await pool.execute<RowDataPacket[]>(`
      SELECT COUNT(*) as total FROM dev_task_steps
    `);

    const stats = statusStats[0];
    const types = typeStats[0];

    return {
      total: stats.total || 0,
      byStatus: {
        open: stats.status_open || 0,
        planning: stats.status_planning || 0,
        planned: stats.status_planned || 0,
        coding: stats.status_coding || 0,
        review: stats.status_review || 0,
        done: stats.status_done || 0,
        cancelled: stats.status_cancelled || 0
      },
      byType: {
        bug: types.type_bug || 0,
        feature: types.type_feature || 0,
        refactor: types.type_refactor || 0,
        documentation: types.type_documentation || 0,
        security: types.type_security || 0
      },
      totalSteps: stepsCount[0].total || 0
    };
  }
}

export default DevTasksService;









