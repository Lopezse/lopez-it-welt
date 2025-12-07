// =====================================================
// AGENT-B BUILD API – Enterprise++ Dev-Orchestrator
// =====================================================
// Route: /api/admin/dev-tasks/run-build
// Erstellt: 2025-12-04
// Zweck: Startet Agent-B Code-Generierung
// =====================================================
//
// SICHERHEITSHINWEISE:
// - Arbeitet NUR mit lopez_it_welt_dev
// - KEINE destruktiven Operationen
// - KEINE init/reset Funktionen
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AgentBBuilder } from "@/lib/dev-orchestrator/agent-b-builder";
import { DevTasksService } from "@/lib/dev-tasks-service";

// =====================================================
// GET – Build-Status prüfen
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: "taskId Parameter fehlt" },
        { status: 400 }
      );
    }

    const taskIdNum = parseInt(taskId, 10);
    if (isNaN(taskIdNum)) {
      return NextResponse.json(
        { success: false, error: "taskId muss eine Zahl sein" },
        { status: 400 }
      );
    }

    // Task laden
    const task = await DevTasksService.getTaskById(taskIdNum);
    if (!task) {
      return NextResponse.json(
        { success: false, error: `Task ${taskId} nicht gefunden` },
        { status: 404 }
      );
    }

    // Steps laden
    const steps = await DevTasksService.getStepsForTask(taskIdNum);

    // Code-Changes laden (falls vorhanden)
    let codeChanges: any[] = [];
    try {
      codeChanges = await AgentBBuilder.getCodeChangesForTask(taskIdNum);
    } catch (e) {
      // Tabelle existiert möglicherweise noch nicht
      console.warn("[Agent-B API] Code-Changes konnten nicht geladen werden:", e);
    }

    // Status prüfen - "planned" oder "open" sind erlaubt
    const canRunBuild = ["planned", "open"].includes(task.status);
    const buildComplete = codeChanges.length > 0 && task.status === "coding";

    return NextResponse.json({
      success: true,
      data: {
        task: {
          id: task.id,
          title: task.title,
          status: task.status,
          type: task.type
        },
        steps: steps.map(s => ({
          id: s.id,
          step_number: s.step_number,
          title: s.title,
          status: s.status
        })),
        code_changes: codeChanges,
        build_status: {
          can_run: canRunBuild,
          is_complete: buildComplete,
          changes_count: codeChanges.length,
          message: canRunBuild 
            ? "Task ist bereit für Agent-B Build"
            : buildComplete 
              ? `Build abgeschlossen: ${codeChanges.length} Code-Änderungen`
              : `Task-Status ist '${task.status}', Build erfordert 'planned'`
        }
      }
    });

  } catch (error) {
    console.error("[Agent-B API] GET Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// POST – Agent-B Build starten
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, use_mock } = body;

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: "taskId fehlt im Request-Body" },
        { status: 400 }
      );
    }

    const taskIdNum = parseInt(taskId, 10);
    if (isNaN(taskIdNum)) {
      return NextResponse.json(
        { success: false, error: "taskId muss eine Zahl sein" },
        { status: 400 }
      );
    }

    // Task prüfen
    const task = await DevTasksService.getTaskById(taskIdNum);
    if (!task) {
      return NextResponse.json(
        { success: false, error: `Task ${taskId} nicht gefunden` },
        { status: 404 }
      );
    }

    // Erlaubte Status für Agent-B: "planned" oder "open" (nach Recheck)
    const allowedStatuses = ["planned", "open"];
    if (!allowedStatuses.includes(task.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Task hat Status '${task.status}', Build erfordert 'planned' oder 'open'`,
          hint: "Führe zuerst Agent-A Planung aus oder öffne den Task wieder"
        },
        { status: 400 }
      );
    }

    // Agent-B Build ausführen
    console.log(`[Agent-B API] Starte Build für Task ${taskIdNum}...`);
    const buildResult = await AgentBBuilder.runBuild(taskIdNum);

    return NextResponse.json({
      success: true,
      message: `Agent-B Build abgeschlossen: ${buildResult.changes.length} Code-Änderungen generiert`,
      data: {
        task_id: buildResult.task_id,
        changes_count: buildResult.changes.length,
        changes: buildResult.changes.map(c => ({
          id: c.id,
          file_path: c.file_path,
          code_type: c.code_type,
          status: c.status,
          explanation: c.explanation
        })),
        summary: buildResult.summary,
        warnings: buildResult.warnings
      }
    });

  } catch (error: any) {
    console.error("[Agent-B API] POST Fehler:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Interner Serverfehler",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}







