import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

/**
 * Testet verschiedene Datenbank-Konfigurationen
 * GET /api/admin/test-db-connection
 */
export async function GET(request: NextRequest) {
  const results: any = {
    tests: [],
    working: null,
  };

  // Verschiedene Konfigurationen testen
  const configs = [
    { name: "Ohne Passwort", config: { host: "localhost", user: "root", password: "", database: "lopez_it_welt", port: 3306 } },
    { name: "Mit leerem String", config: { host: "localhost", user: "root", password: "", database: "lopez_it_welt", port: 3306 } },
    { name: "Mit undefined Passwort", config: { host: "localhost", user: "root", database: "lopez_it_welt", port: 3306 } },
    { name: "Environment-Variablen", config: { 
      host: process.env.DB_HOST || "localhost", 
      user: process.env.DB_USER || "root", 
      password: process.env.DB_PASSWORD || "", 
      database: process.env.DB_NAME || "lopez_it_welt", 
      port: parseInt(process.env.DB_PORT || "3306") 
    }},
  ];

  for (const test of configs) {
    try {
      const connection = await mysql.createConnection(test.config);
      await connection.execute("SELECT 1");
      await connection.end();
      
      results.tests.push({
        name: test.name,
        status: "✅ ERFOLG",
        config: { ...test.config, password: test.config.password ? "***" : "(leer)" },
      });
      
      if (!results.working) {
        results.working = test.name;
      }
    } catch (error: any) {
      results.tests.push({
        name: test.name,
        status: "❌ FEHLER",
        error: error.message,
        config: { ...test.config, password: test.config.password ? "***" : "(leer)" },
      });
    }
  }

  return NextResponse.json({
    success: results.working !== null,
    message: results.working 
      ? `Funktionierende Konfiguration gefunden: ${results.working}`
      : "Keine funktionierende Konfiguration gefunden",
    details: results,
    recommendation: results.working 
      ? "Verwenden Sie diese Konfiguration in Ihrer .env Datei"
      : "Bitte setzen Sie das MySQL root-Passwort zurück oder konfigurieren Sie die .env Datei mit dem korrekten Passwort",
  });
}

