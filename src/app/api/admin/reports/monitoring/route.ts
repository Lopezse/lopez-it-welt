import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_erp",
  port: parseInt(process.env.DB_PORT || "3306"),
};

/**
 * GET /api/admin/reports/monitoring
 * 
 * Gibt Monitoring-Übersicht-Daten zurück.
 */
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Server-Status (Mock - sollte aus Monitoring-System kommen)
    const serverStatus = {
      cpu_usage: 45.2,
      memory_usage: 62.8,
      disk_usage: 38.5,
      uptime: "15d 3h 22m",
      status: "healthy",
    };

    // API-Status
    const apiStatus = {
      total_requests: 12345,
      avg_response_time: 125,
      error_rate: 0.5,
      status: "healthy",
    };

    // DB-Status
    let dbStatus = {
      connection_count: 0,
      query_time: 0,
      status: "unknown",
    };

    try {
      const [dbConnections] = await connection.execute(
        "SELECT COUNT(*) as count FROM information_schema.processlist WHERE db = ?",
        [process.env.DB_NAME || "lopez_erp"],
      );
      dbStatus.connection_count = (dbConnections as any[])[0]?.count || 0;
      dbStatus.status = "healthy";
    } catch (dbError) {
      dbStatus.status = "error";
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        server_status: serverStatus,
        api_status: apiStatus,
        db_status: dbStatus,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Monitoring-Daten", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Monitoring-Daten" },
      { status: 500 },
    );
  }
}


