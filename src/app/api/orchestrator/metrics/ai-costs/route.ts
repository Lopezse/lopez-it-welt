/**
 * AI Costs Metrics API - Enterprise++ Standard E.1.3
 * 
 * API-Endpoint für KI-Kosten-Metriken
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const sessionToken =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("adm_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, message: "Nicht authentifiziert" }, { status: 401 });
    }

    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json({ success: false, message: "Ungültige Session" }, { status: 401 });
    }

    const hasPermission = await RBACService.checkPermission({
      user_id: session.userId.toString(),
      resource: "monitoring",
      action: "view",
    });

    if (!hasPermission) {
      return NextResponse.json(
        { success: false, message: "Keine Berechtigung für monitoring.view" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("time_range") || "24h";

    // Berechne Zeitraum
    const now = new Date();
    let startDate: Date;
    switch (timeRange) {
      case "1h":
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "6h":
        startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        break;
      case "24h":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const connection = await createConnection();

    // Gesamtkosten im Zeitraum
    const [totalRows] = await connection.execute(
      `SELECT COALESCE(SUM(cost_usd), 0) as total_cost
       FROM lopez_media_ai_costs
       WHERE created_at >= ?`,
      [startDate]
    );

    const totalCost = Array.isArray(totalRows) && totalRows.length > 0
      ? parseFloat((totalRows[0] as any).total_cost || "0")
      : 0;

    // Kosten pro Provider
    const [providerRows] = await connection.execute(
      `SELECT provider, COALESCE(SUM(cost_usd), 0) as total_cost, COUNT(*) as count
       FROM lopez_media_ai_costs
       WHERE created_at >= ?
       GROUP BY provider
       ORDER BY total_cost DESC`,
      [startDate]
    );

    // Kosten pro Operation
    const [operationRows] = await connection.execute(
      `SELECT operation_type, COALESCE(SUM(cost_usd), 0) as total_cost, COUNT(*) as count
       FROM lopez_media_ai_costs
       WHERE created_at >= ?
       GROUP BY operation_type
       ORDER BY total_cost DESC`,
      [startDate]
    );

    // Kosten-Trend (pro Tag/Stunde je nach Zeitraum)
    const interval = timeRange === "1h" || timeRange === "6h" ? "HOUR" : "DAY";
    const [trendRows] = await connection.execute(
      `SELECT 
         DATE_FORMAT(created_at, ?) as period,
         COALESCE(SUM(cost_usd), 0) as total_cost
       FROM lopez_media_ai_costs
       WHERE created_at >= ?
       GROUP BY period
       ORDER BY period ASC`,
      [
        timeRange === "1h" || timeRange === "6h" ? "%Y-%m-%d %H:00:00" : "%Y-%m-%d",
        startDate,
      ]
    );

    // Limits abrufen
    const [limitRows] = await connection.execute(
      `SELECT limit_type, limit_amount_usd, current_amount_usd
       FROM lopez_media_ai_limits
       WHERE is_active = 1`
    );

    const limits = Array.isArray(limitRows)
      ? limitRows.map((row: any) => ({
          type: row.limit_type,
          limit: parseFloat(row.limit_amount_usd || "0"),
          current: parseFloat(row.current_amount_usd || "0"),
        }))
      : [];

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        total_cost: totalCost,
        time_range: timeRange,
        providers: Array.isArray(providerRows)
          ? providerRows.map((row: any) => ({
              provider: row.provider,
              cost: parseFloat(row.total_cost || "0"),
              count: parseInt(row.count || "0"),
            }))
          : [],
        operations: Array.isArray(operationRows)
          ? operationRows.map((row: any) => ({
              operation: row.operation_type,
              cost: parseFloat(row.total_cost || "0"),
              count: parseInt(row.count || "0"),
            }))
          : [],
        trend: Array.isArray(trendRows)
          ? trendRows.map((row: any) => ({
              period: row.period,
              cost: parseFloat(row.total_cost || "0"),
            }))
          : [],
        limits,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der KI-Kosten:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Abrufen der KI-Kosten" },
      { status: 500 }
    );
  }
}




