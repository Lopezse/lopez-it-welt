/**
 * Backup Download API - Enterprise++ Standard E.1.2
 * 
 * GET /api/admin/backups/[id]/download - Backup herunterladen
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
 * GET /api/admin/backups/[id]/download - Backup herunterladen
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

    if (backup.status !== "success") {
      return NextResponse.json(
        { success: false, error: "Backup ist nicht verfügbar" },
        { status: 400 }
      );
    }

    // Backup-Datei lesen
    const backupPath = backup.location || path.join(
      process.env.BACKUP_DIR || "D:\\Backups\\system",
      `backup-${backup.type}-${backup.timestamp.replace(/[:.]/g, "-")}.tar.gz`
    );

    try {
      const fileBuffer = await fs.readFile(backupPath);
      const fileName = path.basename(backupPath);

      // Audit-Log
      const connection2 = await createConnection();
      await connection2.execute(
        `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
         VALUES ('BACKUP_DOWNLOAD', 'system_backups', ?, ?)`,
        [backupId, `Backup heruntergeladen: ${backupId}`]
      );
      await connection2.end();

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Length": fileBuffer.length.toString(),
        },
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Backup-Datei nicht gefunden" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("❌ Backup Download API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Herunterladen des Backups" },
      { status: 500 }
    );
  }
}




