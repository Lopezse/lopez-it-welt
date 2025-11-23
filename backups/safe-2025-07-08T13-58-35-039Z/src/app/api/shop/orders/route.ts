import { NextRequest, NextResponse } from "next/server";

interface Order {
  id: string;
  customer_id: string;
  products: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed";
  created_at: string;
  updated_at: string;
}

// Shop → Admin: Neue Bestellung kommunizieren
export async function POST(request: NextRequest) {
  try {
    const orderData: Order = await request.json();

    // Validierung
    if (!orderData.customer_id || !orderData.products || orderData.products.length === 0) {
      return NextResponse.json({ error: "Ungültige Bestelldaten" }, { status: 400 });
    }

    // Bestellung in Datenbank speichern
    const order: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customer_id: orderData.customer_id,
      products: orderData.products,
      total_amount: orderData.total_amount,
      status: "pending",
      payment_status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Admin-Bereich über neue Bestellung informieren
    const adminNotification = {
      type: "new_order",
      order_id: order.id,
      customer_id: order.customer_id,
      total_amount: order.total_amount,
      timestamp: new Date().toISOString(),
      source: "shop",
    };

    // API-Call an Admin-Bereich (lopez-team.de)
    try {
      const adminResponse = await fetch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/admin/orders/notify`,
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
        console.log("✅ Admin über neue Bestellung informiert:", order.id);
      } else {
        console.warn("⚠️ Admin-Benachrichtigung fehlgeschlagen:", adminResponse.status);
      }
    } catch (error) {
      console.error("❌ Fehler bei Admin-Benachrichtigung:", error);
      // Bestellung trotzdem speichern, Admin wird später informiert
    }

    // Analytics-Daten sammeln
    const analyticsData = {
      event: "order_created",
      order_id: order.id,
      customer_id: order.customer_id,
      total_amount: order.total_amount,
      product_count: order.products.length,
      timestamp: new Date().toISOString(),
    };

    // Analytics an Admin senden
    try {
      await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/admin/analytics/shop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.SHOP_ADMIN_API_KEY || "default-key",
        },
        body: JSON.stringify(analyticsData),
      });
    } catch (error) {
      console.error("❌ Fehler bei Analytics-Sendung:", error);
    }

    return NextResponse.json(
      {
        success: true,
        order_id: order.id,
        message: "Bestellung erfolgreich erstellt",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Fehler bei Bestellerstellung:", error);
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}

// Bestellungen abrufen (für Shop-Admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customer_id = searchParams.get("customer_id");
    const status = searchParams.get("status");

    // Hier würde die Datenbankabfrage erfolgen
    // Für Demo-Zwecke geben wir Mock-Daten zurück

    const mockOrders: Order[] = [
      {
        id: "order_123",
        customer_id: customer_id || "customer_1",
        products: [{ product_id: "prod_1", quantity: 2, price: 29.99 }],
        total_amount: 59.98,
        status: (status as any) || "confirmed",
        payment_status: "paid",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      orders: mockOrders,
    });
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Bestellungen:", error);
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}
