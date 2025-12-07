// =====================================================
// AI CENTER - JOBS LIST & CREATE
// =====================================================
// GET /api/admin/ai-center/jobs - Jobs auflisten
// POST /api/admin/ai-center/jobs - Neuen Job erstellen
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// TODO: Admin-Auth/RBAC - Security-Phase

// -------------------------------------------------
// GET - Jobs auflisten
// -------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const pool = await getConnection();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get("status");
    const agent = searchParams.get("agent");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    
    let whereClause = "1=1";
    const params: (string | number)[] = [];
    
    if (status) {
      whereClause += " AND j.status = ?";
      params.push(status);
    }
    
    if (agent) {
      whereClause += " AND j.agent = ?";
      params.push(agent);
    }
    
    // Jobs laden
    const [jobs] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        j.id,
        j.task_id,
        j.phase,
        j.agent,
        j.status,
        j.priority,
        j.retry_count,
        j.max_retries,
        j.error_message,
        j.locked_by,
        j.created_at,
        j.started_at,
        j.finished_at,
        t.title as task_title
      FROM lopez_ai_center_jobs j
      LEFT JOIN dev_tasks t ON j.task_id = t.id
      WHERE ${whereClause}
      ORDER BY j.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);
    
    // Stats
    const [stats] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as running,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM lopez_ai_center_jobs
    `);
    
    return NextResponse.json({
      success: true,
      data: {
        jobs,
        stats: stats[0],
        pagination: {
          limit,
          offset,
          total: stats[0]?.total || 0,
        }
      }
    });
    
  } catch (error) {
    console.error("❌ AI Center Jobs List Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

// -------------------------------------------------
// POST - Neuen Job erstellen
// -------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task_id, phase, agent, priority = 0, input_files, input_params } = body;
    
    if (!task_id || !phase || !agent) {
      return NextResponse.json(
        { success: false, error: "task_id, phase und agent sind erforderlich" },
        { status: 400 }
      );
    }
    
    if (!["B", "C"].includes(agent)) {
      return NextResponse.json(
        { success: false, error: "agent muss 'B' oder 'C' sein" },
        { status: 400 }
      );
    }
    
    const pool = await getConnection();
    
    // Job erstellen
    const [result] = await pool.execute<ResultSetHeader>(`
      INSERT INTO lopez_ai_center_jobs 
        (task_id, phase, agent, status, priority, input_files, input_params)
      VALUES (?, ?, ?, 'pending', ?, ?, ?)
    `, [
      task_id,
      phase,
      agent,
      priority,
      input_files ? JSON.stringify(input_files) : null,
      input_params ? JSON.stringify(input_params) : null,
    ]);
    
    const jobId = result.insertId;
    
    // Audit Log
    await pool.execute(`
      INSERT INTO lopez_audit_logs 
        (user_id, action, entity_type, entity_id, details)
      VALUES (1, 'AI_CENTER_JOB_CREATED', 'ai_center_job', ?, ?)
    `, [
      jobId,
      JSON.stringify({ task_id, phase, agent, priority })
    ]);
    
    return NextResponse.json({
      success: true,
      message: `Job #${jobId} erstellt`,
      data: {
        job_id: jobId,
        task_id,
        phase,
        agent,
        status: "pending",
      }
    });
    
  } catch (error) {
    console.error("❌ AI Center Job Create Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}







