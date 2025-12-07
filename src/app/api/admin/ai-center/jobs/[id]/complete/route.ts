// =====================================================
// AI CENTER - JOB COMPLETE
// =====================================================
// POST /api/admin/ai-center/jobs/[id]/complete
// Markiert einen Job als abgeschlossen
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

// TODO: Admin-Auth/RBAC - Security-Phase

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const jobId = parseInt(id, 10);
    
    if (isNaN(jobId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Job-ID" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { result, logs, next_agent } = body;
    const workerId = request.headers.get("X-Worker-ID") || "unknown";
    
    const pool = await getConnection();
    
    // -------------------------------------------------
    // 1. Job als completed markieren
    // -------------------------------------------------
    
    const [updateResult] = await pool.execute<ResultSetHeader>(`
      UPDATE lopez_ai_center_jobs 
      SET 
        status = 'completed',
        output_result = ?,
        output_logs = ?,
        finished_at = NOW(),
        locked_at = NULL,
        locked_by = NULL
      WHERE id = ? AND locked_by = ?
    `, [
      result ? JSON.stringify(result) : null,
      logs || null,
      jobId,
      workerId
    ]);
    
    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Job nicht gefunden oder nicht gelockt" },
        { status: 404 }
      );
    }
    
    // -------------------------------------------------
    // 2. Optional: Nächsten Job erstellen (Agent-C nach Agent-B)
    // -------------------------------------------------
    
    let nextJobId = null;
    
    if (next_agent) {
      // Job-Info laden
      const [jobInfo] = await pool.execute<RowDataPacket[]>(`
        SELECT task_id, phase, input_files FROM lopez_ai_center_jobs WHERE id = ?
      `, [jobId]);
      
      if (jobInfo.length > 0) {
        const [insertResult] = await pool.execute<ResultSetHeader>(`
          INSERT INTO lopez_ai_center_jobs 
            (task_id, phase, agent, status, priority, input_files, input_params)
          VALUES (?, ?, ?, 'pending', 10, ?, ?)
        `, [
          jobInfo[0].task_id,
          jobInfo[0].phase,
          next_agent,
          jobInfo[0].input_files,
          JSON.stringify({ previous_job_id: jobId, previous_result: result })
        ]);
        
        nextJobId = insertResult.insertId;
      }
    }
    
    // -------------------------------------------------
    // 3. Audit Log
    // -------------------------------------------------
    
    await pool.execute(`
      INSERT INTO lopez_audit_logs 
        (user_id, action, entity_type, entity_id, details)
      VALUES (1, 'AI_CENTER_JOB_COMPLETED', 'ai_center_job', ?, ?)
    `, [
      jobId,
      JSON.stringify({
        worker_id: workerId,
        has_result: !!result,
        next_job_id: nextJobId,
      })
    ]);
    
    return NextResponse.json({
      success: true,
      message: `Job #${jobId} abgeschlossen`,
      data: {
        job_id: jobId,
        status: "completed",
        next_job_id: nextJobId,
      }
    });
    
  } catch (error) {
    console.error("❌ AI Center Job Complete Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}







