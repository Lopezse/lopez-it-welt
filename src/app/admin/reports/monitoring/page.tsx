"use client";

import { useEffect, useState } from "react";
import { FaServer, FaDatabase, FaChartLine, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface ServerStatus {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  uptime: string;
  status: string;
}

interface APIStatus {
  total_requests: number;
  avg_response_time: number;
  error_rate: number;
  status: string;
}

interface DBStatus {
  connection_count: number;
  query_time: number;
  status: string;
}

export default function MonitoringOverviewPage() {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [apiStatus, setAPIStatus] = useState<APIStatus | null>(null);
  const [dbStatus, setDBStatus] = useState<DBStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    loadMonitoringData();
    const interval = setInterval(loadMonitoringData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/reports/monitoring");
      const result = await response.json();

      if (result.success) {
        setServerStatus(result.data.server_status || null);
        setAPIStatus(result.data.api_status || null);
        setDBStatus(result.data.db_status || null);
        setLastUpdate(result.data.timestamp || "");
      } else {
        setError(result.message || "Fehler beim Laden der Monitoring-Daten");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Monitoring-Daten", err);
      setError("Fehler beim Laden der Monitoring-Daten");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case "warning":
      case "error":
        return <FaExclamationTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <FaExclamationTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  if (loading && !serverStatus) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Monitoring-Übersicht
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Vollständige Monitoring-Übersicht
              </p>
            </div>
            {lastUpdate && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Letzte Aktualisierung: {new Date(lastUpdate).toLocaleString("de-DE")}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorBanner message={error} />}

        {/* Server-Status */}
        {serverStatus && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FaServer className="mr-2" />
                Server-Status
              </h3>
              {getStatusIcon(serverStatus.status)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CPU-Auslastung</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {serverStatus.cpu_usage.toFixed(1)}%
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                    style={{ width: `${serverStatus.cpu_usage}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Speicher-Auslastung</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {serverStatus.memory_usage.toFixed(1)}%
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                    style={{ width: `${serverStatus.memory_usage}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Festplatten-Auslastung</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {serverStatus.disk_usage.toFixed(1)}%
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-yellow-600 dark:bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${serverStatus.disk_usage}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Uptime</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {serverStatus.uptime}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API-Status */}
        {apiStatus && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FaChartLine className="mr-2" />
                API-Status
              </h3>
              {getStatusIcon(apiStatus.status)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gesamt Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {apiStatus.total_requests.toLocaleString("de-DE")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ø Antwortzeit</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {apiStatus.avg_response_time} ms
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fehlerrate</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {apiStatus.error_rate}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DB-Status */}
        {dbStatus && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FaDatabase className="mr-2" />
                Datenbank-Status
              </h3>
              {getStatusIcon(dbStatus.status)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Verbindungen</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dbStatus.connection_count}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Query-Zeit</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dbStatus.query_time} ms
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


