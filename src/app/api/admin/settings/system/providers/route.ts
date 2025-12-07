/**
 * Enterprise++ API: Provider-Einstellungen
 * GET /api/admin/settings/system/providers - Provider abrufen
 * PUT /api/admin/settings/system/providers - Provider aktualisieren
 */

import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
};

interface Provider {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  config: Record<string, any>;
  status: string;
  last_check: string | null;
}

/**
 * GET: Provider-Einstellungen abrufen
 */
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Provider laden
    let providers: Provider[] = [];
    
    try {
      const [rows] = await connection.execute(
        `SELECT * FROM lopez_providers ORDER BY name`
      );
      providers = (rows as any[]).map(row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        enabled: row.enabled === 1,
        config: row.config ? JSON.parse(row.config) : {},
        status: row.status || "unknown",
        last_check: row.last_check,
      }));
    } catch (err) {
      // Tabelle existiert möglicherweise nicht, Standard-Provider zurückgeben
      console.log("Provider-Tabelle nicht vorhanden, verwende Standard-Provider");
    }
    
    await connection.end();
    
    // Standard-Provider falls keine vorhanden
    if (providers.length === 0) {
      providers = [
        {
          id: "openai",
          name: "OpenAI",
          type: "ai",
          enabled: !!process.env.OPENAI_API_KEY,
          config: { model: "gpt-4o-mini" },
          status: process.env.OPENAI_API_KEY ? "configured" : "not_configured",
          last_check: null,
        },
        {
          id: "email",
          name: "E-Mail (SMTP)",
          type: "email",
          enabled: !!process.env.SMTP_HOST,
          config: { host: process.env.SMTP_HOST || "" },
          status: process.env.SMTP_HOST ? "configured" : "not_configured",
          last_check: null,
        },
        {
          id: "storage",
          name: "Dateispeicher",
          type: "storage",
          enabled: true,
          config: { type: "local", path: "./uploads" },
          status: "active",
          last_check: null,
        },
      ];
    }
    
    return NextResponse.json({
      success: true,
      data: providers,
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der Provider:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT: Provider-Einstellungen aktualisieren
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, enabled, config } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Provider-ID erforderlich" },
        { status: 400 }
      );
    }
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Tabelle erstellen falls nicht vorhanden
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS lopez_providers (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        enabled TINYINT(1) DEFAULT 0,
        config JSON,
        status VARCHAR(50) DEFAULT 'unknown',
        last_check DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Prüfen ob Provider existiert
    const [existing] = await connection.execute(
      `SELECT id FROM lopez_providers WHERE id = ?`,
      [id]
    );
    
    if ((existing as any[]).length > 0) {
      await connection.execute(
        `UPDATE lopez_providers SET enabled = ?, config = ?, updated_at = NOW() WHERE id = ?`,
        [enabled ? 1 : 0, JSON.stringify(config || {}), id]
      );
    } else {
      await connection.execute(
        `INSERT INTO lopez_providers (id, name, type, enabled, config, created_at, updated_at)
         VALUES (?, ?, 'custom', ?, ?, NOW(), NOW())`,
        [id, id, enabled ? 1 : 0, JSON.stringify(config || {})]
      );
    }
    
    await connection.end();
    
    return NextResponse.json({
      success: true,
      message: "Provider erfolgreich aktualisiert",
    });
  } catch (error: any) {
    console.error("Fehler beim Aktualisieren des Providers:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST: Provider-Status prüfen
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;
    
    if (action === "test") {
      // Provider-Test simulieren
      // In der echten Implementierung würde hier die Verbindung getestet
      
      let status = "unknown";
      let message = "Test nicht implementiert";
      
      switch (id) {
        case "openai":
          status = process.env.OPENAI_API_KEY ? "active" : "error";
          message = process.env.OPENAI_API_KEY 
            ? "OpenAI API-Key konfiguriert" 
            : "OpenAI API-Key nicht gesetzt";
          break;
        case "email":
          status = process.env.SMTP_HOST ? "active" : "error";
          message = process.env.SMTP_HOST 
            ? "SMTP-Server konfiguriert" 
            : "SMTP-Server nicht konfiguriert";
          break;
        case "storage":
          status = "active";
          message = "Lokaler Speicher verfügbar";
          break;
      }
      
      return NextResponse.json({
        success: true,
        data: { id, status, message, tested_at: new Date().toISOString() },
      });
    }
    
    return NextResponse.json(
      { success: false, message: "Unbekannte Aktion" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Fehler beim Provider-Test:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Test", error: error.message },
      { status: 500 }
    );
  }
}










