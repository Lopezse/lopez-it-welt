/**
 * AI Cost Status Component - Enterprise++ Standard E.1.3
 * 
 * KI-Kostenstatus-Widget mit Trend-Chart und Limit-Warnung
 */

"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { KPICard } from "@/components/orchestrator/uoc/KPICard";

interface AICostStatusProps {
  timeRange?: "1h" | "6h" | "24h" | "7d" | "30d";
  showChart?: boolean;
  autoRefresh?: boolean;
}

interface CostData {
  total_cost: number;
  time_range: string;
  providers: Array<{ provider: string; cost: number; count: number }>;
  operations: Array<{ operation: string; cost: number; count: number }>;
  trend: Array<{ period: string; cost: number }>;
  limits: Array<{ type: string; limit: number; current: number }>;
}

export function AICostStatus({
  timeRange = "24h",
  showChart = true,
  autoRefresh = false,
}: AICostStatusProps) {
  const [data, setData] = useState<CostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  useEffect(() => {
    loadCosts();
    if (autoRefresh) {
      const interval = setInterval(loadCosts, 30000); // 30 Sekunden
      return () => clearInterval(interval);
    }
  }, [selectedTimeRange, autoRefresh]);

  const loadCosts = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/orchestrator/metrics/ai-costs?time_range=${selectedTimeRange}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der KI-Kosten");
      }

      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der KI-Kosten");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return `$${value.toFixed(4)}`;
  };

  const checkLimitWarning = (): { warning: boolean; message: string } => {
    if (!data || data.limits.length === 0) {
      return { warning: false, message: "" };
    }

    for (const limit of data.limits) {
      if (limit.limit > 0) {
        const percentage = (limit.current / limit.limit) * 100;
        if (percentage >= 100) {
          return {
            warning: true,
            message: `⚠️ ${limit.type === "daily" ? "Tägliches" : limit.type === "monthly" ? "Monatliches" : "Gesamt"} Limit überschritten: ${formatCurrency(limit.current)} / ${formatCurrency(limit.limit)}`,
          };
        } else if (percentage >= 80) {
          return {
            warning: true,
            message: `⚠️ ${limit.type === "daily" ? "Tägliches" : limit.type === "monthly" ? "Monatliches" : "Gesamt"} Limit fast erreicht: ${formatCurrency(limit.current)} / ${formatCurrency(limit.limit)} (${percentage.toFixed(1)}%)`,
          };
        }
      }
    }

    return { warning: false, message: "" };
  };

  const limitWarning = checkLimitWarning();

  if (loading && !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Lade KI-Kosten...</p>
      </div>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">KI-Kostenstatus</h2>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value as any)}
          className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
        >
          <option value="1h">Letzte Stunde</option>
          <option value="6h">Letzte 6 Stunden</option>
          <option value="24h">Letzte 24 Stunden</option>
          <option value="7d">Letzte 7 Tage</option>
          <option value="30d">Letzte 30 Tage</option>
        </select>
      </div>

      {/* Limit-Warnung */}
      {limitWarning.warning && (
        <div className="rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-4 mb-4">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0"
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
            <p className="text-sm text-yellow-800 dark:text-yellow-300">{limitWarning.message}</p>
          </div>
        </div>
      )}

      {/* KPI-Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Gesamtkosten"
          value={formatCurrency(data.total_cost)}
          color="blue"
        />
        <KPICard
          title="Provider"
          value={data.providers.length.toString()}
          color="green"
        />
        <KPICard
          title="Operationen"
          value={data.operations.reduce((sum, op) => sum + op.count, 0).toString()}
          color="yellow"
        />
      </div>

      {/* Kosten pro Provider */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Kosten pro Provider
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Provider
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                  Kosten
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                  Anzahl
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.providers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Keine Daten verfügbar
                  </td>
                </tr>
              ) : (
                data.providers.map((provider) => (
                  <tr key={provider.provider}>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                      {provider.provider}
                    </td>
                    <td className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(provider.cost)}
                    </td>
                    <td className="px-4 py-2 text-right text-sm text-gray-500 dark:text-gray-400">
                      {provider.count}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trend-Chart */}
      {showChart && data.trend.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Kosten-Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="period"
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Kosten (USD)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

