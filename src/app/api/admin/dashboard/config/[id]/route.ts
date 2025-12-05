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
 * GET /api/admin/dashboard/config/[id]
 * 
 * Lädt eine spezifische Dashboard-Konfiguration mit Widget-Zuweisungen.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const configId = params.id;
    const connection = await mysql.createConnection(dbConfig);

    // Konfiguration laden
    const [configs] = await connection.execute(
      `SELECT 
        dc.id,
        dc.role_id,
        dc.config_name,
        dc.layout,
        dc.is_default,
        dc.is_active,
        dc.created_at,
        dc.updated_at,
        r.role_name
       FROM dashboard_configs dc
       LEFT JOIN lopez_core_roles r ON dc.role_id = r.id
       WHERE dc.id = ?`,
      [configId],
    );

    if ((configs as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Konfiguration nicht gefunden" },
        { status: 404 },
      );
    }

    const config = (configs as any[])[0];

    // Widget-Zuweisungen laden
    const [assignments] = await connection.execute(
      `SELECT 
        dwa.id,
        dwa.widget_id,
        dwa.position_x,
        dwa.position_y,
        dwa.width,
        dwa.height,
        dwa.order_index,
        dwa.is_visible,
        dw.name as widget_name,
        dw.type as widget_type,
        dw.config as widget_config
       FROM dashboard_widget_assignments dwa
       JOIN dashboard_widgets dw ON dwa.widget_id = dw.id
       WHERE dwa.dashboard_config_id = ?
       ORDER BY dwa.order_index`,
      [configId],
    );

    await connection.end();

    // Config und Widget-Config von JSON-String parsen
    const parsedAssignments = (assignments as any[]).map((assignment) => ({
      ...assignment,
      widget_config: assignment.widget_config ? JSON.parse(assignment.widget_config) : {},
    }));

    return NextResponse.json({
      success: true,
      data: {
        ...config,
        layout: config.layout ? JSON.parse(config.layout) : {},
        widgets: parsedAssignments,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Dashboard-Konfiguration", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Konfiguration" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/dashboard/config/[id]
 * 
 * Aktualisiert eine Dashboard-Konfiguration.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const configId = params.id;
    const body = await request.json();
    const { config_name, layout, is_default, is_active } = body;

    const connection = await mysql.createConnection(dbConfig);

    // Konfiguration laden
    const [configs] = await connection.execute(
      "SELECT role_id FROM dashboard_configs WHERE id = ?",
      [configId],
    );

    if ((configs as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Konfiguration nicht gefunden" },
        { status: 404 },
      );
    }

    const config = (configs as any[])[0];

    // Wenn is_default = true, andere Defaults für diese Rolle deaktivieren
    if (is_default) {
      await connection.execute(
        `UPDATE dashboard_configs SET is_default = FALSE WHERE role_id = ? AND id != ?`,
        [config.role_id, configId],
      );
    }

    // Konfiguration aktualisieren
    await connection.execute(
      `UPDATE dashboard_configs SET 
        config_name = COALESCE(?, config_name),
        layout = COALESCE(?, layout),
        is_default = COALESCE(?, is_default),
        is_active = COALESCE(?, is_active),
        updated_at = NOW()
       WHERE id = ?`,
      [
        config_name || null,
        layout ? JSON.stringify(layout) : null,
        is_default !== undefined ? is_default : null,
        is_active !== undefined ? is_active : null,
        configId,
      ],
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('DASHBOARD_CONFIG_UPDATE', 'dashboard_configs', ?, ?)`,
      [configId, `Dashboard-Konfiguration aktualisiert: ${config_name || configId}`],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Dashboard-Konfiguration erfolgreich aktualisiert",
    });
  } catch (error) {
    logger.error("Fehler beim Aktualisieren der Dashboard-Konfiguration", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren der Konfiguration" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/dashboard/config/[id]
 * 
 * Löscht eine Dashboard-Konfiguration.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const configId = params.id;
    const connection = await mysql.createConnection(dbConfig);

    // Konfiguration laden
    const [configs] = await connection.execute(
      "SELECT config_name FROM dashboard_configs WHERE id = ?",
      [configId],
    );

    if ((configs as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Konfiguration nicht gefunden" },
        { status: 404 },
      );
    }

    const config = (configs as any[])[0];

    // Konfiguration löschen (CASCADE löscht automatisch die Widget-Zuweisungen)
    await connection.execute("DELETE FROM dashboard_configs WHERE id = ?", [configId]);

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('DASHBOARD_CONFIG_DELETE', 'dashboard_configs', ?, ?)`,
      [configId, `Dashboard-Konfiguration gelöscht: ${config.config_name}`],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Dashboard-Konfiguration erfolgreich gelöscht",
    });
  } catch (error) {
    logger.error("Fehler beim Löschen der Dashboard-Konfiguration", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Löschen der Konfiguration" },
      { status: 500 },
    );
  }
}


