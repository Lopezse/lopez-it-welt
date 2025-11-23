/**
 * GET /api/ab/config
 * Liefert die globale A/B-Testing Konfiguration zurück
 *
 * PUT /api/ab/config
 * Aktualisiert die globale A/B-Testing Konfiguration
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await createConnection();

    const [rows] = await connection.execute("SELECT * FROM ab_config WHERE id = 1");

    await connection.end();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "Konfiguration nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json(rows[0], {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("❌ A/B Config API Fehler:", error);
    return NextResponse.json(
      {
        error: "Fehler beim Abrufen der Konfiguration",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      ab_active,
      default_split,
      auto_winner_enabled,
      auto_winner_threshold,
      auto_winner_days,
    } = body;

    const connection = await createConnection();

    await connection.execute(
      `UPDATE ab_config 
       SET ab_active = COALESCE(?, ab_active),
           default_split = COALESCE(?, default_split),
           auto_winner_enabled = COALESCE(?, auto_winner_enabled),
           auto_winner_threshold = COALESCE(?, auto_winner_threshold),
           auto_winner_days = COALESCE(?, auto_winner_days),
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = 1`,
      [ab_active, default_split, auto_winner_enabled, auto_winner_threshold, auto_winner_days],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        message: "Konfiguration erfolgreich aktualisiert",
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ A/B Config PUT Fehler:", error);
    return NextResponse.json(
      {
        error: "Fehler beim Aktualisieren der Konfiguration",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}
