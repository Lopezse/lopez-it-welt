/**
 * Monitoring System Page - Enterprise++ Standard P8-D
 * 
 * System-Metriken (CPU, RAM, Disk, Network)
 */

"use client";

import { useState, useEffect } from "react";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useMonitoringPermissions } from "@/lib/hooks/useMonitoringPermissions";

interface Metric {
  id: string;
  metric_id: string;
  metric_name: string;
  value: number;
  unit: string;
  timestamp: string;
}

export default function MonitoringSystemPage() {
  const { canView, loading: permissionsLoading } = useMonitoringPermissions();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!permissionsLoading && canView()) {
      loadMetrics();
      if (autoRefresh) {
        const interval = setInterval(loadMetrics, 10000);
        return () => clearInterval(interval);
      }
    }
  }, [autoRefresh, permissionsLoading, canView]);

  const loadMetrics = async () => {
    try {
      setError(null);
      const response = await fetch("/api/orchestrator/metrics/system?limit=100");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Laden der System-Metriken");
      }

      setMetrics(data.data.metrics || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der System-Metriken");
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

  if (loading && metrics.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Monitoring</h1>
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

      <div className="rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Metrik
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Wert
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Zeitstempel
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {metrics.map((metric) => (
                <tr key={metric.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{metric.metric_name}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {metric.value.toFixed(2)} {metric.unit}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(metric.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

