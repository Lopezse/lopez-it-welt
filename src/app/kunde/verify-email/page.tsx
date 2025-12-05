// =====================================================
// E-MAIL VERIFIZIERUNG PAGE
// =====================================================
// /kunde/verify-email?token=xxx
// Enterprise++ E-Mail-Bestätigung
// =====================================================

"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  FaCheckCircle, FaTimesCircle, FaSpinner, FaEnvelope 
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

type VerificationStatus = "loading" | "success" | "error" | "no-token";

// =====================================================
// VERIFY CONTENT COMPONENT
// =====================================================

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // -------------------------------------------------
  // VERIFIZIERUNG
  // -------------------------------------------------

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Verifizierung fehlgeschlagen");
        }

      } catch {
        setStatus("error");
        setErrorMessage("Ein Fehler ist aufgetreten");
      }
    };

    verifyEmail();
  }, [token]);

  // -------------------------------------------------
  // RENDER
  // -------------------------------------------------

  return (
    <>
      {/* Loading */}
      {status === "loading" && (
        <>
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center 
                         mx-auto mb-6">
            <FaSpinner className="text-4xl text-blue-400 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            E-Mail wird verifiziert...
          </h1>
          <p className="text-slate-400">
            Bitte warten Sie einen Moment.
          </p>
        </>
      )}

      {/* Success */}
      {status === "success" && (
        <>
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center 
                         mx-auto mb-6 animate-bounce">
            <FaCheckCircle className="text-4xl text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            E-Mail erfolgreich verifiziert!
          </h1>
          <p className="text-slate-300 mb-6">
            Ihr Konto ist jetzt aktiv. Sie können sich jetzt anmelden.
          </p>
          <Link
            href="/kunde/login"
            className="inline-block bg-green-600 hover:bg-green-700 text-white 
                     font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Zum Login
          </Link>
        </>
      )}

      {/* Error */}
      {status === "error" && (
        <>
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center 
                         mx-auto mb-6">
            <FaTimesCircle className="text-4xl text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Verifizierung fehlgeschlagen
          </h1>
          <p className="text-slate-300 mb-2">
            {errorMessage}
          </p>
          <p className="text-slate-400 text-sm mb-6">
            Möglicherweise ist der Link abgelaufen oder wurde bereits verwendet.
          </p>
          <div className="space-y-3">
            <Link
              href="/kunde/register"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white 
                       font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Erneut registrieren
            </Link>
            <Link
              href="/kunde/login"
              className="block w-full bg-slate-600 hover:bg-slate-500 text-white 
                       font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Zum Login
            </Link>
          </div>
        </>
      )}

      {/* No Token */}
      {status === "no-token" && (
        <>
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center 
                         mx-auto mb-6">
            <FaEnvelope className="text-4xl text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Kein Token vorhanden
          </h1>
          <p className="text-slate-300 mb-6">
            Bitte klicken Sie auf den Link in Ihrer Bestätigungs-E-Mail.
          </p>
          <p className="text-slate-400 text-sm mb-6">
            Falls Sie keine E-Mail erhalten haben, prüfen Sie bitte Ihren Spam-Ordner 
            oder registrieren Sie sich erneut.
          </p>
          <div className="space-y-3">
            <Link
              href="/kunde/register"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white 
                       font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Zur Registrierung
            </Link>
          </div>
        </>
      )}
    </>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function KundenVerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                    flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl 
                     p-8 max-w-md w-full text-center">
        <Suspense fallback={
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
              <FaSpinner className="text-4xl text-blue-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Laden...</h1>
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}

