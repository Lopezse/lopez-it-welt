import { KISession } from "@/lib/ki-action-tracker";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

// Datei-Pfad für KI-Sessions
const KI_SESSIONS_FILE = path.join(process.cwd(), "data", "ki-sessions.json");

// KI-Sessions laden
async function loadKISessions(): Promise<KISession[]> {
  try {
    const data = await fs.readFile(KI_SESSIONS_FILE, "utf-8");
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
    const sessions = await loadKISessions();
    const now = new Date().toISOString();
    const today = new Date(now).toDateString();

    // Berechne Statistiken
    const totalSessions = sessions.length;
    const activeSessions = sessions.filter((s) => s.status === "active").length;

    let totalTime = 0;
    let todayTime = 0;
    const moduleStats: Record<string, number> = {};
    const toolStats: Record<string, number> = {};

    sessions.forEach((session) => {
      // Modul-Statistiken
      moduleStats[session.modul] = (moduleStats[session.modul] || 0) + 1;

      // Tool-Statistiken
      toolStats[session.tool_used] = (toolStats[session.tool_used] || 0) + 1;

      // Zeit-Berechnungen
      if (session.end_time && session.duration_minutes) {
        totalTime += session.duration_minutes;

        // Heute gearbeitete Zeit
        if (isToday(session.start_time)) {
          todayTime += session.duration_minutes;
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
      totalSessions > 0
        ? Math.round(
            (sessions.filter((s) => s.status === "completed").length / totalSessions) * 100,
          )
        : 0;

    const stats = {
      totalSessions,
      activeSessions,
      totalTime,
      todayTime,
      avgDuration,
      successRate,
      moduleStats,
      toolStats,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Fehler beim Abrufen der KI-Statistiken:", error);
    return NextResponse.json({ error: "Fehler beim Abrufen der KI-Statistiken" }, { status: 500 });
  }
}
