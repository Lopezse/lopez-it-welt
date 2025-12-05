/**
 * Media AI Audit Logs Component - Enterprise++ Standard E.1.4
 * 
 * Audit-Logs-Viewer für ein Bild mit Filter und Export
 */

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Button } from "@/components/ui/Button";

interface MediaAIAuditLogsProps {
  mediaId: string;
}

interface AuditLog {
  id: number;
  user_id?: string;
  action: string;
  ref_table: string;
  ref_id: string;
  notes?: string;
  timestamp: string;
}

export function MediaAIAuditLogs({ mediaId }: MediaAIAuditLogsProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    timeRange?: string;
    action?: string;
    userId?: string;
  }>({});

  useEffect(() => {
    loadAuditLogs();
  }, [mediaId, filters]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        ref_table: "lopez_media",
        ref_id: mediaId,
      });

      if (filters.timeRange) {
        queryParams.append("time_range", filters.timeRange);
      }
      if (filters.action) {
        queryParams.append("action", filters.action);
      }
      if (filters.userId) {
        queryParams.append("user_id", filters.userId);
      }

      const response = await fetch(`/api/audit?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Laden der Audit-Logs");
      }

      setAuditLogs(data.data.logs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Audit-Logs");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Zeitstempel", "Aktion", "Benutzer", "Details"];
    const rows = auditLogs.map((log) => [
      format(new Date(log.timestamp), "dd.MM.yyyy HH:mm:ss", { locale: de }),
      log.action,
      log.user_id || "—",
      log.notes || "—",
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `media-${mediaId}-audit-logs.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    try {
      const response = await fetch(`/api/audit/export?ref_table=lopez_media&ref_id=${mediaId}&format=pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `media-${mediaId}-audit-logs.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Exportieren der Audit-Logs");
    }
  };

  if (loading && auditLogs.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Lade Audit-Logs...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message={error} onDismiss={() => setError(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Audit-Logs</h2>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" size="sm">
            CSV Export
          </Button>
          <Button onClick={exportPDF} variant="outline" size="sm">
            PDF Export
          </Button>
        </div>
      </div>

      {/* Filter-Bar */}
      <div className="flex gap-4 items-center">
        <select
          value={filters.timeRange || ""}
          onChange={(e) => setFilters({ ...filters, timeRange: e.target.value || undefined })}
          className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
        >
          <option value="">Alle Zeiträume</option>
          <option value="1h">Letzte Stunde</option>
          <option value="24h">Letzte 24 Stunden</option>
          <option value="7d">Letzte 7 Tage</option>
          <option value="30d">Letzte 30 Tage</option>
        </select>
        <input
          type="text"
          placeholder="Aktion filtern..."
          value={filters.action || ""}
          onChange={(e) => setFilters({ ...filters, action: e.target.value || undefined })}
          className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
        />
        <input
          type="text"
          placeholder="Benutzer-ID filtern..."
          value={filters.userId || ""}
          onChange={(e) => setFilters({ ...filters, userId: e.target.value || undefined })}
          className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
        />
      </div>

      {/* Audit-Logs-Liste */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Zeitstempel
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Aktion
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Benutzer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {auditLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Keine Audit-Logs gefunden
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {format(new Date(log.timestamp), "dd.MM.yyyy HH:mm:ss", { locale: de })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {log.user_id || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {log.notes || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



