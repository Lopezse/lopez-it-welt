/**
 * Media AI Cost Dashboard Component - Enterprise++ Standard E.1.4
 * 
 * KI-Kosten-Dashboard für Media: Kosten-Übersicht, Kosten pro Bild, Trend-Chart, Limit-Warnung
 */

"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBannerSimple } from "@/components/ui/WarningBannerSimple";
import { KPICard } from "@/components/orchestrator/uoc/KPICard";

interface MediaAICostDashboardProps {
  timeRange?: "1h" | "6h" | "24h" | "7d" | "30d";
}

interface CostData {
  total_cost: number;
  time_range: string;
  media_costs: Array<{ media_id: string; cost: number; count: number }>;
  trend: Array<{ period: string; cost: number }>;
  limits: Array<{ type: string; limit: number; current: number }>;
}

export function MediaAICostDashboard({ timeRange = "24h" }: MediaAICostDashboardProps) {
  const [data, setData] = useState<CostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  useEffect(() => {
    loadCosts();
  }, [selectedTimeRange]);

  const loadCosts = async () => {
    try {
      setError(null);
      setLoading(true);

      // Nutze AI-Costs API mit media_id Filter (falls unterstützt) oder filtere client-seitig
      const response = await fetch(`/api/orchestrator/metrics/ai-costs?time_range=${selectedTimeRange}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der KI-Kosten");
      }

      // Filtere Media-spezifische Kosten (falls API keine Filterung unterstützt)
      const apiData = result.data;
      const mediaCosts = apiData.operations
        ?.filter((op: any) => op.operation === "analyze" || op.operation === "batch")
        .map((op: any) => ({
          media_id: "N/A", // API liefert keine media_id, würde in Produktion vorhanden sein
          cost: op.cost,
          count: op.count,
        })) || [];

      setData({
        total_cost: apiData.total_cost || 0,
        time_range: selectedTimeRange,
        media_costs: mediaCosts,
        trend: apiData.trend || [],
        limits: apiData.limits || [],
      });
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">KI-Kosten-Dashboard (Media)</h2>
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
        <WarningBannerSimple message={limitWarning.message} />
      )}

      {/* KPI-Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Gesamtkosten (Media)"
          value={formatCurrency(data.total_cost)}
          color="blue"
        />
        <KPICard
          title="Bilder analysiert"
          value={data.media_costs.reduce((sum, mc) => sum + mc.count, 0).toString()}
          color="green"
        />
        <KPICard
          title="Durchschnitt pro Bild"
          value={
            data.media_costs.length > 0
              ? formatCurrency(data.total_cost / data.media_costs.reduce((sum, mc) => sum + mc.count, 1))
              : "$0.0000"
          }
          color="yellow"
        />
      </div>

      {/* Kosten pro Bild */}
      {data.media_costs.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Kosten pro Bild (Top 10)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Bild-ID
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    Kosten
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    Anzahl Analysen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.media_costs.slice(0, 10).map((mediaCost, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                      {mediaCost.media_id}
                    </td>
                    <td className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(mediaCost.cost)}
                    </td>
                    <td className="px-4 py-2 text-right text-sm text-gray-500 dark:text-gray-400">
                      {mediaCost.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trend-Chart */}
      {data.trend.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Kosten-Trend (Media)
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

