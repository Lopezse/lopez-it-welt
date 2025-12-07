"use client";

import { useEffect, useState } from "react";
import { FaCog, FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WidgetManager } from "./WidgetManager";
import { logger } from "@/lib/logger";

interface Role {
  id: number;
  role_name: string;
  role_code: string;
}

interface Widget {
  id: number | string;
  name: string;
  type: string;
}

interface DashboardConfig {
  id: number;
  role_id: number;
  role_name?: string;
  config_name: string;
  layout: Record<string, any>;
  is_default: boolean;
  widgets?: Array<{
    id: number;
    widget_id: number;
    widget_name: string;
    widget_type: string;
    position_x: number;
    position_y: number;
    width: number;
    height: number;
    is_visible: boolean;
  }>;
}

export function DashboardConfig() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [configs, setConfigs] = useState<DashboardConfig[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<DashboardConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWidgetManager, setShowWidgetManager] = useState(false);

  useEffect(() => {
    loadRoles();
    loadConfigs();
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      loadConfigs(selectedRoleId);
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

  const loadConfigs = async (roleId?: number) => {
    try {
      setLoading(true);
      setError(null);
      const url = roleId
        ? `/api/admin/dashboard/config?role_id=${roleId}`
        : "/api/admin/dashboard/config";
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setConfigs(result.data || []);
      } else {
        setError(result.message || "Fehler beim Laden der Konfigurationen");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Dashboard-Konfigurationen", err);
      setError("Fehler beim Laden der Konfigurationen");
    } finally {
      setLoading(false);
    }
  };

  const createConfig = async (roleId: number, configName: string) => {
    try {
      setError(null);
      const response = await fetch("/api/admin/dashboard/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_id: roleId,
          config_name: configName,
          layout: {},
          is_default: false,
        }),
      });

      const result = await response.json();

      if (result.success) {
        loadConfigs(roleId);
      } else {
        setError(result.message || "Fehler beim Erstellen der Konfiguration");
      }
    } catch (err) {
      logger.error("Fehler beim Erstellen der Dashboard-Konfiguration", err);
      setError("Fehler beim Erstellen der Konfiguration");
    }
  };

  const deleteConfig = async (configId: number) => {
    if (!confirm("Möchten Sie diese Konfiguration wirklich löschen?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/admin/dashboard/config/${configId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        loadConfigs(selectedRoleId || undefined);
        if (selectedConfig?.id === configId) {
          setSelectedConfig(null);
        }
      } else {
        setError(result.message || "Fehler beim Löschen der Konfiguration");
      }
    } catch (err) {
      logger.error("Fehler beim Löschen der Dashboard-Konfiguration", err);
      setError("Fehler beim Löschen der Konfiguration");
    }
  };

  const loadConfigDetails = async (configId: number) => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/dashboard/config/${configId}`);
      const result = await response.json();

      if (result.success) {
        setSelectedConfig(result.data);
      } else {
        setError(result.message || "Fehler beim Laden der Konfiguration");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Konfigurations-Details", err);
      setError("Fehler beim Laden der Konfiguration");
    }
  };

  const assignWidget = async (widgetId: number | string) => {
    if (!selectedConfig) return;

    try {
      setError(null);
      const response = await fetch(
        `/api/admin/dashboard/config/${selectedConfig.id}/widgets`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            widget_id: widgetId,
            position_x: 0,
            position_y: 0,
            width: 1,
            height: 1,
            order_index: (selectedConfig.widgets?.length || 0) + 1,
            is_visible: true,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        loadConfigDetails(selectedConfig.id);
        setShowWidgetManager(false);
      } else {
        setError(result.message || "Fehler beim Zuweisen des Widgets");
      }
    } catch (err) {
      logger.error("Fehler beim Zuweisen des Widgets", err);
      setError("Fehler beim Zuweisen des Widgets");
    }
  };

  const removeWidget = async (assignmentId: number) => {
    if (!selectedConfig) return;

    try {
      setError(null);
      const response = await fetch(
        `/api/admin/dashboard/config/${selectedConfig.id}/widgets?assignment_id=${assignmentId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (result.success) {
        loadConfigDetails(selectedConfig.id);
      } else {
        setError(result.message || "Fehler beim Entfernen des Widgets");
      }
    } catch (err) {
      logger.error("Fehler beim Entfernen des Widgets", err);
      setError("Fehler beim Entfernen des Widgets");
    }
  };

  if (loading && configs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FaCog className="mr-2" />
            Dashboard-Konfiguration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dashboard-Layouts pro Rolle konfigurieren
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
          onChange={(e) => setSelectedRoleId(Number(e.target.value) || null)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Alle Rollen --</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.role_name} ({role.role_code})
            </option>
          ))}
        </select>
      </div>

      {/* Konfigurationen-Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configs.map((config) => (
          <div
            key={config.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 dark:hover:border-blue-600"
            onClick={() => loadConfigDetails(config.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {config.config_name}
              </h4>
              {config.is_default && (
                <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  Standard
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Rolle: {config.role_name || "Unbekannt"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Widgets: {config.widgets?.length || 0}
            </p>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  loadConfigDetails(config.id);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                Öffnen
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConfig(config.id);
                }}
                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Neue Konfiguration erstellen */}
      {selectedRoleId && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Neue Konfiguration erstellen
          </h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const configName = formData.get("config_name") as string;
              if (configName && selectedRoleId) {
                createConfig(selectedRoleId, configName);
                (e.target as HTMLFormElement).reset();
              }
            }}
            className="flex space-x-2"
          >
            <input
              type="text"
              name="config_name"
              placeholder="Konfigurations-Name"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <FaPlus className="h-4 w-4" />
              <span>Erstellen</span>
            </button>
          </form>
        </div>
      )}

      {/* Konfigurations-Details */}
      {selectedConfig && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedConfig.config_name}
            </h4>
            <button
              onClick={() => setShowWidgetManager(!showWidgetManager)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
            >
              <FaPlus className="h-4 w-4" />
              <span>Widget hinzufügen</span>
            </button>
          </div>

          {showWidgetManager && (
            <div className="mb-6">
              <WidgetManager onWidgetSelect={(widget: Widget) => assignWidget(widget.id)} />
            </div>
          )}

          {/* Zugewiesene Widgets */}
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              Zugewiesene Widgets ({selectedConfig.widgets?.length || 0})
            </h5>
            {selectedConfig.widgets && selectedConfig.widgets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedConfig.widgets.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {assignment.widget_name}
                      </span>
                      <button
                        onClick={() => removeWidget(assignment.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Typ: {assignment.widget_type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Position: ({assignment.position_x}, {assignment.position_y}) | Größe:{" "}
                      {assignment.width}x{assignment.height}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Keine Widgets zugewiesen. Klicken Sie auf "Widget hinzufügen" um Widgets
                zuzuweisen.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


