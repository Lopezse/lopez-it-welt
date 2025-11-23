/**
 * GET /api/payroll/periods
 * POST /api/payroll/periods
 * Abrechnungsperioden verwalten
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let connection: any = null;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    connection = await createConnection();

    let query = `
      SELECT * FROM lopez_payroll_periods
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    query += " ORDER BY period_start DESC LIMIT ? OFFSET ?";
    params.push(limit, (page - 1) * limit);

    const [rows] = await connection.execute(query, params);

    // Gesamtanzahl
    let countQuery = "SELECT COUNT(*) as total FROM lopez_payroll_periods WHERE 1=1";
    const countParams: any[] = [];
    if (status) {
      countQuery += " AND status = ?";
      countParams.push(status);
    }

    const [countRows] = await connection.execute(countQuery, countParams);
    const total = Array.isArray(countRows) && countRows.length > 0 ? (countRows[0] as any).total : 0;

    if (connection) {
      await connection.end();
    }

    return NextResponse.json({
      success: true,
      data: {
        periods: Array.isArray(rows) ? rows : [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Payroll Periods API Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Fehler beim Laden der Abrechnungsperioden",
        data: {
          periods: [],
          pagination: { page: 1, limit: 50, total: 0, pages: 0 },
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  let connection: any = null;

  try {
    const body = await request.json();
    const {
      period_start,
      period_end,
      period_type = "monthly",
      status = "draft",
      notes,
      created_by = "system",
    } = body;

    if (!period_start || !period_end) {
      return NextResponse.json(
        { success: false, error: "period_start und period_end sind erforderlich" },
        { status: 400 },
      );
    }

    connection = await createConnection();

    const [result] = await connection.execute(
      `INSERT INTO lopez_payroll_periods 
       (period_start, period_end, period_type, status, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [period_start, period_end, period_type, status, notes || null, created_by],
    );

    const periodId = (result as any).insertId;

    // Audit-Log
    try {
      await connection.execute(
        `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
         VALUES ('PAYROLL_PERIOD_CREATE', 'lopez_payroll_periods', ?, ?)`,
        [periodId, `Abrechnungsperiode erstellt: ${period_start} - ${period_end}`],
      );
    } catch (auditError) {
      console.error("⚠️ Audit-Log Fehler:", auditError);
      // Nicht blockierend
    }

    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: periodId,
          period_start,
          period_end,
          period_type,
          status,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("❌ Payroll Periods API Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      { success: false, error: error?.message || "Fehler beim Erstellen der Abrechnungsperiode" },
      { status: 500 },
    );
  }
}


 * GET /api/payroll/periods
 * POST /api/payroll/periods
 * Abrechnungsperioden verwalten
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let connection: any = null;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    connection = await createConnection();

    let query = `
      SELECT * FROM lopez_payroll_periods
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    query += " ORDER BY period_start DESC LIMIT ? OFFSET ?";
    params.push(limit, (page - 1) * limit);

    const [rows] = await connection.execute(query, params);

    // Gesamtanzahl
    let countQuery = "SELECT COUNT(*) as total FROM lopez_payroll_periods WHERE 1=1";
    const countParams: any[] = [];
    if (status) {
      countQuery += " AND status = ?";
      countParams.push(status);
    }

    const [countRows] = await connection.execute(countQuery, countParams);
    const total = Array.isArray(countRows) && countRows.length > 0 ? (countRows[0] as any).total : 0;

    if (connection) {
      await connection.end();
    }

    return NextResponse.json({
      success: true,
      data: {
        periods: Array.isArray(rows) ? rows : [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Payroll Periods API Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Fehler beim Laden der Abrechnungsperioden",
        data: {
          periods: [],
          pagination: { page: 1, limit: 50, total: 0, pages: 0 },
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  let connection: any = null;

  try {
    const body = await request.json();
    const {
      period_start,
      period_end,
      period_type = "monthly",
      status = "draft",
      notes,
      created_by = "system",
    } = body;

    if (!period_start || !period_end) {
      return NextResponse.json(
        { success: false, error: "period_start und period_end sind erforderlich" },
        { status: 400 },
      );
    }

    connection = await createConnection();

    const [result] = await connection.execute(
      `INSERT INTO lopez_payroll_periods 
       (period_start, period_end, period_type, status, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [period_start, period_end, period_type, status, notes || null, created_by],
    );

    const periodId = (result as any).insertId;

    // Audit-Log
    try {
      await connection.execute(
        `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
         VALUES ('PAYROLL_PERIOD_CREATE', 'lopez_payroll_periods', ?, ?)`,
        [periodId, `Abrechnungsperiode erstellt: ${period_start} - ${period_end}`],
      );
    } catch (auditError) {
      console.error("⚠️ Audit-Log Fehler:", auditError);
      // Nicht blockierend
    }

    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: periodId,
          period_start,
          period_end,
          period_type,
          status,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("❌ Payroll Periods API Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      { success: false, error: error?.message || "Fehler beim Erstellen der Abrechnungsperiode" },
      { status: 500 },
    );
  }
}



















