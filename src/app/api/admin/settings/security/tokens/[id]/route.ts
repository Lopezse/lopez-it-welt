import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";

// DELETE /api/admin/settings/security/tokens/[id]
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

    const userId = session.user.id;
    const tokenId = params.id;

    // Token löschen (nur eigene Token)
    await executeQueryPool(
      "DELETE FROM api_tokens WHERE id = ? AND user_id = ?",
      [tokenId, userId]
    );

    return NextResponse.json({ success: true, message: "Token erfolgreich gelöscht" });
  } catch (error: any) {
    console.error("Fehler beim Löschen des Tokens:", error);
    return NextResponse.json({ success: false, error: error.message || "Fehler beim Löschen des Tokens" }, { status: 500 });
  }
}

