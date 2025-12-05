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
 * PUT /api/admin/release/approval/[id]
 * 
 * Aktualisiert eine Versions-Freigabe (Approve/Reject).
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const approvalId = params.id;
    const body = await request.json();
    const { status, comments } = body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status muss 'approved' oder 'rejected' sein" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    const timestampField = status === "approved" ? "approved_at" : "rejected_at";

    await connection.execute(
      `UPDATE release_approvals 
       SET status = ?, comments = ?, ${timestampField} = NOW() 
       WHERE id = ?`,
      [status, comments || null, approvalId],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: `Freigabe erfolgreich ${status === "approved" ? "genehmigt" : "abgelehnt"}`,
    });
  } catch (error) {
    logger.error("Fehler beim Aktualisieren der Freigabe", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren der Freigabe" },
      { status: 500 },
    );
  }
}

