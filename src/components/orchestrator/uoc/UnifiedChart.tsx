/**
 * Unified Chart Component - Enterprise++ Standard P9
 * 
 * Unified Chart für verschiedene Chart-Typen (Line, Bar, Area)
 */

"use client";

import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface UnifiedChartProps {
  data: unknown[];
  type: "line" | "bar" | "area";
  xKey: string;
  yKey: string;
  title?: string;
  xLabel?: string;
  yLabel?: string;
  color?: string;
}

export function UnifiedChart({
  data,
  type,
  xKey,
  yKey,
  title,
  xLabel,
  yLabel,
  color = "#3b82f6",
}: UnifiedChartProps) {
  const chartData = data as Array<Record<string, unknown>>;

  const commonProps = {
    data: chartData,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        {type === "line" ? (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
            <XAxis
              dataKey={xKey}
              className="text-gray-600 dark:text-gray-400"
              label={xLabel ? { value: xLabel, position: "insideBottom", offset: -5 } : undefined}
            />
            <YAxis
              className="text-gray-600 dark:text-gray-400"
              label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft" } : undefined}
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
            <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} />
          </LineChart>
        ) : type === "bar" ? (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
            <XAxis
              dataKey={xKey}
              className="text-gray-600 dark:text-gray-400"
              label={xLabel ? { value: xLabel, position: "insideBottom", offset: -5 } : undefined}
            />
            <YAxis
              className="text-gray-600 dark:text-gray-400"
              label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft" } : undefined}
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
            <Bar dataKey={yKey} fill={color} />
          </BarChart>
        ) : (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
            <XAxis
              dataKey={xKey}
              className="text-gray-600 dark:text-gray-400"
              label={xLabel ? { value: xLabel, position: "insideBottom", offset: -5 } : undefined}
            />
            <YAxis
              className="text-gray-600 dark:text-gray-400"
              label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft" } : undefined}
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
            <Area type="monotone" dataKey={yKey} stroke={color} fill={color} fillOpacity={0.6} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}




