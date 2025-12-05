"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaChartLine, FaList, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface Widget {
  id: number | string;
  name: string;
  type: "kpi" | "chart" | "list" | "status" | "custom";
  description?: string;
  config: Record<string, any>;
  is_system_widget: boolean;
  is_active: boolean;
}

interface WidgetManagerProps {
  onWidgetSelect?: (widget: Widget) => void;
}

export function WidgetManager({ onWidgetSelect }: WidgetManagerProps) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);

  useEffect(() => {
    loadWidgets();
  }, []);

  const loadWidgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/dashboard/widgets");
      const result = await response.json();

      if (result.success) {
        setWidgets(result.data || []);
      } else {
        setError(result.message || "Fehler beim Laden der Widgets");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Widgets", err);
      setError("Fehler beim Laden der Widgets");
    } finally {
      setLoading(false);
    }
  };

  const deleteWidget = async (widgetId: number | string) => {
    if (!confirm("Möchten Sie dieses Widget wirklich löschen?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/admin/dashboard/widgets/${widgetId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        loadWidgets();
      } else {
        setError(result.message || "Fehler beim Löschen des Widgets");
      }
    } catch (err) {
      logger.error("Fehler beim Löschen des Widgets", err);
      setError("Fehler beim Löschen des Widgets");
    }
  };

  const toggleWidgetActive = async (widget: Widget) => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/dashboard/widgets/${widget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: !widget.is_active,
        }),
      });

      const result = await response.json();

      if (result.success) {
        loadWidgets();
      } else {
        setError(result.message || "Fehler beim Aktualisieren des Widgets");
      }
    } catch (err) {
      logger.error("Fehler beim Aktualisieren des Widgets", err);
      setError("Fehler beim Aktualisieren des Widgets");
    }
  };

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case "kpi":
        return FaInfoCircle;
      case "chart":
        return FaChartLine;
      case "list":
        return FaList;
      case "status":
        return FaCheckCircle;
      default:
        return FaInfoCircle;
    }
  };

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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Widget-Verwaltung
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Widgets erstellen, bearbeiten und verwalten
          </p>
        </div>
        <button
          onClick={() => {
            setEditingWidget(null);
            setShowEditor(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <FaPlus className="h-4 w-4" />
          <span>Neues Widget</span>
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {showEditor && (
        <WidgetEditor
          widget={editingWidget || undefined}
          onSave={() => {
            setShowEditor(false);
            setEditingWidget(null);
            loadWidgets();
          }}
          onCancel={() => {
            setShowEditor(false);
            setEditingWidget(null);
          }}
        />
      )}

      {!showEditor && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {widgets.map((widget) => {
            const IconComponent = getWidgetIcon(widget.type);

            return (
              <div
                key={widget.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {widget.name}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        widget.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {widget.is_active ? "Aktiv" : "Inaktiv"}
                    </span>
                    {widget.is_system_widget && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        System
                      </span>
                    )}
                  </div>
                </div>
                {widget.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {widget.description}
                  </p>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                  Typ: {widget.type}
                </div>
                <div className="flex space-x-2">
                  {onWidgetSelect && (
                    <button
                      onClick={() => onWidgetSelect(widget)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Auswählen
                    </button>
                  )}
                  {!widget.is_system_widget && (
                    <>
                      <button
                        onClick={() => {
                          setEditingWidget(widget);
                          setShowEditor(true);
                        }}
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => toggleWidgetActive(widget)}
                        className={`px-3 py-1 rounded text-xs ${
                          widget.is_active
                            ? "bg-gray-600 text-white hover:bg-gray-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {widget.is_active ? "Deaktivieren" : "Aktivieren"}
                      </button>
                      <button
                        onClick={() => deleteWidget(widget.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Widget-Editor-Komponente
function WidgetEditor({
  widget,
  onSave,
  onCancel,
}: {
  widget?: Widget;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Widget>>(
    widget || {
      name: "",
      type: "kpi",
      description: "",
      config: {},
      is_active: true,
    },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = widget
        ? `/api/admin/dashboard/widgets/${widget.id}`
        : "/api/admin/dashboard/widgets";
      const method = widget ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        onSave();
      } else {
        setError(result.message || "Fehler beim Speichern des Widgets");
      }
    } catch (err) {
      logger.error("Fehler beim Speichern des Widgets", err);
      setError("Fehler beim Speichern des Widgets");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {widget ? "Widget bearbeiten" : "Neues Widget erstellen"}
      </h4>

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={widget?.is_system_widget}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Typ *
          </label>
          <select
            value={formData.type || "kpi"}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as Widget["type"],
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={widget?.is_system_widget}
          >
            <option value="kpi">KPI (Key Performance Indicator)</option>
            <option value="chart">Chart (Diagramm)</option>
            <option value="list">Liste</option>
            <option value="status">Status</option>
            <option value="custom">Custom (Benutzerdefiniert)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Beschreibung
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Wird gespeichert..." : "Speichern"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}


