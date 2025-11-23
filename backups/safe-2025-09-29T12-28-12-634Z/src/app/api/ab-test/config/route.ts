import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_it_welt",
      port: 3306,
    });

    const [rows] = await connection.execute(
      "SELECT * FROM ab_test_config WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1",
    );

    await connection.end();

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ is_active: false });
    }
  } catch (error) {
    // Fehler beim Laden der A/B-Test Konfiguration: ${error}
    return NextResponse.json(
      { error: "Fehler beim Laden der A/B-Test Konfiguration" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      is_active,
      traffic_split,
      auto_activate_winner,
      auto_activate_threshold,
      auto_activate_days,
    } = body;

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_it_welt",
      port: 3306,
    });

    await connection.execute(
      "UPDATE ab_test_config SET is_active = ?, traffic_split = ?, auto_activate_winner = ?, auto_activate_threshold = ?, auto_activate_days = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
      [is_active, traffic_split, auto_activate_winner, auto_activate_threshold, auto_activate_days],
    );

    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    // Fehler beim Aktualisieren der A/B-Test Konfiguration: ${error}
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren der A/B-Test Konfiguration" },
      { status: 500 },
    );
  }
}
