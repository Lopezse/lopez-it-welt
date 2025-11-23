"use client";
import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaCalendar,
  FaCheck,
  FaClock,
  FaComment,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaSave,
  FaTimes,
  FaUser,
} from "react-icons/fa";

interface ContactMessageDetail {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: "neu" | "in_bearbeitung" | "erledigt" | "archiviert";
  priority: "niedrig" | "normal" | "hoch" | "dringend";
  assigned_to?: string;
  response_message?: string;
  response_sent_at?: string;
  response_sent_by?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  is_spam: boolean;
  spam_score?: number;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  comments: Array<{
    id: number;
    comment: string;
    is_internal: boolean;
    created_at: string;
    created_by: string;
  }>;
  attachments: Array<{
    id: number;
    filename: string;
    original_filename: string;
    file_size: number;
    mime_type: string;
    created_at: string;
  }>;
}

interface ContactMessageDetailModalProps {
  messageId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ContactMessageDetailModal({
  messageId,
  isOpen,
  onClose,
  onUpdate,
}: ContactMessageDetailModalProps) {
  const [message, setMessage] = useState<ContactMessageDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isInternalComment, setIsInternalComment] = useState(true);
  const [editData, setEditData] = useState({
    status: "",
    priority: "",
    assigned_to: "",
    notes: "",
    tags: [] as string[],
    response_message: "",
  });

  // Nachricht laden
  const loadMessage = async () => {
    if (!messageId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/contact-messages/${messageId}`);
      const data = await response.json();

      if (data.success) {
        setMessage(data.data);
        setEditData({
          status: data.data.status,
          priority: data.data.priority,
          assigned_to: data.data.assigned_to || "",
          notes: data.data.notes || "",
          tags: data.data.tags || [],
          response_message: data.data.response_message || "",
        });
      }
    } catch (error) {
      console.error("Fehler beim Laden der Nachricht:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && messageId) {
      loadMessage();
    }
  }, [isOpen, messageId]);

  // Status ändern
  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadMessage();
        onUpdate();
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Status:", error);
    }
  };

  // Nachricht aktualisieren
  const saveChanges = async () => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        setEditing(false);
        loadMessage();
        onUpdate();
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    }
  };

  // Kommentar hinzufügen
  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: newComment,
          is_internal: isInternalComment,
        }),
      });

      if (response.ok) {
        setNewComment("");
        loadMessage();
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Kommentars:", error);
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

  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">Nachricht #{message.id}</h2>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(message.status)}`}
            >
              {message.status}
            </span>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${getPriorityBadge(message.priority)}`}
            >
              {message.priority}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <FaEdit className="w-4 h-4" />
                <span>Bearbeiten</span>
              </button>
            ) : (
              <button
                onClick={saveChanges}
                className="text-green-600 hover:text-green-800 flex items-center space-x-1"
              >
                <FaSave className="w-4 h-4" />
                <span>Speichern</span>
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Linke Spalte - Nachrichtendetails */}
            <div className="space-y-6">
              {/* Absender-Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaUser className="w-5 h-5 mr-2" />
                  Absender
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaUser className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="font-medium">{message.name}</span>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="w-4 h-4 text-gray-400 mr-3" />
                    <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline">
                      {message.email}
                    </a>
                  </div>
                  {message.phone && (
                    <div className="flex items-center">
                      <FaPhone className="w-4 h-4 text-gray-400 mr-3" />
                      <a href={`tel:${message.phone}`} className="text-blue-600 hover:underline">
                        {message.phone}
                      </a>
                    </div>
                  )}
                  {message.company && (
                    <div className="flex items-center">
                      <FaBuilding className="w-4 h-4 text-gray-400 mr-3" />
                      <span>{message.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Nachricht */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nachricht</h3>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">{message.subject}</h4>
                  <div className="text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border">
                    {message.message}
                  </div>
                </div>
              </div>

              {/* Technische Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technische Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaCalendar className="w-4 h-4 mr-2" />
                    <span>Eingegangen: {new Date(message.created_at).toLocaleString("de-DE")}</span>
                  </div>
                  {message.ip_address && <div>IP: {message.ip_address}</div>}
                  {message.referrer && <div>Referrer: {message.referrer}</div>}
                </div>
              </div>
            </div>

            {/* Rechte Spalte - Bearbeitung */}
            <div className="space-y-6">
              {/* Schnellaktionen */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schnellaktionen</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateStatus("in_bearbeitung")}
                    disabled={message.status === "in_bearbeitung"}
                    className="bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaClock className="w-4 h-4 inline mr-1" />
                    In Bearbeitung
                  </button>
                  <button
                    onClick={() => updateStatus("erledigt")}
                    disabled={message.status === "erledigt"}
                    className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaCheck className="w-4 h-4 inline mr-1" />
                    Erledigt
                  </button>
                </div>
              </div>

              {/* Bearbeitungsfelder */}
              {editing && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="neu">Neu</option>
                      <option value="in_bearbeitung">In Bearbeitung</option>
                      <option value="erledigt">Erledigt</option>
                      <option value="archiviert">Archiviert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priorität
                    </label>
                    <select
                      value={editData.priority}
                      onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="niedrig">Niedrig</option>
                      <option value="normal">Normal</option>
                      <option value="hoch">Hoch</option>
                      <option value="dringend">Dringend</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zugewiesen an
                    </label>
                    <select
                      value={editData.assigned_to}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          assigned_to: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Nicht zugewiesen</option>
                      <option value="ramiro-lopez">Ramiro Lopez Rodriguez</option>
                      <option value="support-team">Support Team</option>
                      <option value="technik-team">Technik Team</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interne Notizen
                    </label>
                    <textarea
                      value={editData.notes}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Interne Notizen (nicht für Kunden sichtbar)..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Antwort an Kunden
                    </label>
                    <textarea
                      value={editData.response_message}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          response_message: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Antwort an den Kunden..."
                    />
                  </div>
                </div>
              )}

              {/* Kommentare */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaComment className="w-5 h-5 mr-2" />
                  Kommentare
                </h3>

                {/* Neuer Kommentar */}
                <div className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
                    placeholder="Neuen Kommentar hinzufügen..."
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isInternalComment}
                        onChange={(e) => setIsInternalComment(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Interner Kommentar</span>
                    </label>
                    <button
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Hinzufügen
                    </button>
                  </div>
                </div>

                {/* Kommentar-Liste */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {message.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg ${comment.is_internal ? "bg-yellow-50 border-l-4 border-yellow-400" : "bg-white border"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.created_by}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleString("de-DE")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.comment}</p>
                      {comment.is_internal && (
                        <span className="inline-block mt-1 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                          Intern
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
