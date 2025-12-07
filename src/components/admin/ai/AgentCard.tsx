"use client";

// =====================================================
// AGENT CARD - Enterprise++ UI Component
// =====================================================
// Zeigt einzelnen KI-Agenten als Karte
// =====================================================

import { useState } from "react";
import { 
  FaRobot, 
  FaToggleOn, 
  FaToggleOff, 
  FaShieldAlt,
  FaCode,
  FaImage,
  FaHeadset,
  FaChartLine,
  FaCog,
  FaBrain,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

export interface Agent {
  id: number;
  name: string;
  type: "media" | "dev" | "doc" | "support" | "business" | "monitoring" | "admin" | "orchestrator";
  description: string | null;
  dsgvo_scope: string[] | null;
  risk_profile: "low" | "medium" | "high";
  enabled: boolean;
  capabilities_count?: number;
  metrics?: {
    tasks_total: number;
    tasks_success: number;
    tasks_failed: number;
    total_cost: number;
  };
  created_at: string;
}

interface AgentCardProps {
  agent: Agent;
  onToggle?: (name: string, newStatus: boolean) => void;
  onSelect?: (agent: Agent) => void;
  showMetrics?: boolean;
}

// =====================================================
// HELPER
// =====================================================

const TYPE_CONFIG: Record<string, { icon: typeof FaRobot; color: string; bgColor: string; label: string }> = {
  dev: { icon: FaCode, color: "text-blue-400", bgColor: "bg-blue-400/10", label: "Entwicklung" },
  media: { icon: FaImage, color: "text-purple-400", bgColor: "bg-purple-400/10", label: "Medien" },
  doc: { icon: FaBrain, color: "text-green-400", bgColor: "bg-green-400/10", label: "Dokumentation" },
  support: { icon: FaHeadset, color: "text-orange-400", bgColor: "bg-orange-400/10", label: "Support" },
  business: { icon: FaChartLine, color: "text-yellow-400", bgColor: "bg-yellow-400/10", label: "Business" },
  monitoring: { icon: FaChartLine, color: "text-cyan-400", bgColor: "bg-cyan-400/10", label: "Monitoring" },
  admin: { icon: FaCog, color: "text-gray-400", bgColor: "bg-gray-400/10", label: "Admin" },
  orchestrator: { icon: FaBrain, color: "text-amber-400", bgColor: "bg-amber-400/10", label: "Orchestrator" },
};

const RISK_CONFIG: Record<string, { color: string; bgColor: string; label: string }> = {
  low: { color: "text-green-400", bgColor: "bg-green-400/10", label: "Niedrig" },
  medium: { color: "text-yellow-400", bgColor: "bg-yellow-400/10", label: "Mittel" },
  high: { color: "text-red-400", bgColor: "bg-red-400/10", label: "Hoch" },
};

// =====================================================
// KOMPONENTE
// =====================================================

export function AgentCard({ agent, onToggle, onSelect, showMetrics = false }: AgentCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  
  const typeConfig = TYPE_CONFIG[agent.type] || TYPE_CONFIG.dev;
  const riskConfig = RISK_CONFIG[agent.risk_profile] || RISK_CONFIG.medium;
  const TypeIcon = typeConfig.icon;
  
  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onToggle || isToggling) return;
    
    setIsToggling(true);
    try {
      await onToggle(agent.name, !agent.enabled);
    } finally {
      setIsToggling(false);
    }
  };
  
  const successRate = agent.metrics && agent.metrics.tasks_total > 0
    ? Math.round((agent.metrics.tasks_success / agent.metrics.tasks_total) * 100)
    : null;
  
  return (
    <div 
      className={`
        bg-[#111217] border rounded-xl p-5 transition-all cursor-pointer
        ${agent.enabled 
          ? "border-[#272a33] hover:border-[#ffd700]/50" 
          : "border-[#272a33]/50 opacity-60"
        }
      `}
      onClick={() => onSelect?.(agent)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 ${typeConfig.bgColor} rounded-lg`}>
            <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-[#f4f4f4]">{agent.name}</h3>
            <span className={`text-xs ${typeConfig.color}`}>{typeConfig.label}</span>
          </div>
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className="p-2 hover:bg-[#272a33] rounded-lg transition-colors"
          title={agent.enabled ? "Deaktivieren" : "Aktivieren"}
        >
          {isToggling ? (
            <FaSpinner className="h-5 w-5 text-[#b3b3b3] animate-spin" />
          ) : agent.enabled ? (
            <FaToggleOn className="h-5 w-5 text-green-400" />
          ) : (
            <FaToggleOff className="h-5 w-5 text-[#b3b3b3]" />
          )}
        </button>
      </div>
      
      {/* Beschreibung */}
      {agent.description && (
        <p className="text-sm text-[#b3b3b3] mb-4 line-clamp-2">
          {agent.description}
        </p>
      )}
      
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Risiko-Badge */}
        <div className={`flex items-center gap-1 px-2 py-1 ${riskConfig.bgColor} rounded text-xs`}>
          <FaShieldAlt className={`h-3 w-3 ${riskConfig.color}`} />
          <span className={riskConfig.color}>Risiko: {riskConfig.label}</span>
        </div>
        
        {/* Capabilities-Badge */}
        {agent.capabilities_count !== undefined && agent.capabilities_count > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-[#272a33] rounded text-xs">
            <FaCog className="h-3 w-3 text-[#b3b3b3]" />
            <span className="text-[#b3b3b3]">{agent.capabilities_count} Fähigkeiten</span>
          </div>
        )}
        
        {/* Status-Badge */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
          agent.enabled ? "bg-green-400/10" : "bg-red-400/10"
        }`}>
          {agent.enabled ? (
            <>
              <FaCheckCircle className="h-3 w-3 text-green-400" />
              <span className="text-green-400">Aktiv</span>
            </>
          ) : (
            <>
              <FaExclamationTriangle className="h-3 w-3 text-red-400" />
              <span className="text-red-400">Inaktiv</span>
            </>
          )}
        </div>
      </div>
      
      {/* Metriken (optional) */}
      {showMetrics && agent.metrics && (
        <div className="border-t border-[#272a33] pt-4 mt-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-[#f4f4f4]">
                {agent.metrics.tasks_total}
              </div>
              <div className="text-xs text-[#b3b3b3]">Tasks</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${
                successRate !== null && successRate >= 90 ? "text-green-400" : 
                successRate !== null && successRate >= 70 ? "text-yellow-400" : "text-red-400"
              }`}>
                {successRate !== null ? `${successRate}%` : "-"}
              </div>
              <div className="text-xs text-[#b3b3b3]">Erfolg</div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#f4f4f4]">
                {agent.metrics.total_cost.toFixed(2)}€
              </div>
              <div className="text-xs text-[#b3b3b3]">Kosten</div>
            </div>
          </div>
        </div>
      )}
      
      {/* DSGVO-Scope (klein) */}
      {agent.dsgvo_scope && agent.dsgvo_scope.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {agent.dsgvo_scope.slice(0, 3).map((scope, i) => (
            <span 
              key={i} 
              className="text-xs px-2 py-0.5 bg-[#272a33] rounded text-[#b3b3b3]"
            >
              {scope}
            </span>
          ))}
          {agent.dsgvo_scope.length > 3 && (
            <span className="text-xs px-2 py-0.5 bg-[#272a33] rounded text-[#b3b3b3]">
              +{agent.dsgvo_scope.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default AgentCard;







