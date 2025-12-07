// =====================================================
// ENTERPRISE++ AI INVOICE CHECK API
// =====================================================
// POST /api/admin/ai/invoices/[id]/check - Prüft Rechnung mit AI
// GET /api/admin/ai/invoices/[id]/check - Lädt vorhandene Prüfungen
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AIInsightsService } from "@/lib/ai/ai-insights-service";

// GET - Vorhandene Prüfungen laden
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id);
    
    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Rechnungs-ID" },
        { status: 400 }
      );
    }
    
    const result = await AIInsightsService.getInvoiceInsights(invoiceId);
    
    return NextResponse.json({
      success: true,
      data: result.insights,
    });
    
  } catch (error) {
    console.error("AI Invoice Check GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Prüfungen" },
      { status: 500 }
    );
  }
}

// POST - Neue Prüfung starten
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id);
    
    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Rechnungs-ID" },
        { status: 400 }
      );
    }
    
    const userId = 1; // TODO: Aus Session
    
    const result = await AIInsightsService.checkInvoice(invoiceId, userId);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Rechnungsprüfung erfolgreich abgeschlossen",
      data: result.insights,
    });
    
  } catch (error) {
    console.error("AI Invoice Check POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler bei der Rechnungsprüfung" },
      { status: 500 }
    );
  }
}















