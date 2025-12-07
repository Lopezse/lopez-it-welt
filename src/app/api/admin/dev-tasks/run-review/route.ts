// =====================================================
// AGENT-C REVIEW API – Enterprise++ Dev-Orchestrator
// =====================================================
// Route: /api/admin/dev-tasks/run-review
// Erstellt: 2025-12-04
// Zweck: Startet Agent-C Code-Review und Quality Gate
// =====================================================
//
// SICHERHEITSHINWEISE:
// - Arbeitet NUR mit lopez_it_welt_dev
// - KEINE destruktiven Operationen
// - KEINE init/reset Funktionen
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AgentCReviewer } from "@/lib/dev-orchestrator/agent-c-reviewer";
import { AgentBBuilder } from "@/lib/dev-orchestrator/agent-b-builder";
import { DevTasksService } from "@/lib/dev-tasks-service";

// =====================================================
// GET – Review-Status prüfen
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

    // Code-Changes laden
    let codeChanges: any[] = [];
    try {
      codeChanges = await AgentBBuilder.getCodeChangesForTask(taskIdNum);
    } catch (e) {
      console.warn("[Agent-C API] Code-Changes konnten nicht geladen werden:", e);
    }

    // Reviews laden
    let reviews: any[] = [];
    try {
      reviews = await AgentCReviewer.getReviewsForTask(taskIdNum);
    } catch (e) {
      console.warn("[Agent-C API] Reviews konnten nicht geladen werden:", e);
    }

    // Status prüfen
    const canRunReview = task.status === "coding" && codeChanges.length > 0;
    const reviewComplete = reviews.length > 0 && (task.status === "review" || task.status === "done");

    // Scores berechnen
    let overallScore = 0;
    if (reviews.length > 0) {
      overallScore = Math.round(
        reviews.reduce((sum: number, r: any) => sum + (r.quality_score || 0), 0) / reviews.length
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        task: {
          id: task.id,
          title: task.title,
          status: task.status,
          type: task.type
        },
        code_changes: codeChanges.map((c: any) => ({
          id: c.id,
          file_path: c.file_path,
          code_type: c.code_type,
          status: c.status
        })),
        reviews: reviews.map((r: any) => ({
          id: r.id,
          change_id: r.change_id,
          review_status: r.review_status,
          quality_score: r.quality_score,
          feedback: r.feedback
        })),
        review_status: {
          can_run: canRunReview,
          is_complete: reviewComplete,
          reviews_count: reviews.length,
          overall_score: overallScore,
          quality_gate_passed: overallScore >= 70 && task.status === "done",
          message: canRunReview 
            ? "Task ist bereit für Agent-C Review"
            : reviewComplete 
              ? `Review abgeschlossen: Score ${overallScore}/100`
              : `Task-Status ist '${task.status}', Review erfordert 'coding' mit Code-Changes`
        }
      }
    });

  } catch (error) {
    console.error("[Agent-C API] GET Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// POST – Agent-C Review starten
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

    if (task.status !== "coding") {
      return NextResponse.json(
        { 
          success: false, 
          error: `Task hat Status '${task.status}', Review erfordert 'coding'`,
          hint: "Führe zuerst Agent-B Build aus"
        },
        { status: 400 }
      );
    }

    // Code-Changes prüfen
    const codeChanges = await AgentBBuilder.getCodeChangesForTask(taskIdNum);
    if (codeChanges.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Keine Code-Changes zum Review vorhanden",
          hint: "Führe zuerst Agent-B Build aus"
        },
        { status: 400 }
      );
    }

    // Agent-C Review ausführen
    console.log(`[Agent-C API] Starte Review für Task ${taskIdNum}...`);
    const reviewResult = await AgentCReviewer.runReview(taskIdNum);

    return NextResponse.json({
      success: true,
      message: reviewResult.quality_gate_passed 
        ? `✅ Quality Gate BESTANDEN – Task abgeschlossen!`
        : `⚠️ Quality Gate nicht bestanden – Score: ${reviewResult.overall_score}/100`,
      data: {
        task_id: reviewResult.task_id,
        overall_status: reviewResult.overall_status,
        overall_score: reviewResult.overall_score,
        quality_gate_passed: reviewResult.quality_gate_passed,
        reviews: reviewResult.reviews.map((r: any) => ({
          id: r.id,
          change_id: r.change_id,
          review_status: r.review_status,
          quality_score: r.quality_score,
          feedback: r.feedback
        })),
        summary: reviewResult.summary
      }
    });

  } catch (error: any) {
    console.error("[Agent-C API] POST Fehler:", error);
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









