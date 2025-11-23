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

// GET - Alle Rollen abrufen
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Rollen mit Berechtigungen abrufen
    const [rows] = await connection.execute(`
            SELECT 
                r.id,
                r.role_name,
                r.role_code,
                r.role_description,
                r.is_system_role,
                r.is_active,
                r.created_at,
                r.updated_at,
                GROUP_CONCAT(DISTINCT p.permission_key) as permissions,
                COUNT(DISTINCT u.id) as user_count
            FROM lopez_core_roles r
            LEFT JOIN lopez_core_role_permissions rp ON r.id = rp.role_id
            LEFT JOIN lopez_core_permissions p ON rp.permission_id = p.id
            LEFT JOIN lopez_core_users u ON r.id = u.role_id AND u.status = 'active'
            WHERE r.is_active = TRUE
            GROUP BY r.id, r.role_name, r.role_code, r.role_description, r.is_system_role, r.is_active, r.created_at, r.updated_at
            ORDER BY r.role_name
        `);

    await connection.end();

    // Berechtigungen in Array umwandeln
    const roles = (rows as any[]).map((role) => ({
      ...role,
      permissions: role.permissions ? role.permissions.split(",") : [],
      user_count: parseInt(role.user_count) || 0,
    }));

    return NextResponse.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    // Rollen-API Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Rollen" },
      { status: 500 },
    );
  }
}

// POST - Neue Rolle erstellen
export async function POST(request: NextRequest) {
  try {
    const { role_name, role_code, role_description, permissions = [] } = await request.json();

    // Validierung
    if (!role_name || !role_code) {
      return NextResponse.json(
        { success: false, message: "Rollenname und -code sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Rolle bereits existiert
    const [existingRole] = await connection.execute(
      "SELECT id FROM lopez_core_roles WHERE role_code = ?",
      [role_code],
    );

    if ((existingRole as any[]).length > 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Rolle mit diesem Code existiert bereits" },
        { status: 400 },
      );
    }

    // Rolle erstellen
    const [result] = await connection.execute(
      "INSERT INTO lopez_core_roles (role_name, role_code, role_description, permissions, created_by) VALUES (?, ?, ?, ?, ?)",
      [role_name, role_code, role_description, JSON.stringify(permissions), "system"],
    );

    const roleId = (result as any).insertId;

    // Berechtigungen zuweisen
    if (permissions.length > 0) {
      for (const permissionKey of permissions) {
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
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Rolle erfolgreich erstellt",
      data: { id: roleId, role_name, role_code },
    });
  } catch (error) {
    // Rolle erstellen Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler beim Erstellen der Rolle" },
      { status: 500 },
    );
  }
}

// PUT - Rolle aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const { id, role_name, role_code, role_description, permissions = [] } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Rollen-ID ist erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Rolle existiert
    const [existingRole] = await connection.execute(
      "SELECT id, is_system_role FROM lopez_core_roles WHERE id = ?",
      [id],
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

    // Rolle aktualisieren
    await connection.execute(
      "UPDATE lopez_core_roles SET role_name = ?, role_code = ?, role_description = ?, permissions = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [role_name, role_code, role_description, JSON.stringify(permissions), id],
    );

    // Alte Berechtigungen entfernen
    await connection.execute("DELETE FROM lopez_core_role_permissions WHERE role_id = ?", [id]);

    // Neue Berechtigungen zuweisen
    if (permissions.length > 0) {
      for (const permissionKey of permissions) {
        const [permission] = await connection.execute(
          "SELECT id FROM lopez_core_permissions WHERE permission_key = ?",
          [permissionKey],
        );

        if ((permission as any[]).length > 0) {
          await connection.execute(
            "INSERT INTO lopez_core_role_permissions (role_id, permission_id, granted_by) VALUES (?, ?, ?)",
            [id, (permission as any[])[0].id, "system"],
          );
        }
      }
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Rolle erfolgreich aktualisiert",
    });
  } catch (error) {
    // Rolle aktualisieren Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren der Rolle" },
      { status: 500 },
    );
  }
}

// DELETE - Rolle löschen
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Rollen-ID ist erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Rolle existiert
    const [existingRole] = await connection.execute(
      "SELECT id, is_system_role, role_name FROM lopez_core_roles WHERE id = ?",
      [id],
    );

    if ((existingRole as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Rolle nicht gefunden" },
        { status: 404 },
      );
    }

    const role = (existingRole as any[])[0];

    // System-Rollen können nicht gelöscht werden
    if (role.is_system_role) {
      await connection.end();
      return NextResponse.json(
        {
          success: false,
          message: "System-Rollen können nicht gelöscht werden",
        },
        { status: 400 },
      );
    }

    // Prüfen ob Benutzer diese Rolle verwenden
    const [usersWithRole] = await connection.execute(
      "SELECT COUNT(*) as count FROM lopez_core_users WHERE role_id = ?",
      [id],
    );

    if ((usersWithRole as any[])[0].count > 0) {
      await connection.end();
      return NextResponse.json(
        {
          success: false,
          message: "Rolle wird noch von Benutzern verwendet und kann nicht gelöscht werden",
        },
        { status: 400 },
      );
    }

    // Rolle löschen (CASCADE löscht automatisch die Berechtigungen)
    await connection.execute("DELETE FROM lopez_core_roles WHERE id = ?", [id]);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Rolle erfolgreich gelöscht",
    });
  } catch (error) {
    // Rolle löschen Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler beim Löschen der Rolle" },
      { status: 500 },
    );
  }
}
