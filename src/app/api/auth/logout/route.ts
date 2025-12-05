// =====================================================
// LOGOUT API
// =====================================================
// POST /api/auth/logout
// Beendet die aktuelle Session
// =====================================================

import { NextResponse } from "next/server";
import { CustomerAuthService } from "@/lib/customer/auth-service";
import { cookies } from "next/headers";

// =====================================================
// POST - Logout
// =====================================================

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("customer_session")?.value;

    if (sessionToken) {
      // Session aus DB löschen
      await CustomerAuthService.logout(sessionToken);
    }

    // Cookie löschen
    const response = NextResponse.json({
      success: true,
      message: "Erfolgreich abgemeldet",
      data: {
        redirect: "/login"
      }
    });

    response.cookies.set("customer_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/"
    });

    return response;

  } catch (error) {
    console.error("❌ Logout Error:", error);
    
    // Auch bei Fehler Cookie löschen
    const response = NextResponse.json({
      success: true,
      message: "Abgemeldet"
    });

    response.cookies.set("customer_session", "", {
      maxAge: 0,
      path: "/"
    });

    return response;
  }
}
