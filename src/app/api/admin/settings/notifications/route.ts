import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";

// GET /api/admin/settings/notifications
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

    // Benachrichtigungseinstellungen laden
    const notifications = await executeQueryPool({
      query: "SELECT * FROM settings_notifications ORDER BY id DESC LIMIT 1",
      values: [],
    });

    if (notifications && notifications.length > 0) {
      return NextResponse.json({ success: true, data: notifications[0] });
    }

    // Fallback: Standardwerte
    return NextResponse.json({
      success: true,
      data: {
        sender_name: "Lopez IT Welt",
        sender_email: "noreply@lopez-it-welt.de",
        reply_to: "support@lopez-it-welt.de",
        email_notifications_enabled: true,
        notify_new_users: true,
        notify_errors: true,
        notify_backups: true,
        notify_updates: false,
      },
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der Benachrichtigungseinstellungen:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/settings/notifications
export async function PUT(request: NextRequest) {
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

    // Prüfen ob Eintrag existiert
    const existing = await executeQueryPool({
      query: "SELECT id FROM settings_notifications ORDER BY id DESC LIMIT 1",
      values: [],
    });

    if (existing && existing.length > 0) {
      // Aktualisieren
      await executeQueryPool({
        query: `
          UPDATE settings_notifications SET 
            sender_name = ?, sender_email = ?, reply_to = ?,
            email_notifications_enabled = ?, notify_new_users = ?, notify_errors = ?,
            notify_backups = ?, notify_updates = ?, updated_at = NOW()
          WHERE id = ?
        `,
        values: [
          body.sender_name,
          body.sender_email,
          body.reply_to,
          body.email_notifications_enabled ? 1 : 0,
          body.notify_new_users ? 1 : 0,
          body.notify_errors ? 1 : 0,
          body.notify_backups ? 1 : 0,
          body.notify_updates ? 1 : 0,
          existing[0].id,
        ],
      });
    } else {
      // Erstellen
      await executeQueryPool({
        query: `
          INSERT INTO settings_notifications 
          (sender_name, sender_email, reply_to, email_notifications_enabled, notify_new_users, notify_errors, notify_backups, notify_updates, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `,
        values: [
          body.sender_name || "Lopez IT Welt",
          body.sender_email || "noreply@lopez-it-welt.de",
          body.reply_to || "support@lopez-it-welt.de",
          body.email_notifications_enabled ? 1 : 0,
          body.notify_new_users ? 1 : 0,
          body.notify_errors ? 1 : 0,
          body.notify_backups ? 1 : 0,
          body.notify_updates ? 1 : 0,
        ],
      });
    }

    return NextResponse.json({ success: true, message: "Benachrichtigungseinstellungen erfolgreich aktualisiert" });
  } catch (error: any) {
    console.error("Fehler beim Aktualisieren der Benachrichtigungseinstellungen:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

