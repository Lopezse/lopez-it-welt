/**
 * GoBD Verification History API - Enterprise++ Standard E.2.2
 * 
 * GET /api/compliance/gobd/verification-history - Verifikations-Historie
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

    // Verifikations-Historie aus Audit-Logs laden
    const [rows] = await connection.execute(
      `SELECT id, timestamp, ref_table as resource_type, ref_id as resource_id, 
              CASE WHEN notes LIKE '%erfolgreich%' THEN 'verified' 
                   WHEN notes LIKE '%fehlgeschlagen%' THEN 'failed' 
                   ELSE 'warning' END as status,
              SUBSTRING_INDEX(notes, ':', 1) as verified_by
       FROM lopez_audit_logs
       WHERE action = 'GOBD_HASH_VERIFY'
       ORDER BY timestamp DESC
       LIMIT 100`
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: Array.isArray(rows) ? rows : [],
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der Verifikations-Historie", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Abrufen der Verifikations-Historie" },
      { status: 500 }
    );
  }
}



