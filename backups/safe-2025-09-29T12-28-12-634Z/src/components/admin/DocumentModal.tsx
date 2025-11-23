"use client";

import { useEffect, useState } from "react";
import { FaFileCode, FaHistory, FaListAlt, FaSave, FaStickyNote, FaTimes } from "react-icons/fa";

interface Document {
  id?: number;
  title: string;
  content: string;
  category: "system" | "howto" | "changelog" | "internal";
}

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: Document | null;
  onSave: (document: Document) => void;
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

export default function DocumentModal({ isOpen, onClose, document, onSave }: DocumentModalProps) {
  const [formData, setFormData] = useState<Document>({
    title: "",
    content: "",
    category: "system",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (document) {
      setFormData(document);
    } else {
      setFormData({
        title: "",
        content: "",
        category: "system",
      });
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {document ? "Dokument bearbeiten" : "Neues Dokument erstellen"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Titel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dokumenttitel eingeben..."
                required
              />
            </div>

            {/* Kategorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <label
                    key={key}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.category === key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={key}
                      checked={formData.category === key}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as any,
                        })
                      }
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(key)}
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Inhalt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Inhalt</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={15}
                placeholder="Dokumentinhalt eingeben... (Markdown unterstützt)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Markdown-Formatierung wird unterstützt (## Überschriften, **fett**, *kursiv*, etc.)
              </p>
            </div>
          </div>

          {/* Footer - Immer sichtbar */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="text-sm text-gray-500">
              {formData.title.trim() && formData.content.trim()
                ? "✅ Bereit zum Speichern"
                : "⚠️ Titel und Inhalt erforderlich"}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={saving || !formData.title.trim() || !formData.content.trim()}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <FaSave className="h-4 w-4 mr-2" />
                {saving ? "Speichere..." : "Speichern"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
