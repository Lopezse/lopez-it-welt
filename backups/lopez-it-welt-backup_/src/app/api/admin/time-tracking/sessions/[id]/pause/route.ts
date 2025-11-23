import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

interface TimeSession {
  id: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  description?: string;
  category?: string;
  tags?: string[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const dataPath = path.join(process.cwd(), 'data', 'time-sessions.json');

    // Prüfe ob Datei existiert
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: 'Keine Sessions gefunden' },
        { status: 404 }
      );
    }

    // Lade bestehende Sessions
    const sessionsData = fs.readFileSync(dataPath, 'utf8');
    const sessions: TimeSession[] = JSON.parse(sessionsData);

    // Finde die Session
    const session = sessions.find((s: TimeSession) => s.id === sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session nicht gefunden' },
        { status: 404 }
      );
    }

    if (!session.isActive) {
      return NextResponse.json(
        { error: 'Session ist bereits pausiert' },
        { status: 400 }
      );
    }

    // Pausiere die Session
    session.isActive = false;
    session.endTime = new Date().toISOString();

    // Speichere aktualisierte Sessions
    fs.writeFileSync(dataPath, JSON.stringify(sessions, null, 2));

    return NextResponse.json({
      message: 'Session erfolgreich pausiert',
      session: session,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Pausieren der Session' },
      { status: 500 }
    );
  }
}
