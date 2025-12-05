/**
 * Incidents List Page - Enterprise++ Standard P8-C
 * 
 * Liste aller Incidents mit Filtern
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useSecurityPermissions } from "@/lib/hooks/useSecurityPermissions";
import type { Incident, IncidentStatus, IncidentSeverity } from "@/lib/ki-orchestrator/level2/types";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export default function IncidentsListPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    status?: IncidentStatus;
    severity?: IncidentSeverity;
  }>({});
  const [page, setPage] = useState(1);
  const limit = 50;

  const { canView, loading: permissionsLoading } = useSecurityPermissions();

  useEffect(() => {
    if (!permissionsLoading && canView()) {
      loadIncidents();
    }
  }, [filters, page, permissionsLoading]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.severity) params.append("severity", filters.severity);
      params.append("limit", limit.toString());
      params.append("offset", ((page - 1) * limit).toString());

      const response = await fetch(`/api/orchestrator/incidents?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Fehler beim Laden der Incidents");
      }

      setIncidents(data.data.incidents || []);
      setTotal(data.data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Incidents");
    } finally {
      setLoading(false);
    }
  };

  const getSLATimeRemaining = (incident: Incident): { minutes: number; status: "ok" | "warning" | "breached" } => {
    const now = new Date();
    const startedAt = new Date(incident.sla_started_at);
    const elapsedMinutes = (now.getTime() - startedAt.getTime()) / (1000 * 60);
    const remainingMinutes = incident.sla_minutes - elapsedMinutes;

    if (remainingMinutes <= 0) {
      return { minutes: 0, status: "breached" };
    }
    if (remainingMinutes <= incident.sla_minutes * 0.2) {
      return { minutes: Math.round(remainingMinutes), status: "warning" };
    }
    return { minutes: Math.round(remainingMinutes), status: "ok" };
  };

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
        <ErrorBanner message="Sie haben keine Berechtigung, Incidents anzuzeigen." errorCode="PERMISSION_DENIED" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Incidents</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Übersicht aller offenen und behobenen Incidents
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({ ...filters, status: (e.target.value as IncidentStatus) || undefined })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Alle</option>
              <option value="open">Offen</option>
              <option value="investigating">In Untersuchung</option>
              <option value="resolved">Aufgelöst</option>
              <option value="closed">Geschlossen</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Severity
            </label>
            <select
              value={filters.severity || ""}
              onChange={(e) =>
                setFilters({ ...filters, severity: (e.target.value as IncidentSeverity) || undefined })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Alle</option>
              <option value="info">Info</option>
              <option value="warning">Warnung</option>
              <option value="critical">Kritisch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Laden...</p>
        </div>
      ) : incidents.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Keine Incidents gefunden</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Titel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    SLA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Eröffnet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {incidents.map((incident) => {
                  const sla = getSLATimeRemaining(incident);
                  return (
                    <tr key={incident.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {incident.title}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <SeverityBadge severity={incident.severity} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge status={incident.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div
                          className={`text-sm font-medium ${
                            sla.status === "breached"
                              ? "text-red-600 dark:text-red-400"
                              : sla.status === "warning"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {sla.status === "breached"
                            ? "SLA verletzt"
                            : `${sla.minutes} Min. verbleibend`}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(incident.opened_at), {
                          addSuffix: true,
                          locale: de,
                        })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <Link
                          href={`/admin/orchestrator/incidents/${incident.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Zeige {(page - 1) * limit + 1} bis {Math.min(page * limit, total)} von {total} Incidents
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50"
                >
                  Zurück
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * limit >= total}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50"
                >
                  Weiter
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

