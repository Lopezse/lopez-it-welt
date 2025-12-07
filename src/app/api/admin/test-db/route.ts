import { NextRequest, NextResponse } from "next/server";
import { executeQueryPool } from "@/lib/db";
import { getConnectionPool } from "@/lib/db";

/**
 * Testet die Datenbankverbindung
 * GET /api/admin/test-db
 */
export async function GET(request: NextRequest) {
  try {
    const results: any = {
      connection: "unknown",
      tables: [],
      errors: [],
    };

    // 1. Verbindung testen
    try {
      const test = await executeQueryPool("SELECT 1 as test", []);
      results.connection = "OK";
    } catch (e: any) {
      results.connection = "FEHLER";
      results.errors.push(`Verbindung: ${e.message || String(e)}`);
      
      // Wenn AggregateError, alle Fehler auflisten
      if (e && typeof e === "object" && "errors" in e && Array.isArray((e as any).errors)) {
        results.errors.push(...((e as any).errors.map((err: any) => err.message || String(err)) || []));
      }
      
      return NextResponse.json({
        success: false,
        message: "Datenbankverbindung fehlgeschlagen",
        details: results,
      }, { status: 500 });
    }

    // 2. Tabellen auflisten
    try {
      const tables = await executeQueryPool("SHOW TABLES", []);
      results.tables = Array.isArray(tables) 
        ? tables.map((t: any) => Object.values(t)[0])
        : [];
    } catch (e: any) {
      results.errors.push(`Tabellen-Liste: ${e.message || String(e)}`);
    }

    // 3. Prüfe ob lopez_users existiert
    const hasLopezUsers = results.tables.includes("lopez_users");
    const hasUsers = results.tables.includes("users");
    const hasLopezCoreUsers = results.tables.includes("lopez_core_users");

    // 4. Prüfe ob Admin-Benutzer existiert
    let adminExists = false;
    let adminInTable = null;
    
    if (hasLopezUsers) {
      try {
        const admin = await executeQueryPool("SELECT id, username, email, status FROM lopez_users WHERE email = ? OR username = ? LIMIT 1", ["admin@lopez-it-welt.de", "admin"]);
        if (admin && Array.isArray(admin) && admin.length > 0) {
          adminExists = true;
          adminInTable = "lopez_users";
        }
      } catch (e: any) {
        results.errors.push(`Admin-Prüfung (lopez_users): ${e.message || String(e)}`);
      }
    }

    if (!adminExists && hasUsers) {
      try {
        const admin = await executeQueryPool("SELECT id, username, email, status FROM users WHERE email = ? OR username = ? LIMIT 1", ["admin@lopez-it-welt.de", "admin"]);
        if (admin && Array.isArray(admin) && admin.length > 0) {
          adminExists = true;
          adminInTable = "users";
        }
      } catch (e: any) {
        results.errors.push(`Admin-Prüfung (users): ${e.message || String(e)}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Datenbank-Test abgeschlossen",
      details: {
        ...results,
        hasLopezUsers,
        hasUsers,
        hasLopezCoreUsers,
        adminExists,
        adminInTable,
        recommendation: !hasLopezUsers && !hasUsers 
          ? "Führen Sie /api/admin/init-database aus"
          : !adminExists
          ? "Führen Sie /api/admin/create-admin aus"
          : "Datenbank ist bereit",
      },
    });
  } catch (error: any) {
    console.error("❌ DB-Test Fehler:", error);
    return NextResponse.json({
      success: false,
      error: error.message || String(error),
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}

