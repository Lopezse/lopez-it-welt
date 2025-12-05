// =====================================================
// AI CENTER - WORKFLOWS API
// =====================================================
// GET /api/admin/ai/workflows - Liste alle Workflows
// POST /api/admin/ai/workflows - Erstelle neuen Workflow
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { WorkflowEngine, WorkflowStatus } from "@/lib/ai-center/workflow-engine";

// =====================================================
// GET - Alle Workflows laden
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as WorkflowStatus | null;
    
    const workflows = await WorkflowEngine.listWorkflows(status || undefined);
    
    // Summary berechnen
    const summary = {
      total: workflows.length,
      active: workflows.filter(w => w.status === "active").length,
      paused: workflows.filter(w => w.status === "paused").length,
      disabled: workflows.filter(w => w.status === "disabled").length,
      total_runs: workflows.reduce((sum, w) => sum + w.run_count, 0)
    };
    
    return NextResponse.json({
      success: true,
      data: {
        workflows,
        summary
      }
    });
    
  } catch (error) {
    console.error("❌ Workflows List Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// POST - Neuen Workflow erstellen
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validierung
    if (!body.name || !body.trigger || !body.actions) {
      return NextResponse.json(
        { success: false, error: "name, trigger und actions sind erforderlich" },
        { status: 400 }
      );
    }
    
    const workflow = await WorkflowEngine.createWorkflow({
      name: body.name,
      description: body.description || "",
      trigger: body.trigger,
      actions: body.actions,
      status: body.status || "active"
    });
    
    return NextResponse.json({
      success: true,
      message: `Workflow "${workflow.name}" erstellt`,
      data: workflow
    });
    
  } catch (error) {
    console.error("❌ Workflow Create Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

