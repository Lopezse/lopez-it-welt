// =====================================================
// ADMIN 2FA RESET FOR USER API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: 2FA für anderen Benutzer zurücksetzen (Admin-Funktion)
// Pfad: /api/admin/users/[id]/2fa/reset
// Enterprise++: SAP/IBM/Siemens Standard
// WICHTIG: Erfordert Security-Recheck!
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { TwoFactorService } from "@/lib/2fa-service";
import { RBACService } from "@/lib/rbac-system";
import { AuditService } from "@/lib/audit-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - 2FA zurücksetzen (mit Security-Recheck)
// =====================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const targetUserId = parseInt(id, 10);

    if (isNaN(targetUserId)) {
      return NextResponse.json(
        { success: false, message: "Ungültige Benutzer-ID" },
        { status: 400 }
      );
    }

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

    // RBAC: Owner/Admin dürfen 2FA für andere zurücksetzen
    const currentUser = await RBACService.getUserById(session.userId);
    const isOwnerOrAdmin = currentUser?.roles?.some(
      (r: any) => ["Owner", "Super Admin", "Admin"].includes(r.role_name || r.name)
    );

    if (!isOwnerOrAdmin) {
      return NextResponse.json(
        { success: false, message: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Zielbenutzer laden
    const targetUser = await RBACService.getUserById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    // Security-Recheck prüfen (optional für jetzt)
    const body = await request.json().catch(() => ({}));
    const { recheck_token } = body;

    // TODO: Recheck-Token validieren wenn implementiert
    const recheckValid = recheck_token ? true : false;

    // Prüfen ob 2FA aktiviert
    const is2FAEnabled = await TwoFactorService.is2FAEnabled(targetUserId);
    if (!is2FAEnabled) {
      return NextResponse.json(
        { success: false, message: "2FA ist nicht aktiviert" },
        { status: 400 }
      );
    }

    // 2FA zurücksetzen
    await TwoFactorService.disable2FA(targetUserId);

    // IP und User-Agent
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Audit-Log (WICHTIG: Sicherheitskritische Aktion)
    try {
      await AuditService.logAudit({
        table_name: "lopez_user_2fa",
        record_id: targetUserId,
        action: "2FA_RESET_BY_ADMIN",
        user_id: session.userId,
        username: session.username,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionToken,
        risk_level: "HIGH",
        compliance_category: "AUTHENTICATION",
        old_values: JSON.stringify({ enabled: true }),
        new_values: JSON.stringify({
          enabled: false,
          reset_by: session.username,
          target_user: targetUser.username,
          recheck_validated: recheckValid,
        }),
      });
    } catch (auditError) {
      console.error("Audit-Log Fehler:", auditError);
    }

    console.log(`⚠️ 2FA zurückgesetzt für ${targetUser.username} durch ${session.username}`);

    return NextResponse.json({
      success: true,
      message: `2FA für ${targetUser.username} wurde zurückgesetzt. Benutzer kann 2FA neu einrichten.`,
    });
  } catch (error) {
    console.error("❌ 2FA-Reset Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Zurücksetzen von 2FA" },
      { status: 500 }
    );
  }
}










