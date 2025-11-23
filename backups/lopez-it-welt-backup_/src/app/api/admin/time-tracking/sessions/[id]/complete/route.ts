import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

interface TimeSession {
  id: number;
  user_id: number;
  module: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  taetigkeit: string;
  status: 'active' | 'completed' | 'interrupted';
  problem?: string;
  ausloeser?: string;
  category: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

// Datei-Pfad für Sessions
const SESSIONS_FILE = path.join(process.cwd(), 'data', 'time-sessions.json');

// Sessions laden
async function loadSessions(): Promise<TimeSession[]> {
  try {
    const data = await fs.readFile(SESSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Sessions speichern
async function saveSessions(sessions: TimeSession[]): Promise<void> {
  try {
    const dir = path.dirname(SESSIONS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('Fehler beim Speichern der Sessions:', error);
  }
}

// Dauer zwischen zwei Zeiten berechnen
function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // Minuten
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionId = parseInt(id);

    // JSON-Validierung hinzufügen
    let body;
    try {
      const rawBody = await request.text();
      if (!rawBody || rawBody.trim() === '') {
        body = {};
      } else {
        body = JSON.parse(rawBody);
      }
    } catch (jsonError) {
      console.error('JSON Parse Fehler:', jsonError);
      body = {};
    }

    const {
      end_time,
      status = 'completed',
      bemerkung,
      lektion,
      ursache,
      naechster_schritt,
    } = body;

    const sessions = await loadSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);

    if (sessionIndex === -1) {
      return NextResponse.json(
        { error: 'Session nicht gefunden' },
        { status: 404 }
      );
    }

    const session = sessions[sessionIndex];
    const now = new Date().toISOString();
    const endTime = end_time || now;
    const durationMinutes = calculateDuration(session.start_time, endTime);

    // Session aktualisieren
    sessions[sessionIndex] = {
      ...session,
      end_time: endTime,
      duration_minutes: Math.max(0, durationMinutes),
      status: status as 'active' | 'completed' | 'interrupted',
      problem: ursache || session.problem,
      ausloeser: lektion || session.ausloeser,
      updated_at: now,
    };

    await saveSessions(sessions);

    console.log(
      `✅ Session beendet: ${session.module} - ${durationMinutes} Min - Status: ${status}`
    );

    return NextResponse.json(sessions[sessionIndex]);
  } catch (error) {
    console.error('Fehler beim Beenden der Session:', error);
    return NextResponse.json(
      { error: 'Fehler beim Beenden der Session' },
      { status: 500 }
    );
  }
}
