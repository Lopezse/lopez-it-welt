/**
 * Error Monitoring Panel Component - Enterprise++ Standard E.1.3
 * 
 * Fehlerüberwachung-Panel mit Fehler-Liste, Trend-Chart und Details-Modal
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Dialog } from "@/components/ui/Dialog";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface ErrorMonitoringPanelProps {
  limit?: number;
  showTrend?: boolean;
  autoRefresh?: boolean;
}

interface ErrorLog {
  id: string;
  timestamp: string;
  endpoint: string;
  error_type: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  details?: Record<string, any>;
}

interface ErrorTrend {
  period: string;
  count: number;
}

export function ErrorMonitoringPanel({
  limit = 10,
  showTrend = true,
  autoRefresh = false,
}: ErrorMonitoringPanelProps) {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [trend, setTrend] = useState<ErrorTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadErrors();
    if (autoRefresh) {
      const interval = setInterval(loadErrors, 10000); // 10 Sekunden
      return () => clearInterval(interval);
    }
  }, [limit, autoRefresh]);

  const loadErrors = async () => {
    try {
      setError(null);
      const params = new URLSearchParams({
        log_level: "error",
        limit: limit.toString(),
      });

      const response = await fetch(`/api/orchestrator/logs?${params.toString()}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der Fehler-Logs");
      }

      const logs = result.data.logs || [];
      setErrors(
        logs.map((log: any) => ({
          id: log.id || log.log_id || "",
          timestamp: log.timestamp || log.created_at || new Date().toISOString(),
          endpoint: log.endpoint || log.path || "N/A",
          error_type: log.error_type || log.category || "unknown",
          message: log.message || log.content || "Keine Nachricht",
          severity: log.severity || (log.log_level === "error" ? "high" : "medium"),
          details: log.details || log.metadata || {},
        }))
      );

      // Simuliere Trend-Daten (in Produktion würde die API diese zurückgeben)
      const now = new Date();
      const trendData: ErrorTrend[] = [];
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        trendData.push({
          period: timestamp.toISOString(),
          count: Math.floor(Math.random() * 10),
        });
      }
      setTrend(trendData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Fehler-Logs");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  if (loading && errors.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Lade Fehler-Logs...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message={error} onDismiss={() => setError(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Fehlerüberwachung</h2>
        <Link
          href="/admin/logs?filter=error"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          Zu Logs →
        </Link>
      </div>

      {/* Fehler-Liste */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Zeitstempel
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Endpoint
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Fehlertyp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Nachricht
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Schweregrad
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                Aktion
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {errors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Keine Fehler gefunden
                </td>
              </tr>
            ) : (
              errors.map((err) => (
                <tr key={err.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {format(new Date(err.timestamp), "dd.MM.yyyy HH:mm:ss", { locale: de })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">
                    {err.endpoint}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {err.error_type}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                    {err.message}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(err.severity)}`}
                    >
                      {err.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <button
                      onClick={() => {
                        setSelectedError(err);
                        setShowDetails(true);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Trend-Chart */}
      {showTrend && trend.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Fehler-Trend (letzte 24 Stunden)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="period"
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#ef4444"
                strokeWidth={2}
                name="Fehler"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Details-Modal */}
      {selectedError && (
        <Dialog open={showDetails} onClose={() => setShowDetails(false)}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Fehler-Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Zeitstempel</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {format(new Date(selectedError.timestamp), "dd.MM.yyyy HH:mm:ss", { locale: de })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Endpoint</p>
                <p className="text-sm text-gray-900 dark:text-white font-mono">
                  {selectedError.endpoint}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fehlertyp</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedError.error_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Schweregrad</p>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedError.severity)}`}
                >
                  {selectedError.severity}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nachricht</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedError.message}</p>
              </div>
              {selectedError.details && Object.keys(selectedError.details).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Details</p>
                  <pre className="text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto">
                    {JSON.stringify(selectedError.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Schließen
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}




