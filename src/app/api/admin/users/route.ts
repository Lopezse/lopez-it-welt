import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import { 
  validateRecheckFromRequest, 
  securityRecheckRequiredResponse 
} from "@/lib/security-recheck-middleware";

// Datenbankverbindung
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
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
export async function GET(request: NextRequest) {
  // Development-Modus: Session-Check gelockert
  const sessionId = request.cookies.get("adm_session")?.value;
  const sessionToken = request.cookies.get("adm_token")?.value;
  
  console.log("📋 Users API: Auth-Check (session:", !!sessionId, ", token:", !!sessionToken, ")");
  
  // In Development: Auch ohne Auth weitermachen (für Debugging)
  // TODO: In Production strenger prüfen
  
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Versuche zuerst lopez_users (Haupttabelle), fallback auf lopez_core_users
    let rows: any[] = [];
    
    console.log("📋 Lade Benutzer aus Datenbank...");
    
    // Haupttabelle: lopez_users mit 2FA-Status
    console.log("📋 Lade Benutzer aus lopez_users...");
    const [mainRows] = await connection.execute(`
      SELECT 
        u.id,
        u.username,
        u.email,
        COALESCE(u.first_name, '') as first_name,
        COALESCE(u.last_name, '') as last_name,
        COALESCE(u.status, 'active') as status,
        CASE WHEN f.user_id IS NOT NULL THEN 1 ELSE 0 END as two_factor_enabled,
        u.created_at,
        u.updated_at
      FROM lopez_users u
      LEFT JOIN lopez_user_2fa f ON u.id = f.user_id
      ORDER BY u.created_at DESC
    `);
    rows = mainRows as any[];
    console.log(`✅ ${rows.length} Benutzer aus lopez_users geladen`);
    
    // Rollen für jeden Benutzer setzen (vereinfacht)
    for (const user of rows) {
      // Super Admin für r.lopezsr, sonst User
      if (user.username === 'r.lopezsr') {
        user.roles = ['Super Admin'];
      } else {
        // Versuche Rollen aus lopez_user_roles zu laden
        try {
          const [roleRows] = await connection.execute(`
            SELECT r.role_name 
            FROM lopez_user_roles ur
            JOIN lopez_roles r ON ur.role_id = r.id
            WHERE ur.user_id = ?
          `, [user.id]);
          user.roles = (roleRows as any[]).map((r: any) => r.role_name);
          if (user.roles.length === 0) {
            user.roles = ['User'];
          }
        } catch {
          user.roles = ['User'];
        }
      }
    }

    await connection.end();

    console.log(`✅ Benutzerliste geladen: ${rows.length} Benutzer`);
    if (rows.length > 0) {
      console.log("Erster Benutzer:", rows[0].username);
    }

    return NextResponse.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error: any) {
    console.error("❌ Benutzer laden Fehler:", error.message || error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Benutzer", error: error.message },
      { status: 500 },
    );
  }
}

// Helper-Funktion für Session-Check
function checkAdminSession(request: NextRequest): boolean {
  const sessionId = request.cookies.get("adm_session")?.value;
  const sessionToken = request.cookies.get("adm_token")?.value;
  
  // Development-Modus: Token oder Session reicht
  return !!(sessionId || sessionToken);
}

// POST - Neuen Benutzer erstellen (nur für Admins)
// 🔐 SECURITY-RECHECK ERFORDERLICH
export async function POST(request: NextRequest) {
  const hasAccess = checkAdminSession(request);
  if (!hasAccess) {
    return NextResponse.json(
      { success: false, message: "Nicht authentifiziert" },
      { status: 401 }
    );
  }
  
  // Security-Recheck prüfen
  const recheckResult = validateRecheckFromRequest(request);
  if (!recheckResult.valid) {
    return securityRecheckRequiredResponse("Bitte bestätige dein Passwort, um einen Benutzer zu erstellen.");
  }
  
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
}

// PUT - Benutzer aktualisieren (nur für Admins)
// 🔐 SECURITY-RECHECK ERFORDERLICH
export async function PUT(request: NextRequest) {
  const hasAccess = checkAdminSession(request);
  if (!hasAccess) {
    return NextResponse.json(
      { success: false, message: "Nicht authentifiziert" },
      { status: 401 }
    );
  }
  
  // Security-Recheck prüfen
  const recheckResult = validateRecheckFromRequest(request);
  if (!recheckResult.valid) {
    return securityRecheckRequiredResponse("Bitte bestätige dein Passwort, um einen Benutzer zu bearbeiten.");
  }
  
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
}

// DELETE - Benutzer löschen (nur für Admins)
// 🔐 SECURITY-RECHECK ERFORDERLICH
export async function DELETE(request: NextRequest) {
  const hasAccess = checkAdminSession(request);
  if (!hasAccess) {
    return NextResponse.json(
      { success: false, message: "Nicht authentifiziert" },
      { status: 401 }
    );
  }
  
  // Security-Recheck prüfen
  const recheckResult = validateRecheckFromRequest(request);
  if (!recheckResult.valid) {
    return securityRecheckRequiredResponse("Bitte bestätige dein Passwort, um einen Benutzer zu löschen.");
  }
  
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
}
