"use client";

// =====================================================
// AI CENTER - SETTINGS PAGE
// =====================================================
// /admin/ai/settings
// Enterprise++ Konfigurationsverwaltung
// =====================================================

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FaCog,
  FaArrowLeft,
  FaSave,
  FaUndo,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRobot,
  FaEuroSign,
  FaClock,
  FaShieldAlt,
  FaDatabase,
  FaPlay,
  FaBook,
  FaChartLine,
  FaLock,
  FaToggleOn,
  FaToggleOff
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

interface AISettings {
  ai_center_enabled: boolean;
  demo_mode: boolean;
  default_provider: string;
  openai_enabled: boolean;
  anthropic_enabled: boolean;
  local_enabled: boolean;
  cost_limit_daily: number;
  cost_limit_monthly: number;
  cost_warning_threshold: number;
  rate_limit_per_minute: number;
  rate_limit_per_hour: number;
  rate_limit_per_day: number;
  timeout_quick_ms: number;
  timeout_normal_ms: number;
  timeout_long_ms: number;
  agent_a_enabled: boolean;
  agent_b_enabled: boolean;
  agent_c_enabled: boolean;
  auto_planning_enabled: boolean;
  workflows_enabled: boolean;
  auto_trigger_enabled: boolean;
  playbooks_enabled: boolean;
  dry_run_default: boolean;
  monitoring_interval_seconds: number;
  health_check_enabled: boolean;
  audit_enabled: boolean;
  audit_retention_days: number;
  dsgvo_strict_mode: boolean;
  require_consent_for_ai: boolean;
}

interface CostStatus {
  allowed: boolean;
  current_daily: number;
  current_monthly: number;
  limit_daily: number;
  limit_monthly: number;
  warning: boolean;
}

// =====================================================
// SETTINGS KATEGORIEN
// =====================================================

const SETTING_CATEGORIES = [
  {
    id: "general",
    title: "Allgemein",
    icon: FaCog,
    color: "text-gray-400",
    settings: ["ai_center_enabled", "demo_mode"]
  },
  {
    id: "providers",
    title: "AI Provider",
    icon: FaRobot,
    color: "text-purple-400",
    settings: ["default_provider", "openai_enabled", "anthropic_enabled", "local_enabled"]
  },
  {
    id: "costs",
    title: "Kosten-Limits",
    icon: FaEuroSign,
    color: "text-green-400",
    settings: ["cost_limit_daily", "cost_limit_monthly", "cost_warning_threshold"]
  },
  {
    id: "rate_limits",
    title: "Rate-Limits",
    icon: FaClock,
    color: "text-blue-400",
    settings: ["rate_limit_per_minute", "rate_limit_per_hour", "rate_limit_per_day"]
  },
  {
    id: "timeouts",
    title: "Timeouts",
    icon: FaClock,
    color: "text-orange-400",
    settings: ["timeout_quick_ms", "timeout_normal_ms", "timeout_long_ms"]
  },
  {
    id: "agents",
    title: "Agenten",
    icon: FaRobot,
    color: "text-amber-400",
    settings: ["agent_a_enabled", "agent_b_enabled", "agent_c_enabled", "auto_planning_enabled"]
  },
  {
    id: "workflows",
    title: "Workflows",
    icon: FaPlay,
    color: "text-cyan-400",
    settings: ["workflows_enabled", "auto_trigger_enabled"]
  },
  {
    id: "playbooks",
    title: "Playbooks",
    icon: FaBook,
    color: "text-red-400",
    settings: ["playbooks_enabled", "dry_run_default"]
  },
  {
    id: "monitoring",
    title: "Monitoring",
    icon: FaChartLine,
    color: "text-indigo-400",
    settings: ["monitoring_interval_seconds", "health_check_enabled"]
  },
  {
    id: "audit",
    title: "Audit & Logging",
    icon: FaDatabase,
    color: "text-yellow-400",
    settings: ["audit_enabled", "audit_retention_days"]
  },
  {
    id: "dsgvo",
    title: "DSGVO & Compliance",
    icon: FaShieldAlt,
    color: "text-emerald-400",
    settings: ["dsgvo_strict_mode", "require_consent_for_ai"]
  }
];

