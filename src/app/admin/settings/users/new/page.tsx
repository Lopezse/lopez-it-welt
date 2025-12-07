"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Shield, 
  Save, 
  ArrowLeft, 
  Loader2,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  UserPlus
} from "lucide-react";
import Link from "next/link";

interface Role {
  id: number;
  role_name: string;
  description: string;
}

/**
 * Enterprise++ Neue Benutzer-Seite
 * - Neuen Benutzer erstellen
 * - Rollen zuweisen
 * - Passwort setzen
 */
export default function NewUserPage() {
  const router = useRouter();

  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Formular-State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
    status: "active",
    send_welcome_email: true,
  });

  useEffect(() => {
    loadAvailableRoles();
  }, []);

  const loadAvailableRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles");
      const data = await response.json();
      
      if (data.success && data.data) {
        setAvailableRoles(data.data);
      }
    } catch (err) {
      console.error("Fehler beim Laden der Rollen:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): string | null => {
    if (!formData.username.trim()) return "Benutzername ist erforderlich";
    if (!formData.email.trim()) return "E-Mail ist erforderlich";
    if (!formData.password) return "Passwort ist erforderlich";
    if (formData.password.length < 8) return "Passwort muss mindestens 8 Zeichen haben";
    if (formData.password !== formData.password_confirm) return "Passwörter stimmen nicht überein";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Ungültige E-Mail-Adresse";
    if (selectedRoles.length === 0) return "Mindestens eine Rolle muss zugewiesen werden";
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
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
          status: formData.status,
          roles: selectedRoles,
          send_welcome_email: formData.send_welcome_email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Benutzer erfolgreich erstellt");
        setTimeout(() => {
          router.push("/admin/settings/users");
        }, 1500);
      } else {
        setError(data.message || "Fehler beim Erstellen");
      }
    } catch (err) {
      console.error("Fehler beim Erstellen:", err);
      setError("Fehler beim Erstellen des Benutzers");
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

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ 
      ...formData, 
      password: password,
      password_confirm: password 
    });
    setShowPassword(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-400">Wird geladen...</span>
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
              <UserPlus className="w-6 h-6 text-green-400" />
              Neuen Benutzer erstellen
            </h1>
            <p className="text-gray-400 text-sm">
              Enterprise++ Benutzerverwaltung
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
          Benutzer erstellen
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
          {/* Account-Daten */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Account-Daten
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Benutzername <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="z.B. max.mustermann"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  E-Mail <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="max@beispiel.de"
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

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
            </div>
          </div>

          {/* Passwort */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-yellow-400" />
              Passwort
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Passwort <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mindestens 8 Zeichen"
                    className="w-full px-3 py-2 pr-20 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Passwort bestätigen <span className="text-red-400">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password_confirm}
                  onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                  placeholder="Passwort wiederholen"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={generatePassword}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                🎲 Sicheres Passwort generieren
              </button>
            </div>
          </div>

          {/* Rollen */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              Rollen zuweisen <span className="text-red-400">*</span>
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
          {/* Status */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
            
            <div className="space-y-3">
              {["active", "inactive"].map((status) => (
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
                    status === "active" ? "text-green-400" : "text-yellow-400"
                  }`}>
                    {status === "active" ? "Aktiv" : "Inaktiv"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Optionen */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Optionen</h3>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.send_welcome_email}
                onChange={(e) => setFormData({ ...formData, send_welcome_email: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded"
              />
              <div>
                <span className="text-white text-sm">Willkommens-E-Mail senden</span>
                <p className="text-xs text-gray-500">Benutzer erhält Login-Daten per E-Mail</p>
              </div>
            </label>
          </div>

          {/* Hinweis */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2">💡 Hinweis</h4>
            <p className="text-sm text-gray-400">
              Nach dem Erstellen kann der Benutzer sich anmelden und sein Profil vervollständigen. 
              2FA kann in den Benutzereinstellungen aktiviert werden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}










