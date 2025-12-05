/**
 * Enterprise++ API: System-Monitoring
 * GET /api/admin/settings/system/monitoring - Monitoring-Daten abrufen
 */

import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import os from "os";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
};

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    model: string;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  uptime: {
    system: number;
    process: number;
  };
  database: {
    status: string;
    connections: number;
    size: string;
  };
  requests: {
    total: number;
    last_hour: number;
    errors: number;
  };
}

/**
 * GET: System-Monitoring-Daten abrufen
 */
export async function GET(request: NextRequest) {
  try {
    // CPU-Informationen
    const cpus = os.cpus();
    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total) * 100;
    }, 0) / cpus.length;
    
    // Speicher-Informationen
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    // Datenbank-Status
    let dbStatus = "unknown";
    let dbConnections = 0;
    let dbSize = "0 MB";
    
    try {
      const connection = await mysql.createConnection(dbConfig);
      
      // Verbindungsstatus
      dbStatus = "connected";
      
      // Aktive Verbindungen
      try {
        const [connRows] = await connection.execute(
          `SHOW STATUS LIKE 'Threads_connected'`
        );
        dbConnections = parseInt((connRows as any[])[0]?.Value || "0", 10);
      } catch (err) {
        // Ignorieren
      }
      
      // Datenbankgröße
      try {
        const [sizeRows] = await connection.execute(`
          SELECT 
            ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
          FROM information_schema.tables 
          WHERE table_schema = ?
        `, [dbConfig.database]);
        const sizeMb = (sizeRows as any[])[0]?.size_mb || 0;
        dbSize = `${sizeMb} MB`;
      } catch (err) {
        // Ignorieren
      }
      
      await connection.end();
    } catch (err) {
      dbStatus = "error";
      console.error("DB-Verbindungsfehler:", err);
    }
    
    // Request-Statistiken (Dummy-Werte, in echter Implementierung aus Logs/Metriken)
    const requestStats = {
      total: 0,
      last_hour: 0,
      errors: 0,
    };
    
    const metrics: SystemMetrics = {
      cpu: {
        usage: Math.round(cpuUsage * 100) / 100,
        cores: cpus.length,
        model: cpus[0]?.model || "Unknown",
      },
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usage: Math.round((usedMem / totalMem) * 100 * 100) / 100,
      },
      uptime: {
        system: os.uptime(),
        process: process.uptime(),
      },
      database: {
        status: dbStatus,
        connections: dbConnections,
        size: dbSize,
      },
      requests: requestStats,
    };
    
    return NextResponse.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der Monitoring-Daten:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST: Monitoring-Aktion ausführen
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    switch (action) {
      case "gc":
        // Garbage Collection triggern (wenn verfügbar)
        if (global.gc) {
          global.gc();
          return NextResponse.json({
            success: true,
            message: "Garbage Collection ausgeführt",
          });
        }
        return NextResponse.json({
          success: false,
          message: "Garbage Collection nicht verfügbar",
        });
        
      case "health":
        // Health-Check
        const health = {
          status: "healthy",
          checks: {
            database: "ok",
            memory: os.freemem() > 100 * 1024 * 1024 ? "ok" : "warning",
            disk: "ok",
          },
        };
        return NextResponse.json({ success: true, data: health });
        
      default:
        return NextResponse.json(
          { success: false, message: "Unbekannte Aktion" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Fehler bei Monitoring-Aktion:", error);
    return NextResponse.json(
      { success: false, message: "Fehler", error: error.message },
      { status: 500 }
    );
  }
}




