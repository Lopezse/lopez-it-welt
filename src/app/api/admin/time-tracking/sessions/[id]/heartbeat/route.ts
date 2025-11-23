/**
 * POST /api/admin/time-tracking/sessions/[id]/heartbeat
 * Heartbeat für aktive Session (erkennt Idle-Zeit)
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

    // Body optional: { client_ts }
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body ist optional
    }

    const clientTs = body.client_ts || new Date().toISOString();
    const serverTs = new Date().toISOString();

    connection = await createConnection();

    // Session prüfen und last_seen aktualisieren
    const [sessions] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ? AND status = 'active'",
      [sessionId],
    );

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Session nicht gefunden oder nicht aktiv" },
        { status: 404 },
      );
    }

    // TODO: Auto-Pause bei Idle-Threshold (z.B. > 15 Min ohne Heartbeat)
    // Für jetzt: last_seen in updated_at speichern
    await connection.execute(
      "UPDATE work_sessions SET updated_at = ? WHERE id = ?",
      [serverTs, sessionId],
    );

    if (connection) {
      await connection.end();
    }

    return NextResponse.json({
      success: true,
      session_id: sessionId,
      server_ts: serverTs,
      client_ts: clientTs,
    });
  } catch (error: any) {
    console.error("❌ Heartbeat Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Heartbeat fehlgeschlagen",
      },
      { status: 500 },
    );
  }
}


 * POST /api/admin/time-tracking/sessions/[id]/heartbeat
 * Heartbeat für aktive Session (erkennt Idle-Zeit)
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

    // Body optional: { client_ts }
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body ist optional
    }

    const clientTs = body.client_ts || new Date().toISOString();
    const serverTs = new Date().toISOString();

    connection = await createConnection();

    // Session prüfen und last_seen aktualisieren
    const [sessions] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ? AND status = 'active'",
      [sessionId],
    );

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Session nicht gefunden oder nicht aktiv" },
        { status: 404 },
      );
    }

    // TODO: Auto-Pause bei Idle-Threshold (z.B. > 15 Min ohne Heartbeat)
    // Für jetzt: last_seen in updated_at speichern
    await connection.execute(
      "UPDATE work_sessions SET updated_at = ? WHERE id = ?",
      [serverTs, sessionId],
    );

    if (connection) {
      await connection.end();
    }

    return NextResponse.json({
      success: true,
      session_id: sessionId,
      server_ts: serverTs,
      client_ts: clientTs,
    });
  } catch (error: any) {
    console.error("❌ Heartbeat Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Heartbeat fehlgeschlagen",
      },
      { status: 500 },
    );
  }
}



















