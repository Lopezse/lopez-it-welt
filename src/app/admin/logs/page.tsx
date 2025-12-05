/**
 * Logs List Page - Enterprise++ Standard P8-E
 * 
 * Liste aller Logs mit Filtern und Suche
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogList } from "@/components/orchestrator/logs/LogList";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useLogsPermissions } from "@/lib/hooks/useLogsPermissions";
import type { Log, LogCategory, LogLevel, LogSeverity } from "@/lib/ki-orchestrator/level2/logs/types";

export default function LogsListPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    category?: LogCategory;
    log_level?: LogLevel;
    severity?: LogSeverity;
    q?: string;
  }>({});
  const [page, setPage] = useState(1);
  const limit = 50;

  const { canView, loading: permissionsLoading } = useLogsPermissions();

  useEffect(() => {
    if (!permissionsLoading && canView()) {
      loadLogs();
    }
  }, [filters, page, permissionsLoading]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.q) params.append("q", filters.q);
      if (filters.category) params.append("category", filters.category);
      if (filters.log_level) params.append("log_level", filters.log_level);
      if (filters.severity) params.append("severity", filters.severity);
      params.append("limit", limit.toString());
      params.append("offset", ((page - 1) * limit).toString());

      const response = await fetch(`/api/orchestrator/logs?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Laden der Logs");
      }

      if (data.success) {
        setLogs(data.data.logs || []);
        setTotal(data.data.total || 0);
      } else {
        throw new Error(data.error || "Fehler beim Laden der Logs");
      }
    } catch (err) {
      console.error("Fehler beim Laden der Logs:", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Logs");
    } finally {
      setLoading(false);
    }
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
        <ErrorBanner
          message="Sie haben keine Berechtigung, Logs anzuzeigen. Bitte kontaktieren Sie einen Administrator."
          onDismiss={() => {}}
          errorCode="PERMISSION_DENIED"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Logs</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Übersicht aller System-Logs und Ereignisse
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Suche
            </label>
            <input
              type="text"
              value={filters.q || ""}
              onChange={(e) => setFilters({ ...filters, q: e.target.value || undefined })}
              placeholder="Volltext-Suche..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategorie
            </label>
            <select
              value={filters.category || ""}
              onChange={(e) =>
                setFilters({ ...filters, category: (e.target.value as LogCategory) || undefined })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Alle</option>
              <option value="Security">Security</option>
              <option value="API">API</option>
              <option value="Queue">Queue</option>
              <option value="Workflow">Workflow</option>
              <option value="System">System</option>
              <option value="DSGVO">DSGVO</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Log-Level
            </label>
            <select
              value={filters.log_level || ""}
              onChange={(e) =>
                setFilters({ ...filters, log_level: (e.target.value as LogLevel) || undefined })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Alle</option>
              <option value="TRACE">TRACE</option>
              <option value="DEBUG">DEBUG</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
              <option value="FATAL">FATAL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Severity
            </label>
            <select
              value={filters.severity || ""}
              onChange={(e) =>
                setFilters({ ...filters, severity: (e.target.value as LogSeverity) || undefined })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Alle</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link
            href="/admin/logs/search"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Erweiterte Suche
          </Link>
          <Link
            href="/admin/logs/analytics"
            className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Analytics
          </Link>
        </div>
      </div>

      {/* Log List */}
      <LogList
        logs={logs}
        filters={filters}
        onFilterChange={setFilters}
        searchQuery={filters.q}
        loading={loading}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}





