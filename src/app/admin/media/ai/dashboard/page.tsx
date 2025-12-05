/**
 * Media AI Dashboard Page - Enterprise++ Standard E.1.4
 * 
 * KI-Kosten-Dashboard für Media mit Performance-Metriken
 */

"use client";

import { useState } from "react";
import { MediaAICostDashboard } from "@/components/admin/media/ai/MediaAICostDashboard";
import { MediaAIPerformanceCharts } from "@/components/admin/media/ai/MediaAIPerformanceCharts";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useMonitoringPermissions } from "@/lib/hooks/useMonitoringPermissions";

export default function MediaAIDashboardPage() {
  const { canView, loading: permissionsLoading } = useMonitoringPermissions();
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h" | "7d" | "30d">("24h");

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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media-KI Dashboard</h1>
      </div>

      {/* KI-Kosten-Dashboard */}
      <MediaAICostDashboard timeRange={timeRange} />

      {/* Performance-Metriken-Charts */}
      <MediaAIPerformanceCharts timeRange={timeRange === "30d" ? "7d" : timeRange} />
    </div>
  );
}