const SETTING_LABELS: Record<string, { label: string; description: string; type: "boolean" | "number" | "select" }> = {
  ai_center_enabled: { label: "AI Center aktiviert", description: "Hauptschalter für das AI Center", type: "boolean" },
  demo_mode: { label: "Demo-Modus", description: "Keine echten KI-API-Calls (simuliert)", type: "boolean" },
  default_provider: { label: "Standard-Provider", description: "Bevorzugter AI-Provider", type: "select" },
  openai_enabled: { label: "OpenAI aktiviert", description: "OpenAI API verwenden", type: "boolean" },
  anthropic_enabled: { label: "Anthropic aktiviert", description: "Anthropic Claude API verwenden", type: "boolean" },
  local_enabled: { label: "Lokale LLMs aktiviert", description: "Lokale Modelle verwenden", type: "boolean" },
  cost_limit_daily: { label: "Tageslimit (€)", description: "Maximale Kosten pro Tag", type: "number" },
  cost_limit_monthly: { label: "Monatslimit (€)", description: "Maximale Kosten pro Monat", type: "number" },
  cost_warning_threshold: { label: "Warn-Schwelle (%)", description: "Warnung ab diesem Prozent", type: "number" },
  rate_limit_per_minute: { label: "Requests/Minute", description: "Max. Requests pro Minute", type: "number" },
  rate_limit_per_hour: { label: "Requests/Stunde", description: "Max. Requests pro Stunde", type: "number" },
  rate_limit_per_day: { label: "Requests/Tag", description: "Max. Requests pro Tag", type: "number" },
  timeout_quick_ms: { label: "Quick Timeout (ms)", description: "Timeout für schnelle Operationen", type: "number" },
  timeout_normal_ms: { label: "Normal Timeout (ms)", description: "Timeout für Standard-Operationen", type: "number" },
  timeout_long_ms: { label: "Long Timeout (ms)", description: "Timeout für lange Operationen", type: "number" },
  agent_a_enabled: { label: "Agent-A (Planner)", description: "Planungs-Agent aktiviert", type: "boolean" },
  agent_b_enabled: { label: "Agent-B (Builder)", description: "Code-Generator aktiviert", type: "boolean" },
  agent_c_enabled: { label: "Agent-C (Reviewer)", description: "Review-Agent aktiviert", type: "boolean" },
  auto_planning_enabled: { label: "Auto-Planung", description: "Automatisch planen bei Task-Erstellung", type: "boolean" },
  workflows_enabled: { label: "Workflows aktiviert", description: "Auto-Workflow-System", type: "boolean" },
  auto_trigger_enabled: { label: "Auto-Trigger aktiviert", description: "Automatische Workflow-Auslösung", type: "boolean" },
  playbooks_enabled: { label: "Playbooks aktiviert", description: "Playbook-System", type: "boolean" },
  dry_run_default: { label: "Dry-Run Standard", description: "Playbooks standardmäßig simulieren", type: "boolean" },
  monitoring_interval_seconds: { label: "Monitor-Intervall (s)", description: "Aktualisierungs-Intervall", type: "number" },
  health_check_enabled: { label: "Health-Checks", description: "Automatische Gesundheitsprüfung", type: "boolean" },
  audit_enabled: { label: "Audit-Logging", description: "Alle Aktionen protokollieren", type: "boolean" },
  audit_retention_days: { label: "Log-Aufbewahrung (Tage)", description: "Wie lange Logs behalten werden", type: "number" },
  dsgvo_strict_mode: { label: "DSGVO Strict-Mode", description: "Strenge DSGVO-Prüfungen", type: "boolean" },
  require_consent_for_ai: { label: "KI-Consent erforderlich", description: "Einwilligung vor KI-Verarbeitung", type: "boolean" }
};

