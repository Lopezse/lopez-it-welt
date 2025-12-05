import { NextRequest, NextResponse } from "next/server";
import { executeQueryPool } from "@/lib/db";
import bcrypt from "bcryptjs";

/**
 * Erstellt Admin-Benutzer direkt in der Datenbank
 * POST /api/admin/create-admin
 */
export async function POST(request: NextRequest) {
  try {
    const email = "admin@lopez-it-welt.de";
    const username = "admin";
    const password = "admin123";
    const passwordHash = await bcrypt.hash(password, 10);

    const results: any = {
      email,
      username,
      actions: [],
      errors: [],
    };

    // Versuche verschiedene Tabellen
    const tables = [
      { name: "lopez_users", fields: "username, email, password_hash, first_name, last_name, status, created_at, updated_at" },
      { name: "users", fields: "username, email, password_hash, first_name, last_name, status, created_at, updated_at" },
      { name: "lopez_core_users", fields: "username, email, password_hash, first_name, last_name, role_id, two_fa_enabled, created_at, updated_at" },
    ];

    for (const table of tables) {
      try {
        // Prüfe ob Tabelle existiert
        const tableCheck = await executeQueryPool({
          query: `SHOW TABLES LIKE '${table.name}'`,
          values: [],
        });

        if (!tableCheck || (Array.isArray(tableCheck) && tableCheck.length === 0)) {
          results.errors.push(`Tabelle ${table.name} existiert nicht`);
          continue;
        }

        // Prüfe ob Benutzer existiert
        const existing = await executeQueryPool({
          query: `SELECT id FROM ${table.name} WHERE email = ? OR username = ? LIMIT 1`,
          values: [email, username],
        });

        if (existing && Array.isArray(existing) && existing.length > 0) {
          // Aktualisiere Passwort
          await executeQueryPool({
            query: `UPDATE ${table.name} SET password_hash = ?, status = 'active', updated_at = NOW() WHERE email = ? OR username = ?`,
            values: [passwordHash, email, username],
          });
          results.actions.push(`✅ Passwort in ${table.name} aktualisiert`);
          results.userId = existing[0].id;
        } else {
          // Erstelle Benutzer
          if (table.name === "lopez_core_users") {
            // Spezielle Behandlung für lopez_core_users (braucht role_id)
            const result = await executeQueryPool({
              query: `INSERT INTO ${table.name} (username, email, password_hash, first_name, last_name, role_id, two_fa_enabled, created_at, updated_at) 
                       VALUES (?, ?, ?, ?, ?, 1, FALSE, NOW(), NOW())`,
              values: [username, email, passwordHash, "System", "Administrator"],
            });
            if (result && (result as any).insertId) {
              results.actions.push(`✅ Benutzer in ${table.name} erstellt (ID: ${(result as any).insertId})`);
              results.userId = (result as any).insertId;
            }
          } else {
            const result = await executeQueryPool({
              query: `INSERT INTO ${table.name} (username, email, password_hash, first_name, last_name, status, created_at, updated_at) 
                       VALUES (?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
              values: [username, email, passwordHash, "System", "Administrator"],
            });
            if (result && (result as any).insertId) {
              results.actions.push(`✅ Benutzer in ${table.name} erstellt (ID: ${(result as any).insertId})`);
              results.userId = (result as any).insertId;
            }
          }
        }
      } catch (e: any) {
        results.errors.push(`${table.name}: ${e.message}`);
      }
    }

    if (results.actions.length === 0 && results.errors.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Admin-Benutzer konnte nicht erstellt werden",
        details: results,
        hint: "Bitte führen Sie zuerst /api/admin/init-database aus, um die Tabellen zu erstellen.",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Admin-Benutzer erfolgreich erstellt/aktualisiert",
      credentials: {
        email,
        username,
        password,
      },
      details: results,
    });
  } catch (error: any) {
    console.error("❌ Create Admin Fehler:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}

