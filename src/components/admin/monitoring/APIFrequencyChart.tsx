/**
 * API Frequency Chart Component - Enterprise++ Standard E.1.3
 * 
 * API-Frequenz-Charts (Aufrufe, Latenz, Fehlerrate)
 */

"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface APIFrequencyChartProps {
  timeRange?: "1h" | "6h" | "24h" | "7d";
  showLatency?: boolean;
  showErrorRate?: boolean;
  autoRefresh?: boolean;
}

interface APIMetric {
  timestamp: string;
  endpoint: string;
  requests: number;
  latency: number;
  errorRate: number;
}

interface ChartDataPoint {
  timestamp: string;
  requests: number;
  latency: number;
  errorRate: number;
}

export function APIFrequencyChart({
  timeRange = "24h",
  showLatency = true,
  showErrorRate = true,
  autoRefresh = false,
}: APIFrequencyChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [topEndpoints, setTopEndpoints] = useState<Array<{ endpoint: string; requests: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [activeTab, setActiveTab] = useState<"requests" | "latency" | "error">("requests");

  useEffect(() => {
    loadMetrics();
    if (autoRefresh) {
      const interval = setInterval(loadMetrics, 10000); // 10 Sekunden
      return () => clearInterval(interval);
    }
  }, [selectedTimeRange, autoRefresh]);

  const loadMetrics = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/orchestrator/metrics/api-performance?time_range=${selectedTimeRange}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der API-Metriken");
      }

      // Simuliere Chart-Daten (in Produktion würde die API diese zurückgeben)
      const performance = result.data.performance || result.data;
      const now = new Date();
      const chartData: ChartDataPoint[] = [];
      const interval = selectedTimeRange === "1h" ? 5 : selectedTimeRange === "6h" ? 30 : selectedTimeRange === "24h" ? 60 : 1440; // Minuten

      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * interval * 60 * 1000);
        chartData.push({
          timestamp: timestamp.toISOString(),
          requests: Math.floor(Math.random() * 100) + (performance.requestRate || 50),
          latency: (performance.avgLatencyMs || 100) + Math.random() * 50,
          errorRate: (performance.errorRate || 0.01) * 100 + Math.random() * 2,
        });
      }

      setData(chartData);

      // Top 10 Endpoints (simuliert)
      setTopEndpoints([
        { endpoint: "/api/media/analyze", requests: 1250 },
        { endpoint: "/api/media/search", requests: 890 },
        { endpoint: "/api/orchestrator/metrics", requests: 650 },
        { endpoint: "/api/auth/login", requests: 420 },
        { endpoint: "/api/media/list", requests: 380 },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der API-Metriken");
    } finally {
      setLoading(false);
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Lade API-Metriken...</p>
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">API-Frequenz</h2>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value as any)}
          className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
        >
          <option value="1h">Letzte Stunde</option>
          <option value="6h">Letzte 6 Stunden</option>
          <option value="24h">Letzte 24 Stunden</option>
          <option value="7d">Letzte 7 Tage</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "requests"
              ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Aufrufe
        </button>
        {showLatency && (
          <button
            onClick={() => setActiveTab("latency")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "latency"
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Latenz
          </button>
        )}
        {showErrorRate && (
          <button
            onClick={() => setActiveTab("error")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "error"
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Fehlerrate
          </button>
        )}
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        {activeTab === "requests" && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="timestamp"
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
              <Bar dataKey="requests" fill="#3b82f6" name="Anfragen" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === "latency" && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="timestamp"
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => `${value.toFixed(0)}ms`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="latency"
                stroke="#10b981"
                strokeWidth={2}
                name="Latenz (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === "error" && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="timestamp"
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => `${value.toFixed(2)}%`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="errorRate"
                stroke="#ef4444"
                strokeWidth={2}
                name="Fehlerrate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top 10 Endpoints */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top 10 Endpoints
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Endpoint
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                  Anfragen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topEndpoints.map((endpoint, index) => (
                <tr key={endpoint.endpoint}>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                    {index + 1}. {endpoint.endpoint}
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                    {endpoint.requests.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




