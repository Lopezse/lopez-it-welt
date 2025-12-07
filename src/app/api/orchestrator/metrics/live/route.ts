/**
 * Orchestrator Metrics Live API - Enterprise++ Standard P8-D
 * 
 * GET /api/orchestrator/metrics/live - Live-Metriken abrufen (letzte 5 Sekunden)
 * 
 * RBAC: monitoring.view
 */

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";

/**
 * GET /api/orchestrator/metrics/live
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
    const metricIds = searchParams.get("metric_ids")?.split(",").filter(Boolean);
    const categories = searchParams.get("categories")?.split(",").filter(Boolean);
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 1000);

    const connection = await getConnection();

    // Hole Metriken der letzten 5 Sekunden
    const fiveSecondsAgo = new Date(Date.now() - 5 * 1000);

    let query = `
      SELECT 
        id, metric_id, metric_name, category, value, unit, timestamp, tags, metadata
      FROM orchestrator_metrics
      WHERE timestamp >= ?
    `;
    const params: any[] = [fiveSecondsAgo];

    if (metricIds && metricIds.length > 0) {
      query += " AND metric_id IN (" + metricIds.map(() => "?").join(",") + ")";
      params.push(...metricIds);
    }

    if (categories && categories.length > 0) {
      query += " AND category IN (" + categories.map(() => "?").join(",") + ")";
      params.push(...categories);
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
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der Live-Metriken", error);
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





