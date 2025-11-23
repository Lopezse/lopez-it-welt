// =====================================================
// ADMIN ME API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Aktueller Admin-Benutzer-Status
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { TwoFactorService } from "@/lib/2fa-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// GET - Aktueller Admin-Benutzer-Status
// =====================================================

export async function GET(request: NextRequest) {
  try {
    // Session-Token aus Header oder Cookie extrahieren
    const sessionToken = 
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("adm_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 },
      );
    }

    // Session validieren
    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Ungültige Session" },
        { status: 401 },
      );
    }

    // Benutzer-Daten laden
    const user = await RBACService.getUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Benutzer nicht gefunden" },
        { status: 404 },
      );
    }

    // 2FA-Status prüfen
    const twoFactorEnabled = await TwoFactorService.is2FAEnabled(session.userId);
    const twoFactorRequired = true; // Admin muss 2FA haben

    // Rollen und Berechtigungen laden
    const roles = await RBACService.getUserRoles(session.userId);
    const permissions = await RBACService.getUserPermissions(session.userId);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role_id: user.role_id,
          status: user.status,
        },
        session: {
          userId: session.userId,
          username: session.username,
          email: session.email,
          expiresAt: session.expiresAt,
          realm: "ADMIN",
        },
        roles: roles.map((r) => r.name),
        permissions: permissions.map((p) => p.resource + "." + p.action),
        twoFactor: {
          enabled: twoFactorEnabled,
          required: twoFactorRequired,
        },
      },
    });
  } catch (error) {
    console.error("❌ Admin ME Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Interner Serverfehler" },
      { status: 500 },
    );
  }
}







