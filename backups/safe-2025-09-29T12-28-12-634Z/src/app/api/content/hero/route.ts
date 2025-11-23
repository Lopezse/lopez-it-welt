import { createConnection, executeQuery } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET - Hero-Section Daten abrufen
export async function GET() {
  try {
    const rows = await executeQuery(
      "SELECT * FROM content_hero WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1",
    );

    if (Array.isArray(rows) && rows.length === 0) {
      return NextResponse.json({ error: "Keine Hero-Daten gefunden" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("❌ Hero API Fehler:", error);

    // 🚨 FALLBACK-DATEN FÜR HERO-SECTION
    const fallbackHeroData = {
      id: 1,
      title: "Professionelle IT-Lösungen",
      subtitle: "Lopez IT Welt",
      description:
        "Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung. Von der Konzeption bis zur Umsetzung - Ihr Partner für digitale Innovation.",
      button_text: "Jetzt beraten lassen",
      button_link: "/kontakt",
      background_style: "gradient",
      background_value: "from-blue-900 to-blue-600",
      is_active: true,
      dataSource: "fallback",
      status: "fallback",
      fallbackReason: "Datenbank-Verbindung fehlgeschlagen",
      timestamp: new Date().toISOString(),
      warning: "⚠️ NOTFALL-MODUS: Hero-Daten aus Fallback-System geladen",
    };

    console.warn("🚨 Hero API: Notfall-Modus aktiviert - Mock-Daten geladen");
    return NextResponse.json(fallbackHeroData);
  }
}

// PUT - Hero-Section Daten aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const connection = await createConnection();

    const {
      title,
      subtitle,
      description,
      button_text,
      button_link,
      background_style,
      background_value,
      is_active,
    } = body;

    await connection.execute(
      `UPDATE content_hero SET 
       title = ?, 
       subtitle = ?, 
       description = ?, 
       button_text = ?, 
       button_link = ?, 
       background_style = ?, 
       background_value = ?, 
       is_active = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title,
        subtitle,
        description,
        button_text,
        button_link,
        background_style,
        background_value,
        is_active,
        body.id,
      ],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Hero-Daten aktualisiert",
    });
  } catch {
    // Hero Update Error
    return NextResponse.json({ error: "Update fehlgeschlagen" }, { status: 500 });
  }
}

// POST - Neue Hero-Section Daten erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const connection = await createConnection();

    const {
      title,
      subtitle,
      description,
      button_text,
      button_link,
      background_style = "gradient",
      background_value,
      is_active = true,
    } = body;

    const [result] = await connection.execute(
      `INSERT INTO content_hero (title, subtitle, description, button_text, button_link, background_style, background_value, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        subtitle,
        description,
        button_text,
        button_link,
        background_style,
        background_value,
        is_active,
      ],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Hero-Daten erstellt",
      id: (result as { insertId: number }).insertId,
    });
  } catch {
    // Hero Create Error
    return NextResponse.json({ error: "Erstellung fehlgeschlagen" }, { status: 500 });
  }
}
