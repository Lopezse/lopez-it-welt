"use client";

import { useState, useEffect } from "react";
import { FaBalanceScale, FaCheck, FaTimes } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface Role {
  id: number;
  role_name: string;
  role_code: string;
}

interface ComparisonResult {
  role1: {
    id: number;
    role_name: string;
    role_code: string;
    permission_count: number;
  };
  role2: {
    id: number;
    role_name: string;
    role_code: string;
    permission_count: number;
  };
  differences: {
    only_in_role1: string[];
    only_in_role2: string[];
    in_both: string[];
  };
  summary: {
    total_differences: number;
    common_permissions: number;
  };
}

interface RoleComparatorProps {
  roles: Role[];
}

export function RoleComparator({ roles }: RoleComparatorProps) {
  const [role1Id, setRole1Id] = useState<number | null>(null);
  const [role2Id, setRole2Id] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const handleCompare = async () => {
    if (!role1Id || !role2Id) {
      setError("Bitte wählen Sie beide Rollen aus");
      return;
    }

    if (role1Id === role2Id) {
      setError("Bitte wählen Sie zwei verschiedene Rollen aus");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/admin/roles/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_id_1: role1Id,
          role_id_2: role2Id,
        }),
      });

      const comparisonResult = await response.json();

      if (comparisonResult.success) {
        setResult(comparisonResult.data);
      } else {
        setError(comparisonResult.message || "Fehler beim Vergleichen");
      }
    } catch (err) {
      logger.error("Fehler beim Vergleichen der Rollen", err);
      setError("Fehler beim Vergleichen der Rollen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Rollen vergleichen
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Vergleichen Sie zwei Rollen und sehen Sie die Unterschiede in den Berechtigungen
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Erste Rolle
          </label>
          <select
            value={role1Id || ""}
            onChange={(e) => setRole1Id(Number(e.target.value) || null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Bitte wählen --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name} ({role.role_code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Zweite Rolle
          </label>
          <select
            value={role2Id || ""}
            onChange={(e) => setRole2Id(Number(e.target.value) || null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Bitte wählen --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name} ({role.role_code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={loading || !role1Id || !role2Id}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        <FaBalanceScale className="h-4 w-4" />
        <span>{loading ? "Wird verglichen..." : "Rollen vergleichen"}</span>
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Vergleichsergebnis
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rolle 1</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {result.role1.role_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {result.role1.permission_count} Berechtigungen
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rolle 2</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {result.role2.role_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {result.role2.permission_count} Berechtigungen
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Gemeinsame Berechtigungen ({result.summary.common_permissions})
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2 max-h-32 overflow-y-auto">
                  {result.differences.in_both.length > 0 ? (
                    <ul className="text-xs space-y-1">
                      {result.differences.in_both.map((perm) => (
                        <li key={perm} className="flex items-center space-x-2">
                          <FaCheck className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <span className="text-gray-700 dark:text-gray-300">{perm}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-500">Keine</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nur in {result.role1.role_name} ({result.differences.only_in_role1.length})
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2 max-h-32 overflow-y-auto">
                  {result.differences.only_in_role1.length > 0 ? (
                    <ul className="text-xs space-y-1">
                      {result.differences.only_in_role1.map((perm) => (
                        <li key={perm} className="text-gray-700 dark:text-gray-300">
                          {perm}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-500">Keine</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nur in {result.role2.role_name} ({result.differences.only_in_role2.length})
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2 max-h-32 overflow-y-auto">
                  {result.differences.only_in_role2.length > 0 ? (
                    <ul className="text-xs space-y-1">
                      {result.differences.only_in_role2.map((perm) => (
                        <li key={perm} className="text-gray-700 dark:text-gray-300">
                          {perm}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-500">Keine</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



