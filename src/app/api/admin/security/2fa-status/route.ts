// =====================================================
// ADMIN 2FA STATUS API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: 2FA-Status für Admin-Benutzer abfragen
// Pfad: /api/admin/security/2fa-status
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { TwoFactorService } from "@/lib/2fa-service";
import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// GET - 2FA-Status des aktuellen Benutzers
// =====================================================

export async function GET(request: NextRequest) {
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

    // Wenn aktiviert, auch Erstellungsdatum holen
    let createdAt: string | null = null;
    if (is2FAEnabled) {
      try {
        const connection = await getConnection();
        const [rows] = await connection.execute(
          "SELECT created_at FROM lopez_user_2fa WHERE user_id = ?",
          [session.userId]
        );
        if ((rows as any[]).length > 0) {
          createdAt = (rows as any[])[0].created_at;
        }
      } catch (dbError) {
        console.error("DB-Fehler beim Laden des 2FA-Datums:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        enabled: is2FAEnabled,
        createdAt: createdAt,
        userId: session.userId,
        username: session.username,
      },
    });
  } catch (error) {
    console.error("❌ 2FA-Status Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden des 2FA-Status" },
      { status: 500 },
    );
  }
}




