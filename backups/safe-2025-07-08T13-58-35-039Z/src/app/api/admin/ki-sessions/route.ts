import { KISession } from "@/lib/ki-action-tracker";
import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Datei-Pfad für KI-Sessions
const KI_SESSIONS_FILE = path.join(process.cwd(), "data", "ki-sessions.json");

// KI-Sessions laden
async function loadKISessions(): Promise<KISession[]> {
  try {
    const data = await fs.readFile(KI_SESSIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Datei existiert nicht oder ist leer
    return [];
  }
}

// KI-Sessions speichern
async function saveKISessions(sessions: KISession[]): Promise<void> {
  try {
    // Verzeichnis erstellen falls nicht vorhanden
    const dir = path.dirname(KI_SESSIONS_FILE);
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(KI_SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error("Fehler beim Speichern der KI-Sessions:", error);
  }
}

export async function GET() {
  try {
    const sessions = await loadKISessions();
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Fehler beim Abrufen der KI-Sessions:", error);
    return NextResponse.json({ error: "Fehler beim Abrufen der KI-Sessions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Prüfen ob Request-Body leer ist
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type muss application/json sein" },
        { status: 400 },
      );
    }

    const body = await request.json();

    // Prüfen ob Body leer ist
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Request-Body darf nicht leer sein" }, { status: 400 });
    }

    const session: KISession = body;

    if (!session.session_id || !session.modul || !session.triggered_by) {
      return NextResponse.json(
        { error: "session_id, modul und triggered_by sind Pflichtfelder" },
        { status: 400 },
      );
    }

    const sessions = await loadKISessions();

    // Prüfen ob Session bereits existiert
    const existingSessionIndex = sessions.findIndex((s) => s.session_id === session.session_id);

    if (existingSessionIndex !== -1) {
      // Session aktualisieren
      sessions[existingSessionIndex] = {
        ...sessions[existingSessionIndex],
        ...session,
        updated_at: new Date().toISOString(),
      };
    } else {
      // Neue Session hinzufügen
      sessions.push({
        ...session,
        created_at: session.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    await saveKISessions(sessions);

    console.log(`✅ KI-Session gespeichert: ${session.session_id} - ${session.modul}`);
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Fehler beim Speichern der KI-Session:", error);
    return NextResponse.json({ error: "Fehler beim Speichern der KI-Session" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, ...updateData } = body;

    const sessions = await loadKISessions();
    const sessionIndex = sessions.findIndex((s) => s.session_id === session_id);

    if (sessionIndex === -1) {
      return NextResponse.json({ error: "KI-Session nicht gefunden" }, { status: 404 });
    }

    const updatedSession = {
      ...sessions[sessionIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    sessions[sessionIndex] = updatedSession;
    await saveKISessions(sessions);

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Fehler beim Aktualisieren der KI-Session:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren der KI-Session" },
      { status: 500 },
    );
  }
}
