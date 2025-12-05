/**
 * Monitoring API Performance Page - Enterprise++ Standard P8-D
 * 
 * API-Performance-Metriken (Latenz, Error-Rate, Request-Rate)
 */

"use client";

import { useState, useEffect } from "react";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useMonitoringPermissions } from "@/lib/hooks/useMonitoringPermissions";
import { APIFrequencyChart } from "@/components/admin/monitoring/APIFrequencyChart";

interface APIPerformance {
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorRate: number;
  requestRate: number;
  timeoutRate: number;
}

export default function MonitoringAPIPage() {
  const { canView, loading: permissionsLoading } = useMonitoringPermissions();
  const [performance, setPerformance] = useState<APIPerformance | null>(null);
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
      const response = await fetch("/api/orchestrator/metrics/api-performance");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Laden der API-Performance");
      }

      setPerformance(data.data.performance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der API-Performance");
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Performance</h1>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Latency (P50)</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {performance.p50LatencyMs.toFixed(0)} ms
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">P95 Latency</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {performance.p95LatencyMs.toFixed(0)} ms
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Error Rate</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {performance.errorRate.toFixed(2)}%
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Request Rate</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {performance.requestRate.toFixed(0)} req/s
              </p>
            </div>
          </div>

          {/* API-Frequenz-Charts */}
          <div className="mt-6">
            <APIFrequencyChart
              timeRange="24h"
              showLatency={true}
              showErrorRate={true}
              autoRefresh={autoRefresh}
            />
          </div>
        </>
      )}
    </div>
  );
}

