import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";

// GET /api/admin/settings/profile
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Nicht authentifiziert" }, { status: 401 });
    }

    // RBAC: Nur Owner/Admin
    const userRoles = session.roles || [];
    if (!userRoles.includes("Owner") && !userRoles.includes("Admin")) {
      return NextResponse.json({ success: false, error: "Keine Berechtigung" }, { status: 403 });
    }

    const userId = session.user.id;

    // Profil aus Datenbank laden
    const profile = await executeQueryPool({
      query: "SELECT first_name, last_name, email, phone, avatar_url, email_verified FROM users WHERE id = ?",
      values: [userId],
    });

    if (!profile || profile.length === 0) {
      return NextResponse.json({ success: false, error: "Benutzer nicht gefunden" }, { status: 404 });
    }

    const user = profile[0];

    // 2FA Status prüfen
    const twoFactor = await executeQueryPool({
      query: "SELECT enabled FROM two_factor_auth WHERE user_id = ?",
      values: [userId],
    });

    return NextResponse.json({
      success: true,
      data: {
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email,
        phone: user.phone || null,
        avatar_url: user.avatar_url || null,
        email_verified: user.email_verified === 1,
        two_factor_enabled: twoFactor && twoFactor.length > 0 ? twoFactor[0].enabled === 1 : false,
      },
    });
  } catch (error: any) {
    console.error("Fehler beim Laden des Profils:", error);
    return NextResponse.json({ success: false, error: error.message || "Fehler beim Laden des Profils" }, { status: 500 });
  }
}

// PUT /api/admin/settings/profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Nicht authentifiziert" }, { status: 401 });
    }

    // RBAC: Nur Owner/Admin
    const userRoles = session.roles || [];
    if (!userRoles.includes("Owner") && !userRoles.includes("Admin")) {
      return NextResponse.json({ success: false, error: "Keine Berechtigung" }, { status: 403 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { first_name, last_name, phone } = body;

    // Validierung
    if (!first_name || !last_name) {
      return NextResponse.json({ success: false, error: "Vorname und Nachname sind erforderlich" }, { status: 400 });
    }

    // Profil aktualisieren
    await executeQueryPool({
      query: "UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = NOW() WHERE id = ?",
      values: [first_name, last_name, phone || null, userId],
    });

    return NextResponse.json({ success: true, message: "Profil erfolgreich aktualisiert" });
  } catch (error: any) {
    console.error("Fehler beim Aktualisieren des Profils:", error);
    return NextResponse.json({ success: false, error: error.message || "Fehler beim Aktualisieren des Profils" }, { status: 500 });
  }
}

