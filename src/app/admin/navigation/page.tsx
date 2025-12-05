/**
 * Admin Navigation Management Page
 * 
 * Verwaltet die Admin-Navigation (aus Datenbank)
 * Enterprise++ Standard
 */

"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronRight } from "react-icons/fa";

interface SubNavItem {
  id: number;
  name: string;
  href: string;
  icon_name: string;
  order_index: number;
  badge_text?: string;
  badge_color?: string;
  dynamic_badge?: boolean;
  badge_api_endpoint?: string;
  is_active: boolean;
}

interface NavItem {
  id: number;
  name: string;
  href?: string;
  icon_name: string;
  description: string;
  order_index: number;
  badge_text?: string;
  badge_color?: string;
  dynamic_badge?: boolean;
  badge_api_endpoint?: string;
  is_active: boolean;
  subItems: SubNavItem[];
}

export default function NavigationManagementPage() {
  const [navigation, setNavigation] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadNavigation();
  }, []);

  const loadNavigation = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/navigation", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        setNavigation(data);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Navigation:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Möchten Sie diesen Navigationspunkt wirklich löschen?")) {
      return;
    }

    try {
      const response = await fetch("/api/admin/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: false }),
      });

      if (response.ok) {
        loadNavigation();
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Navigation-Verwaltung</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Neuer Navigationspunkt
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Navigationsstruktur</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {navigation.map((item) => (
            <div key={item.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedItems.has(item.id) ? (
                      <FaChevronDown className="h-4 w-4" />
                    ) : (
                      <FaChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {expandedItems.has(item.id) && (
                <div className="ml-8 mt-4 space-y-2">
                  {item.subItems && item.subItems.length > 0 ? (
                    item.subItems.map((subItem) => (
                      <div
                        key={subItem.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <div className="font-medium">{subItem.name}</div>
                          <div className="text-sm text-gray-500">{subItem.href}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <FaEdit className="h-3 w-3" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">Keine Unterpunkte</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showAddForm && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Neuer Navigationspunkt</h2>
          <p className="text-sm text-gray-500 mb-4">
            Hinweis: Vollständige Bearbeitungsfunktion folgt in einer späteren Version.
          </p>
          <button
            onClick={() => setShowAddForm(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Schließen
          </button>
        </div>
      )}
    </div>
  );
}


