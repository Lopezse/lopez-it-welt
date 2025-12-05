"use client";

import { useState } from "react";
import { FaDownload, FaFileExport } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface RoleExporterProps {
  roleId: number;
  roleName: string;
  roleCode: string;
}

export function RoleExporter({ roleId, roleName, roleCode }: RoleExporterProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: "json" | "csv") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/roles/${roleId}/export?format=${format}`);
      
      if (format === "csv") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `role_${roleCode}_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const result = await response.json();
        if (result.success) {
          const dataStr = JSON.stringify(result.data, null, 2);
          const blob = new Blob([dataStr], { type: "application/json" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `role_${roleCode}_${new Date().toISOString().split("T")[0]}.json`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          setError(result.message || "Fehler beim Exportieren");
        }
      }
    } catch (err) {
      logger.error("Fehler beim Exportieren der Rolle", err);
      setError("Fehler beim Exportieren der Rolle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && <ErrorBanner message={error} />}
      
      <div className="flex space-x-2">
        <button
          onClick={() => handleExport("json")}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <FaDownload className="h-4 w-4" />
          <span>JSON exportieren</span>
        </button>
        <button
          onClick={() => handleExport("csv")}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <FaFileExport className="h-4 w-4" />
          <span>CSV exportieren</span>
        </button>
      </div>
    </div>
  );
}



