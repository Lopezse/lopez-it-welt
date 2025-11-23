"use client";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
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
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "billable" | "analytics">("overview");
  const [billableEntries, setBillableEntries] = useState<any[]>([]);
  const [billableLoading, setBillableLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<TimeSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({
    customer_id: "",
    project_name: "",
    project_code: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "open",
  });
  const [newSession, setNewSession] = useState<Partial<TimeSession>>({
    module: "",
    taetigkeit: "",
    category: "development",
    priority: "medium",
    project_id: undefined,
    order_id: undefined,
    task_id: undefined,
    problem: false,
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
              !s.end_time
          );

          if (activeSession) {
            // Verwende bestehende aktive Session (egal welches Modul)
            setCurrentSession(activeSession);
            return;
          }
        }

        // NEUE AUTOMATISCHE SESSION DEAKTIVIERT
        // Stattdessen: Benutzer muss manuell eine Session starten
        // Dies verhindert automatische Duplikate
        
        // Automatische Session wird NICHT mehr erstellt
        // Der Benutzer muss bewusst eine Session starten über "+ Neue Session"
        
      } catch (error) {
        console.error("❌ Fehler beim Prüfen aktiver Sessions:", error);
      }
    };

    startAutomaticTracking();

    loadData();
    loadProjectsOrdersTasks();

    // Abrechenbare Zeiten beim Laden des Tabs laden
    const loadBillableEntries = async () => {
      if (activeTab === "billable") {
        setBillableLoading(true);
        try {
          const response = await fetch("/api/time/entries?approved=true&invoiced=false");
          if (response.ok) {
            const data = await response.json();
            setBillableEntries(data?.data?.items || []);
          }
        } catch (error) {
          console.error("❌ Fehler beim Laden der abrechenbaren Zeiten:", error);
        } finally {
          setBillableLoading(false);
        }
      }
    };

    // Lade abrechenbare Zeiten wenn Tab gewechselt wird
    if (activeTab === "billable") {
      loadBillableEntries();
    }

    // Heartbeat alle 20s, Auto-Pause bei Tab-Hidden
    let heartbeatInterval: any;
    const heartbeat = () => {
      if (!currentSession?.id) return;
      fetch(`/api/admin/time-tracking/sessions/${currentSession.id}/heartbeat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_ts: new Date().toISOString() }),
      }).catch(() => {});
    };

    heartbeatInterval = setInterval(heartbeat, 20000);

    const handleVisibilityChange = () => {
      if (document.hidden && currentSession) {
        // Auto-Pause bei Tab-Hidden
        handleSessionPause(currentSession.id);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup: Session beenden beim Verlassen der Seite
    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (currentSession) {
        handleSessionComplete(currentSession.id, {});
      }
    };
  }, [currentSession]);

  // Projekte, Aufträge und Aufgaben laden
  const loadProjectsOrdersTasks = async () => {
    try {
      const [projectsRes, ordersRes, tasksRes, customersRes] = await Promise.all([
        fetch("/api/projects").catch(() => null),
        fetch("/api/orders").catch(() => null),
        fetch("/api/tasks").catch(() => null),
        fetch("/api/admin/customers").catch(() => null),
      ]);

      if (projectsRes?.ok) {
        const data = await projectsRes.json();
        console.log("📦 Projekte geladen:", data);
        const loadedProjects = data?.data?.projects || data?.projects || [];
        setProjects(loadedProjects);
        
        // Automatisch Dialog öffnen, wenn keine Projekte vorhanden
        if (loadedProjects.length === 0 && !showProjectDialog) {
          setShowProjectDialog(true);
        }
      } else {
        console.error("❌ Projekte konnten nicht geladen werden:", projectsRes?.status);
      }

      if (ordersRes?.ok) {
        const data = await ordersRes.json();
        setOrders(data?.data?.orders || data?.orders || []);
      }

      if (tasksRes?.ok) {
        const data = await tasksRes.json();
        console.log("📦 Aufgaben geladen:", data);
        setTasks(data?.data?.tasks || data?.tasks || []);
      } else {
        console.error("❌ Aufgaben konnten nicht geladen werden:", tasksRes?.status);
      }

      if (customersRes?.ok) {
        const data = await customersRes.json();
        const loadedCustomers = data?.data?.customers || data?.customers || [];
        setCustomers(loadedCustomers);
        
        // Ersten Kunden als Default setzen, wenn vorhanden
        if (loadedCustomers.length > 0 && !newProject.customer_id) {
          setNewProject((prev) => ({
            ...prev,
            customer_id: loadedCustomers[0].id.toString(),
          }));
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden von Projekten/Aufträgen/Aufgaben:", error);
    }
  };

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

  const handleStartSession = async () => {
    try {
      // Validierung wird bereits im Button onClick gemacht

      // Prüfe zuerst, ob bereits eine aktive Session existiert
      if (currentSession && currentSession.status === "active" && !currentSession.end_time) {
        const currentProject = projects.find((p) => p.id === currentSession.project_id);
        const currentTask = tasks.find((t) => t.id === currentSession.task_id);
        const currentSessionDesc =
          currentProject && currentTask && currentSession.taetigkeit
            ? `Projekt: ${currentProject.project_name || currentProject.name} – Aufgabe: ${currentTask.task_title || currentTask.title} — ${currentSession.taetigkeit}`
            : currentSession.taetigkeit || currentSession.module;
        const confirmClose = confirm(
          `Sie haben bereits eine aktive Session: "${currentSessionDesc}". Möchten Sie diese zuerst beenden?`
        );
        if (confirmClose) {
          await handleSessionComplete(currentSession.id, {});
        } else {
          return; // Benutzer möchte nicht beenden - neue Session wird nicht erstellt
        }
      }

      const sessionData: Partial<TimeSession> = {
        user_id: 1,
        taetigkeit: newSession.taetigkeit || "",
        category: newSession.category || "development",
        priority: newSession.priority || "medium",
        project_id: newSession.project_id,
        order_id: newSession.order_id,
        task_id: newSession.task_id,
        problem: newSession.problem || false,
        status: "active",
      };

      const response = await fetch("/api/admin/time-tracking/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Prüfe ob eine bestehende Session zurückgegeben wurde (Status 200)
        if (result.message && result.message === "Aktive Session existiert bereits") {
          const existingProject = projects.find((p) => p.id === result.session.project_id);
          const existingTask = tasks.find((t) => t.id === result.session.task_id);
          const existingDesc = existingProject && existingTask
            ? `${existingProject.project_name || existingProject.name} - ${existingTask.task_title || existingTask.title}: ${result.session.taetigkeit}`
            : result.session.taetigkeit || result.session.module;
          alert(`⚠️ Es existiert bereits eine aktive Session: "${existingDesc}". Bitte beenden Sie diese zuerst.`);
          setCurrentSession(result.session);
          setShowAddForm(false);
          await loadData();
          return;
        }

        // Neue Session wurde erstellt (Status 201)
        const createdSession = result;
        setCurrentSession(createdSession);
        setShowAddForm(false);
        
        // Formular zurücksetzen
        setNewSession({
          module: "",
          taetigkeit: "",
          category: "development",
          priority: "medium",
          project_id: undefined,
          order_id: undefined,
          task_id: undefined,
          problem: false,
        });

        // Daten neu laden
        await loadData();

        // Erfolg loggen
        kiTracker.logInteraction("Time-Tracking", `Session gestartet: ${sessionData.module}`, "User-Action");
      } else {
        const error = await response.json();
        setError(error.error || "Fehler beim Starten der Session");
        kiTracker.logError("Time-Tracking", "Session starten fehlgeschlagen", "API-Call", error.error);
      }
    } catch (error) {
      console.error("❌ Fehler beim Starten der Session:", error);
      setError(error instanceof Error ? error.message : "Fehler beim Starten der Session");
      kiTracker.logError("Time-Tracking", "Session starten fehlgeschlagen", "API-Call", error instanceof Error ? error.message : "Unbekannter Fehler");
    }
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
    try {
      const response = await fetch(`/api/admin/time-tracking/sessions/${sessionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completionData),
      });

      if (response.ok) {
        const updatedSession = await response.json();
        
        // Aktuelle Session aktualisieren
        if (currentSession?.id === sessionId) {
          setCurrentSession(null);
        }

        // Sessions neu laden
        await loadData();
        
        // Erfolg loggen
        kiTracker.logInteraction("Time-Tracking", `Session ${sessionId} erfolgreich beendet`, "User-Action");
        
        return updatedSession;
      } else {
        const error = await response.json();
        setError(error.error || "Fehler beim Beenden der Session");
        kiTracker.logError("Time-Tracking", "Session beenden fehlgeschlagen", "API-Call", error.error);
        throw new Error(error.error || "Fehler beim Beenden der Session");
      }
    } catch (error) {
      console.error("❌ Fehler beim Beenden der Session:", error);
      setError(error instanceof Error ? error.message : "Fehler beim Beenden der Session");
      kiTracker.logError("Time-Tracking", "Session beenden fehlgeschlagen", "API-Call", error instanceof Error ? error.message : "Unbekannter Fehler");
    }
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
            { id: "billable", label: "Abrechenbar", icon: "💰" },
            { id: "analytics", label: "Analytics", icon: "📈" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={async () => {
                setActiveTab(tab.id as any);
                
                // Beim Wechsel zum "Abrechenbar" Tab, lade die abrechenbaren Zeiten
                if (tab.id === "billable") {
                  setBillableLoading(true);
                  try {
                    const response = await fetch("/api/time/entries?approved=true&invoiced=false");
                    if (response.ok) {
                      const data = await response.json();
                      setBillableEntries(data?.data?.items || []);
                    }
                  } catch (error) {
                    console.error("❌ Fehler beim Laden der abrechenbaren Zeiten:", error);
                  } finally {
                    setBillableLoading(false);
                  }
                }
              }}
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
              onStop={() => {
                if (currentSession) {
                  handleSessionComplete(currentSession.id, {});
                }
              }}
              onSessionComplete={(duration) => {
                // Wird nach onStop aufgerufen
                console.log(`✅ Session beendet - Dauer: ${duration} Minuten`);
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
                  onClick={async () => {
                    if (confirm(`Möchten Sie wirklich alle ${stats.activeSessions} aktiven Sessions beenden?`)) {
                      try {
                        setLoading(true);
                        const response = await fetch("/api/admin/time-tracking/sessions/close-all", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                        });

                        if (response.ok) {
                          const result = await response.json();
                          alert(`✅ ${result.message || `${result.closedCount} Sessions erfolgreich beendet`}`);
                          
                          // Aktuelle Session zurücksetzen
                          setCurrentSession(null);
                          
                          // Daten neu laden
                          await loadData();
                          
                          // Erfolg loggen
                          kiTracker.logInteraction("Time-Tracking", `Alle ${result.closedCount} Sessions beendet`, "User-Action");
                        } else {
                          const error = await response.json();
                          setError(error.error || "Fehler beim Beenden aller Sessions");
                          kiTracker.logError("Time-Tracking", "Alle Sessions beenden fehlgeschlagen", "API-Call", error.error);
                        }
                      } catch (error) {
                        console.error("❌ Fehler beim Beenden aller Sessions:", error);
                        setError(error instanceof Error ? error.message : "Fehler beim Beenden aller Sessions");
                        kiTracker.logError("Time-Tracking", "Alle Sessions beenden fehlgeschlagen", "API-Call", error instanceof Error ? error.message : "Unbekannter Fehler");
                      } finally {
                        setLoading(false);
                      }
                    }
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
              <div className="space-y-4">
                {/* Projekt (Pflichtfeld) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projekt <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newSession.project_id || ""}
                    onChange={(e) => {
                      const projectId = e.target.value ? parseInt(e.target.value) : undefined;
                      setNewSession({
                        ...newSession,
                        project_id: projectId,
                        task_id: undefined, // Reset Aufgabe wenn Projekt geändert wird
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">
                      {projects.length === 0
                        ? "-- Bitte zuerst Projekt anlegen --"
                        : "-- Projekt auswählen --"}
                    </option>
                    {projects.length === 0 ? (
                      <option value="" disabled>
                        Keine Projekte verfügbar
                      </option>
                    ) : (
                      projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.project_name || project.name || `Projekt ${project.id}`}
                        </option>
                      ))
                    )}
                  </select>
                  {projects.length === 0 && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800 mb-2">
                        ⚠️ Keine Projekte verfügbar. Bitte wähle ein Projekt aus oder lege ein neues an.
                      </p>
                      <button
                        onClick={() => setShowProjectDialog(true)}
                        className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center"
                      >
                        ➕ Neues Projekt anlegen
                      </button>
                    </div>
                  )}
                </div>

                {/* Aufgabe (Pflichtfeld, gefiltert nach Projekt) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aufgabe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newSession.task_id || ""}
                    onChange={(e) => {
                      const taskId = e.target.value ? parseInt(e.target.value) : undefined;
                      setNewSession({
                        ...newSession,
                        task_id: taskId,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!newSession.project_id}
                  >
                    <option value="">
                      {!newSession.project_id
                        ? "-- Bitte zuerst Projekt auswählen --"
                        : "-- Aufgabe auswählen --"}
                    </option>
                    {tasks
                      .filter((task) => !newSession.project_id || task.project_id === newSession.project_id)
                      .length === 0 ? (
                        <option value="" disabled>
                          {!newSession.project_id
                            ? "-- Bitte zuerst Projekt auswählen --"
                            : "Keine Aufgaben für dieses Projekt verfügbar"}
                        </option>
                      ) : (
                        tasks
                          .filter((task) => !newSession.project_id || task.project_id === newSession.project_id)
                          .map((task) => (
                            <option key={task.id} value={task.id}>
                              {task.task_title || task.title || `Aufgabe ${task.id}`}
                            </option>
                          ))
                      )}
                  </select>
                </div>

                {/* Tätigkeit (Pflichtfeld) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tätigkeit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSession.taetigkeit}
                    onChange={(e) => {
                      setNewSession({
                        ...newSession,
                        taetigkeit: e.target.value,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="z.B. API-Routen testen und validieren"
                    minLength={8}
                    maxLength={180}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    8-180 Zeichen, keine technischen Namen (keine .tsx, Component, etc.)
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    // Pflichtfelder-Validierung
                    if (!newSession.project_id) {
                      alert("❌ Bitte Projekt auswählen.");
                      return;
                    }
                    if (!newSession.task_id) {
                      alert("❌ Bitte Aufgabe auswählen.");
                      return;
                    }
                    if (!newSession.taetigkeit || newSession.taetigkeit.trim().length < 8) {
                      alert("❌ Bitte Tätigkeit angeben (mindestens 8 Zeichen).");
                      return;
                    }
                    if (newSession.taetigkeit.length > 180) {
                      alert("❌ Tätigkeit darf maximal 180 Zeichen lang sein.");
                      return;
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
                    const hasTechnicalPattern = technicalPatterns.some((pattern) =>
                      pattern.test(newSession.taetigkeit),
                    );
                    if (hasTechnicalPattern) {
                      alert(
                        "❌ Tätigkeit enthält technische Namen. Bitte verwende verständliche Beschreibungen wie 'API-Routen testen' statt 'Component.tsx'.",
                      );
                      return;
                    }

                    // Session starten
                    handleStartSession();
                  }}
                  disabled={
                    !newSession.project_id ||
                    !newSession.task_id ||
                    !newSession.taetigkeit ||
                    newSession.taetigkeit.trim().length < 8 ||
                    newSession.taetigkeit.length > 180
                  }
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
                  .map((session) => {
                    // Projekt und Aufgabe aus sessions laden (falls verfügbar)
                    const project = projects.find((p) => p.id === session.project_id);
                    const task = tasks.find((t) => t.id === session.task_id);

                    return (
                      <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            {/* Projekt */}
                            {project && (
                              <div className="mb-1">
                                <span className="text-xs font-medium text-gray-500">Projekt:</span>{" "}
                                <span className="text-sm font-semibold text-gray-900">
                                  {project.project_name || project.name || `Projekt ${session.project_id}`}
                                </span>
                              </div>
                            )}
                            {/* Aufgabe */}
                            {task && (
                              <div className="mb-1">
                                <span className="text-xs font-medium text-gray-500">Aufgabe:</span>{" "}
                                <span className="text-sm font-semibold text-gray-900">
                                  {task.task_title || task.title || `Aufgabe ${session.task_id}`}
                                </span>
                              </div>
                            )}
                            {/* Tätigkeit */}
                            <div className="mb-1">
                              <span className="text-xs font-medium text-gray-500">Tätigkeit:</span>{" "}
                              <span className="text-sm text-gray-700">{session.taetigkeit}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
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
                    );
                  })}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Abrechenbar Tab */}
      {activeTab === "billable" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">💰 Abrechenbare Zeiten</h2>
            <button
              onClick={async () => {
                setBillableLoading(true);
                try {
                  const response = await fetch("/api/time/entries?approved=true&invoiced=false");
                  if (response.ok) {
                    const data = await response.json();
                    setBillableEntries(data?.data?.items || []);
                  } else {
                    setError("Fehler beim Laden der abrechenbaren Zeiten");
                  }
                } catch (error) {
                  console.error("❌ Fehler beim Laden der abrechenbaren Zeiten:", error);
                  setError("Fehler beim Laden der abrechenbaren Zeiten");
                } finally {
                  setBillableLoading(false);
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Aktualisieren</span>
            </button>
          </div>

          {billableLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Lade abrechenbare Zeiten...</p>
            </div>
          ) : billableEntries.length === 0 ? (
            <Card className="p-6">
              <p className="text-gray-500 text-center py-8">
                Keine abrechenbaren Zeiten gefunden. (Status: completed, approved=1, invoiced=0)
              </p>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Abrechenbare Zeiteinträge ({billableEntries.length})
                </h3>
                <div className="text-sm text-gray-600">
                  Gesamt: {billableEntries.reduce((sum, e) => sum + (e.duration_minutes || 0), 0)} Min
                  ({Math.round(billableEntries.reduce((sum, e) => sum + (e.duration_minutes || 0), 0) / 60 * 100) / 100} Std)
                </div>
              </div>
              <div className="space-y-3">
                {billableEntries.map((entry: any) => (
                  <div
                    key={entry.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        {/* Rechnungsformat: Projekt: {project_name} – Aufgabe: {task_name} — {taetigkeit} */}
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {entry.project_name && entry.task_title && entry.taetigkeit
                            ? `Projekt: ${entry.project_name} – Aufgabe: ${entry.task_title} — ${entry.taetigkeit}`
                            : entry.taetigkeit || entry.module}
                        </h4>
                        <div className="mt-1 text-sm text-gray-600 space-y-1">
                          {entry.project_name && (
                            <div>
                              <span className="font-medium">Projekt:</span> {entry.project_name}
                            </div>
                          )}
                          {entry.task_title && (
                            <div>
                              <span className="font-medium">Aufgabe:</span> {entry.task_title}
                            </div>
                          )}
                          {entry.taetigkeit && (
                            <div>
                              <span className="font-medium">Tätigkeit:</span> {entry.taetigkeit}
                            </div>
                          )}
                          {entry.order_number && (
                            <div>
                              <span className="font-medium">Auftrag:</span> {entry.order_number}
                            </div>
                          )}
                          {entry.category && (
                            <div>
                              <span className="font-medium">Kategorie:</span> {entry.category}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-green-600">
                          {formatDuration(entry.duration_minutes || 0)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {formatDateTime(entry.start_time)}
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            ✅ Freigegeben
                          </span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            💰 Offen
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
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

      {/* Projekt-Dialog: Automatisch öffnen wenn keine Projekte vorhanden */}
      <Dialog open={showProjectDialog} onClose={() => setShowProjectDialog(false)}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">➕ Neues Projekt anlegen</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kunde <span className="text-red-500">*</span>
              </label>
              <select
                value={newProject.customer_id}
                onChange={(e) =>
                  setNewProject({ ...newProject, customer_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Kunde auswählen --</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company_name || customer.name || `Kunde ${customer.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projektname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newProject.project_name}
                onChange={(e) =>
                  setNewProject({ ...newProject, project_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. Lopez IT Welt"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projektcode (optional)
              </label>
              <input
                type="text"
                value={newProject.project_code}
                onChange={(e) =>
                  setNewProject({ ...newProject, project_code: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. LITW-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung (optional)
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Beschreibung des Projekts"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startdatum (optional)
                </label>
                <input
                  type="date"
                  value={newProject.start_date}
                  onChange={(e) =>
                    setNewProject({ ...newProject, start_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enddatum (optional)
                </label>
                <input
                  type="date"
                  value={newProject.end_date}
                  onChange={(e) =>
                    setNewProject({ ...newProject, end_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowProjectDialog(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              onClick={async () => {
                if (!newProject.customer_id || !newProject.project_name) {
                  alert("❌ Bitte Kunde und Projektname angeben.");
                  return;
                }

                try {
                  const response = await fetch("/api/projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      customer_id: parseInt(newProject.customer_id),
                      project_name: newProject.project_name,
                      project_code: newProject.project_code || null,
                      description: newProject.description || null,
                      start_date: newProject.start_date || null,
                      end_date: newProject.end_date || null,
                      status: newProject.status,
                      created_by: 1,
                    }),
                  });

                  if (response.ok) {
                    const result = await response.json();
                    
                    // Projekte neu laden
                    await loadProjectsOrdersTasks();
                    
                    // Dialog schließen
                    setShowProjectDialog(false);
                    
                    // Projekt automatisch auswählen
                    if (result.data?.id) {
                      setNewSession({
                        ...newSession,
                        project_id: result.data.id,
                      });
                    }

                    // Formular zurücksetzen
                    setNewProject({
                      customer_id: customers.length > 0 ? customers[0].id.toString() : "",
                      project_name: "",
                      project_code: "",
                      description: "",
                      start_date: "",
                      end_date: "",
                      status: "open",
                    });

                    alert("✅ Projekt erfolgreich erstellt und ausgewählt!");
                  } else {
                    const error = await response.json();
                    alert(`❌ Fehler: ${error.error || "Projekt konnte nicht erstellt werden"}`);
                  }
                } catch (error) {
                  console.error("❌ Fehler beim Erstellen des Projekts:", error);
                  alert("❌ Fehler beim Erstellen des Projekts.");
                }
              }}
              disabled={!newProject.customer_id || !newProject.project_name}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Projekt anlegen
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
