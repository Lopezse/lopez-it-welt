// =====================================================
// 2FA SETUP API
// =====================================================
// POST /api/auth/2fa/setup - Startet 2FA Setup
// POST /api/auth/2fa/setup/confirm - Aktiviert 2FA
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { TwoFactorService } from "@/lib/customer/two-factor-service";
import { CustomerAuthService } from "@/lib/customer/auth-service";
import { cookies } from "next/headers";

// =====================================================
// POST - 2FA Setup starten
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Session prüfen
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("customer_session")?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Nicht angemeldet" },
        { status: 401 }
      );
    }

    const session = await CustomerAuthService.validateSession(sessionToken);
    
    if (!session.valid || !session.customer_id) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session" },
        { status: 401 }
      );
    }

    // Body prüfen für Confirm-Action
    let body: { action?: string; code?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Kein Body = Setup starten
    }

    // Confirm-Action (2FA aktivieren)
    if (body.action === "confirm" && body.code) {
      const result = await TwoFactorService.enableTwoFactor(
        session.customer_id,
        body.code
      );

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "2FA erfolgreich aktiviert!"
      });
    }

    // Setup starten
    const result = await TwoFactorService.setupTwoFactor(session.customer_id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "2FA-Setup gestartet",
      data: {
        secret: result.secret,
        qr_code_url: result.qr_code_url,
        backup_codes: result.backup_codes,
        instructions: [
          "1. Scannen Sie den QR-Code mit Ihrer Authenticator-App",
          "2. Geben Sie den 6-stelligen Code ein, um 2FA zu aktivieren",
          "3. Speichern Sie die Backup-Codes sicher ab"
        ]
      }
    });

  } catch (error) {
    console.error("❌ 2FA Setup Error:", error);
    return NextResponse.json(
      { success: false, error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE - 2FA deaktivieren
// =====================================================

export async function DELETE(request: NextRequest) {
  try {
    // Session prüfen
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("customer_session")?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Nicht angemeldet" },
        { status: 401 }
      );
    }

    const session = await CustomerAuthService.validateSession(sessionToken);
    
    if (!session.valid || !session.customer_id) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Passwort erforderlich" },
        { status: 400 }
      );
    }

    const result = await TwoFactorService.disableTwoFactor(
      session.customer_id,
      password
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "2FA deaktiviert"
    });

  } catch (error) {
    console.error("❌ 2FA Disable Error:", error);
    return NextResponse.json(
      { success: false, error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

