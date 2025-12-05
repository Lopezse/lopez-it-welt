/**
 * DSGVO Audit Logs Component - Enterprise++ Standard E.2.1
 * 
 * DSGVO-spezifische Audit-Logs anzeigen
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface AuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
}

export function DSGVOAuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterUser, setFilterUser] = useState<string>("");
  const [filterAction, setFilterAction] = useState<string>("");
  const [filterResource, setFilterResource] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadAuditLogs();
  }, [filterUser, filterAction, filterResource, page]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        ref_table: "dsgvo",
        page: page.toString(),
        limit: "50",
      });
      if (filterUser) params.append("user_id", filterUser);
      if (filterAction) params.append("action", filterAction);
      if (filterResource) params.append("resource_type", filterResource);

      const response = await fetch(`/api/audit?${params.toString()}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der Audit-Logs");
      }

      setAuditLogs(result.data.logs || []);
      setTotalPages(result.data.total_pages || 1);
    } catch (err) {
      logger.error("Fehler beim Laden der DSGVO-Audit-Logs", err, { filterUser, filterAction, filterResource, page });
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Audit-Logs");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Timestamp", "User ID", "Action", "Resource Type", "Resource ID", "Details"];
    const rows = auditLogs.map(log => [
      format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss", { locale: de }),
      log.user_id,
      log.action,
      log.resource_type,
      log.resource_id,
      JSON.stringify(log.details),
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dsgvo-audit-logs-${format(new Date(), "yyyy-MM-dd", { locale: de })}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    try {
      const response = await fetch("/api/dsgvo/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_type: "audit-logs",
          format: "pdf",
          time_range: "30d",
        }),
      });

      const result = await response.json();
      if (result.success && result.data.download_url) {
        window.open(result.data.download_url, "_blank");
      }
    } catch (err) {
      logger.error("Fehler beim Exportieren der Audit-Logs als PDF", err);
      setError("Fehler beim Exportieren als PDF");
    }
  };

  if (loading && auditLogs.length === 0) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Audit-Logs...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return <ErrorBanner message={error} onDismiss={() => setError(null)} />;
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">DSGVO-Audit-Logs</h3>
        <div className="space-y-4">
        {/* Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Filter Benutzer-ID"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="text"
            placeholder="Filter Aktion"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="text"
            placeholder="Filter Resource"
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Export-Buttons */}
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" className="dark:text-white dark:border-gray-600">
            Export CSV
          </Button>
          <Button onClick={exportPDF} variant="outline" className="dark:text-white dark:border-gray-600">
            Export PDF
          </Button>
        </div>

        {/* Audit-Logs-Tabelle */}
        {auditLogs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Keine Audit-Logs gefunden.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Zeitstempel</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Benutzer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Aktion</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Resource</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {format(new Date(log.timestamp), "dd.MM.yyyy HH:mm:ss", { locale: de })}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{log.user_id}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{log.action}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {log.resource_type} / {log.resource_id}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
              className="dark:text-white dark:border-gray-600"
            >
              Zurück
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Seite {page} von {totalPages}
            </span>
            <Button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              variant="outline"
              className="dark:text-white dark:border-gray-600"
            >
              Weiter
            </Button>
          </div>
        )}
        </div>
      </div>
    </Card>
  );
}

