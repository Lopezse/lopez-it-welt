"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Shield, 
  Save, 
  ArrowLeft, 
  Loader2,
  CheckCircle,
  XCircle,
  Key,
  Users,
  Settings,
  Eye,
  Lock,
  Trash2
} from "lucide-react";
import Link from "next/link";

interface RoleData {
  id: number;
  role_name: string;
  description: string;
  permissions: string[];
  user_count: number;
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const PERMISSION_CATEGORIES = [
  { id: "users", name: "Benutzer", icon: Users },
  { id: "roles", name: "Rollen", icon: Shield },
  { id: "settings", name: "Einstellungen", icon: Settings },
  { id: "security", name: "Sicherheit", icon: Lock },
  { id: "view", name: "Ansicht", icon: Eye },
];

const AVAILABLE_PERMISSIONS: Permission[] = [
  // Benutzer
  { id: "users.view", name: "Benutzer ansehen", description: "Benutzerliste einsehen", category: "users" },
  { id: "users.create", name: "Benutzer erstellen", description: "Neue Benutzer anlegen", category: "users" },
  { id: "users.edit", name: "Benutzer bearbeiten", description: "Benutzer bearbeiten", category: "users" },
  { id: "users.delete", name: "Benutzer löschen", description: "Benutzer entfernen", category: "users" },
  // Rollen
  { id: "roles.view", name: "Rollen ansehen", description: "Rollenliste einsehen", category: "roles" },
  { id: "roles.create", name: "Rollen erstellen", description: "Neue Rollen anlegen", category: "roles" },
  { id: "roles.edit", name: "Rollen bearbeiten", description: "Rollen bearbeiten", category: "roles" },
  { id: "roles.delete", name: "Rollen löschen", description: "Rollen entfernen", category: "roles" },
  // Einstellungen
  { id: "settings.view", name: "Einstellungen ansehen", description: "Systemeinstellungen einsehen", category: "settings" },
  { id: "settings.edit", name: "Einstellungen bearbeiten", description: "Systemeinstellungen ändern", category: "settings" },
  // Sicherheit
  { id: "security.view", name: "Sicherheit ansehen", description: "Sicherheitseinstellungen einsehen", category: "security" },
  { id: "security.manage", name: "Sicherheit verwalten", description: "Sicherheitseinstellungen ändern", category: "security" },
  { id: "security.2fa", name: "2FA verwalten", description: "2FA für andere Benutzer verwalten", category: "security" },
  // Ansicht
  { id: "dashboard.view", name: "Dashboard", description: "Dashboard einsehen", category: "view" },
  { id: "reports.view", name: "Berichte", description: "Berichte einsehen", category: "view" },
  { id: "audit.view", name: "Audit-Logs", description: "Audit-Logs einsehen", category: "view" },
];

/**
 * Enterprise++ Rollen-Bearbeitungsseite
 * - Rollendetails anzeigen und bearbeiten
 * - Berechtigungen zuweisen
 */
export default function RoleEditPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;

  const [role, setRole] = useState<RoleData | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formular-State
  const [formData, setFormData] = useState({
    role_name: "",
    description: "",
  });

  useEffect(() => {
    loadRoleData();
  }, [roleId]);

