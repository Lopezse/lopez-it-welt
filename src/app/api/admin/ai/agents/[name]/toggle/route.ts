// =====================================================
// AI CENTER - AGENT TOGGLE API
// =====================================================
// POST /api/admin/ai/agents/[name]/toggle → Agent aktivieren/deaktivieren
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const pool = await getConnection();
    
    // Agent laden
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, name, enabled FROM ai_agents WHERE name = ?`,
      [name]
    );
    
    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: `Agent "${name}" nicht gefunden` },
        { status: 404 }
      );
    }
    
    const agent = rows[0];
    const newStatus = !agent.enabled;
    
    // Status umschalten
    await pool.execute<ResultSetHeader>(
      `UPDATE ai_agents SET enabled = ?, updated_at = NOW() WHERE name = ?`,
      [newStatus ? 1 : 0, name]
    );
    
    // Audit-Log
    try {
      await pool.execute(`
        INSERT INTO lopez_audit_logs (user_id, action, entity_type, entity_id, details)
        VALUES (?, ?, 'ai_agent', ?, ?)
      `, [
        1,
        newStatus ? "AI_AGENT_ENABLED" : "AI_AGENT_DISABLED",
        agent.id,
        JSON.stringify({ name, enabled: newStatus })
      ]);
    } catch (e) {
      // Audit optional
    }
    
    console.log(`✅ Agent ${newStatus ? "aktiviert" : "deaktiviert"}: ${name}`);
    
    return NextResponse.json({
      success: true,
      message: `Agent "${name}" wurde ${newStatus ? "aktiviert" : "deaktiviert"}`,
      data: {
        name,
        enabled: newStatus
      }
    });
    
  } catch (error) {
    console.error("❌ Agent Toggle Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

