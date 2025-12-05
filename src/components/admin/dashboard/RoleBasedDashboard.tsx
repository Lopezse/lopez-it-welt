"use client";

import { useEffect, useState } from "react";
import { FaChartLine, FaInfoCircle, FaList, FaCheckCircle, FaSpinner, FaCog, FaUsers } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Card } from "@/components/ui/Card";
import { logger } from "@/lib/logger";

interface Widget {
  id: number;
  widget_id: number;
  widget_name: string;
  widget_type: "kpi" | "chart" | "list" | "status" | "custom";
  widget_config: Record<string, any>;
  widget_description?: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  order_index: number;
}

interface DashboardData {
  config: {
    id: number;
    role_id: number;
    config_name: string;
    layout: Record<string, any>;
  } | null;
  widgets: Widget[];
  role: {
    id: number;
    name: string;
    code: string;
  } | null;
}

interface RoleBasedDashboardProps {
  roleId?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function RoleBasedDashboard({
  roleId,
  autoRefresh = false,
  refreshInterval = 30000,
}: RoleBasedDashboardProps) {
  // Starte mit leeren Daten statt null, damit kein Flash auftritt
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    config: null,
    widgets: [],
    role: null,
  });
  const [loading, setLoading] = useState(false); // Starte nicht im Loading-State
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      // Leise im Hintergrund laden, ohne Loading-State
      setError(null);

      const url = roleId
        ? `/api/admin/dashboard/role/${roleId}`
        : "/api/admin/dashboard/current";
      const response = await fetch(url, {
        credentials: "include", // Cookies mitsenden
      });
      
      if (!response.ok) {
        // Wenn nicht authentifiziert, zeige keine Fehlermeldung, sondern leeres Dashboard
        if (response.status === 401) {
          // Leeres Dashboard behalten (wird bereits angezeigt)
          return;
        }
        // Bei anderen Fehlern auch leeres Dashboard behalten
        return;
      }
      
      const result = await response.json();

      if (result.success && result.data) {
        // Sanft aktualisieren
        setDashboardData(result.data);
      }
      // Bei Fehlern leeres Dashboard behalten (wird bereits angezeigt)
    } catch (err) {
      logger.error("Fehler beim Laden des Dashboards", err);
      // Bei Fehlern leeres Dashboard behalten (wird bereits angezeigt)
    }
  };

  useEffect(() => {
    loadDashboard();

    if (autoRefresh) {
      const interval = setInterval(loadDashboard, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [roleId, autoRefresh, refreshInterval]);

  const renderWidget = (widget: Widget) => {
    switch (widget.widget_type) {
      case "kpi":
        return <KPIWidget widget={widget} />;
      case "chart":
        return <ChartWidget widget={widget} />;
      case "list":
        return <ListWidget widget={widget} />;
      case "status":
        return <StatusWidget widget={widget} />;
      case "custom":
        return <CustomWidget widget={widget} />;
      default:
        return (
          <Card className="p-4">
            <p className="text-gray-500">Unbekannter Widget-Typ: {widget.widget_type}</p>
          </Card>
        );
    }
  };

  // Loading-State und Error-Banner entfernt - Dashboard zeigt sofort Fallback-Inhalte
  // Daten werden im Hintergrund geladen und sanft aktualisiert

  if (!dashboardData || dashboardData.widgets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Willkommen im Dashboard
          </h3>
          <p className="text-blue-800 dark:text-blue-300 mb-4">
            Keine Widgets für dieses Dashboard konfiguriert. Sie können das Dashboard jetzt konfigurieren oder das Standard-Dashboard verwenden.
          </p>
          <div className="flex space-x-4">
            <a
              href="/admin/dashboard/config"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaCog className="mr-2" />
              Dashboard konfigurieren
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Standard-Dashboard verwenden
            </button>
          </div>
        </div>
        
        {/* Fallback: Zeige Standard-Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Status</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">OK</p>
              </div>
              <FaCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktive Benutzer</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">-</p>
              </div>
              <FaUsers className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Letzte Aktivität</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">-</p>
              </div>
              <FaChartLine className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Sortiere Widgets nach order_index
  const sortedWidgets = [...dashboardData.widgets].sort(
    (a, b) => a.order_index - b.order_index,
  );

  return (
    <div className="space-y-6">
      {dashboardData.role && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Dashboard für Rolle: <strong>{dashboardData.role.name}</strong> (
            {dashboardData.role.code})
          </p>
          {dashboardData.config && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Konfiguration: {dashboardData.config.config_name}
            </p>
          )}
        </div>
      )}

      {/* Widget-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedWidgets.map((widget) => (
          <div
            key={widget.id}
            className={`col-span-${widget.width || 1} row-span-${widget.height || 1}`}
          >
            {renderWidget(widget)}
          </div>
        ))}
      </div>
    </div>
  );
}

// KPI Widget
function KPIWidget({ widget }: { widget: Widget }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Mock-Daten für KPI-Widget
    const mockData = {
      value: 42,
      label: widget.widget_name,
      change: "+5%",
    };
    setData(mockData);
  }, [widget]);

  if (!data) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {widget.widget_name}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {data.value}
          </p>
          {data.change && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">{data.change}</p>
          )}
        </div>
        <FaInfoCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
    </Card>
  );
}

// Chart Widget
function ChartWidget({ widget }: { widget: Widget }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {widget.widget_name}
        </h3>
        <FaChartLine className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded">
        <p className="text-sm text-gray-500 dark:text-gray-400">Chart wird geladen...</p>
      </div>
      {widget.widget_description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {widget.widget_description}
        </p>
      )}
    </Card>
  );
}

// List Widget
function ListWidget({ widget }: { widget: Widget }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {widget.widget_name}
        </h3>
        <FaList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">Liste wird geladen...</p>
      </div>
      {widget.widget_description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {widget.widget_description}
        </p>
      )}
    </Card>
  );
}

// Status Widget
function StatusWidget({ widget }: { widget: Widget }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {widget.widget_name}
        </h3>
        <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Status OK</span>
        </div>
      </div>
      {widget.widget_description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {widget.widget_description}
        </p>
      )}
    </Card>
  );
}

// Custom Widget
function CustomWidget({ widget }: { widget: Widget }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {widget.widget_name}
        </h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Custom Widget: {widget.widget_type}
        </p>
      </div>
      {widget.widget_description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {widget.widget_description}
        </p>
      )}
    </Card>
  );
}

