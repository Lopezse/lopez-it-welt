/**
 * Alerts List Page - Enterprise++ Standard P8-C
 * 
 * Liste aller Alerts mit Filtern
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { CriticalAlertsBanner } from "@/components/orchestrator/alerts/CriticalAlertsBanner";
import { useSecurityPermissions } from "@/lib/hooks/useSecurityPermissions";
import type { Alert, AlertSeverity, AlertStatus, AlertCategory } from "@/lib/ki-orchestrator/level2/types";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export default function AlertsListPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    status?: AlertStatus;
    severity?: AlertSeverity;
    category?: AlertCategory;
  }>({});
  const [page, setPage] = useState(1);
  const limit = 50;

  const { canView, loading: permissionsLoading } = useSecurityPermissions();

  useEffect(() => {
    if (!permissionsLoading && canView()) {
      loadAlerts();
    }
  }, [filters, page, permissionsLoading]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.severity) params.append("severity", filters.severity);
      if (filters.category) params.append("category", filters.category);
      params.append("limit", limit.toString());
      params.append("offset", ((page - 1) * limit).toString());

      const response = await fetch(`/api/orchestrator/alerts?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Fehler beim Laden der Alerts");
      }

      setAlerts(data.data.alerts || []);
      setTotal(data.data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Alerts");
    } finally {
      setLoading(false);
    }
  };

  // Count critical alerts
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const showWarning = criticalCount > 3;

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
        <ErrorBanner message="Sie haben keine Berechtigung, Alerts anzuzeigen." errorCode="PERMISSION_DENIED" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alerts</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Übersicht aller System-Alerts und Sicherheitswarnungen
        </p>
      </div>

      {showWarning && (
        <div className="mb-6">
          <CriticalAlertsBanner count={criticalCount} />
        </div>
      )}

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({ ...filters, status: (e.target.value as AlertStatus) || undefined })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Alle</option>
              <option value="open">Offen</option>
              <option value="acknowledged">Bestätigt</option>
              <option value="escalated">Eskaliert</option>
              <option value="closed">Geschlossen</option>
              <option value="ignored">Ignoriert</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Severity
            </label>
            <select
              value={filters.severity || ""}
              onChange={(e) =>
                setFilters({ ...filters, severity: (e.target.value as AlertSeverity) || undefined })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Alle</option>
              <option value="info">Info</option>
              <option value="warning">Warnung</option>
              <option value="critical">Kritisch</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategorie
            </label>
            <select
              value={filters.category || ""}
              onChange={(e) =>
                setFilters({ ...filters, category: (e.target.value as AlertCategory) || undefined })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Alle</option>
              <option value="Security">Security</option>
              <option value="Compliance">Compliance</option>
              <option value="Performance">Performance</option>
              <option value="Systemintegrität">Systemintegrität</option>
              <option value="Orchestrator">Orchestrator</option>
              <option value="KI-Risiken">KI-Risiken</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Laden...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Keine Alerts gefunden</p>
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
                    Kategorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Ausgelöst
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {alert.title}
                        </div>
                        {alert.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {alert.description.substring(0, 60)}...
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <SeverityBadge severity={alert.severity} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={alert.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {alert.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(alert.triggered_at), {
                        addSuffix: true,
                        locale: de,
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <Link
                        href={`/admin/orchestrator/alerts/${alert.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Zeige {(page - 1) * limit + 1} bis {Math.min(page * limit, total)} von {total} Alerts
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

