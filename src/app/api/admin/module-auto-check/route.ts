// =====================================================
// ENTERPRISE++ HYBRID AUTO-COMPLETE CHECK API
// =====================================================
// POST: Auto-Complete-Status aller Module prüfen
// GET: Schnelle Übersicht der Auto-Complete-fähigen Module
//
// REFACTORED: 2025-12-03
// - Fehlertoleranz bei fehlenden module_progress Einträgen
// - Module ohne progress werden als open/M0 behandelt
// - Keine 500er bei Datenlücken
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AgentSystemService, agentLogger } from "@/lib/agent-system";

// Type-Definitionen für API-Responses
interface ApiResponseOk<T> {
  success: true;
  message?: string;
  data: T;
  warnings?: string[];
  info?: string;
}

interface ApiResponseError {
  success: false;
  error: string;
  details?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  const warnings: string[] = [];

  try {
    agentLogger.debug("Starte Auto-Complete Check...");

    // Schema erweitern (fehlertolerant)
    try {
      await AgentSystemService.extendModuleRegistrySchema();
    } catch (schemaError) {
      agentLogger.warn("Schema-Erweiterung fehlgeschlagen, verwende bestehendes Schema", { error: schemaError });
      warnings.push("Schema konnte nicht erweitert werden, bestehende Struktur wird verwendet.");
    }

    // Risiko-Daten aktualisieren (fehlertolerant)
    try {
      await AgentSystemService.seedRiskData();
    } catch (seedError) {
      agentLogger.warn("Risiko-Seed fehlgeschlagen, verwende bestehende Risiko-Daten", { error: seedError });
      warnings.push("Risiko-Daten konnten nicht aktualisiert werden.");
    }

    // Auto-Complete-Status ermitteln
    try {
      const result = await AgentSystemService.getModulesEligibleForAutoComplete();

      // Prüfe auf Module ohne progress-Eintrag (die als blocked auftauchen mit M0)
      const noProgressModules = result.blocked.filter(
        m => m.progress_percent === 0 && m.block_reasons.some(r => r.includes("Maturity M0"))
      );
      
      if (noProgressModules.length > 0) {
        warnings.push(`${noProgressModules.length} Module haben keinen Fortschrittseintrag und wurden als open/M0 behandelt.`);
      }

      return NextResponse.json<ApiResponseOk<typeof result & { info?: string }>>({
        success: true,
        message: `${result.summary.auto_count} automatisch abschließbar, ${result.summary.approval_count} benötigen Freigabe, ${result.summary.blocked_count} blockiert`,
        data: {
          ...result,
          info: noProgressModules.length > 0 
            ? "Module ohne module_progress wurden als open/M0 behandelt."
            : undefined,
        },
        warnings: warnings.length > 0 ? warnings : undefined,
      });
    } catch (checkError) {
      agentLogger.error("Fehler beim Auto-Complete-Check", checkError);
      
      // Rückgabe mit leeren, aber gültigen Daten
      return NextResponse.json<ApiResponseOk<{
        auto: [];
        requires_approval: [];
        blocked: [];
        already_done: [];
        summary: { total: number; auto_count: number; approval_count: number; blocked_count: number; done_count: number };
      }>>({
        success: true,
        message: "Auto-Complete-Check konnte nicht vollständig durchgeführt werden",
        data: {
          auto: [],
          requires_approval: [],
          blocked: [],
          already_done: [],
          summary: {
            total: 0,
            auto_count: 0,
            approval_count: 0,
            blocked_count: 0,
            done_count: 0,
          },
        },
        warnings: ["Auto-Complete-Check konnte aufgrund eines Datenbankfehlers nicht durchgeführt werden."],
      });
    }
  } catch (error) {
    // Nur echte, unerwartete Fehler
    agentLogger.error("Unerwarteter Fehler im Auto-Complete-Check", error);
    return NextResponse.json<ApiResponseError>(
      {
        success: false,
        error: "Unexpected server error in module-auto-check",
        details: { message: error instanceof Error ? error.message : String(error) },
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Schema erweitern (fehlertolerant, keine Exception werfen)
    try {
      await AgentSystemService.extendModuleRegistrySchema();
    } catch {
      agentLogger.debug("Schema-Erweiterung in GET übersprungen");
    }

    const result = await AgentSystemService.getModulesEligibleForAutoComplete();

    return NextResponse.json<ApiResponseOk<{
      auto_count: number;
      approval_count: number;
      blocked_count: number;
      done_count: number;
      total: number;
    }>>({
      success: true,
      data: {
        auto_count: result.summary.auto_count,
        approval_count: result.summary.approval_count,
        blocked_count: result.summary.blocked_count,
        done_count: result.summary.done_count,
        total: result.summary.total,
      },
    });
  } catch (error) {
    agentLogger.error("Fehler beim Abrufen der Auto-Complete-Übersicht", error);
    
    // Rückgabe mit Default-Daten statt 500
    return NextResponse.json<ApiResponseOk<{
      auto_count: number;
      approval_count: number;
      blocked_count: number;
      done_count: number;
      total: number;
    }>>({
      success: true,
      data: {
        auto_count: 0,
        approval_count: 0,
        blocked_count: 0,
        done_count: 0,
        total: 0,
      },
      warnings: ["Auto-Complete-Daten konnten nicht vollständig geladen werden."],
    });
  }
}
