/**
 * Invoice Audit Logs Component - Enterprise++ Standard
 * 
 * Audit-Logs-Viewer für eine Rechnung
 */

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface AuditLog {
  id: number;
  user_id?: string;
  action: string;
  ref_table: string;
  ref_id: string;
  notes?: string;
  timestamp: string;
}

interface InvoiceAuditLogsProps {
  invoiceId: string;
}

export function InvoiceAuditLogs({ invoiceId }: InvoiceAuditLogsProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAuditLogs();
  }, [invoiceId]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        ref_table: "lopez_invoices",
        ref_id: invoiceId,
      });

      const response = await fetch(`/api/audit?${queryParams}`);
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
    a.download = `invoice-${invoiceId}-audit-logs.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Lade Audit-Logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audit-Logs</h3>
        {auditLogs.length > 0 && (
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            CSV exportieren
          </button>
        )}
      </div>

      {auditLogs.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Keine Audit-Logs gefunden.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {format(new Date(log.timestamp), "dd.MM.yyyy HH:mm:ss", { locale: de })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{log.action}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {log.user_id || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {log.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}




