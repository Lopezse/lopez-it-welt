"use client";

import DocumentModal from "@/components/admin/DocumentModal";
import DocumentViewModal from "@/components/admin/DocumentViewModal";
import { useEffect, useState } from "react";
import {
  FaEdit,
  FaEye,
  FaFileCode,
  FaHistory,
  FaListAlt,
  FaPlus,
  FaSearch,
  FaStickyNote,
  FaTrash,
} from "react-icons/fa";

interface Document {
  id: number;
  title: string;
  content: string;
  category: "system" | "howto" | "changelog" | "internal";
  created_at: string;
  updated_at: string;
  permissions?: {
    can_edit: boolean;
    can_delete: boolean;
    can_export: boolean;
  };
}

interface User {
  id: number;
  role: "admin" | "editor" | "viewer";
  name: string;
}

const categoryIcons = {
  system: FaFileCode,
  howto: FaListAlt,
  changelog: FaHistory,
  internal: FaStickyNote,
};

const categoryLabels = {
  system: "System-Dokumentation",
  howto: "How-To Anleitungen",
  changelog: "Change-Log",
  internal: "Interne Hinweise",
};

const categoryColors = {
  system: "bg-blue-100 text-blue-800",
  howto: "bg-green-100 text-green-800",
  changelog: "bg-purple-100 text-purple-800",
  internal: "bg-yellow-100 text-yellow-800",
};

export default function DocsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    role: "admin", // Simuliert Admin-Benutzer
    name: "Lopez IT Welt Admin",
  });

  // URL-Parameter für Kategorie-Filter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  // Dokumente laden
  useEffect(() => {
    loadDocuments();
  }, [searchTerm, selectedCategory]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory !== "all") params.append("category", selectedCategory);

      const response = await fetch(`/api/admin/docs?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Dokumente:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Sind Sie sicher, dass Sie dieses Dokument löschen möchten?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/docs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadDocuments();
      }
    } catch (error) {
      console.error("Fehler beim Löschen des Dokuments:", error);
    }
  };

  const handleSave = async (document: any) => {
    try {
      const url = document.id ? `/api/admin/docs/${document.id}` : "/api/admin/docs";
      const method = document.id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(document),
      });

      if (response.ok) {
        loadDocuments();
      } else {
        throw new Error("Fehler beim Speichern");
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      throw error;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  // Rechte-System
  const hasPermission = (action: "create" | "edit" | "delete" | "export", document?: Document) => {
    switch (currentUser.role) {
      case "admin":
        return true; // Admin kann alles
      case "editor":
        return action === "create" || action === "edit" || action === "export";
      case "viewer":
        return action === "export"; // Nur lesen und exportieren
      default:
        return false;
    }
  };

  const getRoleBadge = () => {
    const roleColors = {
      admin: "bg-red-100 text-red-800",
      editor: "bg-blue-100 text-blue-800",
      viewer: "bg-green-100 text-green-800",
    };
    const roleLabels = {
      admin: "Administrator",
      editor: "Editor",
      viewer: "Betrachter",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColors[currentUser.role]}`}
      >
        {roleLabels[currentUser.role]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📘 Dokumentation</h1>
              <p className="text-gray-600">
                Verwalten Sie System-Dokumentation, How-To Anleitungen und interne Hinweise
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getRoleBadge()}
              <div className="text-sm text-gray-500">Angemeldet als: {currentUser.name}</div>
            </div>
          </div>
        </div>

        {/* Filter und Suche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Suche */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Nach Titel oder Inhalt suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Kategorie-Filter */}
            <div className="sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Alle Kategorien</option>
                <option value="system">System-Dokumentation</option>
                <option value="howto">How-To Anleitungen</option>
                <option value="changelog">Change-Log</option>
                <option value="internal">Interne Hinweise</option>
              </select>
            </div>

            {/* Neues Dokument Button */}
            {hasPermission("create") && (
              <button
                onClick={() => {
                  setSelectedDocument(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Neues Dokument
              </button>
            )}
          </div>
        </div>

        {/* Dokumente-Liste */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Lade Dokumente...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaFileCode className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Keine Dokumente gefunden</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowViewModal(true);
                          }}
                        >
                          {doc.title}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[doc.category]}`}
                        >
                          {getCategoryIcon(doc.category)}
                          {categoryLabels[doc.category]}
                        </span>
                      </div>
                      <p
                        className="text-gray-600 text-sm mb-3 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => {
                          setSelectedDocument(doc);
                          setShowViewModal(true);
                        }}
                      >
                        {doc.content.substring(0, 200)}...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Erstellt: {formatDate(doc.created_at)}</span>
                        <span>Geändert: {formatDate(doc.updated_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedDocument(doc);
                          setShowViewModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Lesen"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                      {hasPermission("edit", doc) && (
                        <button
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Bearbeiten"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                      )}
                      {hasPermission("delete", doc) && (
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Löschen"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document View Modal */}
      <DocumentViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        document={selectedDocument}
        userRole={currentUser.role}
      />

      {/* Document Edit Modal */}
      <DocumentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        document={selectedDocument}
        onSave={handleSave}
      />
    </div>
  );
}
