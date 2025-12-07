import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";

// GET /api/admin/settings/company
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

    // Unternehmensdaten laden
    const company = await executeQueryPool("SELECT * FROM settings_company ORDER BY id DESC LIMIT 1", []);

    if (company && company.length > 0) {
      return NextResponse.json({ success: true, data: company[0] });
    }

    // Fallback: Standardwerte
    return NextResponse.json({
      success: true,
      data: {
        company_name: "Lopez IT Welt",
        address: "",
        contact_email: "",
        contact_phone: "",
        logo_light_url: null,
        logo_dark_url: null,
        color_lopez: "#C99700",
        color_itwelt: "#007bff",
        color_itwelt_dark: "#0056b3",
        impressum_text: "",
        datenschutz_text: "",
      },
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der Unternehmensdaten:", error);
    // Fallback zurückgeben
    return NextResponse.json({
      success: true,
      data: {
        company_name: "Lopez IT Welt",
        color_lopez: "#C99700",
        color_itwelt: "#007bff",
        color_itwelt_dark: "#0056b3",
      },
    });
  }
}

// PUT /api/admin/settings/company
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

    const body = await request.json();

    // Prüfen ob Eintrag existiert
    const existing = await executeQueryPool("SELECT id FROM settings_company ORDER BY id DESC LIMIT 1", []);

    if (existing && existing.length > 0) {
      // Aktualisieren
      await executeQueryPool(
        `UPDATE settings_company SET 
          company_name = ?, address = ?, contact_email = ?, contact_phone = ?,
          color_lopez = ?, color_itwelt = ?, color_itwelt_dark = ?,
          impressum_text = ?, datenschutz_text = ?, updated_at = NOW()
        WHERE id = ?`,
        [
          body.company_name,
          body.address || null,
          body.contact_email || null,
          body.contact_phone || null,
          body.color_lopez || "#C99700",
          body.color_itwelt || "#007bff",
          body.color_itwelt_dark || "#0056b3",
          body.impressum_text || null,
          body.datenschutz_text || null,
          existing[0].id,
        ]
      );
    } else {
      // Erstellen
      await executeQueryPool(`
          INSERT INTO settings_company 
          (company_name, address, contact_email, contact_phone, color_lopez, color_itwelt, color_itwelt_dark, impressum_text, datenschutz_text, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          body.company_name,
          body.address || null,
          body.contact_email || null,
          body.contact_phone || null,
          body.color_lopez || "#C99700",
          body.color_itwelt || "#007bff",
          body.color_itwelt_dark || "#0056b3",
          body.impressum_text || null,
          body.datenschutz_text || null,
        ]);
    }

    return NextResponse.json({ success: true, message: "Unternehmensdaten erfolgreich aktualisiert" });
  } catch (error: any) {
    console.error("Fehler beim Aktualisieren der Unternehmensdaten:", error);
    return NextResponse.json({ success: false, error: error.message || "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

