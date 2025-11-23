import { executeQuery } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET - Footer-Daten abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "de";

    // Versuche MySQL-Verbindung
    try {
      const rows = await executeQuery(
        "SELECT * FROM lopez_footer WHERE language = ? AND is_active = TRUE ORDER BY section, sort_order",
        [language],
      );

      // Daten nach Sektionen gruppieren (4 Spalten)
      const footerData = {
        unternehmen: [],
        leistungen: [],
        kontakt: [],
        rechtliches: [],
      };

      (rows as any[]).forEach((item) => {
        footerData[item.section as keyof typeof footerData].push({
          id: item.id,
          title: item.title,
          content: item.content,
          link_url: item.link_url,
          sort_order: item.sort_order,
        });
      });

      // Umlaute korrigieren
      const correctedFooterData = {
        unternehmen: footerData.unternehmen.map((item) => ({
          ...item,
          content: item.content
            .replace(/L÷sungen/g, "Lösungen")
            .replace(/pers÷nliche/g, "persönliche")
            .replace(/Bahnhofstra▀e/g, "Bahnhofstraße"),
        })),
        leistungen: footerData.leistungen.map((item) => ({
          ...item,
          content: item.content,
        })),
        kontakt: footerData.kontakt.map((item) => ({
          ...item,
          content: item.content.replace(/Bahnhofstra▀e/g, "Bahnhofstraße"),
        })),
        rechtliches: footerData.rechtliches.map((item) => ({
          ...item,
          content: item.content,
        })),
      };

      // ✅ ERFOLGREICH AUS DATENBANK GELADEN
      console.log("✅ Footer API: Daten erfolgreich aus Datenbank geladen");
      return NextResponse.json({
        ...correctedFooterData,
        dataSource: "database",
        status: "success",
        timestamp: new Date().toISOString(),
      });
    } catch (dbError) {
      console.error("❌ Footer API Datenbankfehler:", dbError);
      // 🚨 NOTFALL-FALLBACK MIT KLARER MELDUNG
      const mockFooterData = {
        unternehmen: [],
        leistungen: [
          {
            id: "1",
            title: "IT-Support",
            content: "Professioneller IT-Support",
            link_url: "/it-support",
            sort_order: 1,
          },
          {
            id: "2",
            title: "Hardware",
            content: "Hardware-Lösungen",
            link_url: "/hardware",
            sort_order: 2,
          },
          {
            id: "3",
            title: "Webdesign",
            content: "Webdesign & Entwicklung",
            link_url: "/webdesign",
            sort_order: 3,
          },
          {
            id: "4",
            title: "AI & Cloud",
            content: "KI & Cloud-Services",
            link_url: "/ai-cloud",
            sort_order: 4,
          },
        ],
        kontakt: [
          {
            id: "1",
            title: "Kontakt",
            content: "Kontakt aufnehmen",
            link_url: "/kontakt",
            sort_order: 1,
          },
          {
            id: "2",
            title: "Support",
            content: "24/7 Support",
            link_url: "/support",
            sort_order: 2,
          },
          {
            id: "3",
            title: "Standorte",
            content: "Unsere Standorte",
            link_url: "/standorte",
            sort_order: 3,
          },
          {
            id: "4",
            title: "Partner",
            content: "Partner werden",
            link_url: "/partner",
            sort_order: 4,
          },
        ],
        rechtliches: [
          {
            id: "1",
            title: "Impressum",
            content: "Angaben gemäß § 5 TMG",
            link_url: "/impressum",
            sort_order: 1,
          },
          {
            id: "2",
            title: "Datenschutz",
            content: "Datenschutzerklärung",
            link_url: "/datenschutz",
            sort_order: 2,
          },
          {
            id: "3",
            title: "AGB",
            content: "Allgemeine Geschäftsbedingungen",
            link_url: "/agb",
            sort_order: 3,
          },
          {
            id: "4",
            title: "Cookie-Einstellungen",
            content: "Cookie-Verwaltung",
            link_url: "/cookies",
            sort_order: 4,
          },
        ],
        // 🚨 NOTFALL-METADATEN
        dataSource: "fallback",
        status: "fallback",
        fallbackReason: "Datenbank-Verbindung fehlgeschlagen",
        timestamp: new Date().toISOString(),
        warning: "⚠️ NOTFALL-MODUS: Footer-Daten aus Fallback-System geladen",
      };

      console.warn("🚨 Footer API: Notfall-Modus aktiviert - Mock-Daten geladen");
      return NextResponse.json(mockFooterData);
    }
  } catch (error) {
    console.error("Footer API Fehler:", error);
    return NextResponse.json({ error: "Footer nicht verfügbar" }, { status: 500 });
  }
}
