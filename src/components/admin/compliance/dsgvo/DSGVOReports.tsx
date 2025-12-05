/**
 * DSGVO Reports Component - Enterprise++ Standard E.2.1
 * 
 * DSGVO-Berichte generieren und exportieren
 */

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface DSGVOReportsProps {
  onReportGenerated?: (reportType: string) => void;
}

export function DSGVOReports({ onReportGenerated }: DSGVOReportsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (reportType: string, format: "pdf" | "csv", timeRange: string) => {
    try {
      setLoading(`${reportType}-${format}`);
      setError(null);

      const response = await fetch("/api/dsgvo/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_type: reportType,
          format,
          time_range: timeRange,
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
      logger.error("Fehler beim Generieren des DSGVO-Berichts", err, { reportType, format, timeRange });
      setError(err instanceof Error ? err.message : "Fehler beim Generieren des Berichts");
    } finally {
      setLoading(null);
    }
  };

  const reportTypes = [
    { id: "compliance", label: "Compliance-Bericht", description: "Vollständiger DSGVO-Compliance-Status" },
    { id: "consent", label: "Consent-Bericht", description: "Übersicht über alle Consents" },
    { id: "privacy-requests", label: "Privacy-Request-Bericht", description: "Übersicht über Privacy-Requests" },
    { id: "ki-processing", label: "KI-Verarbeitung-Bericht", description: "Übersicht über KI-Verarbeitung" },
  ];

  const timeRanges = [
    { value: "7d", label: "Letzte 7 Tage" },
    { value: "30d", label: "Letzte 30 Tage" },
    { value: "90d", label: "Letzte 90 Tage" },
    { value: "custom", label: "Benutzerdefiniert" },
  ];

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">DSGVO-Berichte</h3>
        <div className="space-y-6">
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        {reportTypes.map((reportType) => (
          <div key={reportType.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {reportType.label}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{reportType.description}</p>

            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  id={`timeRange-${reportType.id}`}
                  className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  defaultValue="30d"
                >
                  {timeRanges.map((tr) => (
                    <option key={tr.value} value={tr.value}>
                      {tr.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const timeRange = (document.getElementById(`timeRange-${reportType.id}`) as HTMLSelectElement)?.value || "30d";
                    generateReport(reportType.id, "pdf", timeRange);
                  }}
                  disabled={loading === `${reportType.id}-pdf`}
                  className="flex-1"
                >
                  {loading === `${reportType.id}-pdf` ? "Generiere..." : "PDF Export"}
                </Button>
                <Button
                  onClick={() => {
                    const timeRange = (document.getElementById(`timeRange-${reportType.id}`) as HTMLSelectElement)?.value || "30d";
                    generateReport(reportType.id, "csv", timeRange);
                  }}
                  disabled={loading === `${reportType.id}-csv`}
                  variant="outline"
                  className="flex-1 dark:text-white dark:border-gray-600"
                >
                  {loading === `${reportType.id}-csv` ? "Generiere..." : "CSV Export"}
                </Button>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </Card>
  );
}

