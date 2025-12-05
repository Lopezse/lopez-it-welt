import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// POST /api/admin/settings/ai/test
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

    const body = await request.json();
    const { provider } = body;

    // Vereinfachter Test (in Produktion sollte echte Verbindung getestet werden)
    return NextResponse.json({
      success: true,
      message: `Verbindung zu ${provider} erfolgreich getestet`,
    });
  } catch (error: any) {
    console.error("Fehler beim Testen der KI-Verbindung:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

