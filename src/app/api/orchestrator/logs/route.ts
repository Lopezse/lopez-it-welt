/**
 * Orchestrator Logs API - Enterprise++ Standard P8-E
 * 
 * GET /api/orchestrator/logs - Liste aller Logs mit Suche & Filter
 * POST /api/orchestrator/logs - Neuen Log erstellen (nur System)
 * 
 * RBAC: logs.view (GET), system.* (POST)
 */

import { NextRequest, NextResponse } from "next/server";
import { logStorage } from "@/lib/ki-orchestrator/level2/logs/storage/LogStorage";
import { searchEngine } from "@/lib/ki-orchestrator/level2/logs/storage/SearchEngine";
import { logPipeline } from "@/lib/ki-orchestrator/level2/logs/pipeline/LogPipeline";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import { ApprovalManager } from "@/lib/ki-orchestrator/level2/ApprovalManager";
import { getLogRule } from "@/lib/ki-orchestrator/level2/logs/LogRuleRegistry";
import type { RawLog, SearchQuery } from "@/lib/ki-orchestrator/level2/logs/types";

/**
 * GET /api/orchestrator/logs
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

    // Filter aus Query-Parametern
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const logLevel = searchParams.get("log_level");
    const severity = searchParams.get("severity");
    const logRuleId = searchParams.get("log_rule_id");
    const startTime = searchParams.get("start_time");
    const endTime = searchParams.get("end_time");
    const correlationId = searchParams.get("correlation_id");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sort = searchParams.get("sort") || "timestamp DESC";

    // Erstelle SearchQuery
    const searchQuery: SearchQuery = {
      q: q || undefined,
      category: category as any,
      log_level: logLevel as any,
      severity: severity as any,
      log_rule_id: logRuleId || undefined,
      start_time: startTime ? new Date(startTime) : undefined,
      end_time: endTime ? new Date(endTime) : undefined,
      correlation_id: correlationId || undefined,
      limit: Math.min(limit, 1000),
      offset,
      sort_by: sort.split(" ")[0] as any,
      sort_order: sort.toUpperCase().includes("DESC") ? "DESC" : "ASC",
    };

    // Suche Logs
    let logs;
    if (q) {
      // Volltext-Suche
      logs = await searchEngine.searchLogs(searchQuery);
    } else {
      // Normale Suche
      logs = await logStorage.getLogs(searchQuery);
    }

    // Gesamtanzahl (vereinfacht, in Produktion sollte man COUNT(*) verwenden)
    const total = logs.length;

    return NextResponse.json({
      success: true,
      data: {
        logs,
        total,
        limit: searchQuery.limit,
        offset: searchQuery.offset,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der Logs", error);
    return NextResponse.json(
      { success: false, error: "Interner Serverfehler", error_code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orchestrator/logs
 * Nur für System-Interne Verwendung
 */
export async function POST(request: NextRequest) {
  try {
    // System-Interne Authentifizierung prüfen
    const systemToken = request.headers.get("x-system-token");
    if (systemToken !== process.env.SYSTEM_INTERNAL_TOKEN) {
      return NextResponse.json(
        { success: false, error: "Nur für System-Interne Verwendung", error_code: "FORBIDDEN" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validierung
    if (!body.log_rule_id || !body.log_level || !body.category || !body.severity || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: "log_rule_id, log_level, category, severity und message sind erforderlich",
          error_code: "BAD_REQUEST",
        },
        { status: 400 }
      );
    }

    // Prüfe Log-Regel
    const logRule = getLogRule(body.log_rule_id);
    if (!logRule) {
      return NextResponse.json(
        { success: false, error: `Unbekannte Log-Regel: ${body.log_rule_id}`, error_code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    // DSFA-Check: Bei High/Critical-Risk-Logs prüfe P7-Approval
    if (logRule.dsfa_relevance === "High" || body.severity === "critical") {
      const approvalManager = new ApprovalManager();
      const approval = await approvalManager.checkApprovalStatus(logRule.id);
      if (approval.approval_status !== "granted") {
        return NextResponse.json(
          {
            success: false,
            error: "DSFA-Freigabe erforderlich",
            error_code: "DSFA_APPROVAL_REQUIRED",
            details: { log_rule_id: logRule.id, dsfa_relevance: logRule.dsfa_relevance },
          },
          { status: 403 }
        );
      }
    }

    // Erstelle RawLog
    const rawLog: RawLog = {
      log_rule_id: body.log_rule_id,
      log_level: body.log_level,
      category: body.category,
      severity: body.severity,
      message: body.message,
      context: body.context || {},
      metadata: body.metadata || {},
      correlation_id: body.correlation_id,
      user_agent: body.user_agent,
      request_id: body.request_id,
      resource_type: body.resource_type,
      resource_id: body.resource_id,
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
      created_at: new Date(),
    };

    // Verarbeite Log durch Pipeline
    const log = await logPipeline.processLog(rawLog);

    return NextResponse.json({
      success: true,
      data: {
        id: log.id,
        log_rule_id: log.log_rule_id,
        timestamp: log.timestamp.toISOString(),
      },
    });
  } catch (error) {
    logger.error("Fehler beim Erstellen des Logs", error);
    return NextResponse.json(
      { success: false, error: "Interner Serverfehler", error_code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}





