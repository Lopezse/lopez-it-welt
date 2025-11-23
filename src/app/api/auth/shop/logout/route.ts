// =====================================================
// SHOP LOGOUT API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Shop-Logout
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AuditService } from "@/lib/audit-service";
import { ShopAuthService } from "@/lib/shop-auth-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// POST - Shop-Logout
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Session-Token aus Cookie oder Body extrahieren
    const sessionToken = 
      request.cookies.get("shp_session")?.value ||
      (await request.json()).sessionToken;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Session-Token erforderlich" },
        { status: 400 },
      );
    }

    // Session validieren
    const session = await ShopAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json({ success: false, message: "Ungültige Session" }, { status: 401 });
    }

    // IP-Adresse und User-Agent extrahieren
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const route = request.nextUrl.pathname;

    // Logout durchführen
    const logoutSuccess = await ShopAuthService.logout(sessionToken);

    if (!logoutSuccess) {
      return NextResponse.json(
        { success: false, message: "Logout fehlgeschlagen" },
        { status: 500 },
      );
    }

    // Audit-Log erstellen
    await AuditService.logAudit({
      table_name: "lopez_customers",
      record_id: session.userId,
      action: "LOGOUT",
      user_id: session.userId,
      username: session.email,
      ip_address: ipAddress,
      user_agent: userAgent,
      session_id: sessionToken,
      risk_level: "LOW",
      compliance_category: "AUTHENTICATION",
      new_values: JSON.stringify({
        realm: "SHOP",
        route,
      }),
    });

    // Cookie löschen
    const response = NextResponse.json({
      success: true,
      message: "Logout erfolgreich",
    });

    response.cookies.delete("shp_session");
    response.cookies.delete("shp_token");

    // KEINE Zeiterfassung für Shop-Logout

    return response;
  } catch (error) {
    console.error("❌ Shop Logout API Fehler:", error);
    return NextResponse.json({ success: false, message: "Interner Serverfehler" }, { status: 500 });
  }
}







