// =====================================================
// SHOP ME API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Aktueller Shop-Kunden-Status
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { ShopAuthService } from "@/lib/shop-auth-service";
import { TwoFactorService } from "@/lib/2fa-service";
import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// GET - Aktueller Shop-Kunden-Status
// =====================================================

export async function GET(request: NextRequest) {
  try {
    // Session-Token aus Header oder Cookie extrahieren
    const sessionToken = 
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("shp_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 },
      );
    }

    // Session validieren
    const session = await ShopAuthService.validateSession(sessionToken);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Ungültige Session" },
        { status: 401 },
      );
    }

    // Kunden-Daten laden
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `
                SELECT id, email, vorname, nachname, status, last_login_at
                FROM lopez_customers
                WHERE id = ?
            `,
      [session.userId],
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: "Kunde nicht gefunden" },
        { status: 404 },
      );
    }

    const customer = (rows as any)[0];

    // 2FA-Status prüfen (optional für Shop)
    const twoFactorEnabled = await TwoFactorService.is2FAEnabled(session.userId);
    const twoFactorRequired = false; // Shop: 2FA optional

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: customer.id,
          email: customer.email,
          first_name: customer.vorname,
          last_name: customer.nachname,
          status: customer.status,
        },
        session: {
          userId: session.userId,
          email: session.email,
          expiresAt: session.expiresAt,
          realm: "SHOP",
        },
        twoFactor: {
          enabled: twoFactorEnabled,
          required: twoFactorRequired,
        },
        last_login_at: customer.last_login_at,
      },
    });
  } catch (error) {
    console.error("❌ Shop ME Fehler:", error);
    return NextResponse.json(
      { success: false, message: "Interner Serverfehler" },
      { status: 500 },
    );
  }
}







