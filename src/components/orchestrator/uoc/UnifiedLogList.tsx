/**
 * Unified Log List Component - Enterprise++ Standard P9
 * 
 * Log-Liste für UOC Dashboard
 */

"use client";

import Link from "next/link";
import { LogLevelBadge } from "../logs/LogLevelBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Log, LogFilters } from "@/lib/ki-orchestrator/level2/logs/types";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface UnifiedLogListProps {
  logs: Log[];
  filters?: LogFilters;
  onFilterChange?: (filters: LogFilters) => void;
  onLogClick?: (logId: string) => void;
  maxItems?: number;
  showSearch?: boolean;
}

export function UnifiedLogList({
  logs,
  onLogClick,
  maxItems = 10,
}: UnifiedLogListProps) {
  const displayedLogs = logs.slice(0, maxItems);

  if (displayedLogs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Logs gefunden</p>
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
                Level
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Kategorie
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Message
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Zeitstempel
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {displayedLogs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                onClick={() => onLogClick?.(log.id)}
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <LogLevelBadge level={log.log_level} size="sm" />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <SeverityBadge severity={log.severity} size="sm" />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={log.category} size="sm" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <Link
                    href={`/admin/logs/${log.id}`}
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {log.message.length > 100 ? `${log.message.substring(0, 100)}...` : log.message}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(log.timestamp, {
                    addSuffix: true,
                    locale: de,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}




