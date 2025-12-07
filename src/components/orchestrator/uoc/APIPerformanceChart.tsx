/**
 * API Performance Chart Component - Enterprise++ Standard P9
 * 
 * API-Performance-Chart für UOC Dashboard
 */

"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LiveStreamIndicator } from "./LiveStreamIndicator";
import { useUOCMetricsStream } from "@/lib/hooks/useUOCMetricsStream";
import type { APIPerformance, BaseMetric } from "@/lib/telemetry/types";

interface APIPerformanceChartProps {
  metrics?: unknown[];
  timeRange?: "1h" | "6h" | "24h" | "7d";
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface ChartDataPoint {
  timestamp: string;
  latency: number;
  errorRate: number;
  requestRate: number;
}

export function APIPerformanceChart({
  metrics,
  timeRange = "24h",
  autoRefresh = false,
  refreshInterval = 5000,
}: APIPerformanceChartProps) {
  const [apiPerformance, setApiPerformance] = useState<APIPerformance | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Initial load
  useEffect(() => {
    const fetchAPIPerformance = async () => {
      try {
        const response = await fetch("/api/orchestrator/metrics/api-performance", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const perf = data.data || data;
          setApiPerformance(perf);
          setChartData([
            {
              timestamp: new Date().toISOString(),
              latency: perf.avgLatencyMs,
              errorRate: perf.errorRate * 100,
              requestRate: perf.requestRate,
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch API performance", error);
      }
    };

    fetchAPIPerformance();
  }, []);

  // SSE-Streaming für Live-Updates (statt Polling)
  const { isConnected, lastUpdate } = useUOCMetricsStream({
    enabled: autoRefresh,
    filters: {
      category: "api",
    },
    onMetric: (metric: BaseMetric) => {
      // Update chart data with new metric
      if (metric.metric_name.includes("latency") || metric.metric_name.includes("error")) {
        setChartData((prev) => {
          const newData = [
            ...prev,
            {
              timestamp: metric.metric_timestamp.toISOString(),
              latency: metric.metric_name.includes("latency") ? metric.value : prev[prev.length - 1]?.latency || 0,
              errorRate: metric.metric_name.includes("error") ? metric.value : prev[prev.length - 1]?.errorRate || 0,
              requestRate: prev[prev.length - 1]?.requestRate || 0,
            },
          ];
          // Keep last 100 data points
          return newData.slice(-100);
        });
      }
    },
  });

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          API-Performance
        </h3>
        {autoRefresh && <LiveStreamIndicator isConnected={isConnected} lastUpdate={lastUpdate ?? undefined} />}
      </div>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
            <XAxis
              dataKey="timestamp"
              className="text-gray-600 dark:text-gray-400"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis
              yAxisId="left"
              className="text-gray-600 dark:text-gray-400"
              label={{ value: "Latenz (ms)", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              className="text-gray-600 dark:text-gray-400"
              label={{ value: "Error-Rate (%)", angle: 90, position: "insideRight" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
              wrapperClassName="dark:bg-gray-800 dark:border-gray-700"
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="latency"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Latenz (ms)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="errorRate"
              stroke="#ef4444"
              strokeWidth={2}
              name="Error-Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Laden...</p>
        </div>
      )}
    </div>
  );
}

