import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// GET /api/admin/settings/system
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

    // Systeminformationen zurückgeben
    return NextResponse.json({
      success: true,
      data: {
        version: process.env.npm_package_version || "1.0.0",
        node_version: process.version,
        platform: process.platform,
        uptime: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`,
      },
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der Systeminformationen:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

