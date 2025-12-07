// =====================================================
// AI CENTER - TABELLEN-PRÜFUNG (Read-Only)
// =====================================================
// Zweck: Zeigt AI-Tabellen und deren Inhalt
// KEINE Änderungen, nur SELECT
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const pool = await getConnection();
    
    // 1. Prüfe welche AI-Tabellen existieren
    const [tables] = await pool.execute(`
      SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME LIKE 'ai_%'
      ORDER BY TABLE_NAME
    `);
    
    // 2. Lade ai_agents
    let agents: any[] = [];
    try {
      const [rows] = await pool.execute(`
        SELECT id, name, type, description, risk_profile, enabled, created_at
        FROM ai_agents
        ORDER BY id
      `);
      agents = rows as any[];
    } catch (e) {
      agents = [];
    }
    
    // 3. Lade ai_agent_capabilities (Anzahl pro Agent)
    let capabilities: any[] = [];
    try {
      const [rows] = await pool.execute(`
        SELECT agent_name, COUNT(*) as capability_count
        FROM ai_agent_capabilities
        GROUP BY agent_name
        ORDER BY agent_name
      `);
      capabilities = rows as any[];
    } catch (e) {
      capabilities = [];
    }
    
    // 4. Lade ai_agent_metrics (heute)
    let metrics: any[] = [];
    try {
      const [rows] = await pool.execute(`
        SELECT agent_name, metric_date, tasks_total, tasks_success, cost_estimated
        FROM ai_agent_metrics
        WHERE metric_date = CURDATE()
        ORDER BY agent_name
      `);
      metrics = rows as any[];
    } catch (e) {
      metrics = [];
    }
    
    return NextResponse.json({
      success: true,
      message: "AI Center Tabellen-Status",
      database: process.env.DB_NAME || "lopez_it_welt_dev",
      data: {
        tables: tables,
        agents: agents,
        capabilities_summary: capabilities,
        metrics_today: metrics,
        summary: {
          total_tables: (tables as any[]).length,
          total_agents: agents.length,
          agents_enabled: agents.filter(a => a.enabled).length,
          agents_disabled: agents.filter(a => !a.enabled).length
        }
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unbekannter Fehler"
      },
      { status: 500 }
    );
  }
}







