// =====================================================
// PORTAL - PROJEKTE
// =====================================================

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaProjectDiagram, FaPlus, FaSpinner, FaGlobe, FaCode, 
  FaServer, FaComments, FaCheck, FaClock,
  FaArchive, FaEdit
} from "react-icons/fa";

interface Project {
  id: number;
  name: string;
  description?: string;
  code: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  type: 'website' | 'webapp' | 'api' | 'consulting' | 'other';
  ai_media_enabled: boolean;
  ai_code_audit_enabled: boolean;
  ai_analyzer_enabled: boolean;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  draft: { label: "Entwurf", color: "text-slate-400", bg: "bg-slate-500/20", icon: FaEdit },
  active: { label: "Aktiv", color: "text-green-400", bg: "bg-green-500/20", icon: FaCheck },
  completed: { label: "Abgeschlossen", color: "text-blue-400", bg: "bg-blue-500/20", icon: FaCheck },
  archived: { label: "Archiviert", color: "text-amber-400", bg: "bg-amber-500/20", icon: FaArchive }
};

const typeIcons: Record<string, React.ElementType> = {
  website: FaGlobe,
  webapp: FaCode,
  api: FaServer,
  consulting: FaComments,
  other: FaProjectDiagram
};

export default function ProjektePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", type: "other" });
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/portal/projekte");
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const createProject = async () => {
    if (!newProject.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/portal/projekte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject)
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setNewProject({ name: "", description: "", type: "other" });
        loadProjects();
      }
    } catch { /* ignore */ }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="text-3xl text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Meine Projekte</h1>
          <p className="text-slate-400">Verwalten Sie Ihre Projekte und aktivieren Sie AI-Services</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                   text-white rounded-lg transition-colors"
        >
          <FaPlus /> Neues Projekt
        </button>
      </div>

      {/* Projekte Grid */}
      {projects.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <FaProjectDiagram className="text-5xl text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Noch keine Projekte</h3>
          <p className="text-slate-400 mb-4">Erstellen Sie Ihr erstes Projekt um loszulegen</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Projekt erstellen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const TypeIcon = typeIcons[project.type] || FaProjectDiagram;
            const status = statusConfig[project.status];
            const StatusIcon = status.icon;
            
            return (
              <Link
                key={project.id}
                href={`/portal/projekte/${project.code}`}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 
                         hover:border-blue-500/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <TypeIcon className="text-blue-400" />
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${status.bg} ${status.color}`}>
                    <StatusIcon className="text-xs" /> {status.label}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                  {project.description || "Keine Beschreibung"}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FaClock />
                  <span>Aktualisiert: {new Date(project.updated_at).toLocaleDateString('de-DE')}</span>
                </div>
                {/* AI Services Badges */}
                <div className="flex gap-1 mt-3">
                  {project.ai_media_enabled && (
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">Media AI</span>
                  )}
                  {project.ai_code_audit_enabled && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">Code Audit</span>
                  )}
                  {project.ai_analyzer_enabled && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">Analyzer</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Modal: Neues Projekt */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Neues Projekt erstellen</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Projektname *</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 
                           text-white focus:outline-none focus:border-blue-500"
                  placeholder="Mein Projekt"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-2">Beschreibung</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 
                           text-white focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                  placeholder="Kurze Beschreibung..."
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-2">Projekttyp</label>
                <select
                  value={newProject.type}
                  onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 
                           text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="website">Website</option>
                  <option value="webapp">Web-App</option>
                  <option value="api">API</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Sonstiges</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
              >
                Abbrechen
              </button>
              <button
                onClick={createProject}
                disabled={creating || !newProject.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 
                         text-white rounded-lg flex items-center justify-center gap-2"
              >
                {creating ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







