import { createConnection, executeQuery } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET - Header-Daten abrufen
export async function GET() {
  try {
    const rows = await executeQuery(
      "SELECT * FROM content_header WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1",
    );

    if (Array.isArray(rows) && rows.length === 0) {
      console.warn("⚠️ Header API: Keine aktiven Header-Daten in der Datenbank gefunden");
      return NextResponse.json(
        {
          error: "Keine Header-Daten gefunden",
          dataSource: "database",
          status: "empty",
        },
        { status: 404 },
      );
    }

    // ✅ ERFOLGREICH AUS DATENBANK GELADEN
    console.log("✅ Header API: Daten erfolgreich aus Datenbank geladen");
    return NextResponse.json(
      {
        ...rows[0],
        dataSource: "database",
        status: "success",
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ Header API Fehler:", error);

    // 🚨 NOTFALL-FALLBACK MIT KLARER MELDUNG
    const mockHeaderData = {
      id: 1,
      logo_text: "Lopez IT Welt",
      logo_icon: "LW",
      navigation_items: [
        { label: "Leistungen", link: "/leistungen", type: "link" },
        { label: "Projekte", link: "/projekte", type: "link" },
        { label: "Kontakt", link: "/kontakt", type: "link" },
      ],
      mobile_menu_text: "Menü",
      language_switch: true,
      is_active: true,
      // 🚨 NOTFALL-METADATEN
      dataSource: "fallback",
      status: "fallback",
      fallbackReason: "Datenbank-Verbindung fehlgeschlagen",
      timestamp: new Date().toISOString(),
      warning: "⚠️ NOTFALL-MODUS: Daten aus Fallback-System geladen",
    };

    console.warn("🚨 Header API: Notfall-Modus aktiviert - Mock-Daten geladen");
    return NextResponse.json(mockHeaderData, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }
}

// PUT - Header-Daten aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const connection = await createConnection();

    const {
      logo_text,
      navigation_items,
      mobile_menu_text = "Menü",
      language_switch = true,
      is_active = true,
    } = body;

    await connection.execute(
      `UPDATE content_header SET 
             logo_text = ?, 
             navigation_items = ?,
             mobile_menu_text = ?,
             language_switch = ?,
             is_active = ?,
             updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
      [
        logo_text,
        JSON.stringify(navigation_items),
        mobile_menu_text,
        language_switch,
        is_active,
        body.id,
      ],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        message: "Header-Daten aktualisiert",
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ Header Update Fehler:", error);
    return NextResponse.json(
      {
        error: "Update fehlgeschlagen",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}
