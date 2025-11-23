"use client";
import ContactMessageDetailModal from "@/components/admin/ContactMessageDetailModal";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import {
  FaCalendar,
  FaCheck,
  FaClock,
  FaDownload,
  FaEnvelope,
  FaExclamationTriangle,
  FaEye,
  FaSearch,
  FaTag,
  FaTrash,
  FaUser,
} from "react-icons/fa";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message_preview: string;
  status: "neu" | "in_bearbeitung" | "erledigt" | "archiviert";
  priority: "niedrig" | "normal" | "hoch" | "dringend";
  assigned_to?: string;
  response_sent_at?: string;
  created_at: string;
  updated_at: string;
}

interface ContactStats {
  total: number;
  new_count: number;
  in_progress_count: number;
  completed_count: number;
  last_24h: number;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Nachrichten laden
  const loadMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);

      const response = await fetch(`/api/admin/contact-messages?${params}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Nachrichten:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [searchTerm, statusFilter, priorityFilter]);

  // Status ändern
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadMessages(); // Neu laden
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Status:", error);
    }
  };

  // Nachricht löschen (archivieren)
  const archiveMessage = async (id: number) => {
    if (!confirm("Nachricht wirklich archivieren?")) return;

    try {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadMessages(); // Neu laden
      }
    } catch (error) {
      console.error("Fehler beim Archivieren:", error);
    }
  };

  // Status-Badge
  const getStatusBadge = (status: string) => {
    const badges = {
      neu: "bg-red-100 text-red-800",
      in_bearbeitung: "bg-yellow-100 text-yellow-800",
      erledigt: "bg-green-100 text-green-800",
      archiviert: "bg-gray-100 text-gray-800",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  // Priority-Badge
  const getPriorityBadge = (priority: string) => {
    const badges = {
      niedrig: "bg-blue-100 text-blue-800",
      normal: "bg-gray-100 text-gray-800",
      hoch: "bg-orange-100 text-orange-800",
      dringend: "bg-red-100 text-red-800",
    };
    return badges[priority as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  // Priority-Icon
  const getPriorityIcon = (priority: string) => {
    const icons = {
      niedrig: FaTag,
      normal: FaEnvelope,
      hoch: FaExclamationTriangle,
      dringend: FaExclamationTriangle,
    };
    return icons[priority as keyof typeof icons] || FaEnvelope;
  };

  // Export-Funktion
  const handleExport = async (format: "csv" | "json") => {
    try {
      setExportLoading(true);
      const params = new URLSearchParams();
      params.append("format", format);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);

      const response = await fetch(`/api/admin/contact-messages/export?${params}`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `kontakt-nachrichten-${new Date().toISOString().split("T")[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Fehler beim Export:", error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kontakt-Nachrichten</h1>
          <p className="text-gray-600">Verwalten Sie eingehende Kontaktformular-Nachrichten</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative group">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <FaDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-2">
                <button
                  onClick={() => handleExport("csv")}
                  disabled={exportLoading}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <FaDownload className="w-4 h-4" />
                  <span>CSV Export</span>
                </button>
                <button
                  onClick={() => handleExport("json")}
                  disabled={exportLoading}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <FaDownload className="w-4 h-4" />
                  <span>JSON Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiken */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <FaEnvelope className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Gesamt</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Neu</p>
                <p className="text-2xl font-bold text-red-600">{stats.new_count}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <FaClock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">In Bearbeitung</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.in_progress_count}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <FaCheck className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Erledigt</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed_count}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center">
              <FaCalendar className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Letzte 24h</p>
                <p className="text-2xl font-bold text-purple-600">{stats.last_24h}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filter und Suche */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nach Name, E-Mail oder Betreff suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle Status</option>
              <option value="neu">Neu</option>
              <option value="in_bearbeitung">In Bearbeitung</option>
              <option value="erledigt">Erledigt</option>
              <option value="archiviert">Archiviert</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle Prioritäten</option>
              <option value="niedrig">Niedrig</option>
              <option value="normal">Normal</option>
              <option value="hoch">Hoch</option>
              <option value="dringend">Dringend</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Nachrichten-Tabelle */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Betreff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorität
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Lade Nachrichten...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Keine Nachrichten gefunden
                  </td>
                </tr>
              ) : (
                messages.map((message) => {
                  const PriorityIcon = getPriorityIcon(message.priority);
                  return (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <FaUser className="w-5 h-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{message.name}</div>
                            <div className="text-sm text-gray-500">{message.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{message.subject}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {message.message_preview}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(message.status)}`}
                        >
                          {message.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <PriorityIcon className="w-4 h-4 mr-1" />
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(message.priority)}`}
                          >
                            {message.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(message.created_at).toLocaleDateString("de-DE")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedMessageId(message.id);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Anzeigen"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <select
                            value={message.status}
                            onChange={(e) => updateStatus(message.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="neu">Neu</option>
                            <option value="in_bearbeitung">In Bearbeitung</option>
                            <option value="erledigt">Erledigt</option>
                            <option value="archiviert">Archiviert</option>
                          </select>
                          <button
                            onClick={() => archiveMessage(message.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Archivieren"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail-Modal */}
      <ContactMessageDetailModal
        messageId={selectedMessageId}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedMessageId(null);
        }}
        onUpdate={loadMessages}
      />
    </div>
  );
}
