"use client";

import { useState, useEffect } from "react";
import { FaBell, FaEnvelope, FaEdit, FaCheckCircle } from "react-icons/fa";

interface NotificationData {
  sender_name: string;
  sender_email: string;
  reply_to: string;
  email_notifications_enabled: boolean;
  notify_new_users: boolean;
  notify_errors: boolean;
  notify_backups: boolean;
  notify_updates: boolean;
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  variables: string[];
}

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<NotificationData | null>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadNotifications(), loadTemplates()]);
    setLoading(false);
  };

  const loadNotifications = async () => {
    try {
      const response = await fetch("/api/admin/settings/notifications");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Benachrichtigungseinstellungen:", error);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch("/api/admin/settings/notifications/templates");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTemplates(result.data || []);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der E-Mail-Vorlagen:", error);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("Benachrichtigungseinstellungen erfolgreich aktualisiert.");
        }
      } else {
        alert("Fehler beim Aktualisieren der Benachrichtigungseinstellungen.");
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;

    try {
      const response = await fetch(`/api/admin/settings/notifications/templates/${editingTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTemplate),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("Vorlage erfolgreich aktualisiert.");
          setEditingTemplate(null);
          loadTemplates();
        }
      } else {
        alert("Fehler beim Aktualisieren der Vorlage.");
      }
    } catch (error) {
      console.error("Fehler beim Speichern der Vorlage:", error);
      alert("Fehler beim Speichern der Vorlage.");
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p style={{ color: "#b3b3b3" }}>Lade Benachrichtigungseinstellungen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* E-Mail-Absender */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaEnvelope className="mr-2" style={{ width: "18px", height: "18px" }} />
          E-Mail-Absender
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Absender-Name
            </label>
            <input
              type="text"
              value={data.sender_name}
              onChange={(e) => setData({ ...data, sender_name: e.target.value })}
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                Absender-E-Mail
              </label>
              <input
                type="email"
                value={data.sender_email}
                onChange={(e) => setData({ ...data, sender_email: e.target.value })}
                className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
                style={{
                  backgroundColor: "#1a1d24",
                  borderColor: "#272a33",
                  color: "#f4f4f4",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                Reply-To
              </label>
              <input
                type="email"
                value={data.reply_to}
                onChange={(e) => setData({ ...data, reply_to: e.target.value })}
                className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
                style={{
                  backgroundColor: "#1a1d24",
                  borderColor: "#272a33",
                  color: "#f4f4f4",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* System-Benachrichtigungen */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaBell className="mr-2" style={{ width: "18px", height: "18px" }} />
          System-Benachrichtigungen
        </h3>
        <div className="space-y-4 rounded-lg p-6 border" style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}>
          <div className="flex items-center justify-between py-2">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#f4f4f4" }}>
                E-Mail-Benachrichtigungen aktivieren
              </label>
              <p className="text-xs" style={{ color: "#8a8a8a" }}>
                Allgemeine E-Mail-Benachrichtigungen
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.email_notifications_enabled}
                onChange={(e) => setData({ ...data, email_notifications_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer transition-colors duration-200"
                style={{
                  backgroundColor: data.email_notifications_enabled ? "#007bff" : "#272a33",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full transition-transform duration-200 mt-0.5 ml-0.5"
                  style={{
                    backgroundColor: "#ffffff",
                    transform: data.email_notifications_enabled ? "translateX(20px)" : "translateX(0)",
                  }}
                />
              </div>
            </label>
          </div>
          <div className="border-t pt-4" style={{ borderColor: "#272a33" }}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm" style={{ color: "#f4f4f4" }}>
                  Neue Benutzer
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.notify_new_users}
                    onChange={(e) => setData({ ...data, notify_new_users: e.target.checked })}
                    className="sr-only peer"
                    disabled={!data.email_notifications_enabled}
                  />
                  <div
                    className="w-11 h-6 rounded-full peer transition-colors duration-200"
                    style={{
                      backgroundColor: data.notify_new_users && data.email_notifications_enabled ? "#007bff" : "#272a33",
                      opacity: data.email_notifications_enabled ? 1 : 0.5,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full transition-transform duration-200 mt-0.5 ml-0.5"
                      style={{
                        backgroundColor: "#ffffff",
                        transform: data.notify_new_users && data.email_notifications_enabled ? "translateX(20px)" : "translateX(0)",
                      }}
                    />
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm" style={{ color: "#f4f4f4" }}>
                  Fehler & Alerts
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.notify_errors}
                    onChange={(e) => setData({ ...data, notify_errors: e.target.checked })}
                    className="sr-only peer"
                    disabled={!data.email_notifications_enabled}
                  />
                  <div
                    className="w-11 h-6 rounded-full peer transition-colors duration-200"
                    style={{
                      backgroundColor: data.notify_errors && data.email_notifications_enabled ? "#007bff" : "#272a33",
                      opacity: data.email_notifications_enabled ? 1 : 0.5,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full transition-transform duration-200 mt-0.5 ml-0.5"
                      style={{
                        backgroundColor: "#ffffff",
                        transform: data.notify_errors && data.email_notifications_enabled ? "translateX(20px)" : "translateX(0)",
                      }}
                    />
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm" style={{ color: "#f4f4f4" }}>
                  Backup-Erfolg
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.notify_backups}
                    onChange={(e) => setData({ ...data, notify_backups: e.target.checked })}
                    className="sr-only peer"
                    disabled={!data.email_notifications_enabled}
                  />
                  <div
                    className="w-11 h-6 rounded-full peer transition-colors duration-200"
                    style={{
                      backgroundColor: data.notify_backups && data.email_notifications_enabled ? "#007bff" : "#272a33",
                      opacity: data.email_notifications_enabled ? 1 : 0.5,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full transition-transform duration-200 mt-0.5 ml-0.5"
                      style={{
                        backgroundColor: "#ffffff",
                        transform: data.notify_backups && data.email_notifications_enabled ? "translateX(20px)" : "translateX(0)",
                      }}
                    />
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm" style={{ color: "#f4f4f4" }}>
                  System-Updates
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.notify_updates}
                    onChange={(e) => setData({ ...data, notify_updates: e.target.checked })}
                    className="sr-only peer"
                    disabled={!data.email_notifications_enabled}
                  />
                  <div
                    className="w-11 h-6 rounded-full peer transition-colors duration-200"
                    style={{
                      backgroundColor: data.notify_updates && data.email_notifications_enabled ? "#007bff" : "#272a33",
                      opacity: data.email_notifications_enabled ? 1 : 0.5,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full transition-transform duration-200 mt-0.5 ml-0.5"
                      style={{
                        backgroundColor: "#ffffff",
                        transform: data.notify_updates && data.email_notifications_enabled ? "translateX(20px)" : "translateX(0)",
                      }}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* E-Mail-Vorlagen */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
          E-Mail-Vorlagen
        </h3>
        {templates.length > 0 ? (
          <div className="space-y-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                    {template.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                    Betreff: {template.subject}
                  </p>
                  {template.variables && template.variables.length > 0 && (
                    <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                      Variablen: {template.variables.join(", ")}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setEditingTemplate(template)}
                  className="ml-4 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#272a33",
                    color: "#b3b3b3",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1f2329";
                    e.currentTarget.style.borderColor = "#3a3d47";
                    e.currentTarget.style.color = "#f4f4f4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#272a33";
                    e.currentTarget.style.color = "#b3b3b3";
                  }}
                >
                  <FaEdit className="mr-2" style={{ width: "14px", height: "14px" }} />
                  Bearbeiten
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "#8a8a8a" }}>
            Keine E-Mail-Vorlagen vorhanden.
          </p>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t" style={{ borderColor: "#272a33" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "#007bff",
            color: "#ffffff",
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.currentTarget.style.backgroundColor = "#0056b3";
            }
          }}
          onMouseLeave={(e) => {
            if (!saving) {
              e.currentTarget.style.backgroundColor = "#007bff";
            }
          }}
        >
          {saving ? "Speichern..." : "Änderungen speichern"}
        </button>
      </div>

      {/* Template Edit Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: "#111217", border: "1px solid #272a33" }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
              Vorlage bearbeiten: {editingTemplate.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                  Betreff
                </label>
                <input
                  type="text"
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                  className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                  style={{
                    backgroundColor: "#1a1d24",
                    borderColor: "#272a33",
                    color: "#f4f4f4",
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                  HTML-Inhalt
                </label>
                <textarea
                  value={editingTemplate.body_html}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body_html: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] font-mono"
                  style={{
                    backgroundColor: "#1a1d24",
                    borderColor: "#272a33",
                    color: "#f4f4f4",
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                  Text-Inhalt
                </label>
                <textarea
                  value={editingTemplate.body_text}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body_text: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] font-mono"
                  style={{
                    backgroundColor: "#1a1d24",
                    borderColor: "#272a33",
                    color: "#f4f4f4",
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#272a33",
                  color: "#b3b3b3",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1f2329";
                  e.currentTarget.style.color = "#f4f4f4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#b3b3b3";
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                style={{
                  backgroundColor: "#007bff",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0056b3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#007bff";
                }}
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

