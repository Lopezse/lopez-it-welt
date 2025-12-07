/**
 * Orchestrator Logs Analytics Anomalies API - Enterprise++ Standard P8-E
 * 
 * GET /api/orchestrator/logs/analytics/anomalies - Log-Anomalien abrufen
 * 
 * RBAC: logs.view
 */

import { NextRequest, NextResponse } from "next/server";
import { logStorage } from "@/lib/ki-orchestrator/level2/logs/storage/LogStorage";
import { anomalyDetector } from "@/lib/ki-orchestrator/level2/logs/analytics/AnomalyDetector";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import type { SearchQuery, LogCategory, LogSeverity } from "@/lib/ki-orchestrator/level2/logs/types";

/**
 * GET /api/orchestrator/logs/analytics/anomalies
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
      user_id: session.userId,
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
    const severity = searchParams.get("severity");

    // Erstelle SearchQuery für Logs
    const searchQuery: SearchQuery = {
      category: category as LogCategory,
      severity: severity as LogSeverity,
      start_time: startTime ? new Date(startTime) : undefined,
      end_time: endTime ? new Date(endTime) : undefined,
      limit: 10000, // Mehr Logs für Anomalie-Erkennung
    };

    // Logs abrufen
    const logs = await logStorage.getLogs(searchQuery);

    // Anomalie-Erkennung durchführen
    const anomalies = await anomalyDetector.detectAnomalies(logs);

    return NextResponse.json({
      success: true,
      data: {
        anomalies: anomalies.map((anomaly) => ({
          id: anomaly.id,
          anomaly_type: anomaly.anomaly_type,
          metric: anomaly.metric,
          value: anomaly.value,
          expected_value: anomaly.expected_value,
          z_score: anomaly.z_score,
          confidence: anomaly.confidence,
          category: anomaly.category,
          log_ids: anomaly.log_ids,
          timestamp: anomaly.timestamp.toISOString(),
        })),
        total: anomalies.length,
      },
    });
  } catch (error) {
    logger.error("Fehler bei Anomalie-Erkennung", error);
    return NextResponse.json(
      { success: false, error: "Interner Serverfehler", error_code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}





