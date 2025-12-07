/**
 * Monitoring Queue Page - Enterprise++ Standard P8-D
 * 
 * Queue-Metriken (Depth, Throughput, Wait Time, Processing Time)
 */

"use client";

import { useState, useEffect } from "react";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useMonitoringPermissions } from "@/lib/hooks/useMonitoringPermissions";

interface QueuePerformance {
  depth: number;
  throughput: number;
  avgWaitTime: number;
  avgProcessingTime: number;
  failedTasks: number;
  blocked: boolean;
}

export default function MonitoringQueuePage() {
  const { canView, loading: permissionsLoading } = useMonitoringPermissions();
  const [performance, setPerformance] = useState<QueuePerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!permissionsLoading && canView()) {
      loadPerformance();
      if (autoRefresh) {
        const interval = setInterval(loadPerformance, 10000);
        return () => clearInterval(interval);
      }
    }
  }, [autoRefresh, permissionsLoading, canView]);

  const loadPerformance = async () => {
    try {
      setError(null);
      const response = await fetch("/api/orchestrator/metrics/queue");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Laden der Queue-Metriken");
      }

      setPerformance(data.data.performance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Queue-Metriken");
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

  if (loading && !performance) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Queue & Worker</h1>
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

      {performance && (
        <>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Queue Status</h2>
              <StatusBadge status={performance.blocked ? "blocked" : "active"} variant={performance.blocked ? "error" : "success"} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Queue Depth</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {performance.depth.toFixed(0)}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Throughput</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {performance.throughput.toFixed(1)} tasks/s
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Wait Time</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {performance.avgWaitTime.toFixed(0)} ms
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Failed Tasks</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {performance.failedTasks.toFixed(0)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

