/**
 * UOC Root-Cause Analysis API - Enterprise++ Standard P9
 * 
 * GET /api/orchestrator/uoc/root-cause/[incidentId] - Root-Cause-Analysis abrufen
 * 
 * RBAC: security.view ODER monitoring.view ODER logs.view
 */

import { NextRequest, NextResponse } from "next/server";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { rootCauseAnalyzer } from "@/lib/ki-orchestrator/level2/uoc/RootCauseAnalyzer";

/**
 * GET /api/orchestrator/uoc/root-cause/[incidentId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { incidentId: string } }
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

    // RBAC-Prüfung (mindestens eine Berechtigung erforderlich)
    const hasSecurity = await RBACService.checkPermission({
      user_id: session.userId,
      resource: "security",
      action: "view",
    });
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

    if (!hasSecurity && !hasMonitoring && !hasLogs) {
      return NextResponse.json(
        {
          success: false,
          error: "Keine Berechtigung (security.view, monitoring.view oder logs.view erforderlich)",
          error_code: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    // incidentId aus params extrahieren
    const incidentId = params.incidentId;

    if (!incidentId) {
      return NextResponse.json(
        {
          success: false,
          error: "incidentId fehlt",
          error_code: "BAD_REQUEST",
        },
        { status: 400 }
      );
    }

    // Root-Cause-Analyse durchführen
    const rootCauseAnalysis = await rootCauseAnalyzer.identifyRootCause(incidentId);

    // Response formatieren
    return NextResponse.json({
      success: true,
      data: {
        incident_id: incidentId,
        root_cause: {
          event_id: rootCauseAnalysis.rootCause.id,
          event_type: rootCauseAnalysis.rootCause.type,
          log_rule_id:
            rootCauseAnalysis.rootCause.type === "log"
              ? (rootCauseAnalysis.rootCause.data as any).log_rule_id
              : undefined,
          timestamp: rootCauseAnalysis.rootCause.timestamp.toISOString(),
          message: rootCauseAnalysis.timeline.events.find(
            (e) => e.id === rootCauseAnalysis.rootCause.id
          )?.message || "Root-Cause identifiziert",
        },
        impact: {
          score:
            (rootCauseAnalysis.impact.userImpact + rootCauseAnalysis.impact.businessImpact) / 2,
          affected_components: rootCauseAnalysis.impact.affectedServices,
          affected_metrics: rootCauseAnalysis.impact.affectedResources.filter((r) =>
            r.includes("metric")
          ),
          affected_alerts: rootCauseAnalysis.impact.affectedResources.filter((r) =>
            r.includes("alert")
          ),
        },
        timeline: rootCauseAnalysis.timeline.events,
        solutions: rootCauseAnalysis.solutions,
        causal_relationships: rootCauseAnalysis.causalRelationships,
      },
    });
  } catch (error) {
    logger.error("UOC Root-Cause Analysis API failed", { error, incidentId: params.incidentId });
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




