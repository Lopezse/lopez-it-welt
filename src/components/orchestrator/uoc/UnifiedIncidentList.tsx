/**
 * Unified Incident List Component - Enterprise++ Standard P9
 * 
 * Incident-Liste für UOC Dashboard
 */

"use client";

import Link from "next/link";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Incident, IncidentFilters } from "@/lib/ki-orchestrator/level2/types";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface UnifiedIncidentListProps {
  incidents: Incident[];
  filters?: IncidentFilters;
  onFilterChange?: (filters: IncidentFilters) => void;
  onIncidentClick?: (incidentId: string) => void;
  showActions?: boolean;
  maxItems?: number;
}

export function UnifiedIncidentList({
  incidents,
  onIncidentClick,
  showActions = false,
  maxItems = 5,
}: UnifiedIncidentListProps) {
  const displayedIncidents = incidents.slice(0, maxItems);

  if (displayedIncidents.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Incidents gefunden</p>
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
                Titel
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                SLA
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
            {displayedIncidents.map((incident) => (
              <tr
                key={incident.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                onClick={() => onIncidentClick?.(incident.id)}
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <SeverityBadge severity={incident.severity} size="sm" />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={incident.status} size="sm" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <Link
                    href={`/admin/incidents/${incident.id}`}
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {incident.title}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {incident.sla_minutes ? `${Math.floor(incident.sla_minutes / 60)}h` : "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(incident.opened_at), {
                    addSuffix: true,
                    locale: de,
                  })}
                </td>
                {showActions && (
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {incident.status !== "resolved" && incident.status !== "closed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement resolve
                        }}
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        Auflösen
                      </button>
                    )}
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




