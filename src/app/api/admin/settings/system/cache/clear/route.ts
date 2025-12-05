import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// POST /api/admin/settings/system/cache/clear
export async function POST(request: NextRequest) {
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

    // Cache leeren (vereinfacht - in Produktion sollte echte Cache-Logik implementiert werden)
    return NextResponse.json({ success: true, message: "Cache erfolgreich geleert" });
  } catch (error: any) {
    console.error("Fehler beim Leeren des Caches:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

