import { NextRequest, NextResponse } from "next/server";
import { executeQueryPool } from "@/lib/db";
import { RBACService } from "@/lib/rbac-system";
import { AuthService } from "@/lib/auth-service";
import bcrypt from "bcryptjs";

/**
 * Schnell-Setup: Erstellt Admin-Benutzer direkt
 * POST /api/admin/quick-setup
 * 
 * Erstellt Admin-Benutzer in allen möglichen Tabellen
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
    const tables = ["users", "lopez_users", "lopez_core_users"];

    for (const table of tables) {
      try {
        // Prüfe ob Tabelle existiert
        const tableCheck = await executeQueryPool(`SHOW TABLES LIKE '${table}'`, []);

        if (!tableCheck || (Array.isArray(tableCheck) && tableCheck.length === 0)) {
          results.errors.push(`Tabelle ${table} existiert nicht`);
          continue;
        }

        // Prüfe ob Benutzer existiert
        const existing = await executeQueryPool(`SELECT id FROM ${table} WHERE email = ? OR username = ? LIMIT 1`, [email, username]);

        if (existing && Array.isArray(existing) && existing.length > 0) {
          // Aktualisiere Passwort
          await executeQueryPool(`UPDATE ${table} SET password_hash = ?, status = 'active', updated_at = NOW() WHERE email = ? OR username = ?`, [passwordHash, email, username]);
          results.actions.push(`Passwort in ${table} aktualisiert`);
        } else {
          // Erstelle Benutzer
          const result = await executeQueryPool(`INSERT INTO ${table} (username, email, password_hash, first_name, last_name, status, created_at, updated_at) 
                     VALUES (?, ?, ?, ?, ?, 'active', NOW(), NOW())`, [username, email, passwordHash, "System", "Administrator"]);
          
          if (result && (result as any).insertId) {
            results.actions.push(`Benutzer in ${table} erstellt (ID: ${(result as any).insertId})`);
            results.userId = (result as any).insertId;
          }
        }
      } catch (e: any) {
        results.errors.push(`${table}: ${e.message}`);
      }
    }

    // Versuche auch RBACService
    try {
      const existing = await RBACService.getUserByEmail(email);
      if (existing) {
        // Passwort aktualisieren
        await executeQueryPool("UPDATE lopez_users SET password_hash = ?, status = 'active' WHERE email = ?", [passwordHash, email]);
        results.actions.push("Passwort über RBACService aktualisiert");
      } else {
        const user = await RBACService.createUser({
          username,
          email,
          password_hash: passwordHash,
          first_name: "System",
          last_name: "Administrator",
          status: "active",
        });
        if (user) {
          results.actions.push(`Benutzer über RBACService erstellt (ID: ${user.id})`);
          results.userId = user.id;
        }
      }
    } catch (e: any) {
      results.errors.push(`RBACService: ${e.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Admin-Benutzer Setup abgeschlossen",
      credentials: {
        email,
        username,
        password,
      },
      details: results,
    });
  } catch (error: any) {
    console.error("❌ Quick Setup Fehler:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}

