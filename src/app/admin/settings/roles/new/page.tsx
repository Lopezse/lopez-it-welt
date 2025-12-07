"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Plus
} from "lucide-react";
import Link from "next/link";

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

// Vorlagen für schnelle Rollenerstellung
const ROLE_TEMPLATES = [
  {
    name: "Viewer",
    description: "Nur-Lese-Zugriff auf alle Bereiche",
    permissions: ["users.view", "roles.view", "settings.view", "security.view", "dashboard.view", "reports.view", "audit.view"],
  },
  {
    name: "Editor",
    description: "Lese- und Bearbeitungszugriff",
    permissions: ["users.view", "users.edit", "roles.view", "settings.view", "settings.edit", "dashboard.view", "reports.view"],
  },
  {
    name: "Administrator",
    description: "Vollzugriff auf Benutzer und Rollen",
    permissions: ["users.view", "users.create", "users.edit", "users.delete", "roles.view", "roles.create", "roles.edit", "roles.delete", "settings.view", "settings.edit", "security.view", "security.manage", "dashboard.view", "reports.view", "audit.view"],
  },
];

/**
 * Enterprise++ Neue Rolle erstellen
 * - Rollendetails eingeben
 * - Berechtigungen zuweisen
 * - Vorlagen verwenden
 */
export default function NewRolePage() {
  const router = useRouter();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formular-State
  const [formData, setFormData] = useState({
    role_name: "",
    description: "",
  });

  const validateForm = (): string | null => {
    if (!formData.role_name.trim()) return "Rollenname ist erforderlich";
    if (formData.role_name.length < 3) return "Rollenname muss mindestens 3 Zeichen haben";
    if (selectedPermissions.length === 0) return "Mindestens eine Berechtigung muss ausgewählt werden";
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_name: formData.role_name,
          description: formData.description,
          permissions: selectedPermissions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Rolle erfolgreich erstellt");
        setTimeout(() => {
          router.push("/admin/settings/roles");
        }, 1500);
      } else {
        setError(data.message || "Fehler beim Erstellen");
      }
    } catch (err) {
      console.error("Fehler beim Erstellen:", err);
      setError("Fehler beim Erstellen der Rolle");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const toggleCategory = (categoryId: string) => {
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

  const applyTemplate = (template: typeof ROLE_TEMPLATES[0]) => {
    setFormData({
      role_name: template.name,
      description: template.description,
    });
    setSelectedPermissions(template.permissions);
  };

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
              <Plus className="w-6 h-6 text-green-400" />
              Neue Rolle erstellen
            </h1>
            <p className="text-gray-400 text-sm">
              Enterprise++ Rollenverwaltung
            </p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Rolle erstellen
        </button>
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
                <label className="block text-sm text-gray-400 mb-1">
                  Rollenname <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.role_name}
                  onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                  placeholder="z.B. Content Manager"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Beschreibung</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kurze Beschreibung der Rolle..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Berechtigungen */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              Berechtigungen <span className="text-red-400">*</span>
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
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
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
          {/* Vorlagen */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Vorlagen</h3>
            <p className="text-sm text-gray-400 mb-4">
              Schnellstart mit vorkonfigurierten Rollen
            </p>
            
            <div className="space-y-3">
              {ROLE_TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  onClick={() => applyTemplate(template)}
                  className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-purple-500/30 rounded-lg transition-colors"
                >
                  <span className="text-white font-medium">{template.name}</span>
                  <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                  <p className="text-xs text-purple-400 mt-1">{template.permissions.length} Berechtigungen</p>
                </button>
              ))}
            </div>
          </div>

          {/* Statistik */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Übersicht</h3>
            
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

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Gesamt</span>
                <span className="text-white font-medium">
                  {selectedPermissions.length}/{AVAILABLE_PERMISSIONS.length}
                </span>
              </div>
            </div>
          </div>

          {/* Hinweis */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2">💡 Hinweis</h4>
            <p className="text-sm text-gray-400">
              Berechtigungen können nach dem Erstellen jederzeit angepasst werden.
              Wählen Sie nur die minimal notwendigen Rechte (Least Privilege Principle).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}










