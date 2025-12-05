// =====================================================
// DEV-TASKS API – Enterprise++ Dev-Orchestrator
// =====================================================
// Erstellt: 2025-12-04
// Route: /api/admin/dev-tasks
// Methoden: GET, POST
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { DevTasksService, DevTaskType, DevTaskStatus, DevTaskPriority } from "@/lib/dev-tasks-service";
import { AgentAPlanner } from "@/lib/dev-orchestrator/agent-a-planner";

// =====================================================
// TYPEN
// =====================================================

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// =====================================================
// GET – Tasks abrufen
// =====================================================

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const view = searchParams.get("view"); // "list" | "stats" | "detail"
    const taskId = searchParams.get("id");
    const status = searchParams.get("status") as DevTaskStatus | null;
    const type = searchParams.get("type") as DevTaskType | null;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Statistiken abrufen
    if (view === "stats") {
      const stats = await DevTasksService.getStatistics();
      return NextResponse.json({
        success: true,
        data: stats
      });
    }

    // Einzelnen Task mit Steps abrufen
    if (view === "detail" && taskId) {
      const task = await DevTasksService.getTaskById(parseInt(taskId));
      if (!task) {
        return NextResponse.json({
          success: false,
          error: "Task nicht gefunden"
        }, { status: 404 });
      }

      const steps = await DevTasksService.getStepsForTask(task.id);
      
      return NextResponse.json({
        success: true,
        data: {
          task,
          steps
        }
      });
    }

    // Task-Liste abrufen
    const { tasks, total } = await DevTasksService.getTasks({
      limit,
      offset,
      status: status || undefined,
      type: type || undefined
    });

    return NextResponse.json({
      success: true,
      data: {
        tasks,
        total,
        limit,
        offset,
        hasMore: offset + tasks.length < total
      }
    });

  } catch (error) {
    console.error("[DEV-TASKS API] GET Fehler:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Interner Serverfehler"
    }, { status: 500 });
  }
}

// =====================================================
// POST – Neuen Task erstellen + Agent-A Planung
// =====================================================

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    
    // Validierung
    if (!body.title || !body.description) {
      return NextResponse.json({
        success: false,
        error: "Titel und Beschreibung sind erforderlich"
      }, { status: 400 });
    }

    // Task-Typ validieren
    const validTypes: DevTaskType[] = ["bug", "feature", "refactor", "documentation", "security"];
    const taskType: DevTaskType = validTypes.includes(body.type) ? body.type : "feature";

    // Priorität validieren
    const validPriorities: DevTaskPriority[] = ["low", "medium", "high", "critical"];
    const taskPriority: DevTaskPriority = validPriorities.includes(body.priority) ? body.priority : "medium";

    // Task erstellen
    console.log("[DEV-TASKS API] Erstelle Task:", body.title);
    const task = await DevTasksService.createTask({
      title: body.title,
      description: body.description,
      type: taskType,
      priority: taskPriority,
      project_code: body.project_code || "LOPEZ-IT-WELT",
      created_by: body.created_by || "admin"
    });

    console.log("[DEV-TASKS API] Task erstellt:", task.id);

    // Agent-A Planung starten?
    let planResult = null;
    const startPlanning = body.start_planning !== false; // Default: true

    if (startPlanning) {
      console.log("[DEV-TASKS API] Starte Agent-A Planung...");
      
      // Prüfe ob AI Provider verfügbar ist
      const useMock = body.use_mock === true || process.env.AI_PROVIDER === "mock";
      
      if (useMock) {
        // Mock-Plan für Demo
        planResult = await AgentAPlanner.createMockPlan(task);
      } else {
        // Echte AI-Planung
        planResult = await AgentAPlanner.planTask(task);
      }
      
      console.log("[DEV-TASKS API] Planung abgeschlossen:", planResult.success);
    }

    // Aktualisierter Task mit Steps
    const updatedTask = await DevTasksService.getTaskById(task.id);
    const steps = await DevTasksService.getStepsForTask(task.id);

    return NextResponse.json({
      success: true,
      message: planResult?.success 
        ? `Task erstellt und ${steps.length} Plan-Schritte generiert`
        : "Task erstellt",
      data: {
        task: updatedTask,
        steps,
        plan_result: planResult
      }
    }, { status: 201 });

  } catch (error) {
    console.error("[DEV-TASKS API] POST Fehler:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Interner Serverfehler"
    }, { status: 500 });
  }
}



