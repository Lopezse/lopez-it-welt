import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { cookies } from "next/headers";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
  port: parseInt(process.env.DB_PORT || "3306"),
};

/**
 * GET /api/admin/dashboard/current
 * 
 * Lädt das Dashboard für den aktuellen Benutzer basierend auf seiner Rolle.
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    // Prüfe verschiedene Cookie-Namen für Session
    const sessionToken = 
      cookieStore.get("session_token")?.value ||
      cookieStore.get("adm_session")?.value ||
      cookieStore.get("session")?.value;

    if (!sessionToken) {
      // Fallback: Leeres Dashboard zurückgeben statt Fehler
      return NextResponse.json({
        success: true,
        data: {
          config: null,
          widgets: [],
          role: null,
        },
      });
    }

    const connection = await mysql.createConnection(dbConfig);

    // Benutzer und Rolle laden
    // Prüfe zuerst lopez_core_sessions, dann lopez_sessions als Fallback
    let [sessions] = await connection.execute(
      `SELECT u.id, u.role_id, r.role_name, r.role_code
       FROM lopez_core_sessions s
       JOIN lopez_core_users u ON s.user_id = u.id
       LEFT JOIN lopez_core_roles r ON u.role_id = r.id
       WHERE s.session_token = ? AND s.is_active = TRUE AND s.expires_at > NOW()`,
      [sessionToken],
    );

    // Fallback auf lopez_sessions falls lopez_core_sessions leer ist
    if ((sessions as any[]).length === 0) {
      [sessions] = await connection.execute(
        `SELECT u.id, u.role_id, r.role_name, r.role_code
         FROM lopez_sessions s
         JOIN lopez_users u ON s.user_id = u.id
         LEFT JOIN lopez_core_roles r ON u.role_id = r.id
         WHERE s.session_token = ? AND s.expires_at > NOW()`,
        [sessionToken],
      );
    }

    if ((sessions as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Session nicht gefunden" },
        { status: 401 },
      );
    }

    const session = (sessions as any[])[0];
    const roleId = session.role_id;

    if (!roleId) {
      await connection.end();
      // Fallback: Leeres Dashboard
      return NextResponse.json({
        success: true,
        data: {
          config: null,
          widgets: [],
          role: null,
        },
      });
    }

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

    let widgets: any[] = [];
    let config: any = null;

    if ((configs as any[]).length > 0) {
      config = (configs as any[])[0];

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

      // Widget-Config von JSON-String parsen
      widgets = (assignments as any[]).map((assignment) => ({
        ...assignment,
        widget_config: assignment.widget_config ? JSON.parse(assignment.widget_config) : {},
      }));
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        config: config
          ? {
              ...config,
              layout: config.layout ? JSON.parse(config.layout) : {},
            }
          : null,
        widgets,
        role: {
          id: roleId,
          name: session.role_name,
          code: session.role_code,
        },
      },
    });
  } catch (error) {
    logger.error("Fehler beim Laden des aktuellen Dashboards", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden des Dashboards" },
      { status: 500 },
    );
  }
}

