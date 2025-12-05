"use client";
// =====================================================
// PROJECT DETAIL PAGE - ENTERPRISE++ AI INTEGRATION
// =====================================================

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FaArrowLeft, 
  FaProjectDiagram, 
  FaRobot, 
  FaSpinner,
  FaCalendarAlt,
  FaUser,
  FaEdit,
  FaCheckCircle,
  FaBrain,
  FaSyncAlt
} from "react-icons/fa";

interface Project {
  id: number;
  customer_id: number;
  project_name: string;
  project_code: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  budget_amount: number;
  created_at: string;
  updated_at: string;
  customer_name?: string;
}

interface AIInsight {
  id: number;
  project_id: number;
  insight_type: string;
  content: string;
  confidence_score: number;
  provider: string;
  created_at: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [activeTab, setActiveTab] = useState<"overview" | "ai">("overview");
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Projekt laden
  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch(`/api/projects?id=${projectId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setProject(data.data);
        } else {
          setError("Projekt nicht gefunden");
        }
      } catch (err) {
        setError("Fehler beim Laden des Projekts");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  // AI Insights laden
  useEffect(() => {
    const loadAIInsights = async () => {
      if (!projectId) return;
      
      setAiLoading(true);
      try {
        const response = await fetch(`/api/admin/ai/projects/${projectId}/analyze`);
        const data = await response.json();
        
        if (data.success) {
          setAiInsights(data.data || []);
        }
      } catch (err) {
        console.error("AI Insights laden fehlgeschlagen:", err);
      } finally {
        setAiLoading(false);
      }
    };

    if (activeTab === "ai") {
      loadAIInsights();
    }
  }, [projectId, activeTab]);

  // AI Analyse starten
  const generateAIAnalysis = async () => {
    setAiGenerating(true);
    try {
      const response = await fetch(`/api/admin/ai/projects/${projectId}/analyze`, {
        method: "POST",
      });
      const data = await response.json();
      
      if (data.success) {
        setAiInsights(data.data || []);
        alert("✅ AI-Analyse erfolgreich generiert!");
      } else {
        alert(`❌ Fehler: ${data.error}`);
      }
    } catch (err) {
      alert("❌ Fehler bei der AI-Analyse");
    } finally {
      setAiGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done": return "bg-green-500";
      case "in_progress": return "bg-yellow-500";
      case "planned": return "bg-blue-500";
      case "on_hold": return "bg-orange-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "done": return "Abgeschlossen";
      case "in_progress": return "In Bearbeitung";
      case "planned": return "Geplant";
      case "open": return "Offen";
      case "on_hold": return "Pausiert";
      case "cancelled": return "Abgebrochen";
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("de-DE");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050509]">
        <FaSpinner className="h-8 w-8 text-[#ffd700] animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6 bg-[#050509] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-400">{error || "Projekt nicht gefunden"}</p>
            <Link href="/admin/office/projects" className="mt-4 inline-block text-[#ffd700] hover:underline">
              ← Zurück zur Projektliste
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#050509] min-h-screen text-[#f4f4f4]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/office/projects"
            className="inline-flex items-center text-sm mb-4 text-[#b3b3b3] hover:text-[#ffd700] transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Zurück zur Projektliste
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#ffd700]/10 rounded-xl">
                <FaProjectDiagram className="h-8 w-8 text-[#ffd700]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#f4f4f4]">
                  {project.project_name}
                </h1>
                <p className="text-[#b3b3b3]">
                  {project.project_code || `Projekt #${project.id}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
              <button className="p-2 bg-[#272a33] hover:bg-[#353840] rounded-lg transition-colors">
                <FaEdit className="h-4 w-4 text-[#b3b3b3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#272a33] pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === "overview" 
                ? "bg-[#111217] text-[#ffd700] border-b-2 border-[#ffd700]" 
                : "text-[#b3b3b3] hover:text-[#f4f4f4]"
            }`}
          >
            <FaProjectDiagram className="inline mr-2" />
            Übersicht
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === "ai" 
                ? "bg-[#111217] text-[#ffd700] border-b-2 border-[#ffd700]" 
                : "text-[#b3b3b3] hover:text-[#f4f4f4]"
            }`}
          >
            <FaBrain className="inline mr-2" />
            AI-Analyse
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hauptinfos */}
            <div className="lg:col-span-2 bg-[#111217] border border-[#272a33] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[#f4f4f4] mb-4">Projektdetails</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#b3b3b3]">Beschreibung</label>
                  <p className="text-[#f4f4f4] mt-1">
                    {project.description || "Keine Beschreibung vorhanden"}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#b3b3b3]">Startdatum</label>
                    <p className="text-[#f4f4f4] mt-1 flex items-center gap-2">
                      <FaCalendarAlt className="text-[#ffd700]" />
                      {formatDate(project.start_date)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-[#b3b3b3]">Enddatum</label>
                    <p className="text-[#f4f4f4] mt-1 flex items-center gap-2">
                      <FaCalendarAlt className="text-[#ffd700]" />
                      {formatDate(project.end_date)}
                    </p>
                  </div>
                </div>
                
                {project.budget_amount && (
                  <div>
                    <label className="text-sm text-[#b3b3b3]">Budget</label>
                    <p className="text-[#f4f4f4] mt-1 text-xl font-semibold">
                      {project.budget_amount.toLocaleString("de-DE")} €
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
                <h3 className="text-sm font-medium text-[#b3b3b3] mb-3">Kunde</h3>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#272a33] rounded-lg">
                    <FaUser className="h-4 w-4 text-[#ffd700]" />
                  </div>
                  <span className="text-[#f4f4f4]">
                    {project.customer_name || `Kunde #${project.customer_id}`}
                  </span>
                </div>
              </div>

              <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
                <h3 className="text-sm font-medium text-[#b3b3b3] mb-3">Erstellt</h3>
                <p className="text-[#f4f4f4]">{formatDate(project.created_at)}</p>
              </div>

              <div className="bg-gradient-to-br from-[#ffd700]/10 to-[#ff8c00]/10 border border-[#ffd700]/30 rounded-xl p-4">
                <h3 className="text-sm font-medium text-[#ffd700] mb-3">🤖 AI-Analyse</h3>
                <p className="text-sm text-[#b3b3b3] mb-3">
                  Lass GPT-4 dein Projekt analysieren
                </p>
                <button
                  onClick={() => setActiveTab("ai")}
                  className="w-full px-4 py-2 bg-[#ffd700] text-[#050509] rounded-lg font-medium hover:bg-[#ffed4e] transition-colors"
                >
                  Analyse starten →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="space-y-6">
            {/* AI Header */}
            <div className="bg-gradient-to-r from-[#ffd700]/10 to-[#ff8c00]/10 border border-[#ffd700]/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#ffd700]/20 rounded-xl">
                    <FaBrain className="h-8 w-8 text-[#ffd700]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#f4f4f4]">AI Project Analyzer</h2>
                    <p className="text-[#b3b3b3]">GPT-4 analysiert dein Projekt</p>
                  </div>
                </div>
                
                <button
                  onClick={generateAIAnalysis}
                  disabled={aiGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-[#ffd700] text-[#050509] rounded-lg font-medium hover:bg-[#ffed4e] transition-colors disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Analysiere...
                    </>
                  ) : (
                    <>
                      <FaSyncAlt />
                      {aiInsights.length > 0 ? "Neu analysieren" : "Analyse starten"}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Results */}
            {aiLoading ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="h-8 w-8 text-[#ffd700] animate-spin" />
              </div>
            ) : aiInsights.length > 0 ? (
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="bg-[#111217] border border-[#272a33] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-400" />
                        <span className="text-sm text-[#b3b3b3]">
                          {insight.provider} • {formatDate(insight.created_at)}
                        </span>
                      </div>
                      <span className="text-xs bg-[#272a33] px-2 py-1 rounded text-[#b3b3b3]">
                        Confidence: {Math.round(insight.confidence_score * 100)}%
                      </span>
                    </div>
                    
                    <div className="prose prose-invert prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-[#f4f4f4]">
                        {insight.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#111217] border border-[#272a33] rounded-xl p-12 text-center">
                <FaRobot className="h-16 w-16 text-[#272a33] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#f4f4f4] mb-2">
                  Noch keine AI-Analyse
                </h3>
                <p className="text-[#b3b3b3] mb-6">
                  Klicke auf "Analyse starten" um GPT-4 dein Projekt analysieren zu lassen.
                </p>
                <button
                  onClick={generateAIAnalysis}
                  disabled={aiGenerating}
                  className="px-6 py-3 bg-[#ffd700] text-[#050509] rounded-lg font-medium hover:bg-[#ffed4e] transition-colors"
                >
                  🚀 Jetzt analysieren
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

