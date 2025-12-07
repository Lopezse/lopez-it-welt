/**
 * Enterprise++ API: Einzelne Rolle verwalten
 * GET /api/admin/roles/[id] - Rolle abrufen
 * PUT /api/admin/roles/[id] - Rolle aktualisieren
 * DELETE /api/admin/roles/[id] - Rolle löschen
 */

import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
};

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET: Einzelne Rolle abrufen
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Rolle laden
    const [roleRows] = await connection.execute(
      `SELECT * FROM lopez_roles WHERE id = ?`,
      [id]
    );
    
    const roles = roleRows as any[];
    
    if (roles.length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Rolle nicht gefunden" },
        { status: 404 }
      );
    }
    
    const role = roles[0];
    
    // Berechtigungen laden
    let permissions: string[] = [];
    try {
      const [permRows] = await connection.execute(
        `SELECT permission_name FROM lopez_role_permissions WHERE role_id = ?`,
        [id]
      );
      permissions = (permRows as any[]).map(p => p.permission_name);
    } catch (err) {
      // Tabelle existiert möglicherweise nicht
      console.log("Permissions-Tabelle nicht vorhanden");
    }
    
    // Anzahl Benutzer mit dieser Rolle
    let userCount = 0;
    try {
      const [countRows] = await connection.execute(
        `SELECT COUNT(*) as count FROM lopez_user_roles WHERE role_id = ?`,
        [id]
      );
      userCount = (countRows as any[])[0]?.count || 0;
    } catch (err) {
      console.log("User-Roles Tabelle nicht vorhanden");
    }
    
    await connection.end();
    
    return NextResponse.json({
      success: true,
      data: {
        ...role,
        permissions,
        user_count: userCount,
        is_system_role: ["Super Admin", "Admin", "Owner", "Viewer"].includes(role.role_name),
      },
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der Rolle:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Rolle", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT: Rolle aktualisieren
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  
  try {
    const body = await request.json();
    const { role_name, description, permissions } = body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Prüfen ob Rolle existiert
    const [existingRows] = await connection.execute(
      `SELECT * FROM lopez_roles WHERE id = ?`,
      [id]
    );
    
    const existing = existingRows as any[];
    
    if (existing.length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Rolle nicht gefunden" },
        { status: 404 }
      );
    }
    
    // System-Rollen schützen
    const systemRoles = ["Super Admin", "Admin", "Owner", "Viewer"];
    if (systemRoles.includes(existing[0].role_name)) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "System-Rollen können nicht bearbeitet werden" },
        { status: 403 }
      );
    }
    
    // Rolle aktualisieren
    await connection.execute(
      `UPDATE lopez_roles SET role_name = ?, description = ?, updated_at = NOW() WHERE id = ?`,
      [role_name || existing[0].role_name, description || existing[0].description, id]
    );
    
    // Berechtigungen aktualisieren (wenn Tabelle existiert)
    if (permissions && Array.isArray(permissions)) {
      try {
        // Alte Berechtigungen löschen
        await connection.execute(
          `DELETE FROM lopez_role_permissions WHERE role_id = ?`,
          [id]
        );
        
        // Neue Berechtigungen einfügen
        for (const perm of permissions) {
          await connection.execute(
            `INSERT INTO lopez_role_permissions (role_id, permission_name, created_at) VALUES (?, ?, NOW())`,
            [id, perm]
          );
        }
      } catch (err) {
        console.log("Berechtigungen konnten nicht aktualisiert werden");
      }
    }
    
    await connection.end();
    
    return NextResponse.json({
      success: true,
      message: "Rolle erfolgreich aktualisiert",
    });
  } catch (error: any) {
    console.error("Fehler beim Aktualisieren der Rolle:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Rolle löschen
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Prüfen ob Rolle existiert
    const [existingRows] = await connection.execute(
      `SELECT * FROM lopez_roles WHERE id = ?`,
      [id]
    );
    
    const existing = existingRows as any[];
    
    if (existing.length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Rolle nicht gefunden" },
        { status: 404 }
      );
    }
    
    // System-Rollen schützen
    const systemRoles = ["Super Admin", "Admin", "Owner", "Viewer"];
    if (systemRoles.includes(existing[0].role_name)) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "System-Rollen können nicht gelöscht werden" },
        { status: 403 }
      );
    }
    
    // Prüfen ob Benutzer zugewiesen sind
    try {
      const [userRows] = await connection.execute(
        `SELECT COUNT(*) as count FROM lopez_user_roles WHERE role_id = ?`,
        [id]
      );
      const userCount = (userRows as any[])[0]?.count || 0;
      
      if (userCount > 0) {
        await connection.end();
        return NextResponse.json(
          { success: false, message: `Rolle ist noch ${userCount} Benutzern zugewiesen` },
          { status: 400 }
        );
      }
    } catch (err) {
      // Tabelle existiert nicht
    }
    
    // Berechtigungen löschen
    try {
      await connection.execute(
        `DELETE FROM lopez_role_permissions WHERE role_id = ?`,
        [id]
      );
    } catch (err) {
      // Tabelle existiert nicht
    }
    
    // Rolle löschen
    await connection.execute(
      `DELETE FROM lopez_roles WHERE id = ?`,
      [id]
    );
    
    await connection.end();
    
    return NextResponse.json({
      success: true,
      message: "Rolle erfolgreich gelöscht",
    });
  } catch (error: any) {
    console.error("Fehler beim Löschen der Rolle:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Löschen", error: error.message },
      { status: 500 }
    );
  }
}










