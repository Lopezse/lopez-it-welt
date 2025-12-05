/**
 * Backup Create Component - Enterprise++ Standard E.1.2
 * 
 * Dialog für Backup-Erstellung
 */

"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface BackupCreateProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BackupCreate({ open, onClose, onSuccess }: BackupCreateProps) {
  const [type, setType] = useState<"full" | "incremental" | "differential">("full");
  const [description, setDescription] = useState("");
  const [compression, setCompression] = useState(true);
  const [encryption, setEncryption] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const response = await fetch("/api/admin/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          description: description || undefined,
          compression,
          encryption,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Erstellen des Backups");
      }

      onSuccess();
      onClose();
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Erstellen des Backups");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Backup erstellen
      </h2>

        {error && (
          <div className="mb-4">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Backup-Typ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Backup-Typ *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              required
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              <option value="full">Vollbackup</option>
              <option value="incremental">Inkrementell</option>
              <option value="differential">Differenziell</option>
            </select>
          </div>

          {/* Beschreibung */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Beschreibung (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              placeholder="z.B. Wöchentliches Vollbackup"
            />
          </div>

          {/* Optionen */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Optionen
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="compression"
                checked={compression}
                onChange={(e) => setCompression(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="compression" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Komprimierung
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="encryption"
                checked={encryption}
                onChange={(e) => setEncryption(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="encryption" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Verschlüsselung
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Abbrechen
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Wird erstellt..." : "Backup erstellen"}
            </Button>
          </div>
        </form>
    </Dialog>
  );
}

