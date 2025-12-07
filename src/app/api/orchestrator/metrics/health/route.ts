/**
 * Orchestrator Metrics Health API - Enterprise++ Standard P8-D
 * 
 * GET /api/orchestrator/metrics/health - System-Health-Status abrufen
 * 
 * RBAC: monitoring.view
 */

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { healthEngine } from "@/lib/telemetry/engines/HealthEngine";
import { logger } from "@/lib/logger";
import type { BaseMetric } from "@/lib/telemetry/types";

/**
 * GET /api/orchestrator/metrics/health
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

    // Hole die letzten relevanten Metriken (letzte 5 Minuten)
    const connection = await getConnection();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const [rows] = await connection.execute(
      `SELECT 
        id, metric_id, metric_name, category, value, unit, timestamp, tags, metadata
       FROM orchestrator_metrics
       WHERE timestamp >= ?
       ORDER BY timestamp DESC
       LIMIT 1000`,
      [fiveMinutesAgo]
    );

    // Konvertiere DB-Rows zu BaseMetric
    const metrics: BaseMetric[] = (Array.isArray(rows) ? rows : []).map((row: any) => ({
      id: row.id,
      metric_id: row.metric_id,
      metric_name: row.metric_name,
      category: row.category as BaseMetric["category"],
      value: parseFloat(row.value),
      unit: row.unit,
      priority: "P1", // Wird später aus Registry geholt
      severity: "info", // Wird später aus Registry geholt
      source: "system",
      metric_timestamp: new Date(row.timestamp),
      tags: row.tags ? JSON.parse(row.tags) : {},
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
    }));

    // Berechne Health-Status
    const health = healthEngine.computeHealth(metrics);

    // Speichere Health-Status (optional, asynchron)
    healthEngine.saveHealthStatus(health).catch((err) => {
      logger.error("Fehler beim Speichern des Health-Status", err);
    });

    return NextResponse.json({
      success: true,
      data: {
        status: health.status,
        score: health.score,
        issues: health.issues,
        metrics_summary: health.metrics_summary,
        updated_at: health.updated_at.toISOString(),
      },
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen des Health-Status", error);
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





