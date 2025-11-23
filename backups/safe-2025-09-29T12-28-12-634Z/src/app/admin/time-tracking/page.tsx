"use client";
import { Card } from "@/components/ui/Card";
import kiTracker from "@/lib/ki-action-tracker";
import { useEffect, useState } from "react";
import Timer from "../../../components/Features/Timer";
import { TimeSession } from "../../../lib/time-tracking-types";

interface TimeStats {
  totalSessions: number;
  activeSessions: number;
  totalTime: number;
  todayTime: number;
  statusStats: {
    active: number;
    completed: number;
    interrupted: number;
  };
  categoryStats: { [key: string]: number };
  problemStats: { [key: string]: number };
  moduleStats: { [key: string]: number };
  ausloeserStats: { [key: string]: number };
  avgDuration: number;
  successRate: number;
}

export default function TimeTrackingPage() {
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [stats, setStats] = useState<TimeStats>({
    totalSessions: 0,
    activeSessions: 0,
    totalTime: 0,
    todayTime: 0,
    statusStats: { active: 0, completed: 0, interrupted: 0 },
    categoryStats: {},
    problemStats: {},
    moduleStats: {},
    ausloeserStats: {},
    avgDuration: 0,
    successRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "analytics">("overview");
  const [currentSession, setCurrentSession] = useState<TimeSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSession, setNewSession] = useState<Partial<TimeSession>>({
    module: "",
    taetigkeit: "",
    category: "development",
    priority: "medium",
  });

  useEffect(() => {
    // Automatisch KI-Session starten
    kiTracker.startSessionFromTrigger(
      "Zeiterfassung-Bereich laden und Sessions verwalten",
      "Time-Tracking-Page-Component",
    );

    const startAutomaticTracking = async () => {
      try {
        // Prüfen ob bereits eine aktive Session für diesen Benutzer existiert
        const response = await fetch("/api/admin/time-tracking/sessions");
        if (response.ok) {
          const existingSessions = await response.json();
          const activeSession = existingSessions.find(
            (s: any) =>
              s.user_id === 1 &&
              s.status === "active" &&
              s.module === "Time-Tracking-Page-Component",
          );

          if (activeSession) {
            // Verwende bestehende Session
            setCurrentSession(activeSession);
            return;
          }
        }

        // Neue Session nur erstellen wenn keine aktive existiert
        const newSession: Partial<TimeSession> = {
          user_id: 1,
          module: "Time-Tracking-Page-Component",
          taetigkeit: "Zeiterfassung-Bereich laden und Sessions verwalten",
          ausloeser: "Automatische Zeiterfassung beim Laden der Admin-Seite",
          problem: "Manuelle Zeiterfassung ist ineffizient",
          category: "administration",
          priority: "high",
          status: "active",
        };

        const createResponse = await fetch("/api/admin/time-tracking/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSession),
        });

        if (createResponse.ok) {
          const session = await createResponse.json();
          setCurrentSession(session);
        }
      } catch (error) {
        console.error("❌ Fehler beim Starten der automatischen Session:", error);
      }
    };

    startAutomaticTracking();

    loadData();

    // Cleanup: Session beenden beim Verlassen der Seite
    return () => {
      if (currentSession) {
        handleSessionComplete(currentSession.id, {});
      }
    };
  }, []);

  // Daten laden - als separate Funktion definiert
  const loadData = async () => {
    try {
      const [sessionsRes, statsRes] = await Promise.all([
        fetch("/api/admin/time-tracking/sessions"),
        fetch("/api/admin/time-tracking/stats"),
      ]);

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData);

        // KI-Interaktion loggen
        kiTracker.logInteraction("Time-Tracking", "Sessions erfolgreich geladen", "API-Call");
      } else {
        // Fehler loggen
        kiTracker.logError(
          "Time-Tracking",
          "Sessions laden fehlgeschlagen",
          "API-Call",
          `HTTP ${sessionsRes.status}`,
        );
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);

        // KI-Interaktion loggen
        kiTracker.logInteraction("Time-Tracking", "Statistiken erfolgreich geladen", "API-Call");
      } else {
        // Fehler loggen
        kiTracker.logError(
          "Time-Tracking",
          "Statistiken laden fehlgeschlagen",
          "API-Call",
          `HTTP ${statsRes.status}`,
        );
      }
    } catch (error) {
      console.error("Fehler beim Laden der Daten:", error);

      // Fehler loggen
      kiTracker.logError(
        "Time-Tracking",
        "Daten laden fehlgeschlagen",
        "API-Call",
        error instanceof Error ? error.message : "Unbekannter Fehler",
      );
    } finally {
      setLoading(false);
    }
  };

  // Automatische Zeiterfassung für alle Aktionen
  const logAction = (action: string, details?: string) => {
    kiTracker.logInteraction("Time-Tracking", action, "Benutzer-Aktion", details);
  };

  const handleSessionAction = async (
    sessionId: string,
    action: "start" | "pause" | "stop" | "complete",
    sessionData?: Partial<TimeSession>,
  ) => {
    // Implementation for future feature
  };

  const handleSessionUpdate = async (sessionId: string, updateData: Partial<TimeSession>) => {
    // Implementation for future feature
  };

  const handleSessionComplete = async (
    sessionId: number,
    completionData: {
      bemerkung?: string;
      naechster_schritt?: string;
      kategorie?: string;
      tags?: string[];
    },
  ) => {
    // Implementation for future feature
  };

  const calculateDuration = (startTime: string, endTime?: string): string => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      interrupted: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}
      >
        {status === "active" ? "Aktiv" : status === "completed" ? "Abgeschlossen" : "Unterbrochen"}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles]}`}
      >
        {priority === "low" ? "Niedrig" : priority === "medium" ? "Mittel" : "Hoch"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Zeiterfassungsdaten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ⏱️ Zeiterfassung & Projekt-Tracking
        </h1>
        <p className="text-gray-600">Professionelle Zeitverfolgung für optimale Projektsteuerung</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: "overview", label: "Übersicht", icon: "📊" },
            { id: "sessions", label: "Sessions", icon: "⏱️" },
            { id: "analytics", label: "Analytics", icon: "📈" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && stats && (
        <div className="space-y-6">
          {/* Timer Component */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">⏱️ Live Timer</h3>
            <Timer
              sessionId={currentSession?.id}
              onSessionComplete={(duration) => {
                if (currentSession) {
                  handleSessionComplete(currentSession.id, {});
                }
              }}
              autoStart={!!currentSession}
            />
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Gesamt-Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">⏱️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktive Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeSessions}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">⏰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Gesamtzeit</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDuration(stats.totalTime)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-2xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Heute</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDuration(stats.todayTime)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Status Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Status-Übersicht</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Abgeschlossen</p>
                <p className="text-2xl font-bold text-green-600">{stats.statusStats.completed}</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Aktiv</p>
                <p className="text-2xl font-bold text-orange-600">{stats.statusStats.active}</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Unterbrochen</p>
                <p className="text-2xl font-bold text-red-600">{stats.statusStats.interrupted}</p>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance-Metriken</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Erfolgsrate</p>
                <p className="text-3xl font-bold text-blue-600">{stats.successRate}%</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Ø Dauer</p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatDuration(stats.avgDuration)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          {/* New Session Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Zeiterfassungs-Sessions</h2>
            <div className="flex space-x-3">
              {stats && stats.activeSessions > 0 && (
                <button
                  onClick={() => {
                    // TODO: Implement closeAllOpenSessions for future feature
                    console.log("Close all sessions feature not yet implemented");
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  title={`${stats.activeSessions} offene Sessions beenden`}
                >
                  🔒 Alle beenden ({stats.activeSessions})
                </button>
              )}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showAddForm ? "Abbrechen" : "+ Neue Session"}
              </button>
            </div>
          </div>

          {/* New Session Form */}
          {showAddForm && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Neue Session erstellen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modul</label>
                  <input
                    type="text"
                    value={newSession.module}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        module: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="z.B. Frontend-Entwicklung"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tätigkeit</label>
                  <input
                    type="text"
                    value={newSession.taetigkeit}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        taetigkeit: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Beschreibung der Tätigkeit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
                  <select
                    value={newSession.category}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="development">Entwicklung</option>
                    <option value="bugfix">Bugfix</option>
                    <option value="planning">Planung</option>
                    <option value="testing">Testing</option>
                    <option value="documentation">Dokumentation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priorität</label>
                  <select
                    value={newSession.priority}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        priority: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Niedrig</option>
                    <option value="medium">Mittel</option>
                    <option value="high">Hoch</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement startTimer for future feature
                    console.log("Start timer feature not yet implemented");
                  }}
                  disabled={!newSession.module || !newSession.taetigkeit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Session starten
                </button>
              </div>
            </Card>
          )}

          {/* Sessions List */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Aktuelle Sessions</h3>
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Keine Sessions vorhanden</p>
            ) : (
              <div className="space-y-4">
                {sessions
                  .sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                  )
                  .map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{session.module}</h4>
                          <p className="text-sm text-gray-600">{session.taetigkeit}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(session.status)}
                          {getPriorityBadge(session.priority)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Start:</span>{" "}
                          {formatDateTime(session.start_time)}
                        </div>
                        {session.end_time && (
                          <div>
                            <span className="font-medium">Ende:</span>{" "}
                            {formatDateTime(session.end_time)}
                          </div>
                        )}
                        {session.duration_minutes && (
                          <div>
                            <span className="font-medium">Dauer:</span>{" "}
                            {formatDuration(session.duration_minutes)}
                          </div>
                        )}
                      </div>

                      {session.ausloeser && (
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Auslöser:</span> {session.ausloeser}
                        </div>
                      )}

                      {session.problem && (
                        <div className="text-sm text-red-600 mb-3">
                          <span className="font-medium">Problem:</span> {session.problem}
                        </div>
                      )}

                      {session.status === "active" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSessionComplete(session.id, {})}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Abschließen
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && stats && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Detaillierte Analytics</h2>
            <a
              href="/admin/time-tracking/analytics"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>📊</span>
              <span>Vollständige Analytics öffnen</span>
            </a>
          </div>

          {/* Module Analysis */}
          {Object.keys(stats.moduleStats).length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Zeitintensivste Module</h3>
              <div className="space-y-2">
                {Object.entries(stats.moduleStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([module, minutes]) => (
                    <div
                      key={module}
                      className="flex justify-between items-center p-2 bg-blue-50 rounded"
                    >
                      <span className="text-sm text-gray-700">{module}</span>
                      <span className="font-semibold text-blue-600">{formatDuration(minutes)}</span>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* Problem Analysis */}
          {Object.keys(stats.problemStats).length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Häufigste Probleme</h3>
              <div className="space-y-2">
                {Object.entries(stats.problemStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([problem, count]) => (
                    <div
                      key={problem}
                      className="flex justify-between items-center p-2 bg-red-50 rounded"
                    >
                      <span className="text-sm text-gray-700">{problem}</span>
                      <span className="font-semibold text-red-600">{count}x</span>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* Category Analysis */}
          {Object.keys(stats.categoryStats).length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Zeitverteilung nach Kategorien</h3>
              <div className="space-y-2">
                {Object.entries(stats.categoryStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, minutes]) => (
                    <div
                      key={category}
                      className="flex justify-between items-center p-2 bg-purple-50 rounded"
                    >
                      <span className="text-sm text-gray-700 capitalize">{category}</span>
                      <span className="font-semibold text-purple-600">
                        {formatDuration(minutes)}
                      </span>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* Quick Preview Card */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-lg font-semibold mb-4">🚀 Erweiterte Analytics verfügbar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <span className="text-2xl">📅</span>
                <p className="text-sm font-medium mt-1">Tagesübersicht</p>
                <p className="text-xs text-gray-600">Alle Sessions des Tages</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <span className="text-2xl">📈</span>
                <p className="text-sm font-medium mt-1">Wochenübersicht</p>
                <p className="text-xs text-gray-600">Balkendiagramm pro Wochentag</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <span className="text-2xl">🔍</span>
                <p className="text-sm font-medium mt-1">Filterbar</p>
                <p className="text-xs text-gray-600">Nach Benutzer, Zeitraum, Projekt</p>
              </div>
            </div>
            <div className="text-center">
              <a
                href="/admin/time-tracking/analytics"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>📊</span>
                <span>Vollständige Analytics öffnen</span>
              </a>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
