"use client";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import {
  FaDesktop,
  FaEdit,
  FaEye,
  FaGlobe,
  FaMobile,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

interface Page {
  id: number;
  title: string;
  slug: string;
  status: "published" | "draft" | "archived";
  lastModified: string;
  author: string;
  views: number;
  language: string;
  isResponsive: boolean;
}

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("lastModified");

  // Mock-Daten für Demo
  useEffect(() => {
    const mockPages: Page[] = [
      {
        id: 1,
        title: "Startseite",
        slug: "/",
        status: "published",
        lastModified: "2025-09-15T18:30:00Z",
        author: "Admin",
        views: 1250,
        language: "de",
        isResponsive: true,
      },
      {
        id: 2,
        title: "Über uns",
        slug: "/about",
        status: "published",
        lastModified: "2025-09-14T16:45:00Z",
        author: "Admin",
        views: 340,
        language: "de",
        isResponsive: true,
      },
      {
        id: 3,
        title: "Leistungen",
        slug: "/services",
        status: "draft",
        lastModified: "2025-09-15T10:20:00Z",
        author: "Redakteur",
        views: 0,
        language: "de",
        isResponsive: false,
      },
      {
        id: 4,
        title: "Kontakt",
        slug: "/contact",
        status: "published",
        lastModified: "2025-09-13T14:15:00Z",
        author: "Admin",
        views: 890,
        language: "de",
        isResponsive: true,
      },
      {
        id: 5,
        title: "Impressum",
        slug: "/imprint",
        status: "published",
        lastModified: "2025-09-10T09:30:00Z",
        author: "Admin",
        views: 120,
        language: "de",
        isResponsive: true,
      },
    ];

    setPages(mockPages);
    setLoading(false);
  }, []);

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Veröffentlicht";
      case "draft":
        return "Entwurf";
      case "archived":
        return "Archiviert";
      default:
        return "Unbekannt";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Seitenverwaltung...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seitenverwaltung</h1>
          <p className="text-gray-600">Verwalten Sie alle Seiten Ihrer Website</p>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Seiten durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle Status</option>
              <option value="published">Veröffentlicht</option>
              <option value="draft">Entwurf</option>
              <option value="archived">Archiviert</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="lastModified">Letzte Änderung</option>
              <option value="title">Titel</option>
              <option value="views">Aufrufe</option>
              <option value="author">Autor</option>
            </select>
          </div>

          {/* Add Page Button */}
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaPlus className="mr-2" />
            Neue Seite
          </button>
        </div>

        {/* Pages List */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seite
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Letzte Änderung
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aufrufe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsive
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{page.title}</div>
                        <div className="text-sm text-gray-500">/{page.slug}</div>
                        <div className="flex items-center mt-1">
                          <FaGlobe className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500 uppercase">{page.language}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(page.status)}`}
                      >
                        {getStatusText(page.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {page.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.lastModified).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {page.isResponsive ? (
                          <>
                            <FaMobile className="h-4 w-4 text-green-500 mr-1" />
                            <FaDesktop className="h-4 w-4 text-green-500" />
                          </>
                        ) : (
                          <span className="text-red-500 text-sm">Nicht responsive</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900 p-1">
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1">
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaFileAlt className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gesamt Seiten</p>
                <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaGlobe className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Veröffentlicht</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pages.filter((p) => p.status === "published").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaEdit className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entwürfe</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pages.filter((p) => p.status === "draft").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaEye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gesamt Aufrufe</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pages.reduce((sum, page) => sum + page.views, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
