// =====================================================
// ENTERPRISE++ AI REPORTS API
// =====================================================
// POST /api/admin/ai/reports - Generiert Executive Report
// GET /api/admin/ai/reports - Lädt vorhandene Reports
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AIInsightsService } from "@/lib/ai/ai-insights-service";

// GET - Reports laden
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    
    const reports = await AIInsightsService.getReports(limit);
    
    return NextResponse.json({
      success: true,
      data: reports,
    });
    
  } catch (error) {
    console.error("AI Reports GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Reports" },
      { status: 500 }
    );
  }
}

// POST - Report generieren
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reportType = body.type || "weekly";
    
    const validTypes = ["weekly", "monthly", "quarterly", "security", "financial"];
    if (!validTypes.includes(reportType)) {
      return NextResponse.json(
        { success: false, error: "Ungültiger Report-Typ" },
        { status: 400 }
      );
    }
    
    const userId = 1; // TODO: Aus Session
    
    const result = await AIInsightsService.generateReport(
      reportType as "weekly" | "monthly" | "quarterly" | "security" | "financial",
      userId
    );
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `${reportType} Report erfolgreich generiert`,
      data: {
        reportId: result.reportId,
        content: result.content,
      },
    });
    
  } catch (error) {
    console.error("AI Reports POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler bei der Report-Generierung" },
      { status: 500 }
    );
  }
}









