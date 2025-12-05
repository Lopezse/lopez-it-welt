/**
 * Audit Log Analytics Component - Enterprise++ Standard E.2.3
 * 
 * Analytics-Dashboard für Audit-Logs mit Trend-Charts und Anomalie-Erkennung
 */

"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBannerSimple } from "@/components/ui/WarningBannerSimple";
import { logger } from "@/lib/logger";

interface AnalyticsData {
  trends: Array<{ period: string; count: number; severity_breakdown: Record<string, number> }>;
  actions: Array<{ action: string; count: number }>;
  compliance_categories: Array<{ category: string; count: number }>;
  anomalies: Array<{ id: string; timestamp: string; action: string; severity: string; message: string }>;
  summary: {
    total_logs: number;
    critical_count: number;
    high_count: number;
    medium_count: number;
    low_count: number;
  };
}

export function AuditLogAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/audit-logs/analytics?time_range=${timeRange}`, {
        credentials: "include", // Wichtig: Cookies mit senden
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unbekannter Fehler" }));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: Fehler beim Laden der Analytics-Daten`);
      }
      
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message || "Fehler beim Laden der Analytics-Daten");
      }

      setData(result.data);
    } catch (err) {
      console.error("❌ Fehler beim Laden der Audit-Log-Analytics:", err);
      logger.error("Fehler beim Laden der Audit-Log-Analytics", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Analytics-Daten");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  if (loading && !data) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Analytics-Daten...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return <ErrorBanner message={error} onDismiss={() => setError(null)} />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Zeitraum-Auswahl */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics-Dashboard</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="7d">Letzte 7 Tage</option>
              <option value="30d">Letzte 30 Tage</option>
              <option value="90d">Letzte 90 Tage</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Zusammenfassung */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gesamt</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.summary.total_logs}</div>
          </div>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kritisch</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{data.summary.critical_count}</div>
          </div>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hoch</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.summary.high_count}</div>
          </div>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mittel</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{data.summary.medium_count}</div>
          </div>
        </Card>
      </div>

      {/* Anomalien */}
      {data.anomalies && data.anomalies.length > 0 && (
        <div className="space-y-2">
          {data.anomalies.map((anomaly) => (
            <WarningBannerSimple
              key={anomaly.id}
              message={`[${anomaly.severity}] ${anomaly.message} (${anomaly.action})`}
              className="bg-red-100 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200"
            />
          ))}
        </div>
      )}

      {/* Trend-Chart */}
      {data.trends && data.trends.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                <XAxis 
                  dataKey="period" 
                  stroke="#6b7280" 
                  tick={{ fill: "#6b7280" }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                />
                <YAxis 
                  stroke="#6b7280" 
                  tick={{ fill: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563", borderRadius: "0.5rem" }}
                  itemStyle={{ color: "#e5e7eb" }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  name="Anzahl" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Aktionen-Chart */}
      {data.actions && data.actions.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top-Aktionen</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.actions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                <XAxis 
                  dataKey="action" 
                  stroke="#6b7280" 
                  tick={{ fill: "#6b7280" }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  tick={{ fill: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563", borderRadius: "0.5rem" }}
                  itemStyle={{ color: "#e5e7eb" }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Compliance-Kategorien-Chart */}
      {data.compliance_categories && data.compliance_categories.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compliance-Kategorien</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.compliance_categories}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.compliance_categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563", borderRadius: "0.5rem" }}
                  itemStyle={{ color: "#e5e7eb" }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}



