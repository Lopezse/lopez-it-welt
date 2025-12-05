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
 * GET /api/admin/release/checklist/[id]
 * 
 * Gibt eine spezifische Pre-Release Checkliste zurück.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const checklistId = params.id;
    const connection = await mysql.createConnection(dbConfig);

    const [checklists] = await connection.execute(
      `SELECT id, checklist_name, version, items, status, created_by, created_at, updated_at, completed_at, approved_by, approved_at
       FROM release_checklists
       WHERE id = ?`,
      [checklistId],
    );

    await connection.end();

    if ((checklists as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: "Checkliste nicht gefunden" },
        { status: 404 },
      );
    }

    const checklist = (checklists as any[])[0];
    checklist.items = typeof checklist.items === "string" ? JSON.parse(checklist.items) : checklist.items;

    return NextResponse.json({
      success: true,
      data: checklist,
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Checkliste", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Checkliste" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/release/checklist/[id]
 * 
 * Löscht eine Pre-Release Checkliste.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const checklistId = params.id;
    const connection = await mysql.createConnection(dbConfig);

    await connection.execute("DELETE FROM release_checklists WHERE id = ?", [checklistId]);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Checkliste erfolgreich gelöscht",
    });
  } catch (error) {
    logger.error("Fehler beim Löschen der Checkliste", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Löschen der Checkliste" },
      { status: 500 },
    );
  }
}
