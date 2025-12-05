// =====================================================
// ENTERPRISE++ AGENT-SYSTEM API
// =====================================================
// GET: Module, Tasks, Statistiken abrufen
// POST: Tabellen initialisieren, Tasks erstellen
// PATCH: Module/Tasks aktualisieren
//
// REFACTORED: 2025-12-03
// - Fehlertoleranz bei DB-Problemen
// - Keine 500er bei Datenluecken
// - Konsistente JSON-Responses
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AgentSystemService, AgentType, IstStatus, TaskStatus, Priority, agentLogger } from "@/lib/agent-system";

// Type-Definitionen fuer API-Responses
interface ApiResponseOk<T> {
  success: true;
  message?: string;
  data: T;
  count?: number;
  warnings?: string[];
}

interface ApiResponseError {
  success: false;
  error: string;
  details?: Record<string, unknown>;
}

export async function GET(request: NextRequest) {
  const warnings: string[] = [];

  try {
    const searchParams = request.nextUrl.searchParams;
    const view = searchParams.get("view"); // "modules" | "tasks" | "statistics"
    const agent = searchParams.get("agent") as AgentType | null;

    // Statistiken abrufen
    if (view === "statistics") {
      try {
        const statistics = await AgentSystemService.getStatistics();
        return NextResponse.json<ApiResponseOk<typeof statistics>>({
          success: true,
          data: statistics,
        });
      } catch (statsError) {
        agentLogger.warn("Statistiken konnten nicht geladen werden", { error: statsError });
        return NextResponse.json<ApiResponseOk<{
          totalModules: number;
          modulesByStatus: Record<string, number>;
          modulesByPriority: Record<string, number>;
          overallProgress: number;
          tasksByAgent: Record<string, { total: number; open: number; done: number }>;
          tasksByStatus: Record<string, number>;
        }>>({
          success: true,
          data: {
            totalModules: 0,
            modulesByStatus: { open: 0, in_progress: 0, done: 0 },
            modulesByPriority: { high: 0, medium: 0, low: 0 },
            overallProgress: 0,
            tasksByAgent: {
              plan: { total: 0, open: 0, done: 0 },
              build: { total: 0, open: 0, done: 0 },
              run: { total: 0, open: 0, done: 0 },
            },
            tasksByStatus: { open: 0, in_progress: 0, done: 0 },
          },
          warnings: ["Statistiken konnten nicht geladen werden."],
        });
      }
    }

    // Tasks abrufen
    if (view === "tasks") {
      try {
        const tasks = await AgentSystemService.getAgentTasks(agent || undefined);
        return NextResponse.json<ApiResponseOk<typeof tasks>>({
          success: true,
          data: tasks,
          count: tasks.length,
        });
      } catch (tasksError) {
        agentLogger.warn("Tasks konnten nicht geladen werden", { error: tasksError });
        return NextResponse.json<ApiResponseOk<never[]>>({
          success: true,
          data: [],
          count: 0,
          warnings: ["Tasks konnten nicht geladen werden."],
        });
      }
    }

    // Module mit Fortschritt (Standard)
    try {
      const modules = await AgentSystemService.getModulesWithProgress();
      return NextResponse.json<ApiResponseOk<typeof modules>>({
        success: true,
        data: modules,
        count: modules.length,
      });
    } catch (modulesError) {
      agentLogger.warn("Module konnten nicht geladen werden", { error: modulesError });
      return NextResponse.json<ApiResponseOk<never[]>>({
        success: true,
        data: [],
        count: 0,
        warnings: ["Module konnten nicht geladen werden. Bitte 'SOLL+IST'-Button nutzen um die Datenbank zu initialisieren."],
      });
    }
  } catch (error) {
    // Nur echte, unerwartete Fehler
    agentLogger.error("Unerwarteter Fehler im Agent-System GET", error);
    return NextResponse.json<ApiResponseError>(
      {
        success: false,
        error: "Unexpected server error in agent-system",
        details: { message: error instanceof Error ? error.message : String(error) },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json<ApiResponseError>(
        {
          success: false,
          error: "Ungueltiger Request-Body (kein gueltiges JSON)",
        },
        { status: 400 }
      );
    }

    const action = body.action;

    // Tabellen initialisieren + SOLL-Module seeden
    if (action === "init") {
      try {
        const result = await AgentSystemService.initializeTables();
        return NextResponse.json<ApiResponseOk<typeof result>>({
          success: true,
          message: "Agent-System Tabellen initialisiert",
          data: result,
        });
      } catch (initError) {
        agentLogger.error("Tabellen-Initialisierung fehlgeschlagen", initError);
        return NextResponse.json<ApiResponseOk<{ initialized: boolean }>>({
          success: true,
          message: "Initialisierung teilweise fehlgeschlagen",
          data: { initialized: false },
          warnings: ["Tabellen konnten nicht vollstaendig initialisiert werden."],
        });
      }
    }

    // IST-Fortschritte seeden
    if (action === "seed-progress") {
      try {
        const result = await AgentSystemService.seedModuleProgress();
        return NextResponse.json<ApiResponseOk<typeof result>>({
          success: true,
          message: "IST-Fortschritte gesetzt",
          data: result,
        });
      } catch (seedError) {
        agentLogger.error("IST-Seeding fehlgeschlagen", seedError);
        return NextResponse.json<ApiResponseOk<{ seeded: boolean }>>({
          success: true,
          message: "IST-Fortschritte konnten nicht gesetzt werden",
          data: { seeded: false },
          warnings: ["Fortschritte konnten nicht gesetzt werden."],
        });
      }
    }

    // Komplett-Init: Tabellen + SOLL + IST
    if (action === "full-init") {
      const warnings: string[] = [];
      let initResult: any = null;
      let progressResult: any = null;

      try {
        initResult = await AgentSystemService.initializeTables();
      } catch (initError) {
        agentLogger.error("Tabellen-Init in full-init fehlgeschlagen", initError);
        warnings.push("Tabellen-Initialisierung fehlgeschlagen.");
      }

      try {
        progressResult = await AgentSystemService.seedModuleProgress();
      } catch (progressError) {
        agentLogger.error("Progress-Seed in full-init fehlgeschlagen", progressError);
        warnings.push("Fortschritts-Seeding fehlgeschlagen.");
      }

      return NextResponse.json<ApiResponseOk<{
        tables: any;
        progress: any;
      }>>({
        success: true,
        message: warnings.length > 0 
          ? "Initialisierung teilweise abgeschlossen" 
          : "Vollstaendige Initialisierung abgeschlossen",
        data: {
          tables: initResult,
          progress: progressResult,
        },
        warnings: warnings.length > 0 ? warnings : undefined,
      });
    }

    // Neue Task erstellen
    if (action === "create-task") {
      try {
        const taskId = await AgentSystemService.createTask({
          title: String(body.title || "Neue Task"),
          description: String(body.description || ""),
          assigned_agent: (body.assigned_agent as AgentType) || "plan",
          status: (body.status as TaskStatus) || "open",
          related_module_id: body.related_module_id ? Number(body.related_module_id) : null,
          priority: (body.priority as Priority) || "medium",
        });

        return NextResponse.json<ApiResponseOk<{ taskId: number }>>({
          success: true,
          message: "Task erstellt",
          data: { taskId },
        });
      } catch (taskError) {
        agentLogger.error("Task-Erstellung fehlgeschlagen", taskError);
        return NextResponse.json<ApiResponseOk<{ taskId: null }>>({
          success: true,
          message: "Task konnte nicht erstellt werden",
          data: { taskId: null },
          warnings: ["Task-Erstellung fehlgeschlagen."],
        });
      }
    }

    return NextResponse.json<ApiResponseError>(
      { success: false, error: "Ungueltige Aktion" },
      { status: 400 }
    );
  } catch (error) {
    agentLogger.error("Unerwarteter Fehler im Agent-System POST", error);
    return NextResponse.json<ApiResponseError>(
      {
        success: false,
        error: "Unexpected server error in agent-system",
        details: { message: error instanceof Error ? error.message : String(error) },
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json<ApiResponseError>(
        {
          success: false,
          error: "Ungueltiger Request-Body (kein gueltiges JSON)",
        },
        { status: 400 }
      );
    }

    const target = body.target; // "module" | "task"

    // Modul-Fortschritt aktualisieren
    if (target === "module") {
      try {
        const success = await AgentSystemService.updateModuleProgress(Number(body.module_id), {
          ist_status: body.ist_status as IstStatus,
          progress_percent: body.progress_percent ? Number(body.progress_percent) : undefined,
          comment: body.comment ? String(body.comment) : undefined,
          responsible_agent: body.responsible_agent as AgentType,
        });

        return NextResponse.json<ApiResponseOk<{ updated: boolean }>>({
          success: true,
          message: success ? "Modul aktualisiert" : "Modul nicht gefunden",
          data: { updated: success },
        });
      } catch (updateError) {
        agentLogger.error("Modul-Update fehlgeschlagen", updateError);
        return NextResponse.json<ApiResponseOk<{ updated: boolean }>>({
          success: true,
          message: "Modul konnte nicht aktualisiert werden",
          data: { updated: false },
          warnings: ["Modul-Update fehlgeschlagen."],
        });
      }
    }

    // Task aktualisieren
    if (target === "task") {
      try {
        const success = await AgentSystemService.updateTask(Number(body.task_id), {
          title: body.title ? String(body.title) : undefined,
          description: body.description ? String(body.description) : undefined,
          assigned_agent: body.assigned_agent as AgentType,
          status: body.status as TaskStatus,
          priority: body.priority as Priority,
        });

        return NextResponse.json<ApiResponseOk<{ updated: boolean }>>({
          success: true,
          message: success ? "Task aktualisiert" : "Task nicht gefunden",
          data: { updated: success },
        });
      } catch (updateError) {
        agentLogger.error("Task-Update fehlgeschlagen", updateError);
        return NextResponse.json<ApiResponseOk<{ updated: boolean }>>({
          success: true,
          message: "Task konnte nicht aktualisiert werden",
          data: { updated: false },
          warnings: ["Task-Update fehlgeschlagen."],
        });
      }
    }

    return NextResponse.json<ApiResponseError>(
      { success: false, error: "Ungueltiges Ziel (target: 'module' oder 'task')" },
      { status: 400 }
    );
  } catch (error) {
    agentLogger.error("Unerwarteter Fehler im Agent-System PATCH", error);
    return NextResponse.json<ApiResponseError>(
      {
        success: false,
        error: "Unexpected server error in agent-system",
        details: { message: error instanceof Error ? error.message : String(error) },
      },
      { status: 500 }
    );
  }
}
