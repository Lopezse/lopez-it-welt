/**
 * Logs Analytics Page - Enterprise++ Standard P8-E
 * 
 * Analytics-Übersicht (Trends, Patterns, Anomalies)
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useLogsPermissions } from "@/lib/hooks/useLogsPermissions";
import type { Trend, Pattern, Anomaly } from "@/lib/ki-orchestrator/level2/logs/types";

export default function LogsAnalyticsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"hour" | "day" | "week" | "month">("day");

  const { canView, loading: permissionsLoading } = useLogsPermissions();

  useEffect(() => {
    if (!permissionsLoading && canView()) {
      loadAnalytics();
    }
  }, [period, permissionsLoading]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load Trends
      const trendsResponse = await fetch(`/api/orchestrator/logs/analytics/trends?period=${period}`);
      const trendsData = await trendsResponse.json();
      if (trendsData.success) {
        setTrends(trendsData.data.trends || []);
      }

      // Load Patterns
      const patternsResponse = await fetch("/api/orchestrator/logs/analytics/patterns");
      const patternsData = await patternsResponse.json();
      if (patternsData.success) {
        setPatterns(patternsData.data.patterns || []);
      }

      // Load Anomalies
      const anomaliesResponse = await fetch("/api/orchestrator/logs/analytics/anomalies");
      const anomaliesData = await anomaliesResponse.json();
      if (anomaliesData.success) {
        setAnomalies(anomaliesData.data.anomalies || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Analytics");
    } finally {
      setLoading(false);
    }
  };

  if (permissionsLoading || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }

  if (!canView()) {
    return (
      <div className="p-6">
        <ErrorBanner
          message="Sie haben keine Berechtigung, Analytics anzuzeigen. Bitte kontaktieren Sie einen Administrator."
          onDismiss={() => {}}
          errorCode="PERMISSION_DENIED"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Log-Analytics</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Trends, Patterns und Anomalien in System-Logs
            </p>
          </div>
          <Link
            href="/admin/logs"
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Zurück zur Liste
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Period Selector */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Zeitraum
        </label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as "hour" | "day" | "week" | "month")}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
        >
          <option value="hour">Stunde</option>
          <option value="day">Tag</option>
          <option value="week">Woche</option>
          <option value="month">Monat</option>
        </select>
      </div>

      {/* Trends */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Trends</h2>
        {trends.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Keine Trends gefunden</p>
        ) : (
          <div className="space-y-4">
            {trends.map((trend) => (
              <div key={trend.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{trend.metric}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {trend.category} • {trend.trend} • Confidence: {(trend.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Slope: {trend.slope.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      R²: {trend.r_squared.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patterns */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Patterns</h2>
        {patterns.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Keine Patterns gefunden</p>
        ) : (
          <div className="space-y-4">
            {patterns.map((pattern) => (
              <div key={pattern.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{pattern.pattern}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {pattern.pattern_type} • {pattern.category} • Frequency: {pattern.frequency}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Confidence: {(pattern.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Anomalies */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Anomalien</h2>
        {anomalies.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Keine Anomalien gefunden</p>
        ) : (
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {anomaly.metric}: {anomaly.value} (erwartet: {anomaly.expected_value.toFixed(2)})
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {anomaly.anomaly_type} • {anomaly.category} • Z-Score:{" "}
                      {anomaly.z_score?.toFixed(2) || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Confidence: {(anomaly.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}





