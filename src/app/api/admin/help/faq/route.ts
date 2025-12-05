import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
  port: parseInt(process.env.DB_PORT || "3306"),
};

/**
 * GET /api/admin/help/faq
 * 
 * Gibt alle FAQ-Einträge zurück.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const connection = await mysql.createConnection(dbConfig);

    let query = `
      SELECT id, question, answer, category, order_index, is_active, created_at, updated_at
      FROM help_faq
      WHERE is_active = TRUE
    `;
    const params: any[] = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (search) {
      query += " AND (question LIKE ? OR answer LIKE ?)";
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    query += " ORDER BY order_index, created_at";

    const [faqs] = await connection.execute(query, params);

    await connection.end();

    return NextResponse.json({
      success: true,
      data: faqs || [],
    });
  } catch (error) {
    logger.error("Fehler beim Laden der FAQs", error);
    // Fallback auf statische FAQs
    return NextResponse.json({
      success: true,
      data: getDefaultFAQs(),
    });
  }
}

/**
 * POST /api/admin/help/faq
 * 
 * Erstellt einen neuen FAQ-Eintrag.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, category, order_index } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, message: "Frage und Antwort sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Prüfen ob Tabelle existiert
    const [tableCheck] = await connection.execute(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = 'help_faq'`,
    );

    if ((tableCheck as any[])[0]?.count === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "FAQ-Tabelle existiert noch nicht" },
        { status: 400 },
      );
    }

    // FAQ erstellen
    const [result] = await connection.execute(
      `INSERT INTO help_faq (question, answer, category, order_index, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, TRUE, NOW(), NOW())`,
      [question, answer, category || "general", order_index || 0],
    );

    const faqId = (result as any).insertId;

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "FAQ erfolgreich erstellt",
      data: { id: faqId },
    });
  } catch (error) {
    logger.error("Fehler beim Erstellen der FAQ", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Erstellen der FAQ" },
      { status: 500 },
    );
  }
}

/**
 * Standard-FAQs (Fallback)
 */
function getDefaultFAQs() {
  return [
    {
      id: 1,
      question: "Wie erstelle ich eine neue Rolle?",
      answer: "Gehen Sie zu 'Rollen & Rechte' und klicken Sie auf 'Neue Rolle'. Sie können auch ein Template verwenden oder eine bestehende Rolle klonen.",
      category: "roles",
      order_index: 1,
    },
    {
      id: 2,
      question: "Wie weise ich einem Benutzer eine Rolle zu?",
      answer: "Gehen Sie zu 'Benutzerverwaltung', wählen Sie den Benutzer aus und klicken Sie auf 'Rollen zuweisen'.",
      category: "users",
      order_index: 2,
    },
    {
      id: 3,
      question: "Wie konfiguriere ich das Dashboard?",
      answer: "Gehen Sie zu 'Dashboard-Konfiguration' und wählen Sie eine Rolle aus. Dann können Sie Widgets hinzufügen und anordnen.",
      category: "dashboard",
      order_index: 3,
    },
    {
      id: 4,
      question: "Wie exportiere ich Audit-Logs?",
      answer: "Gehen Sie zu 'Audit-Logs' und verwenden Sie die Export-Funktion. Sie können CSV, PDF oder Excel wählen.",
      category: "audit",
      order_index: 4,
    },
  ];
}


