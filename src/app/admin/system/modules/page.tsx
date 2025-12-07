"use client";

import { useEffect, useState } from "react";
import {
  FaSync,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaRocket,
  FaChartLine,
  FaLayerGroup,
  FaShieldAlt,
  FaCogs,
  FaBriefcase,
  FaMoneyBillWave,
  FaBrain,
  FaFileContract,
  FaPlug,
  FaPalette,
  FaCode,
  FaSearch,
  FaFilter,
  FaDownload,
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

type ModuleStatus = "planned" | "in_progress" | "implemented" | "tested" | "deployed" | "deprecated" | "cancelled";
type ModuleCategory = "core" | "security" | "operations" | "business" | "finance" | "ai" | "compliance" | "integration" | "ui" | "api";
type ModulePriority = "critical" | "high" | "medium" | "low";

interface AdminModule {
  id: number;
  module_code: string;
  name: string;
  description: string;
  category: ModuleCategory;
  status: ModuleStatus;
  priority: ModulePriority;
  ui_path?: string;
  api_path?: string;
  progress_percent: number;
  responsible_team?: string;
  target_date?: string;
  completed_date?: string;
  created_at: string;
  updated_at: string;
}

interface Statistics {
  total: number;
  byStatus: Record<ModuleStatus, number>;
  byCategory: Record<ModuleCategory, number>;
  byPriority: Record<ModulePriority, number>;
  overallProgress: number;
  criticalMissing: AdminModule[];
}

// =====================================================
// KONSTANTEN
// =====================================================

const STATUS_CONFIG: Record<ModuleStatus, { label: string; color: string; bgColor: string; icon: JSX.Element }> = {
  planned: { label: "Geplant", color: "#8a8a8a", bgColor: "#2a2d35", icon: <FaClock /> },
  in_progress: { label: "In Entwicklung", color: "#ffd700", bgColor: "#3d3a20", icon: <FaCogs /> },
  implemented: { label: "Implementiert", color: "#00bcd4", bgColor: "#1a3a3f", icon: <FaCheckCircle /> },
  tested: { label: "Getestet", color: "#9c27b0", bgColor: "#2d1f3a", icon: <FaCheckCircle /> },
  deployed: { label: "Produktiv", color: "#4caf50", bgColor: "#1f3a25", icon: <FaRocket /> },
  deprecated: { label: "Veraltet", color: "#ff9800", bgColor: "#3a2f1a", icon: <FaExclamationTriangle /> },
  cancelled: { label: "Abgebrochen", color: "#f44336", bgColor: "#3a1f1f", icon: <FaExclamationTriangle /> },
};

const CATEGORY_CONFIG: Record<ModuleCategory, { label: string; icon: JSX.Element; color: string }> = {
  core: { label: "Core System", icon: <FaLayerGroup />, color: "#007bff" },
  security: { label: "Sicherheit", icon: <FaShieldAlt />, color: "#dc3545" },
  operations: { label: "Operations", icon: <FaCogs />, color: "#6f42c1" },
  business: { label: "Business", icon: <FaBriefcase />, color: "#28a745" },
  finance: { label: "Finanzen", icon: <FaMoneyBillWave />, color: "#ffc107" },
  ai: { label: "KI & Automation", icon: <FaBrain />, color: "#e83e8c" },
  compliance: { label: "Compliance", icon: <FaFileContract />, color: "#17a2b8" },
  integration: { label: "Integration", icon: <FaPlug />, color: "#fd7e14" },
  ui: { label: "Benutzeroberfläche", icon: <FaPalette />, color: "#6610f2" },
  api: { label: "API", icon: <FaCode />, color: "#20c997" },
};

const PRIORITY_CONFIG: Record<ModulePriority, { label: string; color: string }> = {
  critical: { label: "Kritisch", color: "#f44336" },
  high: { label: "Hoch", color: "#ff9800" },
  medium: { label: "Mittel", color: "#ffc107" },
  low: { label: "Niedrig", color: "#8a8a8a" },
};

// =====================================================
// KOMPONENTE
// =====================================================

export default function ModuleRegistryPage() {
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<{ created: number; updated: number; unchanged: number } | null>(null);

  // Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<ModuleCategory | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ModuleStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<ModulePriority | "all">("all");

  // Daten laden
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Module laden
      const modulesRes = await fetch("/api/admin/modules");
      const modulesData = await modulesRes.json();

      if (modulesData.success) {
        setModules(modulesData.data);
      }

      // Statistiken laden
      const statsRes = await fetch("/api/admin/modules?view=statistics");
      const statsData = await statsRes.json();

      if (statsData.success) {
        setStatistics(statsData.data);
      }
    } catch (err) {
      setError("Fehler beim Laden der Daten");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Roadmap synchronisieren
  const syncRoadmap = async () => {
    try {
      setSyncing(true);
      setSyncResult(null);

      const res = await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync" }),
      });

      const data = await res.json();

      if (data.success) {
        setSyncResult(data.data);
        await loadData(); // Daten neu laden
      } else {
        setError(data.error || "Sync fehlgeschlagen");
      }
    } catch (err) {
      setError("Fehler beim Synchronisieren");
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Gefilterte Module
  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      searchTerm === "" ||
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.module_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "all" || module.category === filterCategory;
    const matchesStatus = filterStatus === "all" || module.status === filterStatus;
    const matchesPriority = filterPriority === "all" || module.priority === filterPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  // Gruppierte Module nach Kategorie
  const groupedModules = filteredModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<ModuleCategory, AdminModule[]>);

  if (loading) {
    return (
      <div className="p-6 min-h-screen" style={{ backgroundColor: "#0d0f12" }}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffd700]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#0d0f12" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#f4f4f4" }}>
            🏢 Enterprise++ Module Registry
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8a8a8a" }}>
            SAP Solution Manager Style - SOLL vs. IST Tracking
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={syncRoadmap}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: syncing ? "#2a2d35" : "#ffd700",
              color: syncing ? "#8a8a8a" : "#111217",
            }}
          >
            <FaSync className={syncing ? "animate-spin" : ""} />
            {syncing ? "Synchronisiere..." : "Roadmap Sync"}
          </button>
        </div>
      </div>

      {/* Sync-Ergebnis */}
      {syncResult && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{ backgroundColor: "#1f3a25", borderColor: "#4caf50" }}
        >
          <div className="flex items-center gap-2" style={{ color: "#4caf50" }}>
            <FaCheckCircle />
            <span className="font-medium">Roadmap synchronisiert!</span>
          </div>
          <p className="text-sm mt-1" style={{ color: "#b3b3b3" }}>
            {syncResult.created} neu erstellt, {syncResult.updated} aktualisiert, {syncResult.unchanged} unverändert
          </p>
        </div>
      )}

      {/* Fehler */}
      {error && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{ backgroundColor: "#3a1f1f", borderColor: "#f44336" }}
        >
          <div className="flex items-center gap-2" style={{ color: "#f44336" }}>
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Statistik-Karten */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Gesamtfortschritt */}
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#8a8a8a" }}>
                Gesamtfortschritt
              </span>
              <FaChartLine style={{ color: "#ffd700" }} />
            </div>
            <div className="text-3xl font-bold" style={{ color: "#ffd700" }}>
              {statistics.overallProgress}%
            </div>
            <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#272a33" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${statistics.overallProgress}%`,
                  backgroundColor: statistics.overallProgress >= 80 ? "#4caf50" : statistics.overallProgress >= 50 ? "#ffd700" : "#f44336",
                }}
              />
            </div>
          </div>

          {/* Gesamt-Module */}
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#8a8a8a" }}>
                Gesamt Module
              </span>
              <FaLayerGroup style={{ color: "#007bff" }} />
            </div>
            <div className="text-3xl font-bold" style={{ color: "#f4f4f4" }}>
              {statistics.total}
            </div>
            <div className="text-sm mt-1" style={{ color: "#8a8a8a" }}>
              {statistics.byStatus.deployed || 0} produktiv
            </div>
          </div>

          {/* Kritische Lücken */}
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: statistics.criticalMissing.length > 0 ? "#3a1f1f" : "#111217",
              borderColor: statistics.criticalMissing.length > 0 ? "#f44336" : "#272a33",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#8a8a8a" }}>
                Kritische Lücken
              </span>
              <FaExclamationTriangle
                style={{ color: statistics.criticalMissing.length > 0 ? "#f44336" : "#4caf50" }}
              />
            </div>
            <div
              className="text-3xl font-bold"
              style={{ color: statistics.criticalMissing.length > 0 ? "#f44336" : "#4caf50" }}
            >
              {statistics.criticalMissing.length}
            </div>
            <div className="text-sm mt-1" style={{ color: "#8a8a8a" }}>
              {statistics.criticalMissing.length === 0 ? "Alles im grünen Bereich!" : "Aktion erforderlich"}
            </div>
          </div>

          {/* In Entwicklung */}
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: "#8a8a8a" }}>
                In Entwicklung
              </span>
              <FaCogs style={{ color: "#ffd700" }} />
            </div>
            <div className="text-3xl font-bold" style={{ color: "#ffd700" }}>
              {statistics.byStatus.in_progress || 0}
            </div>
            <div className="text-sm mt-1" style={{ color: "#8a8a8a" }}>
              {statistics.byStatus.planned || 0} geplant
            </div>
          </div>
        </div>
      )}

      {/* Status-Übersicht */}
      {statistics && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
        >
          <h3 className="text-sm font-medium mb-3" style={{ color: "#8a8a8a" }}>
            Status-Übersicht
          </h3>
          <div className="flex flex-wrap gap-4">
            {(Object.entries(STATUS_CONFIG) as [ModuleStatus, typeof STATUS_CONFIG[ModuleStatus]][]).map(
              ([status, config]) => (
                <div
                  key={status}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <span style={{ color: config.color }}>{config.icon}</span>
                  <span className="text-sm" style={{ color: config.color }}>
                    {config.label}: {statistics.byStatus[status] || 0}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Filter */}
      <div
        className="mb-6 p-4 rounded-lg border"
        style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Suche */}
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: "#8a8a8a" }}
            />
            <input
              type="text"
              placeholder="Module suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-[#ffd700]"
              style={{
                backgroundColor: "#1a1d23",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
          </div>

          {/* Kategorie-Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ModuleCategory | "all")}
            className="px-4 py-2 rounded-lg border focus:outline-none focus:border-[#ffd700]"
            style={{
              backgroundColor: "#1a1d23",
              borderColor: "#272a33",
              color: "#f4f4f4",
            }}
          >
            <option value="all">Alle Kategorien</option>
            {(Object.entries(CATEGORY_CONFIG) as [ModuleCategory, typeof CATEGORY_CONFIG[ModuleCategory]][]).map(
              ([cat, config]) => (
                <option key={cat} value={cat}>
                  {config.label}
                </option>
              )
            )}
          </select>

          {/* Status-Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ModuleStatus | "all")}
            className="px-4 py-2 rounded-lg border focus:outline-none focus:border-[#ffd700]"
            style={{
              backgroundColor: "#1a1d23",
              borderColor: "#272a33",
              color: "#f4f4f4",
            }}
          >
            <option value="all">Alle Status</option>
            {(Object.entries(STATUS_CONFIG) as [ModuleStatus, typeof STATUS_CONFIG[ModuleStatus]][]).map(
              ([status, config]) => (
                <option key={status} value={status}>
                  {config.label}
                </option>
              )
            )}
          </select>

          {/* Priorität-Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as ModulePriority | "all")}
            className="px-4 py-2 rounded-lg border focus:outline-none focus:border-[#ffd700]"
            style={{
              backgroundColor: "#1a1d23",
              borderColor: "#272a33",
              color: "#f4f4f4",
            }}
          >
            <option value="all">Alle Prioritäten</option>
            {(Object.entries(PRIORITY_CONFIG) as [ModulePriority, typeof PRIORITY_CONFIG[ModulePriority]][]).map(
              ([prio, config]) => (
                <option key={prio} value={prio}>
                  {config.label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Module nach Kategorie gruppiert */}
      {Object.entries(groupedModules).map(([category, categoryModules]) => {
        const catConfig = CATEGORY_CONFIG[category as ModuleCategory];
        return (
          <div key={category} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: catConfig.color }}>{catConfig.icon}</span>
              <h2 className="text-lg font-semibold" style={{ color: "#f4f4f4" }}>
                {catConfig.label}
              </h2>
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ backgroundColor: "#272a33", color: "#8a8a8a" }}
              >
                {categoryModules.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryModules.map((module) => {
                const statusConfig = STATUS_CONFIG[module.status];
                const priorityConfig = PRIORITY_CONFIG[module.priority];

                return (
                  <div
                    key={module.id}
                    className="p-4 rounded-lg border transition-all hover:border-[#ffd700]"
                    style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-mono px-2 py-0.5 rounded"
                            style={{ backgroundColor: "#272a33", color: "#8a8a8a" }}
                          >
                            {module.module_code}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: priorityConfig.color + "20", color: priorityConfig.color }}
                          >
                            {priorityConfig.label}
                          </span>
                        </div>
                        <h3 className="font-medium mt-1" style={{ color: "#f4f4f4" }}>
                          {module.name}
                        </h3>
                      </div>
                      <span style={{ color: statusConfig.color }}>{statusConfig.icon}</span>
                    </div>

                    {/* Beschreibung */}
                    <p className="text-sm mb-3" style={{ color: "#8a8a8a" }}>
                      {module.description}
                    </p>

                    {/* Fortschritt */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span style={{ color: "#8a8a8a" }}>Fortschritt</span>
                        <span style={{ color: statusConfig.color }}>{module.progress_percent}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#272a33" }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${module.progress_percent}%`,
                            backgroundColor: statusConfig.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
                      >
                        {statusConfig.label}
                      </span>

                      {/* Links */}
                      <div className="flex items-center gap-2">
                        {module.ui_path && (
                          <a
                            href={module.ui_path}
                            className="text-xs px-2 py-1 rounded hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: "#272a33", color: "#007bff" }}
                          >
                            UI →
                          </a>
                        )}
                        {module.api_path && (
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: "#272a33", color: "#20c997" }}
                          >
                            API
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Keine Module gefunden */}
      {filteredModules.length === 0 && (
        <div
          className="p-8 rounded-lg border text-center"
          style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
        >
          <FaSearch className="mx-auto text-4xl mb-4" style={{ color: "#8a8a8a" }} />
          <p style={{ color: "#8a8a8a" }}>Keine Module gefunden.</p>
          <p className="text-sm mt-1" style={{ color: "#666" }}>
            Versuche die Filter anzupassen oder synchronisiere die Roadmap.
          </p>
        </div>
      )}

      {/* Kritische Lücken */}
      {statistics && statistics.criticalMissing.length > 0 && (
        <div
          className="mt-6 p-4 rounded-lg border"
          style={{ backgroundColor: "#3a1f1f", borderColor: "#f44336" }}
        >
          <h3 className="font-medium mb-3 flex items-center gap-2" style={{ color: "#f44336" }}>
            <FaExclamationTriangle />
            Kritische Module - Aktion erforderlich
          </h3>
          <div className="space-y-2">
            {statistics.criticalMissing.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-2 rounded"
                style={{ backgroundColor: "#2a1f1f" }}
              >
                <div>
                  <span className="font-mono text-xs mr-2" style={{ color: "#8a8a8a" }}>
                    {module.module_code}
                  </span>
                  <span style={{ color: "#f4f4f4" }}>{module.name}</span>
                </div>
                <span className="text-sm" style={{ color: "#ffd700" }}>
                  {module.progress_percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}












