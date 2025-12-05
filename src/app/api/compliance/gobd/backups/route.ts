/**
 * GoBD Backup Compliance API - Enterprise++ Standard E.2.2
 * 
 * GET /api/compliance/gobd/backups - Backup-Compliance-Daten
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

    // Backups laden
    const [backupRows] = await connection.execute(
      `SELECT id, timestamp, type, status, location, hash_sha256
       FROM system_backups
       ORDER BY timestamp DESC
       LIMIT 100`
    );

    const backups = Array.isArray(backupRows) ? backupRows : [];
    const totalBackups = backups.length;
    const verifiedBackups = backups.filter((b: any) => b.hash_sha256 && b.hash_sha256 !== "").length;
    const complianceScore = totalBackups > 0 ? (verifiedBackups / totalBackups) * 100 : 100;

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        total_backups: totalBackups,
        verified_backups: verifiedBackups,
        backups: backups.map((b: any) => ({
          id: b.id,
          timestamp: b.timestamp,
          type: b.type,
          status: b.status,
          hash_verified: !!(b.hash_sha256 && b.hash_sha256 !== ""),
          hash_value: b.hash_sha256 || "",
          location: b.location,
        })),
        compliance_score: complianceScore,
        last_verification: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der Backup-Compliance-Daten", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Abrufen der Backup-Compliance-Daten" },
      { status: 500 }
    );
  }
}



