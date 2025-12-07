// =====================================================
// SHADOW-MODE - CODE PROPOSALS API
// =====================================================
// GET /api/admin/ai/shadow-mode/proposals - Liste Vorschläge
// POST /api/admin/ai/shadow-mode/proposals - Neuer Vorschlag
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// =====================================================
// GET - Alle Proposals laden
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const taskId = searchParams.get("task_id");
    
    const pool = await getConnection();
    
    let query = `
      SELECT 
        p.*,
        t.title as task_title,
        t.status as task_status
      FROM lopez_code_proposals p
      LEFT JOIN dev_tasks t ON p.task_id = t.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (status) {
      query += " AND p.status = ?";
      params.push(status);
    }
    if (taskId) {
      query += " AND p.task_id = ?";
      params.push(taskId);
    }
    
    query += " ORDER BY p.created_at DESC LIMIT 50";
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    
    // Summary
    const [summary] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(status = 'pending') as pending,
        SUM(status = 'approved') as approved,
        SUM(status = 'rejected') as rejected,
        SUM(status = 'applied') as applied,
        SUM(human_decision = 'pending') as awaiting_human
      FROM lopez_code_proposals
    `);
    
    return NextResponse.json({
      success: true,
      data: {
        proposals: rows.map(row => ({
          ...row,
          agent_c_review: row.agent_c_review ? JSON.parse(row.agent_c_review) : null,
          cursor_review: row.cursor_review ? JSON.parse(row.cursor_review) : null
        })),
        summary: summary[0]
      }
    });
    
  } catch (error) {
    console.error("❌ Proposals GET Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// POST - Neuen Vorschlag erstellen (von Agent-B)
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validierung
    if (!body.task_id || !body.file_path || !body.proposed_content) {
      return NextResponse.json(
        { success: false, error: "task_id, file_path und proposed_content sind erforderlich" },
        { status: 400 }
      );
    }
    
    const pool = await getConnection();
    
    // Proposal erstellen
    const [result] = await pool.execute<ResultSetHeader>(`
      INSERT INTO lopez_code_proposals 
        (task_id, step_id, file_path, action, original_content, proposed_content,
         agent_version, model_used, tokens_used, generation_time_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      body.task_id,
      body.step_id || null,
      body.file_path,
      body.action || "create",
      body.original_content || null,
      body.proposed_content,
      body.agent_version || "1.0",
      body.model_used || "shadow-mode",
      body.tokens_used || 0,
      body.generation_time_ms || 0
    ]);
    
    const proposalId = result.insertId;
    
    // Review-History Eintrag
    await pool.execute(`
      INSERT INTO lopez_code_review_history 
        (proposal_id, reviewer_type, reviewer_id, action, review_data, comments)
      VALUES (?, 'agent_c', 'agent-b', 'reviewed', ?, ?)
    `, [
      proposalId,
      JSON.stringify({ source: "agent-b-shadow", timestamp: new Date().toISOString() }),
      "Code-Vorschlag von Agent-B erstellt (Shadow Mode)"
    ]);
    
    return NextResponse.json({
      success: true,
      message: "Code-Vorschlag erstellt (Shadow Mode)",
      data: {
        proposal_id: proposalId,
        status: "pending",
        next_steps: [
          "1. Agent-C Review (automatisch)",
          "2. Cursor Senior Review",
          "3. Mensch: Finale Entscheidung"
        ]
      }
    });
    
  } catch (error) {
    console.error("❌ Proposals POST Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}







