// =====================================================
// PORTAL EINSTELLUNGEN API
// =====================================================
// PATCH /api/portal/einstellungen - Profil aktualisieren
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { CustomerAuthService } from "@/lib/customer/auth-service";
import { getConnection } from "@/lib/database";
import { cookies } from "next/headers";

// PATCH - Profil aktualisieren
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("customer_session")?.value;
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Nicht angemeldet" }, { status: 401 });
    }

    const session = await CustomerAuthService.validateSession(sessionToken);
    if (!session.valid || !session.customer_id) {
      return NextResponse.json({ success: false, error: "Ungültige Session" }, { status: 401 });
    }

    const body = await request.json();
    const { first_name, last_name, company_name, language, phone } = body;

    const pool = await getConnection();
    await pool.execute(`
      UPDATE lopez_customers SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        company_name = COALESCE(?, company_name),
        language = COALESCE(?, language),
        phone = COALESCE(?, phone),
        updated_at = NOW()
      WHERE id = ?
    `, [
      first_name || null,
      last_name || null,
      company_name || null,
      language || null,
      phone || null,
      session.customer_id
    ]);

    return NextResponse.json({
      success: true,
      message: "Einstellungen gespeichert"
    });

  } catch (error) {
    console.error("❌ Einstellungen PATCH Error:", error);
    return NextResponse.json({ success: false, error: "Fehler" }, { status: 500 });
  }
}