  const loadRoleData = async () => {
    try {
      const response = await fetch(`/api/admin/roles/${roleId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setRole(data.data);
        setFormData({
          role_name: data.data.role_name || "",
          description: data.data.description || "",
        });
        setSelectedPermissions(data.data.permissions || []);
      } else {
        setError(data.message || "Rolle nicht gefunden");
      }
    } catch (err) {
      console.error("Fehler beim Laden:", err);
      setError("Fehler beim Laden der Rolle");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (role?.is_system_role) {
      setError("System-Rollen können nicht bearbeitet werden");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          permissions: selectedPermissions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Rolle erfolgreich aktualisiert");
        loadRoleData();
      } else {
        setError(data.message || "Fehler beim Speichern");
      }
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      setError("Fehler beim Speichern der Rolle");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    if (role?.is_system_role) return;
    
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    if (role?.is_system_role) return;
    
    const categoryPermissions = AVAILABLE_PERMISSIONS
      .filter(p => p.category === categoryId)
      .map(p => p.id);
    
    const allSelected = categoryPermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(p => !categoryPermissions.includes(p)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissions])]);
    }
  };

  const handleDelete = async () => {
    if (role?.is_system_role) {
      setError("System-Rollen können nicht gelöscht werden");
      return;
    }

    if (role?.user_count && role.user_count > 0) {
      setError(`Diese Rolle ist noch ${role.user_count} Benutzern zugewiesen`);
      return;
    }

    if (!confirm("Möchten Sie diese Rolle wirklich löschen?")) return;

    try {
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/settings/roles");
      } else {
        setError(data.message || "Fehler beim Löschen");
      }
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
      setError("Fehler beim Löschen der Rolle");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-400">Rolle wird geladen...</span>
      </div>
    );
  }

  if (error && !role) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-700/30 rounded-lg">
        <h2 className="text-red-400 font-semibold mb-2">Fehler</h2>
        <p className="text-gray-300">{error}</p>
        <Link 
          href="/admin/settings/roles"
          className="mt-4 inline-flex items-center text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Rollenliste
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/settings/roles"
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-400" />
              Rolle bearbeiten
            </h1>
            <p className="text-gray-400 text-sm">
              {role?.role_name} • ID: {roleId}
              {role?.is_system_role && (
                <span className="ml-2 px-2 py-0.5 bg-yellow-900/30 text-yellow-400 text-xs rounded">
                  System-Rolle
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!role?.is_system_role && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-700/30 rounded-lg text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Löschen
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || role?.is_system_role}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Speichern
          </button>
        </div>
      </div>

      {/* Status-Meldungen */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700/30 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-300">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-700/30 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-300">{success}</span>
        </div>
      )}

      {role?.is_system_role && (
        <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg flex items-center gap-2">
          <Lock className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-300">
            System-Rollen können nicht bearbeitet werden. Sie dienen als Basis für das Enterprise++ System.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hauptformular */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grunddaten */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-400" />
              Grunddaten
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Rollenname</label>
                <input
                  type="text"
                  value={formData.role_name}
                  onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                  disabled={role?.is_system_role}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Beschreibung</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={role?.is_system_role}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                />
              </div>
            </div>
          </div>

          {/* Berechtigungen */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              Berechtigungen
            </h2>
            
            <div className="space-y-6">
              {PERMISSION_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const categoryPermissions = AVAILABLE_PERMISSIONS.filter(
                  p => p.category === category.id
                );
                const selectedCount = categoryPermissions.filter(
                  p => selectedPermissions.includes(p.id)
                ).length;
                const allSelected = selectedCount === categoryPermissions.length;

                return (
                  <div key={category.id} className="border border-gray-700 rounded-lg overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-4 bg-gray-800/50 cursor-pointer"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-medium">{category.name}</span>
                        <span className="text-sm text-gray-500">
                          ({selectedCount}/{categoryPermissions.length})
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleCategory(category.id)}
                        disabled={role?.is_system_role}
                        className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded"
                      />
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-3">
                      {categoryPermissions.map((permission) => (
                        <label 
                          key={permission.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedPermissions.includes(permission.id)
                              ? "bg-purple-900/20 border border-purple-500/30"
                              : "bg-gray-800/30 border border-gray-700/50 hover:border-gray-600"
                          } ${role?.is_system_role ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            disabled={role?.is_system_role}
                            className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded"
                          />
                          <div>
                            <span className="text-white text-sm">{permission.name}</span>
                            <p className="text-xs text-gray-500">{permission.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info-Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Rolleninfo</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-900/30">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Zugewiesene Benutzer</p>
                  <p className="text-white font-medium">{role?.user_count || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-900/30">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Berechtigungen</p>
                  <p className="text-white font-medium">{selectedPermissions.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistik */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Berechtigungs-Übersicht</h3>
            
            <div className="space-y-2">
              {PERMISSION_CATEGORIES.map((category) => {
                const categoryPermissions = AVAILABLE_PERMISSIONS.filter(
                  p => p.category === category.id
                );
                const selectedCount = categoryPermissions.filter(
                  p => selectedPermissions.includes(p.id)
                ).length;
                const percentage = Math.round((selectedCount / categoryPermissions.length) * 100);

                return (
                  <div key={category.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{category.name}</span>
                      <span className="text-white">{selectedCount}/{categoryPermissions.length}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




