/**
 * Backup Restore Component - Enterprise++ Standard E.1.2
 * 
 * Dialog für Backup-Wiederherstellung (admin-only)
 */

"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface BackupRestoreProps {
  backupId: string;
  backupName: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BackupRestore({
  backupId,
  backupName,
  open,
  onClose,
  onSuccess,
}: BackupRestoreProps) {
  const [confirm, setConfirm] = useState(false);
  const [targetLocation, setTargetLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!confirm) {
      setError("Bitte bestätigen Sie die Wiederherstellung.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/admin/backups/${backupId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirm: true,
          target_location: targetLocation || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Starten der Wiederherstellung");
      }

      onSuccess();
      onClose();
      setConfirm(false);
      setTargetLocation("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Starten der Wiederherstellung");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Backup wiederherstellen
      </h2>

        <div className="rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-4 mb-4">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
                ⚠️ WARNUNG
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                Das System sollte während der Wiederherstellung pausiert werden. Diese Aktion kann
                nicht rückgängig gemacht werden.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Backup-Info */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Backup:</span> {backupName}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              <span className="font-medium">ID:</span> {backupId.substring(0, 8)}...
            </p>
          </div>

          {/* Ziel-Verzeichnis (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ziel-Verzeichnis (optional)
            </label>
            <input
              type="text"
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              placeholder="z.B. /restore/target"
            />
          </div>

          {/* Bestätigung */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="confirm"
              checked={confirm}
              onChange={(e) => setConfirm(e.target.checked)}
              required
              className="mt-1 rounded border-gray-300 dark:border-gray-600 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="confirm" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Ich bestätige, dass ich die Wiederherstellung starten möchte und verstehe, dass das
              System während der Wiederherstellung pausiert werden sollte.
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Abbrechen
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || !confirm}
            >
              {loading ? "Wird wiederhergestellt..." : "Wiederherstellen"}
            </Button>
          </div>
        </form>
    </Dialog>
  );
}

