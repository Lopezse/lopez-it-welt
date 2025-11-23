"use client";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import {
  FaBell,
  FaChartLine,
  FaCheckCircle,
  FaClock,
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
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Mock-Daten für Enterprise-Dashboard
      const mockKPIData: KPIData = {
        activeABTests: 2,
        usersOnline: 47,
        conversionRate: 12.4,
        systemStatus: "healthy",
        lastBackup: "vor 2 Stunden",
        supportTickets: 3,
      };

      const mockTrendData: TrendData[] = [
        { date: "2025-09-08", conversion: 8.2, traffic: 1240 },
        { date: "2025-09-09", conversion: 9.1, traffic: 1380 },
        { date: "2025-09-10", conversion: 10.3, traffic: 1520 },
        { date: "2025-09-11", conversion: 11.7, traffic: 1680 },
        { date: "2025-09-12", conversion: 12.1, traffic: 1750 },
        { date: "2025-09-13", conversion: 11.9, traffic: 1690 },
        { date: "2025-09-14", conversion: 12.4, traffic: 1820 },
      ];

      const mockNotifications: Notification[] = [
        {
          id: 1,
          type: "success",
          message: "Backup erfolgreich abgeschlossen",
          timestamp: "vor 2 Stunden",
        },
        {
          id: 2,
          type: "info",
          message: "A/B-Test läuft seit 3 Tagen",
          timestamp: "vor 4 Stunden",
        },
        {
          id: 3,
          type: "warning",
          message: "2 neue Support-Tickets",
          timestamp: "vor 6 Stunden",
        },
        {
          id: 4,
          type: "success",
          message: "System-Update erfolgreich",
          timestamp: "vor 1 Tag",
        },
      ];

      setKpiData(mockKPIData);
      setTrendData(mockTrendData);
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Fehler beim Laden der Dashboard-Daten:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
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
        return <FaCheckCircle className="text-green-500" />;
      case "warning":
        return <FaExclamationTriangle className="text-yellow-500" />;
      case "info":
        return <FaBell className="text-blue-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Enterprise-Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div></div>

            {/* Smart Features */}
            <div className="flex items-center space-x-4">
              {/* Suche */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Springe zu Nutzer / Projekt / Test..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Heute</option>
                <option>7 Tage</option>
                <option>30 Tage</option>
              </select>

              {/* Export */}
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaChartLine className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktive A/B-Tests</p>
                <p className="text-2xl font-bold text-gray-900">{kpiData?.activeABTests}</p>
              </div>
            </div>
          </Card>

          {/* Nutzer online */}
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaUsers className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nutzer online</p>
                <p className="text-2xl font-bold text-gray-900">{kpiData?.usersOnline}</p>
              </div>
            </div>
          </Card>

          {/* Conversion Rate */}
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaCheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{kpiData?.conversionRate}%</p>
              </div>
            </div>
          </Card>

          {/* System Status */}
          <Card className="p-6">
            <div className="flex items-center">
              <div
                className={`p-3 rounded-lg ${getStatusColor(kpiData?.systemStatus || "healthy")}`}
              >
                <FaExclamationTriangle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-lg font-bold">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Conversion Verlauf (7 Tage)
              </h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {trendData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="bg-blue-500 rounded-t w-8 mb-2"
                      style={{ height: `${(data.conversion / 15) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-500">{data.conversion}%</span>
                    <span className="text-xs text-gray-400">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Benachrichtigungen</h3>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.timestamp}</p>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
