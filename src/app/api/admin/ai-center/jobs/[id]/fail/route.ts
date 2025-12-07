// =====================================================
// AI CENTER - JOB FAIL
// =====================================================
// POST /api/admin/ai-center/jobs/[id]/fail
// Markiert einen Job als fehlgeschlagen mit Retry-Logic
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
    const { error_message, logs, should_retry = true } = body;
    const workerId = request.headers.get("X-Worker-ID") || "unknown";
    
    const pool = await getConnection();
    
    // -------------------------------------------------
    // 1. Job-Info laden
    // -------------------------------------------------
    
    const [jobInfo] = await pool.execute<RowDataPacket[]>(`
      SELECT retry_count, max_retries FROM lopez_ai_center_jobs WHERE id = ?
    `, [jobId]);
    
    if (jobInfo.length === 0) {
      return NextResponse.json(
        { success: false, error: "Job nicht gefunden" },
        { status: 404 }
      );
    }
    
    const { retry_count, max_retries } = jobInfo[0];
    const canRetry = should_retry && retry_count < max_retries;
    
    // -------------------------------------------------
    // 2. Job-Status aktualisieren
    // -------------------------------------------------
    
    if (canRetry) {
      // Retry: Status zurück auf pending, retry_count erhöhen
      await pool.execute<ResultSetHeader>(`
        UPDATE lopez_ai_center_jobs 
        SET 
          status = 'pending',
          retry_count = retry_count + 1,
          error_message = ?,
          output_logs = CONCAT(COALESCE(output_logs, ''), '\n--- RETRY ', retry_count + 1, ' ---\n', ?),
          locked_at = NULL,
          locked_by = NULL
        WHERE id = ?
      `, [
        error_message || "Unknown error",
        logs || "",
        jobId
      ]);
    } else {
      // Final Fail: Keine weiteren Retries
      await pool.execute<ResultSetHeader>(`
        UPDATE lopez_ai_center_jobs 
        SET 
          status = 'failed',
          error_message = ?,
          output_logs = CONCAT(COALESCE(output_logs, ''), '\n--- FINAL FAIL ---\n', ?),
          finished_at = NOW(),
          locked_at = NULL,
          locked_by = NULL
        WHERE id = ?
      `, [
        error_message || "Max retries exceeded",
        logs || "",
        jobId
      ]);
    }
    
    // -------------------------------------------------
    // 3. Audit Log
    // -------------------------------------------------
    
    await pool.execute(`
      INSERT INTO lopez_audit_logs 
        (user_id, action, entity_type, entity_id, details)
      VALUES (1, ?, 'ai_center_job', ?, ?)
    `, [
      canRetry ? 'AI_CENTER_JOB_RETRY' : 'AI_CENTER_JOB_FAILED',
      jobId,
      JSON.stringify({
        worker_id: workerId,
        error_message: error_message,
        retry_count: retry_count + 1,
        max_retries: max_retries,
        will_retry: canRetry,
      })
    ]);
    
    return NextResponse.json({
      success: true,
      message: canRetry 
        ? `Job #${jobId} wird erneut versucht (${retry_count + 1}/${max_retries})`
        : `Job #${jobId} endgültig fehlgeschlagen`,
      data: {
        job_id: jobId,
        status: canRetry ? "pending" : "failed",
        retry_count: retry_count + 1,
        max_retries: max_retries,
        will_retry: canRetry,
      }
    });
    
  } catch (error) {
    console.error("❌ AI Center Job Fail Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}







