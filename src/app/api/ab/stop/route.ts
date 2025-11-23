/**
 * POST /api/ab/stop
 * Setzt Experiment.status='paused' oder 'completed'
 * Deaktiviert ab_active=0
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { experiment_id, status = "paused" } = body;

    if (!["paused", "completed"].includes(status)) {
      return NextResponse.json(
        { error: "Ungültiger Status. Erlaubt: paused, completed" },
        { status: 400 },
      );
    }

    const connection = await createConnection();

    // 1. Experiment auf 'paused' oder 'completed' setzen
    if (experiment_id) {
      await connection.execute(
        `UPDATE ab_experiments 
         SET status = ?, 
             end_date = CASE WHEN status = 'running' THEN NOW() ELSE end_date END,
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [status, experiment_id],
      );
    } else {
      // Alle Experimente stoppen
      await connection.execute(
        `UPDATE ab_experiments 
         SET status = ?, 
             end_date = CASE WHEN status = 'running' THEN NOW() ELSE end_date END,
             updated_at = CURRENT_TIMESTAMP 
         WHERE status = 'running'`,
        [status],
      );
    }

    // 2. Prüfe ob noch aktive Experimente existieren
    const [activeRows] = await connection.execute(
      `SELECT COUNT(*) as count FROM ab_experiments WHERE status = 'running'`,
    );

    const activeCount = (activeRows as any[])[0]?.count || 0;

    // 3. Globale A/B-Testing deaktivieren, wenn keine aktiven Experimente
    if (activeCount === 0) {
      await connection.execute(
        `UPDATE ab_config 
         SET ab_active = 0, updated_at = CURRENT_TIMESTAMP 
         WHERE id = 1`,
      );
    }

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        message: `A/B-Testing erfolgreich gestoppt (Status: ${status})`,
        experiment_id: experiment_id || "alle",
        ab_active: activeCount > 0,
        active_experiments: activeCount,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ A/B Stop API Fehler:", error);
    return NextResponse.json(
      {
        error: "Fehler beim Stoppen des A/B-Tests",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}
