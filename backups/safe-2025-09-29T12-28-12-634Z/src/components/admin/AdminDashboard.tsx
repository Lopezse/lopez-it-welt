"use client";

import { useEffect, useState } from "react";
import SupportWidget from "./SupportWidget";

interface DashboardData {
  // KPI-Karten
  openTickets: number;
  activeSessions: number;
  revenue: number;
  newCustomers: number;
  systemLoad: number;

  // Server-Status
  serverStatus: {
    web: "online" | "offline";
    database: "online" | "offline";
    mail: "online" | "offline";
    cpu: number;
    ram: number;
    disk: number;
  };

  // Aktivitäten
  recentActivities: Array<{
    id: number;
    type: "ticket" | "session" | "order" | "user";
    message: string;
    time: string;
    priority: "low" | "medium" | "high";
  }>;

  // Alarme
  alerts: Array<{
    id: number;
    type: "warning" | "error" | "info";
    message: string;
    time: string;
  }>;

  // Backup-Status
  backupStatus: {
    lastBackup: string;
    nextBackup: string;
    status: "success" | "error" | "running";
  };
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Mock-Daten für das Dashboard
    const mockData: DashboardData = {
      openTickets: 12,
      activeSessions: 3,
      revenue: 15420,
      newCustomers: 8,
      systemLoad: 67,

      serverStatus: {
        web: "online",
        database: "online",
        mail: "online",
        cpu: 45,
        ram: 62,
        disk: 78,
      },

      recentActivities: [
        {
          id: 1,
          type: "ticket",
          message: "Neues Support-Ticket #1234 erstellt",
          time: "vor 5 Min",
          priority: "high",
        },
        {
          id: 2,
          type: "session",
          message: "Zeiterfassung-Session gestartet",
          time: "vor 12 Min",
          priority: "low",
        },
        {
          id: 3,
          type: "order",
          message: "Neue Bestellung #5678 eingegangen",
          time: "vor 23 Min",
          priority: "medium",
        },
        {
          id: 4,
          type: "user",
          message: "Neuer Benutzer registriert",
          time: "vor 45 Min",
          priority: "low",
        },
      ],

      alerts: [
        {
          id: 1,
          type: "warning",
          message: "Festplattenplatz wird knapp (78% belegt)",
          time: "vor 1 Std",
        },
        {
          id: 2,
          type: "info",
          message: "System-Update verfügbar",
          time: "vor 2 Std",
        },
      ],

      backupStatus: {
        lastBackup: "2025-06-27 02:00",
        nextBackup: "2025-06-28 02:00",
        status: "success",
      },
    };

    setDashboardData(mockData);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-hauptblau border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute -inset-1 bg-hauptblau rounded-full blur opacity-25 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau flex items-center justify-center">
        <div className="text-center">
          <div className="text-rot text-xl mb-2">⚠️</div>
          <p className="text-rot">Fehler beim Laden des Dashboards</p>
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
                Willkommen zurück, Admin
              </h1>
              <p className="text-hellgrau text-lg">Hier ist Ihre Übersicht für heute</p>
            </div>
            <div className="text-right">
              <div className="backdrop-blur-sm bg-weiss/10 rounded-xl p-4 border border-weiss/20">
                <p className="text-sm text-hellgrau mb-1">Systemzeit</p>
                <p className="text-xl font-semibold text-weiss">{currentTime || "Lade..."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI-Karten */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="group backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl hover:bg-weiss/20 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-hellgrau mb-1">Offene Tickets</p>
                <p className="text-3xl font-bold text-weiss">{dashboardData.openTickets}</p>
              </div>
              <div className="relative p-4 bg-gradient-to-r from-rot to-orange rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-weiss"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="absolute -inset-1 bg-gradient-to-r from-rot to-orange rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
              </div>
            </div>
          </div>

          <div className="group backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl hover:bg-weiss/20 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-hellgrau mb-1">Server-Status</p>
                <p className="text-3xl font-bold text-gruen">Online</p>
              </div>
              <div className="relative p-4 bg-gradient-to-r from-gruen to-akzentblau rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-weiss"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="absolute -inset-1 bg-gradient-to-r from-gruen to-akzentblau rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
              </div>
            </div>
          </div>

          <div className="group backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl hover:bg-weiss/20 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-hellgrau mb-1">Letztes Backup</p>
                <p className="text-3xl font-bold text-akzentblau">Heute 02:00</p>
              </div>
              <div className="relative p-4 bg-gradient-to-r from-hauptblau to-akzentblau rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-weiss"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div className="absolute -inset-1 bg-gradient-to-r from-hauptblau to-akzentblau rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
              </div>
            </div>
          </div>

          <div className="group backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl hover:bg-weiss/20 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-hellgrau mb-1">Umsatz (€)</p>
                <p className="text-3xl font-bold text-gelb">
                  {dashboardData.revenue.toLocaleString()}
                </p>
              </div>
              <div className="relative p-4 bg-gradient-to-r from-gelb to-orange rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-weiss"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <div className="absolute -inset-1 bg-gradient-to-r from-gelb to-orange rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
              </div>
            </div>
          </div>

          <div className="group backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl hover:bg-weiss/20 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-hellgrau mb-1">Neue Kunden</p>
                <p className="text-3xl font-bold text-orange-400">{dashboardData.newCustomers}</p>
              </div>
              <div className="relative p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-weiss"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Widget */}
        <div className="mb-6">
          <SupportWidget />
        </div>

