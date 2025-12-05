import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";

// GET /api/admin/settings/security
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

    // 2FA Status laden
    const twoFactor = await executeQueryPool({
      query: "SELECT enabled, secret FROM two_factor_auth WHERE user_id = ?",
      values: [userId],
    });

    const twoFactorEnabled = twoFactor && twoFactor.length > 0 ? twoFactor[0].enabled === 1 : false;

    return NextResponse.json({
      success: true,
      data: {
        two_factor_enabled: twoFactorEnabled,
        backup_codes: twoFactorEnabled && twoFactor[0].backup_codes ? JSON.parse(twoFactor[0].backup_codes) : null,
      },
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der Sicherheitseinstellungen:", error);
    return NextResponse.json({ success: true, data: { two_factor_enabled: false, backup_codes: null } });
  }
}

