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

// Hilfsfunktion um Dauer zwischen zwei Zeiten zu berechnen
function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // Minuten
}

// Prüfen ob ein Datum heute ist
function isToday(dateString: string): boolean {
  const today = new Date().toDateString();
  const date = new Date(dateString).toDateString();
  return today === date;
}

export async function GET() {
  try {
    const sessions = await loadSessions();
    const now = new Date().toISOString();
    const today = new Date(now).toDateString();

    // Berechne Statistiken
    const totalSessions = sessions.length;
    const activeSessions = sessions.filter((s) => s.status === "active").length;

    let totalTime = 0;
    let todayTime = 0;
    const statusStats = { active: 0, completed: 0, interrupted: 0 };
    const categoryStats: Record<string, number> = {};
    const problemStats: Record<string, number> = {};
    const moduleStats: Record<string, number> = {};
    const ausloeserStats: Record<string, number> = {};

    sessions.forEach((session) => {
      // Status-Statistiken
      statusStats[session.status]++;

      // Kategorie-Statistiken
      categoryStats[session.category] = (categoryStats[session.category] || 0) + 1;

      // Modul-Statistiken
      moduleStats[session.module] = (moduleStats[session.module] || 0) + 1;

      // Auslöser-Statistiken
      if (session.ausloeser) {
        ausloeserStats[session.ausloeser] = (ausloeserStats[session.ausloeser] || 0) + 1;
      }

      // Problem-Statistiken
      if (session.problem) {
        problemStats[session.problem] = (problemStats[session.problem] || 0) + 1;
      }

      // Zeit-Berechnungen
      if (session.end_time) {
        const duration = calculateDuration(session.start_time, session.end_time);
        totalTime += duration;

        // Heute gearbeitete Zeit
        if (isToday(session.start_time)) {
          todayTime += duration;
        }
      }
    });

    // Durchschnittliche Dauer
    const completedSessions = sessions.filter(
      (s) => s.status === "completed" && s.duration_minutes,
    );
    const avgDuration =
      completedSessions.length > 0
        ? Math.round(
            completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) /
              completedSessions.length,
          )
        : 0;

    // Erfolgsrate
    const successRate =
      totalSessions > 0 ? Math.round((statusStats.completed / totalSessions) * 100) : 0;

    const stats = {
      totalSessions,
      activeSessions,
      totalTime,
      todayTime,
      statusStats,
      categoryStats,
      problemStats,
      moduleStats,
      ausloeserStats,
      avgDuration,
      successRate,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Fehler beim Abrufen der Statistiken:", error);
    return NextResponse.json({ error: "Fehler beim Abrufen der Statistiken" }, { status: 500 });
  }
}
