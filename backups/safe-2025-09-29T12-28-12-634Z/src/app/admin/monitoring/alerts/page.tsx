"use client";

import { useEffect, useState } from "react";

interface Alert {
  id: string;
  type: "system" | "security" | "performance" | "backup" | "network";
  severity: "info" | "warning" | "error" | "critical";
  title: string;
  description: string;
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
  source: string;
  priority: number;
}

interface AlertStats {
  total: number;
  active: number;
  acknowledged: number;
  resolved: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AlertStats>({
    total: 0,
    active: 0,
    acknowledged: 0,
    resolved: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "critical" | "unacknowledged">("all");

  useEffect(() => {
    // Mock-Daten für Alerts
    const mockAlerts: Alert[] = [
      {
        id: "1",
        type: "security",
        severity: "critical",
        title: "Kritischer Sicherheitsvorfall",
        description: "Mehrere fehlgeschlagene Login-Versuche von verdächtiger IP-Adresse erkannt",
        timestamp: "2025-01-27 15:30:22",
        status: "active",
        source: "Firewall-System",
        priority: 1,
      },
      {
        id: "2",
        type: "performance",
        severity: "error",
        title: "Hohe CPU-Auslastung",
        description: 'CPU-Auslastung auf Server "web-01" übersteigt 90%',
        timestamp: "2025-01-27 15:25:15",
        status: "acknowledged",
        source: "Performance-Monitor",
        priority: 2,
      },
      {
        id: "3",
        type: "system",
        severity: "warning",
        title: "Festplattenspeicher wird knapp",
        description: "Nur noch 15% freier Speicherplatz auf /var/log",
        timestamp: "2025-01-27 15:20:08",
        status: "active",
        source: "System-Monitor",
        priority: 3,
      },
      {
        id: "4",
        type: "backup",
        severity: "error",
        title: "Backup-Fehler",
        description: "Tägliches Backup konnte nicht abgeschlossen werden",
        timestamp: "2025-01-27 15:15:45",
        status: "active",
        source: "Backup-System",
        priority: 2,
      },
      {
        id: "5",
        type: "network",
        severity: "warning",
        title: "Netzwerk-Latenz erhöht",
        description: "Durchschnittliche Antwortzeit über 200ms",
        timestamp: "2025-01-27 15:10:30",
        status: "resolved",
        source: "Network-Monitor",
        priority: 3,
      },
      {
        id: "6",
        type: "security",
        severity: "info",
        title: "Neue Firewall-Regel hinzugefügt",
        description: "Automatische Blockierung von verdächtigem Traffic",
        timestamp: "2025-01-27 15:05:12",
        status: "resolved",
        source: "Security-System",
        priority: 4,
      },
    ];

    const mockStats: AlertStats = {
      total: mockAlerts.length,
      active: mockAlerts.filter((a) => a.status === "active").length,
      acknowledged: mockAlerts.filter((a) => a.status === "acknowledged").length,
      resolved: mockAlerts.filter((a) => a.status === "resolved").length,
      critical: mockAlerts.filter((a) => a.severity === "critical").length,
      high: mockAlerts.filter((a) => a.severity === "error").length,
      medium: mockAlerts.filter((a) => a.severity === "warning").length,
      low: mockAlerts.filter((a) => a.severity === "info").length,
    };

    setAlerts(mockAlerts);
    setStats(mockStats);
    setLoading(false);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-rot";
      case "error":
        return "text-orange";
      case "warning":
        return "text-gelb";
      case "info":
        return "text-akzentblau";
      default:
        return "text-hellgrau";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-rot/20 border-rot/30";
      case "error":
        return "bg-orange/20 border-orange/30";
      case "warning":
        return "bg-gelb/20 border-gelb/30";
      case "info":
        return "bg-akzentblau/20 border-akzentblau/30";
      default:
        return "bg-hellgrau/20 border-hellgrau/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "security":
        return "🛡️";
      case "performance":
        return "⚡";
      case "system":
        return "🖥️";
      case "backup":
        return "💾";
      case "network":
        return "🌐";
      default:
        return "⚠️";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-rot";
      case "acknowledged":
        return "text-gelb";
      case "resolved":
        return "text-gruen";
      default:
        return "text-hellgrau";
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    switch (filter) {
      case "active":
        return alert.status === "active";
      case "critical":
        return alert.severity === "critical";
      case "unacknowledged":
        return alert.status !== "acknowledged";
      default:
        return true;
    }
  });

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: "acknowledged" as const } : alert,
      ),
    );
  };

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, status: "resolved" as const } : alert)),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-hauptblau border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute -inset-1 bg-hauptblau rounded-full blur opacity-25 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-akzentblau rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gelb rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-orange rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-weiss to-hellgrau bg-clip-text text-transparent mb-2">
                Alarme & Warnungen
              </h1>
              <p className="text-hellgrau text-lg">
                System-Alarme und Benachrichtigungen verwalten
              </p>
            </div>
            <div className="text-right">
              <div className="backdrop-blur-sm bg-weiss/10 rounded-xl p-4 border border-weiss/20">
                <p className="text-sm text-hellgrau mb-1">Aktive Alarme</p>
                <p className="text-2xl font-bold text-rot">{stats.active}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl text-center">
            <div className="text-3xl font-bold text-rot mb-2">{stats.critical}</div>
            <div className="text-sm text-hellgrau">Kritisch</div>
          </div>
          <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl text-center">
            <div className="text-3xl font-bold text-orange mb-2">{stats.high}</div>
            <div className="text-sm text-hellgrau">Hoch</div>
          </div>
          <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl text-center">
            <div className="text-3xl font-bold text-gelb mb-2">{stats.medium}</div>
            <div className="text-sm text-hellgrau">Mittel</div>
          </div>
          <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl text-center">
            <div className="text-3xl font-bold text-akzentblau mb-2">{stats.low}</div>
            <div className="text-sm text-hellgrau">Niedrig</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-weiss">Alert-Filter</h2>
            <div className="flex space-x-2">
              {[
                { key: "all", label: "Alle", count: stats.total },
                { key: "active", label: "Aktiv", count: stats.active },
                { key: "critical", label: "Kritisch", count: stats.critical },
                {
                  key: "unacknowledged",
                  label: "Nicht bestätigt",
                  count: stats.active + stats.acknowledged,
                },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() =>
                    setFilter(filterOption.key as "all" | "active" | "critical" | "unacknowledged")
                  }
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filter === filterOption.key
                      ? "bg-akzentblau text-weiss shadow-lg"
                      : "bg-weiss/10 text-hellgrau hover:bg-weiss/20"
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-weiss mb-6">Alert-Liste</h2>
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-xl text-hellgrau">Keine Alarme gefunden</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="backdrop-blur-sm bg-weiss/5 rounded-xl border border-weiss/10 p-6 hover:bg-weiss/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <span className="text-3xl">{getTypeIcon(alert.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-weiss">{alert.title}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityBg(alert.severity)} ${getSeverityColor(alert.severity)}`}
                          >
                            {alert.severity.toUpperCase()}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(alert.status)}`}
                          >
                            {alert.status === "active"
                              ? "Aktiv"
                              : alert.status === "acknowledged"
                                ? "Bestätigt"
                                : "Gelöst"}
                          </span>
                        </div>
                        <p className="text-hellgrau mb-3">{alert.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-hellgrau">
                          <span>Quelle: {alert.source}</span>
                          <span>Zeit: {alert.timestamp}</span>
                          <span>Priorität: {alert.priority}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {alert.status === "active" && (
                        <>
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-4 py-2 bg-gelb text-dunkelgrau rounded-lg font-medium hover:bg-gelb/80 transition-colors"
                          >
                            Bestätigen
                          </button>
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="px-4 py-2 bg-gruen text-weiss rounded-lg font-medium hover:bg-gruen/80 transition-colors"
                          >
                            Lösen
                          </button>
                        </>
                      )}
                      {alert.status === "acknowledged" && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-4 py-2 bg-gruen text-weiss rounded-lg font-medium hover:bg-gruen/80 transition-colors"
                        >
                          Lösen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alert Settings */}
        <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-weiss mb-6">Benachrichtigungseinstellungen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-weiss">E-Mail-Benachrichtigungen</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded text-akzentblau" />
                  <span className="text-hellgrau">Kritische Alarme</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded text-akzentblau" />
                  <span className="text-hellgrau">Hohe Priorität</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded text-akzentblau" />
                  <span className="text-hellgrau">Mittlere Priorität</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded text-akzentblau" />
                  <span className="text-hellgrau">Niedrige Priorität</span>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-weiss">SMS-Benachrichtigungen</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded text-akzentblau" />
                  <span className="text-hellgrau">Nur kritische Alarme</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded text-akzentblau" />
                  <span className="text-hellgrau">24/7 Benachrichtigungen</span>
                </label>
              </div>
              <div className="pt-4">
                <button className="w-full bg-akzentblau text-weiss py-3 rounded-lg font-medium hover:bg-akzentblau/80 transition-colors">
                  Einstellungen speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
