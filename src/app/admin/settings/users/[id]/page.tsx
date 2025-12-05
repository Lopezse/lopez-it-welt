"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Shield, 
  Save, 
  ArrowLeft, 
  Loader2,
  Key,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  two_factor_enabled: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;
}

interface Role {
  id: number;
  role_name: string;
  description: string;
}

/**
 * Enterprise++ Benutzer-Bearbeitungsseite
 * - Benutzerdetails anzeigen und bearbeiten
 * - Rollen zuweisen
 * - Status ändern
 */
export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserData | null>(null);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formular-State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    status: "active",
  });

  useEffect(() => {
    loadUserData();
    loadAvailableRoles();
  }, [userId]);

  const loadUserData = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setUser(data.data);
        setFormData({
          first_name: data.data.first_name || "",
          last_name: data.data.last_name || "",
          email: data.data.email || "",
          status: data.data.status || "active",
        });
        setSelectedRoles(data.data.roles || []);
      } else {
        setError(data.message || "Benutzer nicht gefunden");
      }
    } catch (err) {
      console.error("Fehler beim Laden:", err);
      setError("Fehler beim Laden des Benutzers");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles");
      const data = await response.json();
      
      if (data.success && data.data) {
        setAvailableRoles(data.data);
      }
    } catch (err) {
      console.error("Fehler beim Laden der Rollen:", err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Benutzer aktualisieren
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          roles: selectedRoles,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Benutzer erfolgreich aktualisiert");
        loadUserData(); // Neu laden
      } else {
        setError(data.message || "Fehler beim Speichern");
      }
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      setError("Fehler beim Speichern des Benutzers");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRole = (roleName: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleName) 
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-400">Benutzer wird geladen...</span>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-700/30 rounded-lg">
        <h2 className="text-red-400 font-semibold mb-2">Fehler</h2>
        <p className="text-gray-300">{error}</p>
        <Link 
          href="/admin/settings/users"
          className="mt-4 inline-flex items-center text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Benutzerliste
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/settings/users"
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="w-6 h-6 text-blue-400" />
              Benutzer bearbeiten
            </h1>
            <p className="text-gray-400 text-sm">
              {user?.username} • ID: {userId}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
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
          {/* Persönliche Daten */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Persönliche Daten
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Vorname</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nachname</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-1">Benutzername</label>
              <input
                type="text"
                value={user?.username || ""}
                disabled
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Benutzername kann nicht geändert werden</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-1">E-Mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Status
            </h2>
            
            <div className="flex gap-4">
              {["active", "inactive", "locked"].map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700"
                  />
                  <span className={`text-sm ${
                    status === "active" ? "text-green-400" :
                    status === "inactive" ? "text-yellow-400" :
                    "text-red-400"
                  }`}>
                    {status === "active" ? "Aktiv" :
                     status === "inactive" ? "Inaktiv" :
                     "Gesperrt"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rollen */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" />
              Rollen zuweisen
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              {availableRoles.map((role) => (
                <label 
                  key={role.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRoles.includes(role.role_name)
                      ? "bg-blue-900/30 border border-blue-500/50"
                      : "bg-gray-800/50 border border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.role_name)}
                    onChange={() => toggleRole(role.role_name)}
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded"
                  />
                  <div>
                    <span className="text-white text-sm font-medium">{role.role_name}</span>
                    {role.description && (
                      <p className="text-xs text-gray-500">{role.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
            
            {availableRoles.length === 0 && (
              <p className="text-gray-500 text-sm">Keine Rollen verfügbar</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info-Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Benutzerinfo</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${user?.two_factor_enabled ? "bg-green-900/30" : "bg-yellow-900/30"}`}>
                  <Shield className={`w-5 h-5 ${user?.two_factor_enabled ? "text-green-400" : "text-yellow-400"}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">2FA Status</p>
                  <p className={`font-medium ${user?.two_factor_enabled ? "text-green-400" : "text-yellow-400"}`}>
                    {user?.two_factor_enabled ? "Aktiviert" : "Nicht aktiviert"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-900/30">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Erstellt am</p>
                  <p className="text-white text-sm">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString("de-DE") : "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-900/30">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Letzte Änderung</p>
                  <p className="text-white text-sm">
                    {user?.updated_at ? new Date(user.updated_at).toLocaleDateString("de-DE") : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Schnellaktionen</h3>
            
            <div className="space-y-3">
              <Link
                href={`/admin/settings/users/${userId}/2fa`}
                className="flex items-center gap-2 w-full px-4 py-2 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700/30 rounded-lg text-purple-300 transition-colors"
              >
                <Key className="w-4 h-4" />
                2FA verwalten
              </Link>
              
              <button
                onClick={() => {
                  if (confirm("Passwort-Reset für diesen Benutzer durchführen?")) {
                    // TODO: Implement password reset
                    alert("Passwort-Reset würde hier ausgeführt werden");
                  }
                }}
                className="flex items-center gap-2 w-full px-4 py-2 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-700/30 rounded-lg text-yellow-300 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Passwort zurücksetzen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




