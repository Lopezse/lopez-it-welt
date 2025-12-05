/**
 * Correlation Table Component - Enterprise++ Standard P9
 * 
 * Korrelations-Tabelle für Correlation-View
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import type { CorrelationResult } from "@/lib/ki-orchestrator/level2/uoc/types";

interface CorrelationTableProps {
  correlations: CorrelationResult[];
  onCorrelationClick?: (correlation: CorrelationResult) => void;
  sortable?: boolean;
}

export function CorrelationTable({
  correlations,
  onCorrelationClick,
  sortable = false,
}: CorrelationTableProps) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (!sortable) return;
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedCorrelations = [...correlations].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = (a as any)[sortField];
    const bValue = (b as any)[sortField];
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortDirection === "asc" ? comparison : -comparison;
  });

  if (correlations.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Korrelationen gefunden</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 ${sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" : ""}`}
                onClick={() => handleSort("source1")}
              >
                Source 1
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 ${sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" : ""}`}
                onClick={() => handleSort("source2")}
              >
                Source 2
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 ${sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" : ""}`}
                onClick={() => handleSort("score")}
              >
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Gründe
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Zeitstempel
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedCorrelations.map((correlation, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                onClick={() => onCorrelationClick?.(correlation)}
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <Link
                    href={`/admin/${correlation.source1.type}s/${correlation.source1.id}`}
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {correlation.source1.type} {correlation.source1.id.substring(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <Link
                    href={`/admin/${correlation.source2.type}s/${correlation.source2.id}`}
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {correlation.source2.type} {correlation.source2.id.substring(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`font-semibold ${
                      correlation.score >= 0.7
                        ? "text-green-600 dark:text-green-400"
                        : correlation.score >= 0.5
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {(correlation.score * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {correlation.reasons.join(", ")}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(correlation.timestamp).toLocaleString("de-DE")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}




