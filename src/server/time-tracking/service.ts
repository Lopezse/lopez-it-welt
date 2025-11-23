/**
 * Time Tracking Service
 * Single Active Session + Stop→Rundung + Auto-Pause
 * 
 * NOTE: Dies ist ein Platzhalter-Service. In Zukunft sollte dies
 * durch echte Datenbankzugriffe ersetzt werden.
 */

import { createConnection } from "@/lib/db";

interface SessionData {
  id: number;
  user_id: number;
  module: string;
  taetigkeit: string;
  project_id?: number;
  order_id?: number;
  task_id?: number;
  category: string;
  priority: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  status: "active" | "completed" | "interrupted" | "paused";
  approved?: number;
  invoiced?: number;
}

/**
 * Startet eine neue Session (nur eine aktive Session pro User)
 */
export async function startSession(userId: number, payload: any): Promise<SessionData> {
  let connection: any = null;

  try {
    connection = await createConnection();

    // Prüfe ob bereits eine aktive Session existiert
    const [existing] = await connection.execute(
      "SELECT * FROM work_sessions WHERE user_id = ? AND status = 'active' AND end_time IS NULL LIMIT 1",
      [userId],
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Bereits aktive Session vorhanden - diese zurückgeben
      return existing[0] as SessionData;
    }

    // Neue Session erstellen
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const [result] = await connection.execute(
      `INSERT INTO work_sessions 
       (user_id, beschreibung, module, taetigkeit, project_id, order_id, task_id, 
        kategorie, prioritaet, start_time, status, approved, invoiced, erstellt_am, aktualisiert_am)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 0, 0, ?, ?)`,
      [
        userId,
        payload.taetigkeit || payload.beschreibung || "",
        payload.module || "",
        payload.taetigkeit || "",
        payload.project_id || null,
        payload.order_id || null,
        payload.task_id || null,
        payload.category || payload.kategorie || "umsetzung",
        payload.priority || payload.prioritaet || "mittel",
        now,
        now,
        now,
      ],
    );

    const sessionId = (result as any).insertId;

    // Session abrufen
    const [sessions] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ?",
      [sessionId],
    );

    if (connection) {
      await connection.end();
    }

    return sessions[0] as SessionData;
  } catch (error: any) {
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    throw error;
  }
}

/**
 * Pausiert eine Session
 */
export async function pauseSession(id: number): Promise<SessionData | null> {
  let connection: any = null;

  try {
    connection = await createConnection();

    await connection.execute(
      "UPDATE work_sessions SET status = 'pausiert', aktualisiert_am = ? WHERE id = ?",
      [new Date().toISOString().slice(0, 19).replace("T", " "), id],
    );

    const [sessions] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ?",
      [id],
    );

    if (connection) {
      await connection.end();
    }

    return sessions[0] as SessionData;
  } catch (error: any) {
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    throw error;
  }
}

/**
 * Setzt eine pausierte Session fort
 */
export async function resumeSession(id: number): Promise<SessionData | null> {
  let connection: any = null;

  try {
    connection = await createConnection();

    await connection.execute(
      "UPDATE work_sessions SET status = 'gut', aktualisiert_am = ? WHERE id = ?",
      [new Date().toISOString().slice(0, 19).replace("T", " "), id],
    );

    const [sessions] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ?",
      [id],
    );

    if (connection) {
      await connection.end();
    }

    return sessions[0] as SessionData;
  } catch (error: any) {
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    throw error;
  }
}

/**
 * Beendet eine Session und rundet auf 15-Minuten-Blöcke (0,25h)
 */
export async function stopSession(id: number): Promise<SessionData | null> {
  let connection: any = null;

  try {
    connection = await createConnection();

    // Session abrufen
    const [sessions] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ?",
      [id],
    );

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return null;
    }

    const session = sessions[0] as any;
    const startTime = new Date(session.start_time);
    const endTime = new Date();

    // Dauer in Minuten berechnen
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    // Rundung auf 15-Minuten-Blöcke (0,25h)
    const roundedMinutes = Math.ceil(durationMinutes / 15) * 15;

    const endTimeStr = endTime.toISOString().slice(0, 19).replace("T", " ");
    const now = endTimeStr;

    await connection.execute(
      `UPDATE work_sessions 
       SET end_time = ?, dauer_min = ?, status = 'gut', aktualisiert_am = ?
       WHERE id = ?`,
      [endTimeStr, roundedMinutes, now, id],
    );

    // Aktualisierte Session abrufen
    const [updated] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ?",
      [id],
    );

    if (connection) {
      await connection.end();
    }

    return updated[0] as SessionData;
  } catch (error: any) {
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    throw error;
  }
}

/**
 * Heartbeat für aktive Session
 */
export async function heartbeat(id: number): Promise<{ id: number; ok: boolean }> {
  let connection: any = null;

  try {
    connection = await createConnection();

    await connection.execute(
      "UPDATE work_sessions SET aktualisiert_am = ? WHERE id = ? AND status = 'active'",
      [new Date().toISOString().slice(0, 19).replace("T", " "), id],
    );

    if (connection) {
      await connection.end();
    }

    return { id, ok: true };
  } catch (error: any) {
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    throw error;
  }
}

/**
 * Activity-Tracking für Session
 */
