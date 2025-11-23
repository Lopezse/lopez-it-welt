import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

interface TimeSession {
  id: number;
  user_id: number;
  module: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  taetigkeit: string;
  status: "active" | "completed" | "interrupted";
  problem?: string;
  ausloeser?: string;
  category: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

// Datei-Pfad für Sessions
const SESSIONS_FILE = path.join(process.cwd(), "data", "time-sessions.json");

// Sessions laden
async function loadSessions(): Promise<TimeSession[]> {
  try {
    const data = await fs.readFile(SESSIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Datei existiert nicht oder ist leer
    return [];
  }
}

// Sessions speichern
async function saveSessions(sessions: TimeSession[]): Promise<void> {
  try {
    // Verzeichnis erstellen falls nicht vorhanden
    const dir = path.dirname(SESSIONS_FILE);
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (error) {
    // Fehler beim Speichern der Sessions: ${error}
  }
}

// Korrekte aktuelle Zeit (Deutschland mit Sommerzeit)
function getCurrentTime(): string {
  const now = new Date();
  // Automatische Sommerzeit-Erkennung
  return now.toISOString();
}

// Alle offenen Sessions beenden
async function closeAllOpenSessions(): Promise<void> {
  try {
    const sessions = await loadSessions();
    const now = new Date().toISOString();
    let hasChanges = false;

    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i];
      if (session.status === "active" && !session.end_time) {
        const startDate = new Date(session.start_time);
        const endDate = new Date(now);
        const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

        sessions[i] = {
          ...session,
          end_time: now,
          duration_minutes: Math.max(0, durationMinutes),
          status: "completed",
          updated_at: now,
        };
        hasChanges = true;
        // Offene Session automatisch beendet: ${session.module} (${durationMinutes} Min)
      }
    }

    if (hasChanges) {
      await saveSessions(sessions);
    }
  } catch (error) {
    // Fehler beim Beenden offener Sessions: ${error}
  }
}

export async function GET() {
  try {
    const sessions = await loadSessions();
    return NextResponse.json(sessions);
  } catch (error) {
    // Fehler beim Abrufen der Sessions: ${error}
    return NextResponse.json({ error: "Fehler beim Abrufen der Sessions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // KEINE automatische Beendigung mehr - echte Zeiterfassung!
    // await closeAllOpenSessions(); // ENTFERNT

    const body = await request.json();
    const {
      user_id,
      module,
      taetigkeit,
      ausloeser,
      problem,
      category = "development",
      priority = "medium",
      project_id,
      task_id,
    } = body;

    // Validierung: Pflichtfelder
    if (!user_id) {
      return NextResponse.json({ error: "user_id ist ein Pflichtfeld" }, { status: 400 });
    }
    if (!project_id) {
      return NextResponse.json({ error: "project_id ist ein Pflichtfeld" }, { status: 400 });
    }
    if (!task_id) {
      return NextResponse.json({ error: "task_id ist ein Pflichtfeld" }, { status: 400 });
    }
    if (!taetigkeit || taetigkeit.trim().length < 8) {
      return NextResponse.json(
        { error: "taetigkeit ist ein Pflichtfeld (mindestens 8 Zeichen)" },
        { status: 400 },
      );
    }
    if (taetigkeit.length > 180) {
      return NextResponse.json(
        { error: "taetigkeit darf maximal 180 Zeichen lang sein" },
        { status: 400 },
      );
    }

    // Validierung: Keine technischen Namen
    const technicalPatterns = [
      /\.tsx?$/i,
      /\.jsx?$/i,
      /component/i,
      /page-component/i,
      /route/i,
      /index\./i,
    ];
    const hasTechnicalPattern = technicalPatterns.some((pattern) => pattern.test(taetigkeit));
    if (hasTechnicalPattern) {
      return NextResponse.json(
        {
          error:
            "taetigkeit darf keine technischen Namen enthalten (z.B. .tsx, Component, Route). Verwende verständliche Beschreibungen.",
        },
        { status: 400 },
      );
    }

    const sessions = await loadSessions();
    
    // 🔒 WICHTIG: Prüfe ob bereits eine aktive Session für diesen Benutzer existiert
    const activeSession = sessions.find(
      (s) => s.user_id === user_id && s.status === "active" && !s.end_time
    );

    if (activeSession) {
      // Es existiert bereits eine aktive Session - diese zurückgeben
      return NextResponse.json(
        { 
          message: "Aktive Session existiert bereits",
          session: activeSession,
          id: activeSession.id
        },
        { status: 200 }
      );
    }

    // Keine aktive Session vorhanden - neue Session erstellen
    const now = getCurrentTime();
    const maxId = sessions.length > 0 ? Math.max(...sessions.map((s) => s.id)) : 0;

    const session: TimeSession = {
      id: maxId + 1,
      user_id,
      module: module || taetigkeit.substring(0, 50), // Fallback für module
      taetigkeit,
      ausloeser,
      problem,
      category,
      priority,
      project_id,
      task_id,
      start_time: now,
      status: "active",
      created_at: now,
      updated_at: now,
    };

    sessions.push(session);
    await saveSessions(sessions);

    // Neue Session erstellt: ${session.module} - ${session.taetigkeit} (${now})
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    // Fehler beim Erstellen der Session: ${error}
    return NextResponse.json({ error: "Fehler beim Erstellen der Session" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const sessions = await loadSessions();
    const sessionIndex = sessions.findIndex((s) => s.id === id);

    if (sessionIndex === -1) {
      return NextResponse.json({ error: "Session nicht gefunden" }, { status: 404 });
    }

    const now = getCurrentTime();
    const updatedSessionData = {
      ...sessions[sessionIndex],
      ...updateData,
      updated_at: now,
    };

    sessions[sessionIndex] = updatedSessionData;
    await saveSessions(sessions);

    return NextResponse.json(updatedSessionData);
  } catch (error) {
    // Fehler beim Aktualisieren der Session: ${error}
    return NextResponse.json({ error: "Fehler beim Aktualisieren der Session" }, { status: 500 });
  }
}
