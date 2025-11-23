"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  totalSessions: number;
  activeSessions: number;
  totalTime: number;
  todayTime: number;
  statusStats: {
    active: number;
    completed: number;
    interrupted: number;
  };
  problemAnalysis: Array<{ problem: string; count: number }>;
  moduleAnalysis: Array<{ module: string; minutes: number }>;
  ausloeserAnalysis: Array<{ ausloeser: string; count: number }>;
  avgDuration: number;
  successRate: number;
  totalCompleted: number;
  totalInterrupted: number;
}

export default function TimeTrackingAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/time-tracking/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-hellgrau">Lade Analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-center p-8 text-rot">Fehler beim Laden der Analytics</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-weiss">KI-Zeiterfassungs-Analyse</h2>

      {/* Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-4 shadow-2xl">
          <h3 className="font-semibold text-hellgrau">Gesamt-Sessions</h3>
          <p className="text-2xl font-bold text-hauptblau">{analytics.totalSessions}</p>
        </div>
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-4 shadow-2xl">
          <h3 className="font-semibold text-hellgrau">Aktive Sessions</h3>
          <p className="text-2xl font-bold text-orange">{analytics.activeSessions}</p>
        </div>
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-4 shadow-2xl">
          <h3 className="font-semibold text-hellgrau">Gesamtzeit (Min)</h3>
          <p className="text-2xl font-bold text-gruen">{analytics.totalTime}</p>
        </div>
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-4 shadow-2xl">
          <h3 className="font-semibold text-hellgrau">Heute (Min)</h3>
          <p className="text-2xl font-bold text-gelb">{analytics.todayTime}</p>
        </div>
      </div>

      {/* Erfolgsrate */}
      <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-weiss">Erfolgsrate & Durchschnitt</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-hellgrau">Erfolgsrate</p>
            <p className="text-3xl font-bold text-gruen">{analytics.successRate}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-hellgrau">Ø Dauer (Min)</p>
            <p className="text-3xl font-bold text-hauptblau">{analytics.avgDuration}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-hellgrau">Abgeschlossen</p>
            <p className="text-3xl font-bold text-gelb">{analytics.totalCompleted}</p>
          </div>
        </div>
      </div>

      {/* Status-Verteilung */}
      <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-weiss">Status-Verteilung</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gruen/10 rounded-xl border border-gruen/20">
            <p className="text-sm text-hellgrau">Abgeschlossen</p>
            <p className="text-2xl font-bold text-gruen">{analytics.statusStats.completed}</p>
          </div>
          <div className="text-center p-4 bg-orange/10 rounded-xl border border-orange/20">
            <p className="text-sm text-hellgrau">Aktiv</p>
            <p className="text-2xl font-bold text-orange">{analytics.statusStats.active}</p>
          </div>
          <div className="text-center p-4 bg-rot/10 rounded-xl border border-rot/20">
            <p className="text-sm text-hellgrau">Unterbrochen</p>
            <p className="text-2xl font-bold text-rot">{analytics.statusStats.interrupted}</p>
          </div>
        </div>
      </div>

      {/* Häufigste Probleme */}
      {analytics.problemAnalysis.length > 0 && (
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl">
          <h3 className="text-xl font-semibold mb-4 text-weiss">Häufigste Probleme</h3>
          <div className="space-y-2">
            {analytics.problemAnalysis.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-rot/10 rounded-xl border border-rot/20"
              >
                <span className="text-sm text-hellgrau">{item.problem}</span>
                <span className="font-semibold text-rot">{item.count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zeitintensivste Module */}
      {analytics.moduleAnalysis.length > 0 && (
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl">
          <h3 className="text-xl font-semibold mb-4 text-weiss">Zeitintensivste Module</h3>
          <div className="space-y-2">
            {analytics.moduleAnalysis.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-hauptblau/10 rounded-xl border border-hauptblau/20"
              >
                <span className="text-sm text-hellgrau">{item.module}</span>
                <span className="font-semibold text-hauptblau">{item.minutes} Min</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Häufigste Auslöser */}
      {analytics.ausloeserAnalysis.length > 0 && (
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl">
          <h3 className="text-xl font-semibold mb-4 text-weiss">Häufigste Auslöser</h3>
          <div className="space-y-2">
            {analytics.ausloeserAnalysis.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gelb/10 rounded-xl border border-gelb/20"
              >
                <span className="text-sm text-hellgrau">{item.ausloeser}</span>
                <span className="font-semibold text-gelb">{item.count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
