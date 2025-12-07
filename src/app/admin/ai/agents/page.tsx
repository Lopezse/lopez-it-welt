"use client";

// =====================================================
// AI CENTER - AGENT REGISTRY PAGE
// =====================================================
// /admin/ai/agents
// Enterprise++ Agenten-Verwaltung
// =====================================================

import { useState, useEffect, useCallback } from "react";
import { 
  FaRobot, 
  FaSyncAlt, 
  FaThLarge, 
  FaList,
  FaPlus,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaArrowLeft
} from "react-icons/fa";
import Link from "next/link";
import { AgentCard, type Agent } from "@/components/admin/ai/AgentCard";
import { AgentList } from "@/components/admin/ai/AgentList";

// =====================================================
// TYPEN
// =====================================================

interface AgentSummary {
  total: number;
  enabled: number;
  disabled: number;
  by_type: Record<string, number>;
  by_risk: Record<string, number>;
}

// =====================================================
// KOMPONENTE
// =====================================================

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [summary, setSummary] = useState<AgentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI-State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterEnabled, setFilterEnabled] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // =====================================================
  // DATEN LADEN
  // =====================================================
  
  const loadAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = "/api/admin/ai/agents?includeMetrics=true";
      
      if (filterType !== "all") {
        url += `&type=${filterType}`;
      }
      if (filterEnabled !== "all") {
        url += `&enabled=${filterEnabled === "enabled"}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setAgents(data.data.agents);
        setSummary(data.data.summary);
      } else {
        setError(data.error || "Fehler beim Laden");
      }
    } catch (err) {
      setError("Verbindungsfehler");
    } finally {
      setLoading(false);
    }
  }, [filterType, filterEnabled]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  // =====================================================
  // AGENT TOGGLE
  // =====================================================
  
  const handleToggle = async (name: string, newStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/ai/agents/${name}/toggle`, {
        method: "POST"
      });
      const data = await response.json();
      
      if (data.success) {
        // Lokalen State aktualisieren
        setAgents(prev => prev.map(a => 
          a.name === name ? { ...a, enabled: data.data.enabled } : a
        ));
        // Summary aktualisieren
        if (summary) {
          setSummary({
            ...summary,
            enabled: summary.enabled + (data.data.enabled ? 1 : -1),
            disabled: summary.disabled + (data.data.enabled ? -1 : 1)
          });
        }
      } else {
        alert(`Fehler: ${data.error}`);
      }
    } catch (err) {
      alert("Verbindungsfehler beim Umschalten");
    }
  };

  // =====================================================
  // AGENT AUSWÄHLEN
  // =====================================================
  
  const handleSelect = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  // =====================================================
  // RENDER
  // =====================================================
  
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
              <FaRobot className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#f4f4f4]">
                Agent Registry
              </h1>
              <p className="text-[#b3b3b3]">
                KI-Agenten verwalten und überwachen
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#272a33] rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-[#ffd700]/20 text-[#ffd700]" : "text-[#b3b3b3]"}`}
              >
                <FaThLarge className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-[#ffd700]/20 text-[#ffd700]" : "text-[#b3b3b3]"}`}
              >
                <FaList className="h-4 w-4" />
              </button>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={loadAgents}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#272a33] hover:bg-[#353840] rounded-lg transition-colors"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Aktualisieren
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#b3b3b3] text-sm">Gesamt</span>
                <FaRobot className="h-4 w-4 text-[#ffd700]" />
              </div>
              <div className="text-2xl font-bold text-[#f4f4f4]">{summary.total}</div>
              <div className="text-xs text-[#b3b3b3]">Registrierte Agenten</div>
            </div>
            
            <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#b3b3b3] text-sm">Aktiv</span>
                <FaCheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400">{summary.enabled}</div>
              <div className="text-xs text-[#b3b3b3]">Agenten aktiv</div>
            </div>
            
            <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#b3b3b3] text-sm">Inaktiv</span>
                <FaTimesCircle className="h-4 w-4 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-red-400">{summary.disabled}</div>
              <div className="text-xs text-[#b3b3b3]">Agenten deaktiviert</div>
            </div>
            
            <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#b3b3b3] text-sm">High Risk</span>
                <FaShieldAlt className="h-4 w-4 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-[#f4f4f4]">
                {summary.by_risk?.high || 0}
              </div>
              <div className="text-xs text-[#b3b3b3]">Hochrisiko-Agenten</div>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-[#111217] border border-[#272a33] rounded-xl">
          <div className="flex items-center gap-2">
            <FaFilter className="h-4 w-4 text-[#b3b3b3]" />
            <span className="text-sm text-[#b3b3b3]">Filter:</span>
          </div>
          
          {/* Typ-Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-[#272a33] border border-[#272a33] rounded-lg text-sm text-[#f4f4f4] focus:border-[#ffd700] outline-none"
          >
            <option value="all">Alle Typen</option>
            <option value="dev">Entwicklung</option>
            <option value="media">Medien</option>
            <option value="monitoring">Monitoring</option>
            <option value="orchestrator">Orchestrator</option>
            <option value="doc">Dokumentation</option>
            <option value="support">Support</option>
            <option value="business">Business</option>
            <option value="admin">Admin</option>
          </select>
          
          {/* Status-Filter */}
          <select
            value={filterEnabled}
            onChange={(e) => setFilterEnabled(e.target.value)}
            className="px-3 py-2 bg-[#272a33] border border-[#272a33] rounded-lg text-sm text-[#f4f4f4] focus:border-[#ffd700] outline-none"
          >
            <option value="all">Alle Status</option>
            <option value="enabled">Nur Aktive</option>
            <option value="disabled">Nur Inaktive</option>
          </select>
          
          {/* Ergebnis-Anzahl */}
          <div className="ml-auto text-sm text-[#b3b3b3]">
            {agents.length} Agenten gefunden
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Agenten-Ansicht */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              // Loading Skeleton
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#111217] border border-[#272a33] rounded-xl p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#272a33] rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-[#272a33] rounded w-24 mb-2" />
                      <div className="h-3 bg-[#272a33] rounded w-16" />
                    </div>
                  </div>
                  <div className="h-3 bg-[#272a33] rounded w-full mb-2" />
                  <div className="h-3 bg-[#272a33] rounded w-3/4" />
                </div>
              ))
            ) : (
              agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onToggle={handleToggle}
                  onSelect={handleSelect}
                  showMetrics={true}
                />
              ))
            )}
          </div>
        ) : (
          <AgentList
            agents={agents}
            onToggle={handleToggle}
            onSelect={handleSelect}
            isLoading={loading}
          />
        )}

        {/* Agent Detail Modal (einfach) */}
        {selectedAgent && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedAgent(null)}
          >
            <div 
              className="bg-[#111217] border border-[#272a33] rounded-xl p-6 max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#f4f4f4]">{selectedAgent.name}</h2>
                <button 
                  onClick={() => setSelectedAgent(null)}
                  className="text-[#b3b3b3] hover:text-[#f4f4f4]"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#b3b3b3]">Typ</label>
                  <p className="text-[#f4f4f4]">{selectedAgent.type}</p>
                </div>
                
                <div>
                  <label className="text-xs text-[#b3b3b3]">Beschreibung</label>
                  <p className="text-[#f4f4f4]">{selectedAgent.description || "-"}</p>
                </div>
                
                <div>
                  <label className="text-xs text-[#b3b3b3]">Risiko-Profil</label>
                  <p className={`${
                    selectedAgent.risk_profile === "high" ? "text-red-400" :
                    selectedAgent.risk_profile === "medium" ? "text-yellow-400" : "text-green-400"
                  }`}>
                    {selectedAgent.risk_profile}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs text-[#b3b3b3]">DSGVO-Scope</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAgent.dsgvo_scope?.map((scope, i) => (
                      <span key={i} className="px-2 py-1 bg-[#272a33] rounded text-xs text-[#b3b3b3]">
                        {scope}
                      </span>
                    )) || <span className="text-[#b3b3b3]">-</span>}
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-[#b3b3b3]">Status</label>
                  <p className={selectedAgent.enabled ? "text-green-400" : "text-red-400"}>
                    {selectedAgent.enabled ? "Aktiv" : "Inaktiv"}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="px-4 py-2 bg-[#272a33] hover:bg-[#353840] rounded-lg transition-colors"
                >
                  Schließen
                </button>
                <button
                  onClick={() => {
                    handleToggle(selectedAgent.name, selectedAgent.enabled);
                    setSelectedAgent(null);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedAgent.enabled 
                      ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                      : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                  }`}
                >
                  {selectedAgent.enabled ? "Deaktivieren" : "Aktivieren"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}







