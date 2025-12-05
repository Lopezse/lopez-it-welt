/**
 * Data Lineage Export Component - Enterprise++ Standard E.2.6
 * 
 * Export (CSV, PDF, JSON), Export-Filter und Export-Historie
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";
import { FaDownload, FaFileCsv, FaFilePdf, FaFileCode, FaHistory } from "react-icons/fa";

interface ExportHistory {
  id: string;
  format: string;
  filters: Record<string, any>;
  created_at: string;
  created_by: string;
}

export function DataLineageExport() {
  const [exporting, setExporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const [filters, setFilters] = useState({
    type: "",
    resource_type: "",
    date_from: "",
    date_to: "",
  });

  useEffect(() => {
    loadExportHistory();
  }, []);

  const loadExportHistory = async () => {
    try {
      const response = await fetch("/api/admin/data-lineage/exports");
      const result = await response.json();
      if (result.success) {
        setExportHistory(result.data || []);
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Export-Historie", err);
    }
  };

  const handleExport = async (format: "csv" | "pdf" | "json") => {
    try {
      setExporting(format);
      setError(null);

      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.resource_type) params.append("resource_type", filters.resource_type);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
      params.append("format", format);

      const response = await fetch(`/api/admin/data-lineage/export?${params.toString()}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Export");
      }

      // Download starten
      if (result.data.download_url) {
        window.open(result.data.download_url, "_blank");
      }

      loadExportHistory();
    } catch (err) {
      logger.error("Fehler beim Export der Data Lineage", err);
      setError(err instanceof Error ? err.message : "Fehler beim Export");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Export-Filter */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export-Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Typ
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              >
                <option value="">Alle</option>
                <option value="source">Source</option>
                <option value="transform">Transform</option>
                <option value="destination">Destination</option>
                <option value="process">Process</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ressourcen-Typ
              </label>
              <input
                type="text"
                value={filters.resource_type}
                onChange={(e) => setFilters({ ...filters, resource_type: e.target.value })}
                placeholder="z.B. invoice, backup"
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Von Datum
              </label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bis Datum
              </label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Export-Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleExport("csv")}
              disabled={exporting !== null}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              <FaFileCsv className="mr-2" />
              {exporting === "csv" ? "Exportiere..." : "CSV Export"}
            </button>
            <button
              onClick={() => handleExport("pdf")}
              disabled={exporting !== null}
              className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center"
            >
              <FaFilePdf className="mr-2" />
              {exporting === "pdf" ? "Exportiere..." : "PDF Export"}
            </button>
            <button
              onClick={() => handleExport("json")}
              disabled={exporting !== null}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <FaFileCode className="mr-2" />
              {exporting === "json" ? "Exportiere..." : "JSON Export"}
            </button>
          </div>
        </div>
      </Card>

      {/* Export-Historie */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaHistory className="mr-2" />
            Export-Historie
          </h3>
          {exportHistory.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Keine Exports vorhanden</p>
          ) : (
            <div className="space-y-2">
              {exportHistory.map((exportItem) => (
                <div
                  key={exportItem.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {exportItem.format.toUpperCase()} Export
                      </span>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(exportItem.created_at).toLocaleString("de-DE")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      von {exportItem.created_by}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}



