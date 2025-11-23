/**
 * GET /api/appointments
 * POST /api/appointments
 * Termine verwalten
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let connection: any = null;

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("project_id");
    const orderId = searchParams.get("order_id");
    const employeeId = searchParams.get("employee_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");

    try {
      connection = await createConnection();
    } catch (dbError) {
      console.error("❌ DB-Verbindungsfehler (appointments):", dbError);
      // Fallback: Leere Liste zurückgeben statt HTTP 500
      return NextResponse.json(
        {
          success: true,
          data: {
            appointments: [],
            pagination: {
              page,
              limit,
            },
          },
        },
        {
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    }

    let query = `
      SELECT a.*,
             p.project_name, p.project_code,
             o.title as order_title, o.order_no,
             t.title as task_title,
             u.username as employee_username,
             u.first_name as employee_first_name,
             u.last_name as employee_last_name,
             u.email as employee_email
      FROM lopez_appointments a
      LEFT JOIN lopez_projects p ON a.project_id = p.id
      LEFT JOIN lopez_orders o ON a.order_id = o.id
      LEFT JOIN lopez_tasks t ON a.task_id = t.id
      LEFT JOIN lopez_core_users u ON a.employee_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (projectId) {
      query += " AND a.project_id = ?";
      params.push(projectId);
    }

    if (orderId) {
      query += " AND a.order_id = ?";
      params.push(orderId);
    }

    if (employeeId) {
      query += " AND a.employee_id = ?";
      params.push(employeeId);
    }

    if (startDate) {
      query += " AND a.date_start >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND a.date_end <= ?";
      params.push(endDate);
    }

    query += " ORDER BY a.date_start ASC LIMIT ? OFFSET ?";
    params.push(limit, (page - 1) * limit);

    let rows: any[] = [];

    try {
      const [queryRows] = await connection.execute(query, params);
      rows = Array.isArray(queryRows) ? queryRows : [];
    } catch (queryError) {
      console.error("❌ SQL-Query-Fehler (appointments):", queryError);
      // Fallback: Leere Liste zurückgeben statt HTTP 500
      rows = [];
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch {}
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          appointments: rows,
          pagination: {
            page,
            limit,
          },
        },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Appointments API Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    // Fallback: Leere Liste zurückgeben statt HTTP 500
    return NextResponse.json(
      {
        success: true,
        data: {
          appointments: [],
          pagination: {
            page: 1,
            limit: 100,
          },
        },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project_id,
      order_id,
      task_id,
      employee_id,
      title,
      date_start,
      date_end,
      location,
      notes,
      is_all_day = false,
      created_by,
    } = body;

    if (!title || !date_start || !date_end || !created_by) {
      return NextResponse.json(
        { success: false, error: "title, date_start, date_end und created_by sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await createConnection();

    // iCal UID generieren
    const icalUid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@lopez-it-welt.de`;

    const {
      is_billable = false,
      status = "planned",
      time_session_id = null,
    } = body;

    const [result] = await connection.execute(
      `INSERT INTO lopez_appointments 
       (project_id, order_id, task_id, employee_id, title, date_start, date_end, location, notes, is_all_day, ical_uid, is_billable, status, time_session_id, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id || null,
        order_id || null,
        task_id || null,
        employee_id || null,
        title,
        date_start,
        date_end,
        location || null,
        notes || null,
        is_all_day ? 1 : 0,
        icalUid,
        is_billable ? 1 : 0,
        status,
        time_session_id || null,
        created_by,
      ],
    );

    const insertId = (result as any).insertId;

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (user_id, action, ref_table, ref_id, notes)
       VALUES (?, 'APPOINTMENT_CREATE', 'lopez_appointments', ?, ?)`,
      [created_by, insertId, `Termin erstellt: ${title}`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: { id: insertId, ical_uid: icalUid, message: "Termin erfolgreich erstellt" },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Appointments API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Erstellen des Termins" },
      { status: 500 },
    );
  }
}

      );
    }

    const connection = await createConnection();

    // iCal UID generieren
    const icalUid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@lopez-it-welt.de`;

    const {
      is_billable = false,
      status = "planned",
      time_session_id = null,
    } = body;

    const [result] = await connection.execute(
      `INSERT INTO lopez_appointments 
       (project_id, order_id, task_id, employee_id, title, date_start, date_end, location, notes, is_all_day, ical_uid, is_billable, status, time_session_id, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id || null,
        order_id || null,
        task_id || null,
        employee_id || null,
        title,
        date_start,
        date_end,
        location || null,
        notes || null,
        is_all_day ? 1 : 0,
        icalUid,
        is_billable ? 1 : 0,
        status,
        time_session_id || null,
        created_by,
      ],
    );

    const insertId = (result as any).insertId;

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (user_id, action, ref_table, ref_id, notes)
       VALUES (?, 'APPOINTMENT_CREATE', 'lopez_appointments', ?, ?)`,
      [created_by, insertId, `Termin erstellt: ${title}`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: { id: insertId, ical_uid: icalUid, message: "Termin erfolgreich erstellt" },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Appointments API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Erstellen des Termins" },
      { status: 500 },
    );
  }
}
