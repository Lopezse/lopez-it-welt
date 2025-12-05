import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";

// GET /api/admin/settings/profile/login-history
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

    // Login-Historie laden (letzte 50 Einträge)
    const history = await executeQueryPool({
      query: `
        SELECT id, created_at as date, ip_address as ip, user_agent as device, status 
        FROM login_history 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 50
      `,
      values: [userId],
    });

    return NextResponse.json({
      success: true,
      data: (history || []).map((item: any) => ({
        id: item.id,
        date: item.date,
        ip: item.ip || "Unbekannt",
        device: item.device || "Unbekannt",
        status: item.status || "success",
      })),
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der Login-Historie:", error);
    // Fallback: Leere Liste zurückgeben
    return NextResponse.json({ success: true, data: [] });
  }
}

