"use client";

import { useEffect, useState } from "react";
import { FaShieldAlt, FaPlus, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface Privilege {
  id: number;
  permission_key: string;
  permission_name: string;
  description?: string;
  category: string;
  resource: string;
  action: string;
  is_system_permission: boolean;
  is_assigned?: boolean;
}

interface Role {
  id: number;
  role_name: string;
  role_code: string;
}

interface PrivilegeManagerProps {
  roleId?: number;
  userId?: number;
  onAssignmentChange?: () => void;
}

export function PrivilegeManager({
  roleId,
  userId,
  onAssignmentChange,
}: PrivilegeManagerProps) {
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>(roleId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    loadRoles();
    loadPrivileges();
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      loadPrivileges(selectedRoleId);
    }
  }, [selectedRoleId]);

  const loadRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles");
      const result = await response.json();
      if (result.success) {
        setRoles(result.data || []);
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Rollen", err);
    }
  };

  const loadPrivileges = async (filterRoleId?: number) => {
    try {
      setLoading(true);
      setError(null);
      const url = filterRoleId
        ? `/api/admin/privileges?role_id=${filterRoleId}`
        : "/api/admin/privileges";
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setPrivileges(result.data || []);
      } else {
        setError(result.message || "Fehler beim Laden der Privilegien");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Privilegien", err);
      setError("Fehler beim Laden der Privilegien");
    } finally {
      setLoading(false);
    }
  };

  const togglePrivilege = async (privilege: Privilege) => {
    if (!selectedRoleId) {
      setError("Bitte wählen Sie zuerst eine Rolle aus");
      return;
    }

    try {
      setError(null);
      const url = privilege.is_assigned
        ? `/api/admin/privileges?permission_id=${privilege.id}&role_id=${selectedRoleId}`
        : "/api/admin/privileges";
      const method = privilege.is_assigned ? "DELETE" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "POST" ? JSON.stringify({
          permission_id: privilege.id,
          role_id: selectedRoleId,
        }) : undefined,
      });

      const result = await response.json();

      if (result.success) {
        loadPrivileges(selectedRoleId);
        if (onAssignmentChange) {
          onAssignmentChange();
        }
      } else {
        setError(result.message || "Fehler beim Ändern der Zuweisung");
      }
    } catch (err) {
      logger.error("Fehler beim Ändern der Privilegien-Zuweisung", err);
      setError("Fehler beim Ändern der Zuweisung");
    }
  };

  const categories = Array.from(new Set(privileges.map((p) => p.category)));

  const filteredPrivileges = filterCategory
    ? privileges.filter((p) => p.category === filterCategory)
    : privileges;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FaShieldAlt className="mr-2" />
            Privilegien-Verwaltung
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Privilegien verwalten und zuweisen
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Rollen-Auswahl */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rolle auswählen
        </label>
        <select
          value={selectedRoleId || ""}
          onChange={(e) => setSelectedRoleId(Number(e.target.value) || undefined)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Rolle auswählen --</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.role_name} ({role.role_code})
            </option>
          ))}
        </select>
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

      {/* Privilegien-Liste */}
      {selectedRoleId ? (
        <div className="space-y-2">
          {filteredPrivileges.map((privilege) => (
            <div
              key={privilege.id}
              className={`bg-white dark:bg-gray-800 border rounded-lg p-4 ${
                privilege.is_assigned
                  ? "border-green-500 dark:border-green-600"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {privilege.permission_name}
                    </h4>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {privilege.category}
                    </span>
                    {privilege.is_system_permission && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {privilege.description || privilege.permission_key}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {privilege.resource} • {privilege.action}
                  </p>
                </div>
                <button
                  onClick={() => togglePrivilege(privilege)}
                  className={`ml-4 px-4 py-2 rounded-md flex items-center space-x-2 ${
                    privilege.is_assigned
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {privilege.is_assigned ? (
                    <>
                      <FaTimes className="h-4 w-4" />
                      <span>Entfernen</span>
                    </>
                  ) : (
                    <>
                      <FaPlus className="h-4 w-4" />
                      <span>Zuweisen</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Bitte wählen Sie eine Rolle aus, um Privilegien zuzuweisen.
          </p>
        </div>
      )}
    </div>
  );
}


