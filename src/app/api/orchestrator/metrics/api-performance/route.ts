/**
 * Orchestrator Metrics API Performance API - Enterprise++ Standard P8-D
 * 
 * GET /api/orchestrator/metrics/api-performance - API-Performance-Metriken abrufen
 * 
 * RBAC: monitoring.view
 */

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { performanceMonitor } from "@/lib/telemetry/engines/PerformanceMonitor";
import { logger } from "@/lib/logger";
import type { BaseMetric } from "@/lib/telemetry/types";

/**
 * GET /api/orchestrator/metrics/api-performance
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

    const user = await AdminAuthService.validateSession(sessionToken);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session", error_code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // RBAC-Prüfung
    const hasViewPermission = await RBACService.hasPermission(user.userId, "monitoring.view");

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

    // Hole API-Metriken
    let query = `
      SELECT 
        id, metric_id, metric_name, category, value, unit, timestamp, tags, metadata
      FROM orchestrator_metrics
      WHERE category = 'api'
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
      source: "api-gateway",
      metric_timestamp: new Date(row.timestamp),
      tags: row.tags ? JSON.parse(row.tags) : {},
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
    }));

    // Analysiere Performance
    const performance = performanceMonitor.analyzeApiPerformance(metrics);

    return NextResponse.json({
      success: true,
      data: {
        performance: {
          avgLatencyMs: performance.avgLatencyMs,
          p50LatencyMs: performance.p50LatencyMs,
          p95LatencyMs: performance.p95LatencyMs,
          p99LatencyMs: performance.p99LatencyMs,
          errorRate: performance.errorRate,
          requestRate: performance.requestRate,
          timeoutRate: performance.timeoutRate,
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
    logger.error("Fehler beim Abrufen der API-Performance-Metriken", error);
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





