/**
 * Resolution Dialog Component - Enterprise++ Standard P8-C
 * 
 * Dialog zum Auflösen eines Incidents
 */

"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ResolutionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (resolution: string, rootCause?: string) => Promise<void>;
  incidentTitle?: string;
}

export function ResolutionDialog({
  open,
  onClose,
  onConfirm,
  incidentTitle,
}: ResolutionDialogProps) {
  const [resolution, setResolution] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolution.trim()) {
      setError("Bitte geben Sie eine Lösung an.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onConfirm(resolution, rootCause || undefined);
      setResolution("");
      setRootCause("");
      onClose();
    } catch (err) {
      setError("Fehler beim Auflösen des Incidents. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Incident auflösen
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {incidentTitle && (
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Incident: <span className="font-medium">{incidentTitle}</span>
            </p>
          )}

          <div className="mb-4">
            <label
              htmlFor="resolution"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Lösung <span className="text-red-500">*</span>
            </label>
            <textarea
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Bitte beschreiben Sie die Lösung..."
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="rootCause"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Root Cause (optional)
            </label>
            <textarea
              id="rootCause"
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Bitte beschreiben Sie die Root Cause (optional)..."
            />
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading || !resolution.trim()}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Wird aufgelöst..." : "Auflösen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}





