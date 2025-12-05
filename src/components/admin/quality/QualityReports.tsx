"use client";

import { useEffect, useState } from "react";
import { FaFileAlt, FaDownload } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface QualityReport {
  id: string;
  report_name: string;
  report_type: "daily" | "weekly" | "monthly" | "release" | "custom";
  version?: string;
  metrics_summary: any;
  status: "draft" | "generated" | "published";
  generated_at: string;
  published_at?: string;
}

export function QualityReports() {
  const [reports, setReports] = useState<QualityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("");

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    loadReports();
  }, [filterType]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filterType) params.append("report_type", filterType);
      const response = await fetch(`/api/admin/quality/reports?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setReports(result.data || []);
      } else {
        setError(result.message || "Fehler beim Laden der Berichte");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Qualitäts-Berichte", err);
      setError("Fehler beim Laden der Berichte");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (report: QualityReport) => {
    const jsonContent = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quality_report_${report.id}_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
            <FaFileAlt className="mr-2" />
            Qualitäts-Berichte
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Übersicht über Qualitäts-Berichte
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Typ-Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Typ filtern
        </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Alle Typen --</option>
          <option value="daily">Täglich</option>
          <option value="weekly">Wöchentlich</option>
          <option value="monthly">Monatlich</option>
          <option value="release">Release</option>
          <option value="custom">Benutzerdefiniert</option>
        </select>
      </div>

      {/* Berichte-Liste */}
      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Keine Berichte gefunden. Berichte werden automatisch generiert.
            </p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {report.report_name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Typ: {report.report_type} {report.version && `• Version: ${report.version}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      report.status === "published"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : report.status === "generated"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {report.status}
                  </span>
                  <button
                    onClick={() => exportReport(report)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center space-x-1"
                  >
                    <FaDownload className="h-3 w-3" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Erstellt: {new Date(report.generated_at).toLocaleString("de-DE")}
              </div>
              {report.metrics_summary && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Metriken-Zusammenfassung:
                  </p>
                  <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                    {JSON.stringify(report.metrics_summary, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


