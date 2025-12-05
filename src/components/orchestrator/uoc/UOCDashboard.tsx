/**
 * UOC Dashboard Component - Enterprise++ Standard P9
 * 
 * Haupt-Dashboard für Unified Operations Center
 */

"use client";

import { useEffect, useState } from "react";
import { RefreshCw, AlertTriangle, Activity, FileText, Server } from "lucide-react";
import { KPICard } from "./KPICard";
import { UnifiedAlertList } from "./UnifiedAlertList";
import { UnifiedIncidentList } from "./UnifiedIncidentList";
import { UnifiedLogList } from "./UnifiedLogList";
import { SystemHealthCard } from "./SystemHealthCard";
import { APIPerformanceChart } from "./APIPerformanceChart";
import { QueueStatusCard } from "./QueueStatusCard";
import { AICostStatus } from "@/components/admin/monitoring/AICostStatus";
import { APIFrequencyChart } from "@/components/admin/monitoring/APIFrequencyChart";
import { ErrorMonitoringPanel } from "@/components/admin/monitoring/ErrorMonitoringPanel";
import { LiveStreamIndicator } from "./LiveStreamIndicator";
import { UOCFilterBar } from "./UOCFilterBar";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useUOCEventsStream } from "@/lib/hooks/useUOCEventsStream";
import type { UOCFilters } from "@/lib/ki-orchestrator/level2/uoc/types";
import type { Alert, Incident } from "@/lib/ki-orchestrator/level2/types";
import type { BaseMetric, SystemHealth } from "@/lib/telemetry/types";
import type { Log } from "@/lib/ki-orchestrator/level2/logs/types";

interface UOCDashboardProps {
  initialData?: unknown;
  autoRefresh?: boolean;
  refreshInterval?: number;
  filters?: UOCFilters;
  onFilterChange?: (filters: UOCFilters) => void;
}

export function UOCDashboard({
  initialData,
  autoRefresh = true,
  refreshInterval = 5000,
  filters,
  onFilterChange,
}: UOCDashboardProps) {
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.timeRange) {
        params.append("timeRange", "24h"); // Vereinfacht
      }

      const response = await fetch(`/api/orchestrator/uoc/dashboard?${params.toString()}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  // SSE-Streaming für Live-Updates mit Auto-Reconnect
  const {
    isConnected: isLive,
    lastUpdate,
    error: streamError,
  } = useUOCEventsStream({
    enabled: autoRefresh,
    filters: {
      source: filters?.sources?.[0] as any,
      severity: filters?.severities?.[0],
      category: filters?.categories?.[0],
    },
    onAlert: (alert: Alert) => {
      setData((prev: any) => ({
        ...prev,
        alerts: [alert, ...(prev?.alerts || [])].slice(0, 10),
        kpis: {
          ...prev?.kpis,
          alerts_count: (prev?.kpis?.alerts_count || 0) + 1,
        },
      }));
    },
    onMetric: (metric: BaseMetric) => {
      // Update metrics in data
      setData((prev: any) => ({
        ...prev,
        metrics: [metric, ...(prev?.metrics || [])].slice(0, 100),
      }));
    },
    onLog: (log: Log) => {
      setData((prev: any) => ({
        ...prev,
        recent_logs: [log, ...(prev?.recent_logs || [])].slice(0, 10),
        kpis: {
          ...prev?.kpis,
          logs_count: (prev?.kpis?.logs_count || 0) + 1,
        },
      }));
    },
    onHealth: (health: SystemHealth) => {
      setData((prev: any) => ({
        ...prev,
        system_health: health,
        kpis: {
          ...prev?.kpis,
          health_score: health.score,
        },
      }));
    },
    onIncident: (incident: Incident) => {
      setData((prev: any) => ({
        ...prev,
        incidents: [incident, ...(prev?.incidents || [])].slice(0, 5),
        kpis: {
          ...prev?.kpis,
          incidents_count: (prev?.kpis?.incidents_count || 0) + 1,
        },
      }));
    },
  });

  // Show stream error if any
  useEffect(() => {
    if (streamError) {
      console.error("SSE Stream Error:", streamError);
    }
  }, [streamError]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Unified Operations Center
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Zentrale Übersicht aller System-Operationen
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LiveStreamIndicator isConnected={isLive} lastUpdate={lastUpdate} />
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Aktualisieren
          </button>
        </div>
      </div>

      {/* Filter-Bar */}
      {filters && onFilterChange && (
        <UOCFilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          availableCategories={["Security", "API", "Queue", "System", "Orchestrator"]}
          availableSeverities={["info", "warning", "critical"]}
          availableSources={["alerts", "incidents", "logs", "metrics"]}
        />
      )}

      {/* Error-Banner */}
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* KPI-Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Alerts"
          value={data?.kpis?.alerts_count || 0}
          color="red"
          icon={AlertTriangle}
        />
        <KPICard
          title="Incidents"
          value={data?.kpis?.incidents_count || 0}
          color="orange"
          icon={Activity}
        />
        <KPICard
          title="Logs"
          value={data?.kpis?.logs_count || 0}
          color="blue"
          icon={FileText}
        />
        <KPICard
          title="System-Health"
          value={data?.kpis?.health_score || 0}
          color={data?.kpis?.health_score >= 90 ? "green" : data?.kpis?.health_score >= 70 ? "yellow" : "red"}
          icon={Server}
        />
      </div>

      {/* System-Health & Queue-Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data?.system_health && (
          <SystemHealthCard health={data.system_health} autoRefresh={autoRefresh} />
        )}
        {data?.queue_status && (
          <QueueStatusCard queueStatus={data.queue_status} autoRefresh={autoRefresh} />
        )}
      </div>

      {/* API-Performance-Chart */}
      {data?.api_performance && (
        <APIPerformanceChart autoRefresh={autoRefresh} />
      )}

      {/* API-Frequenz-Charts */}
      <APIFrequencyChart
        timeRange="24h"
        showLatency={true}
        showErrorRate={true}
        autoRefresh={autoRefresh}
      />

      {/* Alerts & Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data?.alerts && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Alerts
            </h2>
            <UnifiedAlertList alerts={data.alerts} maxItems={10} />
          </div>
        )}
        {data?.incidents && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Offene Incidents
            </h2>
            <UnifiedIncidentList incidents={data.incidents} maxItems={5} />
          </div>
        )}
      </div>

      {/* Recent Logs */}
      {data?.recent_logs && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Logs
          </h2>
          <UnifiedLogList logs={data.recent_logs} maxItems={10} />
        </div>
      )}

      {/* KI-Kostenstatus */}
      <div>
        <AICostStatus timeRange="24h" showChart={true} autoRefresh={autoRefresh} />
      </div>

      {/* Fehlerüberwachung (kompakt) */}
      <div>
        <ErrorMonitoringPanel limit={10} showTrend={true} autoRefresh={autoRefresh} />
      </div>
    </div>
  );
}

