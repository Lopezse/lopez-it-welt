/**
 * Backup Detail API - Enterprise++ Standard E.1.2
 * 
 * GET /api/admin/backups/[id] - Backup-Detail
 * 
 * RBAC: system.manage (nur Admins)
 */

import { NextRequest, NextResponse } from "next/server";
import { RBACService } from "@/lib/rbac-system";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { createConnection } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

/**
 * GET /api/admin/backups/[id] - Backup-Detail
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentifizierung
    const sessionToken =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("adm_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session" },
        { status: 401 }
      );
    }

    // RBAC-Prüfung
    const hasPermission = await RBACService.checkPermission({
      user_id: session.userId.toString(),
      resource: "system",
      action: "manage",
    });

    if (!hasPermission) {
      return NextResponse.json(
        { success: false, error: "Keine Berechtigung für system.manage" },
        { status: 403 }
      );
    }

    const backupId = params.id;

    // Datenbank-Verbindung
    const connection = await createConnection();

    // Backup aus Datenbank laden
    const [rows] = await connection.execute(
      "SELECT * FROM system_backups WHERE id = ?",
      [backupId]
    );

    await connection.end();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Backup nicht gefunden" },
        { status: 404 }
      );
    }

    const backup = rows[0] as any;

    // Backup-Logs laden (falls vorhanden)
    let logs: string[] = [];
    try {
      const logPath = path.join(
        process.env.BACKUP_DIR || "D:\\Backups\\system",
        `backup-${backupId}.log`
      );
      const logContent = await fs.readFile(logPath, "utf8");
      logs = logContent.split("\n").filter((line) => line.trim());
    } catch (error) {
      // Log-Datei nicht gefunden - kein Problem
    }

    return NextResponse.json({
      success: true,
      data: {
        id: backup.id,
        timestamp: backup.timestamp,
        type: backup.type,
        size: backup.size || 0,
        status: backup.status,
        duration: backup.duration || undefined,
        files: backup.files || 0,
        location: backup.location || "",
        description: backup.description || undefined,
        logs: logs.length > 0 ? logs : undefined,
      },
    });
  } catch (error) {
    console.error("❌ Backup Detail API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden des Backup-Details" },
      { status: 500 }
    );
  }
}




