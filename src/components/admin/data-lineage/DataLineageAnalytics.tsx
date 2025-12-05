/**
 * Data Lineage Analytics Component - Enterprise++ Standard E.2.6
 * 
 * Analytics-Dashboard, Trend-Charts und Anomalie-Erkennung
 */

"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBannerSimple } from "@/components/ui/WarningBannerSimple";
import { logger } from "@/lib/logger";
import { FaChartLine, FaExclamationTriangle } from "react-icons/fa";

interface AnalyticsData {
  total_nodes: number;
  nodes_by_type: Array<{ type: string; count: number }>;
  nodes_by_resource_type: Array<{ resource_type: string; count: number }>;
  edges_by_relationship: Array<{ relationship_type: string; count: number }>;
  events_timeline: Array<{ period: string; count: number }>;
  anomalies: Array<{ severity: "low" | "medium" | "high" | "critical"; message: string; node_id: string }>;
}

export function DataLineageAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/data-lineage/analytics");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der Analytics");
      }

      setData(result.data);
    } catch (err) {
      logger.error("Fehler beim Laden der Data Lineage Analytics", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Analytics...</p>
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

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];

  return (
    <div className="space-y-6">
      {/* Übersicht */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaChartLine className="mr-2" />
            Analytics-Übersicht
          </h3>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {data.total_nodes}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gesamt Nodes</p>
          </div>
        </div>
      </Card>

      {/* Anomalien */}
      {data.anomalies && data.anomalies.length > 0 && (
        <div className="space-y-2">
          {data.anomalies.map((anomaly, index) => (
            <WarningBannerSimple
              key={index}
              message={`[${anomaly.severity.toUpperCase()}] ${anomaly.message} (Node: ${anomaly.node_id})`}
              className={
                anomaly.severity === "critical" ? "bg-red-100 dark:bg-red-900/20 border-red-500" :
                anomaly.severity === "high" ? "bg-orange-100 dark:bg-orange-900/20 border-orange-500" :
                anomaly.severity === "medium" ? "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500" :
                "bg-blue-100 dark:bg-blue-900/20 border-blue-500"
              }
            />
          ))}
        </div>
      )}

      {/* Nodes nach Typ */}
      {data.nodes_by_type && data.nodes_by_type.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nodes nach Typ</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.nodes_by_type}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.nodes_by_type.map((entry, index) => (
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

      {/* Nodes nach Ressourcen-Typ */}
      {data.nodes_by_resource_type && data.nodes_by_resource_type.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nodes nach Ressourcen-Typ</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.nodes_by_resource_type}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                <XAxis 
                  dataKey="resource_type" 
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
                <Bar dataKey="count" fill="#3b82f6" name="Anzahl" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Events-Timeline */}
      {data.events_timeline && data.events_timeline.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Events-Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.events_timeline}>
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
                  formatter={(value: number) => value.toString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  name="Events" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Edges nach Beziehung */}
      {data.edges_by_relationship && data.edges_by_relationship.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Beziehungen nach Typ</h3>
            <div className="space-y-2">
              {data.edges_by_relationship.map((edge, index) => (
                <div key={index} className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <span className="font-medium text-gray-900 dark:text-white">{edge.relationship_type}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{edge.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}



