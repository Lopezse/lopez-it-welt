"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaKey, FaPlus, FaShieldAlt, FaTrash, FaUsers } from "react-icons/fa";

interface Role {
  id: number;
  role_name: string;
  role_code: string;
  role_description: string;
  is_system_role: boolean;
  is_active: boolean;
  permissions: string[];
  user_count: number;
  created_at: string;
  updated_at: string;
}

interface Permission {
  id: number;
  permission_key: string;
  permission_name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
  is_system_permission: boolean;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    role_name: "",
    role_code: "",
    role_description: "",
    permissions: [] as string[],
  });

  // Rollen laden
  const loadRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles");
      if (response.ok) {
        const data = await response.json();
        setRoles(data.data || []);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Rollen:", error);
      setError("Fehler beim Laden der Rollen");
    }
  };

  // Berechtigungen laden
  const loadPermissions = async () => {
    try {
      const response = await fetch("/api/admin/permissions");
      if (response.ok) {
        const data = await response.json();
        setPermissions(data.data.permissions || []);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Berechtigungen:", error);
    }
  };

  // Neue Rolle hinzufügen
  const addRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRole),
      });

      const data = await response.json();
      if (data.success) {
        setNewRole({
          role_name: "",
          role_code: "",
          role_description: "",
          permissions: [],
        });
        setShowAddForm(false);
        loadRoles();
      } else {
        setError(data.message || "Fehler beim Erstellen der Rolle");
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error);
      setError("Fehler beim Hinzufügen der Rolle");
    }
  };

  // Rolle bearbeiten
  const editRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    try {
      const response = await fetch("/api/admin/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingRole.id,
          role_name: editingRole.role_name,
          role_code: editingRole.role_code,
          role_description: editingRole.role_description,
          permissions: editingRole.permissions,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEditingRole(null);
        loadRoles();
      } else {
        setError(data.message || "Fehler beim Aktualisieren der Rolle");
      }
    } catch (error) {
      console.error("Fehler beim Bearbeiten:", error);
      setError("Fehler beim Bearbeiten der Rolle");
    }
  };

  // Rolle löschen
  const deleteRole = async (id: number) => {
    if (!confirm("Rolle wirklich löschen?")) return;

    try {
      const response = await fetch(`/api/admin/roles?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        loadRoles();
      } else {
        setError(data.message || "Fehler beim Löschen der Rolle");
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      setError("Fehler beim Löschen der Rolle");
    }
  };

  // Berechtigungen nach Kategorien gruppieren
  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadRoles(), loadPermissions()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Rollen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rollenverwaltung</h1>
              <p className="text-gray-600">Rollen und Berechtigungen verwalten</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              Neue Rolle
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a
              href="/admin"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Dashboard
            </a>
            <a
              href="/admin/users"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Benutzer
            </a>
            <a
              href="/admin/roles"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
            >
              Rollen
            </a>
            <a
              href="/admin/settings"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Einstellungen
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Add Role Form */}
        {showAddForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Neue Rolle hinzufügen</h2>
            <form onSubmit={addRole} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rollenname</label>
                  <input
                    type="text"
                    value={newRole.role_name}
                    onChange={(e) => setNewRole({ ...newRole, role_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rollencode</label>
                  <input
                    type="text"
                    value={newRole.role_code}
                    onChange={(e) => setNewRole({ ...newRole, role_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                <textarea
                  value={newRole.role_description}
                  onChange={(e) => setNewRole({ ...newRole, role_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Rolle erstellen
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Role Form */}
        {editingRole && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Rolle bearbeiten: {editingRole.role_name}
            </h2>
            <form onSubmit={editRole} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rollenname</label>
                  <input
                    type="text"
                    value={editingRole.role_name}
                    onChange={(e) =>
                      setEditingRole({
                        ...editingRole,
                        role_name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rollencode</label>
                  <input
                    type="text"
                    value={editingRole.role_code}
                    onChange={(e) =>
                      setEditingRole({
                        ...editingRole,
                        role_code: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                <textarea
                  value={editingRole.role_description}
                  onChange={(e) =>
                    setEditingRole({
                      ...editingRole,
                      role_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Änderungen speichern
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Roles Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Rollen ({roles.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rolle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Benutzer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Berechtigungen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaShieldAlt className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{role.role_name}</div>
                          <div className="text-sm text-gray-500">{role.role_description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {role.role_code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaUsers className="mr-2 text-gray-400" />
                        {role.user_count}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaKey className="mr-2 text-gray-400" />
                        {role.permissions.length}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          role.is_system_role
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {role.is_system_role ? "System" : "Benutzer"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!role.is_system_role && (
                        <>
                          <button
                            onClick={() => setEditingRole(role)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteRole(role.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
