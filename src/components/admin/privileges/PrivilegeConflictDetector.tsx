"use client";

import { useEffect, useState } from "react";
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaRedo } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface Conflict {
  type: string;
  severity: "error" | "warning" | "info";
  message: string;
  role_id?: number;
  permission_id?: number;
}

interface ConflictData {
  conflicts: Conflict[];
  count: number;
}

export function PrivilegeConflictDetector() {
  const [conflictData, setConflictData] = useState<ConflictData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConflicts();
  }, []);

  const loadConflicts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/privileges/conflicts");
      const result = await response.json();

      if (result.success) {
        setConflictData(result.data);
      } else {
        setError(result.message || "Fehler beim Laden der Konflikte");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Privilegien-Konflikte", err);
      setError("Fehler beim Laden der Konflikte");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <FaExclamationTriangle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <FaExclamationTriangle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <FaInfoCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <FaInfoCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            Privilegien-Konflikte
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Erkennung von Privilegien-Konflikten
          </p>
        </div>
        <button
          onClick={loadConflicts}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <FaRedo className="h-4 w-4" />
          <span>Aktualisieren</span>
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Zusammenfassung */}
      {conflictData && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Gefundene Konflikte
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {conflictData.count}
              </p>
            </div>
            {conflictData.count === 0 && (
              <FaCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            )}
          </div>
        </div>
      )}

      {/* Konflikte-Liste */}
      {conflictData && conflictData.conflicts.length > 0 ? (
        <div className="space-y-3">
          {conflictData.conflicts.map((conflict, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getSeverityColor(conflict.severity)}`}
            >
              <div className="flex items-start space-x-3">
                {getSeverityIcon(conflict.severity)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {conflict.type}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        conflict.severity === "error"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          : conflict.severity === "warning"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      }`}
                    >
                      {conflict.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{conflict.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
          <FaCheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Keine Privilegien-Konflikte gefunden. Alles in Ordnung!
          </p>
        </div>
      )}
    </div>
  );
}


