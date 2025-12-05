/**
 * Policy Versioning Component - Enterprise++ Standard E.2.4
 * 
 * Versions-Historie, Version-Vergleich und Version-Wiederherstellung
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface PolicyVersion {
  id: string;
  policy_id: string;
  version: number;
  content: string;
  created_at: string;
  created_by: string;
  change_summary: string;
}

interface PolicyVersioningProps {
  policyId: string;
  onVersionRestore?: (version: PolicyVersion) => void;
}

export function PolicyVersioning({ policyId, onVersionRestore }: PolicyVersioningProps) {
  const [versions, setVersions] = useState<PolicyVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersions, setSelectedVersions] = useState<[string | null, string | null]>([null, null]);
  const [comparison, setComparison] = useState<{ added: string[]; removed: string[]; changed: string[] } | null>(null);

  useEffect(() => {
    loadVersions();
  }, [policyId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/policies/${policyId}/versions`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der Versions-Historie");
      }

      setVersions(result.data || []);
    } catch (err) {
      logger.error("Fehler beim Laden der Policy-Versionen", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Versions-Historie");
    } finally {
      setLoading(false);
    }
  };

  const compareVersions = async () => {
    if (!selectedVersions[0] || !selectedVersions[1]) {
      setError("Bitte wählen Sie zwei Versionen zum Vergleichen aus");
      return;
    }

    try {
      setError(null);
      const response = await fetch(
        `/api/admin/policies/${policyId}/versions/compare?version1=${selectedVersions[0]}&version2=${selectedVersions[1]}`
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Vergleichen der Versionen");
      }

      setComparison(result.data);
    } catch (err) {
      logger.error("Fehler beim Vergleichen der Policy-Versionen", err);
      setError(err instanceof Error ? err.message : "Fehler beim Vergleichen");
    }
  };

  const restoreVersion = async (version: PolicyVersion) => {
    if (!confirm(`Möchten Sie wirklich Version ${version.version} wiederherstellen?`)) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/admin/policies/${policyId}/versions/${version.id}/restore`, {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler bei der Wiederherstellung");
      }

      if (onVersionRestore) {
        onVersionRestore(version);
      }

      loadVersions();
    } catch (err) {
      logger.error("Fehler bei der Policy-Version-Wiederherstellung", err);
      setError(err instanceof Error ? err.message : "Fehler bei der Wiederherstellung");
    }
  };

  if (loading && versions.length === 0) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Versions-Historie...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Version-Vergleich */}
      {versions.length > 1 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Version-Vergleich</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Version 1
                </label>
                <select
                  value={selectedVersions[0] || ""}
                  onChange={(e) => setSelectedVersions([e.target.value, selectedVersions[1]])}
                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                >
                  <option value="">Auswählen...</option>
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      Version {v.version} ({format(new Date(v.created_at), "dd.MM.yyyy", { locale: de })})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Version 2
                </label>
                <select
                  value={selectedVersions[1] || ""}
                  onChange={(e) => setSelectedVersions([selectedVersions[0], e.target.value])}
                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                >
                  <option value="">Auswählen...</option>
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      Version {v.version} ({format(new Date(v.created_at), "dd.MM.yyyy", { locale: de })})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={compareVersions}
              disabled={!selectedVersions[0] || !selectedVersions[1]}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Versionen vergleichen
            </button>

            {comparison && (
              <div className="mt-4 space-y-2">
                {comparison.added.length > 0 && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                    <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">Hinzugefügt:</h4>
                    <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-300">
                      {comparison.added.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {comparison.removed.length > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">Entfernt:</h4>
                    <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
                      {comparison.removed.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {comparison.changed.length > 0 && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                    <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Geändert:</h4>
                    <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
                      {comparison.changed.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Versions-Historie */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Versions-Historie</h3>
          {versions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Keine Versionen vorhanden</p>
          ) : (
            <div className="space-y-3">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">Version {version.version}</span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(version.created_at), "dd.MM.yyyy HH:mm", { locale: de })}
                      </span>
                    </div>
                    <button
                      onClick={() => restoreVersion(version)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      Wiederherstellen
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{version.change_summary}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Erstellt von: {version.created_by}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

