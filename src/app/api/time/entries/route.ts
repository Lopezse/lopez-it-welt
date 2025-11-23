/**
 * GET /api/time/entries
 * Feed: Abrechenbare Zeiteinträge (approved & !invoiced)
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function GET(request: NextRequest) {
  let connection: any = null;

  try {
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get("project_id");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const approved = searchParams.get("approved");
    const invoiced = searchParams.get("invoiced");

    connection = await createConnection();

    // Query aufbauen: nur approved & !invoiced Sessions
    let query = `
      SELECT 
        ws.id,
        ws.user_id,
        ws.module,
        ws.taetigkeit,
        ws.start_time,
        ws.end_time,
        ws.duration_minutes,
        ws.category,
        ws.project_id,
        ws.order_id,
        ws.task_id,
        p.project_name,
        o.order_number,
        t.task_title,
        u.name as user_name
      FROM work_sessions ws
      LEFT JOIN lopez_projects p ON ws.project_id = p.id
      LEFT JOIN lopez_orders o ON ws.order_id = o.id
      LEFT JOIN lopez_tasks t ON ws.task_id = t.id
      LEFT JOIN lopez_users u ON ws.user_id = u.id
      WHERE ws.status = 'completed'
    `;
    const params: any[] = [];

    // Filter: approved = 1 (standard, wenn nicht anders angegeben)
    if (approved !== null) {
      query += " AND ws.approved = ?";
      params.push(approved === "true" ? 1 : 0);
    } else {
      // Default: nur approved Sessions
      query += " AND ws.approved = 1";
    }

    // Filter: invoiced = 0 (standard, wenn nicht anders angegeben)
    if (invoiced !== null) {
      query += " AND ws.invoiced = ?";
      params.push(invoiced === "true" ? 1 : 0);
    } else {
      // Default: nur nicht abgerechnete Sessions
      query += " AND ws.invoiced = 0";
    }

    if (project_id) {
      query += " AND ws.project_id = ?";
      params.push(project_id);
    }

    if (from) {
      query += " AND ws.start_time >= ?";
      params.push(from);
    }

    if (to) {
      query += " AND ws.start_time <= ?";
      params.push(to);
    }

    query += " ORDER BY ws.start_time DESC";

    const [rows] = await connection.execute(query, params);

    if (connection) {
      await connection.end();
    }

    return NextResponse.json({
      success: true,
      data: {
        items: Array.isArray(rows) ? rows : [],
        filters: {
          project_id: project_id || null,
          from: from || null,
          to: to || null,
          approved: approved === "true" || approved === null,
          invoiced: invoiced === "true" || false,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Time Entries Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Fehler beim Laden der Zeiteinträge",
        data: {
          items: [],
          filters: {},
        },
      },
      { status: 500 },
    );
  }
}


 * GET /api/time/entries
 * Feed: Abrechenbare Zeiteinträge (approved & !invoiced)
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function GET(request: NextRequest) {
  let connection: any = null;

  try {
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get("project_id");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const approved = searchParams.get("approved");
    const invoiced = searchParams.get("invoiced");

    connection = await createConnection();

    // Query aufbauen: nur approved & !invoiced Sessions
    let query = `
      SELECT 
        ws.id,
        ws.user_id,
        ws.module,
        ws.taetigkeit,
        ws.start_time,
        ws.end_time,
        ws.duration_minutes,
        ws.category,
        ws.project_id,
        ws.order_id,
        ws.task_id,
        p.project_name,
        o.order_number,
        t.task_title,
        u.name as user_name
      FROM work_sessions ws
      LEFT JOIN lopez_projects p ON ws.project_id = p.id
      LEFT JOIN lopez_orders o ON ws.order_id = o.id
      LEFT JOIN lopez_tasks t ON ws.task_id = t.id
      LEFT JOIN lopez_users u ON ws.user_id = u.id
      WHERE ws.status = 'completed'
    `;
    const params: any[] = [];

    // Filter: approved = 1 (standard, wenn nicht anders angegeben)
    if (approved !== null) {
      query += " AND ws.approved = ?";
      params.push(approved === "true" ? 1 : 0);
    } else {
      // Default: nur approved Sessions
      query += " AND ws.approved = 1";
    }

    // Filter: invoiced = 0 (standard, wenn nicht anders angegeben)
    if (invoiced !== null) {
      query += " AND ws.invoiced = ?";
      params.push(invoiced === "true" ? 1 : 0);
    } else {
      // Default: nur nicht abgerechnete Sessions
      query += " AND ws.invoiced = 0";
    }

    if (project_id) {
      query += " AND ws.project_id = ?";
      params.push(project_id);
    }

    if (from) {
      query += " AND ws.start_time >= ?";
      params.push(from);
    }

    if (to) {
      query += " AND ws.start_time <= ?";
      params.push(to);
    }

    query += " ORDER BY ws.start_time DESC";

    const [rows] = await connection.execute(query, params);

    if (connection) {
      await connection.end();
    }

    return NextResponse.json({
      success: true,
      data: {
        items: Array.isArray(rows) ? rows : [],
        filters: {
          project_id: project_id || null,
          from: from || null,
          to: to || null,
          approved: approved === "true" || approved === null,
          invoiced: invoiced === "true" || false,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Time Entries Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Fehler beim Laden der Zeiteinträge",
        data: {
          items: [],
          filters: {},
        },
      },
      { status: 500 },
    );
  }
}



















