/**
 * System Health Card Component - Enterprise++ Standard P9
 * 
 * System-Health-Karte für UOC Dashboard
 */

"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LiveStreamIndicator } from "./LiveStreamIndicator";
import { useUOCHealthStream } from "@/lib/hooks/useUOCHealthStream";
import type { SystemHealth } from "@/lib/telemetry/types";

interface SystemHealthCardProps {
  health: SystemHealth;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function SystemHealthCard({
  health: initialHealth,
  autoRefresh = false,
  refreshInterval = 5000,
}: SystemHealthCardProps) {
  const [health, setHealth] = useState<SystemHealth>(initialHealth);

  // SSE-Streaming für Live-Updates (statt Polling)
  const { isConnected, lastUpdate } = useUOCHealthStream({
    enabled: autoRefresh,
    onHealth: (newHealth: SystemHealth) => {
      setHealth(newHealth);
    },
  });

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System-Health</h3>
        <div className="flex items-center gap-2">
          {autoRefresh && <LiveStreamIndicator isConnected={isConnected} lastUpdate={lastUpdate ?? undefined} />}
          <StatusBadge status={health.status} size="md" />
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Health-Score</p>
        <p className={`text-3xl font-bold ${getHealthColor(health.score)}`}>{health.score}</p>
      </div>
      {health.issues.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Probleme:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {health.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

