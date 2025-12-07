// =====================================================
// 2FA SETUP PAGE
// =====================================================
// /kunde/2fa
// 2FA Setup und Verwaltung für eingeloggte Benutzer
// =====================================================

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaShieldAlt, FaQrcode, FaKey, FaCopy, FaCheck, 
  FaSpinner, FaTimesCircle, FaTrash 
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

interface SetupData {
  secret: string;
  qr_code_url: string;
  backup_codes: string[];
}

// =====================================================
// COMPONENT
// =====================================================

export default function Kunden2FAPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  
  // Disable State
  const [showDisable, setShowDisable] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [isDisabling, setIsDisabling] = useState(false);

  // -------------------------------------------------
  // 2FA STATUS LADEN
  // -------------------------------------------------

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      
      if (!data.success) {
        router.push("/kunde/login");
        return;
      }
      
      setIsEnabled(data.data?.two_factor_enabled || false);
      setLoading(false);
    } catch {
      router.push("/kunde/login");
    }
  };

  // -------------------------------------------------
  // SETUP STARTEN
  // -------------------------------------------------

  const startSetup = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST"
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setSetupData(data.data);
      setLoading(false);

    } catch {
      setError("Ein Fehler ist aufgetreten");
      setLoading(false);
    }
  };

  // -------------------------------------------------
  // 2FA AKTIVIEREN
  // -------------------------------------------------

  const confirmSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm", code: verifyCode })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error);
        setIsVerifying(false);
        return;
      }

      setIsEnabled(true);
      setSetupData(null);
      setIsVerifying(false);

    } catch {
      setError("Ein Fehler ist aufgetreten");
      setIsVerifying(false);
    }
  };

  // -------------------------------------------------
  // 2FA DEAKTIVIEREN
  // -------------------------------------------------

  const disable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsDisabling(true);

    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: disablePassword })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error);
        setIsDisabling(false);
        return;
      }

      setIsEnabled(false);
      setShowDisable(false);
      setDisablePassword("");
      setIsDisabling(false);

    } catch {
      setError("Ein Fehler ist aufgetreten");
      setIsDisabling(false);
    }
  };

  // -------------------------------------------------
  // COPY HELPERS
  // -------------------------------------------------

  const copySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const copyBackupCodes = () => {
    if (setupData?.backup_codes) {
      navigator.clipboard.writeText(setupData.backup_codes.join("\n"));
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2000);
    }
  };

  // -------------------------------------------------
  // LOADING
  // -------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                      flex items-center justify-center">
        <FaSpinner className="text-4xl text-blue-400 animate-spin" />
      </div>
    );
  }

  // -------------------------------------------------
  // RENDER
  // -------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                    flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl 
                     p-8 max-w-lg w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
                          ${isEnabled ? "bg-green-500/20" : "bg-amber-500/20"}`}>
            <FaShieldAlt className={`text-2xl ${isEnabled ? "text-green-400" : "text-amber-400"}`} />
          </div>
          <h1 className="text-2xl font-bold text-white">
            2-Faktor-Authentifizierung
          </h1>
          <p className="text-slate-400 mt-2">
            {isEnabled 
              ? "2FA ist aktiviert und schützt Ihr Konto" 
              : "Schützen Sie Ihr Konto mit einem zweiten Faktor"
            }
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 
                         flex items-center gap-3">
            <FaTimesCircle className="text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        {/* 2FA AKTIVIERT */}
        {isEnabled && !showDisable && (
          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 
                           flex items-center gap-3">
              <FaCheck className="text-green-400 flex-shrink-0" />
              <span className="text-green-300">
                2FA ist aktiviert. Ihr Konto ist geschützt.
              </span>
            </div>

            <button
              onClick={() => setShowDisable(true)}
              className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30
                       text-red-400 font-semibold py-3 px-4 rounded-lg transition-colors 
                       flex items-center justify-center gap-2"
            >
              <FaTrash />
              2FA deaktivieren
            </button>
          </div>
        )}

        {/* 2FA DEAKTIVIEREN */}
        {isEnabled && showDisable && (
          <form onSubmit={disable2FA} className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-300 text-sm">
                <strong>Warnung:</strong> Das Deaktivieren von 2FA macht Ihr Konto 
                weniger sicher. Geben Sie Ihr Passwort ein, um fortzufahren.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Passwort bestätigen
              </label>
              <input
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg 
                         px-4 py-3 text-white
                         focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="Ihr Passwort"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDisable(false);
                  setDisablePassword("");
                }}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white 
                         font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isDisabling || !disablePassword}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 
                         text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isDisabling ? <FaSpinner className="animate-spin mx-auto" /> : "Deaktivieren"}
              </button>
            </div>
          </form>
        )}

        {/* SETUP STARTEN */}
        {!isEnabled && !setupData && (
          <div className="space-y-6">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">So funktioniert es:</h3>
              <ol className="text-slate-400 text-sm space-y-2">
                <li>1. Installieren Sie eine Authenticator-App (Google, Microsoft, Authy)</li>
                <li>2. Scannen Sie den QR-Code oder geben Sie den Code manuell ein</li>
                <li>3. Geben Sie den generierten 6-stelligen Code ein</li>
                <li>4. Speichern Sie Ihre Backup-Codes sicher ab</li>
              </ol>
            </div>

            <button
              onClick={startSetup}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white 
                       font-semibold py-3 px-4 rounded-lg transition-colors 
                       flex items-center justify-center gap-2"
            >
              <FaQrcode />
              2FA einrichten
            </button>
          </div>
        )}

        {/* SETUP PROZESS */}
        {!isEnabled && setupData && (
          <div className="space-y-6">
            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupData.qr_code_url)}`}
                alt="2FA QR Code"
                width={200}
                height={200}
              />
            </div>

            {/* Manual Secret */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <FaKey className="inline mr-2" />
                Manueller Code
              </label>
              <div className="flex gap-2">
                <code className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg 
                               px-4 py-2 text-amber-400 font-mono text-sm break-all">
                  {setupData.secret}
                </code>
                <button
                  onClick={copySecret}
                  className="px-3 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                >
                  {copiedSecret ? <FaCheck className="text-green-400" /> : <FaCopy className="text-slate-300" />}
                </button>
              </div>
            </div>

            {/* Verify Code */}
            <form onSubmit={confirmSetup}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Code eingeben
              </label>
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg 
                         px-4 py-3 text-white text-center text-xl tracking-widest
                         focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="000000"
                autoComplete="one-time-code"
              />

              <button
                type="submit"
                disabled={isVerifying || verifyCode.length !== 6}
                className="w-full mt-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 
                         text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isVerifying ? <FaSpinner className="animate-spin mx-auto" /> : "2FA aktivieren"}
              </button>
            </form>

            {/* Backup Codes */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Backup-Codes</h3>
                <button
                  onClick={copyBackupCodes}
                  className="text-sm text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedBackup ? <FaCheck className="text-green-400" /> : <FaCopy />}
                  Kopieren
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {setupData.backup_codes.map((code, i) => (
                  <code key={i} className="bg-slate-800 px-3 py-1 rounded text-amber-400 
                                          font-mono text-sm text-center">
                    {code}
                  </code>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-3">
                Speichern Sie diese Codes sicher. Sie können verwendet werden, 
                falls Sie Ihr Handy verlieren.
              </p>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/portal")}
            className="text-slate-400 hover:text-slate-300 text-sm"
          >
            ← Zurück zum Portal
          </button>
        </div>
      </div>
    </div>
  );
}







