// =====================================================
// ADMIN 2FA SETUP FOR USER API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: 2FA für anderen Benutzer einrichten (Admin-Funktion)
// Pfad: /api/admin/users/[id]/2fa/setup
// Enterprise++: SAP/IBM/Siemens Standard
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { TwoFactorService } from "@/lib/2fa-service";
import { RBACService } from "@/lib/rbac-system";
import { AuditService } from "@/lib/audit-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - 2FA für einen Benutzer einrichten
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

    // RBAC: Owner/Admin dürfen 2FA für andere einrichten
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

    // Prüfen ob 2FA bereits aktiviert
    const is2FAEnabled = await TwoFactorService.is2FAEnabled(targetUserId);
    if (is2FAEnabled) {
      return NextResponse.json(
        {
          success: false,
          message: "2FA ist bereits aktiviert. Nutzen Sie Reset für Neueinrichtung.",
          already_enabled: true,
        },
        { status: 403 }
      );
    }

    // 2FA-Setup durchführen
    const twoFactorSecret = await TwoFactorService.setup2FA(
      targetUserId,
      targetUser.email,
      targetUser.username
    );

    // otpauth URL
    const otpauthUrl = `otpauth://totp/Lopez%20IT%20Welt:${encodeURIComponent(
      targetUser.email || targetUser.username
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
        record_id: targetUserId,
        action: "2FA_SETUP_BY_ADMIN",
        user_id: session.userId,
        username: session.username,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionToken,
        risk_level: "MEDIUM",
        compliance_category: "AUTHENTICATION",
        new_values: JSON.stringify({
          target_user: targetUser.username,
          setup_by: session.username,
        }),
      });
    } catch (auditError) {
      console.error("Audit-Log Fehler:", auditError);
    }

    return NextResponse.json({
      success: true,
      data: {
        targetUser: {
          id: targetUserId,
          username: targetUser.username,
          email: targetUser.email,
        },
        secret: twoFactorSecret.secret,
        qrCodeUrl: twoFactorSecret.qrCodeUrl,
        otpauthUrl,
        backupCodes: twoFactorSecret.backupCodes,
        message: `2FA-Setup für ${targetUser.username} bereit. QR-Code an Benutzer weitergeben.`,
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










