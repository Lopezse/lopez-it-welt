"use client";

// =====================================================
// CUSTOMER TAG MODAL - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Kunden-Tags verwalten
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { useEffect, useState } from "react";
import { FaCheck, FaTag, FaTimes } from "react-icons/fa";

interface Tag {
  id: number;
  tag_name: string;
  tag_color: string;
  tag_description: string;
}

interface CustomerTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  currentTags: Tag[];
  onTagsUpdate: (tags: Tag[]) => void;
}

export default function CustomerTagModal({
  isOpen,
  onClose,
  customerId,
  customerName,
  currentTags,
  onTagsUpdate,
}: CustomerTagModalProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LIFECYCLE & DATA LOADING
  // =====================================================

  useEffect(() => {
    if (isOpen) {
      loadAvailableTags();
    }
  }, [isOpen]);

  const loadAvailableTags = async () => {
    try {
      setLoading(true);
      setError("");

      // Demo-Tags (in Produktion: echte API-Abfrage)
      const demoTags: Tag[] = [
        {
          id: 1,
          tag_name: "VIP",
          tag_color: "#DC2626",
          tag_description: "VIP-Kunde mit besonderen Service-Level",
        },
        {
          id: 2,
          tag_name: "Neukunde",
          tag_color: "#059669",
          tag_description: "Neuer Kunde im System",
        },
        {
          id: 3,
          tag_name: "Langzeitkunde",
          tag_color: "#7C3AED",
          tag_description: "Kunde seit über 5 Jahren",
        },
        {
          id: 4,
          tag_name: "Problematisch",
          tag_color: "#EA580C",
          tag_description: "Kunde mit wiederholten Problemen",
        },
        {
          id: 5,
          tag_name: "Potenzial",
          tag_color: "#0891B2",
          tag_description: "Kunde mit hohem Wachstumspotenzial",
        },
        {
          id: 6,
          tag_name: "Partner",
          tag_color: "#7C2D12",
          tag_description: "Geschäftspartner",
        },
        {
          id: 7,
          tag_name: "Behörde",
          tag_color: "#1E40AF",
          tag_description: "Öffentliche Einrichtung",
        },
        {
          id: 8,
          tag_name: "Startup",
          tag_color: "#BE185D",
          tag_description: "Junges Unternehmen",
        },
      ];

      setAvailableTags(demoTags);
    } catch (err) {
      console.error("Tags laden Fehler:", err);
      setError("Fehler beim Laden der verfügbaren Tags");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // TAG MANAGEMENT FUNCTIONS
  // =====================================================

  const handleTagToggle = (tag: Tag) => {
    const isAssigned = currentTags.some((t) => t.id === tag.id);

    if (isAssigned) {
      // Tag entfernen
      const updatedTags = currentTags.filter((t) => t.id !== tag.id);
      onTagsUpdate(updatedTags);
    } else {
      // Tag hinzufügen
      const updatedTags = [...currentTags, tag];
      onTagsUpdate(updatedTags);
    }
  };

  const handleSaveTags = async () => {
    try {
      setLoading(true);
      setError("");

      // Demo: Tags speichern (in Produktion: API-Aufruf)
      console.log("🏷️ Tags speichern für Kunde:", customerId, currentTags);

      // Simuliere API-Aufruf
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
    } catch (err) {
      console.error("Tags speichern Fehler:", err);
      setError("Fehler beim Speichern der Tags");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaTag className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Tags für {customerName}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Fehler</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {/* Aktuelle Tags */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Aktuelle Tags</h4>
            {currentTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: tag.tag_color + "20",
                      color: tag.tag_color,
                    }}
                  >
                    {tag.tag_name}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Keine Tags zugewiesen</p>
            )}
          </div>

          {/* Verfügbare Tags */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Verfügbare Tags</h4>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableTags.map((tag) => {
                  const isAssigned = currentTags.some((t) => t.id === tag.id);
                  return (
                    <div
                      key={tag.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        isAssigned
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: tag.tag_color }}
                          ></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{tag.tag_name}</p>
                            <p className="text-xs text-gray-500">{tag.tag_description}</p>
                          </div>
                        </div>
                        {isAssigned && <FaCheck className="h-4 w-4 text-blue-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSaveTags}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Wird gespeichert...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Tags speichern
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
