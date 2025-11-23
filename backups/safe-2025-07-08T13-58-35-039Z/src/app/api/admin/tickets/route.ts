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
  assigned_to?: string;
}

// Admin: Alle Tickets abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const type = searchParams.get("type");

    // Hier würde die Datenbankabfrage erfolgen
    // Mock-Daten für Demo
    const mockTickets: Ticket[] = [
      {
        id: "ticket_123",
        customer_id: "customer_001",
        customer_email: "kunde@example.com",
        subject: "Bestellung nicht angekommen",
        description:
          "Meine Bestellung #12345 ist seit 5 Tagen nicht angekommen. Ich habe bereits bezahlt und warte vergeblich.",
        type: "shipping",
        priority: "high",
        status: "in_progress",
        order_id: "order_12345",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 Tage her
        updated_at: new Date().toISOString(),
        assigned_to: "admin@lopez-team.de",
        customer_notes: [
          "Meine Bestellung #12345 ist seit 5 Tagen nicht angekommen. Ich habe bereits bezahlt und warte vergeblich.",
        ],
      },
      {
        id: "ticket_124",
        customer_id: "customer_002",
        customer_email: "kunde2@example.com",
        subject: "Website funktioniert nicht",
        description:
          "Die Website ist seit heute Morgen nicht erreichbar. Ich bekomme einen 500er Fehler.",
        type: "technical",
        priority: "critical",
        status: "open",
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 Stunde her
        updated_at: new Date().toISOString(),
        customer_notes: [
          "Die Website ist seit heute Morgen nicht erreichbar. Ich bekomme einen 500er Fehler.",
        ],
      },
      {
        id: "ticket_125",
        customer_id: "customer_003",
        customer_email: "kunde3@example.com",
        subject: "Rückerstattung gewünscht",
        description:
          "Ich möchte eine Rückerstattung für meine Bestellung #12346. Das Produkt entspricht nicht der Beschreibung.",
        type: "payment",
        priority: "normal",
        status: "waiting_customer",
        order_id: "order_12346",
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 Tage her
        updated_at: new Date().toISOString(),
        assigned_to: "support@lopez-team.de",
        customer_notes: [
          "Ich möchte eine Rückerstattung für meine Bestellung #12346. Das Produkt entspricht nicht der Beschreibung.",
          "Haben Sie Fotos vom Produkt?",
        ],
      },
      {
        id: "ticket_126",
        customer_id: "customer_004",
        customer_email: "kunde4@example.com",
        subject: "Falsche Artikel geliefert",
        description:
          "Ich habe Artikel A bestellt, aber Artikel B erhalten. Bitte korrigieren Sie das.",
        type: "order",
        priority: "high",
        status: "resolved",
        order_id: "order_12347",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 Tage her
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_to: "admin@lopez-team.de",
        admin_notes:
          "Neue Bestellung mit korrektem Artikel versendet. Rückversand-Label bereitgestellt.",
        customer_notes: [
          "Ich habe Artikel A bestellt, aber Artikel B erhalten. Bitte korrigieren Sie das.",
          "Danke für die schnelle Lösung!",
        ],
      },
    ];

    // Filter anwenden
    let filteredTickets = mockTickets;

    if (status && status !== "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.status === status);
    }

    if (priority && priority !== "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.priority === priority);
    }

    if (type && type !== "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.type === type);
    }

    // Sortierung: Kritische Tickets zuerst, dann nach Erstellungsdatum
    filteredTickets.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    return NextResponse.json({
      success: true,
      tickets: filteredTickets,
      total: filteredTickets.length,
      stats: {
        total: mockTickets.length,
        open: mockTickets.filter((t) => t.status === "open").length,
        in_progress: mockTickets.filter((t) => t.status === "in_progress").length,
        waiting_customer: mockTickets.filter((t) => t.status === "waiting_customer").length,
        resolved: mockTickets.filter((t) => t.status === "resolved").length,
        closed: mockTickets.filter((t) => t.status === "closed").length,
        critical: mockTickets.filter((t) => t.priority === "critical").length,
        high: mockTickets.filter((t) => t.priority === "high").length,
        normal: mockTickets.filter((t) => t.priority === "normal").length,
        low: mockTickets.filter((t) => t.priority === "low").length,
      },
    });
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Tickets:", error);
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}

// Admin: Neues Ticket erstellen (z. B. für interne Tickets)
export async function POST(request: NextRequest) {
  try {
    const ticketData = await request.json();

    // Validierung
    if (!ticketData.subject || !ticketData.description) {
      return NextResponse.json(
        { error: "Betreff und Beschreibung sind erforderlich" },
        { status: 400 },
      );
    }

    // Ticket erstellen
    const ticket: Ticket = {
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customer_id: ticketData.customer_id || "internal",
      customer_email: ticketData.customer_email || "admin@lopez-team.de",
      subject: ticketData.subject,
      description: ticketData.description,
      type: ticketData.type || "general",
      priority: ticketData.priority || "normal",
      status: "open",
      order_id: ticketData.order_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assigned_to: ticketData.assigned_to,
      customer_notes: [ticketData.description],
    };

    console.log("✅ Neues internes Ticket erstellt:", ticket.id);

    return NextResponse.json(
      {
        success: true,
        ticket: ticket,
        message: "Ticket erfolgreich erstellt",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Fehler bei Ticket-Erstellung:", error);
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}
