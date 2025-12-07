// =====================================================
// SELF-SERVICE 2FA STATUS API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Eigenen 2FA-Status abfragen (Self-Service)
// Pfad: /api/admin/me/2fa
// Enterprise++: SAP/IBM/Siemens Standard
// =====================================================

import { AdminAuthService } from "@/lib/admin-auth-service";
import { TwoFactorService } from "@/lib/2fa-service";
import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// GET - Eigenen 2FA-Status abfragen
// =====================================================

export async function GET(request: NextRequest) {
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

    // 2FA-Status prüfen
    const is2FAEnabled = await TwoFactorService.is2FAEnabled(session.userId);

    // Zusätzliche Infos laden
    let createdAt: string | null = null;
    let backupCodesRemaining = 0;

    if (is2FAEnabled) {
      try {
        const connection = await getConnection();
        const [rows] = await connection.execute(
          "SELECT created_at, backup_codes FROM lopez_user_2fa WHERE user_id = ?",
          [session.userId]
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
        enabled: is2FAEnabled,
        createdAt,
        backupCodesRemaining,
        userId: session.userId,
        username: session.username,
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










