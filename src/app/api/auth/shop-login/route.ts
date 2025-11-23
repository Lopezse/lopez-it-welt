// Shop-Login API (Demo-Version)
import { DemoDB } from "@/lib/demo-database";
import { NextRequest, NextResponse } from "next/server";

// POST - Shop-Login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validierung
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "E-Mail und Passwort sind erforderlich" },
        { status: 400 },
      );
    }

    // Benutzer suchen
    const user = DemoDB.findUserByEmail(email);
    // Shop-Login Debug:
    // E-Mail: ${email}
    // Benutzer gefunden: ${!!user}
    if (user) {
      // Gespeichertes Passwort: ${user.password}
      // Eingegebenes Passwort: ${password}
      // Passwörter stimmen überein: ${user.password === password}
    }

    if (!user || user.password !== password) {
      // Login fehlgeschlagen - ungültige Anmeldedaten
      return NextResponse.json(
        { success: false, message: "Ungültige Anmeldedaten" },
        { status: 401 },
      );
    }

    // Prüfen ob Benutzer aktiv ist
    if (user.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Konto ist deaktiviert" },
        { status: 401 },
      );
    }

    // Prüfen ob 2FA aktiviert ist
    if (user.two_factor_enabled) {
      return NextResponse.json({
        success: true,
        requires2FA: true,
        message: "2FA-Code erforderlich",
      });
    }

    // JWT-Token generieren (vereinfacht für Demo)
    const token = Buffer.from(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 Stunden
      }),
    ).toString("base64");

    // Cookie setzen
    const response = NextResponse.json({
      success: true,
      message: "Anmeldung erfolgreich",
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
        token,
      },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 Stunden
    });

    return response;
  } catch (error) {
    // Shop-Login Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler bei der Anmeldung" },
      { status: 500 },
    );
  }
}
