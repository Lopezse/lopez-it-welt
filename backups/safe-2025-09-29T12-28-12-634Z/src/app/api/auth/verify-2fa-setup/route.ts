// 2FA-Setup-Verifikation API
import { DemoDB } from "@/lib/demo-database";
import { NextRequest, NextResponse } from "next/server";

// Speakeasy für 2FA
const speakeasy = require("speakeasy");

// POST - 2FA-Setup verifizieren
export async function POST(request: NextRequest) {
  try {
    const { secret, code } = await request.json();

    if (!secret || !code) {
      return NextResponse.json(
        { success: false, message: "Secret und Code sind erforderlich" },
        { status: 400 },
      );
    }

    // Code verifizieren
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: code,
      window: 2, // 2 Zeitfenster Toleranz
    });

    if (!verified) {
      return NextResponse.json({ success: false, message: "Ungültiger 2FA-Code" }, { status: 400 });
    }

    // In Produktion: Secret in Datenbank speichern
    // Für Demo: Benutzer als 2FA-aktiviert markieren
    const userEmail = "test@example.com"; // In Produktion aus Token
    const user = DemoDB.findUserByEmail(userEmail);

    if (user) {
      DemoDB.updateUser(user.id, {
        two_factor_enabled: true,
        two_factor_setup_completed: true, // Setup als abgeschlossen markieren
      });
    }

    return NextResponse.json({
      success: true,
      message: "2FA erfolgreich aktiviert",
    });
  } catch {
    // 2FA-Verifikation Fehler
    return NextResponse.json(
      { success: false, message: "Fehler bei der 2FA-Verifikation" },
      { status: 500 },
    );
  }
}
