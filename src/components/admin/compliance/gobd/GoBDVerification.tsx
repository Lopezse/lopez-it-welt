/**
 * GoBD Verification Component - Enterprise++ Standard E.2.2
 * 
 * Hash-Verifikation durchführen und Ergebnisse anzeigen
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface VerificationResult {
  resource_type: "invoice" | "backup";
  resource_id: string;
  status: "verified" | "failed" | "warning";
  calculated_hash: string;
  stored_hash: string;
  verified_at: string;
  details?: string;
}

interface VerificationHistory {
  id: string;
  timestamp: string;
  resource_type: string;
  resource_id: string;
  status: string;
  verified_by: string;
}

export function GoBDVerification() {
  const [verifying, setVerifying] = useState(false);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [history, setHistory] = useState<VerificationHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [resourceType, setResourceType] = useState<"invoice" | "backup" | "all">("all");
  const [resourceId, setResourceId] = useState<string>("");

  const runVerification = async () => {
    try {
      setVerifying(true);
      setError(null);

      const response = await fetch("/api/compliance/gobd/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource_type: resourceType === "all" ? null : resourceType,
          resource_id: resourceId || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler bei der Hash-Verifikation");
      }

      setResults(result.data.results || []);
      loadHistory();
    } catch (err) {
      logger.error("Fehler bei der GoBD-Hash-Verifikation", err, { resourceType, resourceId });
      setError(err instanceof Error ? err.message : "Fehler bei der Hash-Verifikation");
    } finally {
      setVerifying(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await fetch("/api/compliance/gobd/verification-history");
      const result = await response.json();

      if (result.success) {
        setHistory(result.data || []);
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Verifikations-Historie", err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "verified": return "text-green-600 dark:text-green-400";
      case "failed": return "text-red-600 dark:text-red-400";
      case "warning": return "text-yellow-600 dark:text-yellow-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBgColor = (status: string): string => {
    switch (status) {
      case "verified": return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "failed": return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning": return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      default: return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Verifikation starten */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hash-Verifikation</h3>
          {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resource-Typ
              </label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as any)}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              >
                <option value="all">Alle</option>
                <option value="invoice">Rechnungen</option>
                <option value="backup">Backups</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resource-ID (optional)
              </label>
              <input
                type="text"
                value={resourceId}
                onChange={(e) => setResourceId(e.target.value)}
                placeholder="Leer lassen für alle"
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <Button
              onClick={runVerification}
              disabled={verifying}
              className="w-full"
            >
              {verifying ? "Verifiziere..." : "Verifikation starten"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Verifikations-Ergebnisse */}
      {results.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Verifikations-Ergebnisse</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getStatusBgColor(result.status)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {result.resource_type === "invoice" ? "Rechnung" : "Backup"}: {result.resource_id}
                      </span>
                      <span className={`ml-2 text-sm font-medium ${getStatusColor(result.status)}`}>
                        {result.status === "verified" ? "✓ Verifiziert" : result.status === "failed" ? "✗ Fehlgeschlagen" : "⚠ Warnung"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(result.verified_at), "dd.MM.yyyy HH:mm:ss", { locale: de })}
                    </span>
                  </div>
                  {result.details && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{result.details}</p>
                  )}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div>Berechneter Hash: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{result.calculated_hash.substring(0, 16)}...</code></div>
                    <div>Gespeicherter Hash: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{result.stored_hash.substring(0, 16)}...</code></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Verifikations-Historie */}
      {history.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Verifikations-Historie</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Zeitstempel</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Resource</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Verifiziert von</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {history.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {format(new Date(entry.timestamp), "dd.MM.yyyy HH:mm:ss", { locale: de })}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {entry.resource_type} / {entry.resource_id}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <span className={getStatusColor(entry.status)}>
                          {entry.status === "verified" ? "✓ Verifiziert" : entry.status === "failed" ? "✗ Fehlgeschlagen" : "⚠ Warnung"}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{entry.verified_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

