"use client";

import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaHistory, FaUpload, FaCheckCircle } from "react-icons/fa";
import PasswordStrengthIndicator from "@/components/ui/PasswordStrengthIndicator";

interface UserProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  email_verified: boolean;
  two_factor_enabled: boolean;
}

interface LoginHistoryItem {
  id: number;
  date: string;
  ip: string;
  device: string;
  status: string;
}

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<UserProfileData | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
    loadLoginHistory();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/admin/settings/profile");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          if (result.data.avatar_url) {
            setAvatarPreview(result.data.avatar_url);
          }
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden des Profils:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLoginHistory = async () => {
    try {
      const response = await fetch("/api/admin/settings/profile/login-history");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setLoginHistory(result.data || []);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Login-Historie:", error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Datei ist zu groß. Maximal 2MB erlaubt.");
        return;
      }
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        alert("Nur JPG und PNG Dateien sind erlaubt.");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const response = await fetch("/api/admin/settings/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData({ ...data!, avatar_url: result.data.avatar_url });
          setAvatarFile(null);
          alert("Avatar erfolgreich hochgeladen.");
        }
      } else {
        alert("Fehler beim Hochladen des Avatars.");
      }
    } catch (error) {
      console.error("Fehler beim Hochladen des Avatars:", error);
      alert("Fehler beim Hochladen des Avatars.");
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("Profil erfolgreich aktualisiert.");
        }
      } else {
        alert("Fehler beim Aktualisieren des Profils.");
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Enterprise++ Validierung
    if (!passwordData.current) {
      alert("Bitte geben Sie Ihr aktuelles Passwort ein.");
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      alert("Die neuen Passwörter stimmen nicht überein.");
      return;
    }

    if (passwordData.new.length < 12) {
      alert("Das Passwort muss mindestens 12 Zeichen lang sein (Enterprise++ Standard).");
      return;
    }

    // Passwort-Stärke prüfen
    const hasUppercase = /[A-Z]/.test(passwordData.new);
    const hasLowercase = /[a-z]/.test(passwordData.new);
    const hasNumbers = /\d/.test(passwordData.new);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.new);

    if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecialChars) {
      alert("Passwort erfüllt nicht die Enterprise++ Anforderungen:\n- Mindestens 12 Zeichen\n- Großbuchstaben (A-Z)\n- Kleinbuchstaben (a-z)\n- Zahlen (0-9)\n- Sonderzeichen (!@#$%^&*)");
      return;
    }

    try {
      const response = await fetch("/api/admin/settings/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Wichtig: Cookies mitsenden
        body: JSON.stringify({
          current: passwordData.current,
          new: passwordData.new,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("✅ Passwort erfolgreich geändert (Enterprise++ Standard).");
        setShowPasswordModal(false);
        setPasswordData({ current: "", new: "", confirm: "" });
      } else {
        // Detaillierte Fehlermeldung anzeigen
        const errorMessage = result.error || "Fehler beim Ändern des Passworts.";
        alert(`❌ ${errorMessage}`);
      }
    } catch (error) {
      console.error("Fehler beim Ändern des Passworts:", error);
      alert("❌ Fehler beim Ändern des Passworts. Bitte versuchen Sie es erneut.");
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p style={{ color: "#b3b3b3" }}>Lade Profil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Avatar Upload */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
          Avatar
        </label>
        <div className="flex items-center space-x-4">
          <div
            className="flex items-center justify-center h-20 w-20 rounded-full font-medium flex-shrink-0 border-2"
            style={{
              backgroundColor: avatarPreview ? "transparent" : "#1c1f27",
              borderColor: "#272a33",
              color: "#f4f4f4",
              fontSize: "24px",
              backgroundImage: avatarPreview ? `url(${avatarPreview})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!avatarPreview && `${data.first_name.charAt(0)}${data.last_name.charAt(0)}`}
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer border focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
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
              <FaUpload className="mr-2" style={{ width: "14px", height: "14px" }} />
              Avatar auswählen
            </label>
            {avatarFile && (
              <button
                onClick={handleAvatarUpload}
                className="ml-2 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                style={{
                  backgroundColor: "#007bff",
                  borderColor: "#007bff",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0056b3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#007bff";
                }}
              >
                Hochladen
              </button>
            )}
            <p className="mt-2 text-xs" style={{ color: "#8a8a8a" }}>
              Max. 2MB, JPG oder PNG
            </p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
            Vorname
          </label>
          <input
            type="text"
            value={data.first_name}
            onChange={(e) => setData({ ...data, first_name: e.target.value })}
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
            Nachname
          </label>
          <input
            type="text"
            value={data.last_name}
            onChange={(e) => setData({ ...data, last_name: e.target.value })}
            className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
            style={{
              backgroundColor: "#1a1d24",
              borderColor: "#272a33",
              color: "#f4f4f4",
            }}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
          E-Mail
        </label>
        <div className="relative">
          <input
            type="email"
            value={data.email}
            disabled
            className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200"
            style={{
              backgroundColor: "#1a1d24",
              borderColor: "#272a33",
              color: "#8a8a8a",
              cursor: "not-allowed",
            }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {data.email_verified ? (
              <span className="text-xs flex items-center" style={{ color: "#24a148" }}>
                <FaCheckCircle className="mr-1" style={{ width: "12px", height: "12px" }} />
                Verifiziert
              </span>
            ) : (
              <span className="text-xs" style={{ color: "#f1c21b" }}>
                Nicht verifiziert
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
          Telefon (optional)
        </label>
        <input
          type="tel"
          value={data.phone || ""}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
          style={{
            backgroundColor: "#1a1d24",
            borderColor: "#272a33",
            color: "#f4f4f4",
          }}
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
          Passwort
        </label>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#007bff]"
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
          <FaLock className="mr-2" style={{ width: "14px", height: "14px" }} />
          Passwort ändern
        </button>
      </div>

      {/* 2FA */}
      <div className="flex items-center justify-between py-4 border-t" style={{ borderColor: "#272a33" }}>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#f4f4f4" }}>
            Zwei-Faktor-Authentifizierung
          </label>
          <p className="text-xs" style={{ color: "#8a8a8a" }}>
            Erhöhen Sie die Sicherheit Ihres Kontos
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={data.two_factor_enabled}
            onChange={(e) => setData({ ...data, two_factor_enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div
            className="w-11 h-6 rounded-full peer transition-colors duration-200"
            style={{
              backgroundColor: data.two_factor_enabled ? "#007bff" : "#272a33",
            }}
          >
            <div
              className="w-5 h-5 rounded-full transition-transform duration-200 mt-0.5 ml-0.5"
              style={{
                backgroundColor: "#ffffff",
                transform: data.two_factor_enabled ? "translateX(20px)" : "translateX(0)",
              }}
            />
          </div>
        </label>
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

      {/* Login History */}
      <div className="pt-8 border-t" style={{ borderColor: "#272a33" }}>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaHistory className="mr-2" style={{ width: "18px", height: "18px" }} />
          Login-Historie
        </h3>
        {loginHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #272a33" }}>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#b3b3b3" }}>
                    Datum
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#b3b3b3" }}>
                    IP-Adresse
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#b3b3b3" }}>
                    Gerät
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#b3b3b3" }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #272a33" }}>
                    <td className="py-3 px-4 text-sm" style={{ color: "#f4f4f4" }}>
                      {new Date(item.date).toLocaleString("de-DE")}
                    </td>
                    <td className="py-3 px-4 text-sm" style={{ color: "#b3b3b3" }}>
                      {item.ip}
                    </td>
                    <td className="py-3 px-4 text-sm" style={{ color: "#b3b3b3" }}>
                      {item.device}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: item.status === "success" ? "#24a148" : "#da1e28",
                          color: "#ffffff",
                        }}
                      >
                        {item.status === "success" ? "Erfolgreich" : "Fehlgeschlagen"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm" style={{ color: "#8a8a8a" }}>
            Keine Login-Historie verfügbar.
          </p>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="rounded-lg p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: "#111217", border: "1px solid #272a33" }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
              Passwort ändern
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                  Aktuelles Passwort
                </label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
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
                  Neues Passwort (Enterprise++: min. 12 Zeichen, Groß/Klein/Zahl/Sonderz)
                </label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                  style={{
                    backgroundColor: "#1a1d24",
                    borderColor: "#272a33",
                    color: "#f4f4f4",
                  }}
                />
                {passwordData.new && (
                  <div className="mt-2">
                    <PasswordStrengthIndicator password={passwordData.new} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                  Neues Passwort bestätigen
                </label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
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
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ current: "", new: "", confirm: "" });
                }}
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
                onClick={handlePasswordChange}
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
                Ändern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
