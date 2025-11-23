/**
 * POST /api/ab/start
 * Setzt Experiment.status='running'
 * Aktiviert ab_active=1 in ab_config
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { experiment_id } = body;

    const connection = await createConnection();

    // 1. Experiment auf 'running' setzen
    if (experiment_id) {
      await connection.execute(
        `UPDATE ab_experiments 
         SET status = 'running', 
             start_date = COALESCE(start_date, NOW()),
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [experiment_id],
      );
    }

    // 2. Globale A/B-Testing aktivieren
    await connection.execute(
      `UPDATE ab_config 
       SET ab_active = 1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = 1`,
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        message: "A/B-Testing erfolgreich gestartet",
        experiment_id: experiment_id || "alle",
        ab_active: true,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ A/B Start API Fehler:", error);
    return NextResponse.json(
      {
        error: "Fehler beim Starten des A/B-Tests",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}
