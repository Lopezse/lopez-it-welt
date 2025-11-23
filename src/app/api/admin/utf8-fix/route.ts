import { NextRequest, NextResponse } from "next/server";
import { executeQuery, createConnection } from "@/lib/db";

/**
 * Zentrale UTF-8 Fix API
 * Enterprise++ Standard für alle UTF-8 Korrekturen
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-09-28
 */

// Korrekte UTF-8 Daten für alle Tabellen
const utf8Data = {
  hero: {
    title: "Lopez IT Welt",
    subtitle: "Professionelle IT-Lösungen",
    description:
      "Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung. Von der Konzeption bis zur Umsetzung - Ihr Partner für digitale Innovation.",
    button_text: "Jetzt beraten lassen",
    button_link: "/kontakt",
    background_style: "gradient",
    background_value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    is_active: true,
  },
  header: {
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
  },
  footer: {
    unternehmen: [
      {
        title: "Lopez IT Welt",
        content:
          "Professionelle IT-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.",
        sort_order: 1,
      },
    ],
    leistungen: [
      { title: "Leistungen", content: "IT-Support", link_url: "#it-support", sort_order: 1 },
      { content: "PC-Bau & Einrichtung", link_url: "#pc-bau", sort_order: 2 },
      { content: "Webdesign", link_url: "#webdesign", sort_order: 3 },
      { content: "KI-Assistenz", link_url: "#ki-assistenz", sort_order: 4 },
    ],
    kontakt: [
      { title: "Kontakt", content: "Ramiro Lopez Rodriguez", sort_order: 1 },
      { content: "Alte Bahnhofstraße 13", sort_order: 2 },
      { content: "31515 Wunstorf", sort_order: 3 },
      {
        content: "E-Mail: info@lopez-it-welt.de",
        link_url: "mailto:info@lopez-it-welt.de",
        sort_order: 4,
      },
      { content: "Telefon: +49 (0) 5031 7005576", link_url: "tel:+4950317005576", sort_order: 5 },
      {
        content: "WhatsApp: +49 1525 1574657",
        link_url: "https://wa.me/4915251574657",
        sort_order: 6,
      },
    ],
    rechtliches: [
      { title: "Rechtliches", content: "Impressum", link_url: "/impressum", sort_order: 1 },
      { content: "Datenschutz", link_url: "/datenschutz", sort_order: 2 },
      { content: "Cookie-Einstellungen", link_url: "/cookie-einstellungen", sort_order: 3 },
      { content: "AGB", link_url: "/agb", sort_order: 4 },
    ],
  },
};

// POST - UTF-8 Fix für alle Tabellen
export async function POST(request: NextRequest) {
  try {
    const connection = await createConnection();

    // Transaktion starten
    await connection.execute("START TRANSACTION");

    try {
      // 1. Hero-Daten korrigieren
      await connection.execute("DELETE FROM content_hero");
      await connection.execute(
        `
        INSERT INTO content_hero (title, subtitle, description, button_text, button_link, background_style, background_value, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          utf8Data.hero.title,
          utf8Data.hero.subtitle,
          utf8Data.hero.description,
          utf8Data.hero.button_text,
          utf8Data.hero.button_link,
          utf8Data.hero.background_style,
          utf8Data.hero.background_value,
          utf8Data.hero.is_active,
        ],
      );

      // 2. Header-Daten korrigieren
      await connection.execute("DELETE FROM content_header");
      await connection.execute(
        `
        INSERT INTO content_header (logo_text, logo_icon, navigation_items, mobile_menu_text, language_switch, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [
          utf8Data.header.logo_text,
          utf8Data.header.logo_icon,
          JSON.stringify(utf8Data.header.navigation_items),
          utf8Data.header.mobile_menu_text,
          utf8Data.header.language_switch,
          utf8Data.header.is_active,
        ],
      );

      // 3. Footer-Daten korrigieren
      await connection.execute("DELETE FROM lopez_footer");

      // Footer-Daten für alle Sektionen einfügen
      const sections = ["unternehmen", "leistungen", "kontakt", "rechtliches"];
      for (const section of sections) {
        const items = utf8Data.footer[section as keyof typeof utf8Data.footer];
        for (const item of items) {
          await connection.execute(
            `
            INSERT INTO lopez_footer (id, section, title, content, link_url, sort_order, language, is_active)
            VALUES (UUID(), ?, ?, ?, ?, ?, 'de', TRUE)
          `,
            [section, item.title || null, item.content, item.link_url || null, item.sort_order],
          );
        }
      }

      // Transaktion bestätigen
      await connection.execute("COMMIT");
      await connection.end();

      return NextResponse.json({
        success: true,
        message: "UTF-8 Fix erfolgreich angewendet",
        tables: ["content_hero", "content_header", "lopez_footer"],
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Transaktion rückgängig machen
      await connection.execute("ROLLBACK");
      await connection.end();
      throw error;
    }
  } catch (error) {
    console.error("❌ UTF-8 Fix Fehler:", error);
    return NextResponse.json(
      {
        success: false,
        error: "UTF-8 Fix fehlgeschlagen",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}

// GET - UTF-8 Status prüfen
export async function GET() {
  try {
    const connection = await createConnection();

    // Prüfe aktuelle Daten auf UTF-8 Probleme
    const heroData = await executeQuery("SELECT subtitle, description FROM content_hero LIMIT 1");
    const headerData = await executeQuery("SELECT mobile_menu_text FROM content_header LIMIT 1");
    const footerData = await executeQuery(
      'SELECT content FROM lopez_footer WHERE content LIKE "%Lösungen%" LIMIT 1',
    );

    const hasUTF8Issues =
      heroData[0]?.subtitle?.includes("??") ||
      heroData[0]?.description?.includes("??") ||
      headerData[0]?.mobile_menu_text?.includes("??") ||
      footerData[0]?.content?.includes("??");

    return NextResponse.json({
      success: true,
      hasUTF8Issues,
      message: hasUTF8Issues ? "UTF-8 Probleme erkannt" : "UTF-8 korrekt konfiguriert",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ UTF-8 Status Prüfung Fehler:", error);
    return NextResponse.json(
      {
        success: false,
        error: "UTF-8 Status Prüfung fehlgeschlagen",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}
