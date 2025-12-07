// =====================================================
// ADMIN PORTAL TICKET MESSAGES API
// =====================================================
// GET /api/admin/portal-tickets/[id]/messages - Alle Nachrichten
// POST /api/admin/portal-tickets/[id]/messages - Neue Antwort
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// -----------------------------------------------------
// TODO: Admin-Auth/RBAC - Security-Phase
// -----------------------------------------------------
// 1. Session-Validierung: await validateAdminSession(request)
// 2. RBAC-Check: requirePermission('tickets.portal.messages.view/create')
// 3. Audit-Logging: logAdminAction('PORTAL_TICKET_MESSAGE_*', userId)
// -----------------------------------------------------

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Alle Nachrichten eines Tickets
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

    // Prüfen ob Ticket existiert
    const [ticket] = await pool.execute<RowDataPacket[]>(
      "SELECT id, ticket_number, status FROM lopez_customer_tickets WHERE id = ?",
      [ticketId]
    );

    if (ticket.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ticket nicht gefunden" },
        { status: 404 }
      );
    }

    // Nachrichten laden
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
    const parsed = messages.map((msg) => ({
      ...msg,
      attachments:
        typeof msg.attachments === "string"
          ? JSON.parse(msg.attachments)
          : msg.attachments,
    }));

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket[0].id,
        ticket_number: ticket[0].ticket_number,
        status: ticket[0].status,
      },
      data: parsed,
      total: parsed.length,
    });
  } catch (error) {
    console.error("❌ Admin Ticket Messages GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Nachrichten" },
      { status: 500 }
    );
  }
}

// POST - Neue Admin-Antwort erstellen
export async function POST(request: NextRequest, context: RouteParams) {
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

    // Validierung
    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Nachricht ist erforderlich" },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    // Prüfen ob Ticket existiert und nicht geschlossen ist
    const [ticket] = await pool.execute<RowDataPacket[]>(
      "SELECT id, ticket_number, status, customer_id FROM lopez_customer_tickets WHERE id = ?",
      [ticketId]
    );

    if (ticket.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ticket nicht gefunden" },
        { status: 404 }
      );
    }

    if (ticket[0].status === "closed") {
      return NextResponse.json(
        { success: false, error: "Ticket ist bereits geschlossen" },
        { status: 400 }
      );
    }

    // Nachricht erstellen
    const [result] = await pool.execute<ResultSetHeader>(
      `
      INSERT INTO lopez_customer_ticket_messages (
        ticket_id,
        sender_type,
        sender_id,
        message,
        attachments,
        created_at
      ) VALUES (?, 'admin', ?, ?, ?, NOW())
    `,
      [
        ticketId,
        adminUserId,
        body.message.trim(),
        body.attachments ? JSON.stringify(body.attachments) : null,
      ]
    );

    const messageId = result.insertId;

    // Ticket-Status aktualisieren (auf "in_progress" wenn noch "open")
    if (
      ticket[0].status === "open" ||
      ticket[0].status === "waiting_customer"
    ) {
      await pool.execute(
        `UPDATE lopez_customer_tickets SET status = 'in_progress', updated_at = NOW() WHERE id = ?`,
        [ticketId]
      );
    } else {
      // Nur updated_at aktualisieren
      await pool.execute(
        `UPDATE lopez_customer_tickets SET updated_at = NOW() WHERE id = ?`,
        [ticketId]
      );
    }

    // TODO: E-Mail-Benachrichtigung an Kunden senden
    // await sendTicketReplyNotification(ticket[0].customer_id, ticket[0].ticket_number, body.message);

    // TODO: [SECURITY-PHASE] Audit-Log
    // await logAdminAction('PORTAL_TICKET_MESSAGE_SENT', adminUserId, {
    //   ticketId,
    //   ticketNumber: ticket[0].ticket_number,
    //   messageId
    // });

    // Erstellte Nachricht zurückgeben
    const [newMessage] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        m.*,
        u.email as sender_email,
        u.name as sender_name
      FROM lopez_customer_ticket_messages m
      LEFT JOIN lopez_users u ON m.sender_id = u.id
      WHERE m.id = ?
    `,
      [messageId]
    );

    return NextResponse.json({
      success: true,
      message: "Antwort erfolgreich gesendet",
      data: {
        ...newMessage[0],
        attachments: newMessage[0].attachments
          ? JSON.parse(newMessage[0].attachments)
          : null,
      },
    });
  } catch (error) {
    console.error("❌ Admin Ticket Messages POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Senden der Antwort" },
      { status: 500 }
    );
  }
}







