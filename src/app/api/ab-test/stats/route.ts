import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_it_welt",
      port: 3306,
    });

    // Statistiken laden
    const [stats] = await connection.execute(`
      SELECT 
        hts.hero_id,
        hts.variant_name,
        hts.device_type,
        hts.impressions,
        hts.clicks,
        hts.conversions,
        CASE 
          WHEN hts.impressions > 0 THEN (hts.clicks / hts.impressions) * 100
          ELSE 0
        END as ctr,
        CASE 
          WHEN hts.clicks > 0 THEN (hts.conversions / hts.clicks) * 100
          ELSE 0
        END as conversion_rate,
        hts.last_updated
      FROM hero_test_stats hts
      ORDER BY hts.last_updated DESC
    `);

    // Gesamtstatistiken
    const [totals] = await connection.execute(`
      SELECT 
        SUM(impressions) as total_impressions,
        SUM(clicks) as total_clicks,
        SUM(conversions) as total_conversions,
        CASE 
          WHEN SUM(impressions) > 0 THEN (SUM(clicks) / SUM(impressions)) * 100
          ELSE 0
        END as overall_ctr,
        CASE 
          WHEN SUM(clicks) > 0 THEN (SUM(conversions) / SUM(clicks)) * 100
          ELSE 0
        END as overall_conversion_rate
      FROM hero_test_stats
    `);

    await connection.end();

    return NextResponse.json({
      stats: stats,
      totals: Array.isArray(totals) && totals.length > 0 ? totals[0] : null,
    });
  } catch (error) {
    // Fehler beim Laden der A/B-Test Statistiken: ${error}
    return NextResponse.json(
      { error: "Fehler beim Laden der A/B-Test Statistiken" },
      { status: 500 },
    );
  }
}
