/**
 * Monitoring Database Page - Enterprise++ Standard P8-D
 * 
 * Datenbank-Metriken (Connection Pool, Slow Queries, Query Rate)
 */

"use client";

import { useState, useEffect } from "react";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useMonitoringPermissions } from "@/lib/hooks/useMonitoringPermissions";

interface DBHealth {
  score: number;
  status: string;
  issues: string[];
}

interface DBPerformance {
  connectionPoolUsage: number;
  connectionPool: {
    total: number;
    active: number;
    idle: number;
    usage_percent: number;
  };
  slowQueryCount: number;
  avgSlowQueryTime: number;
  queryRate: number;
  replicationLag?: number;
}

export default function MonitoringDBPage() {
  const { canView, loading: permissionsLoading } = useMonitoringPermissions();
  const [health, setHealth] = useState<DBHealth | null>(null);
  const [performance, setPerformance] = useState<DBPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!permissionsLoading && canView()) {
      loadData();
      if (autoRefresh) {
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
      }
    }
  }, [autoRefresh, permissionsLoading, canView]);

  const loadData = async () => {
    try {
      setError(null);
      const response = await fetch("/api/orchestrator/metrics/db");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Laden der DB-Metriken");
      }

      setHealth(data.data.health);
      setPerformance(data.data.performance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der DB-Metriken");
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: string): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case "healthy":
        return "success";
      case "degraded":
        return "warning";
      case "unhealthy":
        return "warning";
      case "critical":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Database Monitoring</h1>
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

      {health && performance && (
        <>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Database Health</h2>
                {health.issues.length > 0 && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {health.issues.length} Issue(s)
                  </p>
                )}
              </div>
              <div className="text-right">
                <StatusBadge status={health.status} variant={getStatusColor(health.status)} />
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{health.score.toFixed(1)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Score (0-100)</p>
              </div>
            </div>

            {health.issues.length > 0 && (
              <div className="mt-4 rounded bg-yellow-50 p-3 dark:bg-yellow-900/20">
                <ul className="list-disc pl-5 text-sm text-yellow-700 dark:text-yellow-300">
                  {health.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Connection Pool Usage</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {performance.connectionPoolUsage.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {performance.connectionPool.active}/{performance.connectionPool.total} active
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Slow Queries</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {performance.slowQueryCount.toFixed(0)}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Query Rate</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {performance.queryRate.toFixed(0)} queries/s
              </p>
            </div>

            {performance.replicationLag !== undefined && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Replication Lag</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {performance.replicationLag.toFixed(0)} ms
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

