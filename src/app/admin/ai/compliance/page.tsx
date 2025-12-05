"use client";

// =====================================================
// AI CENTER - COMPLIANCE DASHBOARD
// =====================================================
// /admin/ai/compliance
// EU AI Act, DSGVO, Model Registry
// =====================================================

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FaShieldAlt,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaRobot,
  FaFileAlt,
  FaEye,
  FaFilter,
  FaLock,
  FaGlobe,
  FaEuroSign
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

interface AIModel {
  id: number;
  code: string;
  name: string;
  provider: string;
  version: string;
  risk_category: string;
  risk_justification: string;
  dsfa_required: boolean;
  dsfa_document_url?: string;
  status: string;
  approved_by?: string;
  approved_at?: string;
  allowed_use_cases: string[];
  prohibited_use_cases: string[];
  requires_human_oversight: boolean;
  max_autonomy_level: number;
  gdpr_compliant: boolean;
  data_processing_location: string;
  cost_per_1k_input: number;
  cost_per_1k_output: number;
}

interface ComplianceWarning {
  model_code: string;
  model_name: string;
  warnings: string[];
}

// =====================================================
// KONFIGURATION
// =====================================================

const RISK_CONFIG = {
  minimal: { color: "text-green-400", bgColor: "bg-green-400/10", label: "Minimal", icon: FaCheckCircle },
  limited: { color: "text-blue-400", bgColor: "bg-blue-400/10", label: "Begrenzt", icon: FaShieldAlt },
  high: { color: "text-orange-400", bgColor: "bg-orange-400/10", label: "Hoch", icon: FaExclamationTriangle },
  unacceptable: { color: "text-red-400", bgColor: "bg-red-400/10", label: "Verboten", icon: FaTimesCircle }
};

const STATUS_CONFIG = {
  approved: { color: "text-green-400", label: "Freigegeben" },
  testing: { color: "text-blue-400", label: "In Test" },
  draft: { color: "text-gray-400", label: "Entwurf" },
  deprecated: { color: "text-yellow-400", label: "Veraltet" },
  blocked: { color: "text-red-400", label: "Blockiert" }
};

const PROVIDER_CONFIG: Record<string, { label: string; color: string }> = {
  openai: { label: "OpenAI", color: "text-emerald-400" },
  anthropic: { label: "Anthropic", color: "text-orange-400" },
  google: { label: "Google", color: "text-blue-400" },
  local: { label: "Lokal", color: "text-purple-400" }
};

// =====================================================
// KOMPONENTE
// =====================================================

