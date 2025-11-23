/**
 * GET /api/ab/variant
 * Ermittelt, welche Variante ein Nutzer sehen soll
 * Prüft: ab_active, split_a
 * Liefert zufällig oder gezielt Variante A/B zurück
 * Loggt Event in ab_events (type='view')
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const connection = await createConnection();

    // 1. Prüfe ob A/B-Testing aktiv ist
    const [configRows] = await connection.execute("SELECT * FROM ab_config WHERE id = 1");

    if (!Array.isArray(configRows) || configRows.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: "A/B-Testing Konfiguration nicht gefunden" },
        { status: 404 },
      );
    }

    const config = configRows[0] as any;

    if (!config.ab_active) {
      await connection.end();
      return NextResponse.json({
        active: false,
        variant: null,
        message: "A/B-Testing ist deaktiviert",
      });
    }

    // 2. Finde aktives Experiment
    const [experimentRows] = await connection.execute(
      `SELECT * FROM ab_experiments 
       WHERE status = 'running' 
       AND (start_date IS NULL OR start_date <= NOW())
       AND (end_date IS NULL OR end_date >= NOW())
       ORDER BY created_at DESC 
       LIMIT 1`,
    );

    if (!Array.isArray(experimentRows) || experimentRows.length === 0) {
      await connection.end();
      return NextResponse.json({
        active: false,
        variant: null,
        message: "Kein aktives Experiment gefunden",
      });
    }

    const experiment = experimentRows[0] as any;

    // 3. Lade Varianten
    const [variantRows] = await connection.execute(
      "SELECT * FROM ab_variants WHERE experiment_id = ? ORDER BY variant_key",
      [experiment.id],
    );

    if (!Array.isArray(variantRows) || variantRows.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Keine Varianten für dieses Experiment gefunden" },
        { status: 404 },
      );
    }

    // 4. User-Hash generieren (anonymisiert, DSGVO-konform)
    const userAgent = request.headers.get("user-agent") || "";
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userHash = crypto.createHash("sha256").update(`${userAgent}-${ipAddress}`).digest("hex");

    // 5. Device-Type erkennen
    const deviceType = userAgent.includes("Mobile")
      ? "mobile"
      : userAgent.includes("Tablet")
        ? "tablet"
        : "desktop";

    // 6. Variante zuweisen (konsistent basierend auf User-Hash)
    const hashValue = parseInt(userHash.substring(0, 8), 16);
    const splitPercentage = experiment.split_a || config.default_split;
    const variantIndex = hashValue % 100 < splitPercentage ? 0 : 1;
    const selectedVariant = variantRows[variantIndex] || variantRows[0];

    // 7. Event loggen (view)
    await connection.execute(
      `INSERT INTO ab_events 
       (experiment_id, variant_key, event_type, user_hash, device_type) 
       VALUES (?, ?, 'view', ?, ?)`,
      [experiment.id, selectedVariant.variant_key, userHash, deviceType],
    );

    // 8. Impression-Zähler erhöhen
    await connection.execute(
      `UPDATE ab_variants 
       SET impressions = impressions + 1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [selectedVariant.id],
    );

    await connection.end();

    // 9. Variante zurückgeben
    return NextResponse.json(
      {
        active: true,
        experiment_id: experiment.id,
        experiment_name: experiment.name,
        variant: {
          key: selectedVariant.variant_key,
          title: selectedVariant.title,
          subtitle: selectedVariant.subtitle,
          description: selectedVariant.description,
          button_text: selectedVariant.button_text,
          button_link: selectedVariant.button_link,
        },
        split_a: experiment.split_a,
        device_type: deviceType,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ A/B Variant API Fehler:", error);
    return NextResponse.json(
      {
        error: "Fehler beim Abrufen der Variante",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}
