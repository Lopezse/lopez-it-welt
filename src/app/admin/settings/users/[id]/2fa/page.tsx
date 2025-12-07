// =====================================================
// ENTERPRISE++ BENUTZER 2FA-VERWALTUNG - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: 2FA für andere Benutzer verwalten (Admin-Funktion)
// Pfad: /admin/settings/users/[id]/2fa
// Enterprise++: SAP/IBM/Siemens Standard
// =====================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  FaShieldAlt, FaUser, FaArrowLeft, FaQrcode, FaRedo,
  FaTrash, FaKey, FaCopy, FaCheck, FaExclamationTriangle
} from "react-icons/fa";

interface UserData {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  createdAt: string | null;
  backupCodesRemaining: number;
}

interface SetupData {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export default function User2FAManagementPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  // States
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/admin/users/${userId}/2fa`, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (response.status === 403) {
          setError("Keine Berechtigung");
          return;
        }
        throw new Error("Fehler beim Laden");
      }

      const data = await response.json();
      if (data.success) {
        setUserData(data.data);
      } else {
        setError(data.message || "Fehler beim Laden");
      }
    } catch (error) {
      console.error("Load Error:", error);
      setError("Fehler beim Laden der Benutzerdaten");
    } finally {
      setLoading(false);
    }
  };

  const startSetup = async () => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/users/${userId}/2fa/setup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setSetupData({
          secret: data.data.secret,
          qrCodeUrl: data.data.qrCodeUrl,
          backupCodes: data.data.backupCodes,
        });
        setShowSetup(true);
      } else {
        setError(data.message || "Fehler beim Setup");
      }
    } catch (error) {
      console.error("Setup Error:", error);
      setError("Fehler beim 2FA-Setup");
    }
  };

  const verify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData) return;

    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/users/${userId}/2fa/verify`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: setupData.secret, code: verificationCode }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("2FA erfolgreich aktiviert!");
        setShowSetup(false);
        setSetupData(null);
        setVerificationCode("");
        await loadUserData();
      } else {
        setError(data.message || "Ungültiger Code");
      }
    } catch (error) {
      console.error("Verify Error:", error);
      setError("Fehler bei der Verifikation");
    } finally {
      setIsVerifying(false);
    }
  };

  const reset2FA = async () => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/users/${userId}/2fa/reset`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("2FA wurde zurückgesetzt. Benutzer kann 2FA neu einrichten.");
        setShowResetConfirm(false);
        await loadUserData();
      } else {
        setError(data.message || "Fehler beim Reset");
      }
    } catch (error) {
      console.error("Reset Error:", error);
      setError("Fehler beim Zurücksetzen");
    }
  };

  const disable2FA = async () => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/users/${userId}/2fa`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("2FA wurde deaktiviert.");
        setShowDisableConfirm(false);
        await loadUserData();
      } else {
        setError(data.message || "Fehler beim Deaktivieren");
      }
    } catch (error) {
      console.error("Disable Error:", error);
      setError("Fehler beim Deaktivieren");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } catch (err) {
      console.error("Kopieren fehlgeschlagen:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#050509" }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#c99700" }}></div>
          <p className="mt-4 text-sm" style={{ color: "#b3b3b3" }}>Lade 2FA-Verwaltung...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050509" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/settings/users"
            className="inline-flex items-center text-sm mb-4 transition-colors"
            style={{ color: "#8a8a8a" }}
          >
            <FaArrowLeft className="mr-2" />
            Zurück zur Benutzerliste
          </Link>

          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: "#007bff20" }}>
              <FaShieldAlt className="text-2xl" style={{ color: "#007bff" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#f4f4f4" }}>
                2FA-Verwaltung
              </h1>
              {userData && (
                <p className="text-sm" style={{ color: "#8a8a8a" }}>
                  <FaUser className="inline mr-1" />
                  {userData.username} ({userData.email})
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Meldungen */}
        {error && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#dc354520", border: "1px solid #dc3545" }}>
            <p className="text-sm" style={{ color: "#dc3545" }}>{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#28a74520", border: "1px solid #28a745" }}>
            <p className="text-sm" style={{ color: "#28a745" }}>{success}</p>
          </div>
        )}

        {/* Status-Karte */}
        {userData && (
          <div className="rounded-lg border p-6 mb-6" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
              2FA-Status
            </h2>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: userData.enabled ? "#28a745" : "#dc3545" }}
                />
                <div>
                  <p className="font-medium" style={{ color: userData.enabled ? "#28a745" : "#dc3545" }}>
                    {userData.enabled ? "2FA ist aktiviert" : "2FA ist nicht aktiviert"}
                  </p>
                  {userData.enabled && userData.createdAt && (
                    <p className="text-xs" style={{ color: "#8a8a8a" }}>
                      Aktiviert am: {new Date(userData.createdAt).toLocaleDateString("de-DE")}
                    </p>
                  )}
                  {userData.enabled && (
                    <p className="text-xs" style={{ color: "#8a8a8a" }}>
                      Backup-Codes verbleibend: {userData.backupCodesRemaining}
                    </p>
                  )}
                </div>
              </div>

              {/* Aktions-Buttons */}
              <div className="flex gap-3">
                {!userData.enabled && (
                  <button
                    onClick={startSetup}
                    className="px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center"
                    style={{ backgroundColor: "#007bff", color: "#ffffff" }}
                  >
                    <FaQrcode className="mr-2" />
                    2FA einrichten
                  </button>
                )}
                {userData.enabled && (
                  <>
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center"
                      style={{ backgroundColor: "#c9970020", color: "#c99700", border: "1px solid #c99700" }}
                    >
                      <FaRedo className="mr-2" />
                      Zurücksetzen
                    </button>
                    <button
                      onClick={() => setShowDisableConfirm(true)}
                      className="px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center"
                      style={{ backgroundColor: "#dc354520", color: "#dc3545", border: "1px solid #dc3545" }}
                    >
                      <FaTrash className="mr-2" />
                      Deaktivieren
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reset-Bestätigung */}
        {showResetConfirm && (
          <div className="rounded-lg border p-6 mb-6" style={{ backgroundColor: "#111217", borderColor: "#c99700" }}>
            <div className="flex items-start">
              <FaExclamationTriangle className="text-xl mr-3 mt-0.5" style={{ color: "#c99700" }} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#f4f4f4" }}>
                  2FA zurücksetzen?
                </h3>
                <p className="text-sm mb-4" style={{ color: "#8a8a8a" }}>
                  Der Benutzer muss 2FA danach neu einrichten. Alle Backup-Codes werden ungültig.
                </p>
                <div className="flex gap-3">
                  <button onClick={reset2FA} className="px-4 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: "#c99700", color: "#000" }}>
                    Ja, zurücksetzen
                  </button>
                  <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: "#272a33", color: "#f4f4f4" }}>
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Disable-Bestätigung */}
        {showDisableConfirm && (
          <div className="rounded-lg border p-6 mb-6" style={{ backgroundColor: "#111217", borderColor: "#dc3545" }}>
            <div className="flex items-start">
              <FaExclamationTriangle className="text-xl mr-3 mt-0.5" style={{ color: "#dc3545" }} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#f4f4f4" }}>
                  2FA deaktivieren?
                </h3>
                <p className="text-sm mb-4" style={{ color: "#8a8a8a" }}>
                  WARNUNG: Das Konto wird nur noch mit Passwort geschützt. Dies ist eine sicherheitskritische Aktion.
                </p>
                <div className="flex gap-3">
                  <button onClick={disable2FA} className="px-4 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: "#dc3545", color: "#fff" }}>
                    Ja, deaktivieren
                  </button>
                  <button onClick={() => setShowDisableConfirm(false)} className="px-4 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: "#272a33", color: "#f4f4f4" }}>
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Setup-Bereich */}
        {showSetup && setupData && (
          <div className="rounded-lg border p-6" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
              <FaQrcode className="inline mr-2" />
              2FA einrichten für {userData?.username}
            </h2>

            {/* QR-Code */}
            <div className="text-center mb-6">
              <div className="inline-block p-4 rounded-lg" style={{ backgroundColor: "#ffffff" }}>
                <img src={setupData.qrCodeUrl} alt="2FA QR Code" width="200" height="200" />
              </div>
            </div>

            {/* Secret */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#1a1d24" }}>
              <p className="text-xs mb-2" style={{ color: "#8a8a8a" }}>Manuelles Secret:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded text-sm font-mono" style={{ backgroundColor: "#0a0a0f", color: "#c99700" }}>
                  {setupData.secret}
                </code>
                <button
                  onClick={() => copyToClipboard(setupData.secret)}
                  className="p-2 rounded transition-colors"
                  style={{ backgroundColor: "#272a33", color: copiedSecret ? "#28a745" : "#8a8a8a" }}
                >
                  {copiedSecret ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
            </div>

            {/* Backup-Codes */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#1a1d24" }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "#c99700" }}>
                <FaKey className="inline mr-2" />
                Backup-Codes (nur einmal sichtbar!)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {setupData.backupCodes.map((code, idx) => (
                  <code key={idx} className="text-xs p-2 rounded text-center" style={{ backgroundColor: "#0a0a0f", color: "#c99700" }}>
                    {code}
                  </code>
                ))}
              </div>
            </div>

            {/* Verifikation */}
            <form onSubmit={verify2FA}>
              <p className="text-sm mb-3" style={{ color: "#8a8a8a" }}>
                Benutzer soll QR-Code scannen und 6-stelligen Code eingeben:
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  placeholder="000000"
                  className="flex-1 px-4 py-3 rounded-md text-xl text-center tracking-[0.5em] font-mono border"
                  style={{ backgroundColor: "#1a1d24", borderColor: "#272a33", color: "#f4f4f4" }}
                />
                <button
                  type="submit"
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="px-6 py-3 rounded-md text-sm font-medium disabled:opacity-50"
                  style={{ backgroundColor: verificationCode.length === 6 ? "#28a745" : "#272a33", color: "#fff" }}
                >
                  {isVerifying ? "..." : "Aktivieren"}
                </button>
              </div>
            </form>

            <button
              onClick={() => { setShowSetup(false); setSetupData(null); setVerificationCode(""); }}
              className="mt-4 px-4 py-2 rounded-md text-sm"
              style={{ backgroundColor: "#272a33", color: "#f4f4f4" }}
            >
              Abbrechen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}










