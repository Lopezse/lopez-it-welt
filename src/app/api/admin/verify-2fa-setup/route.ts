// =====================================================
// ADMIN 2FA SETUP VERIFIKATION API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: 2FA-Setup verifizieren und aktivieren (Aegis-kompatibel)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { TwoFactorService } from "@/lib/2fa-service";
import { AuditService } from "@/lib/audit-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - 2FA-Setup verifizieren und aktivieren
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Session-Token aus Header oder Cookie extrahieren (Admin)
    const sessionToken =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("adm_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 },
      );
    }

    // Session validieren (Admin)
    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Ungültige Session" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { secret, code } = body;

    if (!secret || !code) {
      return NextResponse.json(
        { success: false, message: "Secret und Code sind erforderlich" },
        { status: 400 },
      );
    }

    // Code verifizieren (Aegis-kompatibel: TOTP, 30 Sek., 6-stellig)
    const verified = await TwoFactorService.verifyTokenWithSecret(secret, code);
    
    if (!verified) {
      return NextResponse.json(
        { success: false, message: "Ungültiger 2FA-Code" },
        { status: 400 },
      );
    }

    // 2FA aktivieren (Secret in DB speichern)
    await TwoFactorService.enable2FA(session.userId, secret);

    // IP-Adresse und User-Agent extrahieren
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Audit-Log für erfolgreiche 2FA-Aktivierung
    await AuditService.logAudit({
      table_name: "lopez_user_2fa",
      record_id: session.userId,
      action: "2FA_SETUP",
      user_id: session.userId,
      username: session.username,
      ip_address: ipAddress,
      user_agent: userAgent,
      session_id: sessionToken,
      risk_level: "MEDIUM",
      compliance_category: "AUTHENTICATION",
      new_values: JSON.stringify({
        enabled: true,
        setup_completed: true,
      }),
    });

    return NextResponse.json({
      success: true,
      message: "2FA erfolgreich aktiviert",
    });
  } catch (error) {
    console.error("❌ 2FA-Verifikation Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Fehler bei der 2FA-Verifikation" },
      { status: 500 },
    );
  }
}

