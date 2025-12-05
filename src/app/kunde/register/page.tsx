// =====================================================
// KUNDEN REGISTRIERUNG PAGE
// =====================================================
// /kunde/register
// Enterprise++ Registrierungsformular
// =====================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaEnvelope, FaLock, FaUser, FaBuilding, FaEye, FaEyeSlash,
  FaCheckCircle, FaTimesCircle, FaSpinner, FaShieldAlt
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

interface FormData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  company_name: string;
  dsgvo_consent: boolean;
  marketing_consent: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

// =====================================================
// PASSWORT-STÄRKE
// =====================================================

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return { score, label: "Schwach", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Mittel", color: "bg-yellow-500" };
  return { score, label: "Stark", color: "bg-green-500" };
}

// =====================================================
// COMPONENT
// =====================================================

export default function KundenRegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    company_name: "",
    dsgvo_consent: false,
    marketing_consent: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.password_confirm;

  // -------------------------------------------------
  // FORM HANDLER
  // -------------------------------------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Client-Validierung
    if (!formData.email || !formData.password) {
      setError("E-Mail und Passwort sind erforderlich");
      setIsSubmitting(false);
      return;
    }

    if (!passwordsMatch) {
      setError("Passwörter stimmen nicht überein");
      setIsSubmitting(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Bitte wählen Sie ein stärkeres Passwort");
      setIsSubmitting(false);
      return;
    }

    if (!formData.dsgvo_consent) {
      setError("Bitte stimmen Sie den Datenschutzbestimmungen zu");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Registrierung fehlgeschlagen");
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      
      // Nach 3 Sekunden zum Login weiterleiten
      setTimeout(() => {
        router.push("/kunde/login?registered=true");
      }, 3000);

    } catch {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------
  // ERFOLGS-ANSICHT
  // -------------------------------------------------

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                      flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl 
                       p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center 
                         mx-auto mb-6">
            <FaCheckCircle className="text-4xl text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Registrierung erfolgreich!
          </h1>
          <p className="text-slate-300 mb-6">
            Wir haben Ihnen eine E-Mail zur Bestätigung gesendet.<br />
            Bitte prüfen Sie Ihren Posteingang.
          </p>
          <div className="text-slate-400 text-sm">
            Sie werden in Kürze weitergeleitet...
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------
  // FORMULAR
  // -------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                    flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl 
                     p-8 max-w-lg w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center 
                         mx-auto mb-4">
            <FaShieldAlt className="text-2xl text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Konto erstellen</h1>
          <p className="text-slate-400 mt-2">
            Registrieren Sie sich bei Lopez IT Welt
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Vorname
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg 
                           pl-10 pr-4 py-3 text-white placeholder-slate-400
                           focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nachname
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg 
                         px-4 py-3 text-white placeholder-slate-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Mustermann"
              />
            </div>
          </div>

          {/* E-Mail */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              E-Mail-Adresse *
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg 
                         pl-10 pr-4 py-3 text-white placeholder-slate-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="max@beispiel.de"
              />
            </div>
          </div>

          {/* Firma */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Firma (optional)
            </label>
            <div className="relative">
              <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg 
                         pl-10 pr-4 py-3 text-white placeholder-slate-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Musterfirma GmbH"
              />
            </div>
          </div>

          {/* Passwort */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Passwort *
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg 
                         pl-10 pr-12 py-3 text-white placeholder-slate-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Mindestens 8 Zeichen"
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
            {/* Passwort-Stärke */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{passwordStrength.label}</span>
                </div>
                <ul className="text-xs text-slate-500 space-y-0.5">
                  <li className={formData.password.length >= 8 ? "text-green-400" : ""}>
                    • Mindestens 8 Zeichen
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? "text-green-400" : ""}>
                    • Ein Großbuchstabe
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? "text-green-400" : ""}>
                    • Eine Zahl
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Passwort bestätigen */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Passwort bestätigen *
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPasswordConfirm ? "text" : "password"}
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                className={`w-full bg-slate-700/50 border rounded-lg 
                         pl-10 pr-12 py-3 text-white placeholder-slate-400
                         focus:outline-none focus:ring-1
                         ${formData.password_confirm && !passwordsMatch 
                           ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                           : "border-slate-600 focus:border-blue-500 focus:ring-blue-500"}`}
                placeholder="Passwort wiederholen"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 
                         hover:text-slate-300"
              >
                {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.password_confirm && !passwordsMatch && (
              <p className="text-red-400 text-xs mt-1">Passwörter stimmen nicht überein</p>
            )}
          </div>

          {/* DSGVO Consent */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="dsgvo_consent"
                checked={formData.dsgvo_consent}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-700 
                         text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
              />
              <span className="text-sm text-slate-300">
                Ich habe die{" "}
                <Link href="/datenschutz" className="text-blue-400 hover:underline">
                  Datenschutzerklärung
                </Link>{" "}
                gelesen und stimme der Verarbeitung meiner Daten zu. *
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="marketing_consent"
                checked={formData.marketing_consent}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-700 
                         text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
              />
              <span className="text-sm text-slate-400">
                Ich möchte über Neuigkeiten und Updates per E-Mail informiert werden.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.dsgvo_consent || !passwordsMatch}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 
                     disabled:cursor-not-allowed text-white font-semibold py-3 px-4 
                     rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                Wird verarbeitet...
              </>
            ) : (
              "Konto erstellen"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Bereits ein Konto?{" "}
          <Link href="/kunde/login" className="text-blue-400 hover:underline">
            Jetzt anmelden
          </Link>
        </div>
      </div>
    </div>
  );
}

