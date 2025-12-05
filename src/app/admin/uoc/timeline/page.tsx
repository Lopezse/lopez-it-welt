/**
 * Timeline View Page - Enterprise++ Standard P9
 * 
 * Timeline-View für UOC
 */

"use client";

import { useState, useEffect } from "react";
import { TimelineView } from "@/components/orchestrator/uoc/TimelineView";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useSecurityPermissions } from "@/lib/hooks/useSecurityPermissions";
import { useLogsPermissions } from "@/lib/hooks/useLogsPermissions";
import { useMonitoringPermissions } from "@/lib/hooks/useMonitoringPermissions";
import type { TimelineFilters, TimelineEvent } from "@/lib/ki-orchestrator/level2/uoc/types";

export default function TimelineViewPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TimelineFilters>({
    timeRange: {
      start: new Date(Date.now() - 3600000), // Letzte Stunde
      end: new Date(),
    },
    limit: 100,
    offset: 0,
  });

  const { canView: canViewSecurity, loading: securityLoading } = useSecurityPermissions();
  const { canView: canViewLogs, loading: logsLoading } = useLogsPermissions();
  const { canView: canViewMonitoring, loading: monitoringLoading } = useMonitoringPermissions();

  // RBAC: Mindestens eine Berechtigung erforderlich
  const canView = canViewSecurity() || canViewLogs() || canViewMonitoring();
  const permissionsLoading = securityLoading || logsLoading || monitoringLoading;

  useEffect(() => {
    if (!permissionsLoading && canView) {
      loadTimeline();
    }
  }, [canView, filters, permissionsLoading]);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.timeRange) {
        params.append("startTime", filters.timeRange.start.toISOString());
        params.append("endTime", filters.timeRange.end.toISOString());
      }
      if (filters.categories && filters.categories.length > 0) {
        params.append("category", filters.categories[0]);
      }
      if (filters.severities && filters.severities.length > 0) {
        params.append("severity", filters.severities[0]);
      }
      if (filters.sources && filters.sources.length > 0) {
        params.append("source", filters.sources[0]);
      }
      if (filters.limit) {
        params.append("limit", filters.limit.toString());
      }
      if (filters.offset) {
        params.append("offset", filters.offset.toString());
      }

      const response = await fetch(`/api/orchestrator/uoc/timeline?${params.toString()}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Laden der Timeline");
      }

      setEvents(data.data?.events || []);
      setTotal(data.data?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Timeline");
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

  if (!canView) {
    return (
      <div className="p-6">
        <ErrorBanner
          message="Keine Berechtigung: Sie benötigen mindestens eine der folgenden Berechtigungen: 'monitoring.view', 'logs.view' oder 'security.view'"
          errorCode="PERMISSION_DENIED"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timeline View</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Chronologische Übersicht aller Events (Logs, Alerts, Metrics, Incidents)
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <TimelineView events={events} filters={filters} onFilterChange={setFilters} />
    </div>
  );
}




