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
 * GET /api/admin/privileges/audit
 * 
 * Gibt das Audit-Log für Privilegien-Änderungen zurück.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const userId = searchParams.get("user_id");
    const action = searchParams.get("action");
    const limit = parseInt(searchParams.get("limit") || "100");

    const connection = await mysql.createConnection(dbConfig);

    let query = `
      SELECT 
        al.id,
        al.action,
        al.ref_table,
        al.ref_id,
        al.notes,
        al.user_id,
        al.username,
        al.ip_address,
        al.created_at
      FROM lopez_audit_logs al
      WHERE al.ref_table = 'lopez_core_permissions' 
        OR al.action IN ('PRIVILEGE_ASSIGN', 'PRIVILEGE_REMOVE', 'PRIVILEGE_UPDATE')
    `;
    const params: any[] = [];

    if (startDate) {
      query += " AND al.created_at >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND al.created_at <= ?";
      params.push(endDate);
    }

    if (userId) {
      query += " AND al.user_id = ?";
      params.push(userId);
    }

    if (action) {
      query += " AND al.action = ?";
      params.push(action);
    }

    query += " ORDER BY al.created_at DESC LIMIT ?";
    params.push(limit);

    const [auditLogs] = await connection.execute(query, params);

    await connection.end();

    return NextResponse.json({
      success: true,
      data: auditLogs || [],
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Privilegien-Audit-Logs", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Audit-Logs" },
      { status: 500 },
    );
  }
}


