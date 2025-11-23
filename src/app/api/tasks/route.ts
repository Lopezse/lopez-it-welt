/**
 * GET /api/tasks
 * POST /api/tasks
 * Aufgaben verwalten (Kanban)
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");
    const projectId = searchParams.get("project_id");
    const status = searchParams.get("status");
    const assignedTo = searchParams.get("assigned_to");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");

    const connection = await createConnection();

    let query = `
      SELECT t.*,
             o.title as order_title, o.order_no,
             p.project_name, p.project_code
      FROM lopez_tasks t
      LEFT JOIN lopez_orders o ON t.order_id = o.id
      LEFT JOIN lopez_projects p ON t.project_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (orderId) {
      query += " AND t.order_id = ?";
      params.push(orderId);
    }

    if (projectId) {
      query += " AND t.project_id = ?";
      params.push(projectId);
    }

    if (status) {
      query += " AND t.status = ?";
      params.push(status);
    }

    if (assignedTo) {
      query += " AND t.assigned_to = ?";
      params.push(assignedTo);
    }

    query += " ORDER BY t.priority DESC, t.due_date ASC, t.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, (page - 1) * limit);

    const [rows] = await connection.execute(query, params);

    // Gesamtanzahl
    let countQuery = "SELECT COUNT(*) as total FROM lopez_tasks WHERE 1=1";
    const countParams: any[] = [];

    if (orderId) {
      countQuery += " AND order_id = ?";
      countParams.push(orderId);
    }

    if (projectId) {
      countQuery += " AND project_id = ?";
      countParams.push(projectId);
    }

    if (status) {
      countQuery += " AND status = ?";
      countParams.push(status);
    }

    if (assignedTo) {
      countQuery += " AND assigned_to = ?";
      countParams.push(assignedTo);
    }

    const [countRows] = await connection.execute(countQuery, countParams);
    const total =
      Array.isArray(countRows) && countRows.length > 0 ? (countRows[0] as any).total : 0;

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: {
          tasks: Array.isArray(rows) ? rows : [],
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
    console.error("❌ Tasks API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Aufgaben" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      order_id,
      project_id,
      title,
      description,
      due_date,
      priority = "medium",
      status = "todo",
      assigned_to,
      created_by,
    } = body;

    if (!title || !created_by) {
      return NextResponse.json(
        { success: false, error: "title und created_by sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await createConnection();

    const [result] = await connection.execute(
      `INSERT INTO lopez_tasks 
       (order_id, project_id, title, description, due_date, priority, status, assigned_to, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id || null,
        project_id || null,
        title,
        description || null,
        due_date || null,
        priority,
        status,
        assigned_to || null,
        created_by,
      ],
    );

    const insertId = (result as any).insertId;

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (user_id, action, ref_table, ref_id, notes)
       VALUES (?, 'TASK_CREATE', 'lopez_tasks', ?, ?)`,
      [created_by, insertId, `Aufgabe erstellt: ${title}`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: { id: insertId, message: "Aufgabe erfolgreich erstellt" },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Tasks API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Erstellen der Aufgabe" },
      { status: 500 },
    );
  }
}
