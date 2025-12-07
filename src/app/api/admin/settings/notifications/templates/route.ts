import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";

// GET /api/admin/settings/notifications/templates
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

    // E-Mail-Vorlagen laden
    const templates = await executeQueryPool(
      "SELECT * FROM email_templates ORDER BY name ASC",
      []
    );

    return NextResponse.json({ success: true, data: templates || [] });
  } catch (error: any) {
    console.error("Fehler beim Laden der E-Mail-Vorlagen:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}

