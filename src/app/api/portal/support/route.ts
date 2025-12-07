// =====================================================
// PORTAL SUPPORT API
// =====================================================
// GET /api/portal/support - Tickets Liste
// POST /api/portal/support - Neues Ticket
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { CustomerAuthService } from "@/lib/customer/auth-service";
import { getConnection } from "@/lib/database";
import { cookies } from "next/headers";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

async function getCustomerId(): Promise<number | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("customer_session")?.value;
  if (!sessionToken) return null;
  const session = await CustomerAuthService.validateSession(sessionToken);
  return session.valid ? session.customer_id || null : null;
}

// GET - Tickets Liste
export async function GET() {
  try {
    const customerId = await getCustomerId();
    if (!customerId) {
      return NextResponse.json({ success: false, error: "Nicht angemeldet" }, { status: 401 });
    }

    const pool = await getConnection();
    const [tickets] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        t.id, t.ticket_number, t.subject, t.description, 
        t.category, t.priority, t.status,
        t.created_at, t.updated_at, t.resolved_at,
        p.name as project_name,
        (SELECT COUNT(*) FROM lopez_customer_ticket_messages WHERE ticket_id = t.id) as message_count
      FROM lopez_customer_tickets t
      LEFT JOIN lopez_customer_projects p ON t.project_id = p.id
      WHERE t.customer_id = ?
      ORDER BY t.updated_at DESC
    `, [customerId]);

    return NextResponse.json({
      success: true,
      data: tickets,
      total: tickets.length
    });

  } catch (error) {
    console.error("❌ Support GET Error:", error);
    return NextResponse.json({ success: false, error: "Fehler" }, { status: 500 });
  }
}

// POST - Neues Ticket
export async function POST(request: NextRequest) {
  try {
    const customerId = await getCustomerId();
    if (!customerId) {
      return NextResponse.json({ success: false, error: "Nicht angemeldet" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, description, category, priority, project_id } = body;

    if (!subject || !description) {
      return NextResponse.json({ success: false, error: "Betreff und Beschreibung erforderlich" }, { status: 400 });
    }

    // Ticket-Nummer generieren
    const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;

    const pool = await getConnection();
    const [result] = await pool.execute<ResultSetHeader>(`
      INSERT INTO lopez_customer_tickets 
        (customer_id, project_id, ticket_number, subject, description, category, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'open')
    `, [
      customerId, 
      project_id || null, 
      ticketNumber, 
      subject, 
      description, 
      category || 'general',
      priority || 'medium'
    ]);

    // Erste Nachricht erstellen
    await pool.execute(`
      INSERT INTO lopez_customer_ticket_messages 
        (ticket_id, sender_type, sender_id, message)
      VALUES (?, 'customer', ?, ?)
    `, [result.insertId, customerId, description]);

    return NextResponse.json({
      success: true,
      message: "Ticket erstellt",
      data: { id: result.insertId, ticket_number: ticketNumber }
    });

  } catch (error) {
    console.error("❌ Support POST Error:", error);
    return NextResponse.json({ success: false, error: "Fehler" }, { status: 500 });
  }
}







