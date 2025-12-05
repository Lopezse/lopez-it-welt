"use client";

import { useState } from "react";
import { FaDownload, FaFileExport, FaFileAlt } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  role_name?: string;
  status: string;
}

interface ProfileExportProps {
  userId: number;
  profile: UserProfile;
}

export function ProfileExport({ userId, profile }: ProfileExportProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: "json" | "csv" | "pdf") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/users/${userId}/profile/export?format=${format}`,
      );

      if (format === "pdf") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `profile_${profile.username}_${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (format === "csv") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `profile_${profile.username}_${new Date().toISOString().split("T")[0]}.csv`;
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
          a.download = `profile_${profile.username}_${new Date().toISOString().split("T")[0]}.json`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          setError(result.message || "Fehler beim Exportieren");
        }
      }
    } catch (err) {
      logger.error("Fehler beim Exportieren des Profils", err);
      setError("Fehler beim Exportieren des Profils");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <FaDownload className="mr-2" />
        Profil exportieren
      </h2>

      {error && <ErrorBanner message={error} />}

      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Exportieren Sie die Profil-Daten in verschiedenen Formaten:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleExport("json")}
            disabled={loading}
            className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <FaFileAlt className="h-5 w-5" />
            <span>JSON exportieren</span>
          </button>
          <button
            onClick={() => handleExport("csv")}
            disabled={loading}
            className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <FaFileExport className="h-5 w-5" />
            <span>CSV exportieren</span>
          </button>
          <button
            onClick={() => handleExport("pdf")}
            disabled={loading}
            className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <FaFileAlt className="h-5 w-5" />
            <span>PDF exportieren</span>
          </button>
        </div>
      </div>
    </div>
  );
}


