"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { FaCheck, FaShieldAlt } from "react-icons/fa";

export default function TwoFactorSetupPage() {
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [supportRequired, setSupportRequired] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // 2FA-Setup initialisieren (nur nach Bestätigung)
  useEffect(() => {
    if (showConfirmation) {
      setup2FA();
    }
  }, [showConfirmation]);

  const setup2FA = async () => {
    try {
      console.log("Starte 2FA-Setup...");
      const response = await fetch("/api/auth/setup-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response Status:", response.status);

      const data = await response.json();

      if (data.success) {
        setSecret(data.secret);

        // QR-Code generieren
        const qrCodeDataURL = await QRCode.toDataURL(data.qrCodeUrl);
        setQrCode(qrCodeDataURL);
      } else {
        if (data.support_required) {
          setSupportRequired(true);
        } else {
          setError(data.message || "Fehler beim Setup von 2FA");
        }
      }
    } catch (error) {
      console.error("2FA Setup Fehler:", error);
      setError("Fehler beim Setup von 2FA");
    }
  };

  const verify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/verify-2fa-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEnabled(true);
        setSuccess("2FA erfolgreich aktiviert!");
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

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <FaShieldAlt className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Zwei-Faktor-Authentifizierung</h1>
          <p className="text-gray-600">Erhöhen Sie die Sicherheit Ihres Kontos mit 2FA</p>
        </div>

        {supportRequired ? (
          /* Support erforderlich */
          <div className="text-center">
            <FaShieldAlt className="mx-auto h-16 w-16 text-orange-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2FA bereits eingerichtet</h2>
            <p className="text-gray-600 mb-6">
              Das 2FA-Setup wurde bereits durchgeführt. Bei Problemen oder wenn Sie Ihr
              Authenticator-Gerät verloren haben, wenden Sie sich bitte an unseren Support.
            </p>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Support kontaktieren:</h3>
                <div className="text-sm text-blue-800">
                  <p>📧 E-Mail: support@lopez-it-welt.de</p>
                  <p>📞 Telefon: +49 123 456789</p>
                  <p>🕒 Mo-Fr: 9:00-18:00 Uhr</p>
                </div>
              </div>
              <div className="space-y-2">
                <a
                  href="/shop/profile"
                  className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Zurück zum Profil
                </a>
              </div>
            </div>
          </div>
        ) : !showConfirmation ? (
          /* Bestätigungsseite */
          <div className="space-y-6">
            {/* WICHTIGER HINWEIS */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-orange-800">⚠️ WICHTIGER HINWEIS</h3>
                  <div className="mt-2 text-sm text-orange-700">
                    <p className="font-semibold mb-2">
                      Das 2FA-Setup kann nur EINMAL durchgeführt werden!
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Bewahren Sie Ihr Authenticator-Gerät sicher auf</li>
                      <li>Notieren Sie sich die Backup-Codes (falls vorhanden)</li>
                      <li>Bei Verlust des Geräts wenden Sie sich an den Support</li>
                      <li>Ein erneutes Setup ist nicht möglich</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Bestätigung */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Sind Sie bereit für das 2FA-Setup?
              </h2>
              <p className="text-gray-600 mb-6">
                Bitte bestätigen Sie, dass Sie verstanden haben, dass das Setup nur einmal
                durchgeführt werden kann und Sie bei Problemen den Support kontaktieren müssen.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  Ja, ich verstehe - 2FA aktivieren
                </button>

                <div>
                  <a href="/shop/profile" className="text-gray-600 hover:text-gray-800 text-sm">
                    ← Zurück zum Profil
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : !isEnabled ? (
          <div className="space-y-6">
            {/* Schritt 1: QR-Code */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Schritt 1: Authenticator-App installieren
              </h2>
              <p className="text-gray-600 mb-4">
                Installieren Sie eine Authenticator-App wie Google Authenticator, Microsoft
                Authenticator oder Authy auf Ihrem Smartphone.
              </p>
            </div>

            {/* QR-Code */}
            {qrCode && (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Schritt 2: QR-Code scannen
                </h3>
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 mx-auto" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Scannen Sie diesen QR-Code mit Ihrer Authenticator-App
                </p>
              </div>
            )}

            {/* Schritt 3: Code eingeben */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Schritt 3: Code verifizieren
              </h3>
              <form onSubmit={verify2FA} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    6-stelliger Code aus Ihrer App
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest"
                    placeholder="123456"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? "Verifiziere..." : "2FA aktivieren"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Erfolg */
          <div className="text-center">
            <FaCheck className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2FA erfolgreich aktiviert!</h2>
            <p className="text-gray-600 mb-6">
              Ihr Konto ist jetzt durch Zwei-Faktor-Authentifizierung geschützt.
            </p>
            <div className="space-y-2">
              <a
                href="/shop/profile"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Zurück zum Profil
              </a>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}
