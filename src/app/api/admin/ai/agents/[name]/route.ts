// =====================================================
// AI CENTER - EINZELNER AGENT API
// =====================================================
// GET    /api/admin/ai/agents/[name]  → Agent-Details
// PATCH  /api/admin/ai/agents/[name]  → Agent aktualisieren
// DELETE /api/admin/ai/agents/[name]  → Agent entfernen (Soft-Delete)
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// =====================================================
// GET - Agent-Details
// =====================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const pool = await getConnection();
    
    // Agent laden
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM ai_agent_capabilities WHERE agent_name = a.name) as capabilities_count
      FROM ai_agents a
      WHERE a.name = ?
    `, [name]);
    
    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: `Agent "${name}" nicht gefunden` },
        { status: 404 }
      );
    }
    
    const agent = rows[0];
    
    // Capabilities laden
    const [capabilities] = await pool.execute<RowDataPacket[]>(`
      SELECT id, capability, description, enabled
      FROM ai_agent_capabilities
      WHERE agent_name = ?
      ORDER BY capability
    `, [name]);
    
    // Metriken laden (letzte 7 Tage)
    const [metrics] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        metric_date,
        tasks_total,
        tasks_success,
        tasks_failed,
        avg_duration_ms,
        tokens_used,
        cost_estimated
      FROM ai_agent_metrics
      WHERE agent_name = ?
      AND metric_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      ORDER BY metric_date DESC
    `, [name]);
    
    // Gesamtstatistik
    const [totalStats] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        SUM(tasks_total) as total_tasks,
        SUM(tasks_success) as total_success,
        SUM(tasks_failed) as total_failed,
        AVG(avg_duration_ms) as avg_duration,
        SUM(tokens_used) as total_tokens,
        SUM(cost_estimated) as total_cost
      FROM ai_agent_metrics
      WHERE agent_name = ?
    `, [name]);
    
    return NextResponse.json({
      success: true,
      data: {
        agent: {
          ...agent,
          dsgvo_scope: agent.dsgvo_scope ? JSON.parse(agent.dsgvo_scope) : null,
          config: agent.config ? JSON.parse(agent.config) : null,
          enabled: Boolean(agent.enabled),
          capabilities_count: Number(agent.capabilities_count) || 0
        },
        capabilities: capabilities,
        metrics: {
          daily: metrics,
          total: totalStats[0] ? {
            tasks: Number(totalStats[0].total_tasks) || 0,
            success: Number(totalStats[0].total_success) || 0,
            failed: Number(totalStats[0].total_failed) || 0,
            avg_duration_ms: Number(totalStats[0].avg_duration) || 0,
            tokens: Number(totalStats[0].total_tokens) || 0,
            cost: Number(totalStats[0].total_cost) || 0
          } : null
        }
      }
    });
    
  } catch (error) {
    console.error("❌ Agent GET Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// PATCH - Agent aktualisieren
// =====================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const pool = await getConnection();
    const body = await request.json();
    
    // Prüfen ob Agent existiert
    const [existing] = await pool.execute<RowDataPacket[]>(
      `SELECT id FROM ai_agents WHERE name = ?`,
      [name]
    );
    
    if ((existing as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: `Agent "${name}" nicht gefunden` },
        { status: 404 }
      );
    }
    
    // Nur erlaubte Felder aktualisieren
    const allowedFields = ["description", "dsgvo_scope", "risk_profile", "enabled", "config"];
    const updates: string[] = [];
    const values: any[] = [];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "dsgvo_scope" || field === "config") {
          updates.push(`${field} = ?`);
          values.push(JSON.stringify(body[field]));
        } else if (field === "enabled") {
          updates.push(`${field} = ?`);
          values.push(body[field] ? 1 : 0);
        } else {
          updates.push(`${field} = ?`);
          values.push(body[field]);
        }
      }
    }
    
    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "Keine Änderungen angegeben" },
        { status: 400 }
      );
    }
    
    // Update ausführen
    values.push(name);
    await pool.execute<ResultSetHeader>(
      `UPDATE ai_agents SET ${updates.join(", ")}, updated_at = NOW() WHERE name = ?`,
      values
    );
    
    // Audit-Log
    try {
      await pool.execute(`
        INSERT INTO lopez_audit_logs (user_id, action, entity_type, entity_id, details)
        VALUES (?, 'AI_AGENT_UPDATED', 'ai_agent', ?, ?)
      `, [1, existing[0].id, JSON.stringify({ name, changes: Object.keys(body) })]);
    } catch (e) {
      // Audit optional
    }
    
    // Aktualisierten Agent laden
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM ai_agents WHERE name = ?`,
      [name]
    );
    
    console.log(`✅ Agent aktualisiert: ${name}`);
    
    return NextResponse.json({
      success: true,
      message: `Agent "${name}" erfolgreich aktualisiert`,
      data: {
        ...rows[0],
        dsgvo_scope: rows[0].dsgvo_scope ? JSON.parse(rows[0].dsgvo_scope) : null,
        config: rows[0].config ? JSON.parse(rows[0].config) : null,
        enabled: Boolean(rows[0].enabled)
      }
    });
    
  } catch (error) {
    console.error("❌ Agent PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE - Agent entfernen (Soft-Delete: nur deaktivieren)
// =====================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const pool = await getConnection();
    
    // Prüfen ob Agent existiert
    const [existing] = await pool.execute<RowDataPacket[]>(
      `SELECT id FROM ai_agents WHERE name = ?`,
      [name]
    );
    
    if ((existing as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: `Agent "${name}" nicht gefunden` },
        { status: 404 }
      );
    }
    
    // SOFT-DELETE: Agent nur deaktivieren, nicht löschen
    // Enterprise++ Standard: Keine echte Löschung
    await pool.execute<ResultSetHeader>(
      `UPDATE ai_agents SET enabled = FALSE, updated_at = NOW() WHERE name = ?`,
      [name]
    );
    
    // Audit-Log
    try {
      await pool.execute(`
        INSERT INTO lopez_audit_logs (user_id, action, entity_type, entity_id, details)
        VALUES (?, 'AI_AGENT_DISABLED', 'ai_agent', ?, ?)
      `, [1, existing[0].id, JSON.stringify({ name, action: "soft_delete" })]);
    } catch (e) {
      // Audit optional
    }
    
    console.log(`✅ Agent deaktiviert (Soft-Delete): ${name}`);
    
    return NextResponse.json({
      success: true,
      message: `Agent "${name}" wurde deaktiviert (Soft-Delete)`,
      note: "Enterprise++ Standard: Agenten werden nicht gelöscht, nur deaktiviert"
    });
    
  } catch (error) {
    console.error("❌ Agent DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}







