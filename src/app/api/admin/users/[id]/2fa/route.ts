// =====================================================
// ADMIN 2FA MANAGEMENT API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: 2FA für andere Benutzer verwalten (Admin-Funktion)
// Pfad: /api/admin/users/[id]/2fa
// Enterprise++: SAP/IBM/Siemens Standard
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { TwoFactorService } from "@/lib/2fa-service";
import { RBACService } from "@/lib/rbac-system";
import { AuditService } from "@/lib/audit-service";
import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// GET - 2FA-Status eines Benutzers abfragen
// =====================================================

export async function GET(
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

    // RBAC: Nur Owner/Admin dürfen 2FA anderer Benutzer sehen
    const hasPermission = await RBACService.hasPermission(
      session.userId,
      "users.2fa.view"
    );
    
    // Fallback: Prüfe ob Owner oder Admin
    const currentUser = await RBACService.getUserById(session.userId);
    const isOwnerOrAdmin = currentUser?.roles?.some(
      (r: any) => ["Owner", "Super Admin", "Admin"].includes(r.role_name || r.name)
    );

    if (!hasPermission && !isOwnerOrAdmin) {
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

    // 2FA-Status prüfen
    const is2FAEnabled = await TwoFactorService.is2FAEnabled(targetUserId);

    // Zusätzliche Infos
    let createdAt: string | null = null;
    let backupCodesRemaining = 0;

    if (is2FAEnabled) {
      try {
        const connection = await getConnection();
        const [rows] = await connection.execute(
          "SELECT created_at, backup_codes FROM lopez_user_2fa WHERE user_id = ?",
          [targetUserId]
        );
        if ((rows as any[]).length > 0) {
          createdAt = (rows as any[])[0].created_at;
          const codes = JSON.parse((rows as any[])[0].backup_codes || "[]");
          backupCodesRemaining = codes.length;
        }
      } catch (dbError) {
        console.error("DB-Fehler:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: targetUserId,
        username: targetUser.username,
        email: targetUser.email,
        enabled: is2FAEnabled,
        createdAt,
        backupCodesRemaining,
      },
    });
  } catch (error) {
    console.error("❌ 2FA-Status Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden des 2FA-Status" },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE - 2FA eines Benutzers deaktivieren (nur Owner)
// WICHTIG: Erfordert Security-Recheck
// =====================================================

export async function DELETE(
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

    // RBAC: NUR Owner darf 2FA deaktivieren
    const currentUser = await RBACService.getUserById(session.userId);
    const isOwner = currentUser?.roles?.some(
      (r: any) => ["Owner", "Super Admin"].includes(r.role_name || r.name)
    );

    if (!isOwner) {
      return NextResponse.json(
        { success: false, message: "Nur Owner dürfen 2FA deaktivieren" },
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

    // 2FA deaktivieren
    await TwoFactorService.disable2FA(targetUserId);

    // IP und User-Agent
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Audit-Log (KRITISCH: Owner deaktiviert 2FA für anderen Benutzer)
    try {
      await AuditService.logAudit({
        table_name: "lopez_user_2fa",
        record_id: targetUserId,
        action: "2FA_DISABLED_BY_ADMIN",
        user_id: session.userId,
        username: session.username,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionToken,
        risk_level: "CRITICAL",
        compliance_category: "AUTHENTICATION",
        old_values: JSON.stringify({ enabled: true }),
        new_values: JSON.stringify({
          enabled: false,
          disabled_by: session.username,
          target_user: targetUser.username,
        }),
      });
    } catch (auditError) {
      console.error("Audit-Log Fehler:", auditError);
    }

    console.log(`⚠️ 2FA deaktiviert für ${targetUser.username} durch ${session.username}`);

    return NextResponse.json({
      success: true,
      message: `2FA für ${targetUser.username} wurde deaktiviert`,
    });
  } catch (error) {
    console.error("❌ 2FA-Disable Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Deaktivieren von 2FA" },
      { status: 500 }
    );
  }
}




