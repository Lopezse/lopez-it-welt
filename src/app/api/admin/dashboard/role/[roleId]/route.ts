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
 * GET /api/admin/dashboard/role/[roleId]
 * 
 * Lädt das Dashboard für eine spezifische Rolle.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const roleId = parseInt(params.roleId);
    const connection = await mysql.createConnection(dbConfig);

    // Standard-Konfiguration für diese Rolle laden
    const [configs] = await connection.execute(
      `SELECT 
        dc.id,
        dc.role_id,
        dc.config_name,
        dc.layout,
        dc.is_default,
        dc.is_active
       FROM dashboard_configs dc
       WHERE dc.role_id = ? AND dc.is_active = TRUE
       ORDER BY dc.is_default DESC, dc.created_at DESC
       LIMIT 1`,
      [roleId],
    );

    if ((configs as any[]).length === 0) {
      await connection.end();
      // Fallback: Leeres Dashboard
      return NextResponse.json({
        success: true,
        data: {
          config: null,
          widgets: [],
        },
      });
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
        dw.config as widget_config,
        dw.description as widget_description
       FROM dashboard_widget_assignments dwa
       JOIN dashboard_widgets dw ON dwa.widget_id = dw.id
       WHERE dwa.dashboard_config_id = ? AND dwa.is_visible = TRUE AND dw.is_active = TRUE
       ORDER BY dwa.order_index`,
      [config.id],
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
        config: {
          ...config,
          layout: config.layout ? JSON.parse(config.layout) : {},
        },
        widgets: parsedAssignments,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Laden des Rollen-Dashboards", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden des Dashboards" },
      { status: 500 },
    );
  }
}


