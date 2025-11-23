import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/contact-messages/[id]/comments - Neuen Kommentar hinzufügen
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messageId = parseInt(params.id);
    const body = await request.json();
    const { comment, is_internal = true } = body;

    if (isNaN(messageId)) {
      return NextResponse.json({ error: "Ungültige Nachrichten-ID" }, { status: 400 });
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json({ error: "Kommentar ist erforderlich" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    // Prüfen ob Nachricht existiert
    const checkQuery = "SELECT id FROM lopez_support_contact_messages WHERE id = ?";
    const [checkResult] = await connection.execute(checkQuery, [messageId]);

    if ((checkResult as any).length === 0) {
      await connection.end();
      return NextResponse.json({ error: "Nachricht nicht gefunden" }, { status: 404 });
    }

    // Kommentar einfügen
    const insertQuery = `
            INSERT INTO lopez_business_contact_comments 
            (message_id, comment, is_internal, created_by)
            VALUES (?, ?, ?, ?)
        `;

    const [result] = await connection.execute(insertQuery, [
      messageId,
      comment.trim(),
      is_internal,
      "admin", // TODO: Echte Benutzer-ID
    ]);

    // Nachricht updated_at aktualisieren
    const updateQuery = `
            UPDATE lopez_support_contact_messages 
            SET updated_at = NOW() 
            WHERE id = ?
        `;
    await connection.execute(updateQuery, [messageId]);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Kommentar erfolgreich hinzugefügt",
      id: (result as any).insertId,
    });
  } catch (error) {
    // Fehler beim Hinzufügen des Kommentars: ${error}
    return NextResponse.json({ error: "Fehler beim Hinzufügen des Kommentars" }, { status: 500 });
  }
}

// GET /api/admin/contact-messages/[id]/comments - Alle Kommentare einer Nachricht laden
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messageId = parseInt(params.id);

    if (isNaN(messageId)) {
      return NextResponse.json({ error: "Ungültige Nachrichten-ID" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    const query = `
            SELECT 
                id,
                comment,
                is_internal,
                created_at,
                created_by
            FROM lopez_business_contact_comments 
            WHERE message_id = ?
            ORDER BY created_at ASC
        `;

    const [rows] = await connection.execute(query, [messageId]);

    await connection.end();

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    // Fehler beim Laden der Kommentare: ${error}
    return NextResponse.json({ error: "Fehler beim Laden der Kommentare" }, { status: 500 });
  }
}
