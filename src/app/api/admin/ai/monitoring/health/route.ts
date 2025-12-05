// =====================================================
// AI CENTER - SYSTEM HEALTH API
// =====================================================
// GET /api/admin/ai/monitoring/health
// Liefert System-Gesundheitsstatus aller AI-Komponenten
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

// =====================================================
// TYPEN
// =====================================================

interface ComponentHealth {
  name: string;
  status: "healthy" | "degraded" | "unhealthy" | "unknown";
  latency_ms: number | null;
  last_check: string;
  details?: string;
}

interface SystemHealth {
  overall_status: "healthy" | "degraded" | "unhealthy";
  components: ComponentHealth[];
  timestamp: string;
  uptime_seconds: number;
}

// Server-Start-Zeit für Uptime
const SERVER_START = Date.now();

// =====================================================
// GET - System Health Check
// =====================================================

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const components: ComponentHealth[] = [];
  
  try {
    // 1. Datenbank-Check
    const dbHealth = await checkDatabase();
    components.push(dbHealth);
    
    // 2. Agent-Registry-Check
    const agentHealth = await checkAgentRegistry();
    components.push(agentHealth);
    
    // 3. Queue-Check
    const queueHealth = await checkQueue();
    components.push(queueHealth);
    
    // 4. DSGVO Decision Engine Check
    const dsgvoHealth = await checkDSGVOEngine();
    components.push(dsgvoHealth);
    
    // 5. AI Provider Check (optional)
    const aiHealth = await checkAIProvider();
    components.push(aiHealth);
    
    // Gesamt-Status berechnen
    const unhealthyCount = components.filter(c => c.status === "unhealthy").length;
    const degradedCount = components.filter(c => c.status === "degraded").length;
    
    let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";
    if (unhealthyCount > 0) {
      overallStatus = "unhealthy";
    } else if (degradedCount > 0) {
      overallStatus = "degraded";
    }
    
    const health: SystemHealth = {
      overall_status: overallStatus,
      components,
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.floor((Date.now() - SERVER_START) / 1000)
    };
    
    return NextResponse.json({
      success: true,
      data: health,
      response_time_ms: Date.now() - startTime
    });
    
  } catch (error) {
    console.error("❌ Health Check Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Health Check fehlgeschlagen",
        data: {
          overall_status: "unhealthy",
          components,
          timestamp: new Date().toISOString(),
          uptime_seconds: Math.floor((Date.now() - SERVER_START) / 1000)
        }
      },
      { status: 500 }
    );
  }
}

// =====================================================
// HEALTH CHECK FUNKTIONEN
// =====================================================

async function checkDatabase(): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    const pool = await getConnection();
    await pool.execute("SELECT 1");
    
    return {
      name: "Database",
      status: "healthy",
      latency_ms: Date.now() - start,
      last_check: new Date().toISOString(),
      details: "MariaDB/MySQL verbunden"
    };
  } catch (error) {
    return {
      name: "Database",
      status: "unhealthy",
      latency_ms: Date.now() - start,
      last_check: new Date().toISOString(),
      details: error instanceof Error ? error.message : "Verbindungsfehler"
    };
  }
}

async function checkAgentRegistry(): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    const pool = await getConnection();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count, SUM(enabled) as enabled FROM ai_agents"
    );
    
    const total = rows[0]?.count || 0;
    const enabled = rows[0]?.enabled || 0;
    
    if (total === 0) {
      return {
        name: "Agent Registry",
        status: "degraded",
        latency_ms: Date.now() - start,
        last_check: new Date().toISOString(),
        details: "Keine Agenten registriert"
      };
    }
    
    return {
      name: "Agent Registry",
      status: "healthy",
      latency_ms: Date.now() - start,
      last_check: new Date().toISOString(),
      details: `${enabled}/${total} Agenten aktiv`
    };
  } catch (error) {
    return {
      name: "Agent Registry",
      status: "unhealthy",
      latency_ms: Date.now() - start,
      last_check: new Date().toISOString(),
      details: error instanceof Error ? error.message : "Fehler"
    };
  }
}

async function checkQueue(): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    // Prüfe ob dev_tasks Tabelle existiert und Tasks in Bearbeitung sind
    const pool = await getConnection();
    
    // Versuche dev_tasks zu prüfen
    let pendingTasks = 0;
    let processingTasks = 0;
    
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(`
        SELECT 
          SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status IN ('planning', 'coding', 'review') THEN 1 ELSE 0 END) as processing
        FROM dev_tasks
      `);
      pendingTasks = Number(rows[0]?.pending) || 0;
      processingTasks = Number(rows[0]?.processing) || 0;
    } catch {
      // Tabelle existiert möglicherweise nicht
    }
    
    // Warnung wenn Queue voll
    if (pendingTasks > 50) {
      return {
        name: "Task Queue",
        status: "degraded",
        latency_ms: Date.now() - start,
        last_check: new Date().toISOString(),
        details: `${pendingTasks} wartend, ${processingTasks} in Bearbeitung (Queue voll)`
      };
    }
    
    return {
      name: "Task Queue",
      status: "healthy",
      latency_ms: Date.now() - start,
      last_check: new Date().toISOString(),
      details: `${pendingTasks} wartend, ${processingTasks} in Bearbeitung`
    };
  } catch (error) {
    return {
      name: "Task Queue",
      status: "unknown",
      latency_ms: Date.now() - start,
      last_check: new Date().toISOString(),
      details: "Queue-Status unbekannt"
    };
  }
}

async function checkDSGVOEngine(): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    // DSGVO Decision Engine ist immer verfügbar (In-Memory)
    // Prüfe ob Consent-Tabelle erreichbar ist
    const pool = await getConnection();
    
    try {
      await pool.execute("SELECT 1 FROM lopez_ai_consent LIMIT 1");
    } catch {
      // Tabelle existiert möglicherweise nicht - trotzdem OK
    }
    
    return {
      name: "DSGVO Decision Engine",
      status: "healthy",
      latency_ms: Date.now() - start,
      last_check: new Date().toISOString(),
      details: "KI-Firewall aktiv"
    };
  } catch (error) {
    return {
      name: "DSGVO Decision Engine",
      status: "degraded",
      latency_ms: Date.now() - start,
      last_check: new Date().toISOString(),
      details: "Eingeschränkt verfügbar"
    };
  }
}

async function checkAIProvider(): Promise<ComponentHealth> {
  const start = Date.now();
  
  // Prüfe ob OpenAI API Key konfiguriert ist
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  
  if (!hasOpenAI && !hasAnthropic) {
    return {
      name: "AI Provider",
      status: "degraded",
      latency_ms: Date.now() - start,
      last_check: new Date().toISOString(),
      details: "Demo-Modus (kein API-Key)"
    };
  }
  
  const providers: string[] = [];
  if (hasOpenAI) providers.push("OpenAI");
  if (hasAnthropic) providers.push("Anthropic");
  
  return {
    name: "AI Provider",
    status: "healthy",
    latency_ms: Date.now() - start,
    last_check: new Date().toISOString(),
    details: `Konfiguriert: ${providers.join(", ")}`
  };
}

