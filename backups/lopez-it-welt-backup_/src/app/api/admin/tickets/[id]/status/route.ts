import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

interface Ticket {
  id: number;
  customer_id: number;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  admin_response?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

interface StatusUpdate {
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  admin_notes?: string;
  assigned_to?: string;
}

// Datei-Pfad für Tickets
const TICKETS_FILE = path.join(process.cwd(), 'data', 'tickets.json');

// Tickets laden
async function loadTickets(): Promise<Ticket[]> {
  try {
    const data = await fs.readFile(TICKETS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Tickets speichern
async function saveTickets(tickets: Ticket[]): Promise<void> {
  try {
    const dir = path.dirname(TICKETS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(TICKETS_FILE, JSON.stringify(tickets, null, 2));
  } catch (error) {
    console.error('Fehler beim Speichern der Tickets:', error);
  }
}

// Admin: Ticket-Status aktualisieren
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticketId = parseInt(id);
    const body = await request.json();
    const { status, response, priority } = body;

    const tickets = await loadTickets();
    const ticketIndex = tickets.findIndex((t: Ticket) => t.id === ticketId);

    if (ticketIndex === -1) {
      return NextResponse.json(
        { error: 'Ticket nicht gefunden' },
        { status: 404 }
      );
    }

    const ticket = tickets[ticketIndex];
    const now = new Date().toISOString();

    // Ticket aktualisieren
    tickets[ticketIndex] = {
      ...ticket,
      status: status || ticket.status,
      priority: priority || ticket.priority,
      admin_response: response || ticket.admin_response,
      updated_at: now,
      resolved_at: status === 'resolved' ? now : ticket.resolved_at,
    };

    await saveTickets(tickets);

    console.log(
      `✅ Ticket-Status aktualisiert: ${ticket.subject} - Status: ${status}`
    );

    return NextResponse.json(tickets[ticketIndex]);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Ticket-Status:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Ticket-Status' },
      { status: 500 }
    );
  }
}

// Admin: Ticket-Status abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticketId = parseInt(id);

    const tickets = await loadTickets();
    const ticket = tickets.find((t: Ticket) => t.id === ticketId);

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket nicht gefunden' },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Fehler beim Laden des Tickets:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden des Tickets' },
      { status: 500 }
    );
  }
}
