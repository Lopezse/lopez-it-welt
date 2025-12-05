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
 * GET /api/admin/dashboard/widgets
 * 
 * Gibt alle verfügbaren Widgets zurück.
 */
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Widgets aus Datenbank laden
    const [widgets] = await connection.execute(
      `SELECT id, name, type, config, description, is_system_widget, is_active, created_at, updated_at
       FROM dashboard_widgets
       WHERE is_active = TRUE
       ORDER BY name`,
    );

    await connection.end();

    // Wenn keine Widgets vorhanden, Standard-Widgets zurückgeben
    if ((widgets as any[]).length === 0) {
      return NextResponse.json({
        success: true,
        data: getDefaultWidgets(),
      });
    }

    // Config von JSON-String parsen
    const parsedWidgets = (widgets as any[]).map((widget) => ({
      ...widget,
      config: widget.config ? JSON.parse(widget.config) : {},
    }));

    return NextResponse.json({
      success: true,
      data: parsedWidgets,
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Widgets", error);
    // Fallback auf Standard-Widgets
    return NextResponse.json({
      success: true,
      data: getDefaultWidgets(),
    });
  }
}

/**
 * POST /api/admin/dashboard/widgets
 * 
 * Erstellt ein neues Widget.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, config, description } = body;

    if (!name || !type) {
      return NextResponse.json(
        { success: false, message: "Name und Typ sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Widget erstellen
    const [result] = await connection.execute(
      `INSERT INTO dashboard_widgets (name, type, config, description, is_system_widget, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, FALSE, TRUE, NOW(), NOW())`,
      [name, type, JSON.stringify(config || {}), description || null],
    );

    const widgetId = (result as any).insertId;

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('DASHBOARD_WIDGET_CREATE', 'dashboard_widgets', ?, ?)`,
      [widgetId, `Widget erstellt: ${name}`],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Widget erfolgreich erstellt",
      data: { id: widgetId, name, type, config: config || {} },
    });
  } catch (error) {
    logger.error("Fehler beim Erstellen des Widgets", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Erstellen des Widgets" },
      { status: 500 },
    );
  }
}

/**
 * Standard-Widgets (Fallback)
 */
function getDefaultWidgets() {
  return [
    {
      id: "kpi-users",
      name: "Benutzer-Statistik",
      type: "kpi",
      description: "Anzahl aktiver Benutzer",
      config: { metric: "users", format: "number" },
      is_system_widget: true,
      is_active: true,
    },
    {
      id: "kpi-tickets",
      name: "Support-Tickets",
      type: "kpi",
      description: "Offene Support-Tickets",
      config: { metric: "tickets", format: "number" },
      is_system_widget: true,
      is_active: true,
    },
    {
      id: "chart-traffic",
      name: "Traffic-Chart",
      type: "chart",
      description: "Traffic-Übersicht",
      config: { chartType: "line", metric: "traffic" },
      is_system_widget: true,
      is_active: true,
    },
    {
      id: "list-activities",
      name: "Aktuelle Aktivitäten",
      type: "list",
      description: "Liste der aktuellen Aktivitäten",
      config: { limit: 10, type: "activities" },
      is_system_widget: true,
      is_active: true,
    },
    {
      id: "status-system",
      name: "System-Status",
      type: "status",
      description: "Aktueller System-Status",
      config: { showDetails: true },
      is_system_widget: true,
      is_active: true,
    },
  ];
}


