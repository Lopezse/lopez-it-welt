/**
 * Enterprise++ API: Einzelnen Benutzer verwalten
 * GET /api/admin/users/[id] - Benutzer abrufen
 * PUT /api/admin/users/[id] - Benutzer aktualisieren
 * DELETE /api/admin/users/[id] - Benutzer löschen
 */

import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { Argon2Service } from "@/lib/argon2-service";

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
 * GET: Einzelnen Benutzer abrufen
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Benutzer laden
    const [userRows] = await connection.execute(
      `SELECT 
        u.id,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.status,
        u.created_at,
        u.updated_at,
        CASE WHEN f.user_id IS NOT NULL THEN 1 ELSE 0 END as two_factor_enabled
      FROM lopez_users u
      LEFT JOIN lopez_user_2fa f ON u.id = f.user_id
      WHERE u.id = ?`,
      [id]
    );
    
    const users = userRows as any[];
    
    if (users.length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }
    
    const user = users[0];
    
    // Rollen laden
    let roles: string[] = [];
    try {
      const [roleRows] = await connection.execute(
        `SELECT r.role_name 
         FROM lopez_user_roles ur
         JOIN lopez_roles r ON ur.role_id = r.id
         WHERE ur.user_id = ?`,
        [id]
      );
      roles = (roleRows as any[]).map(r => r.role_name);
    } catch (err) {
      console.log("Rollen konnten nicht geladen werden");
    }
    
    await connection.end();
    
    return NextResponse.json({
      success: true,
      data: {
        ...user,
        roles,
        two_factor_enabled: user.two_factor_enabled === 1,
      },
    });
  } catch (error: any) {
    console.error("Fehler beim Laden des Benutzers:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden des Benutzers", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT: Benutzer aktualisieren
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  
  try {
    const body = await request.json();
    const { first_name, last_name, email, status, roles, password } = body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Prüfen ob Benutzer existiert
    const [existingRows] = await connection.execute(
      `SELECT * FROM lopez_users WHERE id = ?`,
      [id]
    );
    
    const existing = existingRows as any[];
    
    if (existing.length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }
    
    // Enterprise++ ALLOWED_FIELDS Whitelist
    // @sql-safe: Nur Felder aus ALLOWED_FIELDS werden akzeptiert
    const ALLOWED_FIELDS = ["first_name", "last_name", "email", "status"] as const;
    
    const updates: string[] = [];
    const values: any[] = [];
    
    // Nur erlaubte Felder verarbeiten
    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }
    
    // Passwort-Hash separat behandeln (nicht aus Body direkt)
    if (password) {
      const hashResult = await Argon2Service.hashPassword(password);
      updates.push("password_hash = ?");
      values.push(hashResult.hash);
    }
    
    updates.push("updated_at = NOW()");
    values.push(id);
    
    if (updates.length > 1) {
      // @sql-safe: SET-Klausel aus ALLOWED_FIELDS Whitelist
      await connection.execute(
        `UPDATE lopez_users SET ${updates.join(", ")} WHERE id = ?`,
        values
      );
    }
    
    // Rollen aktualisieren
    if (roles && Array.isArray(roles)) {
      try {
        // Alte Rollen löschen
        await connection.execute(
          `DELETE FROM lopez_user_roles WHERE user_id = ?`,
          [id]
        );
        
        // Neue Rollen zuweisen
        for (const roleName of roles) {
          // Role ID finden
          const [roleIdRows] = await connection.execute(
            `SELECT id FROM lopez_roles WHERE role_name = ?`,
            [roleName]
          );
          const roleId = (roleIdRows as any[])[0]?.id;
          
          if (roleId) {
            await connection.execute(
              `INSERT INTO lopez_user_roles (user_id, role_id, created_at) VALUES (?, ?, NOW())`,
              [id, roleId]
            );
          }
        }
      } catch (err) {
        console.log("Rollen konnten nicht aktualisiert werden:", err);
      }
    }
    
    await connection.end();
    
    return NextResponse.json({
      success: true,
      message: "Benutzer erfolgreich aktualisiert",
    });
  } catch (error: any) {
    console.error("Fehler beim Aktualisieren des Benutzers:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Benutzer löschen
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Prüfen ob Benutzer existiert
    const [existingRows] = await connection.execute(
      `SELECT * FROM lopez_users WHERE id = ?`,
      [id]
    );
    
    const existing = existingRows as any[];
    
    if (existing.length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }
    
    // Super Admin schützen
    if (existing[0].username === "r.lopezsr") {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Super Admin kann nicht gelöscht werden" },
        { status: 403 }
      );
    }
    
    // 2FA löschen
    try {
      await connection.execute(
        `DELETE FROM lopez_user_2fa WHERE user_id = ?`,
        [id]
      );
    } catch (err) {
      // Tabelle existiert nicht
    }
    
    // Rollen-Zuweisungen löschen
    try {
      await connection.execute(
        `DELETE FROM lopez_user_roles WHERE user_id = ?`,
        [id]
      );
    } catch (err) {
      // Tabelle existiert nicht
    }
    
    // Sessions löschen
    try {
      await connection.execute(
        `DELETE FROM lopez_admin_sessions WHERE user_id = ?`,
        [id]
      );
    } catch (err) {
      // Tabelle existiert nicht
    }
    
    // Benutzer löschen
    await connection.execute(
      `DELETE FROM lopez_users WHERE id = ?`,
      [id]
    );
    
    await connection.end();
    
    return NextResponse.json({
      success: true,
      message: "Benutzer erfolgreich gelöscht",
    });
  } catch (error: any) {
    console.error("Fehler beim Löschen des Benutzers:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Löschen", error: error.message },
      { status: 500 }
    );
  }
}

