// =====================================================
// ENTERPRISE++ SECURE 2FA RESET
// =====================================================
// Sicherer 2FA-Reset mit sofortiger Neu-Einrichtung
// Nach Verwendung sollte dieser Endpunkt entfernt werden!
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { TwoFactorService } from "@/lib/2fa-service";

// POST: 2FA zuruecksetzen und neues Setup generieren
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, emergency_key, action, token, secret } = body;

    // Sicherheits-Check: Emergency-Key
    if (emergency_key !== "LOPEZ_EMERGENCY_2FA_RESET_2025") {
      return NextResponse.json(
        { success: false, error: "Ungueltiger Emergency-Key" },
        { status: 403 }
      );
    }

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username erforderlich" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    // Benutzer-ID finden
    const [userRows] = await connection.execute(
      "SELECT id, username, email FROM lopez_users WHERE username = ? OR email = ?",
      [username, username]
    );

    if ((userRows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    const user = (userRows as any[])[0];
    const userId = user.id;

    // Action: verify - Neues 2FA verifizieren und aktivieren
    if (action === "verify") {
      if (!token || !secret) {
        return NextResponse.json(
          { success: false, error: "Token und Secret erforderlich" },
          { status: 400 }
        );
      }

      // Token mit dem neuen Secret verifizieren
      const isValid = await TwoFactorService.verifyTokenWithSecret(secret, token);
      
      if (!isValid) {
        return NextResponse.json({
          success: false,
          error: "Token ungueltig. Bitte Authenticator-App pruefen und erneut versuchen.",
        });
      }

      // 2FA aktivieren
      await TwoFactorService.enable2FA(userId, secret);

      console.log(`✅ 2FA fuer Benutzer ${user.username} (ID: ${userId}) neu aktiviert`);

      return NextResponse.json({
        success: true,
        message: `2FA fuer ${user.username} erfolgreich aktiviert!`,
        user: {
          id: userId,
          username: user.username,
        },
      });
    }

    // Standard-Action: Reset und neues Setup generieren
    // 1. Altes 2FA loeschen
    await connection.execute(
      "DELETE FROM lopez_user_2fa WHERE user_id = ?",
      [userId]
    );

    // 2. Neues 2FA-Setup generieren
    const setup = await TwoFactorService.setup2FA(userId, user.email, user.username);

    console.log(`🔄 2FA-Reset fuer Benutzer ${user.username} (ID: ${userId}) - Neues Setup generiert`);

    return NextResponse.json({
      success: true,
      message: "Neues 2FA-Setup generiert. Bitte QR-Code scannen und Code bestaetigen.",
      user: {
        id: userId,
        username: user.username,
        email: user.email,
      },
      setup: {
        qrCodeUrl: setup.qrCodeUrl,
        secret: setup.secret, // Wird benoetigt fuer die Verifikation
        backupCodes: setup.backupCodes,
      },
      next_step: "Scanne den QR-Code mit Aegis/Google Authenticator, dann rufe diesen Endpunkt mit action='verify', token='XXXXXX', secret='...' auf",
    });
  } catch (error) {
    console.error("❌ 2FA Reset Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Fehler beim Reset", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

// GET: 2FA-Status pruefen
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username als Query-Parameter erforderlich" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    const [rows] = await connection.execute(
      `SELECT u.id, u.username, u.email, 
              CASE WHEN f.user_id IS NOT NULL THEN 1 ELSE 0 END as has_2fa,
              f.created_at as twofa_created_at
       FROM lopez_users u
       LEFT JOIN lopez_user_2fa f ON u.id = f.user_id
       WHERE u.username = ? OR u.email = ?`,
      [username, username]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    const user = (rows as any[])[0];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        has_2fa: Boolean(user.has_2fa),
        twofa_created_at: user.twofa_created_at,
      },
    });
  } catch (error) {
    console.error("❌ 2FA Status Check Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Fehler beim Pruefen", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
