/**
 * GET /api/projects
 * POST /api/projects
 * Projekte verwalten
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customer_id");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const connection = await createConnection();

    let query = `
      SELECT p.*, c.company_name, c.vorname, c.nachname, c.email
      FROM lopez_projects p
      LEFT JOIN lopez_customers c ON p.customer_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (customerId) {
      query += " AND p.customer_id = ?";
      params.push(customerId);
    }

    if (status) {
      query += " AND p.status = ?";
      params.push(status);
    }

    query += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, (page - 1) * limit);

    const [rows] = await connection.execute(query, params);

    // Gesamtanzahl
    let countQuery = "SELECT COUNT(*) as total FROM lopez_projects WHERE 1=1";
    const countParams: any[] = [];

    if (customerId) {
      countQuery += " AND customer_id = ?";
      countParams.push(customerId);
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
          projects: Array.isArray(rows) ? rows : [],
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
    console.error("❌ Projects API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Projekte" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_id,
      project_code,
      project_name,
      description,
      start_date,
      end_date,
      status = "open",
      created_by,
    } = body;

    if (!customer_id || !project_name || !created_by) {
      return NextResponse.json(
        { success: false, error: "customer_id, project_name und created_by sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await createConnection();

    const [result] = await connection.execute(
      `INSERT INTO lopez_projects 
       (customer_id, project_code, project_name, description, start_date, end_date, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        project_code || null,
        project_name,
        description || null,
        start_date || null,
        end_date || null,
        status,
        created_by,
      ],
    );

    const insertId = (result as any).insertId;

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (user_id, action, ref_table, ref_id, notes)
       VALUES (?, 'PROJECT_CREATE', 'lopez_projects', ?, ?)`,
      [created_by, insertId, `Projekt erstellt: ${project_name}`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: { id: insertId, message: "Projekt erfolgreich erstellt" },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Projects API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Erstellen des Projekts" },
      { status: 500 },
    );
  }
}