// =====================================================
// KOMPONENTE
// =====================================================

export default function SettingsPage() {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [originalSettings, setOriginalSettings] = useState<AISettings | null>(null);
  const [costStatus, setCostStatus] = useState<CostStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("general");

  // Settings laden
  const loadSettings = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/ai/settings");
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data.settings);
        setOriginalSettings(data.data.settings);
        setCostStatus(data.data.cost_status);
      } else {
        setError(data.error || "Fehler beim Laden");
      }
    } catch (err) {
      setError("Verbindungsfehler");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Settings speichern
  const saveSettings = async () => {
    if (!settings || !originalSettings) return;
    
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Nur geänderte Settings senden
      const changes: Partial<AISettings> = {};
      for (const [key, value] of Object.entries(settings)) {
        if (JSON.stringify(value) !== JSON.stringify((originalSettings as any)[key])) {
          (changes as any)[key] = value;
        }
      }
      
      if (Object.keys(changes).length === 0) {
        setSuccessMessage("Keine Änderungen vorhanden");
        setSaving(false);
        return;
      }
      
      const response = await fetch("/api/admin/ai/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: changes })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
        setOriginalSettings(data.data);
        setSuccessMessage(`${Object.keys(changes).length} Einstellungen gespeichert`);
      } else {
        setError(data.error || "Fehler beim Speichern");
      }
    } catch (err) {
      setError("Verbindungsfehler");
    } finally {
      setSaving(false);
    }
  };

  // Änderungen zurücksetzen
  const resetChanges = () => {
    if (originalSettings) {
      setSettings({ ...originalSettings });
      setSuccessMessage("Änderungen verworfen");
    }
  };

  // Auf Defaults zurücksetzen
  const resetToDefaults = async () => {
    if (!confirm("Alle Einstellungen auf Standardwerte zurücksetzen?")) return;
    
    setSaving(true);
    try {
      const response = await fetch("/api/admin/ai/settings", { method: "DELETE" });
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
        setOriginalSettings(data.data);
        setSuccessMessage("Auf Standardwerte zurückgesetzt");
      } else {
        setError(data.error || "Fehler");
      }
    } catch (err) {
      setError("Verbindungsfehler");
    } finally {
      setSaving(false);
    }
  };

  // Setting-Wert ändern
  const updateSetting = (key: keyof AISettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
    setSuccessMessage(null);
  };

  // Prüfen ob Änderungen vorhanden
  const hasChanges = settings && originalSettings && 
    JSON.stringify(settings) !== JSON.stringify(originalSettings);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050509] flex items-center justify-center">
        <FaSpinner className="h-8 w-8 text-[#ffd700] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050509] text-[#f4f4f4]">
      {/* Header */}
      <div className="border-b border-[#272a33] bg-[#111217] px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/ai"
              className="p-2 hover:bg-[#272a33] rounded-lg transition-colors"
            >
              <FaArrowLeft className="h-4 w-4 text-[#b3b3b3]" />
            </Link>
            <div className="p-3 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] rounded-xl">
              <FaCog className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#f4f4f4]">
                AI Center Einstellungen
              </h1>
              <p className="text-[#b3b3b3]">
                Enterprise++ Konfiguration
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {hasChanges && (
              <button
                onClick={resetChanges}
                className="flex items-center gap-2 px-4 py-2 bg-[#272a33] hover:bg-[#353840] rounded-lg transition-colors"
              >
                <FaUndo className="h-4 w-4" />
                Verwerfen
              </button>
            )}
            <button
              onClick={saveSettings}
              disabled={saving || !hasChanges}
              className="flex items-center gap-2 px-4 py-2 bg-[#ffd700] hover:bg-[#ffed4a] text-black font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              Speichern
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Kategorien */}
        <div className="w-64 border-r border-[#272a33] bg-[#111217] min-h-[calc(100vh-100px)]">
          <div className="p-4 space-y-1">
            {SETTING_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-[#ffd700]/10 text-[#ffd700]" 
                      : "text-[#b3b3b3] hover:bg-[#272a33] hover:text-[#f4f4f4]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#ffd700]" : cat.color}`} />
                  <span className="text-sm">{cat.title}</span>
                </button>
              );
            })}
          </div>
          
          {/* Kosten-Status */}
          {costStatus && (
            <div className="p-4 border-t border-[#272a33]">
              <h4 className="text-xs font-medium text-[#71717a] mb-2">KOSTEN-STATUS</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#b3b3b3]">Heute</span>
                  <span className={costStatus.current_daily > costStatus.limit_daily * 0.8 ? "text-yellow-400" : "text-green-400"}>
                    {costStatus.current_daily.toFixed(2)}€ / {costStatus.limit_daily}€
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#b3b3b3]">Monat</span>
                  <span className={costStatus.current_monthly > costStatus.limit_monthly * 0.8 ? "text-yellow-400" : "text-green-400"}>
                    {costStatus.current_monthly.toFixed(2)}€ / {costStatus.limit_monthly}€
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Reset to Defaults */}
          <div className="p-4 border-t border-[#272a33]">
            <button
              onClick={resetToDefaults}
              className="w-full text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Auf Defaults zurücksetzen
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <FaExclamationTriangle className="text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}
          
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3">
              <FaCheckCircle className="text-green-400" />
              <span className="text-green-400">{successMessage}</span>
            </div>
          )}

          {/* Active Category Settings */}
          {settings && SETTING_CATEGORIES.map((cat) => {
            if (cat.id !== activeCategory) return null;
            const Icon = cat.icon;
            
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-3 mb-6">
                  <Icon className={`h-6 w-6 ${cat.color}`} />
                  <h2 className="text-xl font-semibold">{cat.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {cat.settings.map((settingKey) => {
                    const config = SETTING_LABELS[settingKey];
                    if (!config) return null;
                    
                    const value = (settings as any)[settingKey];
                    
                    return (
                      <div 
                        key={settingKey}
                        className="flex items-center justify-between p-4 bg-[#111217] border border-[#272a33] rounded-xl"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-[#f4f4f4]">{config.label}</div>
                          <div className="text-sm text-[#71717a]">{config.description}</div>
                        </div>
                        
                        <div className="ml-4">
                          {config.type === "boolean" && (
                            <button
                              onClick={() => updateSetting(settingKey as keyof AISettings, !value)}
                              className={`p-2 rounded-lg transition-colors ${
                                value 
                                  ? "bg-green-400/10 text-green-400" 
                                  : "bg-[#272a33] text-[#71717a]"
                              }`}
                            >
                              {value ? (
                                <FaToggleOn className="h-6 w-6" />
                              ) : (
                                <FaToggleOff className="h-6 w-6" />
                              )}
                            </button>
                          )}
                          
                          {config.type === "number" && (
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => updateSetting(settingKey as keyof AISettings, Number(e.target.value))}
                              className="w-32 px-3 py-2 bg-[#0a0a0e] border border-[#272a33] rounded-lg text-right text-[#f4f4f4] focus:outline-none focus:border-[#ffd700]/50"
                            />
                          )}
                          
                          {config.type === "select" && settingKey === "default_provider" && (
                            <select
                              value={value}
                              onChange={(e) => updateSetting(settingKey as keyof AISettings, e.target.value)}
                              className="px-3 py-2 bg-[#0a0a0e] border border-[#272a33] rounded-lg text-[#f4f4f4] focus:outline-none focus:border-[#ffd700]/50"
                            >
                              <option value="openai">OpenAI</option>
                              <option value="anthropic">Anthropic</option>
                              <option value="local">Lokal</option>
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

