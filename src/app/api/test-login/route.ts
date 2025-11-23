// Test-Login API (sehr einfache Version)
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Test-Login API aufgerufen
    // E-Mail: ${email}
    // Passwort: ${password}

    // Einfacher Test
    if (email === "test@example.com" && password === "test123456") {
      // Test-Login erfolgreich
      return NextResponse.json({
        success: true,
        message: "Test-Login erfolgreich",
        data: {
          user: {
            id: "test_user",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
            role: "customer",
          },
        },
      });
    } else {
      // Test-Login fehlgeschlagen
      return NextResponse.json(
        { success: false, message: "Ungültige Anmeldedaten" },
        { status: 401 },
      );
    }
  } catch {
    // Test-Login Fehler
    return NextResponse.json(
      { success: false, message: "Fehler bei der Anmeldung" },
      { status: 500 },
    );
  }
}
