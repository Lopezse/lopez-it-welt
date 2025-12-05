// =====================================================
// AI CENTER - AGENT REGISTRY API
// =====================================================
// GET    /api/admin/ai/agents         → Liste aller Agenten
// POST   /api/admin/ai/agents         → Neuen Agent registrieren
// =====================================================
// Enterprise++ Standard | DSGVO-konform | Audit-Trail
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// =====================================================
// TYPEN
// =====================================================

export interface AIAgent {
  id: number;
  name: string;
  type: "media" | "dev" | "doc" | "support" | "business" | "monitoring" | "admin" | "orchestrator";
  description: string | null;
  dsgvo_scope: string[] | null;
  risk_profile: "low" | "medium" | "high";
  enabled: boolean;
  config: Record<string, unknown> | null;
  created_at: Date;
  updated_at: Date;
  // Erweiterte Felder (JOINs)
  capabilities_count?: number;
  tasks_today?: number;
  tasks_total?: number;
}

// =====================================================
// GET - Liste aller Agenten
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const pool = await getConnection();
    const { searchParams } = new URL(request.url);
    
    // Filter-Parameter
    const type = searchParams.get("type");
    const enabled = searchParams.get("enabled");
    const includeMetrics = searchParams.get("includeMetrics") === "true";
    
    // Basis-Query
    let query = `
      SELECT 
        a.id,
        a.name,
        a.type,
        a.description,
        a.dsgvo_scope,
        a.risk_profile,
        a.enabled,
        a.config,
        a.created_at,
        a.updated_at,
        (SELECT COUNT(*) FROM ai_agent_capabilities WHERE agent_name = a.name) as capabilities_count
      FROM ai_agents a
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    // Filter: Typ
    if (type) {
      query += ` AND a.type = ?`;
      params.push(type);
    }
    
    // Filter: Aktiviert
    if (enabled !== null && enabled !== undefined) {
      query += ` AND a.enabled = ?`;
      params.push(enabled === "true" ? 1 : 0);
    }
    
    query += ` ORDER BY a.id ASC`;
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    
    // Agenten-Daten aufbereiten
    const agents: AIAgent[] = (rows as any[]).map(row => ({
      ...row,
      dsgvo_scope: row.dsgvo_scope ? JSON.parse(row.dsgvo_scope) : null,
      config: row.config ? JSON.parse(row.config) : null,
      enabled: Boolean(row.enabled),
      capabilities_count: Number(row.capabilities_count) || 0
    }));
    
    // Optional: Metriken laden
    if (includeMetrics) {
      for (const agent of agents) {
        try {
          const [metrics] = await pool.execute<RowDataPacket[]>(`
            SELECT 
              SUM(tasks_total) as tasks_total,
              SUM(tasks_success) as tasks_success,
              SUM(tasks_failed) as tasks_failed,
              SUM(cost_estimated) as total_cost
            FROM ai_agent_metrics 
            WHERE agent_name = ?
          `, [agent.name]);
          
          if (metrics[0]) {
            (agent as any).metrics = {
              tasks_total: Number(metrics[0].tasks_total) || 0,
              tasks_success: Number(metrics[0].tasks_success) || 0,
              tasks_failed: Number(metrics[0].tasks_failed) || 0,
              total_cost: Number(metrics[0].total_cost) || 0
            };
          }
        } catch (e) {
          // Metriken optional
        }
      }
    }
    
    // Zusammenfassung
    const summary = {
      total: agents.length,
      enabled: agents.filter(a => a.enabled).length,
      disabled: agents.filter(a => !a.enabled).length,
      by_type: agents.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      by_risk: agents.reduce((acc, a) => {
        acc[a.risk_profile] = (acc[a.risk_profile] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return NextResponse.json({
      success: true,
      data: {
        agents,
        summary
      }
    });
    
  } catch (error) {
    console.error("❌ Agent Registry GET Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Fehler beim Laden der Agenten" 
      },
      { status: 500 }
    );
  }
}

// =====================================================
// POST - Neuen Agent registrieren
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const pool = await getConnection();
    const body = await request.json();
    
    // Validierung
    const { name, type, description, dsgvo_scope, risk_profile, config } = body;
    
    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: "Name und Typ sind erforderlich" },
        { status: 400 }
      );
    }
    
    // Prüfen ob Agent bereits existiert
    const [existing] = await pool.execute<RowDataPacket[]>(
      `SELECT id FROM ai_agents WHERE name = ?`,
      [name]
    );
    
    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { success: false, error: `Agent "${name}" existiert bereits` },
        { status: 409 }
      );
    }
    
    // Agent einfügen
    const [result] = await pool.execute<ResultSetHeader>(`
      INSERT INTO ai_agents (name, type, description, dsgvo_scope, risk_profile, config, enabled)
      VALUES (?, ?, ?, ?, ?, ?, TRUE)
    `, [
      name,
      type,
      description || null,
      dsgvo_scope ? JSON.stringify(dsgvo_scope) : null,
      risk_profile || "medium",
      config ? JSON.stringify(config) : null
    ]);
    
    const agentId = result.insertId;
    
    // Neuen Agent laden
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM ai_agents WHERE id = ?`,
      [agentId]
    );
    
    const newAgent = rows[0];
    
    // Audit-Log (optional)
    try {
      await pool.execute(`
        INSERT INTO lopez_audit_logs (user_id, action, entity_type, entity_id, details)
        VALUES (?, 'AI_AGENT_REGISTERED', 'ai_agent', ?, ?)
      `, [
        1, // System-User
        agentId,
        JSON.stringify({ name, type, risk_profile: risk_profile || "medium" })
      ]);
    } catch (e) {
      // Audit optional
    }
    
    console.log(`✅ Agent registriert: ${name} (ID: ${agentId})`);
    
    return NextResponse.json({
      success: true,
      message: `Agent "${name}" erfolgreich registriert`,
      data: {
        ...newAgent,
        dsgvo_scope: newAgent.dsgvo_scope ? JSON.parse(newAgent.dsgvo_scope) : null,
        config: newAgent.config ? JSON.parse(newAgent.config) : null,
        enabled: Boolean(newAgent.enabled)
      }
    });
    
  } catch (error) {
    console.error("❌ Agent Registry POST Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Fehler beim Registrieren des Agenten" 
      },
      { status: 500 }
    );
  }
}

