// =====================================================
// ADMIN PORTAL CUSTOMER TICKETS API
// =====================================================
// GET /api/admin/customers/portal/[id]/tickets - Tickets eines Kunden
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";

// -----------------------------------------------------
// TODO: Admin-Auth/RBAC - Security-Phase
// -----------------------------------------------------
// 1. Session-Validierung: await validateAdminSession(request)
// 2. RBAC-Check: requirePermission('customers.portal.tickets.view')
// 3. Audit-Logging: logAdminAction('PORTAL_CUSTOMER_TICKETS_VIEW', userId)
// -----------------------------------------------------

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Alle Tickets eines Portal-Kunden
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
    const priority = searchParams.get("priority");
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
    let whereClause = "t.customer_id = ?";
    const params: (string | number)[] = [customerId];

    if (status && status !== "all") {
      whereClause += " AND t.status = ?";
      params.push(status);
    }

    if (priority && priority !== "all") {
      whereClause += " AND t.priority = ?";
      params.push(priority);
    }

    // Tickets mit Details laden
    const [tickets] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        t.*,
        p.name as project_name,
        p.code as project_code,
        u.email as assigned_email,
        u.name as assigned_name,
        (SELECT COUNT(*) FROM lopez_customer_ticket_messages WHERE ticket_id = t.id) as message_count,
        (SELECT MAX(created_at) FROM lopez_customer_ticket_messages WHERE ticket_id = t.id) as last_message_at
      FROM lopez_customer_tickets t
      LEFT JOIN lopez_customer_projects p ON t.project_id = p.id
      LEFT JOIN lopez_users u ON t.assigned_to = u.id
      WHERE ${whereClause}
      ORDER BY 
        CASE t.priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
        END,
        t.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset]
    );

    // Gesamt-Anzahl
    const [countResult] = await pool.execute<RowDataPacket[]>(
      `
      SELECT COUNT(*) as total
      FROM lopez_customer_tickets t
      WHERE ${whereClause}
    `,
      params
    );

    // Kunden-Ticket-Statistiken
    const [stats] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'waiting_customer' THEN 1 ELSE 0 END) as waiting_customer,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority
      FROM lopez_customer_tickets
      WHERE customer_id = ?
    `,
      [customerId]
    );

    return NextResponse.json({
      success: true,
      customer: {
        id: customer[0].id,
        email: customer[0].email,
        company_name: customer[0].company_name,
      },
      data: tickets,
      total: countResult[0]?.total || 0,
      stats: stats[0] || {},
      pagination: {
        limit,
        offset,
        has_more: (countResult[0]?.total || 0) > offset + limit,
      },
    });
  } catch (error) {
    console.error("❌ Admin Customer Tickets GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Tickets" },
      { status: 500 }
    );
  }
}







