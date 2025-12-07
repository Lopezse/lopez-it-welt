// =====================================================
// ADMIN PORTAL TICKET ASSIGNMENT API
// =====================================================
// POST /api/admin/portal-tickets/[id]/assign - Ticket zuweisen
// DELETE /api/admin/portal-tickets/[id]/assign - Zuweisung entfernen
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// -----------------------------------------------------
// TODO: Admin-Auth/RBAC - Security-Phase
// -----------------------------------------------------
// 1. Session-Validierung: await validateAdminSession(request)
// 2. RBAC-Check: requirePermission('tickets.portal.assign')
// 3. Audit-Logging: logAdminAction('PORTAL_TICKET_ASSIGN_*', userId)
// -----------------------------------------------------

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST - Ticket einem Admin zuweisen
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check
    // const session = await validateAdminSession(request);
    // const currentUserId = session.userId;
    const currentUserId = 1; // Placeholder

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
    const [ticket] = await pool.execute<RowDataPacket[]>(
      "SELECT id, ticket_number, status, assigned_to FROM lopez_customer_tickets WHERE id = ?",
      [ticketId]
    );

    if (ticket.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ticket nicht gefunden" },
        { status: 404 }
      );
    }

    const oldAssignee = ticket[0].assigned_to;

    // Ziel-User ermitteln
    let assignToUserId: number | null = null;
    let assignToUserName = "";

    if (body.assign_to === "self") {
      // Sich selbst zuweisen
      assignToUserId = currentUserId;
      const [user] = await pool.execute<RowDataPacket[]>(
        "SELECT name, email FROM lopez_users WHERE id = ?",
        [currentUserId]
      );
      assignToUserName = user[0]?.name || user[0]?.email || "Admin";
    } else if (body.user_id) {
      // Anderem User zuweisen
      const [user] = await pool.execute<RowDataPacket[]>(
        "SELECT id, name, email FROM lopez_users WHERE id = ?",
        [body.user_id]
      );
      if (user.length === 0) {
        return NextResponse.json(
          { success: false, error: "Ziel-User nicht gefunden" },
          { status: 404 }
        );
      }
      assignToUserId = user[0].id;
      assignToUserName = user[0].name || user[0].email;
    } else {
      return NextResponse.json(
        { success: false, error: "assign_to='self' oder user_id erforderlich" },
        { status: 400 }
      );
    }

    // Zuweisung durchführen
    await pool.execute<ResultSetHeader>(
      `UPDATE lopez_customer_tickets SET assigned_to = ?, updated_at = NOW() WHERE id = ?`,
      [assignToUserId, ticketId]
    );

    // System-Nachricht
    await pool.execute(
      `
      INSERT INTO lopez_customer_ticket_messages (
        ticket_id, sender_type, sender_id, message, created_at
      ) VALUES (?, 'system', NULL, ?, NOW())
    `,
      [ticketId, `Ticket wurde ${assignToUserName} zugewiesen.`]
    );

    // Audit-Log
    await pool.execute(
      `
      INSERT INTO lopez_audit_logs (
        user_id, action, entity_type, entity_id, details, created_at
      ) VALUES (?, 'TICKET_ASSIGNED', 'ticket', ?, ?, NOW())
    `,
      [
        currentUserId,
        ticketId,
        JSON.stringify({
          old_assignee: oldAssignee,
          new_assignee: assignToUserId,
          new_assignee_name: assignToUserName,
        }),
      ]
    );

    // TODO: E-Mail-Benachrichtigung an zugewiesenen User
    // await sendTicketAssignmentNotification(assignToUserId, ticket[0].ticket_number);

    return NextResponse.json({
      success: true,
      message: `Ticket erfolgreich ${assignToUserName} zugewiesen`,
      data: {
        ticket_id: ticketId,
        assigned_to: assignToUserId,
        assigned_name: assignToUserName,
      },
    });
  } catch (error) {
    console.error("❌ Admin Ticket Assign POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler bei der Zuweisung" },
      { status: 500 }
    );
  }
}

// DELETE - Zuweisung entfernen
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check
    // const session = await validateAdminSession(request);
    // const currentUserId = session.userId;
    const currentUserId = 1; // Placeholder

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
      "SELECT id, ticket_number, assigned_to FROM lopez_customer_tickets WHERE id = ?",
      [ticketId]
    );

    if (ticket.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ticket nicht gefunden" },
        { status: 404 }
      );
    }

    if (!ticket[0].assigned_to) {
      return NextResponse.json(
        { success: false, error: "Ticket ist niemandem zugewiesen" },
        { status: 400 }
      );
    }

    const oldAssignee = ticket[0].assigned_to;

    // Zuweisung entfernen
    await pool.execute<ResultSetHeader>(
      `UPDATE lopez_customer_tickets SET assigned_to = NULL, updated_at = NOW() WHERE id = ?`,
      [ticketId]
    );

    // System-Nachricht
    await pool.execute(
      `
      INSERT INTO lopez_customer_ticket_messages (
        ticket_id, sender_type, sender_id, message, created_at
      ) VALUES (?, 'system', NULL, ?, NOW())
    `,
      [ticketId, "Ticket-Zuweisung wurde entfernt."]
    );

    // Audit-Log
    await pool.execute(
      `
      INSERT INTO lopez_audit_logs (
        user_id, action, entity_type, entity_id, details, created_at
      ) VALUES (?, 'TICKET_UNASSIGNED', 'ticket', ?, ?, NOW())
    `,
      [currentUserId, ticketId, JSON.stringify({ old_assignee: oldAssignee })]
    );

    return NextResponse.json({
      success: true,
      message: "Ticket-Zuweisung erfolgreich entfernt",
    });
  } catch (error) {
    console.error("❌ Admin Ticket Assign DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Entfernen der Zuweisung" },
      { status: 500 }
    );
  }
}







