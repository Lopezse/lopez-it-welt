"use client";

import { useEffect, useState } from "react";
import { FaChartLine, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface QualityMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  target_value?: number;
  category: string;
  measured_at: string;
  version?: string;
}

export function QualityMetrics() {
  const [metrics, setMetrics] = useState<QualityMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filterCategory) params.append("category", filterCategory);
      const response = await fetch(`/api/admin/quality/metrics?${params.toString()}`, {
        credentials: "include", // Wichtig: Cookies mit senden
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unbekannter Fehler" }));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: Fehler beim Laden der Metriken`);
      }

      const result = await response.json();

      if (result.success) {
        setMetrics(result.data || []);
      } else {
        setError(result.message || result.error || "Fehler beim Laden der Metriken");
      }
    } catch (err) {
      console.error("❌ Fehler beim Laden der Qualitäts-Metriken:", err);
      logger.error("Fehler beim Laden der Qualitäts-Metriken", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Metriken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [filterCategory]);

  const getMetricStatus = (metric: QualityMetric) => {
    if (metric.target_value === null || metric.target_value === undefined) {
      return "unknown";
    }
    if (metric.metric_value >= metric.target_value) {
      return "good";
    }
    if (metric.metric_value >= metric.target_value * 0.8) {
      return "warning";
    }
    return "bad";
  };

  const categories = Array.from(new Set(metrics.map((m) => m.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FaChartLine className="mr-2" />
            Qualitäts-Metriken
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Übersicht über Qualitäts-Metriken
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Kategorie-Filter */}
      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategorie filtern
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Alle Kategorien --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Metriken-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const status = getMetricStatus(metric);
          return (
            <div
              key={metric.id}
              className={`bg-white dark:bg-gray-800 border rounded-lg p-4 ${
                status === "good"
                  ? "border-green-200 dark:border-green-800"
                  : status === "warning"
                    ? "border-yellow-200 dark:border-yellow-800"
                    : status === "bad"
                      ? "border-red-200 dark:border-red-800"
                      : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {metric.metric_name}
                </h4>
                {status === "good" && (
                  <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                )}
                {status === "warning" && (
                  <FaExclamationTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                )}
                {status === "bad" && (
                  <FaExclamationTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.metric_value}
                {metric.metric_unit && <span className="text-sm ml-1">{metric.metric_unit}</span>}
              </div>
              {metric.target_value !== null && metric.target_value !== undefined && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Ziel: {metric.target_value}
                  {metric.metric_unit && <span className="ml-1">{metric.metric_unit}</span>}
                </div>
              )}
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {new Date(metric.measured_at).toLocaleString("de-DE")}
              </div>
            </div>
          );
        })}
      </div>

      {metrics.length === 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Keine Metriken gefunden. Metriken werden automatisch erfasst.
          </p>
        </div>
      )}
    </div>
  );
}
