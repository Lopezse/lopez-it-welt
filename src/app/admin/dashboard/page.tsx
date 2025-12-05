"use client";
import { RoleBasedDashboard } from "@/components/admin/dashboard/RoleBasedDashboard";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import {
  FaBell,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaCog,
  FaDownload,
  FaExclamationTriangle,
  FaFileInvoice,
  FaProjectDiagram,
  FaSearch,
  FaTools,
  FaUsers,
} from "react-icons/fa";

interface KPIData {
  activeABTests: number;
  usersOnline: number;
  conversionRate: number;
  systemStatus: "healthy" | "warning" | "error";
  lastBackup: string;
  supportTickets: number;
}

interface TrendData {
  date: string;
  conversion: number;
  traffic: number;
}

interface Notification {
  id: number;
  type: "success" | "warning" | "info";
  message: string;
  timestamp: string;
}

export default function EnterpriseDashboard() {
  // Initial mit Fallback-Daten, damit kein Flash auftritt
  const [kpiData, setKpiData] = useState<KPIData>({
    activeABTests: 0,
    usersOnline: 0,
    conversionRate: 0,
    systemStatus: "healthy",
    lastBackup: "Wird geladen...",
    supportTickets: 0,
  });
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false); // Starte nicht im Loading-State
  const [useRoleBasedDashboard, setUseRoleBasedDashboard] = useState(false); // Standard-Dashboard als Fallback

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Leise im Hintergrund laden, ohne Loading-State
      const response = await fetch("/api/admin/dashboard/data", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Dashboard-Daten");
      }

      const data = await response.json();

      // Daten sanft aktualisieren
      if (data.kpis) {
        setKpiData(data.kpis);
      }
      if (data.trends) {
        setTrendData(data.trends);
      }
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Dashboard-Daten:", error);
      // Bei Fehler Fallback-Daten behalten (werden bereits angezeigt)
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return { color: "#24a148", backgroundColor: "#1a1d24" };
      case "warning":
        return { color: "#f1c21b", backgroundColor: "#1a1d24" };
      case "error":
        return { color: "#da1e28", backgroundColor: "#1a1d24" };
      default:
        return { color: "#b3b3b3", backgroundColor: "#1a1d24" };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "healthy":
        return "Alle Systeme OK";
      case "warning":
        return "Warnung";
      case "error":
        return "Fehler";
      default:
        return "Unbekannt";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <FaCheckCircle style={{ color: "#24a148" }} />;
      case "warning":
        return <FaExclamationTriangle style={{ color: "#f1c21b" }} />;
      case "info":
        return <FaBell style={{ color: "#0043ce" }} />;
      default:
        return <FaBell style={{ color: "#b3b3b3" }} />;
    }
  };

  // Loading-State entfernt - Dashboard zeigt sofort Fallback-Daten an
  // Daten werden im Hintergrund geladen und sanft aktualisiert

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050509" }}>
      {/* Toggle für Rollen-basiertes Dashboard */}
      <div className="border-b" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setUseRoleBasedDashboard(!useRoleBasedDashboard)}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={useRoleBasedDashboard ? {
                  backgroundColor: "#ffd700",
                  color: "#050509"
                } : {
                  backgroundColor: "#272a33",
                  color: "#b3b3b3"
                }}
                onMouseEnter={(e) => {
                  if (!useRoleBasedDashboard) {
                    e.currentTarget.style.backgroundColor = "#3a3d47";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!useRoleBasedDashboard) {
                    e.currentTarget.style.backgroundColor = "#272a33";
                  }
                }}
              >
                {useRoleBasedDashboard ? "Rollen-Dashboard" : "Standard-Dashboard"}
              </button>
              {useRoleBasedDashboard && (
                <a
                  href="/admin/dashboard/config"
                  className="px-4 py-2 rounded-md hover:bg-[#1f2329] flex items-center space-x-2 text-sm transition-colors"
                  style={{ backgroundColor: "#272a33", color: "#b3b3b3" }}
                >
                  <FaCog className="h-4 w-4" />
                  <span>Konfigurieren</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {useRoleBasedDashboard ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RoleBasedDashboard autoRefresh={true} refreshInterval={30000} />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="border-b" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div></div>

                {/* Smart Features */}
                <div className="flex items-center space-x-4">
                  {/* Suche */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#8a8a8a" }} />
                    <input
                      type="text"
                      placeholder="Springe zu Nutzer / Projekt / Test..."
                      className="pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-[#ffd700] focus:border-transparent"
                      style={{
                        backgroundColor: "#1a1d24",
                        borderColor: "#272a33",
                        color: "#f4f4f4",
                        border: "1px solid #272a33"
                      }}
                    />
                  </div>

                  {/* Filter */}
                  <select
                    className="px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#ffd700]"
                    style={{
                      backgroundColor: "#1a1d24",
                      borderColor: "#272a33",
                      color: "#f4f4f4",
                      border: "1px solid #272a33"
                    }}
                  >
                    <option>Heute</option>
                    <option>7 Tage</option>
                    <option>30 Tage</option>
                  </select>

                  {/* Export */}
                  <button
                    className="flex items-center px-4 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: "#ffd700", color: "#050509" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ffed4e"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffd700"}
                  >
                    <FaDownload className="mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Aktive A/B-Tests */}
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: "#1a1d24" }}>
                    <FaChartLine className="h-6 w-6" style={{ color: "#ffd700" }} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: "#b3b3b3" }}>Aktive A/B-Tests</p>
                    <p className="text-2xl font-bold" style={{ color: "#f4f4f4" }}>{kpiData?.activeABTests ?? 0}</p>
                  </div>
                </div>
              </Card>

              {/* Nutzer online */}
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: "#1a1d24" }}>
                    <FaUsers className="h-6 w-6" style={{ color: "#24a148" }} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: "#b3b3b3" }}>Nutzer online</p>
                    <p className="text-2xl font-bold" style={{ color: "#f4f4f4" }}>{kpiData?.usersOnline ?? 0}</p>
                  </div>
                </div>
              </Card>

              {/* Conversion Rate */}
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: "#1a1d24" }}>
                    <FaCheckCircle className="h-6 w-6" style={{ color: "#ffd700" }} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: "#b3b3b3" }}>Conversion Rate</p>
                    <p className="text-2xl font-bold" style={{ color: "#f4f4f4" }}>{kpiData?.conversionRate ?? 0}%</p>
                  </div>
                </div>
              </Card>

              {/* System Status */}
              <Card className="p-6">
                <div className="flex items-center">
                  <div
                    className="p-3 rounded-lg"
                    style={getStatusColor(kpiData?.systemStatus || "healthy")}
                  >
                    <FaExclamationTriangle className="h-6 w-6" style={{ color: getStatusColor(kpiData?.systemStatus || "healthy").color }} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: "#b3b3b3" }}>System Status</p>
                    <p className="text-lg font-bold" style={{ color: "#f4f4f4" }}>
                      {getStatusText(kpiData?.systemStatus || "healthy")}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Conversion Verlauf */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
                    Conversion Verlauf (7 Tage)
                  </h3>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {trendData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="rounded-t w-8 mb-2"
                          style={{
                            height: `${(data.conversion / 15) * 200}px`,
                            backgroundColor: "#ffd700"
                          }}
                        ></div>
                        <span className="text-xs" style={{ color: "#b3b3b3" }}>{data.conversion}%</span>
                        <span className="text-xs" style={{ color: "#8a8a8a" }}>
                          {new Date(data.date).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Benachrichtigungen */}
              <div className="lg:col-span-1">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>Benachrichtigungen</h3>
                  <div className="space-y-3">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-start space-x-3 p-3 rounded-lg"
                          style={{ backgroundColor: "#1a1d24" }}
                        >
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <p className="text-sm" style={{ color: "#f4f4f4" }}>{notification.message}</p>
                            <p className="text-xs" style={{ color: "#8a8a8a" }}>{notification.timestamp}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm" style={{ color: "#b3b3b3" }}>Keine neuen Benachrichtigungen.</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            {/* Module Kacheln */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Module</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Projekte */}
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FaProjectDiagram className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Projekte</h4>
                    <p className="text-sm text-gray-600">Projektverwaltung und Übersicht</p>
                  </div>
                </Card>

                {/* IT-Support */}
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FaTools className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">IT-Support</h4>
                    <p className="text-sm text-gray-600">Support-Tickets und Monitoring</p>
                  </div>
                </Card>

                {/* Zeiterfassung */}
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FaClock className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Zeiterfassung</h4>
                    <p className="text-sm text-gray-600">Zeiterfassung und Analytics</p>
                  </div>
                </Card>

                {/* Rechnungen */}
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FaFileInvoice className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Rechnungen</h4>
                    <p className="text-sm text-gray-600">Rechnungsverwaltung und Abrechnung</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* A/B-Testing Quick Access */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">A/B-Testing</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Aktive Tests</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {kpiData?.activeABTests} aktiv
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Verwalten Sie Ihre A/B-Tests und analysieren Sie die Ergebnisse.
                  </p>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                    Zu A/B-Testing
                  </button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">System Status</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(kpiData?.systemStatus || "healthy")}`}
                    >
                      {getStatusText(kpiData?.systemStatus || "healthy")}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">Letztes Backup: {kpiData?.lastBackup}</p>
                  <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700">
                    System-Übersicht
                  </button>
                </Card>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
