import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

// MySQL-Verbindung konfigurieren
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  port: 3306,
};

// GET - Alle Bilder abrufen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const connection = await mysql.createConnection(dbConfig);

    let query = "SELECT * FROM content_images WHERE is_active = TRUE";
    let params: (string | null)[] = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await connection.execute(query, params);
    await connection.end();

    return NextResponse.json(rows);
  } catch {
    // Images API Error
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}

// PUT - Bild aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const connection = await mysql.createConnection(dbConfig);

    const { id, alt_text, category, is_active } = body;

    await connection.execute(
      `UPDATE content_images SET 
       alt_text = ?, 
       category = ?, 
       is_active = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [alt_text, category, is_active, id],
    );

    await connection.end();

    return NextResponse.json({ success: true, message: "Bild aktualisiert" });
  } catch {
    // Image Update Error
    return NextResponse.json({ error: "Update fehlgeschlagen" }, { status: 500 });
  }
}

// DELETE - Bild löschen
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID erforderlich" }, { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);

    // Soft Delete - nur is_active auf false setzen
    await connection.execute(
      "UPDATE content_images SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id],
    );

    await connection.end();

    return NextResponse.json({ success: true, message: "Bild gelöscht" });
  } catch {
    // Image Delete Error
    return NextResponse.json({ error: "Löschen fehlgeschlagen" }, { status: 500 });
  }
}
