// =====================================================
// ADMIN PORTAL TICKET DETAIL API
// =====================================================
// GET /api/admin/portal-tickets/[id] - Einzelnes Ticket
// PATCH /api/admin/portal-tickets/[id] - Ticket aktualisieren
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// -----------------------------------------------------
// TODO: Admin-Auth/RBAC - Security-Phase
// -----------------------------------------------------
// 1. Session-Validierung: await validateAdminSession(request)
// 2. RBAC-Check: requirePermission('tickets.portal.view/edit')
// 3. Audit-Logging: logAdminAction('PORTAL_TICKET_*', userId)
// -----------------------------------------------------

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Einzelnes Ticket mit allen Details
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check

    const { id } = await context.params;
    const ticketId = parseInt(id, 10);

    if (isNaN(ticketId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Ticket-ID" },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    // Ticket mit Details laden
    const [tickets] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        t.*,
        c.id as customer_id,
        c.email as customer_email,
        c.company_name as customer_company,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.phone as customer_phone,
        p.id as project_id,
        p.name as project_name,
        p.code as project_code,
        u.email as assigned_email,
        u.name as assigned_name
      FROM lopez_customer_tickets t
      LEFT JOIN lopez_customers c ON t.customer_id = c.id
      LEFT JOIN lopez_customer_projects p ON t.project_id = p.id
      LEFT JOIN lopez_users u ON t.assigned_to = u.id
      WHERE t.id = ?
    `,
      [ticketId]
    );

    if (tickets.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ticket nicht gefunden" },
        { status: 404 }
      );
    }

    const ticket = tickets[0];

    // Alle Nachrichten laden
    const [messages] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        m.*,
        CASE 
          WHEN m.sender_type = 'customer' THEN c.email
          WHEN m.sender_type = 'admin' THEN u.email
          ELSE 'System'
        END as sender_email,
        CASE 
          WHEN m.sender_type = 'customer' THEN CONCAT(c.first_name, ' ', c.last_name)
          WHEN m.sender_type = 'admin' THEN u.name
          ELSE 'System'
        END as sender_name
      FROM lopez_customer_ticket_messages m
      LEFT JOIN lopez_customers c ON m.sender_type = 'customer' AND m.sender_id = c.id
      LEFT JOIN lopez_users u ON m.sender_type = 'admin' AND m.sender_id = u.id
      WHERE m.ticket_id = ?
      ORDER BY m.created_at ASC
    `,
      [ticketId]
    );

    // Attachments parsen
    const parsedMessages = messages.map((msg) => ({
      ...msg,
      attachments:
        typeof msg.attachments === "string"
          ? JSON.parse(msg.attachments)
          : msg.attachments,
    }));

    // Status-Historie (aus Audit-Logs, falls vorhanden)
    const [history] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        action,
        details,
        created_at
      FROM lopez_audit_logs
      WHERE entity_type = 'ticket' AND entity_id = ?
      ORDER BY created_at DESC
      LIMIT 20
    `,
      [ticketId]
    );

    return NextResponse.json({
      success: true,
      data: {
        ...ticket,
        messages: parsedMessages,
        history,
      },
    });
  } catch (error) {
    console.error("❌ Admin Portal Ticket GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden des Tickets" },
      { status: 500 }
    );
  }
}

// PATCH - Ticket aktualisieren
export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check
    // const session = await validateAdminSession(request);
    // const adminUserId = session.userId;
    const adminUserId = 1; // Placeholder

    const { id } = await context.params;
    const ticketId = parseInt(id, 10);

    if (isNaN(ticketId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Ticket-ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const pool = await getConnection();

    // Prüfen ob Ticket existiert
    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM lopez_customer_tickets WHERE id = ?",
      [ticketId]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ticket nicht gefunden" },
        { status: 404 }
      );
    }

    const oldTicket = existing[0];

    // Erlaubte Felder
    const allowedFields = [
      "status",
      "priority",
      "category",
      "assigned_to",
      "subject",
    ];
    const updates: string[] = [];
    const values: (string | number | null)[] = [];
    const changes: Record<string, { old: unknown; new: unknown }> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
        changes[field] = { old: oldTicket[field], new: body[field] };
      }
    }

    // Spezielle Felder für Status-Änderungen
    if (body.status === "resolved" && oldTicket.status !== "resolved") {
      updates.push("resolved_at = NOW()");
    }
    if (body.status === "closed" && oldTicket.status !== "closed") {
      updates.push("closed_at = NOW()");
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "Keine Änderungen angegeben" },
        { status: 400 }
      );
    }

    // Update durchführen
    await pool.execute<ResultSetHeader>(
      `UPDATE lopez_customer_tickets SET ${updates.join(", ")}, updated_at = NOW() WHERE id = ?`,
      [...values, ticketId]
    );

    // System-Nachricht für Status-Änderung
    if (body.status && body.status !== oldTicket.status) {
      await pool.execute(
        `
        INSERT INTO lopez_customer_ticket_messages (
          ticket_id, sender_type, sender_id, message, created_at
        ) VALUES (?, 'system', NULL, ?, NOW())
      `,
        [ticketId, `Status geändert: ${oldTicket.status} → ${body.status}`]
      );
    }

    // Audit-Log
    await pool.execute(
      `
      INSERT INTO lopez_audit_logs (
        user_id, action, entity_type, entity_id, details, created_at
      ) VALUES (?, 'TICKET_UPDATED', 'ticket', ?, ?, NOW())
    `,
      [adminUserId, ticketId, JSON.stringify({ changes })]
    );

    // Aktualisiertes Ticket zurückgeben
    const [updated] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM lopez_customer_tickets WHERE id = ?",
      [ticketId]
    );

    return NextResponse.json({
      success: true,
      message: "Ticket erfolgreich aktualisiert",
      data: updated[0],
    });
  } catch (error) {
    console.error("❌ Admin Portal Ticket PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Aktualisieren" },
      { status: 500 }
    );
  }
}







