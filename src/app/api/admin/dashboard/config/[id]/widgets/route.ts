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
 * POST /api/admin/dashboard/config/[id]/widgets
 * 
 * Weist ein Widget einer Dashboard-Konfiguration zu.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const configId = params.id;
    const body = await request.json();
    const { widget_id, position_x, position_y, width, height, order_index, is_visible } = body;

    if (!widget_id) {
      return NextResponse.json(
        { success: false, message: "Widget-ID ist erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Konfiguration existiert
    const [configs] = await connection.execute(
      "SELECT id FROM dashboard_configs WHERE id = ?",
      [configId],
    );

    if ((configs as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Konfiguration nicht gefunden" },
        { status: 404 },
      );
    }

    // Prüfen ob Widget existiert
    const [widgets] = await connection.execute(
      "SELECT id FROM dashboard_widgets WHERE id = ?",
      [widget_id],
    );

    if ((widgets as any[]).length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Widget nicht gefunden" },
        { status: 404 },
      );
    }

    // Widget zuweisen
    const [result] = await connection.execute(
      `INSERT INTO dashboard_widget_assignments 
       (dashboard_config_id, widget_id, position_x, position_y, width, height, order_index, is_visible, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        configId,
        widget_id,
        position_x || 0,
        position_y || 0,
        width || 1,
        height || 1,
        order_index || 0,
        is_visible !== false,
      ],
    );

    const assignmentId = (result as any).insertId;

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Widget erfolgreich zugewiesen",
      data: { id: assignmentId },
    });
  } catch (error) {
    logger.error("Fehler beim Zuweisen des Widgets", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Zuweisen des Widgets" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/dashboard/config/[id]/widgets
 * 
 * Entfernt ein Widget aus einer Dashboard-Konfiguration.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const configId = params.id;
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get("assignment_id");

    if (!assignmentId) {
      return NextResponse.json(
        { success: false, message: "Assignment-ID ist erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Widget-Zuweisung entfernen
    await connection.execute(
      "DELETE FROM dashboard_widget_assignments WHERE id = ? AND dashboard_config_id = ?",
      [assignmentId, configId],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Widget erfolgreich entfernt",
    });
  } catch (error) {
    logger.error("Fehler beim Entfernen des Widgets", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Entfernen des Widgets" },
      { status: 500 },
    );
  }
}


