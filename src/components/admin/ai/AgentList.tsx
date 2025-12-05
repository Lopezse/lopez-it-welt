"use client";

// =====================================================
// AGENT LIST - Enterprise++ UI Component
// =====================================================
// Tabellenansicht aller KI-Agenten
// =====================================================

import { useState } from "react";
import { 
  FaToggleOn, 
  FaToggleOff, 
  FaShieldAlt,
  FaCode,
  FaImage,
  FaHeadset,
  FaChartLine,
  FaCog,
  FaBrain,
  FaSpinner,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown
} from "react-icons/fa";
import type { Agent } from "./AgentCard";

// =====================================================
// TYPEN
// =====================================================

interface AgentListProps {
  agents: Agent[];
  onToggle?: (name: string, newStatus: boolean) => void;
  onSelect?: (agent: Agent) => void;
  isLoading?: boolean;
}

type SortField = "name" | "type" | "risk_profile" | "enabled" | "capabilities_count";
type SortDirection = "asc" | "desc";

// =====================================================
// HELPER
// =====================================================

const TYPE_CONFIG: Record<string, { icon: typeof FaCode; color: string; label: string }> = {
  dev: { icon: FaCode, color: "text-blue-400", label: "Entwicklung" },
  media: { icon: FaImage, color: "text-purple-400", label: "Medien" },
  doc: { icon: FaBrain, color: "text-green-400", label: "Dokumentation" },
  support: { icon: FaHeadset, color: "text-orange-400", label: "Support" },
  business: { icon: FaChartLine, color: "text-yellow-400", label: "Business" },
  monitoring: { icon: FaChartLine, color: "text-cyan-400", label: "Monitoring" },
  admin: { icon: FaCog, color: "text-gray-400", label: "Admin" },
  orchestrator: { icon: FaBrain, color: "text-amber-400", label: "Orchestrator" },
};

const RISK_CONFIG: Record<string, { color: string; label: string }> = {
  low: { color: "text-green-400", label: "Niedrig" },
  medium: { color: "text-yellow-400", label: "Mittel" },
  high: { color: "text-red-400", label: "Hoch" },
};

// =====================================================
// KOMPONENTE
// =====================================================

