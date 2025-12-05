"use client";

import { useEffect, useState } from "react";
import { FaCheckSquare, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  checked: boolean;
  required: boolean;
}

interface Checklist {
  id: string;
  checklist_name: string;
  version: string;
  items: ChecklistItem[];
  status: "draft" | "in_progress" | "completed" | "approved";
  created_at: string;
  updated_at: string;
}

export function ChecklistManager() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChecklist, setNewChecklist] = useState({
    checklist_name: "",
    version: "",
    items: [] as ChecklistItem[],
  });

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/release/checklist");
      const result = await response.json();

      if (result.success) {
        setChecklists(result.data || []);
      } else {
        setError(result.message || "Fehler beim Laden der Checklisten");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Checklisten", err);
      setError("Fehler beim Laden der Checklisten");
    } finally {
      setLoading(false);
    }
  };

  const createChecklist = async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/release/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklist_name: newChecklist.checklist_name,
          version: newChecklist.version,
          items: newChecklist.items,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNewChecklist({ checklist_name: "", version: "", items: [] });
        setShowCreateForm(false);
        loadChecklists();
      } else {
        setError(result.message || "Fehler beim Erstellen der Checkliste");
      }
    } catch (err) {
      logger.error("Fehler beim Erstellen der Checkliste", err);
      setError("Fehler beim Erstellen der Checkliste");
    }
  };

  const toggleItem = async (checklistId: string, itemId: string) => {
    if (!selectedChecklist) return;

    const updatedItems = selectedChecklist.items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item,
    );

    try {
      setError(null);
      const response = await fetch("/api/admin/release/checklist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: checklistId,
          items: updatedItems,
          status: updatedItems.every((item) => item.checked) ? "completed" : "in_progress",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSelectedChecklist({ ...selectedChecklist, items: updatedItems });
        loadChecklists();
      } else {
        setError(result.message || "Fehler beim Aktualisieren der Checkliste");
      }
    } catch (err) {
      logger.error("Fehler beim Aktualisieren der Checkliste", err);
      setError("Fehler beim Aktualisieren der Checkliste");
    }
  };

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      title: "",
      description: "",
      checked: false,
      required: false,
    };
    setNewChecklist({
      ...newChecklist,
      items: [...newChecklist.items, newItem],
    });
  };

  const updateItem = (index: number, field: keyof ChecklistItem, value: any) => {
    const updatedItems = [...newChecklist.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewChecklist({ ...newChecklist, items: updatedItems });
  };

  const removeItem = (index: number) => {
    setNewChecklist({
      ...newChecklist,
      items: newChecklist.items.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FaCheckSquare className="mr-2" />
            Pre-Release Checklisten
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Checklisten für Releases verwalten
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <FaPlus className="h-4 w-4" />
          <span>Neue Checkliste</span>
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Neue Checkliste erstellen
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Checklistenname
              </label>
              <input
                type="text"
                value={newChecklist.checklist_name}
                onChange={(e) =>
                  setNewChecklist({ ...newChecklist, checklist_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="z.B. Release 1.0.0 Checkliste"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Version
              </label>
              <input
                type="text"
                value={newChecklist.version}
                onChange={(e) => setNewChecklist({ ...newChecklist, version: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="z.B. 1.0.0"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Items
                </label>
                <button
                  onClick={addItem}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center space-x-1"
                >
                  <FaPlus className="h-3 w-3" />
                  <span>Item hinzufügen</span>
                </button>
              </div>
              <div className="space-y-2">
                {newChecklist.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(index, "title", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="Item-Titel"
                      />
                      <input
                        type="text"
                        value={item.description || ""}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="Beschreibung (optional)"
                      />
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={item.required}
                          onChange={(e) => updateItem(index, "required", e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Erforderlich</span>
                      </label>
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={createChecklist}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Checkliste erstellen
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewChecklist({ checklist_name: "", version: "", items: [] });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {!showCreateForm && (
        <div className="space-y-3">
          {checklists.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Keine Checklisten vorhanden. Erstellen Sie eine neue Checkliste.
              </p>
            </div>
          ) : (
            checklists.map((checklist) => (
              <div
                key={checklist.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 dark:hover:border-blue-600"
                onClick={() => setSelectedChecklist(checklist)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {checklist.checklist_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Version: {checklist.version}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      checklist.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : checklist.status === "completed"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          : checklist.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {checklist.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {checklist.items.filter((item) => item.checked).length} / {checklist.items.length}{" "}
                  Items abgeschlossen
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedChecklist && !showCreateForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedChecklist.checklist_name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Version: {selectedChecklist.version}
              </p>
            </div>
            <button
              onClick={() => setSelectedChecklist(null)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {selectedChecklist.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-start space-x-3 p-3 border rounded-md ${
                  item.checked
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                }`}
              >
                <button
                  onClick={() => toggleItem(selectedChecklist.id, item.id)}
                  className={`mt-1 ${
                    item.checked
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                >
                  {item.checked ? <FaCheck className="h-5 w-5" /> : <FaCheckSquare className="h-5 w-5" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-gray-900 dark:text-white">{item.title}</h5>
                    {item.required && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        Erforderlich
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
