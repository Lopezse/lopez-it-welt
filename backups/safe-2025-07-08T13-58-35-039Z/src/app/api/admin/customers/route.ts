import { NextRequest, NextResponse } from "next/server";

// Mock-Daten für Kunden (später durch echte Datenbank ersetzen)
let customers = [
  {
    id: 1,
    type: "firma" as const,
    name: "TechCorp GmbH",
    email: "info@techcorp.de",
    phone: "+49 30 12345678",
    address: "Musterstraße 1, 10115 Berlin",
    created_at: "2025-01-01T00:00:00Z",
    status: "active" as const,
    projects_count: 3,
  },
  {
    id: 2,
    type: "privat" as const,
    name: "Max Mustermann",
    email: "max@example.com",
    phone: "+49 176 12345678",
    address: "Beispielweg 5, 80331 München",
    created_at: "2025-01-15T00:00:00Z",
    status: "active" as const,
    projects_count: 1,
  },
  {
    id: 3,
    type: "firma" as const,
    name: "Digital Solutions AG",
    email: "contact@digitalsolutions.de",
    phone: "+49 40 87654321",
    address: "Innovationsstraße 10, 20095 Hamburg",
    created_at: "2025-02-01T00:00:00Z",
    status: "active" as const,
    projects_count: 2,
  },
];

export async function GET() {
  try {
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Laden der Kunden" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, email, phone, address } = body;

    // Validierung
    if (!type || !name) {
      return NextResponse.json({ error: "Typ und Name sind erforderlich" }, { status: 400 });
    }

    // Prüfen ob Kunde bereits existiert
    if (customers.find((customer) => customer.name === name)) {
      return NextResponse.json(
        { error: "Kunde mit diesem Namen bereits vorhanden" },
        { status: 400 },
      );
    }

    const newCustomer = {
      id: customers.length + 1,
      type,
      name,
      email: email || "",
      phone: phone || "",
      address: address || "",
      created_at: new Date().toISOString(),
      status: "active" as const,
      projects_count: 0,
    };

    customers.push(newCustomer);

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Erstellen des Kunden" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const customerIndex = customers.findIndex((customer) => customer.id === id);
    if (customerIndex === -1) {
      return NextResponse.json({ error: "Kunde nicht gefunden" }, { status: 404 });
    }

    customers[customerIndex] = { ...customers[customerIndex], ...updateData };

    return NextResponse.json(customers[customerIndex]);
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Aktualisieren des Kunden" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");

    const customerIndex = customers.findIndex((customer) => customer.id === id);
    if (customerIndex === -1) {
      return NextResponse.json({ error: "Kunde nicht gefunden" }, { status: 404 });
    }

    customers.splice(customerIndex, 1);

    return NextResponse.json({ message: "Kunde erfolgreich gelöscht" });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Löschen des Kunden" }, { status: 500 });
  }
}
