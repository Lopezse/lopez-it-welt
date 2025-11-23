// 2FA-Setup API
import { DemoDB } from "@/lib/demo-database";
import { NextRequest, NextResponse } from "next/server";

// Speakeasy für 2FA (falls nicht installiert: npm install speakeasy)
const speakeasy = require("speakeasy");

// POST - 2FA-Setup starten
export async function POST(request: NextRequest) {
  try {
    // In einer echten App würde man den Benutzer aus dem JWT-Token extrahieren
    // Für Demo: Verwenden wir eine feste E-Mail (kann in Produktion dynamisch sein)
    const userEmail = "test@example.com"; // In Produktion aus Token

    // Benutzer finden
    const user = DemoDB.findUserByEmail(userEmail);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 },
      );
    }

    // Prüfen ob 2FA-Setup bereits durchgeführt wurde
    if (user.two_factor_setup_completed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "2FA-Setup wurde bereits durchgeführt. Bei Problemen wenden Sie sich an den Support.",
          support_required: true,
        },
        { status: 403 },
      );
    }

    // 2FA-Secret generieren
    const secret = speakeasy.generateSecret({
      name: `Lopez IT Welt (${user.email})`,
      issuer: "Lopez IT Welt",
      length: 32,
    });

    // QR-Code URL erstellen
    const qrCodeUrl = secret.otpauth_url;

    // Secret temporär speichern (in Produktion in Datenbank)
    // Für Demo: In Session oder temporärer Speicher

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCodeUrl: qrCodeUrl,
      message: "2FA-Setup bereit",
    });
  } catch (error) {
    // 2FA-Setup Fehler: ${error}
    return NextResponse.json({ success: false, message: "Fehler beim 2FA-Setup" }, { status: 500 });
  }
}
