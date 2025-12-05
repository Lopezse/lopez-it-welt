/**
 * Monitoring Overview Page - Enterprise++ Standard P8-D
 * 
 * Übersicht über System-Health, CPU, RAM, Error-Rate, Queue-Status
 */

"use client";

import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useMonitoringPermissions } from "@/lib/hooks/useMonitoringPermissions";
import { AICostStatus } from "@/components/admin/monitoring/AICostStatus";
import { ErrorMonitoringPanel } from "@/components/admin/monitoring/ErrorMonitoringPanel";
import type { SystemHealth } from "@/lib/telemetry/types";

export default function MonitoringOverviewPage() {
  const { canView, loading: permissionsLoading } = useMonitoringPermissions();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!permissionsLoading && canView()) {
      loadHealth();
      if (autoRefresh) {
        const interval = setInterval(loadHealth, 10000); // 10 Sekunden
        return () => clearInterval(interval);
      }
    }
  }, [autoRefresh, permissionsLoading, canView]);

  const loadHealth = async () => {
    try {
      setError(null);
      const response = await fetch("/api/orchestrator/metrics/health");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Laden des Health-Status");
      }

      setHealth({
        status: data.data.status,
        score: data.data.score,
        issues: data.data.issues || [],
        metrics_summary: data.data.metrics_summary || {},
        updated_at: new Date(data.data.updated_at),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden des Health-Status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "green";
      case "degraded":
        return "yellow";
      case "unhealthy":
        return "orange";
      case "critical":
        return "red";
      default:
        return "gray";
    }
  };

  if (permissionsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }

  if (!canView()) {
    return (
      <div className="space-y-6">
        <ErrorBanner message="Keine Berechtigung: Sie benötigen 'monitoring.view' um diese Seite anzuzeigen." />
      </div>
    );
  }

  if (loading && !health) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monitoring Overview</h1>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded"
          />
          Auto-Refresh (10s)
        </label>
      </div>

      {error && <ErrorBanner message={error} />}

      {health && (
        <>
          {/* Health Status Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Letzte Aktualisierung: {health.updated_at.toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={health.status} variant={getStatusColor(health.status)} />
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{health.score.toFixed(1)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Score (0-100)</p>
              </div>
            </div>

            {health.issues.length > 0 && (
              <div className="mt-4 rounded bg-yellow-50 p-3 dark:bg-yellow-900/20">
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Issues:</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-yellow-700 dark:text-yellow-300">
                  {health.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Metrics Summary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* CPU Usage */}
            {health.metrics_summary["SYS-001"] !== undefined && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">CPU Usage</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {health.metrics_summary["SYS-001"].toFixed(1)}%
                </p>
              </div>
            )}

            {/* RAM Usage */}
            {health.metrics_summary["SYS-004"] !== undefined && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">RAM Usage</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {health.metrics_summary["SYS-004"].toFixed(1)}%
                </p>
              </div>
            )}

            {/* API Error Rate */}
            {health.metrics_summary["API-005"] !== undefined && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">API Error Rate</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {health.metrics_summary["API-005"].toFixed(2)}%
                </p>
              </div>
            )}

            {/* Queue Depth */}
            {health.metrics_summary["QUEUE-001"] !== undefined && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Queue Depth</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {health.metrics_summary["QUEUE-001"].toFixed(0)}
                </p>
              </div>
            )}
          </div>

          {/* KI-Kostenstatus */}
          <div className="mt-6">
            <AICostStatus timeRange="24h" showChart={true} autoRefresh={autoRefresh} />
          </div>

          {/* Fehlerüberwachung (kompakt) */}
          <div className="mt-6">
            <ErrorMonitoringPanel limit={5} showTrend={false} autoRefresh={autoRefresh} />
          </div>
        </>
      )}
    </div>
  );
}
