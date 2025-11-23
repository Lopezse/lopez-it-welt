import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

// Datenbankverbindung
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_erp",
  port: parseInt(process.env.DB_PORT || "3306"),
};

// GET - Alle Berechtigungen abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const resource = searchParams.get("resource");

    const connection = await mysql.createConnection(dbConfig);

    let query = `
            SELECT 
                p.id,
                p.permission_key,
                p.permission_name,
                p.description,
                p.category,
                p.resource,
                p.action,
                p.is_system_permission,
                p.is_active,
                p.created_at,
                COUNT(DISTINCT rp.role_id) as role_count
            FROM lopez_core_permissions p
            LEFT JOIN lopez_core_role_permissions rp ON p.id = rp.permission_id
            WHERE p.is_active = TRUE
        `;

    const params: any[] = [];

    if (category) {
      query += " AND p.category = ?";
      params.push(category);
    }

    if (resource) {
      query += " AND p.resource = ?";
      params.push(resource);
    }

    query +=
      " GROUP BY p.id, p.permission_key, p.permission_name, p.description, p.category, p.resource, p.action, p.is_system_permission, p.is_active, p.created_at ORDER BY p.category, p.resource, p.action";

    const [rows] = await connection.execute(query, params);

    await connection.end();

    // Nach Kategorien gruppieren
    const permissions = (rows as any[]).map((permission) => ({
      ...permission,
      role_count: parseInt(permission.role_count) || 0,
    }));

    const groupedPermissions = permissions.reduce(
      (acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    return NextResponse.json({
      success: true,
      data: {
        permissions,
        grouped: groupedPermissions,
        categories: Object.keys(groupedPermissions),
      },
    });
  } catch (error) {
    // Berechtigungen-API Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Berechtigungen" },
      { status: 500 },
    );
  }
}

// GET - Berechtigungen für eine spezifische Rolle
export async function GET_ROLE_PERMISSIONS(roleId: string) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      `
            SELECT 
                p.id,
                p.permission_key,
                p.permission_name,
                p.description,
                p.category,
                p.resource,
                p.action,
                p.is_system_permission
            FROM lopez_core_permissions p
            INNER JOIN lopez_core_role_permissions rp ON p.id = rp.permission_id
            WHERE rp.role_id = ? AND p.is_active = TRUE
            ORDER BY p.category, p.resource, p.action
        `,
      [roleId],
    );

    await connection.end();

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    // Rollen-Berechtigungen Fehler: ${error}
    return {
      success: false,
      message: "Fehler beim Laden der Rollen-Berechtigungen",
    };
  }
}

// POST - Berechtigungen für Rolle zuweisen/entfernen
export async function POST(request: NextRequest) {
  try {
    const { role_id, permission_ids, action = "assign" } = await request.json();

    if (!role_id || !permission_ids || !Array.isArray(permission_ids)) {
      return NextResponse.json(
        {
          success: false,
          message: "Rollen-ID und Berechtigungs-IDs sind erforderlich",
        },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Rolle existiert
    const [existingRole] = await connection.execute(
      "SELECT id, is_system_role FROM lopez_core_roles WHERE id = ?",
      [role_id],
    );

    if ((existingRole as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Rolle nicht gefunden" },
        { status: 404 },
      );
    }

    const role = (existingRole as any[])[0];

    // System-Rollen können nicht geändert werden
    if (role.is_system_role) {
      await connection.end();
      return NextResponse.json(
        {
          success: false,
          message: "System-Rollen können nicht geändert werden",
        },
        { status: 400 },
      );
    }

    if (action === "assign") {
      // Berechtigungen zuweisen
      for (const permissionId of permission_ids) {
        // Prüfen ob Berechtigung bereits zugewiesen ist
        const [existing] = await connection.execute(
          "SELECT id FROM lopez_core_role_permissions WHERE role_id = ? AND permission_id = ?",
          [role_id, permissionId],
        );

        if ((existing as any[]).length === 0) {
          await connection.execute(
            "INSERT INTO lopez_core_role_permissions (role_id, permission_id, granted_by) VALUES (?, ?, ?)",
            [role_id, permissionId, "system"],
          );
        }
      }
    } else if (action === "remove") {
      // Berechtigungen entfernen
      await connection.execute(
        "DELETE FROM lopez_core_role_permissions WHERE role_id = ? AND permission_id IN (?)",
        [role_id, permission_ids],
      );
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: `Berechtigungen erfolgreich ${action === "assign" ? "zugewiesen" : "entfernt"}`,
    });
  } catch (error) {
    // Berechtigungen zuweisen Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler beim Zuweisen der Berechtigungen" },
      { status: 500 },
    );
  }
}
