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
 * POST /api/admin/roles/import
 * 
 * Importiert eine Rolle aus JSON.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role_data, conflict_resolution = "skip" } = body; // conflict_resolution: "skip" | "overwrite" | "rename"

    if (!role_data || !role_data.role_name || !role_data.role_code) {
      return NextResponse.json(
        { success: false, message: "Ungültige Rollen-Daten" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Rolle bereits existiert
    const [existingRole] = await connection.execute(
      "SELECT id, role_name FROM lopez_core_roles WHERE role_code = ?",
      [role_data.role_code],
    );

    let roleId: number;
    let action: string;

    if ((existingRole as any[]).length > 0) {
      // Konflikt vorhanden
      if (conflict_resolution === "skip") {
        await connection.end();
        return NextResponse.json(
          {
            success: false,
            message: "Rolle existiert bereits",
            conflict: true,
            existing_role: (existingRole as any[])[0],
          },
          { status: 409 },
        );
      } else if (conflict_resolution === "overwrite") {
        // Überschreiben
        roleId = (existingRole as any[])[0].id;
        await connection.execute(
          `UPDATE lopez_core_roles 
           SET role_name = ?, role_description = ?, updated_at = CURRENT_TIMESTAMP 
           WHERE id = ?`,
          [role_data.role_name, role_data.role_description, roleId],
        );
        // Alte Berechtigungen entfernen
        await connection.execute("DELETE FROM lopez_core_role_permissions WHERE role_id = ?", [roleId]);
        action = "overwritten";
      } else {
        // Umbenennen (neue Rolle mit angepasstem Code)
        const newCode = `${role_data.role_code}_imported_${Date.now()}`;
        const [result] = await connection.execute(
          `INSERT INTO lopez_core_roles 
           (role_name, role_code, role_description, permissions, created_by, is_system_role) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            role_data.role_name,
            newCode,
            role_data.role_description,
            JSON.stringify(role_data.permissions?.map((p: any) => p.permission_key) || []),
            "system",
            false,
          ],
        );
        roleId = (result as any).insertId;
        action = "renamed";
      }
    } else {
      // Neue Rolle erstellen
      const [result] = await connection.execute(
        `INSERT INTO lopez_core_roles 
         (role_name, role_code, role_description, permissions, created_by, is_system_role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          role_data.role_name,
          role_data.role_code,
          role_data.role_description,
          JSON.stringify(role_data.permissions?.map((p: any) => p.permission_key) || []),
          "system",
          false,
        ],
      );
      roleId = (result as any).insertId;
      action = "created";
    }

    // Berechtigungen zuweisen
    const permissionKeys = role_data.permissions?.map((p: any) => 
      typeof p === "string" ? p : p.permission_key
    ) || [];

    for (const permissionKey of permissionKeys) {
      const [permission] = await connection.execute(
        "SELECT id FROM lopez_core_permissions WHERE permission_key = ?",
        [permissionKey],
      );

      if ((permission as any[]).length > 0) {
        await connection.execute(
          "INSERT INTO lopez_core_role_permissions (role_id, permission_id, granted_by) VALUES (?, ?, ?)",
          [roleId, (permission as any[])[0].id, "system"],
        );
      }
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: `Rolle erfolgreich importiert (${action})`,
      data: {
        id: roleId,
        role_name: role_data.role_name,
        role_code: role_data.role_code,
        action,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Importieren der Rolle", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Importieren der Rolle" },
      { status: 500 },
    );
  }
}



