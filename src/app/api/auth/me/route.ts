// =====================================================
// CURRENT USER API
// =====================================================
// GET /api/auth/me
// Gibt aktuelle Benutzerinformationen zurück
// =====================================================

import { NextResponse } from "next/server";
import { CustomerAuthService } from "@/lib/customer/auth-service";
import { getConnection } from "@/lib/database";
import { cookies } from "next/headers";
import { RowDataPacket } from "mysql2/promise";

// =====================================================
// GET - Aktueller Benutzer
// =====================================================

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("customer_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Nicht angemeldet" },
        { status: 401 }
      );
    }

    const session = await CustomerAuthService.validateSession(sessionToken);

    if (!session.valid || !session.customer_id) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session" },
        { status: 401 }
      );
    }

    // Kundendaten laden
    const pool = await getConnection();
    const [customers] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        id,
        email,
        salutation,
        first_name,
        last_name,
        company_name,
        language,
        status,
        email_verified,
        two_factor_enabled,
        onboarding_completed,
        onboarding_step,
        service_interests,
        created_at,
        last_login_at
      FROM lopez_customers 
      WHERE id = ?
    `, [session.customer_id]);

    if (customers.length === 0) {
      return NextResponse.json(
        { success: false, error: "Kunde nicht gefunden" },
        { status: 404 }
      );
    }

    const customer = customers[0];
    
    // Service Interests parsen
    let serviceInterests: string[] = [];
    if (customer.service_interests) {
      try {
        serviceInterests = typeof customer.service_interests === 'string' 
          ? JSON.parse(customer.service_interests) 
          : customer.service_interests;
      } catch {
        serviceInterests = [];
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        salutation: customer.salutation,
        first_name: customer.first_name,
        last_name: customer.last_name,
        full_name: [customer.first_name, customer.last_name].filter(Boolean).join(" ") || null,
        company_name: customer.company_name,
        language: customer.language || "de",
        status: customer.status,
        email_verified: !!customer.email_verified,
        two_factor_enabled: !!customer.two_factor_enabled,
        onboarding_completed: !!customer.onboarding_completed,
        onboarding_step: customer.onboarding_step || 0,
        service_interests: serviceInterests,
        created_at: customer.created_at,
        last_login_at: customer.last_login_at
      }
    });

  } catch (error) {
    console.error("❌ Me API Error:", error);
    return NextResponse.json(
      { success: false, error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}
