/**
 * Backup List Component - Enterprise++ Standard E.1.2
 * 
 * Backup-Liste mit Aktionen (Erstellen, Download, Restore)
 */

"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useSystemPermissions } from "@/lib/hooks/useSystemPermissions";

interface Backup {
  id: string;
  timestamp: string;
  type: "full" | "incremental" | "differential";
  size: number;
  status: "success" | "error" | "running" | "corrupted";
  duration?: number;
  files: number;
  location: string;
  description?: string;
}

interface BackupListProps {
  backups: Backup[];
  onRefresh: () => void;
  onCreateBackup: () => void;
  onDownloadBackup: (id: string) => void;
  onRestoreBackup: (id: string) => void;
}

export function BackupList({
  backups,
  onRefresh,
  onCreateBackup,
  onDownloadBackup,
  onRestoreBackup,
}: BackupListProps) {
  const { canManage } = useSystemPermissions();

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getStatusVariant = (
    status: string
  ): "success" | "warning" | "error" | "info" | "default" => {
    switch (status) {
      case "success":
        return "success";
      case "running":
        return "info";
      case "error":
      case "corrupted":
        return "error";
      default:
        return "default";
    }
  };

  const getTypeVariant = (
    type: string
  ): "success" | "warning" | "error" | "info" | "default" => {
    switch (type) {
      case "full":
        return "info";
      case "incremental":
        return "success";
      case "differential":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Backup-Liste</h2>
        <div className="flex gap-2">
          {canManage() && (
            <button
              onClick={onCreateBackup}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Backup jetzt erstellen
            </button>
          )}
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Aktualisieren
          </button>
        </div>
      </div>

      {/* Backup-Liste */}
      {backups.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Keine Backups gefunden.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Typ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Datum
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                  Größe
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                  Dateien
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Dauer
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {backups.map((backup) => (
                <tr key={backup.id}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {backup.id.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={backup.type} variant={getTypeVariant(backup.type)} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {format(new Date(backup.timestamp), "dd.MM.yyyy HH:mm", { locale: de })}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    {formatSize(backup.size)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    {backup.files}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={backup.status} variant={getStatusVariant(backup.status)} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {backup.duration ? `${backup.duration}s` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex gap-2 justify-end">
                      {backup.status === "success" && (
                        <>
                          <button
                            onClick={() => onDownloadBackup(backup.id)}
                            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            Download
                          </button>
                          {canManage() && (
                            <button
                              onClick={() => onRestoreBackup(backup.id)}
                              className="px-2 py-1 rounded border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                            >
                              Wiederherstellen
                            </button>
                          )}
                        </>
                      )}
                    </div>
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




