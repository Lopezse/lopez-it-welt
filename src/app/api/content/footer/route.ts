import { createConnection, executeQuery } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET - Footer-Daten abrufen
export async function GET() {
  try {
    const rows = await executeQuery("SELECT * FROM lopez_footer ORDER BY created_at DESC");

    if (Array.isArray(rows) && rows.length === 0) {
      console.warn("⚠️ Footer API: Keine Footer-Daten in der Datenbank gefunden");
      return NextResponse.json(
        {
          error: "Keine Footer-Daten gefunden",
          dataSource: "database",
          status: "empty",
        },
        { status: 404 },
      );
    }

    // ✅ ERFOLGREICH AUS DATENBANK GELADEN
    console.log("✅ Footer API: Daten erfolgreich aus Datenbank geladen");
    return NextResponse.json(rows, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("❌ Footer API Fehler:", error);

    // 🚨 NOTFALL-FALLBACK MIT KLARER MELDUNG
    const mockFooterData = [
      {
        id: "fallback-1",
        section: "company",
        title: "Lopez IT Welt",
        content:
          "Professionelle IT-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.",
        link_url: "/kontakt",
        language: "de",
        dataSource: "fallback",
        status: "fallback",
        fallbackReason: "Datenbank-Verbindung fehlgeschlagen",
        timestamp: new Date().toISOString(),
        warning: "⚠️ NOTFALL-MODUS: Daten aus Fallback-System geladen",
      },
    ];

    console.warn("🚨 Footer API: Notfall-Modus aktiviert - Mock-Daten geladen");
    return NextResponse.json(mockFooterData, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }
}

// PUT - Footer-Daten aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const connection = await createConnection();

    const { title, content, section = "company", link_url = "/kontakt", language = "de" } = body;

    await connection.execute(
      `UPDATE lopez_footer SET 
             title = ?, 
             content = ?,
             section = ?,
             link_url = ?,
             language = ?
             WHERE id = ?`,
      [title, content, section, link_url, language, body.id],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        message: "Footer-Daten aktualisiert",
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ Footer Update Fehler:", error);
    return NextResponse.json(
      {
        error: "Update fehlgeschlagen",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}
