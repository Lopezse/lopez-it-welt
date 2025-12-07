// =====================================================
// ADMIN PORTAL CUSTOMER PROJECTS API
// =====================================================
// GET /api/admin/customers/portal/[id]/projects - Projekte eines Kunden
// POST /api/admin/customers/portal/[id]/projects - Neues Projekt anlegen
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// -----------------------------------------------------
// TODO: Admin-Auth/RBAC - Security-Phase
// -----------------------------------------------------
// 1. Session-Validierung: await validateAdminSession(request)
// 2. RBAC-Check: requirePermission('customers.portal.projects.view/create')
// 3. Audit-Logging: logAdminAction('PORTAL_CUSTOMER_PROJECTS_*', userId)
// -----------------------------------------------------

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Alle Projekte eines Portal-Kunden
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check

    const { id } = await context.params;
    const customerId = parseInt(id, 10);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Kunden-ID" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const pool = await getConnection();

    // Prüfen ob Kunde existiert
    const [customer] = await pool.execute<RowDataPacket[]>(
      "SELECT id, email, company_name FROM lopez_customers WHERE id = ?",
      [customerId]
    );

    if (customer.length === 0) {
      return NextResponse.json(
        { success: false, error: "Kunde nicht gefunden" },
        { status: 404 }
      );
    }

    // Filter aufbauen
    let whereClause = "p.customer_id = ?";
    const params: (string | number)[] = [customerId];

    if (status && status !== "all") {
      whereClause += " AND p.status = ?";
      params.push(status);
    }

    if (type && type !== "all") {
      whereClause += " AND p.type = ?";
      params.push(type);
    }

    // Projekte mit Aggregationen laden
    const [projects] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        p.*,
        COUNT(DISTINCT i.id) as invoice_count,
        COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.gross_amount ELSE 0 END), 0) as revenue,
        COUNT(DISTINCT t.id) as ticket_count,
        SUM(CASE WHEN t.status = 'open' THEN 1 ELSE 0 END) as open_tickets
      FROM lopez_customer_projects p
      LEFT JOIN lopez_customer_invoices i ON p.id = i.project_id
      LEFT JOIN lopez_customer_tickets t ON p.id = t.project_id
      WHERE ${whereClause}
      GROUP BY p.id
      ORDER BY p.updated_at DESC
    `,
      params
    );

    // Statistiken
    const [stats] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived
      FROM lopez_customer_projects
      WHERE customer_id = ?
    `,
      [customerId]
    );

    // Settings parsen
    const parsed = projects.map((proj) => ({
      ...proj,
      settings:
        typeof proj.settings === "string"
          ? JSON.parse(proj.settings)
          : proj.settings,
    }));

    return NextResponse.json({
      success: true,
      customer: {
        id: customer[0].id,
        email: customer[0].email,
        company_name: customer[0].company_name,
      },
      data: parsed,
      stats: stats[0] || {},
    });
  } catch (error) {
    console.error("❌ Admin Customer Projects GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Projekte" },
      { status: 500 }
    );
  }
}

// POST - Neues Projekt für Kunden anlegen
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check

    const { id } = await context.params;
    const customerId = parseInt(id, 10);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Kunden-ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const pool = await getConnection();

    // Prüfen ob Kunde existiert
    const [customer] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM lopez_customers WHERE id = ? AND status = "active"',
      [customerId]
    );

    if (customer.length === 0) {
      return NextResponse.json(
        { success: false, error: "Kunde nicht gefunden oder nicht aktiv" },
        { status: 404 }
      );
    }

    // Validierung
    if (!body.name || !body.code) {
      return NextResponse.json(
        { success: false, error: "Name und Code sind erforderlich" },
        { status: 400 }
      );
    }

    // Prüfen ob Code bereits existiert
    const [existingCode] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM lopez_customer_projects WHERE customer_id = ? AND code = ?",
      [customerId, body.code]
    );

    if (existingCode.length > 0) {
      return NextResponse.json(
        { success: false, error: "Projekt-Code bereits vergeben" },
        { status: 409 }
      );
    }

    // Projekt anlegen
    const [result] = await pool.execute<ResultSetHeader>(
      `
      INSERT INTO lopez_customer_projects (
        customer_id,
        name,
        description,
        code,
        type,
        status,
        settings,
        ai_media_enabled,
        ai_code_audit_enabled,
        ai_analyzer_enabled,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `,
      [
        customerId,
        body.name,
        body.description || null,
        body.code,
        body.type || "other",
        body.status || "draft",
        JSON.stringify(body.settings || {}),
        body.ai_media_enabled ? 1 : 0,
        body.ai_code_audit_enabled ? 1 : 0,
        body.ai_analyzer_enabled ? 1 : 0,
      ]
    );

    const projectId = result.insertId;

    // TODO: [SECURITY-PHASE] Audit-Log
    // await logAdminAction('PORTAL_CUSTOMER_PROJECT_CREATED', session.userId, {
    //   customerId,
    //   projectId,
    //   projectCode: body.code
    // });

    // Projekt zurückgeben
    const [newProject] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM lopez_customer_projects WHERE id = ?",
      [projectId]
    );

    return NextResponse.json({
      success: true,
      message: "Projekt erfolgreich angelegt",
      data: {
        ...newProject[0],
        settings:
          typeof newProject[0].settings === "string"
            ? JSON.parse(newProject[0].settings)
            : newProject[0].settings,
      },
    });
  } catch (error) {
    console.error("❌ Admin Customer Projects POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Anlegen des Projekts" },
      { status: 500 }
    );
  }
}







