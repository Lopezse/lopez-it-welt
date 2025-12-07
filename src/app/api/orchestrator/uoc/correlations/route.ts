/**
 * UOC Correlations API - Enterprise++ Standard P9
 * 
 * GET /api/orchestrator/uoc/correlations - Korrelations-Daten abrufen
 * 
 * RBAC: monitoring.view ODER logs.view ODER security.view
 */

import { NextRequest, NextResponse } from "next/server";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { viewManager } from "@/lib/ki-orchestrator/level2/uoc/ViewManager";
import type { CorrelationFilters, TimeRange } from "@/lib/ki-orchestrator/level2/uoc/types";

/**
 * Parse timeRange string to TimeRange object
 */
function parseTimeRange(timeRangeStr?: string): TimeRange {
  const now = new Date();
  let start: Date;

  switch (timeRangeStr) {
    case "1h":
      start = new Date(now.getTime() - 3600000);
      break;
    case "6h":
      start = new Date(now.getTime() - 6 * 3600000);
      break;
    case "7d":
      start = new Date(now.getTime() - 7 * 24 * 3600000);
      break;
    case "24h":
    default:
      start = new Date(now.getTime() - 24 * 3600000);
      break;
  }

  return { start, end: now };
}

/**
 * GET /api/orchestrator/uoc/correlations
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

    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session", error_code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // RBAC-Prüfung (mindestens eine Berechtigung erforderlich)
    const hasMonitoring = await RBACService.checkPermission({
      user_id: session.userId,
      resource: "monitoring",
      action: "view",
    });
    const hasLogs = await RBACService.checkPermission({
      user_id: session.userId,
      resource: "logs",
      action: "view",
    });
    const hasSecurity = await RBACService.checkPermission({
      user_id: session.userId,
      resource: "security",
      action: "view",
    });

    if (!hasMonitoring && !hasLogs && !hasSecurity) {
      return NextResponse.json(
        {
          success: false,
          error: "Keine Berechtigung (monitoring.view, logs.view oder security.view erforderlich)",
          error_code: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    // Query-Parameter auslesen
    const { searchParams } = new URL(request.url);
    const timeRangeStr = searchParams.get("timeRange") || "24h";
    const category = searchParams.get("category");
    const severity = searchParams.get("severity");
    const source = searchParams.get("source");
    const minScore = parseFloat(searchParams.get("minScore") || "0.5");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 1000);
    const offset = parseInt(searchParams.get("offset") || "0");
    const correlationId = searchParams.get("correlation_id");
    const resourceId = searchParams.get("resource_id");
    const resourceType = searchParams.get("resource_type");

    const timeRange = parseTimeRange(timeRangeStr);

    // Filter erstellen
    const filters: CorrelationFilters = {
      timeRange,
      categories: category ? [category] : undefined,
      severities: severity ? [severity] : undefined,
      sources: source ? [source] : undefined,
      minScore,
      limit,
      offset,
      correlationId: correlationId || undefined,
      resourceId: resourceId || undefined,
      resourceType: resourceType || undefined,
    };

    // Erstelle Correlation View
    const correlationView = await viewManager.createCorrelationView(filters);

    // Filtere nach minScore
    const filteredCorrelations = correlationView.correlations.filter(
      (c) => c.score >= minScore
    );

    // Pagination anwenden
    const paginatedCorrelations = filteredCorrelations.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        correlations: paginatedCorrelations,
        total: filteredCorrelations.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    logger.error("UOC Correlations API failed", { error });
    return NextResponse.json(
      {
        success: false,
        error: "Interner Serverfehler",
        error_code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}




