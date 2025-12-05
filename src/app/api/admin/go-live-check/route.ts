// =====================================================
// ENTERPRISE++ GO-LIVE READINESS CHECK API
// =====================================================
// POST: Go-Live-Check ausführen
// GET: Risiko-Statistiken abrufen
// 
// REFACTORED: 2025-12-03
// - Fehlertoleranz bei fehlenden module_progress Einträgen
// - Keine 500er bei Datenlücken, nur bei echten System-Fehlern
// - Konsistente JSON-Responses mit success: boolean
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AgentSystemService } from "@/lib/agent-system";
import { agentLogger } from "@/lib/agent-system";

// Type-Definitionen für API-Responses
interface ApiResponseOk<T> {
  success: true;
  message?: string;
  data: T;
  warnings?: string[];
}

interface ApiResponseError {
  success: false;
  error: string;
  details?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action;

    // Risiko-Daten aktualisieren
    if (action === "update-risks") {
      try {
        const result = await AgentSystemService.seedRiskData();
        return NextResponse.json<ApiResponseOk<typeof result>>({
          success: true,
          message: "Risiko-Daten aktualisiert",
          data: result,
        });
      } catch (seedError) {
        agentLogger.error("Fehler beim Aktualisieren der Risiko-Daten", seedError);
        return NextResponse.json<ApiResponseOk<{ updated: number }>>({
          success: true,
          message: "Risiko-Daten konnten nicht vollständig aktualisiert werden",
          data: { updated: 0 },
          warnings: ["Einige Module konnten nicht aktualisiert werden. Bitte DB-Verbindung prüfen."],
        });
      }
    }

    // Go-Live-Check (Standard)
    agentLogger.debug("Starte Go-Live-Readiness-Check...");

    const warnings: string[] = [];

    // Zuerst Risiko-Daten aktualisieren (fehlertolerant)
    try {
      await AgentSystemService.seedRiskData();
    } catch (seedError) {
      agentLogger.warn("Risiko-Seed vor Go-Live-Check fehlgeschlagen, verwende bestehende Daten", { error: seedError });
      warnings.push("Risiko-Daten konnten nicht aktualisiert werden, bestehende Daten werden verwendet.");
    }

    // Go-Live-Check durchführen
    try {
      const result = await AgentSystemService.evaluateGoLiveReadiness();

      // Prüfe ob es Module ohne progress-Einträge gab
      if (result.blocking_count > 0) {
        const noProgressModules = result.blocking_modules.filter(m => m.progress_percent === 0);
        if (noProgressModules.length > 0) {
          warnings.push(`${noProgressModules.length} Module haben keinen Fortschrittseintrag und wurden als open/M0 gewertet.`);
        }
      }

      return NextResponse.json<ApiResponseOk<typeof result>>({
        success: true,
        message: result.go_live_ready ? "✅ Go-Live bereit!" : "⛔ Go-Live blockiert",
        data: result,
        warnings: warnings.length > 0 ? warnings : undefined,
      });
    } catch (evalError) {
      agentLogger.error("Fehler bei Go-Live-Evaluierung", evalError);
      
      // Rückgabe mit leeren, aber gültigen Daten
      return NextResponse.json<ApiResponseOk<{
        go_live_ready: boolean;
        required_modules_total: number;
        blocking_modules: [];
        blocking_count: number;
        summary: string;
        stats: Record<string, number>;
      }>>({
        success: true,
        message: "Go-Live-Check konnte nicht vollständig durchgeführt werden",
        data: {
          go_live_ready: false,
          required_modules_total: 0,
          blocking_modules: [],
          blocking_count: 0,
          summary: "Datenbankfehler - Go-Live-Check unvollständig",
          stats: { P0_total: 0, P0_ready: 0, P0_blocking: 0, P1_total: 0, P1_ready: 0, P1_blocking: 0 },
        },
        warnings: ["Go-Live-Check konnte aufgrund eines Datenbankfehlers nicht vollständig durchgeführt werden."],
      });
    }
  } catch (error) {
    // Nur echte, unerwartete Fehler (JSON-Parsing, etc.)
    agentLogger.error("Unerwarteter Fehler im Go-Live-Check", error);
    return NextResponse.json<ApiResponseError>(
      {
        success: false,
        error: "Unexpected server error in go-live-check",
        details: { message: error instanceof Error ? error.message : String(error) },
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const riskStats = await AgentSystemService.getRiskStatistics();

    return NextResponse.json<ApiResponseOk<typeof riskStats>>({
      success: true,
      data: riskStats,
    });
  } catch (error) {
    agentLogger.error("Fehler beim Abrufen der Risiko-Statistiken", error);
    
    // Rückgabe mit Default-Daten statt 500
    return NextResponse.json<ApiResponseOk<{
      total: number;
      byRisk: Record<string, number>;
      byPriority: Record<string, number>;
      byCategory: Record<string, unknown>;
      goLiveRequired: number;
      goLiveReady: number;
    }>>({
      success: true,
      data: {
        total: 0,
        byRisk: { critical: 0, high: 0, medium: 0, low: 0 },
        byPriority: { P0: 0, P1: 0, P2: 0, P3: 0 },
        byCategory: {},
        goLiveRequired: 0,
        goLiveReady: 0,
      },
      warnings: ["Risiko-Statistiken konnten nicht vollständig geladen werden."],
    });
  }
}
