// =====================================================
// LOGIN API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Benutzer-Authentifizierung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AuditService } from "@/lib/audit-service";
import { AuthService } from "@/lib/auth-service";
import { DevelopmentMode } from "@/lib/development-mode";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - Benutzer-Login
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Development Mode: Authentication umgehen
    if (DevelopmentMode.shouldBypassAuth()) {
      // Development Mode: Login API umgangen
      const mockResponse = DevelopmentMode.createLoginResponse();
      return NextResponse.json(mockResponse);
    }

    const body = await request.json();
    const { username, password, twoFactorToken } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Benutzername und Passwort erforderlich" },
        { status: 400 },
      );
    }

    // IP-Adresse und User-Agent extrahieren
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Login-Versuch: ${username} von ${ipAddress}

    // Login durchführen
    const authResult = await AuthService.login(
      { username, password, twoFactorToken },
      ipAddress,
      userAgent,
    );

    if (!authResult.success) {
      // Login fehlgeschlagen: ${username} - ${authResult.message}
      return NextResponse.json(
        {
          success: false,
          message: authResult.message,
          requires2FA: authResult.requires2FA,
        },
        { status: 401 },
      );
    }

    // JWT-Token generieren
    const jwtToken = AuthService.generateJWT(authResult.session!);

    // Audit-Log erstellen
    await AuditService.logLogin(
      authResult.session!.userId,
      authResult.session!.username,
      ipAddress,
      userAgent,
      authResult.session!.sessionToken,
    );

    // Login erfolgreich: ${username}

    return NextResponse.json({
      success: true,
      message: "Login erfolgreich",
      data: {
        user: {
          id: authResult.session!.userId,
          username: authResult.session!.username,
          email: authResult.session!.email,
          roles: authResult.session!.roles,
        },
        token: jwtToken,
        sessionToken: authResult.session!.sessionToken,
        expiresAt: authResult.session!.expiresAt,
      },
    });
  } catch (error) {
    // Login-API-Fehler: ${error}
    return NextResponse.json({ success: false, message: "Interner Serverfehler" }, { status: 500 });
  }
}
