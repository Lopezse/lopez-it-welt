import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hero_id, variant_name, device_type, event_type } = body;

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_it_welt",
      port: 3306,
    });

    // Prüfen ob Eintrag existiert
    const [existing] = await connection.execute(
      "SELECT id, impressions, clicks, conversions FROM hero_test_stats WHERE hero_id = ? AND variant_name = ? AND device_type = ?",
      [hero_id, variant_name, device_type],
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Eintrag existiert - updaten
      const stats = existing[0] as any;
      let updateQuery = "";
      let updateParams: any[] = [];

      if (event_type === "impression") {
        updateQuery = "UPDATE hero_test_stats SET impressions = impressions + 1 WHERE id = ?";
        updateParams = [stats.id];
      } else if (event_type === "click") {
        updateQuery = "UPDATE hero_test_stats SET clicks = clicks + 1 WHERE id = ?";
        updateParams = [stats.id];
      } else if (event_type === "conversion") {
        updateQuery = "UPDATE hero_test_stats SET conversions = conversions + 1 WHERE id = ?";
        updateParams = [stats.id];
      }

      if (updateQuery) {
        await connection.execute(updateQuery, updateParams);
      }
    } else {
      // Neuer Eintrag erstellen
      let impressions = 0;
      let clicks = 0;
      let conversions = 0;

      if (event_type === "impression") impressions = 1;
      else if (event_type === "click") clicks = 1;
      else if (event_type === "conversion") conversions = 1;

      await connection.execute(
        "INSERT INTO hero_test_stats (hero_id, variant_name, device_type, impressions, clicks, conversions) VALUES (?, ?, ?, ?, ?, ?)",
        [hero_id, variant_name, device_type, impressions, clicks, conversions],
      );
    }

    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    // Fehler beim Tracken des Events: ${error}
    return NextResponse.json({ error: "Fehler beim Tracken des Events" }, { status: 500 });
  }
}
