/**
 * Orchestrator Metrics Database API - Enterprise++ Standard P8-D
 * 
 * GET /api/orchestrator/metrics/db - Datenbank-Metriken abrufen
 * 
 * RBAC: monitoring.view
 */

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { dbMonitor } from "@/lib/telemetry/engines/DBMonitor";
import { logger } from "@/lib/logger";
import type { BaseMetric } from "@/lib/telemetry/types";

/**
 * GET /api/orchestrator/metrics/db
 */
export async function GET(request: NextRequest) {
  try {
    // Authentifizierung
    const sessionToken =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("adm_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert", error_code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const adminAuth = new AdminAuthService();
    const user = await adminAuth.validateSession(sessionToken);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session", error_code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // RBAC-Prüfung
    const rbac = new RBACService();
    const hasViewPermission = await rbac.hasPermission(user.id, "monitoring.view");

    if (!hasViewPermission) {
      return NextResponse.json(
        { success: false, error: "Keine Berechtigung", error_code: "FORBIDDEN" },
        { status: 403 }
      );
    }

    // Query-Parameter
    const searchParams = request.nextUrl.searchParams;
    const startTime = searchParams.get("start_time");
    const endTime = searchParams.get("end_time");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 1000);

    const connection = await getConnection();

    // Hole DB-Metriken
    let query = `
      SELECT 
        id, metric_id, metric_name, category, value, unit, timestamp, tags, metadata
      FROM orchestrator_metrics
      WHERE category = 'db'
    `;
    const params: any[] = [];

    if (startTime) {
      query += " AND timestamp >= ?";
      params.push(new Date(startTime));
    }
    if (endTime) {
      query += " AND timestamp <= ?";
      params.push(new Date(endTime));
    }

    query += " ORDER BY timestamp DESC LIMIT ?";
    params.push(limit);

    const [rows] = await connection.execute(query, params);

    // Konvertiere zu BaseMetric
    const metrics: BaseMetric[] = (Array.isArray(rows) ? rows : []).map((row: any) => ({
      id: row.id,
      metric_id: row.metric_id,
      metric_name: row.metric_name,
      category: row.category as BaseMetric["category"],
      value: parseFloat(row.value),
      unit: row.unit,
      priority: "P1",
      severity: "info",
      source: "database",
      metric_timestamp: new Date(row.timestamp),
      tags: row.tags ? JSON.parse(row.tags) : {},
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
    }));

    // Analysiere DB-Health
    const dbHealth = dbMonitor.analyzeDbHealth(metrics);
    const dbHealthScore = dbMonitor.calculateDBHealth(metrics);

    // Hole zusätzliche DB-Status-Informationen
    const connectionPoolStatus = await dbMonitor.getConnectionPoolStatus();
    const queryPerformance = await dbMonitor.monitorQueryPerformance();
    const replicationLag = await dbMonitor.monitorReplicationLag();

    return NextResponse.json({
      success: true,
      data: {
        health: {
          score: dbHealthScore.score,
          status: dbHealthScore.status,
          issues: dbHealthScore.issues,
        },
        performance: {
          connectionPoolUsage: dbHealth.connectionPoolUsage,
          connectionPool: connectionPoolStatus,
          slowQueryCount: dbHealth.slowQueryCount,
          avgSlowQueryTime: dbHealth.avgSlowQueryTime,
          queryRate: dbHealth.queryRate,
          replicationLag: replicationLag || dbHealth.replicationLag,
          queryPerformance,
        },
        metrics: metrics.map((m) => ({
          id: m.id,
          metric_id: m.metric_id,
          metric_name: m.metric_name,
          value: m.value,
          unit: m.unit,
          timestamp: m.metric_timestamp.toISOString(),
        })),
        total: metrics.length,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der DB-Metriken", error);
    return NextResponse.json(
      {
        success: false,
        error: "Interner Serverfehler",
        error_code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}





