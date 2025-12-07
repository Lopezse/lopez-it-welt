import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";

// GET /api/admin/settings/system/status
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

    // Datenbank-Status prüfen
    let dbStatus = "offline";
    let dbVersion = "Unknown";
    try {
      const dbInfo = await executeQueryPool(
        "SELECT VERSION() as version",
        []
      );
      if (dbInfo && dbInfo.length > 0) {
        dbStatus = "online";
        dbVersion = dbInfo[0].version || "Unknown";
      }
    } catch (error) {
      console.error("Datenbank-Fehler:", error);
    }

    return NextResponse.json({
      success: true,
      data: {
        database: {
          status: dbStatus,
          version: dbVersion,
        },
        api: {
          status: "online",
          uptime: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`,
        },
        queue: {
          status: "running",
          jobs: 0,
        },
        disk_space: {
          used: "N/A",
          total: "N/A",
          percent: 0,
        },
      },
    });
  } catch (error: any) {
    console.error("Fehler beim Laden des Systemstatus:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

