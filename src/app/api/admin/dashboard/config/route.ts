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
 * GET /api/admin/dashboard/config
 * 
 * Lädt Dashboard-Konfigurationen (optional gefiltert nach Rolle).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get("role_id");

    const connection = await mysql.createConnection(dbConfig);

    let query = `
      SELECT 
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
      WHERE dc.is_active = TRUE
    `;
    const params: any[] = [];

    if (roleId) {
      query += " AND dc.role_id = ?";
      params.push(roleId);
    }

    query += " ORDER BY dc.is_default DESC, dc.config_name";

    const [configs] = await connection.execute(query, params);

    await connection.end();

    // Layout von JSON-String parsen
    const parsedConfigs = (configs as any[]).map((config) => ({
      ...config,
      layout: config.layout ? JSON.parse(config.layout) : {},
    }));

    return NextResponse.json({
      success: true,
      data: parsedConfigs,
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Dashboard-Konfigurationen", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Konfigurationen" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/dashboard/config
 * 
 * Erstellt eine neue Dashboard-Konfiguration.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role_id, config_name, layout, is_default } = body;

    if (!role_id || !config_name) {
      return NextResponse.json(
        { success: false, message: "Rollen-ID und Konfigurations-Name sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Wenn is_default = true, andere Defaults für diese Rolle deaktivieren
    if (is_default) {
      await connection.execute(
        `UPDATE dashboard_configs SET is_default = FALSE WHERE role_id = ?`,
        [role_id],
      );
    }

    // Konfiguration erstellen
    const [result] = await connection.execute(
      `INSERT INTO dashboard_configs (role_id, config_name, layout, is_default, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, TRUE, NOW(), NOW())`,
      [role_id, config_name, JSON.stringify(layout || {}), is_default || false],
    );

    const configId = (result as any).insertId;

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('DASHBOARD_CONFIG_CREATE', 'dashboard_configs', ?, ?)`,
      [configId, `Dashboard-Konfiguration erstellt: ${config_name}`],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Dashboard-Konfiguration erfolgreich erstellt",
      data: { id: configId, role_id, config_name, layout: layout || {} },
    });
  } catch (error) {
    logger.error("Fehler beim Erstellen der Dashboard-Konfiguration", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Erstellen der Konfiguration" },
      { status: 500 },
    );
  }
}


