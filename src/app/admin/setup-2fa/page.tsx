// =====================================================
// ENTERPRISE++ ADMIN 2FA SETUP - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: 2FA-Setup für Admin-Benutzer (Aegis-kompatibel)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaShieldAlt, FaCheck, FaExclamationTriangle } from "react-icons/fa";

export default function Admin2FASetupPage() {
  const router = useRouter();
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setup2FA();
  }, []);

  const setup2FA = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/setup-2fa", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setSecret(data.data.secret);
        setQrCode(data.data.qrCodeUrl); // Bereits als Data URL
        setBackupCodes(data.data.backupCodes || []);
      } else {
        if (data.support_required) {
          setError("2FA wurde bereits aktiviert. Bei Problemen wenden Sie sich an den Support.");
        } else {
          setError(data.message || "Fehler beim Setup von 2FA");
        }
      }
    } catch (error) {
      console.error("2FA Setup Fehler:", error);
      setError("Fehler beim Setup von 2FA");
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/verify-2fa-setup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, code: verificationCode }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEnabled(true);
        setSuccess("2FA erfolgreich aktiviert! Sie werden zum Dashboard weitergeleitet...");
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } else {
        setError(data.message || "Ungültiger 2FA-Code");
      }
    } catch (error) {
      console.error("2FA Verifikation Fehler:", error);
      setError("Fehler bei der 2FA-Verifikation");
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "#050509" }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#c99700" }}></div>
          <p className="mt-4 text-sm" style={{ color: "#b3b3b3" }}>2FA-Setup wird vorbereitet...</p>
        </div>
      </div>
    );
  }

  if (isEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#050509" }}>
        <div className="max-w-md w-full mx-4">
          <div className="rounded-lg border p-8 text-center" style={{ backgroundColor: "#111217", borderColor: "#28a745" }}>
            <FaCheck className="text-5xl mx-auto mb-4" style={{ color: "#28a745" }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#f4f4f4" }}>
              2FA erfolgreich aktiviert!
            </h2>
            <p className="text-sm mb-4" style={{ color: "#8a8a8a" }}>
              {success}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: "#050509" }}>
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: "#007bff20" }}>
            <FaShieldAlt className="text-3xl" style={{ color: "#007bff" }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#f4f4f4" }}>
            2FA einrichten (Aegis)
          </h1>
          <p className="text-sm" style={{ color: "#8a8a8a" }}>
            Zwei-Faktor-Authentifizierung ist für Admin-Konten Pflicht
          </p>
        </div>

        {/* Info-Box */}
        <div className="rounded-lg border p-6 mb-6" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
          <div className="flex items-start">
            <FaExclamationTriangle className="text-xl mr-3 mt-0.5" style={{ color: "#c99700" }} />
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#f4f4f4" }}>
                Wichtig für Aegis
              </h3>
              <p className="text-sm mb-2" style={{ color: "#8a8a8a" }}>
                1. Öffnen Sie die Aegis-App auf Ihrem Smartphone
              </p>
              <p className="text-sm mb-2" style={{ color: "#8a8a8a" }}>
                2. Tippen Sie auf "+" (Hinzufügen)
              </p>
              <p className="text-sm mb-2" style={{ color: "#8a8a8a" }}>
                3. Wählen Sie "QR-Code scannen"
              </p>
              <p className="text-sm" style={{ color: "#8a8a8a" }}>
                4. Scannen Sie den QR-Code unten
              </p>
            </div>
          </div>
        </div>

        {/* QR-Code */}
        {qrCode && (
          <div className="rounded-lg border p-6 mb-6 text-center" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
              QR-Code scannen
            </h3>
            <div className="flex justify-center mb-4">
              <img src={qrCode} alt="2FA QR Code" className="w-64 h-64" style={{ backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px" }} />
            </div>
            <p className="text-xs" style={{ color: "#8a8a8a" }}>
              Oder manuell eingeben: <code className="px-2 py-1 rounded" style={{ backgroundColor: "#1a1d24", color: "#c99700" }}>{secret}</code>
            </p>
          </div>
        )}

        {/* Backup-Codes */}
        {backupCodes.length > 0 && (
          <div className="rounded-lg border p-6 mb-6" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
              Backup-Codes (nur einmal sichtbar!)
            </h3>
            <p className="text-sm mb-4" style={{ color: "#8a8a8a" }}>
              Speichern Sie diese Codes sicher. Sie können verwendet werden, wenn Sie keinen Zugriff auf Ihre Aegis-App haben.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, idx) => (
                <code key={idx} className="text-xs p-2 rounded text-center" style={{ backgroundColor: "#1a1d24", color: "#c99700" }}>
                  {code}
                </code>
              ))}
            </div>
          </div>
        )}

        {/* Verifikation */}
        <form onSubmit={verify2FA} className="rounded-lg border p-6" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
            Verifizierung
          </h3>
          <p className="text-sm mb-4" style={{ color: "#8a8a8a" }}>
            Geben Sie den 6-stelligen Code aus Ihrer Aegis-App ein, um die Einrichtung abzuschließen.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded" style={{ backgroundColor: "#dc354520", border: "1px solid #dc3545" }}>
              <p className="text-sm" style={{ color: "#dc3545" }}>
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded" style={{ backgroundColor: "#28a74520", border: "1px solid #28a745" }}>
              <p className="text-sm" style={{ color: "#28a745" }}>
                {success}
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              6-stelliger Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              className="w-full px-4 py-3 rounded-md text-lg text-center tracking-widest border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
              placeholder="000000"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying || verificationCode.length !== 6}
            className="w-full px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: verificationCode.length === 6 ? "#007bff" : "#272a33",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              if (verificationCode.length === 6 && !isVerifying) {
                e.currentTarget.style.backgroundColor = "#0056b3";
              }
            }}
            onMouseLeave={(e) => {
              if (verificationCode.length === 6 && !isVerifying) {
                e.currentTarget.style.backgroundColor = "#007bff";
              }
            }}
          >
            {isVerifying ? "Verifiziere..." : "2FA aktivieren"}
          </button>
        </form>
      </div>
    </div>
  );
}

