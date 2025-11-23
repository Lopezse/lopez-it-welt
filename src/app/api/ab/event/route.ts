/**
 * POST /api/ab/event
 * Wird bei Klick oder Conversion aufgerufen
 * Schreibt Event in ab_events (type='click' oder 'conversion')
 * Erhöht Zähler in ab_variants
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { experiment_id, variant_key, event_type, device_type } = body;

    if (!experiment_id || !variant_key || !event_type) {
      return NextResponse.json(
        { error: "Fehlende Parameter: experiment_id, variant_key, event_type erforderlich" },
        { status: 400 },
      );
    }

    if (!["click", "conversion"].includes(event_type)) {
      return NextResponse.json(
        { error: "Ungültiger event_type. Erlaubt: click, conversion" },
        { status: 400 },
      );
    }

    const connection = await createConnection();

    // User-Hash generieren (anonymisiert, DSGVO-konform)
    const userAgent = request.headers.get("user-agent") || "";
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userHash = crypto.createHash("sha256").update(`${userAgent}-${ipAddress}`).digest("hex");

    const detectedDeviceType =
      device_type ||
      (userAgent.includes("Mobile")
        ? "mobile"
        : userAgent.includes("Tablet")
          ? "tablet"
          : "desktop");

    // 1. Event loggen
    await connection.execute(
      `INSERT INTO ab_events 
       (experiment_id, variant_key, event_type, user_hash, device_type) 
       VALUES (?, ?, ?, ?, ?)`,
      [experiment_id, variant_key, event_type, userHash, detectedDeviceType],
    );

    // 2. Zähler in ab_variants erhöhen
    if (event_type === "click") {
      await connection.execute(
        `UPDATE ab_variants 
         SET clicks = clicks + 1, updated_at = CURRENT_TIMESTAMP 
         WHERE experiment_id = ? AND variant_key = ?`,
        [experiment_id, variant_key],
      );
    } else if (event_type === "conversion") {
      await connection.execute(
        `UPDATE ab_variants 
         SET conversions = conversions + 1, updated_at = CURRENT_TIMESTAMP 
         WHERE experiment_id = ? AND variant_key = ?`,
        [experiment_id, variant_key],
      );
    }

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        message: `Event ${event_type} erfolgreich geloggt`,
        experiment_id,
        variant_key,
        event_type,
        device_type: detectedDeviceType,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ A/B Event API Fehler:", error);
    return NextResponse.json(
      {
        error: "Fehler beim Loggen des Events",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}
