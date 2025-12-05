"use client";

import { useEffect, useState } from "react";
import { FaTable, FaDownload } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface Role {
  id: number;
  role_name: string;
  role_code: string;
}

interface Privilege {
  id: number;
  permission_key: string;
  permission_name: string;
  category: string;
  resource: string;
  action: string;
}

interface PrivilegeMatrixData {
  roles: Role[];
  permissions: Privilege[];
  matrix: Record<string, Record<string, boolean>>;
}

export function PrivilegeMatrix() {
  const [matrixData, setMatrixData] = useState<PrivilegeMatrixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    loadMatrix();
  }, []);

  const loadMatrix = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/privileges/matrix");
      const result = await response.json();

      if (result.success) {
        setMatrixData(result.data);
      } else {
        setError(result.message || "Fehler beim Laden der Privilegien-Matrix");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Privilegien-Matrix", err);
      setError("Fehler beim Laden der Matrix");
    } finally {
      setLoading(false);
    }
  };

  const exportMatrix = async (format: "csv" | "json") => {
    if (!matrixData) return;

    try {
      if (format === "csv") {
        // CSV-Export
        const csvLines = ["Rolle," + matrixData.permissions.map((p) => p.permission_key).join(",")];

        matrixData.roles.forEach((role) => {
          const row = [
            role.role_name,
            ...matrixData.permissions.map((perm) =>
              matrixData.matrix[role.id]?.[perm.id] ? "✓" : "",
            ),
          ];
          csvLines.push(row.join(","));
        });

        const csvContent = csvLines.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `privilege_matrix_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // JSON-Export
        const jsonContent = JSON.stringify(matrixData, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `privilege_matrix_${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      logger.error("Fehler beim Exportieren der Matrix", err);
      setError("Fehler beim Exportieren");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message={error} />;
  }

  if (!matrixData) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Daten verfügbar</p>
      </div>
    );
  }

  const categories = Array.from(new Set(matrixData.permissions.map((p) => p.category)));
  const filteredPermissions = filterCategory
    ? matrixData.permissions.filter((p) => p.category === filterCategory)
    : matrixData.permissions;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FaTable className="mr-2" />
            Privilegien-Matrix
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Übersicht: Welche Rolle hat welche Privilegien
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => exportMatrix("csv")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <FaDownload className="h-4 w-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => exportMatrix("json")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <FaDownload className="h-4 w-4" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Kategorie-Filter */}
      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategorie filtern
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Alle Kategorien --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Matrix-Tabelle */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-900 z-10">
                Rolle
              </th>
              {filteredPermissions.map((perm) => (
                <th
                  key={perm.id}
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  title={perm.permission_name}
                >
                  <div className="max-w-24 truncate">{perm.permission_key}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {matrixData.roles.map((role) => (
              <tr key={role.id}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800 z-10">
                  {role.role_name}
                </td>
                {filteredPermissions.map((perm) => (
                  <td key={perm.id} className="px-3 py-3 text-center">
                    {matrixData.matrix[role.id]?.[perm.id] ? (
                      <FaCheck className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" />
                    ) : (
                      <span className="text-gray-300 dark:text-gray-600">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


