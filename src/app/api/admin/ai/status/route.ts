// =====================================================
// AI CENTER - SYSTEM STATUS API
// =====================================================
// GET /api/admin/ai/status
// Umfassender System-Status für Production-Monitoring
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";
import { AISettingsService, AICostTracker } from "@/lib/ai-center/settings-service";

// =====================================================
// GET - System Status
// =====================================================

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const pool = await getConnection();
    
    // -------------------------------------------------
    // 1. DATENBANK-STATUS
    // -------------------------------------------------
    
    const dbStart = Date.now();
    await pool.execute("SELECT 1");
    const dbLatency = Date.now() - dbStart;
    
    // AI-Tabellen zählen
    const [tables] = await pool.execute<RowDataPacket[]>(`
      SELECT TABLE_NAME, TABLE_ROWS, DATA_LENGTH
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME LIKE 'ai_%'
    `);
    
    const dbStatus = {
      connected: true,
      latency_ms: dbLatency,
      ai_tables: tables.length,
      tables: tables.map((t: any) => ({
        name: t.TABLE_NAME,
        rows: t.TABLE_ROWS || 0,
        size_bytes: t.DATA_LENGTH || 0
      }))
    };
    
    // -------------------------------------------------
    // 2. AGENTEN-STATUS
    // -------------------------------------------------
    
    let agentStatus = { total: 0, active: 0, inactive: 0, agents: [] as any[] };
    try {
      // Einfache Abfrage ohne Subquery für Robustheit
      const [agents] = await pool.execute<RowDataPacket[]>(`
        SELECT name, type, enabled, risk_profile
        FROM ai_agents
      `);
      
      agentStatus = {
        total: agents.length,
        active: agents.filter((a: any) => a.enabled).length,
        inactive: agents.filter((a: any) => !a.enabled).length,
        agents: agents.map((a: any) => ({
          name: a.name,
          type: a.type,
          enabled: !!a.enabled,
          risk_profile: a.risk_profile
        }))
      };
    } catch (e) {
      console.log("Agent query error:", e);
    }
    
    // -------------------------------------------------
    // 3. WORKFLOW-STATUS
    // -------------------------------------------------
    
    let workflowStatus = { total: 0, active: 0, paused: 0, executions_today: 0 };
    try {
      const [workflows] = await pool.execute<RowDataPacket[]>(`
        SELECT 
          COUNT(*) as total,
          SUM(status = 'active') as active,
          SUM(status = 'paused') as paused
        FROM ai_workflows
      `);
      
      const [executions] = await pool.execute<RowDataPacket[]>(`
        SELECT COUNT(*) as count FROM ai_workflow_executions WHERE DATE(started_at) = CURDATE()
      `);
      
      workflowStatus = {
        total: Number(workflows[0]?.total) || 0,
        active: Number(workflows[0]?.active) || 0,
        paused: Number(workflows[0]?.paused) || 0,
        executions_today: Number(executions[0]?.count) || 0
      };
    } catch (e) {
      // Tabelle existiert möglicherweise nicht
    }
    
    // -------------------------------------------------
    // 4. PLAYBOOK-STATUS
    // -------------------------------------------------
    
    let playbookStatus = { total: 0, active: 0, executions_today: 0 };
    try {
      const [playbooks] = await pool.execute<RowDataPacket[]>(`
        SELECT COUNT(*) as total, SUM(status = 'active') as active FROM ai_playbooks
      `);
      
      const [executions] = await pool.execute<RowDataPacket[]>(`
        SELECT COUNT(*) as count FROM ai_playbook_executions WHERE DATE(started_at) = CURDATE()
      `);
      
      playbookStatus = {
        total: Number(playbooks[0]?.total) || 0,
        active: Number(playbooks[0]?.active) || 0,
        executions_today: Number(executions[0]?.count) || 0
      };
    } catch (e) {
      // Tabelle existiert möglicherweise nicht
    }
    
    // -------------------------------------------------
    // 5. KOSTEN-STATUS
    // -------------------------------------------------
    
    const costStatus = await AICostTracker.checkCostLimit();
    
    // -------------------------------------------------
    // 6. SETTINGS-STATUS
    // -------------------------------------------------
    
    const settings = await AISettingsService.getSettings();
    const settingsStatus = {
      ai_center_enabled: settings.ai_center_enabled,
      demo_mode: settings.demo_mode,
      dsgvo_strict_mode: settings.dsgvo_strict_mode,
      workflows_enabled: settings.workflows_enabled,
      playbooks_enabled: settings.playbooks_enabled
    };
    
    // -------------------------------------------------
    // 7. SECURITY-EVENTS (letzte 24h)
    // -------------------------------------------------
    
    let securityStatus = { events_24h: 0, critical: 0, high: 0 };
    try {
      const [events] = await pool.execute<RowDataPacket[]>(`
        SELECT 
          COUNT(*) as total,
          SUM(severity = 'critical') as critical,
          SUM(severity = 'high') as high
        FROM ai_security_events
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      `);
      
      securityStatus = {
        events_24h: Number(events[0]?.total) || 0,
        critical: Number(events[0]?.critical) || 0,
        high: Number(events[0]?.high) || 0
      };
    } catch (e) {
      // Tabelle existiert möglicherweise nicht
    }
    
    // -------------------------------------------------
    // 8. PROVIDER-STATUS
    // -------------------------------------------------
    
    const providerStatus = {
      openai: {
        configured: !!process.env.OPENAI_API_KEY,
        enabled: settings.openai_enabled
      },
      anthropic: {
        configured: !!process.env.ANTHROPIC_API_KEY,
        enabled: settings.anthropic_enabled
      }
    };
    
    // -------------------------------------------------
    // 9. PRODUCTION-READINESS
    // -------------------------------------------------
    
    const checks = {
      database_connected: dbStatus.connected,
      ai_tables_exist: dbStatus.ai_tables >= 8,
      agents_registered: agentStatus.total > 0,
      settings_configured: true,
      cost_within_limits: costStatus.allowed,
      no_critical_security_events: securityStatus.critical === 0,
      provider_configured: providerStatus.openai.configured || providerStatus.anthropic.configured
    };
    
    const productionReady = Object.values(checks).every(v => v);
    
    // -------------------------------------------------
    // GESAMT-STATUS
    // -------------------------------------------------
    
    let overallStatus: "operational" | "degraded" | "down" = "operational";
    if (!dbStatus.connected) {
      overallStatus = "down";
    } else if (!costStatus.allowed || securityStatus.critical > 0) {
      overallStatus = "degraded";
    }
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      data: {
        status: overallStatus,
        production_ready: productionReady,
        timestamp: new Date().toISOString(),
        response_time_ms: responseTime,
        
        database: dbStatus,
        agents: agentStatus,
        workflows: workflowStatus,
        playbooks: playbookStatus,
        costs: costStatus,
        settings: settingsStatus,
        security: securityStatus,
        providers: providerStatus,
        
        production_checks: checks
      }
    });
    
  } catch (error) {
    console.error("❌ Status API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Fehler",
        data: {
          status: "down",
          production_ready: false,
          timestamp: new Date().toISOString(),
          response_time_ms: Date.now() - startTime
        }
      },
      { status: 500 }
    );
  }
}

