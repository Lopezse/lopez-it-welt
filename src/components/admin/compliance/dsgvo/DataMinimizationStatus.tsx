/**
 * Data Minimization Status Component - Enterprise++ Standard E.2.1
 * 
 * Data-Minimization-Status anzeigen
 */

"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBannerSimple } from "@/components/ui/WarningBannerSimple";
import { logger } from "@/lib/logger";

interface MinimizationData {
  overall_status: "compliant" | "warning" | "critical";
  resources: Array<{
    resource_type: string;
    status: "compliant" | "warning" | "critical";
    data_points: number;
    minimized_data_points: number;
    percentage: number;
  }>;
  trend: Array<{ period: string; percentage: number }>;
  alerts: Array<{
    severity: "low" | "medium" | "high" | "critical";
    message: string;
    resource: string;
  }>;
  last_updated: string;
}

export function DataMinimizationStatus() {
  const [data, setData] = useState<MinimizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMinimizationStatus();
  }, []);

  const loadMinimizationStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/dsgvo/monitoring/data-minimization");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden des Data-Minimization-Status");
      }

      setData(result.data);
    } catch (err) {
      logger.error("Fehler beim Laden des Data-Minimization-Status", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden des Data-Minimization-Status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "compliant": return "text-green-600 dark:text-green-400";
      case "warning": return "text-yellow-600 dark:text-yellow-400";
      case "critical": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBgColor = (status: string): string => {
    switch (status) {
      case "compliant": return "bg-green-100 dark:bg-green-900/20 border-green-500";
      case "warning": return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500";
      case "critical": return "bg-red-100 dark:bg-red-900/20 border-red-500";
      default: return "bg-gray-100 dark:bg-gray-900/20 border-gray-500";
    }
  };

  if (loading && !data) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Data-Minimization-Status...</p>
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
      {/* Status-Übersicht */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data-Minimization-Status</h3>
          <div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getStatusColor(data.overall_status)} mb-2`}>
              {data.overall_status === "compliant" ? "Konform" : data.overall_status === "warning" ? "Warnung" : "Kritisch"}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gesamt-Status: {data.overall_status}
            </p>
          </div>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((alert, index) => (
            <WarningBannerSimple
              key={index}
              message={`[${alert.severity.toUpperCase()}] ${alert.message} (${alert.resource})`}
              className={getStatusBgColor(alert.severity === "critical" ? "critical" : alert.severity === "high" ? "warning" : "compliant")}
            />
          ))}
        </div>
      )}

      {/* Trend-Chart */}
      {data.trend && data.trend.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Minimization-Trend</h3>
            <div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trend}>
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
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563", borderRadius: "0.5rem" }}
                  itemStyle={{ color: "#e5e7eb" }}
                  labelStyle={{ color: "#9ca3af" }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  name="Minimization (%)" 
                />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}

      {/* Resources */}
      {data.resources && data.resources.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <div className="space-y-4">
            {data.resources.map((resource, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{resource.resource_type}</h4>
                  <span className={`font-bold ${getStatusColor(resource.status)}`}>
                    {resource.status === "compliant" ? "Konform" : resource.status === "warning" ? "Warnung" : "Kritisch"}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Datenpunkte:</span>
                    <span className="text-gray-900 dark:text-white">{resource.data_points}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Minimiert:</span>
                    <span className="text-gray-900 dark:text-white">{resource.minimized_data_points}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Prozent:</span>
                    <span className="text-gray-900 dark:text-white">{resource.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        resource.percentage >= 80 ? "bg-green-500" :
                        resource.percentage >= 50 ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${resource.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </Card>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Letzte Aktualisierung: {new Date(data.last_updated).toLocaleString("de-DE")}
      </div>
    </div>
  );
}

