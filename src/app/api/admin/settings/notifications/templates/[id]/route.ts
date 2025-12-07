import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";

// PUT /api/admin/settings/notifications/templates/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const templateId = params.id;
    const body = await request.json();

    // Vorlage aktualisieren
    await executeQueryPool(
      `UPDATE email_templates SET 
        subject = ?, body_html = ?, body_text = ?, updated_at = NOW()
      WHERE id = ?`,
      [body.subject, body.body_html, body.body_text, templateId]
    );

    return NextResponse.json({ success: true, message: "Vorlage erfolgreich aktualisiert" });
  } catch (error: any) {
    console.error("Fehler beim Aktualisieren der Vorlage:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

