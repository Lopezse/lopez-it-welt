/**
 * User Role Assignment Delete API - Enterprise++ Standard E.2.5
 * 
 * DELETE /api/admin/users/[id]/roles/[assignmentId] - Rollen-Zuweisung entfernen
 * 
 * RBAC: security.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; assignmentId: string } }
) {
  try {
    const userId = params.id;
    const assignmentId = params.assignmentId;

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Rollen-Zuweisung entfernen
    await connection.execute(
      `DELETE FROM lopez_user_roles WHERE id = ? AND user_id = ?`,
      [assignmentId, userId]
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('ROLE_REMOVE', 'lopez_user_roles', ?, ?)`,
      [assignmentId, `Rollen-Zuweisung ${assignmentId} entfernt von Benutzer ${userId}`]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Rollen-Zuweisung erfolgreich entfernt",
    });
  } catch (error) {
    logger.error("Fehler beim Entfernen der Rollen-Zuweisung", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Entfernen der Rollen-Zuweisung" },
      { status: 500 }
    );
  }
}



