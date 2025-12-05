// =====================================================
// ENTERPRISE++ AI USAGE STATISTICS API
// =====================================================
// GET /api/admin/ai/usage - AI-Nutzungsstatistiken
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AIProvider } from "@/lib/ai/ai-provider";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    
    const stats = await AIProvider.getUsageStats(days);
    
    return NextResponse.json({
      success: true,
      data: {
        period: `Letzte ${days} Tage`,
        ...stats,
      },
    });
    
  } catch (error) {
    console.error("AI Usage Stats Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der AI-Statistiken" },
      { status: 500 }
    );
  }
}









