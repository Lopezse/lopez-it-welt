// Demo-Registrierung ohne Datenbank
import { DemoDB } from "@/lib/demo-database";
import { NextRequest, NextResponse } from "next/server";

// POST - Kunden-Registrierung (Demo-Version)
export async function POST(request: NextRequest) {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      company = null,
      phone = null,
      enable_2fa = false,
    } = await request.json();

    // Validierung
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        {
          success: false,
          message: "E-Mail, Passwort, Vor- und Nachname sind erforderlich",
        },
        { status: 400 },
      );
    }

    // E-Mail-Format validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Ungültige E-Mail-Adresse" },
        { status: 400 },
      );
    }

    // Passwort-Stärke validieren
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwort muss mindestens 8 Zeichen lang sein",
        },
        { status: 400 },
      );
    }

    // Prüfen ob E-Mail bereits existiert
    const existingUser = DemoDB.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "E-Mail-Adresse wird bereits verwendet" },
        { status: 400 },
      );
    }

    // Demo-Benutzer erstellen
    const newUser = DemoDB.createUser({
      email,
      password, // In Produktion: gehasht
      first_name,
      last_name,
      company,
      phone,
      role: "customer",
      status: "active",
      email_verified: true, // Demo: sofort verifiziert
      two_factor_enabled: enable_2fa,
    });

    return NextResponse.json({
      success: true,
      message: "Registrierung erfolgreich! Sie können sich jetzt anmelden.",
      data: {
        user_id: newUser.id,
        email: newUser.email,
        name: `${newUser.first_name} ${newUser.last_name}`,
        status: newUser.status,
        requires_verification: false,
      },
    });
  } catch (error) {
    // Registrierung Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler bei der Registrierung" },
      { status: 500 },
    );
  }
}

// GET - Registrierungs-Status prüfen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "E-Mail ist erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    const [user] = await connection.execute(
      "SELECT id, email, status, email_verified, created_at FROM lopez_core_users WHERE email = ?",
      [email],
    );

    await connection.end();

    if ((user as any[]).length === 0) {
      return NextResponse.json({
        success: true,
        exists: false,
      });
    }

    const userData = (user as any[])[0];

    return NextResponse.json({
      success: true,
      exists: true,
      data: {
        id: userData.id,
        email: userData.email,
        status: userData.status,
        email_verified: userData.email_verified,
        created_at: userData.created_at,
      },
    });
  } catch (error) {
    // Registrierungs-Status Fehler: ${error}
    return NextResponse.json(
      {
        success: false,
        message: "Fehler beim Prüfen des Registrierungs-Status",
      },
      { status: 500 },
    );
  }
}
