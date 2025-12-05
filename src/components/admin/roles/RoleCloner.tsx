"use client";

import { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBannerSimple } from "@/components/ui/WarningBannerSimple";
import { logger } from "@/lib/logger";

interface Role {
  id: number;
  role_name: string;
  role_code: string;
  role_description: string;
  permissions: string[];
}

interface RoleClonerProps {
  role: Role;
  onCloneSuccess?: () => void;
  onCancel?: () => void;
}

export function RoleCloner({ role, onCloneSuccess, onCancel }: RoleClonerProps) {
  const [newRoleName, setNewRoleName] = useState(`${role.role_name} (Kopie)`);
  const [newRoleCode, setNewRoleCode] = useState(`${role.role_code}_copy`);
  const [newRoleDescription, setNewRoleDescription] = useState(
    role.role_description || "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/admin/roles/${role.id}/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          new_role_name: newRoleName,
          new_role_code: newRoleCode,
          new_role_description: newRoleDescription,
          adjust_permissions: [], // Kann später erweitert werden
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onCloneSuccess) {
            onCloneSuccess();
          }
        }, 1500);
      } else {
        setError(result.message || "Fehler beim Klonen der Rolle");
      }
    } catch (err) {
      logger.error("Fehler beim Klonen der Rolle", err);
      setError("Fehler beim Klonen der Rolle");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
          <FaCheck className="h-5 w-5" />
          <span className="font-semibold">Rolle erfolgreich geklont!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Rolle klonen: {role.role_name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Erstellen Sie eine Kopie dieser Rolle mit neuen Namen
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleClone} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Neuer Rollenname *
          </label>
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Neuer Rollencode *
          </label>
          <input
            type="text"
            value={newRoleCode}
            onChange={(e) => setNewRoleCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            pattern="[a-z0-9_]+"
            title="Nur Kleinbuchstaben, Zahlen und Unterstriche erlaubt"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Beschreibung
          </label>
          <textarea
            value={newRoleDescription}
            onChange={(e) => setNewRoleDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Hinweis:</strong> Die neue Rolle wird mit allen Berechtigungen der
            Original-Rolle erstellt ({role.permissions.length} Berechtigungen).
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FaCopy className="h-4 w-4" />
            <span>{loading ? "Wird geklont..." : "Rolle klonen"}</span>
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Abbrechen
            </button>
          )}
        </div>
      </form>
    </div>
  );
}



