/**
 * GET /api/audit
 * Filterbare Audit-Liste
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const action = searchParams.get("action");
    const refTable = searchParams.get("ref_table");
    const refId = searchParams.get("ref_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const connection = await createConnection();

    let query = "SELECT * FROM lopez_audit_logs WHERE 1=1";
    const params: any[] = [];

    if (userId) {
      query += " AND user_id = ?";
      params.push(userId);
    }

    if (action) {
      query += " AND action LIKE ?";
      params.push(`%${action}%`);
    }

    if (refTable) {
      query += " AND ref_table = ?";
      params.push(refTable);
    }

    if (refId) {
      query += " AND ref_id = ?";
      params.push(refId);
    }

    if (startDate) {
      query += " AND timestamp >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND timestamp <= ?";
      params.push(endDate);
    }

    query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?";
    params.push(limit, (page - 1) * limit);

    const [rows] = await connection.execute(query, params);

    // Gesamtanzahl
    let countQuery = "SELECT COUNT(*) as total FROM lopez_audit_logs WHERE 1=1";
    const countParams: any[] = [];

    if (userId) countParams.push(userId);
    if (action) countParams.push(`%${action}%`);
    if (refTable) countParams.push(refTable);
    if (refId) countParams.push(refId);
    if (startDate) countParams.push(startDate);
    if (endDate) countParams.push(endDate);

    const [countRows] = await connection.execute(
      countQuery
        .replace(/\?/g, () => {
          const val = countParams.shift();
          return val !== undefined ? `'${val}'` : "?";
        })
        .replace(/\?/g, () => "?"),
      countParams,
    );

    // Vereinfachte Zählung
    const [simpleCountRows] = await connection.execute(
      "SELECT COUNT(*) as total FROM lopez_audit_logs",
    );
    const total =
      Array.isArray(simpleCountRows) && simpleCountRows.length > 0
        ? (simpleCountRows[0] as any).total
        : 0;

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: {
          logs: Array.isArray(rows) ? rows : [],
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Audit API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Audit-Logs" },
      { status: 500 },
    );
  }
}
