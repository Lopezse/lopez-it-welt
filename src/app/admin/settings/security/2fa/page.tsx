// =====================================================
// ENTERPRISE++ 2FA-SETUP - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: 2FA-Setup für Admin-Benutzer (Aegis-kompatibel)
// Pfad: /admin/settings/security/2fa
// Design: Original Lopez IT Welt Style
// Security: 🔐 Geschützt durch security/layout.tsx
// =====================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TwoFactorSetupPage() {
  const router = useRouter();
  
  // States
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [username, setUsername] = useState("");
  const [isNewSecret, setIsNewSecret] = useState(false);

  useEffect(() => {
    load2FAData();
  }, []);

  const load2FAData = async () => {
    try {
      setLoading(true);
      
      // Zuerst Status prüfen
      const statusResponse = await fetch("/api/admin/security/2fa-status", {
        credentials: "include",
      });

      if (!statusResponse.ok) {
        if (statusResponse.status === 401) {
          router.push("/admin/login?redirect=/admin/settings/security/2fa");
          return;
        }
      }

      const statusData = await statusResponse.json();
      if (statusData.success) {
        setUsername(statusData.data.username || "r.lopezsr");
        setIsEnabled(statusData.data.enabled);
        
        // Wenn 2FA bereits aktiviert, zeige bestehende Daten
        if (statusData.data.enabled) {
          // Lade QR-Code für bestehenden User
          await loadExistingQRCode();
        } else {
          // Neues Setup starten
          await startNewSetup();
        }
      }
    } catch (error) {
      console.error("2FA Load Error:", error);
      setError("Fehler beim Laden der 2FA-Daten");
    } finally {
      setLoading(false);
    }
  };

  const loadExistingQRCode = async () => {
    try {
      // Verwende die bestehende Debug-Route für QR-Code
      const response = await fetch("/api/debug/qr-code", {
        credentials: "include",
      });
      
      if (response.ok) {
        // Die Route gibt HTML zurück, wir brauchen die Daten
        // Also verwenden wir die setup-2fa Route
        const setupResponse = await fetch("/api/admin/setup-2fa", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        
        const data = await setupResponse.json();
        if (data.success) {
          setSecret(data.data.secret);
          setQrCode(data.data.qrCodeUrl);
          setBackupCodes(data.data.backupCodes || []);
          setIsNewSecret(false);
        } else if (data.support_required) {
          // 2FA bereits aktiviert - zeige Status
          setIsEnabled(true);
        }
      }
    } catch (error) {
      console.error("Load existing QR Error:", error);
    }
  };

  const startNewSetup = async () => {
    try {
      const response = await fetch("/api/admin/setup-2fa", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        setSecret(data.data.secret);
        setQrCode(data.data.qrCodeUrl);
        setBackupCodes(data.data.backupCodes || []);
        setIsNewSecret(true);
      } else {
        if (data.support_required) {
          setError("2FA wurde bereits aktiviert.");
        } else {
          setError(data.message || "Fehler beim Setup");
        }
      }
    } catch (error) {
      console.error("Setup Error:", error);
      setError("Fehler beim 2FA-Setup");
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
      console.error("Verify Error:", error);
      setError("Fehler bei der Verifikation");
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
        color: "#f4f4f4",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "32px",
            height: "32px",
            border: "3px solid #ffd700",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }} />
          <p style={{ color: "#b3b3b3" }}>2FA-Setup wird vorbereitet...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isEnabled && success) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
        padding: "20px",
        color: "#f4f4f4",
      }}>
        <div style={{
          background: "#111217",
          border: "1px solid #28a745",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ color: "#f4f4f4", marginBottom: "8px" }}>2FA erfolgreich aktiviert!</h2>
          <p style={{ color: "#8a8a8a" }}>{success}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#f4f4f4",
    }}>
      <div style={{
        background: "#111217",
        border: "1px solid #272a33",
        borderRadius: "16px",
        padding: "40px",
        maxWidth: "500px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <h1 style={{ color: "#ffd700", marginBottom: "10px", fontSize: "1.8rem" }}>
          🔐 2FA Setup
        </h1>
        <p style={{ color: "#b3b3b3", marginBottom: "30px" }}>
          Lopez IT Welt - Enterprise++
        </p>

        {/* QR-Code Container */}
        {qrCode && (
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            display: "inline-block",
            margin: "20px 0",
            position: "relative",
          }}>
            <img src={qrCode} alt="2FA QR Code" width="260" height="260" style={{ display: "block" }} />
            {/* LW Logo in der Mitte */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "60px",
              height: "60px",
              background: "#007bff",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              border: "3px solid white",
            }}>
              LW
            </div>
          </div>
        )}

        {/* Anleitung */}
        <div style={{
          textAlign: "left",
          background: "#1a1a2e",
          borderRadius: "8px",
          padding: "20px",
          margin: "20px 0",
        }}>
          <h3 style={{ color: "#ffd700", marginBottom: "15px" }}>📱 Anleitung für Aegis:</h3>
          <ol style={{ paddingLeft: "20px", margin: 0 }}>
            <li style={{ margin: "10px 0", color: "#b3b3b3" }}>Öffne <strong style={{ color: "#f4f4f4" }}>Aegis Authenticator</strong></li>
            <li style={{ margin: "10px 0", color: "#b3b3b3" }}>Tippe auf <strong style={{ color: "#f4f4f4" }}>+</strong> (Hinzufügen)</li>
            <li style={{ margin: "10px 0", color: "#b3b3b3" }}>Wähle <strong style={{ color: "#f4f4f4" }}>&quot;QR-Code scannen&quot;</strong></li>
            <li style={{ margin: "10px 0", color: "#b3b3b3" }}>Scanne diesen QR-Code</li>
            <li style={{ margin: "10px 0", color: "#b3b3b3" }}>Fertig! Der 6-stellige Code erscheint in Aegis</li>
          </ol>
        </div>

        {/* Manuelles Secret */}
        {secret && (
          <div style={{
            background: "#0a0a0f",
            border: "1px solid #272a33",
            borderRadius: "8px",
            padding: "15px",
            margin: "20px 0",
            fontFamily: "monospace",
            fontSize: "0.9rem",
            wordBreak: "break-all",
            color: "#24a148",
          }}>
            <strong style={{ color: "#b3b3b3" }}>Manuelles Secret (falls QR nicht funktioniert):</strong>
            <br /><br />
            {secret}
            <br /><br />
            {isNewSecret ? (
              <span style={{ color: "#ffd700" }}>⚠️ NEUES Secret generiert - bitte in Aegis scannen!</span>
            ) : (
              <span style={{ color: "#24a148" }}>✅ Bestehendes Secret - keine Änderung nötig</span>
            )}
          </div>
        )}

        {/* Backup-Codes */}
        {backupCodes.length > 0 && (
          <div style={{
            background: "#1a1a2e",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "20px",
          }}>
            <h3 style={{ color: "#da1e28", marginBottom: "15px" }}>⚠️ Backup-Codes (sicher aufbewahren!)</h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}>
              {backupCodes.map((code, idx) => (
                <div key={idx} style={{
                  background: "#0a0a0f",
                  border: "1px solid #272a33",
                  padding: "10px",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontSize: "1.1rem",
                  color: "#ffd700",
                  textAlign: "center",
                }}>
                  {code}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Login-Daten Box */}
        <div style={{
          marginTop: "30px",
          padding: "20px",
          background: "linear-gradient(135deg, #1a472a 0%, #0a2a1a 100%)",
          border: "1px solid #24a148",
          borderRadius: "8px",
        }}>
          <h3 style={{ color: "#24a148", marginBottom: "15px" }}>✅ Login-Daten</h3>
          <p style={{ margin: "5px 0", color: "#b3b3b3" }}>
            <strong style={{ color: "#f4f4f4" }}>Benutzername:</strong> {username || "r.lopezsr"}
          </p>
          <p style={{ margin: "5px 0", color: "#b3b3b3" }}>
            <strong style={{ color: "#f4f4f4" }}>Passwort:</strong> Lopez2024!Super
          </p>
          <p style={{ margin: "5px 0", color: "#b3b3b3" }}>
            <strong style={{ color: "#f4f4f4" }}>2FA-Code:</strong> Aus Aegis (6 Ziffern)
          </p>
        </div>

        {/* Logo für Aegis */}
        <div style={{
          marginTop: "30px",
          padding: "20px",
          background: "#1a1a2e",
          borderRadius: "8px",
        }}>
          <h3 style={{ color: "#ffd700", marginBottom: "15px" }}>📱 Logo für Aegis App</h3>
          <p style={{ color: "#b3b3b3", fontSize: "0.9rem", marginBottom: "15px" }}>
            Lange auf den Eintrag in Aegis tippen → Icon ändern → dieses Bild wählen:
          </p>
          <div style={{
            background: "#272a33",
            borderRadius: "16px",
            padding: "20px",
            display: "inline-block",
            margin: "15px 0",
          }}>
            <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <rect width="120" height="120" rx="24" fill="#007bff"/>
              <text x="60" y="78" fontFamily="Montserrat, Arial, sans-serif" fontSize="48" fontWeight="700" fill="#ffffff" textAnchor="middle">LW</text>
            </svg>
          </div>
          <br />
          <a 
            href="/logo-lw-mark.svg" 
            download="lopez-it-welt-logo.svg"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)",
              color: "#000",
              textDecoration: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "bold",
              margin: "10px 0",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            ⬇️ Logo herunterladen (SVG)
          </a>
        </div>

        {/* Verifikation (nur wenn noch nicht aktiviert) */}
        {!isEnabled && secret && (
          <form onSubmit={verify2FA} style={{ marginTop: "30px" }}>
            <h3 style={{ color: "#f4f4f4", marginBottom: "15px" }}>Verifizierung abschließen</h3>
            
            {error && (
              <div style={{
                background: "#dc354520",
                border: "1px solid #dc3545",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "15px",
                color: "#dc3545",
              }}>
                {error}
              </div>
            )}

            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              placeholder="000000"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "24px",
                textAlign: "center",
                letterSpacing: "0.5em",
                fontFamily: "monospace",
                background: "#1a1d24",
                border: "1px solid #272a33",
                borderRadius: "8px",
                color: "#f4f4f4",
                marginBottom: "15px",
                boxSizing: "border-box",
              }}
            />

            <button
              type="submit"
              disabled={isVerifying || verificationCode.length !== 6}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                fontWeight: "bold",
                background: verificationCode.length === 6 ? "#28a745" : "#272a33",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                cursor: verificationCode.length === 6 ? "pointer" : "not-allowed",
                opacity: verificationCode.length === 6 ? 1 : 0.5,
              }}
            >
              {isVerifying ? "Verifiziere..." : "2FA aktivieren"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
