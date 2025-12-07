// =====================================================
// ADMIN PORTAL CUSTOMER INVOICES API
// =====================================================
// GET /api/admin/customers/portal/[id]/invoices - Rechnungen eines Kunden
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";

// -----------------------------------------------------
// TODO: Admin-Auth/RBAC - Security-Phase
// -----------------------------------------------------
// 1. Session-Validierung: await validateAdminSession(request)
// 2. RBAC-Check: requirePermission('customers.portal.invoices.view')
// 3. Audit-Logging: logAdminAction('PORTAL_CUSTOMER_INVOICES_VIEW', userId)
// -----------------------------------------------------

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Alle Rechnungen eines Portal-Kunden
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check
    // const session = await validateAdminSession(request);
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // await requirePermission(session.userId, 'customers.portal.invoices.view');

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
    const year = searchParams.get("year");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

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
    let whereClause = "i.customer_id = ?";
    const params: (string | number)[] = [customerId];

    if (status && status !== "all") {
      whereClause += " AND i.status = ?";
      params.push(status);
    }

    if (year) {
      whereClause += " AND YEAR(i.invoice_date) = ?";
      params.push(parseInt(year, 10));
    }

    // Rechnungen laden
    const [invoices] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        i.*,
        p.name as project_name,
        p.code as project_code
      FROM lopez_customer_invoices i
      LEFT JOIN lopez_customer_projects p ON i.project_id = p.id
      WHERE ${whereClause}
      ORDER BY i.invoice_date DESC
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset]
    );

    // Gesamt-Anzahl
    const [countResult] = await pool.execute<RowDataPacket[]>(
      `
      SELECT COUNT(*) as total
      FROM lopez_customer_invoices i
      WHERE ${whereClause}
    `,
      params
    );

    // Kunden-Statistiken
    const [stats] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid,
        SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN gross_amount ELSE 0 END), 0) as total_paid,
        COALESCE(SUM(CASE WHEN status IN ('sent', 'overdue') THEN gross_amount ELSE 0 END), 0) as total_open
      FROM lopez_customer_invoices
      WHERE customer_id = ?
    `,
      [customerId]
    );

    // Line items parsen
    const parsed = invoices.map((inv) => ({
      ...inv,
      line_items:
        typeof inv.line_items === "string"
          ? JSON.parse(inv.line_items)
          : inv.line_items,
    }));

    return NextResponse.json({
      success: true,
      customer: {
        id: customer[0].id,
        email: customer[0].email,
        company_name: customer[0].company_name,
      },
      data: parsed,
      total: countResult[0]?.total || 0,
      stats: stats[0] || {},
      pagination: {
        limit,
        offset,
        has_more: (countResult[0]?.total || 0) > offset + limit,
      },
    });
  } catch (error) {
    console.error("❌ Admin Customer Invoices GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Rechnungen" },
      { status: 500 }
    );
  }
}