export async function activity(
  id: number,
  type: string,
  meta: any,
): Promise<{ id: number; type: string }> {
  // TODO: In separate Tabelle speichern (work_session_activities)
  // Für jetzt: Nur zurückgeben
  return { id, type };
}


 * Time Tracking Service
 * Single Active Session + Stop→Rundung + Auto-Pause
 * 
 * NOTE: Dies ist ein Platzhalter-Service. In Zukunft sollte dies
 * durch echte Datenbankzugriffe ersetzt werden.
 */

import { createConnection } from "@/lib/db";

interface SessionData {
  id: number;
  user_id: number;
  module: string;
  taetigkeit: string;
  project_id?: number;
  order_id?: number;
  task_id?: number;
  category: string;
  priority: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  status: "active" | "completed" | "interrupted" | "paused";
  approved?: number;
  invoiced?: number;
}

/**
 * Startet eine neue Session (nur eine aktive Session pro User)
 */
export async function startSession(userId: number, payload: any): Promise<SessionData> {
  let connection: any = null;

  try {
    connection = await createConnection();

    // Prüfe ob bereits eine aktive Session existiert
    const [existing] = await connection.execute(
      "SELECT * FROM work_sessions WHERE user_id = ? AND status = 'active' AND end_time IS NULL LIMIT 1",
      [userId],
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Bereits aktive Session vorhanden - diese zurückgeben
      return existing[0] as SessionData;
    }

    // Neue Session erstellen
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const [result] = await connection.execute(
      `INSERT INTO work_sessions 
       (user_id, beschreibung, module, taetigkeit, project_id, order_id, task_id, 
        kategorie, prioritaet, start_time, status, approved, invoiced, erstellt_am, aktualisiert_am)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 0, 0, ?, ?)`,
      [
        userId,
        payload.taetigkeit || payload.beschreibung || "",
        payload.module || "",
        payload.taetigkeit || "",
        payload.project_id || null,
        payload.order_id || null,
        payload.task_id || null,
        payload.category || payload.kategorie || "umsetzung",
        payload.priority || payload.prioritaet || "mittel",
        now,
        now,
        now,
      ],
    );

    const sessionId = (result as any).insertId;

    // Session abrufen
    const [sessions] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ?",
      [sessionId],
    );

    if (connection) {
      await connection.end();
    }

    return sessions[0] as SessionData;
  } catch (error: any) {
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    throw error;
  }
}

/**
 * Pausiert eine Session
 */
export async function pauseSession(id: number): Promise<SessionData | null> {
  let connection: any = null;

  try {
    connection = await createConnection();

    await connection.execute(
      "UPDATE work_sessions SET status = 'pausiert', aktualisiert_am = ? WHERE id = ?",
      [new Date().toISOString().slice(0, 19).replace("T", " "), id],
    );

    const [sessions] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ?",
      [id],
    );

    if (connection) {
      await connection.end();
    }

    return sessions[0] as SessionData;
  } catch (error: any) {
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    throw error;
  }
}

/**
 * Setzt eine pausierte Session fort
 */
export async function resumeSession(id: number): Promise<SessionData | null> {
  let connection: any = null;

  try {
    connection = await createConnection();

    await connection.execute(
      "UPDATE work_sessions SET status = 'gut', aktualisiert_am = ? WHERE id = ?",
      [new Date().toISOString().slice(0, 19).replace("T", " "), id],
    );

    const [sessions] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ?",
      [id],
    );

    if (connection) {
      await connection.end();
    }

    return sessions[0] as SessionData;
  } catch (error: any) {
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    throw error;
  }
}

/**
 * Beendet eine Session und rundet auf 15-Minuten-Blöcke (0,25h)
 */
export async function stopSession(id: number): Promise<SessionData | null> {
  let connection: any = null;

  try {
    connection = await createConnection();

    // Session abrufen
    const [sessions] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ?",
      [id],
    );

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return null;
    }

    const session = sessions[0] as any;
    const startTime = new Date(session.start_time);
    const endTime = new Date();

    // Dauer in Minuten berechnen
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    // Rundung auf 15-Minuten-Blöcke (0,25h)
    const roundedMinutes = Math.ceil(durationMinutes / 15) * 15;

    const endTimeStr = endTime.toISOString().slice(0, 19).replace("T", " ");
    const now = endTimeStr;

    await connection.execute(
      `UPDATE work_sessions 
       SET end_time = ?, dauer_min = ?, status = 'gut', aktualisiert_am = ?
       WHERE id = ?`,
      [endTimeStr, roundedMinutes, now, id],
    );

    // Aktualisierte Session abrufen
    const [updated] = await connection.execute(
      "SELECT * FROM work_sessions WHERE id = ?",
      [id],
    );

    if (connection) {
      await connection.end();
    }

    return updated[0] as SessionData;
  } catch (error: any) {
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    throw error;
  }
}

/**
 * Heartbeat für aktive Session
 */
export async function heartbeat(id: number): Promise<{ id: number; ok: boolean }> {
  let connection: any = null;

  try {
    connection = await createConnection();

    await connection.execute(
      "UPDATE work_sessions SET aktualisiert_am = ? WHERE id = ? AND status = 'active'",
      [new Date().toISOString().slice(0, 19).replace("T", " "), id],
    );

    if (connection) {
      await connection.end();
    }

    return { id, ok: true };
  } catch (error: any) {
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    throw error;
  }
}

/**
 * Activity-Tracking für Session
 */
export async function activity(
  id: number,
  type: string,
  meta: any,
): Promise<{ id: number; type: string }> {
  // TODO: In separate Tabelle speichern (work_session_activities)
  // Für jetzt: Nur zurückgeben
  return { id, type };
}



















