"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaProjectDiagram, FaCalendar, FaEye, FaEdit, FaRobot, FaSync, FaSpinner, FaCheck } from "react-icons/fa";
import AIAnalysisModal from "@/components/admin/AIAnalysisModal";

interface Project {
  id: number;
  project_code: string | null;
  project_name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  company_name: string | null;
  vorname: string | null;
  nachname: string | null;
  email: string | null;
  created_at: string;
  progress_percent?: number;
  progress_status_text?: string;
  last_progress_update?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // AI Analysis Modal State
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // MD Sync State
  const [syncingProjectId, setSyncingProjectId] = useState<number | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<number | null>(null);

  const openAIModal = (project: Project) => {
    setSelectedProject(project);
    setShowAIModal(true);
  };

  // Sync Fortschritt aus STATUS.md
  const syncProgressFromMd = async (projectId: number) => {
    setSyncingProjectId(projectId);
    setSyncSuccess(null);
    
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/sync-progress-from-md`, {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Aktualisiere das Projekt in der Liste
        setProjects(prev => prev.map(p => 
          p.id === projectId 
            ? { 
                ...p, 
                progress_percent: data.data.progressPercent,
                progress_status_text: data.data.statusText,
                last_progress_update: new Date().toISOString(),
              }
            : p
        ));
        setSyncSuccess(projectId);
        setTimeout(() => setSyncSuccess(null), 2000);
      } else {
        console.error("Sync Fehler:", data.error);
      }
    } catch (err) {
      console.error("Sync Fehler:", err);
    } finally {
      setSyncingProjectId(null);
    }
  };

  // Fortschritts-Balken Farbe
  const getProgressColor = (percent: number) => {
    if (percent >= 70) return "#24a148"; // Grün
    if (percent >= 30) return "#ffd700"; // Gelb/Gold
    return "#da1e28"; // Rot
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (data.success) {
        setProjects(data.data.projects);
      } else {
        setError("Fehler beim Laden der Projekte");
      }
    } catch (err) {
      setError("Fehler beim Laden der Projekte");
      console.error("Fehler:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      planned: "bg-[#272a33] text-[#b3b3b3]",
      open: "bg-blue-500/20 text-blue-400",
      in_progress: "bg-yellow-500/20 text-yellow-400",
      on_hold: "bg-orange-500/20 text-orange-400",
      done: "bg-green-500/20 text-green-400",
      cancelled: "bg-red-500/20 text-red-400",
    };
    const labels: Record<string, string> = {
      planned: "Geplant",
      open: "Offen",
      in_progress: "In Bearbeitung",
      on_hold: "Pausiert",
      done: "Abgeschlossen",
      cancelled: "Abgebrochen",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || styles.planned}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FaProjectDiagram className="animate-pulse h-8 w-8 mx-auto mb-2" style={{ color: "#ffd700" }} />
            <p style={{ color: "#b3b3b3" }}>Lade Projekte...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#da1e28", color: "#fff" }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaProjectDiagram className="h-6 w-6" style={{ color: "#ffd700" }} />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#f4f4f4" }}>Projekte</h1>
            <p className="text-sm" style={{ color: "#b3b3b3" }}>Projektverwaltung für Kunden</p>
          </div>
        </div>
        <Link
          href="/admin/office/projects/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: "#ffd700", color: "#050509" }}
        >
          <FaPlus />
          Neues Projekt
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Gesamt", value: projects.length, color: "#8a3ffc" },
          { label: "In Bearbeitung", value: projects.filter(p => p.status === "in_progress").length, color: "#ffd700" },
          { label: "Abgeschlossen", value: projects.filter(p => p.status === "done").length, color: "#24a148" },
          { label: "Offen", value: projects.filter(p => p.status === "open" || p.status === "planned").length, color: "#0f62fe" },
        ].map((stat) => (
          <div 
            key={stat.label}
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
          >
            <p className="text-sm" style={{ color: "#b3b3b3" }}>{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "#272a33" }}>
          <div className="flex items-center gap-2">
            <FaProjectDiagram style={{ color: "#ffd700" }} />
            <h2 className="text-lg font-semibold" style={{ color: "#f4f4f4" }}>Projektliste</h2>
          </div>
          <span className="text-sm" style={{ color: "#b3b3b3" }}>
            {projects.length} {projects.length === 1 ? "Projekt" : "Projekte"}
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <FaProjectDiagram className="mx-auto h-12 w-12 mb-4" style={{ color: "#272a33" }} />
            <p className="mb-4" style={{ color: "#b3b3b3" }}>Noch keine Projekte vorhanden</p>
            <Link
              href="/admin/office/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ backgroundColor: "#272a33", color: "#ffd700", border: "1px solid #3d4150" }}
            >
              <FaPlus />
              Erstes Projekt erstellen
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#1f2329" }} className="border-b" style={{ borderColor: "#272a33" }}>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: "#b3b3b3" }}>
                  Projekt
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: "#b3b3b3" }}>
                  Kunde
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: "#b3b3b3" }}>
                  Zeitraum
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium" style={{ color: "#b3b3b3" }}>
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium" style={{ color: "#b3b3b3" }}>
                  Fortschritt
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: "#b3b3b3" }}>
                  Erstellt
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium" style={{ color: "#b3b3b3" }}>
                  Aktion
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr 
                  key={project.id} 
                  className="border-t transition-colors hover:bg-[#1f2329]"
                  style={{ borderColor: "#272a33" }}
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium" style={{ color: "#f4f4f4" }}>
                        {project.project_name}
                      </div>
                      {project.project_code && (
                        <div className="text-sm" style={{ color: "#b3b3b3" }}>{project.project_code}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div style={{ color: "#f4f4f4" }}>
                      {project.company_name || (
                        <>
                          {project.vorname} {project.nachname}
                        </>
                      )}
                    </div>
                    {project.email && (
                      <div className="text-sm" style={{ color: "#b3b3b3" }}>{project.email}</div>
                    )}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#b3b3b3" }}>
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-xs" />
                      {project.start_date && project.end_date ? (
                        <>
                          {new Date(project.start_date).toLocaleDateString("de-DE")} -{" "}
                          {new Date(project.end_date).toLocaleDateString("de-DE")}
                        </>
                      ) : project.start_date ? (
                        <>Ab {new Date(project.start_date).toLocaleDateString("de-DE")}</>
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center gap-1">
                      {/* Progress Bar */}
                      <div className="w-20 h-2 rounded-full bg-[#272a33] overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${project.progress_percent || 0}%`,
                            backgroundColor: getProgressColor(project.progress_percent || 0),
                          }}
                        />
                      </div>
                      <span 
                        className="text-xs font-medium"
                        style={{ color: getProgressColor(project.progress_percent || 0) }}
                      >
                        {project.progress_percent || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#b3b3b3" }}>
                    {new Date(project.created_at).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {/* MD → DB Sync Button */}
                      <button
                        onClick={() => syncProgressFromMd(project.id)}
                        disabled={syncingProjectId === project.id}
                        className="p-2 rounded transition-colors hover:bg-[#24a148]/20 disabled:opacity-50"
                        style={{ color: syncSuccess === project.id ? "#24a148" : "#8a3ffc" }}
                        title="Fortschritt aus STATUS.md synchronisieren"
                      >
                        {syncingProjectId === project.id ? (
                          <FaSpinner className="animate-spin" />
                        ) : syncSuccess === project.id ? (
                          <FaCheck />
                        ) : (
                          <FaSync />
                        )}
                      </button>
                      {/* AI Analyse Button */}
                      <button
                        onClick={() => openAIModal(project)}
                        className="p-2 rounded transition-colors hover:bg-[#ffd700]/20"
                        style={{ color: "#ffd700" }}
                        title="AI Analyse"
                      >
                        <FaRobot />
                      </button>
                      <button
                        className="p-2 rounded transition-colors hover:bg-[#272a33]"
                        style={{ color: "#b3b3b3" }}
                        title="Ansehen"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="p-2 rounded transition-colors hover:bg-[#272a33]"
                        style={{ color: "#b3b3b3" }}
                        title="Bearbeiten"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* AI Analysis Modal */}
      {selectedProject && (
        <AIAnalysisModal
          isOpen={showAIModal}
          onClose={() => {
            setShowAIModal(false);
            setSelectedProject(null);
          }}
          project={{
            id: selectedProject.id,
            project_name: selectedProject.project_name,
            project_code: selectedProject.project_code || undefined,
          }}
          onAnalysisComplete={(result) => {
            console.log("AI Analyse abgeschlossen:", result);
          }}
        />
      )}
    </div>
  );
}
