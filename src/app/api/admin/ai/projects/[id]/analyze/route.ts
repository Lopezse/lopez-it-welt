// =====================================================
// ENTERPRISE++ AI PROJECT INSIGHTS API
// =====================================================
// POST /api/admin/ai/projects/[id]/analyze - Generiert Projektanalyse
// GET /api/admin/ai/projects/[id]/analyze - Lädt vorhandene Analysen
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AIInsightsService } from "@/lib/ai/ai-insights-service";

// GET - Vorhandene Insights laden
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Projekt-ID" },
        { status: 400 }
      );
    }
    
    const result = await AIInsightsService.getProjectInsights(projectId);
    
    return NextResponse.json({
      success: true,
      data: result.insights,
    });
    
  } catch (error) {
    console.error("AI Project Insights GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Analyse" },
      { status: 500 }
    );
  }
}

// POST - Neue Analyse generieren
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Projekt-ID" },
        { status: 400 }
      );
    }
    
    // Parse body for analysis types
    let analysisTypes: string[] = ["summary", "risks", "timeline", "next_steps"];
    try {
      const body = await request.json();
      if (body.analysisTypes && Array.isArray(body.analysisTypes)) {
        analysisTypes = body.analysisTypes;
      }
    } catch {
      // Use defaults if no body
    }
    
    const userId = 1; // TODO: Aus Session
    
    // Extended analysis with custom types
    const result = await AIInsightsService.generateProjectInsightsExtended(
      projectId, 
      userId, 
      analysisTypes
    );
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Projektanalyse erfolgreich generiert",
      data: result.insights,
    });
    
  } catch (error) {
    console.error("AI Project Insights POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler bei der Projektanalyse" },
      { status: 500 }
    );
  }
}

