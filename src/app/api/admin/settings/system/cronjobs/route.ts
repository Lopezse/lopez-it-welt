import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// GET /api/admin/settings/system/cronjobs
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

    // Cronjobs laden (vereinfacht - in Produktion sollte eine cronjobs-Tabelle existieren)
    return NextResponse.json({ success: true, data: [] });
  } catch (error: any) {
    console.error("Fehler beim Laden der Cronjobs:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}

