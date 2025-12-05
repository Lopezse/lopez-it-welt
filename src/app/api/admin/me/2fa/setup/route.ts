// =====================================================
// SELF-SERVICE 2FA SETUP API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Eigenes 2FA einrichten (Self-Service)
// Pfad: /api/admin/me/2fa/setup
// Enterprise++: SAP/IBM/Siemens Standard
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { TwoFactorService } from "@/lib/2fa-service";
import { RBACService } from "@/lib/rbac-system";
import { AuditService } from "@/lib/audit-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - Eigenes 2FA-Setup starten
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Session validieren
    const sessionToken =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("adm_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Ungültige Session" },
        { status: 401 }
      );
    }

    // Prüfen ob 2FA bereits aktiviert ist
    const twoFactorEnabled = await TwoFactorService.is2FAEnabled(session.userId);
    if (twoFactorEnabled) {
      return NextResponse.json(
        {
          success: false,
          message: "2FA ist bereits aktiviert. Nutzen Sie Reset, um es neu einzurichten.",
          already_enabled: true,
        },
        { status: 403 }
      );
    }

    // Benutzer laden für E-Mail/Username
    const user = await RBACService.getUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    // 2FA-Setup durchführen
    const twoFactorSecret = await TwoFactorService.setup2FA(
      session.userId,
      user.email,
      user.username
    );

    // otpauth URL für Aegis/Google Authenticator
    const otpauthUrl = `otpauth://totp/Lopez%20IT%20Welt:${encodeURIComponent(
      user.email || user.username
    )}?secret=${twoFactorSecret.secret}&issuer=Lopez%20IT%20Welt&algorithm=SHA1&digits=6&period=30`;

    // IP und User-Agent
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Audit-Log
    try {
      await AuditService.logAudit({
        table_name: "lopez_user_2fa",
        record_id: session.userId,
        action: "2FA_SETUP_STARTED",
        user_id: session.userId,
        username: session.username,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionToken,
        risk_level: "LOW",
        compliance_category: "AUTHENTICATION",
        new_values: JSON.stringify({ self_service: true }),
      });
    } catch (auditError) {
      console.error("Audit-Log Fehler:", auditError);
    }

    return NextResponse.json({
      success: true,
      data: {
        secret: twoFactorSecret.secret,
        qrCodeUrl: twoFactorSecret.qrCodeUrl,
        otpauthUrl,
        backupCodes: twoFactorSecret.backupCodes,
        message: "2FA-Setup bereit. Scannen Sie den QR-Code mit Aegis oder Google Authenticator.",
      },
    });
  } catch (error) {
    console.error("❌ 2FA-Setup Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim 2FA-Setup" },
      { status: 500 }
    );
  }
}




