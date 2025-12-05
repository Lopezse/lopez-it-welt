/**
 * Logs Search Page - Enterprise++ Standard P8-E
 * 
 * Erweiterte Log-Suche
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { LogList } from "@/components/orchestrator/logs/LogList";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useLogsPermissions } from "@/lib/hooks/useLogsPermissions";
import type { Log, LogCategory, LogLevel, LogSeverity } from "@/lib/ki-orchestrator/level2/logs/types";

export default function LogsSearchPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<{
    q?: string;
    category?: LogCategory;
    log_level?: LogLevel;
    severity?: LogSeverity;
    start_time?: string;
    end_time?: string;
  }>({});

  const { canView, loading: permissionsLoading } = useLogsPermissions();

  const handleSearch = async () => {
    if (!canView()) {
      setError("Sie haben keine Berechtigung, Logs zu suchen.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/orchestrator/logs/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery.q,
          category: searchQuery.category,
          log_level: searchQuery.log_level,
          severity: searchQuery.severity,
          start_time: searchQuery.start_time,
          end_time: searchQuery.end_time,
          limit: 100,
          offset: 0,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler bei der Suche");
      }

      setLogs(data.data.logs || []);
      setTotal(data.data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler bei der Suche");
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
          message="Sie haben keine Berechtigung, Logs zu suchen. Bitte kontaktieren Sie einen Administrator."
          onDismiss={() => {}}
          errorCode="PERMISSION_DENIED"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Log-Suche</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Erweiterte Suche in allen System-Logs
            </p>
          </div>
          <Link
            href="/admin/logs"
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Zurück zur Liste
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Search Form */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Volltext-Suche
            </label>
            <input
              type="text"
              value={searchQuery.q || ""}
              onChange={(e) => setSearchQuery({ ...searchQuery, q: e.target.value || undefined })}
              placeholder="Suchbegriff eingeben..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategorie
            </label>
            <select
              value={searchQuery.category || ""}
              onChange={(e) =>
                setSearchQuery({ ...searchQuery, category: (e.target.value as LogCategory) || undefined })
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
              value={searchQuery.log_level || ""}
              onChange={(e) =>
                setSearchQuery({ ...searchQuery, log_level: (e.target.value as LogLevel) || undefined })
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
              value={searchQuery.severity || ""}
              onChange={(e) =>
                setSearchQuery({ ...searchQuery, severity: (e.target.value as LogSeverity) || undefined })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="">Alle</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Von (Datum)
            </label>
            <input
              type="datetime-local"
              value={searchQuery.start_time || ""}
              onChange={(e) => setSearchQuery({ ...searchQuery, start_time: e.target.value || undefined })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bis (Datum)
            </label>
            <input
              type="datetime-local"
              value={searchQuery.end_time || ""}
              onChange={(e) => setSearchQuery({ ...searchQuery, end_time: e.target.value || undefined })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Suche..." : "Suchen"}
          </button>
          <button
            onClick={() => {
              setSearchQuery({});
              setLogs([]);
              setTotal(0);
            }}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Zurücksetzen
          </button>
        </div>
      </div>

      {/* Search Results */}
      {logs.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Suchergebnisse ({total})
          </h2>
          <LogList logs={logs} searchQuery={searchQuery.q} loading={loading} />
        </div>
      )}
    </div>
  );
}





