/**
 * User Role Assignment API - Enterprise++ Standard E.2.5
 * 
 * GET /api/admin/users/[id]/roles - Rollen-Zuweisungen abrufen
 * POST /api/admin/users/[id]/roles - Rolle zuweisen
 * 
 * RBAC: security.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Rollen-Zuweisungen laden
    const [rows] = await connection.execute(
      `SELECT 
         ur.id, ur.user_id, ur.role_id, ur.assigned_by, ur.assigned_at, ur.expires_at,
         r.role_name,
         u.username as assigned_by_name
       FROM lopez_user_roles ur
       JOIN lopez_roles r ON ur.role_id = r.id
       LEFT JOIN lopez_users u ON ur.assigned_by = u.id
       WHERE ur.user_id = ? AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
       ORDER BY ur.assigned_at DESC`,
      [userId]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: Array.isArray(rows) ? rows : [],
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der Rollen-Zuweisungen", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Abrufen der Rollen-Zuweisungen" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    const { role_id, expires_at } = body;

    if (!role_id) {
      return NextResponse.json(
        { success: false, error: "role_id ist erforderlich" },
        { status: 400 }
      );
    }

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Prüfen, ob Zuweisung bereits existiert
    const [existing] = await connection.execute(
      `SELECT id FROM lopez_user_roles 
       WHERE user_id = ? AND role_id = ? AND (expires_at IS NULL OR expires_at > NOW())`,
      [userId, role_id]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: "Rolle ist bereits zugewiesen" },
        { status: 400 }
      );
    }

    // Rolle zuweisen
    const [result] = await connection.execute(
      `INSERT INTO lopez_user_roles (user_id, role_id, assigned_by, assigned_at, expires_at)
       VALUES (?, ?, ?, NOW(), ?)`,
      [userId, role_id, 1, expires_at || null] // assigned_by: 1 = System (in Produktion: echte User-ID)
    );

    const insertResult = result as any;
    const assignmentId = insertResult.insertId;

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('ROLE_ASSIGN', 'lopez_user_roles', ?, ?)`,
      [assignmentId, `Rolle ${role_id} zugewiesen an Benutzer ${userId}`]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Rolle erfolgreich zugewiesen",
    });
  } catch (error) {
    logger.error("Fehler bei der Rollen-Zuweisung", error);
    return NextResponse.json(
      { success: false, error: "Fehler bei der Rollen-Zuweisung" },
      { status: 500 }
    );
  }
}



