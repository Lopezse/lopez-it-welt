// =====================================================
// KUNDEN LOGIN PAGE
// =====================================================
// /kunde/login
// Enterprise++ Login mit 2FA Support
// =====================================================

"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaCheckCircle, FaTimesCircle, FaSpinner, FaSignInAlt
} from "react-icons/fa";

// =====================================================
// LOGIN FORM COMPONENT
// =====================================================

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "true";
  const registered = searchParams.get("registered") === "true";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 2FA State
  const [requires2FA, setRequires2FA] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  // -------------------------------------------------
  // LOGIN HANDLER
  // -------------------------------------------------

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!email || !password) {
      setError("E-Mail und Passwort sind erforderlich");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!data.success && !data.requires_2fa) {
        setError(data.error || "Anmeldung fehlgeschlagen");
        setIsSubmitting(false);
        return;
      }

      // 2FA erforderlich
      if (data.requires_2fa) {
        setRequires2FA(true);
        setCustomerId(data.customer_id);
        setIsSubmitting(false);
        return;
      }

      // Erfolg - weiterleiten
      router.push(data.data?.redirect || "/portal");

    } catch {
      setError("Ein Fehler ist aufgetreten");
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------
  // 2FA HANDLER
  // -------------------------------------------------

  const handle2FAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!twoFactorCode || twoFactorCode.length < 6) {
      setError("Bitte geben Sie den 6-stelligen Code ein");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customer_id: customerId, 
          code: twoFactorCode 
        })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Ungültiger Code");
        setIsSubmitting(false);
        return;
      }

      // Erfolg
      router.push(data.data?.redirect || "/portal");

    } catch {
      setError("Ein Fehler ist aufgetreten");
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------
  // 2FA ANSICHT
  // -------------------------------------------------

  if (requires2FA) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                      flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl 
                       p-8 max-w-md w-full">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center 
                           mx-auto mb-4">
              <FaLock className="text-2xl text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">2-Faktor-Authentifizierung</h1>
            <p className="text-slate-400 mt-2">
              Geben Sie den Code aus Ihrer Authenticator-App ein
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 
                           flex items-center gap-3">
              <FaTimesCircle className="text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handle2FAVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                6-stelliger Code
              </label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg 
                         px-4 py-4 text-white text-center text-2xl tracking-widest
                         focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="000000"
                autoFocus
                autoComplete="one-time-code"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || twoFactorCode.length !== 6}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 
                       disabled:cursor-not-allowed text-white font-semibold py-3 px-4 
                       rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Wird verifiziert...
                </>
              ) : (
                "Verifizieren"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setRequires2FA(false);
                setTwoFactorCode("");
                setError(null);
              }}
              className="text-slate-400 hover:text-slate-300 text-sm"
            >
              ← Zurück zum Login
            </button>
          </div>

          <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
            <p className="text-slate-400 text-xs text-center">
              Sie können auch einen Ihrer Backup-Codes verwenden, 
              falls Sie keinen Zugriff auf Ihre Authenticator-App haben.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------
  // LOGIN FORMULAR
  // -------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                    flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl 
                     p-8 max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center 
                         mx-auto mb-4">
            <FaSignInAlt className="text-2xl text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Willkommen zurück</h1>
          <p className="text-slate-400 mt-2">
            Melden Sie sich bei Lopez IT Welt an
          </p>
        </div>

        {/* Success Messages */}
        {verified && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 
                         flex items-center gap-3">
            <FaCheckCircle className="text-green-400 flex-shrink-0" />
            <span className="text-green-300 text-sm">
              E-Mail erfolgreich verifiziert! Sie können sich jetzt anmelden.
            </span>
          </div>
        )}

        {registered && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6 
                         flex items-center gap-3">
            <FaCheckCircle className="text-blue-400 flex-shrink-0" />
            <span className="text-blue-300 text-sm">
              Registrierung erfolgreich! Bitte prüfen Sie Ihre E-Mails.
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 
                         flex items-center gap-3">
            <FaTimesCircle className="text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* E-Mail */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              E-Mail-Adresse
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg 
                         pl-10 pr-4 py-3 text-white placeholder-slate-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="max@beispiel.de"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Passwort */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Passwort
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg 
                         pl-10 pr-12 py-3 text-white placeholder-slate-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Ihr Passwort"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 
                         hover:text-slate-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link 
              href="/kunde/forgot-password" 
              className="text-sm text-blue-400 hover:underline"
            >
              Passwort vergessen?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !email || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 
                     disabled:cursor-not-allowed text-white font-semibold py-3 px-4 
                     rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                Wird angemeldet...
              </>
            ) : (
              "Anmelden"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Noch kein Konto?{" "}
          <Link href="/kunde/register" className="text-blue-400 hover:underline">
            Jetzt registrieren
          </Link>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function KundenLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <FaSpinner className="text-4xl text-blue-400 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

