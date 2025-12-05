/**
 * Orchestrator Logs Analytics Patterns API - Enterprise++ Standard P8-E
 * 
 * GET /api/orchestrator/logs/analytics/patterns - Log-Patterns abrufen
 * 
 * RBAC: logs.view
 */

import { NextRequest, NextResponse } from "next/server";
import { logStorage } from "@/lib/ki-orchestrator/level2/logs/storage/LogStorage";
import { patternDetector } from "@/lib/ki-orchestrator/level2/logs/analytics/PatternDetector";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { logger } from "@/lib/logger";
import type { SearchQuery, LogCategory } from "@/lib/ki-orchestrator/level2/logs/types";

/**
 * GET /api/orchestrator/logs/analytics/patterns
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
    const minFrequency = parseInt(searchParams.get("min_frequency") || "5");

    // Erstelle SearchQuery für Logs
    const searchQuery: SearchQuery = {
      category: category as LogCategory,
      start_time: startTime ? new Date(startTime) : undefined,
      end_time: endTime ? new Date(endTime) : undefined,
      limit: 10000, // Mehr Logs für Pattern-Detection
    };

    // Logs abrufen
    const logs = await logStorage.getLogs(searchQuery);

    // Pattern-Detection durchführen
    const patterns = await patternDetector.detectPatterns(logs);

    // Filter nach minFrequency
    const filteredPatterns = patterns.filter((pattern) => pattern.frequency >= minFrequency);

    return NextResponse.json({
      success: true,
      data: {
        patterns: filteredPatterns.map((pattern) => ({
          id: pattern.id,
          pattern_type: pattern.pattern_type,
          pattern: pattern.pattern,
          frequency: pattern.frequency,
          confidence: pattern.confidence,
          category: pattern.category,
          log_rule_ids: pattern.log_rule_ids,
          timestamp_start: pattern.timestamp_start.toISOString(),
          timestamp_end: pattern.timestamp_end.toISOString(),
        })),
        total: filteredPatterns.length,
      },
    });
  } catch (error) {
    logger.error("Fehler bei Pattern-Detection", error);
    return NextResponse.json(
      { success: false, error: "Interner Serverfehler", error_code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}





