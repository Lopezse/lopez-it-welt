import { NextRequest, NextResponse } from "next/server";
import { executeQueryPool } from "@/lib/db";
import bcrypt from "bcryptjs";

/**
 * Passwort-Reset für Admin-Benutzer
 * POST /api/admin/reset-password
 * 
 * Body: { email: string, newPassword: string }
 * 
 * WICHTIG: Diese Route sollte in Produktion durch eine sichere Reset-Funktion ersetzt werden!
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, error: "E-Mail und neues Passwort sind erforderlich" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Passwort muss mindestens 8 Zeichen lang sein" },
        { status: 400 }
      );
    }

    // Benutzer finden
    const users = await executeQueryPool({
      query: "SELECT id, email FROM users WHERE email = ?",
      values: [email],
    });

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    // Passwort hashen
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Passwort aktualisieren
    await executeQueryPool({
      query: "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE email = ?",
      values: [passwordHash, email],
    });

    return NextResponse.json({
      success: true,
      message: "Passwort erfolgreich zurückgesetzt",
      data: {
        email,
      },
    });
  } catch (error: any) {
    console.error("Fehler beim Zurücksetzen des Passworts:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Fehler beim Zurücksetzen des Passworts" },
      { status: 500 }
    );
  }
}

