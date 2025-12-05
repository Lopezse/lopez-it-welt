"use client";

import { useState } from "react";
import { FaUpload, FaFileImport } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBannerSimple } from "@/components/ui/WarningBannerSimple";
import { logger } from "@/lib/logger";

interface RoleImporterProps {
  onImportSuccess?: () => void;
}

export function RoleImporter({ onImportSuccess }: RoleImporterProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setConflict(null);
    }
  };

  const handleImport = async (conflictResolution?: "skip" | "overwrite" | "rename") => {
    if (!file) {
      setError("Bitte wählen Sie eine Datei aus");
      return;
    }

    setLoading(true);
    setError(null);
    setConflict(null);

    try {
      const text = await file.text();
      let roleData: any;

      try {
        roleData = JSON.parse(text);
      } catch (parseError) {
        setError("Ungültiges JSON-Format");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/roles/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_data: roleData,
          conflict_resolution: conflictResolution || "skip",
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (onImportSuccess) {
          onImportSuccess();
        }
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById("role-import-file") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      } else if (result.conflict) {
        setConflict(result);
      } else {
        setError(result.message || "Fehler beim Importieren");
      }
    } catch (err) {
      logger.error("Fehler beim Importieren der Rolle", err);
      setError("Fehler beim Importieren der Rolle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Rolle importieren
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Importieren Sie eine Rolle aus einer JSON-Datei
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      {conflict && (
        <div className="space-y-3">
          <WarningBannerSimple
            message={`Rolle "${conflict.existing_role.role_name}" existiert bereits. Wie möchten Sie fortfahren?`}
          />
          <div className="flex space-x-2">
            <button
              onClick={() => handleImport("overwrite")}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Überschreiben
            </button>
            <button
              onClick={() => handleImport("rename")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Umbenennen
            </button>
            <button
              onClick={() => {
                setConflict(null);
                setFile(null);
              }}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {!conflict && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              JSON-Datei auswählen
            </label>
            <input
              id="role-import-file"
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {file && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Ausgewählte Datei:</strong> {file.name}
              </p>
            </div>
          )}

          <button
            onClick={() => handleImport()}
            disabled={loading || !file}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FaUpload className="h-4 w-4" />
            <span>{loading ? "Wird importiert..." : "Rolle importieren"}</span>
          </button>
        </div>
      )}
    </div>
  );
}



