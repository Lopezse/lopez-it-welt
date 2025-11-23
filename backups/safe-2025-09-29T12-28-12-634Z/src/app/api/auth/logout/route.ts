// =====================================================
// LOGOUT API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Benutzer-Logout
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AuditService } from "@/lib/audit-service";
import { AuthService } from "@/lib/auth-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - Benutzer-Logout
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Session-Token erforderlich" },
        { status: 400 },
      );
    }

    // Session validieren
    const session = await AuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json({ success: false, message: "Ungültige Session" }, { status: 401 });
    }

    // IP-Adresse und User-Agent extrahieren
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Logout durchführen
    const logoutSuccess = await AuthService.logout(sessionToken);

    if (!logoutSuccess) {
      return NextResponse.json(
        { success: false, message: "Logout fehlgeschlagen" },
        { status: 500 },
      );
    }

    // Audit-Log erstellen
    await AuditService.logLogout(
      session.userId,
      session.username,
      ipAddress,
      userAgent,
      sessionToken,
    );

    // Logout erfolgreich: ${session.username}

    return NextResponse.json({
      success: true,
      message: "Logout erfolgreich",
    });
  } catch (error) {
    // Logout-API-Fehler: ${error}
    return NextResponse.json({ success: false, message: "Interner Serverfehler" }, { status: 500 });
  }
}