export function AgentList({ agents, onToggle, onSelect, isLoading = false }: AgentListProps) {
  const [togglingAgent, setTogglingAgent] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  // Sortierung
  const sortedAgents = [...agents].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "type":
        comparison = a.type.localeCompare(b.type);
        break;
      case "risk_profile":
        const riskOrder = { low: 0, medium: 1, high: 2 };
        comparison = riskOrder[a.risk_profile] - riskOrder[b.risk_profile];
        break;
      case "enabled":
        comparison = (a.enabled ? 1 : 0) - (b.enabled ? 1 : 0);
        break;
      case "capabilities_count":
        comparison = (a.capabilities_count || 0) - (b.capabilities_count || 0);
        break;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const handleToggle = async (name: string, enabled: boolean) => {
    if (!onToggle || togglingAgent) return;
    
    setTogglingAgent(name);
    try {
      await onToggle(name, !enabled);
    } finally {
      setTogglingAgent(null);
    }
  };
  
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <FaSort className="h-3 w-3 text-[#b3b3b3]/50" />;
    return sortDirection === "asc" 
      ? <FaSortUp className="h-3 w-3 text-[#ffd700]" />
      : <FaSortDown className="h-3 w-3 text-[#ffd700]" />;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="h-8 w-8 text-[#ffd700] animate-spin" />
      </div>
    );
  }
  
  if (agents.length === 0) {
    return (
      <div className="text-center py-12 text-[#b3b3b3]">
        <FaBrain className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Keine Agenten gefunden</p>
      </div>
    );
  }
  
  return (
    <div className="bg-[#111217] border border-[#272a33] rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#0a0a0e]">
          <tr>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-[#b3b3b3] uppercase tracking-wider cursor-pointer hover:text-[#f4f4f4]"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-2">
                Agent
                <SortIcon field="name" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-[#b3b3b3] uppercase tracking-wider cursor-pointer hover:text-[#f4f4f4]"
              onClick={() => handleSort("type")}
            >
              <div className="flex items-center gap-2">
                Typ
                <SortIcon field="type" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-[#b3b3b3] uppercase tracking-wider cursor-pointer hover:text-[#f4f4f4]"
              onClick={() => handleSort("risk_profile")}
            >
              <div className="flex items-center gap-2">
                Risiko
                <SortIcon field="risk_profile" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-[#b3b3b3] uppercase tracking-wider cursor-pointer hover:text-[#f4f4f4]"
              onClick={() => handleSort("capabilities_count")}
            >
              <div className="flex items-center gap-2">
                Fähigkeiten
                <SortIcon field="capabilities_count" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-[#b3b3b3] uppercase tracking-wider cursor-pointer hover:text-[#f4f4f4]"
              onClick={() => handleSort("enabled")}
            >
              <div className="flex items-center gap-2">
                Status
                <SortIcon field="enabled" />
              </div>
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#b3b3b3] uppercase tracking-wider">
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#272a33]">
          {sortedAgents.map((agent) => {
            const typeConfig = TYPE_CONFIG[agent.type] || TYPE_CONFIG.dev;
            const riskConfig = RISK_CONFIG[agent.risk_profile] || RISK_CONFIG.medium;
            const TypeIcon = typeConfig.icon;
            
            return (
              <tr 
                key={agent.id}
                className={`hover:bg-[#272a33]/30 transition-colors ${
                  !agent.enabled ? "opacity-60" : ""
                }`}
              >
                {/* Agent Name */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${typeConfig.color.replace("text-", "bg-")}/10 rounded-lg`}>
                      <TypeIcon className={`h-4 w-4 ${typeConfig.color}`} />
                    </div>
                    <div>
                      <div className="font-medium text-[#f4f4f4]">{agent.name}</div>
                      {agent.description && (
                        <div className="text-xs text-[#b3b3b3] max-w-xs truncate">
                          {agent.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                
                {/* Typ */}
                <td className="px-4 py-4">
                  <span className={`text-sm ${typeConfig.color}`}>
                    {typeConfig.label}
                  </span>
                </td>
                
                {/* Risiko */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <FaShieldAlt className={`h-3 w-3 ${riskConfig.color}`} />
                    <span className={`text-sm ${riskConfig.color}`}>
                      {riskConfig.label}
                    </span>
                  </div>
                </td>
                
                {/* Fähigkeiten */}
                <td className="px-4 py-4">
                  <span className="text-sm text-[#b3b3b3]">
                    {agent.capabilities_count || 0}
                  </span>
                </td>
                
                {/* Status */}
                <td className="px-4 py-4">
                  {agent.enabled ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-400/10 rounded text-xs text-green-400">
                      Aktiv
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-400/10 rounded text-xs text-red-400">
                      Inaktiv
                    </span>
                  )}
                </td>
                
                {/* Aktionen */}
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Toggle Button */}
                    <button
                      onClick={() => handleToggle(agent.name, agent.enabled)}
                      disabled={togglingAgent === agent.name}
                      className="p-2 hover:bg-[#272a33] rounded-lg transition-colors"
                      title={agent.enabled ? "Deaktivieren" : "Aktivieren"}
                    >
                      {togglingAgent === agent.name ? (
                        <FaSpinner className="h-4 w-4 text-[#b3b3b3] animate-spin" />
                      ) : agent.enabled ? (
                        <FaToggleOn className="h-4 w-4 text-green-400" />
                      ) : (
                        <FaToggleOff className="h-4 w-4 text-[#b3b3b3]" />
                      )}
                    </button>
                    
                    {/* Details Button */}
                    <button
                      onClick={() => onSelect?.(agent)}
                      className="p-2 hover:bg-[#272a33] rounded-lg transition-colors"
                      title="Details anzeigen"
                    >
                      <FaEye className="h-4 w-4 text-[#b3b3b3] hover:text-[#f4f4f4]" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AgentList;

