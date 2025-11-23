import { promises as fs } from "fs";
import { NextResponse } from "next/server";
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
    // Fehler beim Speichern der Sessions: ${error}
  }
}

function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

export async function POST() {
  try {
    const sessions = await loadSessions();
    const now = new Date().toISOString();
    let closedCount = 0;
    let hasChanges = false;

    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i];
      if (session.status === "active" && !session.end_time) {
        const durationMinutes = calculateDuration(session.start_time, now);

        sessions[i] = {
          ...session,
          end_time: now,
          duration_minutes: Math.max(0, durationMinutes),
          status: "completed",
          updated_at: now,
        };
        hasChanges = true;
        closedCount++;
        // Session beendet: ${session.module} (${durationMinutes} Min)
      }
    }

    if (hasChanges) {
      await saveSessions(sessions);
    }

    return NextResponse.json({
      message: `${closedCount} Sessions beendet`,
      closedCount,
      totalSessions: sessions.length,
    });
  } catch (error) {
    // Fehler beim Beenden aller Sessions: ${error}
    return NextResponse.json({ error: "Fehler beim Beenden aller Sessions" }, { status: 500 });
  }
}
