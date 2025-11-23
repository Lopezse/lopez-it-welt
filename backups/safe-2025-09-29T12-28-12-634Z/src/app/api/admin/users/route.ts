import { withAdminAccess } from "@/lib/rbac-middleware";
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

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  role_name: string;
  role_code: string;
  status: "active" | "inactive" | "locked" | "pending" | "suspended";
  email_verified: boolean;
  two_factor_enabled: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

// GET - Alle Benutzer abrufen (nur für Admins)
export const GET = withAdminAccess("users.view")(async (request: NextRequest) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(`
            SELECT 
                u.id,
                u.username,
                u.email,
                u.first_name,
                u.last_name,
                u.role_id,
                r.role_name,
                r.role_code,
                u.status,
                u.email_verified,
                u.two_factor_enabled,
                u.last_login_at,
                u.created_at,
                u.updated_at
            FROM lopez_core_users u
            LEFT JOIN lopez_core_roles r ON u.role_id = r.id
            ORDER BY u.created_at DESC
        `);

    await connection.end();

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    // Benutzer laden Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Benutzer" },
      { status: 500 },
    );
  }
});

// POST - Neuen Benutzer erstellen (nur für Admins)
export const POST = withAdminAccess("users.create")(async (request: NextRequest) => {
  try {
    const { username, email, first_name, last_name, role_id, password } = await request.json();

    // Validierung
    if (!username || !email || !first_name || !last_name || !role_id || !password) {
      return NextResponse.json(
        { success: false, message: "Alle Felder sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Benutzer bereits existiert
    const [existingUser] = await connection.execute(
      "SELECT id FROM lopez_core_users WHERE username = ? OR email = ?",
      [username, email],
    );

    if ((existingUser as any[]).length > 0) {
      await connection.end();
      return NextResponse.json(
        {
          success: false,
          message: "Benutzername oder E-Mail bereits vorhanden",
        },
        { status: 400 },
      );
    }

    // Passwort hashen
    const bcrypt = require("bcrypt");
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Benutzer-ID generieren
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Benutzer erstellen
    await connection.execute(
      `INSERT INTO lopez_core_users (
                id, username, email, password_hash, first_name, last_name, 
                role_id, status, email_verified, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        username,
        email,
        passwordHash,
        first_name,
        last_name,
        role_id,
        "active",
        true,
        "system",
      ],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        message: "Benutzer erfolgreich erstellt",
        data: { id: userId, username, email },
      },
      { status: 201 },
    );
  } catch (error) {
    // Benutzer erstellen Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler beim Erstellen des Benutzers" },
      { status: 500 },
    );
  }
});

// PUT - Benutzer aktualisieren (nur für Admins)
export const PUT = withAdminAccess("users.update")(async (request: NextRequest) => {
  try {
    const { id, username, email, first_name, last_name, role_id, status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Benutzer-ID ist erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Benutzer existiert
    const [existingUser] = await connection.execute(
      "SELECT id FROM lopez_core_users WHERE id = ?",
      [id],
    );

    if ((existingUser as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 },
      );
    }

    // Benutzer aktualisieren
    await connection.execute(
      `UPDATE lopez_core_users SET 
                username = ?, email = ?, first_name = ?, last_name = ?, 
                role_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?`,
      [username, email, first_name, last_name, role_id, status, id],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Benutzer erfolgreich aktualisiert",
    });
  } catch (error) {
    // Benutzer aktualisieren Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren des Benutzers" },
      { status: 500 },
    );
  }
});

// DELETE - Benutzer löschen (nur für Admins)
export const DELETE = withAdminAccess("users.delete")(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Benutzer-ID ist erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Benutzer existiert
    const [existingUser] = await connection.execute(
      "SELECT id FROM lopez_core_users WHERE id = ?",
      [id],
    );

    if ((existingUser as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 },
      );
    }

    // Benutzer löschen
    await connection.execute("DELETE FROM lopez_core_users WHERE id = ?", [id]);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Benutzer erfolgreich gelöscht",
    });
  } catch (error) {
    // Benutzer löschen Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler beim Löschen des Benutzers" },
      { status: 500 },
    );
  }
});
