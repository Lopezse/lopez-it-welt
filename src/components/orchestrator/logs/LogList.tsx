/**
 * Log List Component - Enterprise++ Standard P8-E
 * 
 * Liste aller Logs mit Filtern und Pagination
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { LogLevelBadge } from "./LogLevelBadge";
import { CategoryBadge } from "./CategoryBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import type { Log, LogCategory, LogLevel, LogSeverity } from "@/lib/ki-orchestrator/level2/logs/types";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface LogListProps {
  logs: Log[];
  filters?: {
    category?: LogCategory;
    log_level?: LogLevel;
    severity?: LogSeverity;
  };
  onFilterChange?: (filters: { category?: LogCategory; log_level?: LogLevel; severity?: LogSeverity }) => void;
  onLogClick?: (logId: string) => void;
  searchQuery?: string;
  loading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function LogList({
  logs,
  filters,
  onFilterChange,
  onLogClick,
  searchQuery,
  loading = false,
  total = 0,
  page = 1,
  limit = 50,
  onPageChange,
}: LogListProps) {
  const highlightText = (text: string, query?: string): string => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900/50">$1</mark>');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Logs gefunden</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Zeit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Kategorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(log.timestamp), {
                    addSuffix: true,
                    locale: de,
                  })}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <LogLevelBadge level={log.log_level} />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <CategoryBadge category={log.category} />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <SeverityBadge severity={log.severity} />
                </td>
                <td className="px-6 py-4">
                  <div
                    className="max-w-md text-sm text-gray-900 dark:text-white font-mono"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(log.message.substring(0, 100), searchQuery),
                    }}
                  />
                  {log.message.length > 100 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">...</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  {onLogClick ? (
                    <button
                      onClick={() => onLogClick(log.id!)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Details
                    </button>
                  ) : (
                    <Link
                      href={`/admin/logs/${log.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Details
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > limit && onPageChange && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Zeige {(page - 1) * limit + 1} bis {Math.min(page * limit, total)} von {total} Logs
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Zurück
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page * limit >= total}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Weiter
            </button>
          </div>
        </div>
      )}
    </>
  );
}





