// =====================================================
// AI CENTER - NEXT JOB
// =====================================================
// GET /api/admin/ai-center/jobs/next
// Holt den nächsten verfügbaren Job für den Worker
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// TODO: Admin-Auth/RBAC - Security-Phase

interface JobRow extends RowDataPacket {
  id: number;
  task_id: number;
  phase: string;
  agent: "B" | "C";
  status: string;
  priority: number;
  input_files: string | null;
  input_params: string | null;
  retry_count: number;
  max_retries: number;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const pool = await getConnection();
    const workerId = request.headers.get("X-Worker-ID") || `worker-${Date.now()}`;
    
    // -------------------------------------------------
    // 1. Verfügbaren Job finden und locken (atomic)
    // -------------------------------------------------
    
    // Zuerst: Abgelaufene Locks freigeben (älter als 5 Minuten)
    await pool.execute(`
      UPDATE lopez_ai_center_jobs 
      SET locked_at = NULL, locked_by = NULL, status = 'pending'
      WHERE status = 'running' 
        AND locked_at < DATE_SUB(NOW(), INTERVAL 5 MINUTE)
    `);
    
    // Dann: Nächsten Job locken
    const [lockResult] = await pool.execute<ResultSetHeader>(`
      UPDATE lopez_ai_center_jobs 
      SET 
        status = 'running',
        locked_at = NOW(),
        locked_by = ?,
        started_at = COALESCE(started_at, NOW())
      WHERE status = 'pending'
        AND locked_at IS NULL
        AND retry_count < max_retries
      ORDER BY priority DESC, created_at ASC
      LIMIT 1
    `, [workerId]);
    
    if (lockResult.affectedRows === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "Keine Jobs verfügbar"
      });
    }
    
    // -------------------------------------------------
    // 2. Den gelockten Job abrufen
    // -------------------------------------------------
    
    const [jobs] = await pool.execute<JobRow[]>(`
      SELECT 
        id, task_id, phase, agent, status, priority,
        input_files, input_params, retry_count, max_retries, created_at
      FROM lopez_ai_center_jobs
      WHERE locked_by = ? AND status = 'running'
      ORDER BY locked_at DESC
      LIMIT 1
    `, [workerId]);
    
    if (jobs.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "Kein Job gefunden nach Lock"
      });
    }
    
    const job = jobs[0];
    
    // -------------------------------------------------
    // 3. Task-Info laden
    // -------------------------------------------------
    
    const [tasks] = await pool.execute<RowDataPacket[]>(`
      SELECT title, description, status as task_status
      FROM dev_tasks 
      WHERE id = ?
    `, [job.task_id]);
    
    return NextResponse.json({
      success: true,
      data: {
        job: {
          id: job.id,
          task_id: job.task_id,
          phase: job.phase,
          agent: job.agent,
          status: job.status,
          priority: job.priority,
          input_files: job.input_files ? JSON.parse(job.input_files) : null,
          input_params: job.input_params ? JSON.parse(job.input_params) : null,
          retry_count: job.retry_count,
          max_retries: job.max_retries,
          created_at: job.created_at,
        },
        task: tasks[0] || null,
        worker_id: workerId,
      },
      message: `Job #${job.id} zugewiesen an ${workerId}`
    });
    
  } catch (error) {
    console.error("❌ AI Center Next Job Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}







