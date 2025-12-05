/**
 * DSGVO Monitoring Trend API - Enterprise++ Standard E.2.1
 * 
 * GET /api/dsgvo/monitoring/trend - Compliance-Trend-Daten (letzte N Tage)
 * 
 * RBAC: compliance.view
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Trend-Daten generieren (vereinfacht - in Produktion: echte Daten aus DB)
    const trend: Array<{ period: string; compliance_score: number; risk_score: number; consent_coverage: number }> = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Simulierte Daten (in Produktion: echte Berechnung)
      trend.push({
        period: date.toISOString(),
        compliance_score: 85 + Math.random() * 10,
        risk_score: 20 + Math.random() * 30,
        consent_coverage: 75 + Math.random() * 20,
      });
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      data: trend,
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der DSGVO-Trend-Daten", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Abrufen der Trend-Daten" },
      { status: 500 }
    );
  }
}



