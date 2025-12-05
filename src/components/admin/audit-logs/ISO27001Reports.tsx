/**
 * ISO 27001 Reports Component - Enterprise++ Standard E.2.3
 * 
 * ISO 27001-konforme Berichte generieren
 */

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface ISO27001ReportsProps {
  onReportGenerated?: (reportType: string) => void;
}

export function ISO27001Reports({ onReportGenerated }: ISO27001ReportsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [category, setCategory] = useState("all");

  const generateReport = async (reportType: string, format: "pdf" | "csv") => {
    try {
      setLoading(`${reportType}-${format}`);
      setError(null);

      const response = await fetch("/api/admin/audit-logs/iso27001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_type: reportType,
          format,
          time_range: timeRange,
          category: category === "all" ? null : category,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Generieren des Berichts");
      }

      // Download
      if (result.data.download_url) {
        window.open(result.data.download_url, "_blank");
      }

      if (onReportGenerated) {
        onReportGenerated(reportType);
      }
    } catch (err) {
      logger.error("Fehler beim Generieren des ISO 27001-Berichts", err, { reportType, format, timeRange, category });
      setError(err instanceof Error ? err.message : "Fehler beim Generieren des Berichts");
    } finally {
      setLoading(null);
    }
  };

  const reportTypes = [
    { id: "access-control", label: "Access Control Report", description: "Zugriffskontroll-Bericht (A.9)" },
    { id: "incident-management", label: "Incident Management Report", description: "Incident-Management-Bericht (A.16)" },
    { id: "security-audit", label: "Security Audit Report", description: "Sicherheits-Audit-Bericht (A.12)" },
    { id: "compliance", label: "Compliance Report", description: "Compliance-Bericht (A.18)" },
  ];

  const timeRanges = [
    { value: "7d", label: "Letzte 7 Tage" },
    { value: "30d", label: "Letzte 30 Tage" },
    { value: "90d", label: "Letzte 90 Tage" },
    { value: "custom", label: "Benutzerdefiniert" },
  ];

  const categories = [
    { value: "all", label: "Alle Kategorien" },
    { value: "ISO27001", label: "ISO 27001" },
    { value: "SECURITY", label: "SECURITY" },
    { value: "ACCESS", label: "ACCESS" },
  ];

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ISO 27001-Berichte</h3>
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Zeitraum
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              {timeRanges.map((tr) => (
                <option key={tr.value} value={tr.value}>
                  {tr.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {reportTypes.map((reportType) => (
            <div key={reportType.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {reportType.label}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{reportType.description}</p>

              <div className="flex gap-2">
                <Button
                  onClick={() => generateReport(reportType.id, "pdf")}
                  disabled={loading === `${reportType.id}-pdf`}
                  className="flex-1"
                >
                  {loading === `${reportType.id}-pdf` ? "Generiere..." : "PDF Export"}
                </Button>
                <Button
                  onClick={() => generateReport(reportType.id, "csv")}
                  disabled={loading === `${reportType.id}-csv`}
                  variant="outline"
                  className="flex-1 dark:text-white dark:border-gray-600"
                >
                  {loading === `${reportType.id}-csv` ? "Generiere..." : "CSV Export"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}



