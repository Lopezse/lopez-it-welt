import { NextRequest, NextResponse } from "next/server";

interface Ticket {
  id: string;
  customer_id: string;
  customer_email: string;
  subject: string;
  description: string;
  type: "order" | "payment" | "shipping" | "technical" | "general";
  priority: "critical" | "high" | "normal" | "low";
  status: "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";
  order_id?: string;
  created_at: string;
  updated_at: string;
  admin_notes?: string;
  customer_notes?: string[];
}

// Shop → Admin: Neues Ticket erstellen
export async function POST(request: NextRequest) {
  try {
    const ticketData = await request.json();

    // Validierung
    if (!ticketData.customer_id || !ticketData.subject || !ticketData.description) {
      return NextResponse.json({ error: "Ungültige Ticket-Daten" }, { status: 400 });
    }

    // Ticket erstellen
    const ticket: Ticket = {
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customer_id: ticketData.customer_id,
      customer_email: ticketData.customer_email,
      subject: ticketData.subject,
      description: ticketData.description,
      type: ticketData.type || "general",
      priority: ticketData.priority || "normal",
      status: "open",
      order_id: ticketData.order_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer_notes: [ticketData.description],
    };

    // Admin über neues Ticket informieren
    const adminNotification = {
      type: "new_ticket",
      ticket_id: ticket.id,
      customer_id: ticket.customer_id,
      customer_email: ticket.customer_email,
      subject: ticket.subject,
      ticket_type: ticket.type,
      priority: ticket.priority,
      timestamp: new Date().toISOString(),
      source: "shop",
    };

    // API-Call an Admin-Bereich
    try {
      const adminResponse = await fetch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/admin/tickets/notify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.SHOP_ADMIN_API_KEY || "default-key",
          },
          body: JSON.stringify(adminNotification),
        },
      );

      if (adminResponse.ok) {
        console.log("✅ Admin über neues Ticket informiert:", ticket.id);
      } else {
        console.warn("⚠️ Admin-Benachrichtigung fehlgeschlagen:", adminResponse.status);
      }
    } catch (error) {
      console.error("❌ Fehler bei Admin-Benachrichtigung:", error);
    }

    // E-Mail-Bestätigung an Kunde (simuliert)
    const customerEmail = {
      to: ticket.customer_email,
      subject: `Ticket #${ticket.id} erstellt: ${ticket.subject}`,
      body: `
        Ihr Support-Ticket wurde erfolgreich erstellt:
        
        Ticket-ID: ${ticket.id}
        Betreff: ${ticket.subject}
        Priorität: ${ticket.priority}
        Status: ${ticket.status}
        
        Wir werden uns schnellstmöglich bei Ihnen melden.
        
        Vielen Dank für Ihre Geduld!
      `,
    };

    console.log("📧 E-Mail-Bestätigung an Kunde gesendet:", customerEmail.subject);

    return NextResponse.json(
      {
        success: true,
        ticket_id: ticket.id,
        message: "Ticket erfolgreich erstellt",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Fehler bei Ticket-Erstellung:", error);
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}

// Tickets abrufen (für Kunden)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customer_id = searchParams.get("customer_id");
    const status = searchParams.get("status");

    if (!customer_id) {
      return NextResponse.json({ error: "Kunden-ID erforderlich" }, { status: 400 });
    }

    // Hier würde die Datenbankabfrage erfolgen
    // Mock-Daten für Demo
    const mockTickets: Ticket[] = [
      {
        id: "ticket_123",
        customer_id: customer_id,
        customer_email: "kunde@example.com",
        subject: "Bestellung nicht angekommen",
        description: "Meine Bestellung #12345 ist seit 5 Tagen nicht angekommen.",
        type: "shipping",
        priority: "high",
        status: (status as any) || "in_progress",
        order_id: "order_12345",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customer_notes: ["Meine Bestellung #12345 ist seit 5 Tagen nicht angekommen."],
      },
    ];

    return NextResponse.json({
      success: true,
      tickets: mockTickets,
    });
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Tickets:", error);
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}
