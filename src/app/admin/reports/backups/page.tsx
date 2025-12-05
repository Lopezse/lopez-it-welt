"use client";

import { useEffect, useState } from "react";
import { FaDatabase, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface BackupHistoryItem {
  id: string;
  backup_type: string;
  status: string;
  file_size: number;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

interface BackupStats {
  total_backups: number;
  successful_backups: number;
  failed_backups: number;
  total_size: number;
  last_backup: string;
}

interface BackupByMonth {
  month: string;
  backup_count: number;
  successful_count: number;
  failed_count: number;
}

export default function BackupHistoryPage() {
  const [backupHistory, setBackupHistory] = useState<BackupHistoryItem[]>([]);
  const [backupStats, setBackupStats] = useState<BackupStats | null>(null);
  const [backupByMonth, setBackupByMonth] = useState<BackupByMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBackupData();
  }, []);

  const loadBackupData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/reports/backups");
      const result = await response.json();

      if (result.success) {
        setBackupHistory(result.data.backup_history || []);
        setBackupStats(result.data.backup_stats || null);
        setBackupByMonth(result.data.backup_by_month || []);
      } else {
        setError(result.message || "Fehler beim Laden der Backup-Daten");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Backup-Daten", err);
      setError("Fehler beim Laden der Backup-Daten");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Backup-Verlauf</h1>
              <p className="text-gray-600 dark:text-gray-400">Backup-Historie und Status</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorBanner message={error} />}

        {/* Statistik-Karten */}
        {backupStats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaDatabase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Gesamt Backups</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {backupStats.total_backups || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Erfolgreich</p>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {backupStats.successful_backups || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaTimesCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Fehlgeschlagen</p>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {backupStats.failed_backups || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaDatabase className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Gesamtgröße</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatFileSize(backupStats.total_size || 0)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Letztes Backup</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {backupStats.last_backup
                  ? new Date(backupStats.last_backup).toLocaleDateString("de-DE")
                  : "Nie"}
              </p>
            </div>
          </div>
        )}

        {/* Backup-Historie */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Backup-Historie
          </h3>
          {backupHistory.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Keine Backup-Daten verfügbar
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Datum
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Typ
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Größe
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Fehler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {backupHistory.map((backup) => (
                    <tr
                      key={backup.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {new Date(backup.created_at).toLocaleString("de-DE")}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {backup.backup_type}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            backup.status === "success"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {backup.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                        {formatFileSize(backup.file_size || 0)}
                      </td>
                      <td className="py-3 px-4 text-sm text-red-600 dark:text-red-400">
                        {backup.error_message || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Backup nach Monat */}
        {backupByMonth.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Backups nach Monat
            </h3>
            <div className="space-y-3">
              {backupByMonth.map((month, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{month.month}</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {month.backup_count} Backups
                    </span>
                  </div>
                  <div className="flex space-x-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Erfolgreich: </span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {month.successful_count}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Fehlgeschlagen: </span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {month.failed_count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


