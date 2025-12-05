"use client";

import { useState, useEffect } from "react";
import { FaShieldAlt, FaKey, FaDesktop, FaTrash, FaCopy, FaPlus, FaQrcode } from "react-icons/fa";

interface SecurityData {
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  backup_codes?: string[];
}

interface ApiToken {
  id: number;
  name: string;
  token_preview: string;
  expires_at: string;
  last_used_at?: string;
  created_at: string;
}

interface Session {
  id: string;
  device: string;
  ip: string;
  last_activity: string;
  current: boolean;
}

export default function SecurityAccount() {
  const [loading, setLoading] = useState(true);
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [newToken, setNewToken] = useState({ name: "", expires_in_days: 30 });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [newTokenValue, setNewTokenValue] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadSecurity(), loadTokens(), loadSessions()]);
    setLoading(false);
  };

  const loadSecurity = async () => {
    try {
      const response = await fetch("/api/admin/settings/security");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSecurityData(result.data);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Sicherheitseinstellungen:", error);
    }
  };

  const loadTokens = async () => {
    try {
      const response = await fetch("/api/admin/settings/security/tokens");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTokens(result.data || []);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der API-Token:", error);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await fetch("/api/admin/settings/security/sessions");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSessions(result.data || []);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Sessions:", error);
    }
  };

  const handle2FAToggle = async (enabled: boolean) => {
    try {
      const response = await fetch("/api/admin/settings/security/2fa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          if (enabled && result.data.qr_code) {
            setQrCode(result.data.qr_code);
            setShow2FAModal(true);
          } else {
            setSecurityData({ ...securityData!, two_factor_enabled: enabled });
          }
        }
      }
    } catch (error) {
      console.error("Fehler beim Ändern der 2FA:", error);
    }
  };

  const handleCreateToken = async () => {
    if (!newToken.name || newToken.name.length < 3) {
      alert("Token-Name muss mindestens 3 Zeichen lang sein.");
      return;
    }

    try {
      const response = await fetch("/api/admin/settings/security/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newToken),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setNewTokenValue(result.data.token);
          setShowTokenModal(true);
          setNewToken({ name: "", expires_in_days: 30 });
          loadTokens();
        }
      }
    } catch (error) {
      console.error("Fehler beim Erstellen des Tokens:", error);
    }
  };

  const handleDeleteToken = async (id: number) => {
    if (!confirm("Möchten Sie diesen Token wirklich löschen?")) return;

    try {
      const response = await fetch(`/api/admin/settings/security/tokens/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadTokens();
      }
    } catch (error) {
      console.error("Fehler beim Löschen des Tokens:", error);
    }
  };

  const handleEndSession = async (id: string) => {
    if (!confirm("Möchten Sie diese Session wirklich beenden?")) return;

    try {
      const response = await fetch(`/api/admin/settings/security/sessions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadSessions();
      }
    } catch (error) {
      console.error("Fehler beim Beenden der Session:", error);
    }
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    alert("Token in Zwischenablage kopiert!");
  };

  if (loading || !securityData) {
    return (
      <div className="flex items-center justify-center py-12">
        <p style={{ color: "#b3b3b3" }}>Lade Sicherheitseinstellungen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 2FA */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaShieldAlt className="mr-2" style={{ width: "18px", height: "18px" }} />
          Zwei-Faktor-Authentifizierung
        </h3>
        <div className="rounded-lg p-6 border" style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                2FA {securityData.two_factor_enabled ? "aktiviert" : "deaktiviert"}
              </p>
              <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                Erhöhen Sie die Sicherheit Ihres Kontos
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securityData.two_factor_enabled}
                onChange={(e) => handle2FAToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer transition-colors duration-200"
                style={{
                  backgroundColor: securityData.two_factor_enabled ? "#007bff" : "#272a33",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full transition-transform duration-200 mt-0.5 ml-0.5"
                  style={{
                    backgroundColor: "#ffffff",
                    transform: securityData.two_factor_enabled ? "translateX(20px)" : "translateX(0)",
                  }}
                />
              </div>
            </label>
          </div>
          {securityData.two_factor_enabled && securityData.backup_codes && (
            <div className="mt-4 p-4 rounded border" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
              <p className="text-xs font-medium mb-2" style={{ color: "#f4f4f4" }}>
                Backup-Codes (nur einmal sichtbar):
              </p>
              <div className="grid grid-cols-2 gap-2">
                {securityData.backup_codes.map((code, idx) => (
                  <code key={idx} className="text-xs p-2 rounded" style={{ backgroundColor: "#050509", color: "#b3b3b3" }}>
                    {code}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Tokens */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center" style={{ color: "#f4f4f4" }}>
            <FaKey className="mr-2" style={{ width: "18px", height: "18px" }} />
            API-Token
          </h3>
          <button
            onClick={() => setShowTokenModal(true)}
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
            <FaPlus className="mr-2" style={{ width: "14px", height: "14px" }} />
            Neuer Token
          </button>
        </div>
        {tokens.length > 0 ? (
          <div className="space-y-2">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                    {token.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                    {token.token_preview} • Läuft ab: {new Date(token.expires_at).toLocaleDateString("de-DE")}
                  </p>
                  {token.last_used_at && (
                    <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                      Zuletzt verwendet: {new Date(token.last_used_at).toLocaleString("de-DE")}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteToken(token.id)}
                  className="ml-4 p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#da1e28]"
                  style={{ color: "#da1e28" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1f2329";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <FaTrash style={{ width: "14px", height: "14px" }} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "#8a8a8a" }}>
            Keine API-Token vorhanden.
          </p>
        )}
      </div>

      {/* Sessions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaDesktop className="mr-2" style={{ width: "18px", height: "18px" }} />
          Aktive Sessions
        </h3>
        {sessions.length > 0 ? (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                    {session.device} {session.current && "(Aktuell)"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                    {session.ip} • Zuletzt aktiv: {new Date(session.last_activity).toLocaleString("de-DE")}
                  </p>
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleEndSession(session.id)}
                    className="ml-4 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#da1e28]"
                    style={{
                      backgroundColor: "transparent",
                      borderColor: "#272a33",
                      color: "#da1e28",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1f2329";
                      e.currentTarget.style.borderColor = "#3a3d47";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "#272a33";
                    }}
                  >
                    Abmelden
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "#8a8a8a" }}>
            Keine aktiven Sessions.
          </p>
        )}
      </div>

      {/* 2FA Modal */}
      {show2FAModal && qrCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="rounded-lg p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: "#111217", border: "1px solid #272a33" }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
              2FA aktivieren
            </h3>
            <div className="text-center mb-4">
              <p className="text-sm mb-4" style={{ color: "#b3b3b3" }}>
                Scannen Sie diesen QR-Code mit Ihrer Authenticator-App:
              </p>
              <img src={qrCode} alt="2FA QR Code" className="mx-auto" style={{ maxWidth: "200px" }} />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShow2FAModal(false);
                  setQrCode(null);
                  loadSecurity();
                }}
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#007bff]"
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
                Fertig
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="rounded-lg p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: "#111217", border: "1px solid #272a33" }}
          >
            {newTokenValue ? (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
                  Token erstellt
                </h3>
                <p className="text-sm mb-4" style={{ color: "#b3b3b3" }}>
                  Kopieren Sie diesen Token jetzt. Er wird nicht erneut angezeigt:
                </p>
                <div className="p-4 rounded border mb-4" style={{ backgroundColor: "#050509", borderColor: "#272a33" }}>
                  <code className="text-xs break-all" style={{ color: "#b3b3b3" }}>
                    {newTokenValue}
                  </code>
                </div>
                <button
                  onClick={() => copyToken(newTokenValue)}
                  className="w-full mb-2 inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#007bff]"
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
                  <FaCopy className="mr-2" style={{ width: "14px", height: "14px" }} />
                  Token kopieren
                </button>
                <button
                  onClick={() => {
                    setShowTokenModal(false);
                    setNewTokenValue(null);
                  }}
                  className="w-full px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
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
                  Schließen
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
                  Neuen Token erstellen
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                      Token-Name
                    </label>
                    <input
                      type="text"
                      value={newToken.name}
                      onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                      style={{
                        backgroundColor: "#1a1d24",
                        borderColor: "#272a33",
                        color: "#f4f4f4",
                      }}
                      placeholder="z.B. API-Integration"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                      Läuft ab in (Tage)
                    </label>
                    <input
                      type="number"
                      value={newToken.expires_in_days}
                      onChange={(e) =>
                        setNewToken({ ...newToken, expires_in_days: parseInt(e.target.value) || 30 })
                      }
                      min="1"
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
                    onClick={() => setShowTokenModal(false)}
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
                    onClick={handleCreateToken}
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
                    Erstellen
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
