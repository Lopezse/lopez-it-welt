/**
 * Data Lineage Exports History API - Enterprise++ Standard E.2.6
 * 
 * GET /api/admin/data-lineage/exports - Export-Historie abrufen
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

    // Export-Historie laden
    const [rows] = await connection.execute(
      `SELECT id, format, filters, created_at, created_by
       FROM enterprise_data_lineage_exports
       ORDER BY created_at DESC
       LIMIT 50`
    );

    await connection.end();

    // Filters von JSON-String parsen
    const exports = Array.isArray(rows)
      ? rows.map((row: any) => ({
          ...row,
          filters: row.filters ? JSON.parse(row.filters) : {},
          created_by: "System", // In Produktion: echte User-Info
        }))
      : [];

    return NextResponse.json({
      success: true,
      data: exports,
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der Export-Historie", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Abrufen der Export-Historie" },
      { status: 500 }
    );
  }
}



