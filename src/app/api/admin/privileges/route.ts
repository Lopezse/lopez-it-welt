import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
  port: parseInt(process.env.DB_PORT || "3306"),
};

/**
 * GET /api/admin/privileges
 * 
 * Gibt alle verfügbaren Privilegien zurück.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get("role_id");
    const userId = searchParams.get("user_id");

    const connection = await mysql.createConnection(dbConfig);

    // Alle Privilegien laden
    const [permissions] = await connection.execute(
      `SELECT 
        p.id,
        p.permission_key,
        p.permission_name,
        p.description,
        p.category,
        p.resource,
        p.action,
        p.is_system_permission,
        p.created_at,
        p.updated_at
       FROM lopez_core_permissions p
       ORDER BY p.category, p.resource, p.action`,
    );

    let assignedPermissions: any[] = [];

    // Wenn role_id angegeben, zugewiesene Privilegien für diese Rolle laden
    if (roleId) {
      const [rolePerms] = await connection.execute(
        `SELECT permission_id FROM lopez_core_role_permissions WHERE role_id = ?`,
        [roleId],
      );
      assignedPermissions = (rolePerms as any[]).map((rp) => rp.permission_id);
    }

    // Wenn user_id angegeben, zugewiesene Privilegien für diesen Benutzer laden
    if (userId) {
      const [userRoles] = await connection.execute(
        `SELECT role_id FROM lopez_core_user_roles WHERE user_id = ?`,
        [userId],
      );

      if ((userRoles as any[]).length > 0) {
        const roleIds = (userRoles as any[]).map((ur) => ur.role_id);
        // @sql-safe: Platzhalter werden dynamisch generiert, aber nur "?" Zeichen
        // roleIds kommen aus vorheriger DB-Abfrage, nicht aus User-Input
        const placeholders = roleIds.map(() => "?").join(",");
        const [userPerms] = await connection.execute(
          `SELECT DISTINCT permission_id FROM lopez_core_role_permissions WHERE role_id IN (${placeholders})`,
          roleIds,
        );
        assignedPermissions = (userPerms as any[]).map((up) => up.permission_id);
      }
    }

    await connection.end();

    // Privilegien mit Zuweisungs-Status markieren
    const permissionsWithStatus = (permissions as any[]).map((perm) => ({
      ...perm,
      is_assigned: assignedPermissions.includes(perm.id),
    }));

    return NextResponse.json({
      success: true,
      data: permissionsWithStatus,
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Privilegien", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Privilegien" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/privileges
 * 
 * Weist ein Privileg einem Benutzer oder einer Rolle zu.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { permission_id, role_id, user_id } = body;

    if (!permission_id || (!role_id && !user_id)) {
      return NextResponse.json(
        { success: false, message: "Privileg-ID und Rollen-ID oder Benutzer-ID sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Privileg existiert
    const [perms] = await connection.execute(
      "SELECT id FROM lopez_core_permissions WHERE id = ?",
      [permission_id],
    );

    if ((perms as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Privileg nicht gefunden" },
        { status: 404 },
      );
    }

    if (role_id) {
      // Prüfen ob Rolle existiert
      const [roles] = await connection.execute(
        "SELECT id FROM lopez_core_roles WHERE id = ?",
        [role_id],
      );

      if ((roles as any[]).length === 0) {
        await connection.end();
        return NextResponse.json(
          { success: false, message: "Rolle nicht gefunden" },
          { status: 404 },
        );
      }

      // Prüfen ob Zuweisung bereits existiert
      const [existing] = await connection.execute(
        "SELECT id FROM lopez_core_role_permissions WHERE role_id = ? AND permission_id = ?",
        [role_id, permission_id],
      );

      if ((existing as any[]).length > 0) {
        await connection.end();
        return NextResponse.json(
          { success: false, message: "Privileg ist bereits dieser Rolle zugewiesen" },
          { status: 400 },
        );
      }

      // Privileg zuweisen
      await connection.execute(
        `INSERT INTO lopez_core_role_permissions (role_id, permission_id, granted_by, granted_at)
         VALUES (?, ?, 'system', NOW())`,
        [role_id, permission_id],
      );
    } else if (user_id) {
      // Direkte Benutzer-Zuweisung (falls Tabelle existiert)
      // Für jetzt: Privileg über Rolle zuweisen
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Direkte Benutzer-Zuweisung wird über Rollen verwaltet" },
        { status: 400 },
      );
    }

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('PRIVILEGE_ASSIGN', 'lopez_core_permissions', ?, ?)`,
      [
        permission_id,
        `Privileg zugewiesen: ${role_id ? `Rolle ${role_id}` : `Benutzer ${user_id}`}`,
      ],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Privileg erfolgreich zugewiesen",
    });
  } catch (error) {
    logger.error("Fehler beim Zuweisen des Privilegs", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Zuweisen des Privilegs" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/privileges
 * 
 * Entfernt ein Privileg von einem Benutzer oder einer Rolle.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const permission_id = searchParams.get("permission_id");
    const role_id = searchParams.get("role_id");
    const user_id = searchParams.get("user_id");

    if (!permission_id || (!role_id && !user_id)) {
      return NextResponse.json(
        { success: false, message: "Privileg-ID und Rollen-ID oder Benutzer-ID sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    if (role_id) {
      // Privileg von Rolle entfernen
      await connection.execute(
        "DELETE FROM lopez_core_role_permissions WHERE role_id = ? AND permission_id = ?",
        [role_id, permission_id],
      );
    } else if (user_id) {
      // Direkte Benutzer-Zuweisung entfernen (falls Tabelle existiert)
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Direkte Benutzer-Zuweisung wird über Rollen verwaltet" },
        { status: 400 },
      );
    }

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('PRIVILEGE_REMOVE', 'lopez_core_permissions', ?, ?)`,
      [
        permission_id,
        `Privileg entfernt: ${role_id ? `Rolle ${role_id}` : `Benutzer ${user_id}`}`,
      ],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Privileg erfolgreich entfernt",
    });
  } catch (error) {
    logger.error("Fehler beim Entfernen des Privilegs", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Entfernen des Privilegs" },
      { status: 500 },
    );
  }
}


