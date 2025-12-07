"use client";

// =====================================================
// AI CENTER - PLAYBOOKS BIBLIOTHEK
// =====================================================
// /admin/ai/playbooks
// Enterprise++ Playbook-System
// =====================================================

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FaBook,
  FaArrowLeft,
  FaShieldAlt,
  FaUniversalAccess,
  FaRocket,
  FaCode,
  FaExclamationTriangle,
  FaFilter,
  FaSearch,
  FaPlay,
  FaEye,
  FaSpinner,
  FaCheckCircle,
  FaTimes,
  FaClock,
  FaList
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

interface PlaybookStep {
  order: number;
  title: string;
  description: string;
  action_type: "manual" | "automated" | "verification";
  expected_duration?: string;
}

interface Playbook {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  status: string;
  version: string;
  steps: PlaybookStep[];
  tags: string[];
  estimated_duration: string;
  risk_level: string;
  run_count: number;
  created_at: string;
}

// =====================================================
// KONFIGURATION
// =====================================================

const CATEGORY_CONFIG: Record<string, { icon: typeof FaShieldAlt; color: string; bgColor: string; label: string }> = {
  security: { icon: FaShieldAlt, color: "text-red-400", bgColor: "bg-red-400/10", label: "Sicherheit" },
  accessibility: { icon: FaUniversalAccess, color: "text-blue-400", bgColor: "bg-blue-400/10", label: "Barrierefreiheit" },
  performance: { icon: FaRocket, color: "text-purple-400", bgColor: "bg-purple-400/10", label: "Performance" },
  quality: { icon: FaCode, color: "text-green-400", bgColor: "bg-green-400/10", label: "Qualität" },
  incident: { icon: FaExclamationTriangle, color: "text-orange-400", bgColor: "bg-orange-400/10", label: "Incident" },
  documentation: { icon: FaBook, color: "text-cyan-400", bgColor: "bg-cyan-400/10", label: "Dokumentation" },
  compliance: { icon: FaCheckCircle, color: "text-yellow-400", bgColor: "bg-yellow-400/10", label: "Compliance" },
  maintenance: { icon: FaClock, color: "text-gray-400", bgColor: "bg-gray-400/10", label: "Wartung" }
};

const RISK_CONFIG: Record<string, { color: string; label: string }> = {
  low: { color: "text-green-400", label: "Niedrig" },
  medium: { color: "text-yellow-400", label: "Mittel" },
  high: { color: "text-red-400", label: "Hoch" }
};

