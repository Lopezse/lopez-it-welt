/**
 * UOC Dashboard API - Enterprise++ Standard P9
 * 
 * GET /api/orchestrator/uoc/dashboard - Dashboard-Daten abrufen
 * 
 * RBAC: monitoring.view ODER logs.view ODER security.view
 */

import { NextRequest, NextResponse } from "next/server";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { dataAggregator } from "@/lib/ki-orchestrator/level2/uoc/DataAggregator";
import { metricClient, healthClient, analyticsClient } from "@/lib/ki-orchestrator/level2/uoc/clients";
import type { TimeRange } from "@/lib/ki-orchestrator/level2/uoc/types";

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
 * GET /api/orchestrator/uoc/dashboard
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
      user_id: session.userId.toString(),
      resource: "monitoring",
      action: "view",
    });
    const hasLogs = await RBACService.checkPermission({
      user_id: session.userId.toString(),
      resource: "logs",
      action: "view",
    });
    const hasSecurity = await RBACService.checkPermission({
      user_id: session.userId.toString(),
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

    const timeRange = parseTimeRange(timeRangeStr);

    // Filter erstellen
    const filters = {
      timeRange,
      categories: category ? [category] : undefined,
      severities: severity ? [severity] : undefined,
      sources: source ? [source] : undefined,
      limit: 100,
      offset: 0,
    };

    // Aggregiere alle Datenquellen
    const aggregatedData = await dataAggregator.aggregateAllSources(timeRange, filters);

    // KPIs berechnen
    const kpis = {
      alerts_count: aggregatedData.alerts.length,
      incidents_count: aggregatedData.incidents.length,
      logs_count: aggregatedData.logs.length,
      health_score: aggregatedData.systemHealth.score,
    };

    // Top 10 Critical/Warning Alerts
    const topAlerts = aggregatedData.alerts
      .filter((a) => a.severity === "critical" || a.severity === "warning")
      .sort((a, b) => {
        if (a.severity === "critical" && b.severity !== "critical") return -1;
        if (a.severity !== "critical" && b.severity === "critical") return 1;
        return new Date(b.triggered_at).getTime() - new Date(a.triggered_at).getTime();
      })
      .slice(0, 10);

    // Top 5 Open Incidents
    const topIncidents = aggregatedData.incidents
      .filter((i) => i.status === "open" || i.status === "investigating")
      .sort((a, b) => {
        if (a.severity === "critical" && b.severity !== "critical") return -1;
        if (a.severity !== "critical" && b.severity === "critical") return 1;
        return new Date(b.opened_at).getTime() - new Date(a.opened_at).getTime();
      })
      .slice(0, 5);

    // System-Health
    const systemHealth = aggregatedData.systemHealth;

    // API-Performance
    let apiPerformance;
    try {
      apiPerformance = await metricClient.getAPIPerformance();
    } catch (error) {
      logger.error("UOC Dashboard: Failed to fetch API performance", { error });
      apiPerformance = null;
    }

    // Queue-Status
    let queueStatus;
    try {
      queueStatus = await metricClient.getQueueStatus();
    } catch (error) {
      logger.error("UOC Dashboard: Failed to fetch queue status", { error });
      queueStatus = null;
    }

    // Top 10 Recent Logs
    const recentLogs = aggregatedData.logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    // Trends
    let trends;
    try {
      const [logTrends, metricTrends, alertTrends] = await Promise.allSettled([
        analyticsClient.getTrends({
          startTime: timeRange.start,
          endTime: timeRange.end,
          period: "hour",
        }),
        analyticsClient.getTrends({
          startTime: timeRange.start,
          endTime: timeRange.end,
          period: "hour",
        }),
        analyticsClient.getTrends({
          startTime: timeRange.start,
          endTime: timeRange.end,
          period: "hour",
        }),
      ]);

      trends = {
        logs: logTrends.status === "fulfilled" ? logTrends.value : [],
        metrics: metricTrends.status === "fulfilled" ? metricTrends.value : [],
        alerts: alertTrends.status === "fulfilled" ? alertTrends.value : [],
      };
    } catch (error) {
      logger.error("UOC Dashboard: Failed to fetch trends", { error });
      trends = {
        logs: [],
        metrics: [],
        alerts: [],
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        kpis,
        alerts: topAlerts,
        incidents: topIncidents,
        system_health: systemHealth,
        api_performance: apiPerformance,
        queue_status: queueStatus,
        recent_logs: recentLogs,
        trends,
      },
    });
  } catch (error) {
    logger.error("UOC Dashboard API failed", { error });
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




