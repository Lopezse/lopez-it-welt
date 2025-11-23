import { NextRequest, NextResponse } from 'next/server';

interface OrderNotification {
  type: 'new_order';
  order_id: string;
  customer_id: string;
  total_amount: number;
  timestamp: string;
  source: 'shop';
}

// Admin empfängt Bestellungsbenachrichtigungen vom Shop
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

    const notification: OrderNotification = await request.json();

    // Validierung
    if (!notification.order_id || !notification.customer_id) {
      return NextResponse.json(
        { error: 'Ungültige Benachrichtigungsdaten' },
        { status: 400 }
      );
    }

    // Bestellungsbenachrichtigung verarbeiten
    console.log('📦 Neue Bestellung vom Shop erhalten:', {
      order_id: notification.order_id,
      customer_id: notification.customer_id,
      amount: notification.total_amount,
      timestamp: notification.timestamp,
    });

    // Hier würde die Bestellung in der Admin-Datenbank gespeichert werden
    // und Benachrichtigungen an das Admin-Team gesendet werden

    // E-Mail-Benachrichtigung an Admin (simuliert)
    const emailNotification = {
      to: 'admin@lopez-team.de',
      subject: `Neue Bestellung #${notification.order_id}`,
      body: `
        Eine neue Bestellung wurde im Shop aufgegeben:
        
        Bestellungs-ID: ${notification.order_id}
        Kunde: ${notification.customer_id}
        Betrag: €${notification.total_amount}
        Zeit: ${new Date(notification.timestamp).toLocaleString('de-DE')}
        
        Bitte überprüfen Sie die Bestellung im Admin-Bereich.
      `,
    };

    console.log(
      '📧 E-Mail-Benachrichtigung vorbereitet:',
      emailNotification.subject
    );

    // Dashboard-Update für Admin-Bereich
    const dashboardUpdate = {
      type: 'order_notification',
      data: {
        order_id: notification.order_id,
        customer_id: notification.customer_id,
        total_amount: notification.total_amount,
        timestamp: notification.timestamp,
        status: 'new',
      },
    };

    // WebSocket-Benachrichtigung an Admin-Dashboard (simuliert)
    console.log('🔔 WebSocket-Update an Admin-Dashboard gesendet');

    // Analytics-Update
    const analyticsUpdate = {
      event: 'order_received',
      order_id: notification.order_id,
      customer_id: notification.customer_id,
      total_amount: notification.total_amount,
      source: 'shop',
      timestamp: new Date().toISOString(),
    };

    console.log('📊 Analytics-Update:', analyticsUpdate);

    return NextResponse.json({
      success: true,
      message: 'Bestellungsbenachrichtigung erfolgreich verarbeitet',
      order_id: notification.order_id,
    });
  } catch (error) {
    console.error('❌ Fehler bei Bestellungsbenachrichtigung:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// Admin kann Bestellungsstatus abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get('order_id');

    if (!order_id) {
      return NextResponse.json(
        { error: 'Bestellungs-ID erforderlich' },
        { status: 400 }
      );
    }

    // Hier würde die Datenbankabfrage erfolgen
    // Mock-Daten für Demo
    const orderStatus = {
      order_id: order_id,
      status: 'confirmed',
      payment_status: 'paid',
      shipping_status: 'preparing',
      last_updated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      order: orderStatus,
    });
  } catch (error) {
    console.error('❌ Fehler beim Abrufen des Bestellungsstatus:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}
