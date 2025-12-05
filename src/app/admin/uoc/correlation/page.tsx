/**
 * Correlation View Page - Enterprise++ Standard P9
 * 
 * Correlation-View für UOC
 */

"use client";

import { useState, useEffect } from "react";
import { CorrelationView } from "@/components/orchestrator/uoc/CorrelationView";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useSecurityPermissions } from "@/lib/hooks/useSecurityPermissions";
import { useLogsPermissions } from "@/lib/hooks/useLogsPermissions";
import { useMonitoringPermissions } from "@/lib/hooks/useMonitoringPermissions";
import type { CorrelationFilters, CorrelationResult } from "@/lib/ki-orchestrator/level2/uoc/types";

export default function CorrelationViewPage() {
  const [correlations, setCorrelations] = useState<CorrelationResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CorrelationFilters>({
    timeRange: {
      start: new Date(Date.now() - 24 * 3600000),
      end: new Date(),
    },
    minScore: 0.5,
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
      loadCorrelations();
    }
  }, [canView, filters, permissionsLoading]);

  const loadCorrelations = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.timeRange) {
        params.append("timeRange", "24h"); // Vereinfacht
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
      if (filters.minScore !== undefined) {
        params.append("minScore", filters.minScore.toString());
      }
      if (filters.limit) {
        params.append("limit", filters.limit.toString());
      }
      if (filters.offset) {
        params.append("offset", filters.offset.toString());
      }

      const response = await fetch(`/api/orchestrator/uoc/correlations?${params.toString()}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Laden der Korrelationen");
      }

      setCorrelations(data.data?.correlations || []);
      setTotal(data.data?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Korrelationen");
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Correlation View</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Korrelationen zwischen Logs, Metrics und Alerts
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <CorrelationView
        correlations={correlations}
        filters={filters}
        onFilterChange={setFilters}
      />
    </div>
  );
}




