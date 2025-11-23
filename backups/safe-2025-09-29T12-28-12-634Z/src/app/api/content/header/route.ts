import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

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
    return NextResponse.json({
      ...rows[0],
      dataSource: "database",
      status: "success",
      timestamp: new Date().toISOString(),
    });
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
    return NextResponse.json(mockHeaderData);
  }
}
