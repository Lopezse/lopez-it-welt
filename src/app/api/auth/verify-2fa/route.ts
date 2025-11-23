import { NextRequest, NextResponse } from "next/server";

// Datenbankverbindung
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_erp",
  port: parseInt(process.env.DB_PORT || "3306"),
};

export async function POST(request: NextRequest) {
  try {
    const { email, totpCode } = await request.json();

    // Validierung
    if (!email || !totpCode) {
      return NextResponse.json(
        { success: false, message: "E-Mail und 2FA-Code sind erforderlich" },
        { status: 400 },
      );
    }

    // 2FA-Code validieren (6-stellig)
    if (!/^\d{6}$/.test(totpCode)) {
      return NextResponse.json(
        { success: false, message: "2FA-Code muss 6-stellig sein" },
        { status: 400 },
      );
    }

    // Demo-Benutzer (ohne Datenbank für jetzt)
    const demoUser = {
      id: 1,
      email: "admin@lopez-it-welt.de",
      first_name: "Lopez",
      last_name: "Admin",
      two_fa_secret: "demo-secret",
      role_name: "admin",
    };

    // Nur Demo-Admin erlauben
    if (email !== "admin@lopez-it-welt.de") {
      return NextResponse.json(
        {
          success: false,
          message: "Benutzer nicht gefunden oder 2FA nicht aktiviert",
        },
        { status: 404 },
      );
    }

    const user = demoUser;

    // TOTP-Code verifizieren (vereinfacht für Demo)
    // In Produktion: speakeasy.totp.verify()
    const isValidToken = totpCode === "123456"; // Demo-2FA-Code

    if (!isValidToken) {
      return NextResponse.json({ success: false, message: "Ungültiger 2FA-Code" }, { status: 401 });
    }

    // JWT-Token generieren
    const token = Buffer.from(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: user.role_name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 Stunden
      }),
    ).toString("base64");

    // Session speichern (vereinfacht für Demo)
    // In Produktion: Datenbank-Session speichern

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role_name,
      },
    });
  } catch (error) {
    // 2FA-Verifikations-Fehler: ${error}
    return NextResponse.json({ success: false, message: "Interner Serverfehler" }, { status: 500 });
  }
}
