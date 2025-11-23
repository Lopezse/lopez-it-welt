// =====================================================
// SHOP LOGIN API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Shop-Kunden-Authentifizierung (nur Email, 2FA optional)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AuditService } from "@/lib/audit-service";
import { ShopAuthService } from "@/lib/shop-auth-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - Shop-Login
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, twoFactorToken } = body;

    // Validierung: Email muss @ enthalten (kein Username)
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Ungültige E-Mail-Adresse" },
        { status: 400 },
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Passwort erforderlich" },
        { status: 400 },
      );
    }

    // IP-Adresse und User-Agent extrahieren
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const route = request.nextUrl.pathname;

    // Login durchführen
    const authResult = await ShopAuthService.login(
      { email, password, twoFactorToken },
      ipAddress,
      userAgent,
    );

    if (!authResult.success) {
      // Audit-Log für fehlgeschlagenen Login
      await AuditService.logAudit({
        table_name: "lopez_customers",
        record_id: 0,
        action: "LOGIN",
        user_id: 0,
        username: email,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: null,
        risk_level: "LOW",
        compliance_category: "AUTHENTICATION",
        new_values: JSON.stringify({
          realm: "SHOP",
          result: "failed",
          reason: authResult.message,
          route,
        }),
      });

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
    const jwtToken = ShopAuthService.generateJWT(authResult.session!);

    // Cookie setzen (mit shp_ Präfix)
    const response = NextResponse.json({
      success: true,
      message: "Login erfolgreich",
      data: {
        user: {
          id: authResult.session!.userId,
          email: authResult.session!.email,
          first_name: authResult.session!.firstName,
          last_name: authResult.session!.lastName,
        },
        token: jwtToken,
        sessionToken: authResult.session!.sessionToken,
        expiresAt: authResult.session!.expiresAt,
      },
    });

    // Cookie mit shp_ Präfix setzen
    response.cookies.set("shp_session", authResult.session!.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 Stunden
      path: "/",
    });

    response.cookies.set("shp_token", jwtToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    // Audit-Log für erfolgreichen Login
    await AuditService.logAudit({
      table_name: "lopez_customers",
      record_id: authResult.session!.userId,
      action: "LOGIN",
      user_id: authResult.session!.userId,
      username: authResult.session!.email,
      ip_address: ipAddress,
      user_agent: userAgent,
      session_id: authResult.session!.sessionToken,
      risk_level: "LOW",
      compliance_category: "AUTHENTICATION",
      new_values: JSON.stringify({
        realm: "SHOP",
        result: "success",
        route,
        twoFactorEnabled: authResult.session!.twoFactorEnabled,
      }),
    });

    // KEINE Zeiterfassung für Shop-Login

    return response;
  } catch (error) {
    console.error("❌ Shop Login API Fehler:", error);
    return NextResponse.json({ success: false, message: "Interner Serverfehler" }, { status: 500 });
  }
}







