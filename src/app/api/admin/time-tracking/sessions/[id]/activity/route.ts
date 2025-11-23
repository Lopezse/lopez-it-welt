/**
 * POST /api/admin/time-tracking/sessions/[id]/activity
 * Activity-Tracking für Session (DSGVO-konform: nur Meta)
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  let connection: any = null;

  try {
    const { id } = await params;
    const sessionId = parseInt(id);

    if (isNaN(sessionId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session-ID" },
        { status: 400 },
      );
    }

    // Body: { type: "git_commit"|"build"|"test"|"save", meta?: { hash?: string; msg?: string } }
    const body = await request.json();
    const { type, meta } = body;

    if (!type || !["git_commit", "build", "test", "save"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Ungültiger Activity-Typ" },
        { status: 400 },
      );
    }

    // DSGVO-konform: Nur Meta speichern, keine Dateiinhalte
    const activityMeta = {
      type,
      hash: meta?.hash || null,
      msg: meta?.msg ? meta.msg.substring(0, 255) : null, // Begrenzung auf 255 Zeichen
      timestamp: new Date().toISOString(),
    };

    connection = await createConnection();

    // Session prüfen
    const [sessions] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ?",
      [sessionId],
    );

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Session nicht gefunden" },
        { status: 404 },
      );
    }

    // TODO: Activity in separate Tabelle speichern (work_session_activities)
    // Für jetzt: Nur Meta im Response zurückgeben
    // In Zukunft: INSERT INTO work_session_activities (session_id, type, meta_json, created_at)

    if (connection) {
      await connection.end();
    }

    return NextResponse.json({
      success: true,
      session_id: sessionId,
      stored: activityMeta,
    });
  } catch (error: any) {
    console.error("❌ Activity Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Activity-Tracking fehlgeschlagen",
      },
      { status: 500 },
    );
  }
}


 * POST /api/admin/time-tracking/sessions/[id]/activity
 * Activity-Tracking für Session (DSGVO-konform: nur Meta)
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  let connection: any = null;

  try {
    const { id } = await params;
    const sessionId = parseInt(id);

    if (isNaN(sessionId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session-ID" },
        { status: 400 },
      );
    }

    // Body: { type: "git_commit"|"build"|"test"|"save", meta?: { hash?: string; msg?: string } }
    const body = await request.json();
    const { type, meta } = body;

    if (!type || !["git_commit", "build", "test", "save"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Ungültiger Activity-Typ" },
        { status: 400 },
      );
    }

    // DSGVO-konform: Nur Meta speichern, keine Dateiinhalte
    const activityMeta = {
      type,
      hash: meta?.hash || null,
      msg: meta?.msg ? meta.msg.substring(0, 255) : null, // Begrenzung auf 255 Zeichen
      timestamp: new Date().toISOString(),
    };

    connection = await createConnection();

    // Session prüfen
    const [sessions] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ?",
      [sessionId],
    );

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Session nicht gefunden" },
        { status: 404 },
      );
    }

    // TODO: Activity in separate Tabelle speichern (work_session_activities)
    // Für jetzt: Nur Meta im Response zurückgeben
    // In Zukunft: INSERT INTO work_session_activities (session_id, type, meta_json, created_at)

    if (connection) {
      await connection.end();
    }

    return NextResponse.json({
      success: true,
      session_id: sessionId,
      stored: activityMeta,
    });
  } catch (error: any) {
    console.error("❌ Activity Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Activity-Tracking fehlgeschlagen",
      },
      { status: 500 },
    );
  }
}



















