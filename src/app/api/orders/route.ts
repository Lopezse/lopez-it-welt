/**
 * GET /api/orders
 * POST /api/orders
 * Aufträge verwalten
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customer_id");
    const projectId = searchParams.get("project_id");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const connection = await createConnection();

    let query = `
      SELECT o.*, 
             c.company_name, c.vorname, c.nachname, c.email as customer_email,
             p.project_name, p.project_code
      FROM lopez_orders o
      LEFT JOIN lopez_customers c ON o.customer_id = c.id
      LEFT JOIN lopez_projects p ON o.project_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (customerId) {
      query += " AND o.customer_id = ?";
      params.push(customerId);
    }

    if (projectId) {
      query += " AND o.project_id = ?";
      params.push(projectId);
    }

    if (status) {
      query += " AND o.status = ?";
      params.push(status);
    }

    query += " ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, (page - 1) * limit);

    const [rows] = await connection.execute(query, params);

    // Gesamtanzahl
    let countQuery = "SELECT COUNT(*) as total FROM lopez_orders WHERE 1=1";
    const countParams: any[] = [];

    if (customerId) {
      countQuery += " AND customer_id = ?";
      countParams.push(customerId);
    }

    if (projectId) {
      countQuery += " AND project_id = ?";
      countParams.push(projectId);
    }

    if (status) {
      countQuery += " AND status = ?";
      countParams.push(status);
    }

    const [countRows] = await connection.execute(countQuery, countParams);
    const total =
      Array.isArray(countRows) && countRows.length > 0 ? (countRows[0] as any).total : 0;

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: {
          orders: Array.isArray(rows) ? rows : [],
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
    console.error("❌ Orders API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Aufträge" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project_id,
      customer_id,
      order_no,
      title,
      description,
      status = "new",
      sla_priority = "normal",
      created_by,
      assigned_to,
    } = body;

    if (!customer_id || !title || !created_by) {
      return NextResponse.json(
        { success: false, error: "customer_id, title und created_by sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await createConnection();

    const [result] = await connection.execute(
      `INSERT INTO lopez_orders 
       (project_id, customer_id, order_no, title, description, status, sla_priority, created_by, assigned_to)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id || null,
        customer_id,
        order_no || null,
        title,
        description || null,
        status,
        sla_priority,
        created_by,
        assigned_to || null,
      ],
    );

    const insertId = (result as any).insertId;

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (user_id, action, ref_table, ref_id, notes)
       VALUES (?, 'ORDER_CREATE', 'lopez_orders', ?, ?)`,
      [created_by, insertId, `Auftrag erstellt: ${title}`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: { id: insertId, message: "Auftrag erfolgreich erstellt" },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Orders API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Erstellen des Auftrags" },
      { status: 500 },
    );
  }
}
