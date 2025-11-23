/**
 * GET /api/ab/experiments
 * Liefert alle Experimente mit Varianten zurück
 *
 * POST /api/ab/experiments
 * Erstellt ein neues Experiment
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const connection = await createConnection();

    let query = "SELECT * FROM ab_experiments";
    const params: any[] = [];

    if (status) {
      query += " WHERE status = ?";
      params.push(status);
    }

    query += " ORDER BY created_at DESC";

    const [experiments] = await connection.execute(query, params);

    // Varianten für jedes Experiment laden
    const experimentsWithVariants = await Promise.all(
      (Array.isArray(experiments) ? experiments : []).map(async (exp: any) => {
        const [variants] = await connection.execute(
          "SELECT * FROM ab_variants WHERE experiment_id = ? ORDER BY variant_key",
          [exp.id],
        );

        return {
          ...exp,
          variants: Array.isArray(variants) ? variants : [],
        };
      }),
    );

    await connection.end();

    return NextResponse.json(
      {
        experiments: experimentsWithVariants,
        count: experimentsWithVariants.length,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ A/B Experiments API Fehler:", error);
    return NextResponse.json(
      {
        error: "Fehler beim Abrufen der Experimente",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, goal, split_a = 50, variants } = body;

    if (!name || !variants || variants.length < 2) {
      return NextResponse.json(
        { error: "Name und mindestens 2 Varianten erforderlich" },
        { status: 400 },
      );
    }

    const connection = await createConnection();

    // 1. Experiment erstellen
    const [result] = await connection.execute(
      `INSERT INTO ab_experiments 
       (name, description, goal, status, split_a) 
       VALUES (?, ?, ?, 'draft', ?)`,
      [name, description, goal, split_a],
    );

    const experimentId = (result as any).insertId;

    // 2. Varianten erstellen
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const variantKey = String.fromCharCode(65 + i); // A, B, C, ...

      await connection.execute(
        `INSERT INTO ab_variants 
         (experiment_id, variant_key, title, subtitle, description, button_text, button_link) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          experimentId,
          variantKey,
          variant.title,
          variant.subtitle,
          variant.description,
          variant.button_text,
          variant.button_link,
        ],
      );
    }

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        message: "Experiment erfolgreich erstellt",
        experiment_id: experimentId,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ A/B Experiments POST Fehler:", error);
    return NextResponse.json(
      {
        error: "Fehler beim Erstellen des Experiments",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}
