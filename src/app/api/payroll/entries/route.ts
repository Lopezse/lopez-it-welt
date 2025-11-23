/**
 * GET /api/payroll/entries
 * POST /api/payroll/entries
 * Abrechnungseinträge verwalten (baut auf work_sessions auf)
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let connection: any = null;

  try {
    const { searchParams } = new URL(request.url);
    const period_id = searchParams.get("period_id");
    const user_id = searchParams.get("user_id");
    const approved = searchParams.get("approved");
    const invoiced = searchParams.get("invoiced");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    connection = await createConnection();

    let query = `
      SELECT pe.*,
             ws.taetigkeit,
             ws.start_time,
             ws.end_time,
             p.project_name,
             o.order_number,
             t.task_title,
             u.name as user_name
      FROM lopez_payroll_entries pe
      LEFT JOIN work_sessions ws ON pe.session_id = ws.id
      LEFT JOIN lopez_projects p ON pe.project_id = p.id
      LEFT JOIN lopez_orders o ON pe.order_id = o.id
      LEFT JOIN lopez_tasks t ON pe.task_id = t.id
      LEFT JOIN lopez_users u ON pe.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (period_id) {
      query += " AND pe.period_id = ?";
      params.push(period_id);
    }
    if (user_id) {
      query += " AND pe.user_id = ?";
      params.push(user_id);
    }
    if (approved !== null) {
      query += " AND pe.approved = ?";
      params.push(approved === "true" ? 1 : 0);
    }
    if (invoiced !== null) {
      query += " AND pe.invoiced = ?";
      params.push(invoiced === "true" ? 1 : 0);
    }

    query += " ORDER BY pe.work_date DESC LIMIT ? OFFSET ?";
    params.push(limit, (page - 1) * limit);

    const [rows] = await connection.execute(query, params);

    // Gesamtanzahl
    let countQuery = "SELECT COUNT(*) as total FROM lopez_payroll_entries WHERE 1=1";
    const countParams: any[] = [];
    if (period_id) {
      countQuery += " AND period_id = ?";
      countParams.push(period_id);
    }
    if (user_id) {
      countQuery += " AND user_id = ?";
      countParams.push(user_id);
    }
    if (approved !== null) {
      countQuery += " AND approved = ?";
      countParams.push(approved === "true" ? 1 : 0);
    }
    if (invoiced !== null) {
      countQuery += " AND invoiced = ?";
      countParams.push(invoiced === "true" ? 1 : 0);
    }

    const [countRows] = await connection.execute(countQuery, countParams);
    const total = Array.isArray(countRows) && countRows.length > 0 ? (countRows[0] as any).total : 0;

    if (connection) {
      await connection.end();
    }

    return NextResponse.json({
      success: true,
      data: {
        entries: Array.isArray(rows) ? rows : [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Payroll Entries API Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Fehler beim Laden der Abrechnungseinträge",
        data: {
          entries: [],
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
      period_id,
      user_id,
      session_id,
      project_id,
      order_id,
      task_id,
      work_date,
      hours_worked,
      hourly_rate,
      category = "umsetzung",
      description,
      created_by = "system",
    } = body;

    if (!period_id || !user_id || !work_date || !hours_worked || !hourly_rate) {
      return NextResponse.json(
        {
          success: false,
          error:
            "period_id, user_id, work_date, hours_worked und hourly_rate sind erforderlich",
        },
        { status: 400 },
      );
    }

    connection = await createConnection();

    // Betrag berechnen
    const amount = parseFloat(hours_worked) * parseFloat(hourly_rate);

    const [result] = await connection.execute(
      `INSERT INTO lopez_payroll_entries 
       (period_id, user_id, session_id, project_id, order_id, task_id, work_date, hours_worked, hourly_rate, amount, category, description, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        period_id,
        user_id,
        session_id || null,
        project_id || null,
        order_id || null,
        task_id || null,
        work_date,
        hours_worked,
        hourly_rate,
        amount,
        category,
        description || null,
        created_by,
      ],
    );

    const entryId = (result as any).insertId;

    // Audit-Log
    try {
      await connection.execute(
        `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
         VALUES ('PAYROLL_ENTRY_CREATE', 'lopez_payroll_entries', ?, ?)`,
        [entryId, `Abrechnungseintrag erstellt: ${hours_worked} Stunden @ ${hourly_rate} EUR`],
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
          id: entryId,
          period_id,
          user_id,
          work_date,
          hours_worked,
          hourly_rate,
          amount,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("❌ Payroll Entries API Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      { success: false, error: error?.message || "Fehler beim Erstellen des Abrechnungseintrags" },
      { status: 500 },
    );
  }
}


 * GET /api/payroll/entries
 * POST /api/payroll/entries
 * Abrechnungseinträge verwalten (baut auf work_sessions auf)
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let connection: any = null;

  try {
    const { searchParams } = new URL(request.url);
    const period_id = searchParams.get("period_id");
    const user_id = searchParams.get("user_id");
    const approved = searchParams.get("approved");
    const invoiced = searchParams.get("invoiced");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    connection = await createConnection();

    let query = `
      SELECT pe.*,
             ws.taetigkeit,
             ws.start_time,
             ws.end_time,
             p.project_name,
             o.order_number,
             t.task_title,
             u.name as user_name
      FROM lopez_payroll_entries pe
      LEFT JOIN work_sessions ws ON pe.session_id = ws.id
      LEFT JOIN lopez_projects p ON pe.project_id = p.id
      LEFT JOIN lopez_orders o ON pe.order_id = o.id
      LEFT JOIN lopez_tasks t ON pe.task_id = t.id
      LEFT JOIN lopez_users u ON pe.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (period_id) {
      query += " AND pe.period_id = ?";
      params.push(period_id);
    }
    if (user_id) {
      query += " AND pe.user_id = ?";
      params.push(user_id);
    }
    if (approved !== null) {
      query += " AND pe.approved = ?";
      params.push(approved === "true" ? 1 : 0);
    }
    if (invoiced !== null) {
      query += " AND pe.invoiced = ?";
      params.push(invoiced === "true" ? 1 : 0);
    }

    query += " ORDER BY pe.work_date DESC LIMIT ? OFFSET ?";
    params.push(limit, (page - 1) * limit);

    const [rows] = await connection.execute(query, params);

    // Gesamtanzahl
    let countQuery = "SELECT COUNT(*) as total FROM lopez_payroll_entries WHERE 1=1";
    const countParams: any[] = [];
    if (period_id) {
      countQuery += " AND period_id = ?";
      countParams.push(period_id);
    }
    if (user_id) {
      countQuery += " AND user_id = ?";
      countParams.push(user_id);
    }
    if (approved !== null) {
      countQuery += " AND approved = ?";
      countParams.push(approved === "true" ? 1 : 0);
    }
    if (invoiced !== null) {
      countQuery += " AND invoiced = ?";
      countParams.push(invoiced === "true" ? 1 : 0);
    }

    const [countRows] = await connection.execute(countQuery, countParams);
    const total = Array.isArray(countRows) && countRows.length > 0 ? (countRows[0] as any).total : 0;

    if (connection) {
      await connection.end();
    }

    return NextResponse.json({
      success: true,
      data: {
        entries: Array.isArray(rows) ? rows : [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Payroll Entries API Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Fehler beim Laden der Abrechnungseinträge",
        data: {
          entries: [],
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
      period_id,
      user_id,
      session_id,
      project_id,
      order_id,
      task_id,
      work_date,
      hours_worked,
      hourly_rate,
      category = "umsetzung",
      description,
      created_by = "system",
    } = body;

    if (!period_id || !user_id || !work_date || !hours_worked || !hourly_rate) {
      return NextResponse.json(
        {
          success: false,
          error:
            "period_id, user_id, work_date, hours_worked und hourly_rate sind erforderlich",
        },
        { status: 400 },
      );
    }

    connection = await createConnection();

    // Betrag berechnen
    const amount = parseFloat(hours_worked) * parseFloat(hourly_rate);

    const [result] = await connection.execute(
      `INSERT INTO lopez_payroll_entries 
       (period_id, user_id, session_id, project_id, order_id, task_id, work_date, hours_worked, hourly_rate, amount, category, description, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        period_id,
        user_id,
        session_id || null,
        project_id || null,
        order_id || null,
        task_id || null,
        work_date,
        hours_worked,
        hourly_rate,
        amount,
        category,
        description || null,
        created_by,
      ],
    );

    const entryId = (result as any).insertId;

    // Audit-Log
    try {
      await connection.execute(
        `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
         VALUES ('PAYROLL_ENTRY_CREATE', 'lopez_payroll_entries', ?, ?)`,
        [entryId, `Abrechnungseintrag erstellt: ${hours_worked} Stunden @ ${hourly_rate} EUR`],
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
          id: entryId,
          period_id,
          user_id,
          work_date,
          hours_worked,
          hourly_rate,
          amount,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("❌ Payroll Entries API Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      { success: false, error: error?.message || "Fehler beim Erstellen des Abrechnungseintrags" },
      { status: 500 },
    );
  }
}



















