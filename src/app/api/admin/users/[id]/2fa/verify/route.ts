// =====================================================
// ADMIN 2FA VERIFY FOR USER API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: 2FA-Code für anderen Benutzer verifizieren (Admin-Funktion)
// Pfad: /api/admin/users/[id]/2fa/verify
// Enterprise++: SAP/IBM/Siemens Standard
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { TwoFactorService } from "@/lib/2fa-service";
import { RBACService } from "@/lib/rbac-system";
import { AuditService } from "@/lib/audit-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - 2FA-Code verifizieren und aktivieren
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

    // RBAC: Owner/Admin dürfen 2FA für andere verifizieren
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
        { success: false, message: "Ungültiger 2FA-Code" },
        { status: 400 }
      );
    }

    // 2FA aktivieren
    await TwoFactorService.enable2FA(targetUserId, secret);

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
        record_id: targetUserId,
        action: "2FA_ACTIVATED_BY_ADMIN",
        user_id: session.userId,
        username: session.username,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionToken,
        risk_level: "MEDIUM",
        compliance_category: "AUTHENTICATION",
        new_values: JSON.stringify({
          enabled: true,
          target_user: targetUser.username,
          activated_by: session.username,
        }),
      });
    } catch (auditError) {
      console.error("Audit-Log Fehler:", auditError);
    }

    return NextResponse.json({
      success: true,
      message: `2FA für ${targetUser.username} erfolgreich aktiviert!`,
    });
  } catch (error) {
    console.error("❌ 2FA-Verify Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Fehler bei der 2FA-Verifikation" },
      { status: 500 }
    );
  }
}










