import { NextRequest, NextResponse } from "next/server";
import { executeQueryPool } from "@/lib/db";
import { RBACService } from "@/lib/rbac-system";
import { AuthService } from "@/lib/auth-service";
import bcrypt from "bcryptjs";

/**
 * Erstellt oder setzt den Admin-Benutzer zurück
 * POST /api/admin/fix-admin-user
 * 
 * Body: { password?: string } (optional, Standard: "admin123")
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const newPassword = body.password || "admin123";
    const email = "admin@lopez-it-welt.de";
    const username = "admin";

    const results: any = {
      email,
      username,
      actions: [],
      errors: [],
    };

    // 1. Prüfe ob Benutzer existiert (verschiedene Tabellen)
    let user = null;
    let userTable = null;

    // Versuch 1: users
    try {
      const users = await executeQueryPool({
        query: "SELECT id, username, email, password_hash, status FROM users WHERE email = ? OR username = ? LIMIT 1",
        values: [email, username],
      });
      if (users && Array.isArray(users) && users.length > 0) {
        user = users[0];
        userTable = "users";
      }
    } catch (e: any) {
      results.errors.push(`users-Tabelle: ${e.message}`);
    }

    // Versuch 2: lopez_users
    if (!user) {
      try {
        const users = await executeQueryPool({
          query: "SELECT id, username, email, password_hash, status FROM lopez_users WHERE email = ? OR username = ? LIMIT 1",
          values: [email, username],
        });
        if (users && Array.isArray(users) && users.length > 0) {
          user = users[0];
          userTable = "lopez_users";
        }
      } catch (e: any) {
        results.errors.push(`lopez_users-Tabelle: ${e.message}`);
      }
    }

    // Versuch 3: lopez_core_users
    if (!user) {
      try {
        const users = await executeQueryPool({
          query: "SELECT id, username, email, password_hash, status FROM lopez_core_users WHERE email = ? OR username = ? LIMIT 1",
          values: [email, username],
        });
        if (users && Array.isArray(users) && users.length > 0) {
          user = users[0];
          userTable = "lopez_core_users";
        }
      } catch (e: any) {
        results.errors.push(`lopez_core_users-Tabelle: ${e.message}`);
      }
    }

    // 2. Passwort hashen
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // 3. Benutzer erstellen oder aktualisieren
    if (user && userTable) {
      // Benutzer existiert - Passwort aktualisieren
      try {
        await executeQueryPool({
          query: `UPDATE ${userTable} SET password_hash = ?, status = 'active', updated_at = NOW() WHERE id = ?`,
          values: [passwordHash, user.id],
        });
        results.actions.push(`Passwort für Benutzer ${user.id} in Tabelle ${userTable} aktualisiert`);
        results.userId = user.id;
      } catch (e: any) {
        results.errors.push(`Passwort-Update fehlgeschlagen: ${e.message}`);
      }
    } else {
      // Benutzer existiert nicht - erstellen
      // Versuche verschiedene Tabellen
      let created = false;

      // Versuch 1: users
      try {
        const result = await executeQueryPool({
          query: `INSERT INTO users (username, email, password_hash, first_name, last_name, status, created_at, updated_at) 
                   VALUES (?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
          values: [username, email, passwordHash, "System", "Administrator"],
        });
        if (result && (result as any).insertId) {
          results.actions.push(`Benutzer in users-Tabelle erstellt (ID: ${(result as any).insertId})`);
          results.userId = (result as any).insertId;
          created = true;
        }
      } catch (e: any) {
        results.errors.push(`Erstellen in users-Tabelle: ${e.message}`);
      }

      // Versuch 2: lopez_users
      if (!created) {
        try {
          const result = await executeQueryPool({
            query: `INSERT INTO lopez_users (username, email, password_hash, first_name, last_name, status, created_at, updated_at) 
                     VALUES (?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
            values: [username, email, passwordHash, "System", "Administrator"],
          });
          if (result && (result as any).insertId) {
            results.actions.push(`Benutzer in lopez_users-Tabelle erstellt (ID: ${(result as any).insertId})`);
            results.userId = (result as any).insertId;
            created = true;
          }
        } catch (e: any) {
          results.errors.push(`Erstellen in lopez_users-Tabelle: ${e.message}`);
        }
      }

      // Versuch 3: RBACService
      if (!created) {
        try {
          const rbacUser = await RBACService.createUser({
            username,
            email,
            password_hash: passwordHash,
            first_name: "System",
            last_name: "Administrator",
            status: "active",
          });
          if (rbacUser) {
            results.actions.push(`Benutzer über RBACService erstellt (ID: ${rbacUser.id})`);
            results.userId = rbacUser.id;
            created = true;
          }
        } catch (e: any) {
          results.errors.push(`RBACService: ${e.message}`);
        }
      }

      if (!created) {
        return NextResponse.json({
          success: false,
          error: "Benutzer konnte in keiner Tabelle erstellt werden",
          details: results,
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Admin-Benutzer erfolgreich erstellt/aktualisiert",
      credentials: {
        email,
        username,
        password: newPassword,
      },
      details: results,
    });
  } catch (error: any) {
    console.error("❌ Fix Admin User Fehler:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}

