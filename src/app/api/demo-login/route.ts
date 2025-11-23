// Demo-Login API (einfache Version)
import { NextRequest, NextResponse } from "next/server";

// Demo-Benutzer
const demoUsers = [
  {
    id: "demo_user_1",
    email: "test@example.com",
    password: "test123456",
    first_name: "Test",
    last_name: "User",
    role: "customer",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Demo-Login:
    // E-Mail: ${email}
    // Passwort: ${password}

    // Benutzer suchen
    const user = demoUsers.find((u) => u.email === email && u.password === password);

    if (!user) {
      // Demo-Login fehlgeschlagen
      return NextResponse.json(
        { success: false, message: "Ungültige Anmeldedaten" },
        { status: 401 },
      );
    }

    // Demo-Login erfolgreich: ${user.email}

    return NextResponse.json({
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
      },
    });
  } catch {
    // Demo-Login Fehler
    return NextResponse.json(
      { success: false, message: "Fehler bei der Anmeldung" },
      { status: 500 },
    );
  }
}
