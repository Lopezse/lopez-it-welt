/**
 * LEGACY API: A/B-Test Config
 * Umleitung zum neuen Experimentation Core System
 *
 * Diese Route wird auf /api/ab/config umgeleitet
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // Umleitung zur neuen API
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ab/config`,
    );

    if (response.ok) {
      const data = await response.json();
      // Legacy-Kompatibilität: Konvertiere neues Format zu altem Format
      return NextResponse.json({
        id: 1,
        test_name: "Hero-Section",
        is_active: data.ab_active || false,
        variant_a_id: 1,
        variant_b_id: 2,
        traffic_split: data.default_split || 50,
        auto_activate_winner: data.auto_winner_enabled || false,
        auto_activate_threshold: data.auto_winner_threshold || 1000,
        auto_activate_days: data.auto_winner_days || 7,
      });
    }

    // Fallback
    return NextResponse.json({ is_active: false });
  } catch (error) {
    console.error("Legacy API Redirect Fehler:", error);
    return NextResponse.json({ is_active: false });
  }
}

export async function PUT(request: NextRequest) {
  // Umleitung zur neuen API
  try {
    const body = await request.json();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ab/config`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ab_active: body.is_active,
          default_split: body.traffic_split,
          auto_winner_enabled: body.auto_activate_winner,
          auto_winner_threshold: body.auto_activate_threshold,
          auto_winner_days: body.auto_activate_days,
        }),
      },
    );

    if (response.ok) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Update fehlgeschlagen" }, { status: 500 });
  } catch (error) {
    console.error("Legacy API Update Fehler:", error);
    return NextResponse.json({ error: "Update fehlgeschlagen" }, { status: 500 });
  }
}
