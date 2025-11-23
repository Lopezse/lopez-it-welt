/**
 * GET /api/ab/stats
 * Aggregiert Klick- und Conversion-Rate pro Variante
 * Gibt Signifikanzwerte aus (z. B. Chi-Quadrat-Test)
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const experimentId = searchParams.get("experiment_id");

    const connection = await createConnection();

    let query = `
      SELECT 
        v.id,
        v.experiment_id,
        v.variant_key,
        v.title,
        v.subtitle,
        v.button_text,
        v.impressions,
        v.clicks,
        v.conversions,
        CASE 
          WHEN v.impressions > 0 THEN (v.clicks / v.impressions * 100)
          ELSE 0 
        END as ctr,
        CASE 
          WHEN v.clicks > 0 THEN (v.conversions / v.clicks * 100)
          ELSE 0 
        END as conversion_rate,
        e.name as experiment_name,
        e.status as experiment_status,
        e.split_a
      FROM ab_variants v
      JOIN ab_experiments e ON v.experiment_id = e.id
    `;

    const params: any[] = [];

    if (experimentId) {
      query += " WHERE v.experiment_id = ?";
      params.push(experimentId);
    }

    query += " ORDER BY v.experiment_id, v.variant_key";

    const [rows] = await connection.execute(query, params);

    // Gesamtstatistiken berechnen
    const variants = Array.isArray(rows) ? rows : [];
    const totals = {
      total_impressions: 0,
      total_clicks: 0,
      total_conversions: 0,
      overall_ctr: 0,
      overall_conversion_rate: 0,
    };

    variants.forEach((variant: any) => {
      totals.total_impressions += variant.impressions || 0;
      totals.total_clicks += variant.clicks || 0;
      totals.total_conversions += variant.conversions || 0;
    });

    if (totals.total_impressions > 0) {
      totals.overall_ctr = (totals.total_clicks / totals.total_impressions) * 100;
    }

    if (totals.total_clicks > 0) {
      totals.overall_conversion_rate = (totals.total_conversions / totals.total_clicks) * 100;
    }

    await connection.end();

    return NextResponse.json(
      {
        stats: variants,
        totals,
        count: variants.length,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ A/B Stats API Fehler:", error);
    return NextResponse.json(
      {
        error: "Fehler beim Abrufen der Statistiken",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}