// =====================================================
// KOMPONENTE
// =====================================================

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [executing, setExecuting] = useState<string | null>(null);

  // Playbooks laden
  const loadPlaybooks = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/ai/playbooks");
      const data = await response.json();
      
      if (data.success) {
        setPlaybooks(data.data.playbooks || []);
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
    loadPlaybooks();
  }, [loadPlaybooks]);

  // Playbook ausführen (Dry-Run)
  const executePlaybook = async (code: string, dryRun: boolean = true) => {
    setExecuting(code);
    
    try {
      const response = await fetch(`/api/admin/ai/playbooks/${code}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dry_run: dryRun, executed_by: "admin-ui" })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Playbooks neu laden für aktuellen run_count
        await loadPlaybooks();
        alert(`${dryRun ? "[Dry-Run] " : ""}Playbook ${code} erfolgreich ausgeführt!`);
      } else {
        alert(`Fehler: ${data.error}`);
      }
    } catch (err) {
      alert("Ausführung fehlgeschlagen");
    } finally {
      setExecuting(null);
    }
  };

  // Gefilterte Playbooks
  const filteredPlaybooks = playbooks.filter(pb => {
    if (categoryFilter !== "all" && pb.category !== categoryFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        pb.code.toLowerCase().includes(query) ||
        pb.name.toLowerCase().includes(query) ||
        pb.description.toLowerCase().includes(query) ||
        pb.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Nach Kategorie gruppiert
  const groupedPlaybooks = filteredPlaybooks.reduce((acc, pb) => {
    if (!acc[pb.category]) acc[pb.category] = [];
    acc[pb.category].push(pb);
    return acc;
  }, {} as Record<string, Playbook[]>);

  // Kategorien für Filter
  const categories = [...new Set(playbooks.map(p => p.category))];

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
              <FaBook className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#f4f4f4]">
                Playbook-Bibliothek
              </h1>
              <p className="text-[#b3b3b3]">
                Enterprise++ Lösungstemplates
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#b3b3b3]">
              {playbooks.length} Playbooks verfügbar
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Filter & Suche */}
        <div className="mb-6 flex flex-wrap gap-4">
          {/* Suche */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Playbook suchen..."
                className="w-full pl-10 pr-4 py-2 bg-[#111217] border border-[#272a33] rounded-lg text-[#f4f4f4] placeholder-[#71717a] focus:outline-none focus:border-[#ffd700]/50"
              />
            </div>
          </div>
          
          {/* Kategorie-Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className="h-4 w-4 text-[#71717a]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-[#111217] border border-[#272a33] rounded-lg text-[#f4f4f4] focus:outline-none focus:border-[#ffd700]/50"
            >
              <option value="all">Alle Kategorien</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_CONFIG[cat]?.label || cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Playbooks nach Kategorie */}
        {Object.entries(groupedPlaybooks).map(([category, pbs]) => {
          const catConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.quality;
          const CatIcon = catConfig.icon;
          
          return (
            <div key={category} className="mb-8">
              {/* Kategorie-Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${catConfig.bgColor} rounded-lg`}>
                  <CatIcon className={`h-5 w-5 ${catConfig.color}`} />
                </div>
                <h2 className={`text-lg font-semibold ${catConfig.color}`}>
                  {catConfig.label}
                </h2>
                <span className="text-sm text-[#71717a]">({pbs.length})</span>
              </div>
              
              {/* Playbook-Karten */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pbs.map((pb) => {
                  const riskConfig = RISK_CONFIG[pb.risk_level] || RISK_CONFIG.medium;
                  
                  return (
                    <div 
                      key={pb.id}
                      className="bg-[#111217] border border-[#272a33] rounded-xl p-4 hover:border-[#ffd700]/30 transition-all"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="font-mono text-sm text-[#ffd700]">{pb.code}</span>
                          <h3 className="font-medium text-[#f4f4f4]">{pb.name}</h3>
                        </div>
                        <span className={`text-xs ${riskConfig.color}`}>
                          {riskConfig.label}
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-[#b3b3b3] line-clamp-2 mb-3">
                        {pb.description}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-[#71717a] mb-3">
                        <span className="flex items-center gap-1">
                          <FaList className="h-3 w-3" />
                          {pb.steps.length} Schritte
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="h-3 w-3" />
                          {pb.estimated_duration}
                        </span>
                        {pb.run_count > 0 && (
                          <span className="flex items-center gap-1">
                            <FaPlay className="h-3 w-3" />
                            {pb.run_count}x
                          </span>
                        )}
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pb.tags.slice(0, 3).map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-[#272a33] text-[#b3b3b3] rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {pb.tags.length > 3 && (
                          <span className="text-xs text-[#71717a]">+{pb.tags.length - 3}</span>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedPlaybook(pb)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#272a33] hover:bg-[#353840] rounded-lg text-sm transition-colors"
                        >
                          <FaEye className="h-3 w-3" />
                          Details
                        </button>
                        <button
                          onClick={() => executePlaybook(pb.code, true)}
                          disabled={executing === pb.code}
                          className="flex items-center justify-center gap-1 px-3 py-2 bg-[#ffd700]/10 hover:bg-[#ffd700]/20 text-[#ffd700] rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                          {executing === pb.code ? (
                            <FaSpinner className="h-3 w-3 animate-spin" />
                          ) : (
                            <FaPlay className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredPlaybooks.length === 0 && (
          <div className="text-center py-12 text-[#71717a]">
            Keine Playbooks gefunden
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPlaybook && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111217] border border-[#272a33] rounded-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#111217] border-b border-[#272a33] p-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-[#ffd700]">{selectedPlaybook.code}</span>
                <h3 className="text-lg font-semibold text-[#f4f4f4]">{selectedPlaybook.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPlaybook(null)}
                className="p-2 hover:bg-[#272a33] rounded-lg"
              >
                <FaTimes className="h-4 w-4 text-[#71717a]" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              {/* Description */}
              <p className="text-[#b3b3b3] mb-4">{selectedPlaybook.description}</p>
              
              {/* Meta */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-[#0a0a0e] rounded-lg">
                  <div className="text-xs text-[#71717a]">Dauer</div>
                  <div className="font-medium">{selectedPlaybook.estimated_duration}</div>
                </div>
                <div className="p-3 bg-[#0a0a0e] rounded-lg">
                  <div className="text-xs text-[#71717a]">Risiko</div>
                  <div className={`font-medium ${RISK_CONFIG[selectedPlaybook.risk_level]?.color}`}>
                    {RISK_CONFIG[selectedPlaybook.risk_level]?.label}
                  </div>
                </div>
                <div className="p-3 bg-[#0a0a0e] rounded-lg">
                  <div className="text-xs text-[#71717a]">Ausführungen</div>
                  <div className="font-medium">{selectedPlaybook.run_count}</div>
                </div>
              </div>
              
              {/* Steps */}
              <h4 className="font-semibold text-[#f4f4f4] mb-3">Schritte</h4>
              <div className="space-y-3 mb-6">
                {selectedPlaybook.steps.map((step) => (
                  <div 
                    key={step.order}
                    className="flex gap-4 p-3 bg-[#0a0a0e] rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-[#ffd700]/10 text-[#ffd700] rounded-full flex items-center justify-center font-medium">
                      {step.order}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#f4f4f4]">{step.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          step.action_type === "automated" 
                            ? "bg-green-400/10 text-green-400"
                            : step.action_type === "verification"
                              ? "bg-blue-400/10 text-blue-400"
                              : "bg-gray-400/10 text-gray-400"
                        }`}>
                          {step.action_type === "automated" ? "Automatisch" : step.action_type === "verification" ? "Prüfung" : "Manuell"}
                        </span>
                        {step.expected_duration && (
                          <span className="text-xs text-[#71717a]">{step.expected_duration}</span>
                        )}
                      </div>
                      <p className="text-sm text-[#b3b3b3]">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    executePlaybook(selectedPlaybook.code, true);
                    setSelectedPlaybook(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#ffd700] hover:bg-[#ffed4a] text-black font-medium rounded-lg transition-colors"
                >
                  <FaPlay className="h-4 w-4" />
                  Dry-Run starten
                </button>
                <button
                  onClick={() => setSelectedPlaybook(null)}
                  className="px-4 py-2 bg-[#272a33] hover:bg-[#353840] text-[#f4f4f4] rounded-lg transition-colors"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







