// =====================================================
// ADMIN ME API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Aktueller Admin-Benutzer-Status
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { TwoFactorService } from "@/lib/2fa-service";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
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

    console.log("🔍 Admin ME API:", {
      hasHeader: !!request.headers.get("authorization"),
      hasCookie: !!request.cookies.get("adm_session"),
      sessionToken: sessionToken ? `${sessionToken.substring(0, 20)}...` : "none",
    });

    if (!sessionToken) {
      console.log("❌ Admin ME: Kein Session-Token gefunden");
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 },
      );
    }

    // Session validieren
    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      console.log("❌ Admin ME: Session-Validierung fehlgeschlagen");
      return NextResponse.json(
        { success: false, message: "Ungültige Session" },
        { status: 401 },
      );
    }

    console.log("✅ Admin ME: Session validiert für User:", session.username);

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

    // Berechtigungen aus Rollen sammeln
    const permissions: string[] = [];
    for (const role of roles) {
      const rolePermissions = await RBACService.getRolePermissions(role.id!);
      permissions.push(...rolePermissions.map((p) => `${p.resource}.${p.action}`));
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role_id: roles.length > 0 ? roles[0].id : undefined,
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
        permissions: [...new Set(permissions)], // Duplikate entfernen
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







