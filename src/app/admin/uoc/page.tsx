/**
 * UOC Dashboard Page - Enterprise++ Standard P9
 * 
 * Unified Operations Center Dashboard
 */

"use client";

import { useState, useEffect } from "react";
import { UOCDashboard } from "@/components/orchestrator/uoc/UOCDashboard";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useSecurityPermissions } from "@/lib/hooks/useSecurityPermissions";
import { useLogsPermissions } from "@/lib/hooks/useLogsPermissions";
import { useMonitoringPermissions } from "@/lib/hooks/useMonitoringPermissions";
import type { UOCFilters } from "@/lib/ki-orchestrator/level2/uoc/types";

export default function UOCDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UOCFilters>({
    timeRange: {
      start: new Date(Date.now() - 24 * 3600000),
      end: new Date(),
    },
  });

  const { canView: canViewSecurity, loading: securityLoading } = useSecurityPermissions();
  const { canView: canViewLogs, loading: logsLoading } = useLogsPermissions();
  const { canView: canViewMonitoring, loading: monitoringLoading } = useMonitoringPermissions();

  // RBAC: Mindestens eine Berechtigung erforderlich
  const canView = canViewSecurity() || canViewLogs() || canViewMonitoring();
  const permissionsLoading = securityLoading || logsLoading || monitoringLoading;

  useEffect(() => {
    if (!permissionsLoading && canView) {
      setLoading(false);
    }
  }, [permissionsLoading, canView]);

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Unified Operations Center
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Zentrale Übersicht aller System-Operationen (Alerts, Incidents, Logs, Metrics)
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <UOCDashboard
        autoRefresh={true}
        refreshInterval={5000}
        filters={filters}
        onFilterChange={setFilters}
      />
    </div>
  );
}




