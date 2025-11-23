import { NextResponse } from "next/server";

// Mock-Daten für die Statistiken (später durch echte Datenbankabfragen ersetzen)
export async function GET() {
  try {
    // Hier würden echte Datenbankabfragen stehen
    // Für jetzt verwenden wir Mock-Daten
    const stats = {
      users: 2,
      customers: 1,
      projects: 1,
      orders: 1,
      products: 1,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    // Fehler beim Laden der Statistiken: ${error}
    return NextResponse.json({ error: "Fehler beim Laden der Statistiken" }, { status: 500 });
  }
}
