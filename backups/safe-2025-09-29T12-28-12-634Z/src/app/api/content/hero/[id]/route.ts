import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const heroId = parseInt(id);

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_it_welt",
      port: 3306,
    });

    const [rows] = await connection.execute("SELECT * FROM content_hero WHERE id = ?", [heroId]);

    await connection.end();

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ error: "Hero-Variante nicht gefunden" }, { status: 404 });
    }
  } catch {
    // Fehler beim Laden der Hero-Variante
    return NextResponse.json({ error: "Fehler beim Laden der Hero-Variante" }, { status: 500 });
  }
}
