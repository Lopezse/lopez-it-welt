"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaProjectDiagram, FaUsers, FaCalendar } from "react-icons/fa";

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
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "on_hold":
        return "bg-gray-100 text-gray-800";
      case "done":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Offen";
      case "in_progress":
        return "In Bearbeitung";
      case "on_hold":
        return "Pausiert";
      case "done":
        return "Abgeschlossen";
      case "cancelled":
        return "Abgebrochen";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Lade Projekte...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM & Projekte</h1>
          <p className="text-gray-600 mt-1">Projektverwaltung für Kunden</p>
        </div>
        <Link
          href="/admin/office/projects/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Neues Projekt
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <FaProjectDiagram className="mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold">Projektliste</h2>
            <span className="ml-auto text-sm text-gray-500">
              {projects.length} {projects.length === 1 ? "Projekt" : "Projekte"}
            </span>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <FaProjectDiagram className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">Noch keine Projekte vorhanden</p>
            <Link
              href="/admin/office/projects/new"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              Erstes Projekt erstellen
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projekt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zeitraum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Erstellt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.project_name}
                        </div>
                        {project.project_code && (
                          <div className="text-sm text-gray-500">{project.project_code}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {project.company_name || (
                          <>
                            {project.vorname} {project.nachname}
                          </>
                        )}
                      </div>
                      {project.email && (
                        <div className="text-sm text-gray-500">{project.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          project.status,
                        )}`}
                      >
                        {getStatusText(project.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(project.created_at).toLocaleDateString("de-DE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
