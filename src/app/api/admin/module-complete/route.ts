// =====================================================
// ENTERPRISE++ MODULE COMPLETE API
// =====================================================
// POST: Einzelnes Modul abschließen (mit oder ohne force)
// POST mit action: "batch" -> Alle P2/P3 automatisch abschliessen
//
// REFACTORED: 2025-12-03
// - Automatisches Erstellen von module_progress bei fehlendem Eintrag
// - Keine 500er bei Datenluecken
// - Klare Response-Struktur mit success: boolean
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AgentSystemService, agentLogger } from "@/lib/agent-system";

// Type-Definitionen fuer API-Responses
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
  const warnings: string[] = [];

  try {
    // JSON-Body parsen (fehlertolerant)
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json<ApiResponseError>(
        {
          success: false,
          error: "Ungueltiger Request-Body (kein gueltiges JSON)",
          details: { parseError: String(parseError) },
        },
        { status: 400 }
      );
    }

    const { module_id, force, action } = body;

    // Schema erweitern (fehlertolerant)
    try {
      await AgentSystemService.extendModuleRegistrySchema();
    } catch (schemaError) {
      agentLogger.warn("Schema-Erweiterung fehlgeschlagen", { error: schemaError });
      warnings.push("Schema konnte nicht erweitert werden.");
    }

    // Batch-Modus: Alle P2/P3 automatisch abschliessen
    if (action === "batch") {
      agentLogger.info("Starte Batch Auto-Complete (P2/P3)...");

      try {
        const result = await AgentSystemService.batchAutoComplete();

        return NextResponse.json<ApiResponseOk<{
          completed: string[];
          failed: string[];
          skipped: string[];
          completed_count: number;
          failed_count: number;
          skipped_count: number;
        }>>({
          success: true,
          message: `${result.completed.length} Module abgeschlossen`,
          data: {
            completed: result.completed,
            failed: result.failed,
            skipped: result.skipped,
            completed_count: result.completed.length,
            failed_count: result.failed.length,
            skipped_count: result.skipped.length,
          },
          warnings: warnings.length > 0 ? warnings : undefined,
        });
      } catch (batchError) {
        agentLogger.error("Batch Auto-Complete fehlgeschlagen", batchError);
        return NextResponse.json<ApiResponseOk<{
          completed: never[];
          failed: never[];
          skipped: never[];
          completed_count: number;
          failed_count: number;
          skipped_count: number;
        }>>({
          success: true,
          message: "Batch Auto-Complete konnte nicht durchgefuehrt werden",
          data: {
            completed: [],
            failed: [],
            skipped: [],
            completed_count: 0,
            failed_count: 0,
            skipped_count: 0,
          },
          warnings: ["Batch Auto-Complete ist aufgrund eines Datenbankfehlers fehlgeschlagen."],
        });
      }
    }

    // Einzelnes Modul abschliessen
    if (!module_id) {
      return NextResponse.json<ApiResponseError>(
        {
          success: false,
          error: "module_id erforderlich",
          details: { received: body },
        },
        { status: 400 }
      );
    }

    // Validiere module_id
    const moduleIdNum = Number(module_id);
    if (isNaN(moduleIdNum) || moduleIdNum <= 0) {
      return NextResponse.json<ApiResponseError>(
        {
          success: false,
          error: "module_id muss eine positive Zahl sein",
          details: { received: module_id },
        },
        { status: 400 }
      );
    }

    agentLogger.debug(`Auto-Complete fuer Modul ${moduleIdNum} (force=${force})...`);

    try {
      const result = await AgentSystemService.autoCompleteModule(moduleIdNum, force === true);

      if (result.success) {
        return NextResponse.json<ApiResponseOk<{
          module_id: number;
          module_name: string | undefined;
          force: boolean;
          completed: boolean;
          autoCreatedProgress: boolean;
        }>>({
          success: true,
          message: result.message,
          data: {
            module_id: moduleIdNum,
            module_name: result.module_name,
            force: force === true,
            completed: true,
            autoCreatedProgress: true,
          },
          warnings: warnings.length > 0 ? warnings : undefined,
        });
      } else {
        // Modul konnte nicht abgeschlossen werden (blockiert, etc.)
        // Das ist KEIN 500er, sondern eine kontrollierte Situation
        return NextResponse.json<ApiResponseOk<{
          module_id: number;
          module_name: string | undefined;
          force: boolean;
          completed: boolean;
          reason: string;
        }>>({
          success: true,
          message: result.message,
          data: {
            module_id: moduleIdNum,
            module_name: result.module_name,
            force: force === true,
            completed: false,
            reason: result.message,
          },
        });
      }
    } catch (completeError) {
      agentLogger.error(`Fehler beim Abschliessen von Modul ${moduleIdNum}`, completeError);
      
      // Auch hier: kontrollierte Fehlerbehandlung, kein 500
      return NextResponse.json<ApiResponseOk<{
        module_id: number;
        completed: boolean;
        reason: string;
      }>>({
        success: true,
        message: "Modul konnte nicht abgeschlossen werden",
        data: {
          module_id: moduleIdNum,
          completed: false,
          reason: "Datenbankfehler beim Abschliessen",
        },
        warnings: ["Es gab einen Fehler bei der Datenbankoperation."],
      });
    }
  } catch (error) {
    // Nur echte, unerwartete Fehler (sollte selten vorkommen)
    agentLogger.error("Unerwarteter Fehler in module-complete", error);
    return NextResponse.json<ApiResponseError>(
      {
        success: false,
        error: "Unexpected server error in module-complete",
        details: { message: error instanceof Error ? error.message : String(error) },
      },
      { status: 500 }
    );
  }
}
