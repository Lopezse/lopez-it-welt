// =====================================================
// PORTAL - AI SERVICES
// =====================================================

"use client";

import React, { useState, useEffect } from "react";
import { 
  FaBrain, FaSpinner, FaImage, FaCode, FaChartLine, 
  FaLock, FaCheck, FaArrowRight
} from "react-icons/fa";

interface AIUsage {
  this_month: number;
  tokens_used: number;
  total_cost: number;
}

const aiServices = [
  {
    id: "media_ai",
    name: "Media AI",
    description: "Automatische Bildanalyse, Alt-Text-Generierung und Metadaten-Extraktion",
    icon: FaImage,
    color: "purple",
    features: ["Alt-Text Generierung", "Bildanalyse", "Metadaten", "DSGVO-konform"]
  },
  {
    id: "code_audit",
    name: "Code Audit",
    description: "Automatische Code-Analyse, Sicherheitsprüfung und Best-Practice-Empfehlungen",
    icon: FaCode,
    color: "green",
    features: ["Security Scan", "Best Practices", "Performance", "Dokumentation"]
  },
  {
    id: "project_analyzer",
    name: "Project Analyzer",
    description: "Projekt-Analyse, Architektur-Bewertung und Verbesserungsvorschläge",
    icon: FaChartLine,
    color: "blue",
    features: ["Architektur-Check", "Risiko-Analyse", "Roadmap", "Enterprise-Score"]
  }
];

export default function AIServicesPage() {
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<AIUsage | null>(null);
  const [enabledServices, setEnabledServices] = useState<string[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await fetch("/api/portal/stats");
      const data = await res.json();
      if (data.success) {
        setUsage(data.data.ai_usage);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="text-3xl text-blue-400 animate-spin" />
      </div>
    );
  }

  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    purple: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400" },
    green: { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400" },
    blue: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400" }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">AI Services</h1>
        <p className="text-slate-400">Nutzen Sie KI-gestützte Services für Ihre Projekte</p>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <FaBrain className="text-purple-400" />
            <span className="text-slate-400 text-sm">Anfragen (Monat)</span>
          </div>
          <p className="text-2xl font-bold text-white">{usage?.this_month || 0}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <FaChartLine className="text-blue-400" />
            <span className="text-slate-400 text-sm">Tokens verwendet</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {(usage?.tokens_used || 0).toLocaleString('de-DE')}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <FaLock className="text-green-400" />
            <span className="text-slate-400 text-sm">DSGVO-konform</span>
          </div>
          <p className="text-lg font-bold text-green-400 flex items-center gap-2">
            <FaCheck /> Alle Services
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {aiServices.map((service) => {
          const colors = colorMap[service.color];
          const isEnabled = enabledServices.includes(service.id);
          
          return (
            <div
              key={service.id}
              className={`bg-slate-800/50 border ${colors.border} rounded-xl p-6 
                        hover:border-opacity-60 transition-all`}
            >
              <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                <service.icon className={`text-xl ${colors.text}`} />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{service.description}</p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <FaCheck className={colors.text} />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors
                          ${isEnabled 
                            ? `${colors.bg} ${colors.text}` 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                {isEnabled ? (
                  <>
                    <FaCheck /> Aktiviert
                  </>
                ) : (
                  <>
                    Aktivieren <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-2">Wie funktioniert es?</h3>
        <p className="text-slate-300 text-sm">
          1. Aktivieren Sie einen AI-Service für Ihr Projekt in den Projekteinstellungen.<br/>
          2. Nutzen Sie die API-Endpoints oder das Dashboard zur Analyse.<br/>
          3. Die Kosten werden pro Nutzung berechnet und auf Ihrer monatlichen Rechnung ausgewiesen.
        </p>
      </div>
    </div>
  );
}

