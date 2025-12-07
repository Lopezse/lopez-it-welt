// =====================================================
// ADMIN PORTAL TICKETS API
// =====================================================
// GET /api/admin/portal-tickets - Alle Portal-Tickets
// POST /api/admin/portal-tickets - Internes Ticket erstellen
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { Pool } from "mysql2/promise";

// -----------------------------------------------------
// TODO: Admin-Auth/RBAC - Security-Phase
// -----------------------------------------------------
// 1. Session-Validierung: await validateAdminSession(request)
// 2. RBAC-Check: requirePermission('tickets.portal.view/create')
// 3. Audit-Logging: logAdminAction('PORTAL_TICKETS_*', userId)
// -----------------------------------------------------

// Ticket-Nummer Generator
async function generateTicketNumber(pool: Pool): Promise<string> {
  const year = new Date().getFullYear();
  const [result] = await pool.execute<RowDataPacket[]>(
    `
    SELECT MAX(CAST(SUBSTRING(ticket_number, 9) AS UNSIGNED)) as last_num
    FROM lopez_customer_tickets
    WHERE ticket_number LIKE ?
  `,
    [`TKT-${year}-%`]
  );

  const lastNum = result[0]?.last_num || 0;
  const nextNum = lastNum + 1;
  return `TKT-${year}-${String(nextNum).padStart(5, "0")}`;
}

// GET - Alle Portal-Tickets (mit Filter)
export async function GET(request: NextRequest) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const assignedTo = searchParams.get("assigned_to");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const sortBy = searchParams.get("sort_by") || "created_at";
    const sortOrder = searchParams.get("sort_order") || "DESC";

    const pool = await getConnection();

    // Filter aufbauen
    let whereClause = "1=1";
    const params: (string | number)[] = [];

    if (status && status !== "all") {
      whereClause += " AND t.status = ?";
      params.push(status);
    }

    if (priority && priority !== "all") {
      whereClause += " AND t.priority = ?";
      params.push(priority);
    }

    if (category && category !== "all") {
      whereClause += " AND t.category = ?";
      params.push(category);
    }

    if (assignedTo) {
      if (assignedTo === "unassigned") {
        whereClause += " AND t.assigned_to IS NULL";
      } else {
        whereClause += " AND t.assigned_to = ?";
        params.push(parseInt(assignedTo, 10));
      }
    }

    if (search) {
      whereClause +=
        " AND (t.subject LIKE ? OR t.ticket_number LIKE ? OR c.email LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Sortierung validieren
    const allowedSortFields = ["created_at", "updated_at", "priority", "status"];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "created_at";
    const safeSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Tickets laden
    const [tickets] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        t.*,
        c.email as customer_email,
        c.company_name as customer_company,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        p.name as project_name,
        u.email as assigned_email,
        u.name as assigned_name,
        (SELECT COUNT(*) FROM lopez_customer_ticket_messages WHERE ticket_id = t.id) as message_count
      FROM lopez_customer_tickets t
      LEFT JOIN lopez_customers c ON t.customer_id = c.id
      LEFT JOIN lopez_customer_projects p ON t.project_id = p.id
      LEFT JOIN lopez_users u ON t.assigned_to = u.id
      WHERE ${whereClause}
      ORDER BY 
        CASE 
          WHEN t.priority = 'urgent' AND t.status NOT IN ('resolved', 'closed') THEN 0
          WHEN t.priority = 'high' AND t.status NOT IN ('resolved', 'closed') THEN 1
          ELSE 2
        END,
        t.${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset]
    );

    // Gesamt-Anzahl
    const [countResult] = await pool.execute<RowDataPacket[]>(
      `
      SELECT COUNT(*) as total
      FROM lopez_customer_tickets t
      LEFT JOIN lopez_customers c ON t.customer_id = c.id
      WHERE ${whereClause}
    `,
      params
    );

    // Statistiken
    const [stats] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'waiting_customer' THEN 1 ELSE 0 END) as waiting_customer,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
        SUM(CASE WHEN priority = 'urgent' AND status NOT IN ('resolved', 'closed') THEN 1 ELSE 0 END) as urgent_open,
        SUM(CASE WHEN priority = 'high' AND status NOT IN ('resolved', 'closed') THEN 1 ELSE 0 END) as high_open,
        SUM(CASE WHEN assigned_to IS NULL AND status NOT IN ('resolved', 'closed') THEN 1 ELSE 0 END) as unassigned
      FROM lopez_customer_tickets
    `);

    return NextResponse.json({
      success: true,
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
    console.error("❌ Admin Portal Tickets GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Tickets" },
      { status: 500 }
    );
  }
}

// POST - Internes Ticket erstellen (für Admin)
export async function POST(request: NextRequest) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check
    // const session = await validateAdminSession(request);
    // const adminUserId = session.userId;

    const body = await request.json();
    const pool = await getConnection();

    // Validierung
    if (!body.customer_id) {
      return NextResponse.json(
        { success: false, error: "Kunden-ID ist erforderlich" },
        { status: 400 }
      );
    }

    if (!body.subject || !body.description) {
      return NextResponse.json(
        { success: false, error: "Betreff und Beschreibung sind erforderlich" },
        { status: 400 }
      );
    }

    // Prüfen ob Kunde existiert
    const [customer] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM lopez_customers WHERE id = ?",
      [body.customer_id]
    );

    if (customer.length === 0) {
      return NextResponse.json(
        { success: false, error: "Kunde nicht gefunden" },
        { status: 404 }
      );
    }

    // Ticket-Nummer generieren
    const ticketNumber = await generateTicketNumber(pool);

    // Ticket erstellen
    const [result] = await pool.execute<ResultSetHeader>(
      `
      INSERT INTO lopez_customer_tickets (
        customer_id,
        project_id,
        ticket_number,
        subject,
        description,
        category,
        priority,
        status,
        assigned_to,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, NOW(), NOW())
    `,
      [
        body.customer_id,
        body.project_id || null,
        ticketNumber,
        body.subject,
        body.description,
        body.category || "general",
        body.priority || "medium",
        body.assigned_to || null,
      ]
    );

    const ticketId = result.insertId;

    // System-Nachricht als erste Nachricht
    await pool.execute(
      `
      INSERT INTO lopez_customer_ticket_messages (
        ticket_id,
        sender_type,
        sender_id,
        message,
        created_at
      ) VALUES (?, 'system', NULL, ?, NOW())
    `,
      [ticketId, `Ticket ${ticketNumber} wurde vom Admin erstellt.`]
    );

    // TODO: [SECURITY-PHASE] Audit-Log
    // await logAdminAction('PORTAL_TICKET_CREATED', adminUserId, {
    //   ticketId,
    //   ticketNumber,
    //   customerId: body.customer_id
    // });

    // Ticket zurückgeben
    const [newTicket] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM lopez_customer_tickets WHERE id = ?",
      [ticketId]
    );

    return NextResponse.json({
      success: true,
      message: "Ticket erfolgreich erstellt",
      data: newTicket[0],
    });
  } catch (error) {
    console.error("❌ Admin Portal Tickets POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Erstellen des Tickets" },
      { status: 500 }
    );
  }
}







