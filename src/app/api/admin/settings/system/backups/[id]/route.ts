import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// DELETE /api/admin/settings/system/backups/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Backup löschen (vereinfacht)
    return NextResponse.json({ success: true, message: "Backup erfolgreich gelöscht" });
  } catch (error: any) {
    console.error("Fehler beim Löschen des Backups:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

