// =====================================================
// SELF-SERVICE 2FA VERIFY API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Eigenes 2FA verifizieren und aktivieren (Self-Service)
// Pfad: /api/admin/me/2fa/verify
// Enterprise++: SAP/IBM/Siemens Standard
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { TwoFactorService } from "@/lib/2fa-service";
import { AuditService } from "@/lib/audit-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - 2FA-Code verifizieren und aktivieren
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

    const body = await request.json();
    const { secret, code } = body;

    if (!secret || !code) {
      return NextResponse.json(
        { success: false, message: "Secret und Code sind erforderlich" },
        { status: 400 }
      );
    }

    // Code verifizieren
    const verified = await TwoFactorService.verifyTokenWithSecret(secret, code);

    if (!verified) {
      return NextResponse.json(
        { success: false, message: "Ungültiger 2FA-Code. Bitte erneut versuchen." },
        { status: 400 }
      );
    }

    // 2FA aktivieren
    await TwoFactorService.enable2FA(session.userId, secret);

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
        action: "2FA_ACTIVATED",
        user_id: session.userId,
        username: session.username,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionToken,
        risk_level: "MEDIUM",
        compliance_category: "AUTHENTICATION",
        new_values: JSON.stringify({ enabled: true, self_service: true }),
      });
    } catch (auditError) {
      console.error("Audit-Log Fehler:", auditError);
    }

    return NextResponse.json({
      success: true,
      message: "2FA erfolgreich aktiviert!",
    });
  } catch (error) {
    console.error("❌ 2FA-Verify Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Fehler bei der 2FA-Verifikation" },
      { status: 500 }
    );
  }
}




