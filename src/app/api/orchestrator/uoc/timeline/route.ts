/**
 * UOC Timeline API - Enterprise++ Standard P9
 * 
 * GET /api/orchestrator/uoc/timeline - Timeline-Daten abrufen
 * 
 * RBAC: monitoring.view ODER logs.view ODER security.view
 */

import { NextRequest, NextResponse } from "next/server";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { viewManager } from "@/lib/ki-orchestrator/level2/uoc/ViewManager";
import type { TimelineFilters, TimeRange } from "@/lib/ki-orchestrator/level2/uoc/types";

/**
 * GET /api/orchestrator/uoc/timeline
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
    const startTimeStr = searchParams.get("startTime");
    const endTimeStr = searchParams.get("endTime");
    const category = searchParams.get("category");
    const severity = searchParams.get("severity");
    const source = searchParams.get("source");
    const zoom = searchParams.get("zoom") || "hour";
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 1000);
    const offset = parseInt(searchParams.get("offset") || "0");

    // TimeRange erstellen
    let timeRange: TimeRange;
    if (startTimeStr && endTimeStr) {
      timeRange = {
        start: new Date(startTimeStr),
        end: new Date(endTimeStr),
      };
    } else {
      // Standard: Letzte Stunde
      const now = new Date();
      timeRange = {
        start: new Date(now.getTime() - 3600000),
        end: now,
      };
    }

    // Filter erstellen
    const filters: TimelineFilters = {
      timeRange,
      categories: category ? [category] : undefined,
      severities: severity ? [severity] : undefined,
      sources: source ? [source] : undefined,
      eventTypes: undefined, // Kann später erweitert werden
      limit,
      offset,
    };

    // Erstelle Timeline View
    const timelineView = await viewManager.createTimelineView(filters);

    // Pagination anwenden
    const paginatedEvents = timelineView.events.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        events: paginatedEvents,
        correlations: timelineView.correlations,
        total: timelineView.events.length,
        limit,
        offset,
        summary: timelineView.summary,
      },
    });
  } catch (error) {
    logger.error("UOC Timeline API failed", { error });
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




