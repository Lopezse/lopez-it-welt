/**
 * Orchestrator Logs Search API - Enterprise++ Standard P8-E
 * 
 * POST /api/orchestrator/logs/search - Erweiterte Log-Suche
 * 
 * RBAC: logs.view
 */

import { NextRequest, NextResponse } from "next/server";
import { searchEngine } from "@/lib/ki-orchestrator/level2/logs/storage/SearchEngine";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import type { SearchQuery } from "@/lib/ki-orchestrator/level2/logs/types";

/**
 * POST /api/orchestrator/logs/search
 */
export async function POST(request: NextRequest) {
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

    // RBAC-Prüfung
    const hasPermission = await RBACService.checkPermission({
      user_id: session.userId.toString(),
      resource: "logs",
      action: "view",
    });

    if (!hasPermission) {
      return NextResponse.json(
        { success: false, error: "Keine Berechtigung für logs.view", error_code: "FORBIDDEN" },
        { status: 403 }
      );
    }

    // Request-Body parsen
    const body = await request.json();
    const searchQuery: SearchQuery = {
      q: body.query || body.q,
      category: body.category,
      log_level: body.log_level,
      severity: body.severity,
      log_rule_id: body.log_rule_id,
      start_time: body.start_time ? new Date(body.start_time) : undefined,
      end_time: body.end_time ? new Date(body.end_time) : undefined,
      correlation_id: body.correlation_id,
      request_id: body.request_id,
      resource_type: body.resource_type,
      resource_id: body.resource_id,
      tags: body.tags,
      limit: Math.min(body.limit || 100, 1000),
      offset: body.offset || 0,
      sort: body.sort || "desc",
      sort_by: body.sort_by || "timestamp",
    };

    // Suche Logs
    const logs = await searchEngine.searchLogs(searchQuery);

    // Highlighting (optional)
    let highlightedLogs = logs;
    if (searchQuery.q) {
      highlightedLogs = await searchEngine.highlightResults(logs, searchQuery.q);
    }

    // Gesamtanzahl (vereinfacht)
    const total = highlightedLogs.length;

    return NextResponse.json({
      success: true,
      data: {
        logs: highlightedLogs.map((log) => ({
          ...log,
          timestamp: log.timestamp.toISOString(),
          created_at: log.created_at?.toISOString(),
        })),
        total,
        limit: searchQuery.limit,
        offset: searchQuery.offset,
      },
    });
  } catch (error) {
    logger.error("Fehler bei Log-Suche", error);
    return NextResponse.json(
      { success: false, error: "Interner Serverfehler", error_code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}





