import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
  port: parseInt(process.env.DB_PORT || "3306"),
};

/**
 * GET /api/admin/dashboard/widgets/[id]
 * 
 * Lädt ein spezifisches Widget.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const widgetId = params.id;
    const connection = await mysql.createConnection(dbConfig);

    const [widgets] = await connection.execute(
      `SELECT id, name, type, config, description, is_system_widget, is_active, created_at, updated_at
       FROM dashboard_widgets
       WHERE id = ?`,
      [widgetId],
    );

    if ((widgets as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Widget nicht gefunden" },
        { status: 404 },
      );
    }

    const widget = (widgets as any[])[0];
    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        ...widget,
        config: widget.config ? JSON.parse(widget.config) : {},
      },
    });
  } catch (error) {
    logger.error("Fehler beim Laden des Widgets", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden des Widgets" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/dashboard/widgets/[id]
 * 
 * Aktualisiert ein Widget.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const widgetId = params.id;
    const body = await request.json();
    const { name, type, config, description, is_active } = body;

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Widget existiert
    const [existingWidget] = await connection.execute(
      "SELECT id, is_system_widget FROM dashboard_widgets WHERE id = ?",
      [widgetId],
    );

    if ((existingWidget as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Widget nicht gefunden" },
        { status: 404 },
      );
    }

    const widget = (existingWidget as any[])[0];

    // System-Widgets können nicht geändert werden
    if (widget.is_system_widget && (name || type || config)) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "System-Widgets können nicht geändert werden" },
        { status: 400 },
      );
    }

    // Widget aktualisieren
    await connection.execute(
      `UPDATE dashboard_widgets SET 
        name = COALESCE(?, name),
        type = COALESCE(?, type),
        config = COALESCE(?, config),
        description = COALESCE(?, description),
        is_active = COALESCE(?, is_active),
        updated_at = NOW()
       WHERE id = ?`,
      [
        name || null,
        type || null,
        config ? JSON.stringify(config) : null,
        description || null,
        is_active !== undefined ? is_active : null,
        widgetId,
      ],
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('DASHBOARD_WIDGET_UPDATE', 'dashboard_widgets', ?, ?)`,
      [widgetId, `Widget aktualisiert: ${name || widgetId}`],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Widget erfolgreich aktualisiert",
    });
  } catch (error) {
    logger.error("Fehler beim Aktualisieren des Widgets", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren des Widgets" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/dashboard/widgets/[id]
 * 
 * Löscht ein Widget.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const widgetId = params.id;
    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Widget existiert
    const [existingWidget] = await connection.execute(
      "SELECT id, is_system_widget, name FROM dashboard_widgets WHERE id = ?",
      [widgetId],
    );

    if ((existingWidget as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Widget nicht gefunden" },
        { status: 404 },
      );
    }

    const widget = (existingWidget as any[])[0];

    // System-Widgets können nicht gelöscht werden
    if (widget.is_system_widget) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "System-Widgets können nicht gelöscht werden" },
        { status: 400 },
      );
    }

    // Widget löschen
    await connection.execute("DELETE FROM dashboard_widgets WHERE id = ?", [widgetId]);

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('DASHBOARD_WIDGET_DELETE', 'dashboard_widgets', ?, ?)`,
      [widgetId, `Widget gelöscht: ${widget.name}`],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Widget erfolgreich gelöscht",
    });
  } catch (error) {
    logger.error("Fehler beim Löschen des Widgets", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Löschen des Widgets" },
      { status: 500 },
    );
  }
}


