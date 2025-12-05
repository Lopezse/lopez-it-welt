/**
 * Backup Logs Component - Enterprise++ Standard E.1.2
 * 
 * Backup-Logs-Viewer mit Filter und Export
 */

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface BackupLogsProps {
  backupId?: string;
}

export function BackupLogs({ backupId }: BackupLogsProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (backupId) {
      loadLogs();
    } else {
      setLogs([]);
      setLoading(false);
    }
  }, [backupId]);

  useEffect(() => {
    if (autoRefresh && backupId) {
      const interval = setInterval(() => {
        loadLogs();
      }, 5000); // Alle 5 Sekunden aktualisieren

      return () => clearInterval(interval);
    }
  }, [autoRefresh, backupId]);

  const loadLogs = async () => {
    if (!backupId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/backups/${backupId}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Laden der Logs");
      }

      setLogs(data.data.logs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Logs");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Zeitstempel", "Level", "Nachricht"];
    const rows = logs.map((log) => {
      // Log-Format: [TIMESTAMP] LEVEL: MESSAGE
      const match = log.match(/\[(.*?)\]\s+(\w+):\s+(.*)/);
      if (match) {
        return [match[1], match[2], match[3]];
      }
      return [new Date().toISOString(), "INFO", log];
    });

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-${backupId}-logs.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!backupId) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Bitte wählen Sie ein Backup aus, um die Logs anzuzeigen.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Lade Logs...</p>
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Backup-Logs</h3>
        <div className="flex gap-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="autoRefresh" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Auto-Refresh
            </label>
          </div>
          {logs.length > 0 && (
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              CSV exportieren
            </button>
          )}
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Keine Logs gefunden.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 p-4 font-mono text-sm overflow-x-auto">
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-green-400 dark:text-green-300">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}




