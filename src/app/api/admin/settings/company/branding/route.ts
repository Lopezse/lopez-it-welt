/**
 * Enterprise++ API: Branding-Einstellungen
 * GET /api/admin/settings/company/branding - Branding abrufen
 * PUT /api/admin/settings/company/branding - Branding aktualisieren
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
 * GET: Branding-Einstellungen abrufen
 */
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Branding-Einstellungen laden
    const [rows] = await connection.execute(
      `SELECT * FROM lopez_settings WHERE category = 'branding'`
    );
    
    await connection.end();
    
    // Einstellungen in Objekt umwandeln
    const settings: Record<string, any> = {};
    for (const row of rows as any[]) {
      settings[row.setting_key] = row.setting_value;
    }
    
    // Standard-Werte
    const defaults = {
      logo_light: "/images/logo-light.svg",
      logo_dark: "/images/logo-dark.svg",
      favicon: "/favicon.ico",
      primary_color: "#C99700",
      secondary_color: "#007bff",
      accent_color: "#0056b3",
      font_family: "Inter, sans-serif",
      border_radius: "8px",
      shadow_style: "soft",
    };
    
    return NextResponse.json({
      success: true,
      data: { ...defaults, ...settings },
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der Branding-Einstellungen:", error);
    
    // Fallback
    return NextResponse.json({
      success: true,
      data: {
        logo_light: "/images/logo-light.svg",
        logo_dark: "/images/logo-dark.svg",
        primary_color: "#C99700",
        secondary_color: "#007bff",
      },
    });
  }
}

/**
 * PUT: Branding-Einstellungen aktualisieren
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const connection = await mysql.createConnection(dbConfig);
    
    // Erlaubte Einstellungen
    const allowedKeys = [
      "logo_light",
      "logo_dark",
      "favicon",
      "primary_color",
      "secondary_color",
      "accent_color",
      "font_family",
      "border_radius",
      "shadow_style",
      "custom_css",
    ];
    
    for (const [key, value] of Object.entries(body)) {
      if (!allowedKeys.includes(key)) continue;
      
      // Prüfen ob Einstellung existiert
      const [existing] = await connection.execute(
        `SELECT id FROM lopez_settings WHERE category = 'branding' AND setting_key = ?`,
        [key]
      );
      
      if ((existing as any[]).length > 0) {
        await connection.execute(
          `UPDATE lopez_settings SET setting_value = ?, updated_at = NOW() WHERE category = 'branding' AND setting_key = ?`,
          [String(value), key]
        );
      } else {
        await connection.execute(
          `INSERT INTO lopez_settings (category, setting_key, setting_value, created_at, updated_at) VALUES ('branding', ?, ?, NOW(), NOW())`,
          [key, String(value)]
        );
      }
    }
    
    await connection.end();
    
    return NextResponse.json({
      success: true,
      message: "Branding-Einstellungen erfolgreich aktualisiert",
    });
  } catch (error: any) {
    console.error("Fehler beim Aktualisieren der Branding-Einstellungen:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren", error: error.message },
      { status: 500 }
    );
  }
}










