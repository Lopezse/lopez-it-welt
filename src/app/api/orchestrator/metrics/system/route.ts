/**
 * Orchestrator Metrics System API - Enterprise++ Standard P8-D
 * 
 * GET /api/orchestrator/metrics/system - System-Metriken abrufen
 * 
 * RBAC: monitoring.view
 */

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";

/**
 * GET /api/orchestrator/metrics/system
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
    const rollupInterval = searchParams.get("rollup_interval") || "1min";
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 1000);

    const connection = await getConnection();

    // Wenn rollup_interval gesetzt ist, hole Rollup-Daten
    if (rollupInterval && rollupInterval !== "none") {
      let query = `
        SELECT 
          id, metric_id, metric_name, category,
          value_min, value_max, value_avg, value_sum, value_count,
          rollup_interval, timestamp_start, timestamp_end
        FROM orchestrator_metrics_rollup
        WHERE category = 'system'
      `;
      const params: any[] = [];

      if (startTime) {
        query += " AND timestamp_start >= ?";
        params.push(new Date(startTime));
      }
      if (endTime) {
        query += " AND timestamp_end <= ?";
        params.push(new Date(endTime));
      }

      query += ` AND rollup_interval = ? ORDER BY timestamp_start DESC LIMIT ?`;
      params.push(rollupInterval, limit);

      const [rows] = await connection.execute(query, params);

      return NextResponse.json({
        success: true,
        data: {
          metrics: (Array.isArray(rows) ? rows : []).map((row: any) => ({
            id: row.id,
            metric_id: row.metric_id,
            metric_name: row.metric_name,
            category: row.category,
            rollup_interval: row.rollup_interval,
            value_avg: parseFloat(row.value_avg),
            value_min: parseFloat(row.value_min),
            value_max: parseFloat(row.value_max),
            value_sum: parseFloat(row.value_sum),
            value_count: parseInt(row.value_count),
            timestamp_start: row.timestamp_start.toISOString(),
            timestamp_end: row.timestamp_end.toISOString(),
          })),
          total: (Array.isArray(rows) ? rows : []).length,
        },
      });
    }

    // Sonst: Raw-Metriken
    let query = `
      SELECT 
        id, metric_id, metric_name, category, value, unit, timestamp, tags, metadata
      FROM orchestrator_metrics
      WHERE category = 'system'
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

    return NextResponse.json({
      success: true,
      data: {
        metrics: (Array.isArray(rows) ? rows : []).map((row: any) => ({
          id: row.id,
          metric_id: row.metric_id,
          metric_name: row.metric_name,
          category: row.category,
          value: parseFloat(row.value),
          unit: row.unit,
          timestamp: row.timestamp.toISOString(),
          tags: row.tags ? JSON.parse(row.tags) : {},
          metadata: row.metadata ? JSON.parse(row.metadata) : {},
        })),
        total: (Array.isArray(rows) ? rows : []).length,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der System-Metriken", error);
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





