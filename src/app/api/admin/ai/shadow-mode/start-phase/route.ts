// =====================================================
// SHADOW-MODE - PHASE STARTEN
// =====================================================
// POST /api/admin/ai/shadow-mode/start-phase
// Startet eine neue Phase im Shadow-Mode Workflow
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

// =====================================================
// POST - Phase starten
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pool = await getConnection();
    
    const { phase, title, description, steps } = body;
    
    if (!phase || !title || !steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { success: false, error: "phase, title und steps sind erforderlich" },
        { status: 400 }
      );
    }
    
    // -------------------------------------------------
    // 1. Dev-Task erstellen
    // -------------------------------------------------
    
    const [taskResult] = await pool.execute<ResultSetHeader>(`
      INSERT INTO dev_tasks 
        (title, description, type, status, priority, project_code, created_by)
      VALUES (?, ?, 'feature', 'planning', 'high', 'PHASE-1-PORTAL', 'shadow-mode')
    `, [title, description]);
    
    const taskId = taskResult.insertId;
    
    // -------------------------------------------------
    // 2. Schritte erstellen (Agent-A Plan)
    // -------------------------------------------------
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await pool.execute(`
        INSERT INTO dev_task_steps 
          (task_id, step_number, title, details, estimated_effort, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
      `, [
        taskId,
        i + 1,
        step.title,
        step.details || null,
        step.estimated_effort || "30min"
      ]);
    }
    
    // -------------------------------------------------
    // 3. Task-Status auf "planned" setzen
    // -------------------------------------------------
    
    await pool.execute(`
      UPDATE dev_tasks SET status = 'planned' WHERE id = ?
    `, [taskId]);
    
    // -------------------------------------------------
    // 4. Audit-Log
    // -------------------------------------------------
    
    await pool.execute(`
      INSERT INTO lopez_audit_logs 
        (user_id, action, entity_type, entity_id, details)
      VALUES (1, 'SHADOW_MODE_PHASE_STARTED', 'dev_task', ?, ?)
    `, [
      taskId,
      JSON.stringify({
        phase,
        title,
        steps_count: steps.length,
        workflow: "shadow-mode"
      })
    ]);
    
    // Task mit Steps laden
    const [taskRows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM dev_tasks WHERE id = ?
    `, [taskId]);
    
    const [stepRows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM dev_task_steps WHERE task_id = ? ORDER BY step_number
    `, [taskId]);
    
    return NextResponse.json({
      success: true,
      message: `✅ Phase ${phase} gestartet`,
      data: {
        task: taskRows[0],
        steps: stepRows,
        workflow: {
          current: "Layer 2: Agent-A (Planner) - DONE ✅",
          next: "Layer 3: Agent-B (Builder) - Code-Vorschläge erstellen"
        }
      }
    });
    
  } catch (error) {
    console.error("❌ Start Phase Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}







