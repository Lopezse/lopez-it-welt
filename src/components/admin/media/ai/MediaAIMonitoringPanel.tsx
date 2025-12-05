/**
 * Media AI Monitoring Panel Component - Enterprise++ Standard E.1.4
 * 
 * Monitoring-Panel pro Bild: KI-Analyse-Status, Kosten, Performance, Fehler-Logs
 */

"use client";

import { useState, useEffect } from "react";
import { KPICard } from "@/components/orchestrator/uoc/KPICard";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface MediaAIMonitoringPanelProps {
  mediaId: string;
}

interface AIStatus {
  status: "pending" | "analyzing" | "completed" | "error";
  analyzed_at?: string;
  cost?: number;
  analysis_time_ms?: number;
  success_rate?: number;
  error_logs?: Array<{
    timestamp: string;
    message: string;
    severity: "low" | "medium" | "high" | "critical";
  }>;
}

export function MediaAIMonitoringPanel({ mediaId }: MediaAIMonitoringPanelProps) {
  const [status, setStatus] = useState<AIStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
  }, [mediaId]);

  const loadStatus = async () => {
    try {
      setError(null);
      setLoading(true);

      // Versuche spezifischen Endpoint, fallback zu Metrics API
      let response = await fetch(`/api/media/${mediaId}/ai-status`);
      if (!response.ok) {
        // Fallback: Nutze Metrics API mit media_id Filter
        const params = new URLSearchParams({ media_id: mediaId });
        response = await fetch(`/api/orchestrator/metrics/ai-costs?${params.toString()}`);
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Wenn kein spezifischer Status vorhanden, zeige Standard-Status
        setStatus({
          status: "pending",
        });
        return;
      }

      // Mappe API-Response zu AIStatus
      const data = result.data;
      setStatus({
        status: data.status || "pending",
        analyzed_at: data.analyzed_at || data.ai_analyzed_at,
        cost: data.cost || data.total_cost,
        analysis_time_ms: data.analysis_time_ms,
        success_rate: data.success_rate,
        error_logs: data.error_logs || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden des KI-Status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): "green" | "yellow" | "orange" | "red" | "gray" => {
    switch (status) {
      case "completed":
        return "green";
      case "analyzing":
        return "yellow";
      case "error":
        return "red";
      case "pending":
        return "gray";
      default:
        return "gray";
    }
  };

  if (loading && !status) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Lade KI-Status...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message={error} onDismiss={() => setError(null)} />;
  }

  if (!status) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">KI-Monitoring</h2>
        <StatusBadge status={status.status} color={getStatusColor(status.status)} />
      </div>

      {/* KPI-Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="KI-Status"
          value={status.status === "completed" ? "Abgeschlossen" : status.status === "analyzing" ? "Analysiert" : status.status === "error" ? "Fehler" : "Ausstehend"}
          color={getStatusColor(status.status)}
        />
        {status.cost !== undefined && (
          <KPICard
            title="KI-Kosten"
            value={`$${status.cost.toFixed(4)}`}
            color="blue"
          />
        )}
        {status.analysis_time_ms !== undefined && (
          <KPICard
            title="Analyse-Zeit"
            value={`${status.analysis_time_ms}ms`}
            color="green"
          />
        )}
      </div>

      {/* Performance-Metriken */}
      {(status.success_rate !== undefined || status.analysis_time_ms !== undefined) && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance-Metriken
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {status.success_rate !== undefined && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Erfolgsrate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(status.success_rate * 100).toFixed(1)}%
                </p>
              </div>
            )}
            {status.analysis_time_ms !== undefined && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Durchschnittliche Analyse-Zeit</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {status.analysis_time_ms}ms
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fehler-Logs */}
      {status.error_logs && status.error_logs.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Fehler-Logs
          </h3>
          <div className="space-y-2">
            {status.error_logs.map((log, index) => (
              <div
                key={index}
                className="rounded border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900 dark:text-red-300">
                      {format(new Date(log.timestamp), "dd.MM.yyyy HH:mm:ss", { locale: de })}
                    </p>
                    <p className="text-sm text-red-800 dark:text-red-400 mt-1">{log.message}</p>
                  </div>
                  <span
                    className={`ml-4 px-2 py-1 rounded text-xs font-medium ${
                      log.severity === "critical"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        : log.severity === "high"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    }`}
                  >
                    {log.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analyzed At */}
      {status.analyzed_at && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Zuletzt analysiert: {format(new Date(status.analyzed_at), "dd.MM.yyyy HH:mm:ss", { locale: de })}
        </div>
      )}
    </div>
  );
}



