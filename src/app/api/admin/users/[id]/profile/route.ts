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
 * GET /api/admin/users/[id]/profile
 * 
 * Lädt das Profil eines Benutzers.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const connection = await mysql.createConnection(dbConfig);

    // Benutzer-Profil laden
    const [users] = await connection.execute(
      `SELECT 
        u.id,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.display_name,
        u.phone,
        u.address,
        u.city,
        u.postal_code,
        u.country,
        u.role_id,
        u.status,
        u.created_at,
        u.updated_at,
        r.role_name
       FROM lopez_core_users u
       LEFT JOIN lopez_core_roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [userId],
    );

    if ((users as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 },
      );
    }

    const user = (users as any[])[0];

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        display_name: user.display_name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postal_code: user.postal_code,
        country: user.country,
        role_id: user.role_id,
        role_name: user.role_name,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Laden des Benutzerprofils", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden des Profils" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/users/[id]/profile
 * 
 * Aktualisiert das Profil eines Benutzers.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    const {
      username,
      email,
      first_name,
      last_name,
      display_name,
      phone,
      address,
      city,
      postal_code,
      country,
      status,
    } = body;

    // Validierung
    if (!username || !email) {
      return NextResponse.json(
        { success: false, message: "Benutzername und E-Mail sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Benutzer existiert
    const [existingUser] = await connection.execute(
      "SELECT id FROM lopez_core_users WHERE id = ?",
      [userId],
    );

    if ((existingUser as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 },
      );
    }

    // Prüfen ob E-Mail bereits von anderem Benutzer verwendet wird
    const [emailCheck] = await connection.execute(
      "SELECT id FROM lopez_core_users WHERE email = ? AND id != ?",
      [email, userId],
    );

    if ((emailCheck as any[]).length > 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "E-Mail wird bereits von einem anderen Benutzer verwendet" },
        { status: 400 },
      );
    }

    // Profil-Version speichern (für Historie) - nur wenn Tabelle existiert
    try {
      const [currentProfile] = await connection.execute(
        `SELECT username, email, first_name, last_name, display_name, phone, address, city, postal_code, country, status FROM lopez_core_users WHERE id = ?`,
        [userId],
      );

      if ((currentProfile as any[]).length > 0) {
        const oldProfile = (currentProfile as any[])[0];
        // Prüfen ob Tabelle existiert
        const [tableCheck] = await connection.execute(
          `SELECT COUNT(*) as count FROM information_schema.tables 
           WHERE table_schema = DATABASE() AND table_name = 'user_profile_history'`,
        );
        
        if ((tableCheck as any[])[0]?.count > 0) {
          await connection.execute(
            `INSERT INTO user_profile_history 
             (user_id, username, email, first_name, last_name, display_name, phone, address, city, postal_code, country, status, changed_at, changed_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'system')`,
            [
              userId,
              oldProfile.username,
              oldProfile.email,
              oldProfile.first_name || null,
              oldProfile.last_name || null,
              oldProfile.display_name || null,
              oldProfile.phone || null,
              oldProfile.address || null,
              oldProfile.city || null,
              oldProfile.postal_code || null,
              oldProfile.country || null,
              oldProfile.status || "active",
            ],
          );
        }
      }
    } catch (historyError) {
      // Historie-Tabelle existiert möglicherweise noch nicht - ignorieren
      logger.error("Fehler beim Speichern der Profil-Historie (Tabelle möglicherweise nicht vorhanden)", historyError);
    }

    // Profil aktualisieren
    await connection.execute(
      `UPDATE lopez_core_users SET 
        username = ?,
        email = ?,
        first_name = ?,
        last_name = ?,
        display_name = ?,
        phone = ?,
        address = ?,
        city = ?,
        postal_code = ?,
        country = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        username,
        email,
        first_name || null,
        last_name || null,
        display_name || null,
        phone || null,
        address || null,
        city || null,
        postal_code || null,
        country || null,
        status || "active",
        userId,
      ],
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('USER_PROFILE_UPDATE', 'lopez_core_users', ?, ?)`,
      [userId, `Profil aktualisiert: ${username}`],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Profil erfolgreich aktualisiert",
    });
  } catch (error) {
    logger.error("Fehler beim Aktualisieren des Benutzerprofils", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren des Profils" },
      { status: 500 },
    );
  }
}

