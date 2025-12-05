"use client";
// =====================================================
// ENTERPRISE++ AI CENTER DASHBOARD
// =====================================================

import { useState, useEffect } from "react";
import { 
  FaBrain, 
  FaRobot, 
  FaChartLine, 
  FaUsers, 
  FaProjectDiagram, 
  FaFileInvoice,
  FaImage,
  FaFileAlt,
  FaSpinner,
  FaSyncAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBook
} from "react-icons/fa";
import Link from "next/link";

interface AIUsageStats {
  period: string;
  totalRequests: number;
  successfulRequests: number;
  totalTokens: number;
  totalCost: number;
  avgResponseTime: number;
  byProvider: Record<string, number>;
  byEndpoint: Record<string, number>;
}

export default function AICenterPage() {
  const [stats, setStats] = useState<AIUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/ai/usage?days=30");
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Fehler beim Laden der AI-Statistiken");
    } finally {
      setLoading(false);
    }
  };

  const aiModules = [
    {
      name: "Agent Registry",
      description: "KI-Agenten verwalten, konfigurieren und überwachen",
      icon: FaRobot,
      href: "/admin/ai/agents",
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    },
    {
      name: "Monitoring",
      description: "Echtzeit-Überwachung aller AI-Komponenten und Kosten",
      icon: FaChartLine,
      href: "/admin/ai/monitoring",
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
    },
    {
      name: "Customer Insights",
      description: "KI-gestützte Kundenanalyse und Potenzialerkennung",
      icon: FaUsers,
      href: "/admin/customers",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      name: "Projekt-Analyzer",
      description: "Enterprise++ Code-, Architektur- und Sicherheitsanalyse",
      icon: FaProjectDiagram,
      href: "/admin/ai/project-analyzer",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      name: "Invoice Assistant",
      description: "Intelligente Rechnungsprüfung und Empfehlungen",
      icon: FaFileInvoice,
      href: "/admin/office/invoices",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      name: "Media AI",
      description: "Dokumenten- und Medienanalyse mit OCR und DSGVO-Check",
      icon: FaImage,
      href: "/admin/media",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      name: "Executive Reports",
      description: "Automatische Business-Reports und Executive Summaries",
      icon: FaFileAlt,
      href: "/admin/ai/reports",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
    {
      name: "Entwicklungsaufträge",
      description: "Agent-A Plant • Agent-B Codet • Agent-C Reviewed",
      icon: FaRobot,
      href: "/admin/ai/dev-tasks",
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    },
    {
      name: "Kanban Board",
      description: "Visuelle Workflow-Übersicht aller Dev-Tasks",
      icon: FaProjectDiagram,
      href: "/admin/ai/kanban",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      name: "Playbook-Bibliothek",
      description: "SEC-01, A11Y-01 und mehr Lösungstemplates",
      icon: FaBook,
      href: "/admin/ai/playbooks",
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
    {
      name: "Kosten-Dashboard",
      description: "AI-Kosten überwachen und Limits verwalten",
      icon: FaChartLine,
      href: "/admin/ai/costs",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      name: "Einstellungen",
      description: "AI Center Konfiguration und DSGVO",
      icon: FaBrain,
      href: "/admin/ai/settings",
      color: "text-gray-400",
      bgColor: "bg-gray-400/10",
    },
    {
      name: "Compliance",
      description: "EU AI Act, DSGVO, Model Registry",
      icon: FaCheckCircle,
      href: "/admin/ai/compliance",
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050509] text-[#f4f4f4]">
      {/* Header */}
      <div className="border-b border-[#272a33] bg-[#111217] px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] rounded-xl">
              <FaBrain className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#f4f4f4]">
                AI Center
              </h1>
              <p className="text-[#b3b3b3]">
                Enterprise++ KI-Module und Automatisierung
              </p>
            </div>
          </div>
          <button
            onClick={loadStats}
            className="flex items-center gap-2 px-4 py-2 bg-[#272a33] hover:bg-[#353840] rounded-lg transition-colors"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            Aktualisieren
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Status Banner */}
        <div className={`mb-6 p-4 bg-gradient-to-r ${stats && stats.totalCost > 0 ? 'from-green-500/10 to-emerald-500/10 border-green-500/30' : 'from-[#ffd700]/10 to-[#ff8c00]/10 border-[#ffd700]/30'} border rounded-xl`}>
          <div className="flex items-center gap-3">
            <FaRobot className={`h-6 w-6 ${stats && stats.totalCost > 0 ? 'text-green-400' : 'text-[#ffd700]'}`} />
            <div>
              <h3 className={`font-semibold ${stats && stats.totalCost > 0 ? 'text-green-400' : 'text-[#ffd700]'}`}>
                {stats && stats.totalCost > 0 ? '🚀 OpenAI GPT-4 aktiv' : 'AI-System aktiv (Demo)'}
              </h3>
              <p className="text-sm text-[#b3b3b3]">
                {stats && stats.totalCost > 0 ? 'Produktionsmodus • Echte AI-Antworten • Enterprise++ Standard' : 'Demo-Modus • Alle KI-Module bereit • Enterprise++ Standard'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="h-8 w-8 text-[#ffd700] animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#b3b3b3] text-sm">AI-Anfragen</span>
                <FaChartLine className="h-4 w-4 text-[#ffd700]" />
              </div>
              <div className="text-2xl font-bold text-[#f4f4f4]">
                {stats.totalRequests}
              </div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <FaCheckCircle className="h-3 w-3" />
                {stats.successfulRequests} erfolgreich
              </div>
            </div>

            <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#b3b3b3] text-sm">Tokens verwendet</span>
                <FaBrain className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-[#f4f4f4]">
                {stats.totalTokens.toLocaleString()}
              </div>
              <div className="text-xs text-[#b3b3b3]">
                {stats.period}
              </div>
            </div>

            <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#b3b3b3] text-sm">Kosten (geschätzt)</span>
                <FaFileInvoice className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-[#f4f4f4]">
                {stats.totalCost.toFixed(4)} €
              </div>
              <div className="text-xs text-[#b3b3b3]">
                {stats.totalCost > 0 ? 'OpenAI Produktionskosten' : 'Demo-Modus: 0,00 €'}
              </div>
            </div>

            <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#b3b3b3] text-sm">Ø Antwortzeit</span>
                <FaSyncAlt className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-[#f4f4f4]">
                {stats.avgResponseTime} ms
              </div>
              <div className="text-xs text-green-400">
                Optimal
              </div>
            </div>
          </div>
        )}

        {/* AI Modules */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#f4f4f4] mb-4">
            KI-Module
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiModules.map((module) => (
              <Link
                key={module.name}
                href={module.href}
                className="bg-[#111217] border border-[#272a33] rounded-xl p-5 hover:border-[#ffd700]/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 ${module.bgColor} rounded-lg`}>
                    <module.icon className={`h-6 w-6 ${module.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#f4f4f4] group-hover:text-[#ffd700] transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-sm text-[#b3b3b3] mt-1">
                      {module.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#111217] border border-[#272a33] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[#f4f4f4] mb-4">
            Schnellaktionen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/ai/reports"
              className="flex items-center gap-3 p-4 bg-[#272a33] hover:bg-[#353840] rounded-lg transition-colors"
            >
              <FaFileAlt className="h-5 w-5 text-[#ffd700]" />
              <span>Wochenbericht generieren</span>
            </Link>
            <button
              onClick={() => alert("Demo: Alle Kunden analysieren")}
              className="flex items-center gap-3 p-4 bg-[#272a33] hover:bg-[#353840] rounded-lg transition-colors text-left"
            >
              <FaUsers className="h-5 w-5 text-blue-400" />
              <span>Alle Kunden analysieren</span>
            </button>
            <button
              onClick={() => alert("Demo: System-Health-Check")}
              className="flex items-center gap-3 p-4 bg-[#272a33] hover:bg-[#353840] rounded-lg transition-colors text-left"
            >
              <FaCheckCircle className="h-5 w-5 text-green-400" />
              <span>System-Health-Check</span>
            </button>
          </div>
        </div>

        {/* Info Box */}
        {stats && stats.totalCost > 0 ? (
          <div className="mt-6 p-4 bg-[#111217] border border-green-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-400">OpenAI GPT-4 verbunden</h4>
                <p className="text-sm text-[#b3b3b3] mt-1">
                  Dein AI-System nutzt echte GPT-4 Antworten. Kosten werden in 
                  <code className="mx-1 px-1 bg-[#272a33] rounded">lopez_ai_usage</code> 
                  getrackt. Enterprise++ Ready!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-[#111217] border border-[#272a33] rounded-xl">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#f4f4f4]">Demo-Modus aktiv</h4>
                <p className="text-sm text-[#b3b3b3] mt-1">
                  Das AI-System läuft aktuell im Demo-Modus mit simulierten Antworten.
                  Für echte KI-Funktionalität bitte einen OpenAI API-Key in der 
                  <code className="mx-1 px-1 bg-[#272a33] rounded">.env</code> 
                  Datei konfigurieren.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

