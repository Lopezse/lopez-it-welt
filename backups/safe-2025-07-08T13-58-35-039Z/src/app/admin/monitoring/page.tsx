"use client";

import { useEffect, useState } from "react";

interface MonitoringData {
  servers: Array<{
    id: string;
    name: string;
    status: "online" | "offline" | "warning";
    cpu: number;
    ram: number;
    disk: number;
    uptime: string;
    lastCheck: string;
  }>;
  logs: Array<{
    id: number;
    timestamp: string;
    level: "info" | "warning" | "error" | "debug";
    message: string;
    source: string;
  }>;
  performance: {
    cpu: number;
    ram: number;
    disk: number;
    network: {
      in: number;
      out: number;
    };
  };
  alerts: Array<{
    id: number;
    type: "warning" | "error" | "info";
    message: string;
    timestamp: string;
    severity: "low" | "medium" | "high";
  }>;
}

export default function MonitoringPage() {
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("servers");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Mock-Daten für Monitoring
    const mockData: MonitoringData = {
      servers: [
        {
          id: "web-01",
          name: "Web-Server",
          status: "online",
          cpu: 45,
          ram: 62,
          disk: 78,
          uptime: "15 Tage, 3 Std",
          lastCheck: "vor 30 Sek",
        },
        {
          id: "db-01",
          name: "Datenbank-Server",
          status: "online",
          cpu: 23,
          ram: 45,
          disk: 34,
          uptime: "12 Tage, 7 Std",
          lastCheck: "vor 30 Sek",
        },
        {
          id: "mail-01",
          name: "Mail-Server",
          status: "warning",
          cpu: 89,
          ram: 78,
          disk: 92,
          uptime: "8 Tage, 12 Std",
          lastCheck: "vor 30 Sek",
        },
      ],
      logs: [
        {
          id: 1,
          timestamp: "2025-06-27 12:45:23",
          level: "info",
          message: "Backup erfolgreich abgeschlossen",
          source: "backup-service",
        },
        {
          id: 2,
          timestamp: "2025-06-27 12:44:15",
          level: "warning",
          message: "Festplattenplatz wird knapp (92% belegt)",
          source: "disk-monitor",
        },
        {
          id: 3,
          timestamp: "2025-06-27 12:43:42",
          level: "error",
          message: "Datenbankverbindung fehlgeschlagen",
          source: "database",
        },
        {
          id: 4,
          timestamp: "2025-06-27 12:42:18",
          level: "info",
          message: "Neuer Benutzer registriert",
          source: "auth-service",
        },
      ],
      performance: {
        cpu: 52,
        ram: 68,
        disk: 78,
        network: {
          in: 1250,
          out: 890,
        },
      },
      alerts: [
        {
          id: 1,
          type: "warning",
          message: "Mail-Server CPU-Auslastung hoch (89%)",
          timestamp: "vor 5 Min",
          severity: "medium",
        },
        {
          id: 2,
          type: "error",
          message: "Festplattenplatz kritisch (92% belegt)",
          timestamp: "vor 15 Min",
          severity: "high",
        },
        {
          id: 3,
          type: "info",
          message: "System-Update verfügbar",
          timestamp: "vor 1 Std",
          severity: "low",
        },
      ],
    };

    setMonitoringData(mockData);
    setLoading(false);
  }, []);

  // Client-seitige Zeit-Updates
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString("de-DE"));
    };

    // Initial setzen
    updateTime();

    // Jede Sekunde aktualisieren
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center p-8">Lade Monitoring-Daten...</div>;
  }

  if (!monitoringData) {
    return (
      <div className="text-center p-8 text-red-600">Fehler beim Laden der Monitoring-Daten</div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-100";
      case "offline":
        return "text-red-600 bg-red-100";
      case "warning":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-600 bg-red-50";
      case "warning":
        return "text-orange-600 bg-orange-50";
      case "info":
        return "text-blue-600 bg-blue-50";
      case "debug":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-orange-50 border-orange-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System-Monitoring</h1>
            <p className="text-gray-600 mt-1">Überwachung aller Systemkomponenten</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Letzte Aktualisierung</p>
              <p className="text-lg font-semibold text-gray-900">{currentTime}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Aktualisieren
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              {
                id: "servers",
                name: "Server-Status",
                icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
              },
              {
                id: "logs",
                name: "System-Logs",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              },
              {
                id: "performance",
                name: "Performance",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              },
              {
                id: "alerts",
                name: "Alarme",
                icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Server-Status Tab */}
          {activeTab === "servers" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {monitoringData.servers.map((server) => (
                  <div key={server.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}
                      >
                        {server.status === "online"
                          ? "Online"
                          : server.status === "offline"
                            ? "Offline"
                            : "Warnung"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CPU</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                server.cpu > 80
                                  ? "bg-red-500"
                                  : server.cpu > 60
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${server.cpu}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{server.cpu}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">RAM</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                server.ram > 80
                                  ? "bg-red-500"
                                  : server.ram > 60
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${server.ram}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{server.ram}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Festplatte</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                server.disk > 80
                                  ? "bg-red-500"
                                  : server.disk > 60
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${server.disk}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{server.disk}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Uptime: {server.uptime}</span>
                        <span>Letzte Prüfung: {server.lastCheck}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System-Logs Tab */}
          {activeTab === "logs" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">System-Logs</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option>Alle Level</option>
                    <option>Error</option>
                    <option>Warning</option>
                    <option>Info</option>
                    <option>Debug</option>
                  </select>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                    Export
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg border border-gray-200">
                {monitoringData.logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 border-b border-gray-200 last:border-b-0 ${getLevelColor(log.level)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium uppercase">{log.level}</span>
                          <span className="text-xs text-gray-500">{log.source}</span>
                        </div>
                        <p className="text-sm text-gray-900">{log.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 ml-4">{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">CPU-Auslastung</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">
                        {monitoringData.performance.cpu}%
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            monitoringData.performance.cpu > 80
                              ? "bg-red-500"
                              : monitoringData.performance.cpu > 60
                                ? "bg-orange-500"
                                : "bg-blue-500"
                          }`}
                          style={{
                            width: `${monitoringData.performance.cpu}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">RAM-Auslastung</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-green-600">
                        {monitoringData.performance.ram}%
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            monitoringData.performance.ram > 80
                              ? "bg-red-500"
                              : monitoringData.performance.ram > 60
                                ? "bg-orange-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${monitoringData.performance.ram}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Festplattenplatz</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-orange-600">
                        {monitoringData.performance.disk}%
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            monitoringData.performance.disk > 80
                              ? "bg-red-500"
                              : monitoringData.performance.disk > 60
                                ? "bg-orange-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${monitoringData.performance.disk}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Netzwerk</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Download:</span>
                      <span className="font-medium text-green-600">
                        {monitoringData.performance.network.in} MB/s
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Upload:</span>
                      <span className="font-medium text-blue-600">
                        {monitoringData.performance.network.out} MB/s
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alarme Tab */}
          {activeTab === "alerts" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Aktuelle Alarme</h3>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                  Alle als gelesen markieren
                </button>
              </div>

              <div className="space-y-3">
                {monitoringData.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              alert.severity === "high"
                                ? "bg-red-100 text-red-800"
                                : alert.severity === "medium"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {alert.severity === "high"
                              ? "Hoch"
                              : alert.severity === "medium"
                                ? "Mittel"
                                : "Niedrig"}
                          </span>
                          <span className="text-xs text-gray-500">{alert.type}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-xs text-gray-500">{alert.timestamp}</span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
