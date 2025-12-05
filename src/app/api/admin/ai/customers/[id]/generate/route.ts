// =====================================================
// ENTERPRISE++ AI CUSTOMER INSIGHTS API
// =====================================================
// POST /api/admin/ai/customers/[id]/generate - Generiert AI-Insights
// GET /api/admin/ai/customers/[id]/generate - Lädt vorhandene Insights
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
    const customerId = parseInt(id);
    
    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Kunden-ID" },
        { status: 400 }
      );
    }
    
    const result = await AIInsightsService.getCustomerInsights(customerId);
    
    return NextResponse.json({
      success: true,
      data: result.insights,
    });
    
  } catch (error) {
    console.error("AI Customer Insights GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Insights" },
      { status: 500 }
    );
  }
}

// POST - Neue Insights generieren
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);
    
    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Kunden-ID" },
        { status: 400 }
      );
    }
    
    // User-ID aus Session (oder default für Demo)
    const userId = 1; // TODO: Aus Session holen
    
    const result = await AIInsightsService.generateCustomerInsights(customerId, userId);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "AI-Analyse erfolgreich generiert",
      data: result.insights,
    });
    
  } catch (error) {
    console.error("AI Customer Insights POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler bei der AI-Analyse" },
      { status: 500 }
    );
  }
}









