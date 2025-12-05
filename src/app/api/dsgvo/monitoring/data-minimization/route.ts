/**
 * Data Minimization Status API - Enterprise++ Standard E.2.1
 * 
 * GET /api/dsgvo/monitoring/data-minimization - Data-Minimization-Status
 * 
 * RBAC: compliance.view
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Data-Minimization-Status generieren (vereinfacht - in Produktion: echte Berechnung)
    const overallStatus = Math.random() > 0.3 ? "compliant" : Math.random() > 0.5 ? "warning" : "critical";
    
    const resources = [
      {
        resource_type: "Media",
        status: overallStatus,
        data_points: 1000 + Math.floor(Math.random() * 500),
        minimized_data_points: 800 + Math.floor(Math.random() * 150),
        percentage: 75 + Math.random() * 20,
      },
      {
        resource_type: "Invoices",
        status: "compliant",
        data_points: 500 + Math.floor(Math.random() * 200),
        minimized_data_points: 450 + Math.floor(Math.random() * 50),
        percentage: 85 + Math.random() * 10,
      },
    ];

    const trend: Array<{ period: string; percentage: number }> = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      trend.push({
        period: date.toISOString(),
        percentage: 70 + Math.random() * 25,
      });
    }

    const alerts: Array<{ severity: "low" | "medium" | "high" | "critical"; message: string; resource: string }> = [];
    if (overallStatus === "critical") {
      alerts.push({
        severity: "critical",
        message: "Kritischer Data-Minimization-Status",
        resource: "System",
      });
    } else if (overallStatus === "warning") {
      alerts.push({
        severity: "high",
        message: "Warnung: Data-Minimization-Status verbesserungsfähig",
        resource: "System",
      });
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        overall_status: overallStatus,
        resources,
        trend,
        alerts,
        last_updated: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen des Data-Minimization-Status", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Abrufen des Data-Minimization-Status" },
      { status: 500 }
    );
  }
}



