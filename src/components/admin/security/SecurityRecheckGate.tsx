// =====================================================
// SECURITY RECHECK GATE - ENTERPRISE++ COMPONENT
// =====================================================
// Erstellt: 2025-12-03
// Zweck: Passwort-Bestätigung vor sicherheitskritischen Seiten
// Standard: SAP/IBM/Siemens Security Level
// =====================================================

"use client";

import { useState, useEffect, ReactNode } from "react";
import { ShieldCheck, Lock, AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";

// =====================================================
// DEBUG LOGGING (nur in Development)
// =====================================================

const DEBUG = process.env.NODE_ENV !== "production";

function debugLog(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[SecurityRecheckGate] ${message}`, data || "");
  }
}

// =====================================================
// INTERFACES
// =====================================================

interface SecurityRecheckGateProps {
  children: ReactNode;
  /** Beschreibung der geschützten Aktion */
  actionDescription?: string;
  /** Identifier für die geschützte Ressource */
  requiredFor?: string;
  /** Callback wenn Recheck erfolgreich */
  onRecheckSuccess?: () => void;
  /** Callback wenn Recheck fehlschlägt */
  onRecheckFailed?: () => void;
  /** Optionaler zusätzlicher Klassen-Name */
  className?: string;
}

// =====================================================
// STORAGE KEY
// =====================================================

const RECHECK_TOKEN_KEY = "security_recheck_token";
const RECHECK_EXPIRY_KEY = "security_recheck_expiry";

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  
  const token = sessionStorage.getItem(RECHECK_TOKEN_KEY);
  const expiry = sessionStorage.getItem(RECHECK_EXPIRY_KEY);
  
  debugLog("getStoredToken", { hasToken: !!token, hasExpiry: !!expiry });
  
  if (!token || !expiry) return null;
  
  // Prüfe ob abgelaufen
  const expiryDate = new Date(expiry);
  const now = new Date();
  if (expiryDate < now) {
    debugLog("Token abgelaufen", { expiry, now: now.toISOString() });
    clearStoredToken();
    return null;
  }
  
  return token;
}

function storeToken(token: string, validUntil: string): void {
  if (typeof window === "undefined") return;
  debugLog("storeToken", { validUntil });
  sessionStorage.setItem(RECHECK_TOKEN_KEY, token);
  sessionStorage.setItem(RECHECK_EXPIRY_KEY, validUntil);
}

function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  debugLog("clearStoredToken");
  sessionStorage.removeItem(RECHECK_TOKEN_KEY);
  sessionStorage.removeItem(RECHECK_EXPIRY_KEY);
}

// =====================================================
// COMPONENT
// =====================================================

export function SecurityRecheckGate({
  children,
  actionDescription = "auf diesen Bereich zuzugreifen",
  requiredFor = "admin_settings",
  onRecheckSuccess,
  onRecheckFailed,
  className = "",
}: SecurityRecheckGateProps) {
  // State
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  
  // Form State
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // =====================================================
  // MOUNT EFFECT - Token prüfen
  // =====================================================

  useEffect(() => {
    debugLog("mounted", { requiredFor, actionDescription });
    
    const checkToken = async () => {
      const storedToken = getStoredToken();
      
      if (!storedToken) {
        debugLog("recheck required - kein Token vorhanden");
        setIsVerified(false);
        setIsLoading(false);
        return;
      }

      try {
        debugLog("Validiere Token...");
        const response = await fetch(`/api/admin/security/recheck?token=${storedToken}`, {
          credentials: "include",
        });
        
        const data = await response.json();
        debugLog("Token-Validierung Ergebnis", data);
        
        if (data.success && data.valid) {
          debugLog("recheck success", { valid_until: data.data.valid_until });
          setIsVerified(true);
          setRemainingTime(data.data.remaining_seconds);
        } else {
          debugLog("Token ungültig", data);
          clearStoredToken();
          setIsVerified(false);
        }
      } catch (err) {
        debugLog("Token-Validierung Fehler", err);
        clearStoredToken();
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [requiredFor, actionDescription]);

  // =====================================================
  // COUNTDOWN TIMER
  // =====================================================

  useEffect(() => {
    if (!isVerified || remainingTime <= 0) return;
    
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          debugLog("Token abgelaufen durch Timer");
          clearStoredToken();
          setIsVerified(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isVerified, remainingTime]);

  // =====================================================
  // FORM SUBMIT HANDLER
  // =====================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    debugLog("Recheck-Submit gestartet");

    try {
      const response = await fetch("/api/admin/security/recheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          password,
          twoFactorCode: twoFactorCode || undefined,
          action: actionDescription,
        }),
      });

      const data = await response.json();
      debugLog("Recheck-Submit Ergebnis", data);

      if (data.success) {
        // Token speichern
        storeToken(data.data.recheck_token, data.data.valid_until);
        setIsVerified(true);
        setRemainingTime(data.data.expires_in_seconds);
        setPassword("");
        setTwoFactorCode("");
        debugLog("recheck success", { valid_until: data.data.valid_until });
        onRecheckSuccess?.();
      } else {
        // Prüfe ob 2FA erforderlich
        if (data.requires_2fa) {
          setRequires2FA(true);
          setError("Bitte gib deinen 2FA-Code ein.");
        } else {
          setError(data.message || "Authentifizierung fehlgeschlagen");
          onRecheckFailed?.();
        }
      }
    } catch (err) {
      debugLog("Recheck-Submit Fehler", err);
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      onRecheckFailed?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  debugLog("render", { isLoading, isVerified, remainingTime });
  
  // SEHR OFFENSICHTLICHER CONSOLE-LOG FÜR DEBUGGING
  console.log("🔴🔴🔴 SECURITY RECHECK GATE ACTIVE 🔴🔴🔴", { isLoading, isVerified });

  // Loading State
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Sicherheitsstatus wird geprüft...</p>
          <p className="text-red-500 mt-2 font-bold">🔒 SecurityRecheckGate AKTIV</p>
        </div>
      </div>
    );
  }

  // Verified - Show Children
  if (isVerified) {
    return (
      <div className={className}>
        {/* Security Status Bar */}
        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm">
              Sicherheitsfreigabe aktiv
            </span>
          </div>
          <div className="text-green-400 text-sm font-mono">
            {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, "0")} verbleibend
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Recheck Dialog
  return (
    <div className={`min-h-[400px] flex items-center justify-center ${className}`}>
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Sicherheitsbestätigung erforderlich
          </h2>
          <p className="text-gray-400 text-sm">
            Bitte bestätige deine Identität, um {actionDescription}.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Aktuelles Passwort
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Dein Passwort"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 2FA Field (conditionally shown) */}
          {requires2FA && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                2FA-Code (6 Ziffern)
              </label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !password || (requires2FA && twoFactorCode.length !== 6)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Wird überprüft...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Identität bestätigen
              </>
            )}
          </button>
        </form>

        {/* Info */}
        <p className="text-gray-500 text-xs text-center mt-4">
          Die Freigabe ist 10 Minuten gültig und wird für sicherheitskritische Aktionen benötigt.
        </p>
      </div>
    </div>
  );
}

// =====================================================
// EXPORT HELPER FUNCTIONS
// =====================================================

export function getRecheckToken(): string | null {
  return getStoredToken();
}

export function hasValidRecheckToken(): boolean {
  return getStoredToken() !== null;
}

export { clearStoredToken as invalidateRecheckToken };