        {/* Monitoring & Alarme - 3 Spalten */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Server-Status */}
          <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-weiss mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Server-Status
            </h3>
            <div className="space-y-4">
              {[
                {
                  name: "Web-Server",
                  status: dashboardData.serverStatus.web,
                  icon: "🌐",
                },
                {
                  name: "Datenbank",
                  status: dashboardData.serverStatus.database,
                  icon: "🗄️",
                },
                {
                  name: "Mail-Server",
                  status: dashboardData.serverStatus.mail,
                  icon: "📧",
                },
              ].map((server, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 backdrop-blur-sm bg-weiss/5 rounded-xl border border-weiss/10"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{server.icon}</span>
                    <span className="text-hellgrau">{server.name}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      server.status === "online"
                        ? "bg-gruen-500/20 text-gruen-400 border border-gruen-500/30"
                        : "bg-rot-500/20 text-rot-400 border border-rot-500/30"
                    }`}
                  >
                    {server.status === "online" ? "Online" : "Offline"}
                  </span>
                </div>
              ))}

              {/* Performance Bars */}
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-hellgrau">CPU-Auslastung</span>
                  <span className="text-weiss font-medium">{dashboardData.serverStatus.cpu}%</span>
                </div>
                <div className="w-full bg-weiss/10 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      dashboardData.serverStatus.cpu > 80
                        ? "bg-gradient-to-r from-rot to-orange"
                        : dashboardData.serverStatus.cpu > 60
                          ? "bg-gradient-to-r from-orange-500 to-red-500"
                          : "bg-gradient-to-r from-gruen to-akzentblau"
                    }`}
                    style={{ width: `${dashboardData.serverStatus.cpu}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Security-Übersicht für Angriffe */}
          <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-weiss mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-rot"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Security-Übersicht
            </h3>
            <div className="space-y-4">
              {/* Angriffs-Statistiken */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 backdrop-blur-sm bg-rot/10 rounded-xl border border-rot/20">
                  <div className="text-2xl font-bold text-rot">24</div>
                  <div className="text-sm text-hellgrau">Angriffe heute</div>
                </div>
                <div className="text-center p-4 backdrop-blur-sm bg-gelb/10 rounded-xl border border-gelb/20">
                  <div className="text-2xl font-bold text-gelb">3</div>
                  <div className="text-sm text-hellgrau">Blockiert</div>
                </div>
              </div>

              {/* Letzte Angriffe */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-weiss">Letzte Angriffe</h4>
                {[
                  {
                    time: "vor 5 Min",
                    type: "DDoS",
                    ip: "192.168.1.100",
                    status: "blocked",
                  },
                  {
                    time: "vor 12 Min",
                    type: "SQL Injection",
                    ip: "10.0.0.50",
                    status: "blocked",
                  },
                  {
                    time: "vor 23 Min",
                    type: "Brute Force",
                    ip: "172.16.0.25",
                    status: "failed",
                  },
                  {
                    time: "vor 45 Min",
                    type: "XSS Attempt",
                    ip: "203.0.113.10",
                    status: "blocked",
                  },
                ].map((attack, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 backdrop-blur-sm bg-weiss/5 rounded-xl border border-weiss/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${attack.status === "blocked" ? "bg-gruen" : "bg-rot"}`}
                      ></div>
                      <div>
                        <p className="text-sm text-weiss font-medium">{attack.type}</p>
                        <p className="text-xs text-hellgrau">{attack.ip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-hellgrau">{attack.time}</p>
                      <p
                        className={`text-xs font-medium ${attack.status === "blocked" ? "text-gruen" : "text-rot"}`}
                      >
                        {attack.status === "blocked" ? "Blockiert" : "Fehlgeschlagen"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Firewall-Status */}
              <div className="mt-6 p-4 backdrop-blur-sm bg-gruen/10 rounded-xl border border-gruen/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gruen rounded-full animate-pulse"></div>
                    <span className="text-gruen font-medium">Firewall aktiv</span>
                  </div>
                  <span className="text-xs text-hellgrau">Schutz aktiv</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alarme */}
          <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-weiss mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              Aktuelle Alarme
            </h3>
            <div className="space-y-3">
              {dashboardData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                    alert.type === "error"
                      ? "bg-rot-500/10 border-rot-500/30"
                      : alert.type === "warning"
                        ? "bg-orange-500/10 border-orange-500/30"
                        : "bg-hauptblau-500/10 border-hauptblau-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-weiss font-medium">{alert.message}</p>
                      <p className="text-hellgrau text-sm mt-1">{alert.time}</p>
                    </div>
                    <span
                      className={`text-2xl ${
                        alert.type === "error"
                          ? "text-rot-400"
                          : alert.type === "warning"
                            ? "text-orange-400"
                            : "text-hauptblau-400"
                      }`}
                    >
                      {alert.type === "error" ? "🚨" : alert.type === "warning" ? "⚠️" : "ℹ️"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Aktivitäten & Schnellzugriffe */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Letzte Aktivitäten */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-weiss mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-gelb"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Letzte Aktivitäten
            </h3>
            <div className="space-y-3">
              {dashboardData.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 backdrop-blur-sm bg-weiss/5 rounded-xl border border-weiss/10 hover:bg-weiss/10 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        activity.priority === "high"
                          ? "bg-rot animate-pulse"
                          : activity.priority === "medium"
                            ? "bg-orange-400"
                            : "bg-gruen"
                      }`}
                    ></div>
                    <div>
                      <p className="text-weiss font-medium">{activity.message}</p>
                      <p className="text-hellgrau text-sm">{activity.time}</p>
                    </div>
                  </div>
                  <span
                    className={`text-2xl ${
                      activity.type === "ticket"
                        ? "🎫"
                        : activity.type === "session"
                          ? "⏱️"
                          : activity.type === "order"
                            ? "📦"
                            : "👤"
                    }`}
                  ></span>
                </div>
              ))}
            </div>
          </div>

          {/* Schnellzugriffe */}
          <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-weiss mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              Schnellzugriffe
            </h3>
            <div className="space-y-3">
              {[
                {
                  name: "Monitoring",
                  href: "/admin/monitoring",
                  icon: "📊",
                  gradient: "from-hauptblau to-akzentblau",
                },
                {
                  name: "Backups",
                  href: "/admin/backups",
                  icon: "💾",
                  gradient: "from-gruen to-akzentblau",
                },
                {
                  name: "Benutzer",
                  href: "/admin/users",
                  icon: "👥",
                  gradient: "from-gelb to-orange",
                },
                {
                  name: "Zeiterfassung",
                  href: "/admin/time-tracking",
                  icon: "⏰",
                  gradient: "from-orange-500 to-red-500",
                },
                {
                  name: "Shop-Admin",
                  href: "/admin/shop",
                  icon: "🛒",
                  gradient: "from-rot to-rot",
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="group block p-4 backdrop-blur-sm bg-weiss/5 rounded-xl border border-weiss/10 hover:bg-weiss/10 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`relative p-2 rounded-lg bg-gradient-to-r ${item.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="absolute -inset-1 bg-gradient-to-r from-weiss/20 to-transparent rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-weiss font-medium group-hover:text-cyan-400 transition-colors">
                      {item.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
