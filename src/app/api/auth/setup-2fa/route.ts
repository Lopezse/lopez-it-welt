// =====================================================
// 2FA SETUP API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: 2FA-Setup (Aegis-kompatibel, TOTP, 30 Sek. Intervalle)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AuditService } from "@/lib/audit-service";
import { AuthService } from "@/lib/auth-service";
import { RBACService } from "@/lib/rbac-system";
import { TwoFactorService } from "@/lib/2fa-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - 2FA-Setup starten
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Session-Token aus Header oder Cookie extrahieren
    const sessionToken = 
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 },
      );
    }

    // Session validieren
    const session = await AuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Ungültige Session" },
        { status: 401 },
      );
    }

    // Benutzer laden
    const user = await RBACService.getUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 },
      );
    }

    // Prüfen ob 2FA bereits aktiviert ist
    const twoFactorEnabled = await TwoFactorService.is2FAEnabled(session.userId);
    if (twoFactorEnabled) {
      return NextResponse.json(
        {
          success: false,
          message:
            "2FA wurde bereits aktiviert. Bei Problemen wenden Sie sich an den Support.",
          support_required: true,
        },
        { status: 403 },
      );
    }

    // IP-Adresse und User-Agent extrahieren
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // 2FA-Setup durchführen (generiert Secret, QR-Code, Backup-Codes)
    // Aegis-kompatibel: TOTP, 30 Sek. Intervalle, 6-stellig
    const twoFactorSecret = await TwoFactorService.setup2FA(
      session.userId,
      user.email,
      user.username,
    );

    // otpauth URL für Aegis/Google Authenticator (bereits im setup2FA generiert)
    const otpauthUrl = `otpauth://totp/Lopez%20IT%20Welt:${encodeURIComponent(user.email || user.username)}?secret=${twoFactorSecret.secret}&issuer=Lopez%20IT%20Welt&algorithm=SHA1&digits=6&period=30`;

    // Audit-Log erstellen (noch nicht aktiviert, erst nach Verifikation)
    await AuditService.log2FASetup(
      session.userId,
      session.username,
      ipAddress,
      userAgent,
    );

    return NextResponse.json({
      success: true,
      data: {
        secret: twoFactorSecret.secret,
        qrCodeUrl: twoFactorSecret.qrCodeUrl, // Data URL für QR-Code
        otpauthUrl: otpauthUrl, // otpauth:// URL für Aegis/Google Authenticator
        backupCodes: twoFactorSecret.backupCodes,
        message: "2FA-Setup bereit. Scannen Sie den QR-Code mit Aegis, Google Authenticator oder Authy.",
      },
    });
  } catch (error) {
    console.error("❌ 2FA-Setup Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim 2FA-Setup" },
      { status: 500 },
    );
  }
}
