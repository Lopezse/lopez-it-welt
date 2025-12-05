/**
 * Orchestrator Logs Analytics Trends API - Enterprise++ Standard P8-E
 * 
 * GET /api/orchestrator/logs/analytics/trends - Log-Trends abrufen
 * 
 * RBAC: logs.view
 */

import { NextRequest, NextResponse } from "next/server";
import { logStorage } from "@/lib/ki-orchestrator/level2/logs/storage/LogStorage";
import { trendAnalyzer } from "@/lib/ki-orchestrator/level2/logs/analytics/TrendAnalyzer";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import type { SearchQuery, AnalysisPeriod, LogCategory } from "@/lib/ki-orchestrator/level2/logs/types";

/**
 * GET /api/orchestrator/logs/analytics/trends
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

    // Query-Parameter
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const startTime = searchParams.get("start_time");
    const endTime = searchParams.get("end_time");
    const period = (searchParams.get("period") || "day") as AnalysisPeriod;

    // Erstelle SearchQuery für Logs
    const searchQuery: SearchQuery = {
      category: category as LogCategory,
      start_time: startTime ? new Date(startTime) : undefined,
      end_time: endTime ? new Date(endTime) : undefined,
      limit: 10000, // Mehr Logs für Trend-Analyse
    };

    // Logs abrufen
    const logs = await logStorage.getLogs(searchQuery);

    // Trend-Analyse durchführen
    const trends = await trendAnalyzer.analyzeTrends(logs, period, category as LogCategory);

    return NextResponse.json({
      success: true,
      data: {
        trends: trends.map((trend) => ({
          id: trend.id,
          metric: trend.metric,
          category: trend.category,
          trend: trend.trend,
          slope: trend.slope,
          r_squared: trend.r_squared,
          confidence: trend.confidence,
          forecast: trend.forecast?.map((f) => ({
            timestamp: f.timestamp.toISOString(),
            value: f.value,
          })),
          timestamp_start: trend.timestamp_start.toISOString(),
          timestamp_end: trend.timestamp_end.toISOString(),
        })),
        summary: {
          total_logs: logs.length,
          period,
          trends_count: trends.length,
        },
      },
    });
  } catch (error) {
    logger.error("Fehler bei Trend-Analyse", error);
    return NextResponse.json(
      { success: false, error: "Interner Serverfehler", error_code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}





