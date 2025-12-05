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
 * GET /api/admin/release/approval
 * 
 * Gibt alle Versions-Freigaben zurück.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const version = searchParams.get("version");
    const approval_status = searchParams.get("approval_status");

    const connection = await mysql.createConnection(dbConfig);

    let query = `
      SELECT id, version, checklist_id, approval_status, requested_by, requested_at, approved_by, approved_at, rejected_by, rejected_at, rejection_reason, notes
      FROM release_approvals
      WHERE 1=1
    `;
    const params: any[] = [];

    if (version) {
      query += " AND version = ?";
      params.push(version);
    }

    if (approval_status) {
      query += " AND approval_status = ?";
      params.push(approval_status);
    }

    query += " ORDER BY requested_at DESC";

    const [approvals] = await connection.execute(query, params);

    await connection.end();

    return NextResponse.json({
      success: true,
      data: approvals || [],
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Freigaben", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Freigaben" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/release/approval
 * 
 * Erstellt eine neue Versions-Freigabe-Anfrage.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { version, checklist_id, notes } = body;

    if (!version) {
      return NextResponse.json(
        { success: false, message: "Version ist erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(
      `INSERT INTO release_approvals (version, checklist_id, approval_status, requested_by, notes)
       VALUES (?, ?, 'pending', 'system', ?)`,
      [version, checklist_id || null, notes || null],
    );

    const approvalId = (result as any).insertId;

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Freigabe-Anfrage erfolgreich erstellt",
      data: { id: approvalId },
    });
  } catch (error) {
    logger.error("Fehler beim Erstellen der Freigabe-Anfrage", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Erstellen der Freigabe-Anfrage" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/release/approval
 * 
 * Aktualisiert eine Versions-Freigabe (Genehmigung/Ablehnung).
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, approval_status, rejection_reason } = body;

    if (!id || !approval_status) {
      return NextResponse.json(
        { success: false, message: "ID und Freigabe-Status sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    if (approval_status === "approved") {
      await connection.execute(
        `UPDATE release_approvals SET approval_status = ?, approved_by = 'system', approved_at = NOW() WHERE id = ?`,
        [approval_status, id],
      );
    } else if (approval_status === "rejected") {
      await connection.execute(
        `UPDATE release_approvals SET approval_status = ?, rejected_by = 'system', rejected_at = NOW(), rejection_reason = ? WHERE id = ?`,
        [approval_status, rejection_reason || null, id],
      );
    } else {
      await connection.execute(
        `UPDATE release_approvals SET approval_status = ? WHERE id = ?`,
        [approval_status, id],
      );
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Freigabe erfolgreich aktualisiert",
    });
  } catch (error) {
    logger.error("Fehler beim Aktualisieren der Freigabe", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren der Freigabe" },
      { status: 500 },
    );
  }
}
