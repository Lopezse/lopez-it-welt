/**
 * Queue Status Card Component - Enterprise++ Standard P9
 * 
 * Queue-Status-Karte für UOC Dashboard
 */

"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { QueueStatus } from "@/lib/ki-orchestrator/level2/uoc/types";

interface QueueStatusCardProps {
  queueStatus: QueueStatus;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function QueueStatusCard({
  queueStatus: initialQueueStatus,
  autoRefresh = false,
  refreshInterval = 5000,
}: QueueStatusCardProps) {
  const [queueStatus, setQueueStatus] = useState<QueueStatus>(initialQueueStatus);

  useEffect(() => {
    if (!autoRefresh) return;

    const fetchQueueStatus = async () => {
      try {
        const response = await fetch("/api/orchestrator/metrics/queue", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setQueueStatus(data.data || data);
        }
      } catch (error) {
        console.error("Failed to fetch queue status", error);
      }
    };

    const interval = setInterval(fetchQueueStatus, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getStatus = (): "healthy" | "degraded" | "unhealthy" | "critical" => {
    if (queueStatus.blocked) return "critical";
    if (queueStatus.depth > 100) return "unhealthy";
    if (queueStatus.depth > 50) return "degraded";
    return "healthy";
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Queue-Status</h3>
        <StatusBadge status={getStatus()} size="md" />
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Queue-Tiefe</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{queueStatus.depth}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Durchsatz</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {queueStatus.throughput.toFixed(1)} Tasks/s
          </p>
        </div>
        {queueStatus.failedTasks > 0 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fehlgeschlagene Tasks</p>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              {queueStatus.failedTasks}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}




