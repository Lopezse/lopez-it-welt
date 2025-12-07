/**
 * Enterprise++ API: Rechtliche Einstellungen
 * GET /api/admin/settings/company/legal - Rechtliche Texte abrufen
 * PUT /api/admin/settings/company/legal - Rechtliche Texte aktualisieren
 */

import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
};

/**
 * GET: Rechtliche Einstellungen abrufen
 */
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Rechtliche Einstellungen laden
    const [rows] = await connection.execute(
      `SELECT * FROM lopez_settings WHERE category = 'legal'`
    );
    
    await connection.end();
    
    // Einstellungen in Objekt umwandeln
    const settings: Record<string, any> = {};
    for (const row of rows as any[]) {
      settings[row.setting_key] = row.setting_value;
    }
    
    // Standard-Werte
    const defaults = {
      impressum: "",
      datenschutz: "",
      agb: "",
      widerrufsbelehrung: "",
      cookie_policy: "",
      company_name: "Lopez IT Welt",
      company_address: "",
      company_email: "",
      company_phone: "",
      company_vat_id: "",
      company_register: "",
      responsible_person: "",
    };
    
    return NextResponse.json({
      success: true,
      data: { ...defaults, ...settings },
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der rechtlichen Einstellungen:", error);
    
    // Fallback
    return NextResponse.json({
      success: true,
      data: {
        impressum: "",
        datenschutz: "",
        company_name: "Lopez IT Welt",
      },
    });
  }
}

/**
 * PUT: Rechtliche Einstellungen aktualisieren
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const connection = await mysql.createConnection(dbConfig);
    
    // Erlaubte Einstellungen
    const allowedKeys = [
      "impressum",
      "datenschutz",
      "agb",
      "widerrufsbelehrung",
      "cookie_policy",
      "company_name",
      "company_address",
      "company_email",
      "company_phone",
      "company_vat_id",
      "company_register",
      "responsible_person",
    ];
    
    for (const [key, value] of Object.entries(body)) {
      if (!allowedKeys.includes(key)) continue;
      
      // Prüfen ob Einstellung existiert
      const [existing] = await connection.execute(
        `SELECT id FROM lopez_settings WHERE category = 'legal' AND setting_key = ?`,
        [key]
      );
      
      if ((existing as any[]).length > 0) {
        await connection.execute(
          `UPDATE lopez_settings SET setting_value = ?, updated_at = NOW() WHERE category = 'legal' AND setting_key = ?`,
          [String(value), key]
        );
      } else {
        await connection.execute(
          `INSERT INTO lopez_settings (category, setting_key, setting_value, created_at, updated_at) VALUES ('legal', ?, ?, NOW(), NOW())`,
          [key, String(value)]
        );
      }
    }
    
    await connection.end();
    
    return NextResponse.json({
      success: true,
      message: "Rechtliche Einstellungen erfolgreich aktualisiert",
    });
  } catch (error: any) {
    console.error("Fehler beim Aktualisieren der rechtlichen Einstellungen:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren", error: error.message },
      { status: 500 }
    );
  }
}










