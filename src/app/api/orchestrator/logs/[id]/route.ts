/**
 * Orchestrator Log Detail API - Enterprise++ Standard P8-E
 * 
 * GET /api/orchestrator/logs/[id] - Log-Detail abrufen
 * 
 * RBAC: logs.view
 */

import { NextRequest, NextResponse } from "next/server";
import { logStorage } from "@/lib/ki-orchestrator/level2/logs/storage/LogStorage";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import { getLogRule } from "@/lib/ki-orchestrator/level2/logs/LogRuleRegistry";

/**
 * GET /api/orchestrator/logs/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Log abrufen
    const log = await logStorage.getLog(params.id);

    if (!log) {
      return NextResponse.json(
        { success: false, error: "Log nicht gefunden", error_code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    // Log-Regel abrufen (für DSFA-Hinweise)
    const logRule = getLogRule(log.log_rule_id);
    const dsfaHint =
      logRule && (logRule.dsfa_relevance === "High" || log.severity === "critical")
        ? "High-Risk Log - DSFA Review empfohlen"
        : undefined;

    return NextResponse.json({
      success: true,
      data: {
        ...log,
        timestamp: log.timestamp.toISOString(),
        created_at: log.created_at?.toISOString(),
        dsfa_hint: dsfaHint,
      },
    });
  } catch (error) {
    logger.error(`Fehler beim Abrufen des Logs ${params.id}`, error);
    return NextResponse.json(
      { success: false, error: "Interner Serverfehler", error_code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}





