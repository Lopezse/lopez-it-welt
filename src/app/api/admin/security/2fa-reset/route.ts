// =====================================================
// ADMIN 2FA RESET API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: 2FA für Admin-Benutzer zurücksetzen
// Pfad: /api/admin/security/2fa-reset
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { TwoFactorService } from "@/lib/2fa-service";
import { AuditService } from "@/lib/audit-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - 2FA zurücksetzen
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

    // 2FA-Status prüfen
    const is2FAEnabled = await TwoFactorService.is2FAEnabled(session.userId);
    if (!is2FAEnabled) {
      return NextResponse.json(
        { success: false, message: "2FA ist nicht aktiviert" },
        { status: 400 },
      );
    }

    // 2FA deaktivieren
    await TwoFactorService.disable2FA(session.userId);

    // IP-Adresse und User-Agent extrahieren
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Audit-Log für 2FA-Reset
    try {
      await AuditService.logAudit({
        table_name: "lopez_user_2fa",
        record_id: session.userId,
        action: "2FA_RESET",
        user_id: session.userId,
        username: session.username,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionToken,
        risk_level: "HIGH",
        compliance_category: "AUTHENTICATION",
        old_values: JSON.stringify({ enabled: true }),
        new_values: JSON.stringify({ enabled: false, reset_by_user: true }),
      });
    } catch (auditError) {
      console.error("Audit-Log Fehler:", auditError);
      // Nicht kritisch, weiter machen
    }

    console.log(`✅ 2FA zurückgesetzt für Benutzer ${session.username} (ID: ${session.userId})`);

    return NextResponse.json({
      success: true,
      message: "2FA wurde zurückgesetzt. Sie können es jetzt neu einrichten.",
    });
  } catch (error) {
    console.error("❌ 2FA-Reset Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Zurücksetzen von 2FA" },
      { status: 500 },
    );
  }
}




