import { NextRequest, NextResponse } from "next/server";
import { executeQueryPool } from "@/lib/db";
import { RBACService } from "@/lib/rbac-system";
import bcrypt from "bcryptjs";

/**
 * Debug-Route für Login-Probleme
 * GET /api/admin/debug-login?email=admin@lopez-it-welt.de
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "admin@lopez-it-welt.de";

    const results: any = {
      email,
      checks: {},
      errors: [],
    };

    // 1. Datenbankverbindung prüfen
    try {
      const test = await executeQueryPool({
        query: "SELECT 1 as test",
        values: [],
      });
      results.checks.database = "OK";
    } catch (error: any) {
      results.checks.database = "FEHLER";
      results.errors.push(`Datenbankverbindung: ${error.message}`);
    }

    // 2. Users-Tabelle prüfen
    try {
      const tables = await executeQueryPool({
        query: "SHOW TABLES LIKE 'users' OR SHOW TABLES LIKE 'lopez_users' OR SHOW TABLES LIKE 'lopez_core_users'",
        values: [],
      });
      results.checks.usersTable = tables && tables.length > 0 ? "GEFUNDEN" : "NICHT GEFUNDEN";
    } catch (error: any) {
      results.checks.usersTable = "FEHLER";
      results.errors.push(`Users-Tabelle: ${error.message}`);
    }

    // 3. Benutzer suchen
    try {
      // Versuche verschiedene Tabellennamen
      let user = null;
      
      // Versuch 1: users
      try {
        const users1 = await executeQueryPool({
          query: "SELECT id, username, email, password_hash, status FROM users WHERE email = ? LIMIT 1",
          values: [email],
        });
        if (users1 && users1.length > 0) {
          user = users1[0];
          results.checks.userFound = "JA (users-Tabelle)";
        }
      } catch (e) {
        // Ignorieren
      }

      // Versuch 2: lopez_users
      if (!user) {
        try {
          const users2 = await executeQueryPool({
            query: "SELECT id, username, email, password_hash, status FROM lopez_users WHERE email = ? LIMIT 1",
            values: [email],
          });
          if (users2 && users2.length > 0) {
            user = users2[0];
            results.checks.userFound = "JA (lopez_users-Tabelle)";
          }
        } catch (e) {
          // Ignorieren
        }
      }

      // Versuch 3: lopez_core_users
      if (!user) {
        try {
          const users3 = await executeQueryPool({
            query: "SELECT id, username, email, password_hash, status FROM lopez_core_users WHERE email = ? LIMIT 1",
            values: [email],
          });
          if (users3 && users3.length > 0) {
            user = users3[0];
            results.checks.userFound = "JA (lopez_core_users-Tabelle)";
          }
        } catch (e) {
          // Ignorieren
        }
      }

      // Versuch 4: RBACService
      if (!user) {
        try {
          const rbacUser = await RBACService.getUserByEmail(email);
          if (rbacUser) {
            user = rbacUser;
            results.checks.userFound = "JA (RBACService)";
          }
        } catch (e: any) {
          results.errors.push(`RBACService: ${e.message}`);
        }
      }

      if (!user) {
        results.checks.userFound = "NEIN";
        results.errors.push("Benutzer nicht gefunden in keiner Tabelle");
      } else {
        results.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          status: user.status,
          hasPassword: !!user.password_hash,
          passwordHashLength: user.password_hash ? user.password_hash.length : 0,
        };

        // Passwort-Test mit Standard-Passwort
        if (user.password_hash) {
          try {
            const testPassword = "admin123";
            const isValid = await bcrypt.compare(testPassword, user.password_hash);
            results.passwordTest = {
              tested: testPassword,
              valid: isValid,
            };
          } catch (e: any) {
            results.passwordTest = {
              error: e.message,
            };
          }
        }
      }
    } catch (error: any) {
      results.checks.userFound = "FEHLER";
      results.errors.push(`Benutzer-Suche: ${error.message}`);
    }

    // 4. Alle Tabellen auflisten
    try {
      const allTables = await executeQueryPool({
        query: "SHOW TABLES",
        values: [],
      });
      results.allTables = allTables.map((t: any) => Object.values(t)[0]);
    } catch (error: any) {
      results.errors.push(`Tabellen-Liste: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      debug: results,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

