// =====================================================
// SHADOW-MODE - EINZELNER PROPOSAL
// =====================================================
// GET /api/admin/ai/shadow-mode/proposals/[id] - Details
// PATCH /api/admin/ai/shadow-mode/proposals/[id] - Review/Entscheidung
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

// =====================================================
// GET - Proposal Details
// =====================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        p.*,
        t.title as task_title,
        t.description as task_description,
        t.status as task_status
      FROM lopez_code_proposals p
      LEFT JOIN dev_tasks t ON p.task_id = t.id
      WHERE p.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Proposal nicht gefunden" },
        { status: 404 }
      );
    }
    
    // Review-History laden
    const [history] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM lopez_code_review_history
      WHERE proposal_id = ?
      ORDER BY created_at ASC
    `, [id]);
    
    const proposal = rows[0];
    
    return NextResponse.json({
      success: true,
      data: {
        proposal: {
          ...proposal,
          agent_c_review: proposal.agent_c_review ? JSON.parse(proposal.agent_c_review) : null,
          cursor_review: proposal.cursor_review ? JSON.parse(proposal.cursor_review) : null
        },
        history: history.map(h => ({
          ...h,
          review_data: h.review_data ? JSON.parse(h.review_data) : null
        }))
      }
    });
    
  } catch (error) {
    console.error("❌ Proposal GET Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// PATCH - Review oder Entscheidung
// =====================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const pool = await getConnection();
    
    // Prüfen ob Proposal existiert
    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM lopez_code_proposals WHERE id = ?",
      [id]
    );
    
    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Proposal nicht gefunden" },
        { status: 404 }
      );
    }
    
    // -------------------------------------------------
    // Agent-C Review
    // -------------------------------------------------
    if (body.agent_c_review) {
      await pool.execute(`
        UPDATE lopez_code_proposals 
        SET agent_c_review = ?, agent_c_score = ?, agent_c_reviewed_at = NOW()
        WHERE id = ?
      `, [
        JSON.stringify(body.agent_c_review),
        body.agent_c_score || 0,
        id
      ]);
      
      await pool.execute(`
        INSERT INTO lopez_code_review_history 
          (proposal_id, reviewer_type, action, review_data, score, comments)
        VALUES (?, 'agent_c', 'reviewed', ?, ?, ?)
      `, [
        id,
        JSON.stringify(body.agent_c_review),
        body.agent_c_score || 0,
        body.agent_c_review.summary || "Agent-C Review abgeschlossen"
      ]);
      
      return NextResponse.json({
        success: true,
        message: "Agent-C Review gespeichert",
        next_step: "Cursor Senior Review"
      });
    }
    
    // -------------------------------------------------
    // Cursor Review
    // -------------------------------------------------
    if (body.cursor_review) {
      await pool.execute(`
        UPDATE lopez_code_proposals 
        SET cursor_review = ?, cursor_approved = ?, cursor_reviewed_at = NOW()
        WHERE id = ?
      `, [
        JSON.stringify(body.cursor_review),
        body.cursor_approved || false,
        id
      ]);
      
      await pool.execute(`
        INSERT INTO lopez_code_review_history 
          (proposal_id, reviewer_type, action, review_data, comments)
        VALUES (?, 'cursor', ?, ?, ?)
      `, [
        id,
        body.cursor_approved ? "approved" : "rejected",
        JSON.stringify(body.cursor_review),
        body.cursor_review.summary || "Cursor Review abgeschlossen"
      ]);
      
      return NextResponse.json({
        success: true,
        message: `Cursor Review: ${body.cursor_approved ? "APPROVED ✅" : "NEEDS CHANGES ⚠️"}`,
        next_step: "Mensch: Finale Entscheidung"
      });
    }
    
    // -------------------------------------------------
    // Mensch Entscheidung
    // -------------------------------------------------
    if (body.human_decision) {
      const validDecisions = ["approved", "rejected", "modified"];
      if (!validDecisions.includes(body.human_decision)) {
        return NextResponse.json(
          { success: false, error: "Ungültige Entscheidung" },
          { status: 400 }
        );
      }
      
      await pool.execute(`
        UPDATE lopez_code_proposals 
        SET human_decision = ?, human_notes = ?, decided_by = ?, decided_at = NOW(),
            status = ?
        WHERE id = ?
      `, [
        body.human_decision,
        body.human_notes || null,
        body.decided_by || "admin",
        body.human_decision,
        id
      ]);
      
      await pool.execute(`
        INSERT INTO lopez_code_review_history 
          (proposal_id, reviewer_type, reviewer_id, action, comments)
        VALUES (?, 'human', ?, ?, ?)
      `, [
        id,
        body.decided_by || "admin",
        body.human_decision,
        body.human_notes || `Entscheidung: ${body.human_decision}`
      ]);
      
      // Wenn approved → Code kann angewendet werden
      if (body.human_decision === "approved") {
        return NextResponse.json({
          success: true,
          message: "✅ FREIGEGEBEN - Code kann übernommen werden",
          data: {
            proposal_id: id,
            status: "approved",
            action: "Code kann jetzt implementiert werden"
          }
        });
      }
      
      return NextResponse.json({
        success: true,
        message: body.human_decision === "rejected" 
          ? "❌ ABGELEHNT - Zurück zu Agent-B"
          : "✏️ MODIFIZIERT - Manuelle Anpassungen nötig",
        data: {
          proposal_id: id,
          status: body.human_decision
        }
      });
    }
    
    return NextResponse.json(
      { success: false, error: "Keine gültige Aktion" },
      { status: 400 }
    );
    
  } catch (error) {
    console.error("❌ Proposal PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}