export default function ComplianceDashboard() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [warnings, setWarnings] = useState<ComplianceWarning[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/ai/models");
      const data = await response.json();
      
      if (data.success) {
        setModels(data.data.models || []);
        setWarnings(data.data.warnings || []);
        setSummary(data.data.summary);
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
    loadData();
  }, [loadData]);

  // Gefilterte Modelle
  const filteredModels = models.filter(m => {
    if (riskFilter !== "all" && m.risk_category !== riskFilter) return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    return true;
  });

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
              <FaShieldAlt className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#f4f4f4]">
                Compliance Dashboard
              </h1>
              <p className="text-[#b3b3b3]">
                EU AI Act & DSGVO Konformität
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Warnungen */}
        {warnings.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <h3 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
              <FaExclamationTriangle />
              Compliance-Warnungen ({warnings.length})
            </h3>
            <div className="space-y-2">
              {warnings.map((w, i) => (
                <div key={i} className="text-sm text-yellow-300">
                  <span className="font-medium">{w.model_name}:</span> {w.warnings.join(", ")}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
              <div className="text-sm text-[#b3b3b3] mb-1">Registrierte Modelle</div>
              <div className="text-2xl font-bold text-[#f4f4f4]">{summary.total}</div>
              <div className="text-xs text-green-400 mt-1">
                {summary.by_status.approved} freigegeben
              </div>
            </div>
            
            <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
              <div className="text-sm text-[#b3b3b3] mb-1">Risiko-Verteilung</div>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 text-xs bg-green-400/10 text-green-400 rounded">
                  {summary.by_risk.minimal} Min
                </span>
                <span className="px-2 py-0.5 text-xs bg-blue-400/10 text-blue-400 rounded">
                  {summary.by_risk.limited} Lim
                </span>
                <span className="px-2 py-0.5 text-xs bg-orange-400/10 text-orange-400 rounded">
                  {summary.by_risk.high} Hoch
                </span>
              </div>
            </div>
            
            <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
              <div className="text-sm text-[#b3b3b3] mb-1">Provider</div>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 text-xs bg-emerald-400/10 text-emerald-400 rounded">
                  OpenAI: {summary.by_provider.openai}
                </span>
                <span className="px-2 py-0.5 text-xs bg-orange-400/10 text-orange-400 rounded">
                  Anth: {summary.by_provider.anthropic}
                </span>
              </div>
            </div>
            
            <div className={`bg-[#111217] border rounded-xl p-4 ${
              summary.warnings_count > 0 ? "border-yellow-400/50" : "border-[#272a33]"
            }`}>
              <div className="text-sm text-[#b3b3b3] mb-1">Compliance-Status</div>
              <div className={`text-2xl font-bold ${
                summary.warnings_count === 0 ? "text-green-400" : "text-yellow-400"
              }`}>
                {summary.warnings_count === 0 ? "Konform" : `${summary.warnings_count} Warnungen`}
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <FaFilter className="text-[#71717a]" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 bg-[#111217] border border-[#272a33] rounded-lg text-[#f4f4f4]"
            >
              <option value="all">Alle Risiken</option>
              <option value="minimal">Minimal</option>
              <option value="limited">Begrenzt</option>
              <option value="high">Hoch</option>
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#111217] border border-[#272a33] rounded-lg text-[#f4f4f4]"
          >
            <option value="all">Alle Status</option>
            <option value="approved">Freigegeben</option>
            <option value="testing">In Test</option>
            <option value="draft">Entwurf</option>
          </select>
        </div>

        {/* Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((model) => {
            const riskCfg = RISK_CONFIG[model.risk_category as keyof typeof RISK_CONFIG] || RISK_CONFIG.limited;
            const statusCfg = STATUS_CONFIG[model.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
            const providerCfg = PROVIDER_CONFIG[model.provider] || { label: model.provider, color: "text-gray-400" };
            const RiskIcon = riskCfg.icon;
            
            return (
              <div 
                key={model.id}
                className="bg-[#111217] border border-[#272a33] rounded-xl p-4 hover:border-[#ffd700]/30 transition-all cursor-pointer"
                onClick={() => setSelectedModel(model)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaRobot className={providerCfg.color} />
                      <span className="font-mono text-sm text-[#ffd700]">{model.code}</span>
                    </div>
                    <h3 className="font-medium text-[#f4f4f4]">{model.name}</h3>
                  </div>
                  <div className={`p-2 rounded-lg ${riskCfg.bgColor}`}>
                    <RiskIcon className={`h-4 w-4 ${riskCfg.color}`} />
                  </div>
                </div>
                
                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-0.5 text-xs rounded ${riskCfg.bgColor} ${riskCfg.color}`}>
                    EU AI: {riskCfg.label}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded bg-[#272a33] ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                </div>
                
                {/* Compliance Indicators */}
                <div className="flex items-center gap-3 text-xs text-[#71717a]">
                  <span className={`flex items-center gap-1 ${model.gdpr_compliant ? "text-green-400" : "text-red-400"}`}>
                    <FaLock className="h-3 w-3" />
                    DSGVO
                  </span>
                  <span className="flex items-center gap-1">
                    <FaGlobe className="h-3 w-3" />
                    {model.data_processing_location.split(" ")[0]}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEuroSign className="h-3 w-3" />
                    {((model.cost_per_1k_input + model.cost_per_1k_output) * 1000).toFixed(2)}€/1M
                  </span>
                </div>
                
                {/* Human Oversight */}
                {model.requires_human_oversight && (
                  <div className="mt-3 text-xs text-amber-400 flex items-center gap-1">
                    <FaEye className="h-3 w-3" />
                    Menschliche Aufsicht erforderlich
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-12 text-[#71717a]">
            Keine Modelle gefunden
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111217] border border-[#272a33] rounded-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[#111217] border-b border-[#272a33] p-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-[#ffd700]">{selectedModel.code}</span>
                <h3 className="text-lg font-semibold text-[#f4f4f4]">{selectedModel.name}</h3>
              </div>
              <button
                onClick={() => setSelectedModel(null)}
                className="p-2 hover:bg-[#272a33] rounded-lg text-[#71717a]"
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Risk Category */}
              <div className="p-4 bg-[#0a0a0e] rounded-lg">
                <h4 className="text-sm font-medium text-[#b3b3b3] mb-2">EU AI Act Klassifizierung</h4>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${
                  RISK_CONFIG[selectedModel.risk_category as keyof typeof RISK_CONFIG]?.bgColor
                } ${RISK_CONFIG[selectedModel.risk_category as keyof typeof RISK_CONFIG]?.color}`}>
                  {RISK_CONFIG[selectedModel.risk_category as keyof typeof RISK_CONFIG]?.label || selectedModel.risk_category}
                </div>
                <p className="mt-2 text-sm text-[#71717a]">{selectedModel.risk_justification}</p>
              </div>
              
              {/* Use Cases */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0a0a0e] rounded-lg">
                  <h4 className="text-sm font-medium text-green-400 mb-2">Erlaubte Anwendungen</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedModel.allowed_use_cases.map(uc => (
                      <span key={uc} className="px-2 py-0.5 text-xs bg-green-400/10 text-green-400 rounded">
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-[#0a0a0e] rounded-lg">
                  <h4 className="text-sm font-medium text-red-400 mb-2">Verbotene Anwendungen</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedModel.prohibited_use_cases.map(uc => (
                      <span key={uc} className="px-2 py-0.5 text-xs bg-red-400/10 text-red-400 rounded">
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Compliance Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#0a0a0e] rounded-lg">
                  <span className="text-xs text-[#71717a]">DSGVO-konform</span>
                  <div className={`font-medium ${selectedModel.gdpr_compliant ? "text-green-400" : "text-red-400"}`}>
                    {selectedModel.gdpr_compliant ? "Ja" : "Nein"}
                  </div>
                </div>
                <div className="p-3 bg-[#0a0a0e] rounded-lg">
                  <span className="text-xs text-[#71717a]">Datenverarbeitung</span>
                  <div className="font-medium text-[#f4f4f4]">{selectedModel.data_processing_location}</div>
                </div>
                <div className="p-3 bg-[#0a0a0e] rounded-lg">
                  <span className="text-xs text-[#71717a]">Human Oversight</span>
                  <div className={`font-medium ${selectedModel.requires_human_oversight ? "text-amber-400" : "text-green-400"}`}>
                    {selectedModel.requires_human_oversight ? "Erforderlich" : "Optional"}
                  </div>
                </div>
                <div className="p-3 bg-[#0a0a0e] rounded-lg">
                  <span className="text-xs text-[#71717a]">Autonomie-Level</span>
                  <div className="font-medium text-[#f4f4f4]">{selectedModel.max_autonomy_level}/5</div>
                </div>
              </div>
              
              {/* DSFA */}
              {selectedModel.dsfa_required && (
                <div className={`p-4 rounded-lg ${
                  selectedModel.dsfa_document_url 
                    ? "bg-green-400/10 border border-green-400/30" 
                    : "bg-red-400/10 border border-red-400/30"
                }`}>
                  <h4 className="font-medium mb-1">
                    Datenschutz-Folgenabschätzung (DSFA)
                  </h4>
                  {selectedModel.dsfa_document_url ? (
                    <a href={selectedModel.dsfa_document_url} className="text-sm text-green-400 hover:underline">
                      DSFA-Dokument anzeigen
                    </a>
                  ) : (
                    <span className="text-sm text-red-400">DSFA erforderlich aber nicht vorhanden!</span>
                  )}
                </div>
              )}
              
              {/* Approval */}
              {selectedModel.approved_by && (
                <div className="p-3 bg-[#0a0a0e] rounded-lg">
                  <span className="text-xs text-[#71717a]">Freigegeben von</span>
                  <div className="font-medium text-[#f4f4f4]">
                    {selectedModel.approved_by} 
                    {selectedModel.approved_at && ` (${new Date(selectedModel.approved_at).toLocaleDateString()})`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

