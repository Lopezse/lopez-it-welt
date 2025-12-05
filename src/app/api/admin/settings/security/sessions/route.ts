import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";

// GET /api/admin/settings/security/sessions
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
    const currentSessionId = session.sessionId;

    // Sessions laden (vereinfacht - in Produktion sollte eine sessions-Tabelle existieren)
    return NextResponse.json({
      success: true,
      data: [
        {
          id: currentSessionId || "current",
          device: "Aktuelles Gerät",
          ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unbekannt",
          last_activity: new Date().toISOString(),
          current: true,
        },
      ],
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der Sessions:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}

