/**
 * Unified Alert List Component - Enterprise++ Standard P9
 * 
 * Alert-Liste für UOC Dashboard
 */

"use client";

import Link from "next/link";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Alert, AlertFilters } from "@/lib/ki-orchestrator/level2/types";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface UnifiedAlertListProps {
  alerts: Alert[];
  filters?: AlertFilters;
  onFilterChange?: (filters: AlertFilters) => void;
  onAlertClick?: (alertId: string) => void;
  showActions?: boolean;
  maxItems?: number;
}

export function UnifiedAlertList({
  alerts,
  onAlertClick,
  showActions = false,
  maxItems = 10,
}: UnifiedAlertListProps) {
  const displayedAlerts = alerts.slice(0, maxItems);

  if (displayedAlerts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Alerts gefunden</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Kategorie
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Titel
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Zeitstempel
              </th>
              {showActions && (
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Aktionen
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {displayedAlerts.map((alert) => (
              <tr
                key={alert.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                onClick={() => onAlertClick?.(alert.id)}
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <SeverityBadge severity={alert.severity} size="sm" />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={alert.status} size="sm" />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  {alert.category}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <Link
                    href={`/admin/alerts/${alert.id}`}
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {alert.title}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(alert.triggered_at), {
                    addSuffix: true,
                    locale: de,
                  })}
                </td>
                {showActions && (
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {alert.status === "open" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement acknowledge
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Bestätigen
                        </button>
                      )}
                      {alert.status !== "escalated" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement escalate
                          }}
                          className="text-orange-600 dark:text-orange-400 hover:underline"
                        >
                          Eskalieren
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}




