/**
 * Audit Log Export Component - Enterprise++ Standard E.2.3
 * 
 * Export-Funktionen für Audit-Logs (CSV, PDF, Excel)
 */

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface AuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  severity: string;
  compliance_category: string;
  notes: string | null;
}

interface AuditLogExportProps {
  filters: Record<string, string>;
  onExportComplete?: () => void;
}

export function AuditLogExport({ filters, onExportComplete }: AuditLogExportProps) {
  const [exporting, setExporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const exportCSV = async () => {
    try {
      setExporting("csv");
      setError(null);

      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/admin/audit-logs?${queryParams.toString()}&limit=10000`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Exportieren");
      }

      const logs: AuditLog[] = result.data.logs || [];
      const headers = ["Zeitstempel", "Benutzer-ID", "Aktion", "Resource-Typ", "Resource-ID", "Severity", "Compliance-Kategorie", "Notizen"];
      const rows = logs.map((log) => [
        format(new Date(log.timestamp), "dd.MM.yyyy HH:mm:ss", { locale: de }),
        log.user_id || "—",
        log.action,
        log.resource_type || "—",
        log.resource_id || "—",
        log.severity || "—",
        log.compliance_category || "—",
        log.notes || "—",
      ]);

      const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd", { locale: de })}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (onExportComplete) {
        onExportComplete();
      }
    } catch (err) {
      logger.error("Fehler beim CSV-Export der Audit-Logs", err, { filters });
      setError(err instanceof Error ? err.message : "Fehler beim CSV-Export");
    } finally {
      setExporting(null);
    }
  };

  const exportPDF = async () => {
    try {
      setExporting("pdf");
      setError(null);

      const response = await fetch("/api/admin/audit-logs/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: "pdf",
          filters,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Generieren des PDFs");
      }

      if (result.data.download_url) {
        window.open(result.data.download_url, "_blank");
      }

      if (onExportComplete) {
        onExportComplete();
      }
    } catch (err) {
      logger.error("Fehler beim PDF-Export der Audit-Logs", err, { filters });
      setError(err instanceof Error ? err.message : "Fehler beim PDF-Export");
    } finally {
      setExporting(null);
    }
  };

  const exportExcel = async () => {
    try {
      setExporting("excel");
      setError(null);

      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/admin/audit-logs?${queryParams.toString()}&limit=10000`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Exportieren");
      }

      const logs: AuditLog[] = result.data.logs || [];
      // Excel-Export als CSV (vereinfacht - in Produktion: echte Excel-Generierung)
      const headers = ["Zeitstempel", "Benutzer-ID", "Aktion", "Resource-Typ", "Resource-ID", "Severity", "Compliance-Kategorie", "Notizen"];
      const rows = logs.map((log) => [
        format(new Date(log.timestamp), "dd.MM.yyyy HH:mm:ss", { locale: de }),
        log.user_id || "—",
        log.action,
        log.resource_type || "—",
        log.resource_id || "—",
        log.severity || "—",
        log.compliance_category || "—",
        log.notes || "—",
      ]);

      const csvContent = [headers.join("\t"), ...rows.map((row) => row.join("\t"))].join("\n");
      const blob = new Blob([csvContent], { type: "text/tab-separated-values;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd", { locale: de })}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (onExportComplete) {
        onExportComplete();
      }
    } catch (err) {
      logger.error("Fehler beim Excel-Export der Audit-Logs", err, { filters });
      setError(err instanceof Error ? err.message : "Fehler beim Excel-Export");
    } finally {
      setExporting(null);
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export</h3>
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        <div className="space-y-3">
          <Button
            onClick={exportCSV}
            disabled={exporting === "csv"}
            variant="outline"
            className="w-full dark:text-white dark:border-gray-600"
          >
            {exporting === "csv" ? "Exportiere..." : "CSV Export"}
          </Button>
          <Button
            onClick={exportPDF}
            disabled={exporting === "pdf"}
            variant="outline"
            className="w-full dark:text-white dark:border-gray-600"
          >
            {exporting === "pdf" ? "Exportiere..." : "PDF Export"}
          </Button>
          <Button
            onClick={exportExcel}
            disabled={exporting === "excel"}
            variant="outline"
            className="w-full dark:text-white dark:border-gray-600"
          >
            {exporting === "excel" ? "Exportiere..." : "Excel Export"}
          </Button>
        </div>
      </div>
    </Card>
  );
}



