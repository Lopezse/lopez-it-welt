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
 * POST /api/admin/roles/[id]/clone
 * 
 * Klont eine bestehende Rolle mit optionalen Anpassungen.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = params.id;
    const body = await request.json();
    const { 
      new_role_name, 
      new_role_code, 
      new_role_description,
      adjust_permissions = [] // Array von { permission_key, action: 'add' | 'remove' }
    } = body;

    if (!new_role_name || !new_role_code) {
      return NextResponse.json(
        { success: false, message: "Rollenname und -code sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Original-Rolle laden
    const [originalRole] = await connection.execute(
      `SELECT id, role_name, role_code, role_description, is_system_role 
       FROM lopez_core_roles 
       WHERE id = ?`,
      [roleId],
    );

    if ((originalRole as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Rolle nicht gefunden" },
        { status: 404 },
      );
    }

    const original = (originalRole as any[])[0];

    // Prüfen ob neue Rolle bereits existiert
    const [existingRole] = await connection.execute(
      "SELECT id FROM lopez_core_roles WHERE role_code = ?",
      [new_role_code],
    );

    if ((existingRole as any[]).length > 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Rolle mit diesem Code existiert bereits" },
        { status: 400 },
      );
    }

    // Berechtigungen der Original-Rolle laden
    const [permissions] = await connection.execute(
      `SELECT p.permission_key 
       FROM lopez_core_role_permissions rp
       JOIN lopez_core_permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [roleId],
    );

    let permissionKeys = (permissions as any[]).map((p) => p.permission_key);

    // Berechtigungen anpassen
    for (const adjustment of adjust_permissions) {
      if (adjustment.action === "add") {
        if (!permissionKeys.includes(adjustment.permission_key)) {
          permissionKeys.push(adjustment.permission_key);
        }
      } else if (adjustment.action === "remove") {
        permissionKeys = permissionKeys.filter((key) => key !== adjustment.permission_key);
      }
    }

    // Neue Rolle erstellen
    const [result] = await connection.execute(
      `INSERT INTO lopez_core_roles 
       (role_name, role_code, role_description, permissions, created_by, is_system_role) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        new_role_name,
        new_role_code,
        new_role_description || `${original.role_description} (Klon)`,
        JSON.stringify(permissionKeys),
        "system",
        false, // Geklonte Rollen sind nie System-Rollen
      ],
    );

    const newRoleId = (result as any).insertId;

    // Berechtigungen zuweisen
    for (const permissionKey of permissionKeys) {
      const [permission] = await connection.execute(
        "SELECT id FROM lopez_core_permissions WHERE permission_key = ?",
        [permissionKey],
      );

      if ((permission as any[]).length > 0) {
        await connection.execute(
          "INSERT INTO lopez_core_role_permissions (role_id, permission_id, granted_by) VALUES (?, ?, ?)",
          [newRoleId, (permission as any[])[0].id, "system"],
        );
      }
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Rolle erfolgreich geklont",
      data: {
        id: newRoleId,
        role_name: new_role_name,
        role_code: new_role_code,
        permissions: permissionKeys,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Klonen der Rolle", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Klonen der Rolle" },
      { status: 500 },
    );
  }
}



