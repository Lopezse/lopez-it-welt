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
 * GET /api/admin/release/checklist
 * 
 * Gibt alle Pre-Release Checklisten zurück.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const version = searchParams.get("version");
    const status = searchParams.get("status");

    const connection = await mysql.createConnection(dbConfig);

    let query = `
      SELECT id, checklist_name, version, items, status, created_by, created_at, updated_at, completed_at, approved_by, approved_at
      FROM release_checklists
      WHERE 1=1
    `;
    const params: any[] = [];

    if (version) {
      query += " AND version = ?";
      params.push(version);
    }

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    query += " ORDER BY created_at DESC";

    const [checklists] = await connection.execute(query, params);

    await connection.end();

    // Items von JSON-String parsen
    const parsedChecklists = (checklists as any[]).map((checklist) => ({
      ...checklist,
      items: typeof checklist.items === "string" ? JSON.parse(checklist.items) : checklist.items,
    }));

    return NextResponse.json({
      success: true,
      data: parsedChecklists,
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Checklisten", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Checklisten" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/release/checklist
 * 
 * Erstellt eine neue Pre-Release Checkliste.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checklist_name, version, items } = body;

    if (!checklist_name || !version || !items) {
      return NextResponse.json(
        { success: false, message: "Checklistenname, Version und Items sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(
      `INSERT INTO release_checklists (checklist_name, version, items, status, created_by)
       VALUES (?, ?, ?, 'draft', 'system')`,
      [checklist_name, version, JSON.stringify(items)],
    );

    const checklistId = (result as any).insertId;

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Checkliste erfolgreich erstellt",
      data: { id: checklistId },
    });
  } catch (error) {
    logger.error("Fehler beim Erstellen der Checkliste", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Erstellen der Checkliste" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/release/checklist
 * 
 * Aktualisiert eine Pre-Release Checkliste.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, checklist_name, version, items, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID ist erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    const updateFields: string[] = [];
    const params: any[] = [];

    if (checklist_name) {
      updateFields.push("checklist_name = ?");
      params.push(checklist_name);
    }

    if (version) {
      updateFields.push("version = ?");
      params.push(version);
    }

    if (items) {
      updateFields.push("items = ?");
      params.push(JSON.stringify(items));
    }

    if (status) {
      updateFields.push("status = ?");
      params.push(status);

      if (status === "completed") {
        updateFields.push("completed_at = NOW()");
      } else if (status === "approved") {
        updateFields.push("approved_at = NOW()");
        updateFields.push("approved_by = 'system'");
      }
    }

    if (updateFields.length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Keine Felder zum Aktualisieren" },
        { status: 400 },
      );
    }

    updateFields.push("updated_at = NOW()");
    params.push(id);

    await connection.execute(
      `UPDATE release_checklists SET ${updateFields.join(", ")} WHERE id = ?`,
      params,
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Checkliste erfolgreich aktualisiert",
    });
  } catch (error) {
    logger.error("Fehler beim Aktualisieren der Checkliste", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren der Checkliste" },
      { status: 500 },
    );
  }
}
