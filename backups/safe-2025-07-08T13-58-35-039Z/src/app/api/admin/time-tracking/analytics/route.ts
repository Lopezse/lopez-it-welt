import { TimeTrackingService } from "@/lib/time-tracking";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = TimeTrackingService.getStats();

    // Erweiterte KI-Analysen
    const sessions = TimeTrackingService.getSessions();

    // Häufigste Probleme
    const problemAnalysis = Object.entries(stats.problemStats || {})
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([problem, count]) => ({ problem, count }));

    // Zeitintensivste Module
    const moduleAnalysis = Object.entries(stats.moduleStats || {})
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([module, minutes]) => ({ module, minutes }));

    // Häufigste Auslöser
    const ausloeserAnalysis = Object.entries(stats.ausloeserStats || {})
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([ausloeser, count]) => ({ ausloeser, count }));

    // Durchschnittliche Session-Dauer
    const completedSessions = sessions.filter(
      (s) => s.duration_minutes && s.status === "completed",
    );
    const avgDuration =
      completedSessions.length > 0
        ? Math.round(
            completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) /
              completedSessions.length,
          )
        : 0;

    // Erfolgsrate (completed vs interrupted)
    const totalCompleted = stats.statusStats.completed;
    const totalInterrupted = stats.statusStats.interrupted;
    const successRate =
      totalCompleted + totalInterrupted > 0
        ? Math.round((totalCompleted / (totalCompleted + totalInterrupted)) * 100)
        : 0;

    const analytics = {
      ...stats,
      problemAnalysis,
      moduleAnalysis,
      ausloeserAnalysis,
      avgDuration,
      successRate,
      totalCompleted,
      totalInterrupted,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Fehler beim Laden der Analytics:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Analytics" }, { status: 500 });
  }
}
