/**
 * GoBD Backup Compliance Component - Enterprise++ Standard E.2.2
 * 
 * GoBD-Compliance für Backups
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface BackupComplianceData {
  total_backups: number;
  verified_backups: number;
  backups: Array<{
    id: string;
    timestamp: string;
    type: string;
    status: string;
    hash_verified: boolean;
    hash_value: string;
    location: string;
  }>;
  compliance_score: number;
  last_verification: string;
}

export function GoBDBackupCompliance() {
  const [data, setData] = useState<BackupComplianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBackupCompliance();
  }, []);

  const loadBackupCompliance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/compliance/gobd/backups");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der Backup-Compliance-Daten");
      }

      setData(result.data);
    } catch (err) {
      logger.error("Fehler beim Laden der Backup-Compliance-Daten", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Backup-Compliance-Daten");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Backup-Compliance-Daten...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return <ErrorBanner message={error} onDismiss={() => setError(null)} />;
  }

  if (!data) {
    return null;
  }

  const verificationPercentage = data.total_backups > 0 
    ? (data.verified_backups / data.total_backups) * 100 
    : 100;

  return (
    <div className="space-y-6">
      {/* Status-Übersicht */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Backup-Compliance-Status</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                verificationPercentage >= 95 ? "text-green-600 dark:text-green-400" :
                verificationPercentage >= 80 ? "text-yellow-600 dark:text-yellow-400" :
                "text-red-600 dark:text-red-400"
              } mb-2`}>
                {verificationPercentage.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.verified_backups} von {data.total_backups} Backups verifiziert
              </p>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  verificationPercentage >= 95 ? "bg-green-500" :
                  verificationPercentage >= 80 ? "bg-yellow-500" :
                  "bg-red-500"
                }`}
                style={{ width: `${verificationPercentage}%` }}
              ></div>
            </div>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Compliance-Score: {data.compliance_score.toFixed(1)}/100
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              Letzte Verifikation: {new Date(data.last_verification).toLocaleString("de-DE")}
            </div>
          </div>
        </div>
      </Card>

      {/* Backup-Liste */}
      {data.backups && data.backups.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Backups</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Zeitstempel</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Typ</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Hash-Verifiziert</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Hash</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {data.backups.map((backup) => (
                    <tr key={backup.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{backup.id}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {format(new Date(backup.timestamp), "dd.MM.yyyy HH:mm", { locale: de })}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{backup.type}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{backup.status}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <span className={backup.hash_verified ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                          {backup.hash_verified ? "✓" : "✗"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">
                          {backup.hash_value.substring(0, 16)}...
                        </code>
                      </td>
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



