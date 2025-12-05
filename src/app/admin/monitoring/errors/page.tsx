/**
 * Monitoring Errors Page - Enterprise++ Standard E.1.3
 * 
 * Fehlerüberwachung-Seite
 */

"use client";

import { ErrorMonitoringPanel } from "@/components/admin/monitoring/ErrorMonitoringPanel";
import { useMonitoringPermissions } from "@/lib/hooks/useMonitoringPermissions";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

export default function MonitoringErrorsPage() {
  const { canView, loading: permissionsLoading } = useMonitoringPermissions();

  if (permissionsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }

  if (!canView()) {
    return (
      <div className="p-6">
        <ErrorBanner message="Keine Berechtigung: Sie benötigen 'monitoring.view' um diese Seite anzuzeigen." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fehlerüberwachung</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Übersicht über System-Fehler und Fehler-Trends
        </p>
      </div>

      <ErrorMonitoringPanel limit={20} showTrend={true} autoRefresh={true} />
    </div>
  );
}




