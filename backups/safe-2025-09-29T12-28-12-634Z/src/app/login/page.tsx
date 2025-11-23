"use client";

import Logo from "@/components/Logo";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaKey, FaLock, FaShieldAlt, FaUser } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (step === "credentials") {
        // Erste Stufe: E-Mail und Passwort
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        });

        const data = await response.json();

        if (data.success) {
          if (data.requires2FA) {
            setStep("2fa");
          } else {
            // Login erfolgreich, weiterleiten
            window.location.href = "/admin";
          }
        } else {
          setError(data.message || "Anmeldung fehlgeschlagen");
        }
      } else {
        // Zweite Stufe: 2FA-Code
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: email,
            password,
            twoFactorToken: totpCode,
          }),
        });

        const data = await response.json();

        if (data.success) {
          window.location.href = "/admin";
        } else {
          setError(data.message || "2FA-Code ungültig");
        }
      }
    } catch (error) {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      {/* Hintergrund-Effekte */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Login-Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo und Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="large" showTagline={true} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Willkommen zurück</h1>
          <p className="text-slate-300">Melden Sie sich sicher in Ihrem Konto an</p>
        </div>

        {/* Login-Formular */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* E-Mail */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">E-Mail-Adresse</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="ihre@email.de"
                  required
                />
              </div>
            </div>

            {/* Passwort */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Passwort</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ihr Passwort"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 2FA-Code (nur wenn nötig) */}
            {step === "2fa" && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <FaShieldAlt className="inline h-4 w-4 mr-2" />
                  2FA-Code (Aegis)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="6-stelliger Code"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Geben Sie den 6-stelligen Code aus Ihrer Aegis-App ein
                </p>
              </div>
            )}

            {/* Fehler-Anzeige */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Submit-Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {step === "credentials" ? "Anmelden..." : "Verifiziere..."}
                </div>
              ) : step === "credentials" ? (
                "Anmelden"
              ) : (
                "2FA bestätigen"
              )}
            </button>

            {/* Passwort vergessen */}
            <div className="text-center">
              <button
                type="button"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Passwort vergessen?
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">© 2024 Lopez IT Welt. Alle Rechte vorbehalten.</p>
          <div className="flex items-center justify-center mt-2 text-xs text-slate-500">
            <FaShieldAlt className="h-3 w-3 mr-1" />
            Sichere Verbindung
          </div>
        </div>
      </div>
    </div>
  );
}
