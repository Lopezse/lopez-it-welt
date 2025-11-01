import { NextRequest, NextResponse } from 'next/server';

interface TicketNotification {
  type: 'new_ticket';
  ticket_id: string;
  customer_id: string;
  customer_email: string;
  subject: string;
  ticket_type: 'order' | 'payment' | 'shipping' | 'technical' | 'general';
  priority: 'critical' | 'high' | 'normal' | 'low';
  timestamp: string;
  source: 'shop';
}

// Admin empfängt Ticket-Benachrichtigungen vom Shop
export async function POST(request: NextRequest) {
  try {
    // API-Key Validierung
    const apiKey = request.headers.get('X-API-Key');
    if (apiKey !== process.env.SHOP_ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Ungültiger API-Key' },
        { status: 401 }
      );
    }

    const notification: TicketNotification = await request.json();

    // Validierung
    if (
      !notification.ticket_id ||
      !notification.customer_id ||
      !notification.subject
    ) {
      return NextResponse.json(
        { error: 'Ungültige Ticket-Benachrichtigungsdaten' },
        { status: 400 }
      );
    }

    // Ticket-Benachrichtigung verarbeiten
    console.log('🎫 Neues Ticket vom Shop erhalten:', {
      ticket_id: notification.ticket_id,
      customer_id: notification.customer_id,
      subject: notification.subject,
      type: notification.ticket_type,
      priority: notification.priority,
      timestamp: notification.timestamp,
    });

    // Prioritäts-basierte Benachrichtigungen
    const priorityEmails = {
      critical: ['admin@lopez-team.de', 'support@lopez-team.de'],
      high: ['support@lopez-team.de'],
      normal: ['support@lopez-team.de'],
      low: ['support@lopez-team.de'],
    };

    const recipients = priorityEmails[notification.priority] || [
      'support@lopez-team.de',
    ];

    // E-Mail-Benachrichtigung an Admin-Team
    recipients.forEach(email => {
      const emailNotification = {
        to: email,
        subject: `[${notification.priority.toUpperCase()}] Neues Ticket #${notification.ticket_id}`,
        body: `
          Ein neues Support-Ticket wurde erstellt:
          
          Ticket-ID: ${notification.ticket_id}
          Kunde: ${notification.customer_id} (${notification.customer_email})
          Betreff: ${notification.subject}
          Typ: ${notification.ticket_type}
          Priorität: ${notification.priority}
          Zeit: ${new Date(notification.timestamp).toLocaleString('de-DE')}
          
          Bitte bearbeiten Sie das Ticket im Admin-Bereich.
        `,
      };

      console.log(
        `📧 E-Mail-Benachrichtigung an ${email}:`,
        emailNotification.subject
      );
    });

    // Dashboard-Update für Admin-Bereich
    const dashboardUpdate = {
      type: 'ticket_notification',
      data: {
        ticket_id: notification.ticket_id,
        customer_id: notification.customer_id,
        customer_email: notification.customer_email,
        subject: notification.subject,
        ticket_type: notification.ticket_type,
        priority: notification.priority,
        timestamp: notification.timestamp,
        status: 'new',
      },
    };

    // WebSocket-Benachrichtigung an Admin-Dashboard (simuliert)
    console.log('🔔 WebSocket-Update an Admin-Dashboard gesendet');

    // Analytics-Update
    const analyticsUpdate = {
      event: 'ticket_received',
      ticket_id: notification.ticket_id,
      customer_id: notification.customer_id,
      ticket_type: notification.ticket_type,
      priority: notification.priority,
      source: 'shop',
      timestamp: new Date().toISOString(),
    };

    console.log('📊 Analytics-Update:', analyticsUpdate);

    // Automatische Prioritätszuweisung basierend auf Ticket-Typ
    let autoPriority = notification.priority;
    if (
      notification.ticket_type === 'technical' &&
      notification.subject.toLowerCase().includes('down')
    ) {
      autoPriority = 'critical';
    } else if (notification.ticket_type === 'payment') {
      autoPriority = 'high';
    }

    // Automatische Kategorisierung
    const category = getTicketCategory(
      notification.ticket_type,
      notification.subject
    );

    return NextResponse.json({
      success: true,
      message: 'Ticket-Benachrichtigung erfolgreich verarbeitet',
      ticket_id: notification.ticket_id,
      auto_priority: autoPriority,
      category: category,
    });
  } catch (error) {
    console.error('❌ Fehler bei Ticket-Benachrichtigung:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// Hilfsfunktion für Ticket-Kategorisierung
function getTicketCategory(type: string, subject: string): string {
  const lowerSubject = subject.toLowerCase();

  if (type === 'technical') {
    if (lowerSubject.includes('login') || lowerSubject.includes('anmeldung'))
      return 'Login-Probleme';
    if (lowerSubject.includes('website') || lowerSubject.includes('down'))
      return 'Website-Probleme';
    if (lowerSubject.includes('mobile') || lowerSubject.includes('app'))
      return 'Mobile-Probleme';
    return 'Technische Probleme';
  }

  if (type === 'payment') {
    if (
      lowerSubject.includes('rückerstattung') ||
      lowerSubject.includes('refund')
    )
      return 'Rückerstattungen';
    if (lowerSubject.includes('kreditkarte') || lowerSubject.includes('card'))
      return 'Kreditkarten-Probleme';
    if (lowerSubject.includes('paypal')) return 'PayPal-Probleme';
    return 'Zahlungsprobleme';
  }

  if (type === 'shipping') {
    if (lowerSubject.includes('verzögerung') || lowerSubject.includes('delay'))
      return 'Lieferverzögerungen';
    if (lowerSubject.includes('verloren') || lowerSubject.includes('lost'))
      return 'Paketverlust';
    if (lowerSubject.includes('beschädigt') || lowerSubject.includes('damaged'))
      return 'Beschädigte Lieferung';
    return 'Versandprobleme';
  }

  if (type === 'payment') {
    if (lowerSubject.includes('falsch') || lowerSubject.includes('wrong'))
      return 'Falsche Bestellung';
    if (lowerSubject.includes('fehlt') || lowerSubject.includes('missing'))
      return 'Fehlende Artikel';
    if (lowerSubject.includes('stornierung') || lowerSubject.includes('cancel'))
      return 'Bestellungsstornierung';
    return 'Bestellungsprobleme';
  }

  return 'Allgemeine Anfragen';
}

// Admin kann Ticket-Status abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticket_id = searchParams.get('ticket_id');

    if (!ticket_id) {
      return NextResponse.json(
        { error: 'Ticket-ID erforderlich' },
        { status: 400 }
      );
    }

    // Hier würde die Datenbankabfrage erfolgen
    // Mock-Daten für Demo
    const ticketStatus = {
      ticket_id: ticket_id,
      status: 'in_progress',
      priority: 'high',
      assigned_to: 'admin@lopez-team.de',
      last_updated: new Date().toISOString(),
      response_time: '2 Stunden',
    };

    return NextResponse.json({
      success: true,
      ticket: ticketStatus,
    });
  } catch (error) {
    console.error('❌ Fehler beim Abrufen des Ticket-Status:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}
