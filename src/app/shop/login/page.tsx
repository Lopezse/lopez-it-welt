"use client";

import Logo from "@/components/Logo";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaShieldAlt, FaShoppingCart, FaUser } from "react-icons/fa";

export default function ShopLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [isRegistering, setIsRegistering] = useState(false);

  // Registrierungsdaten
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    company: "",
    phone: "",
    enable_2fa: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validierung: Email muss @ enthalten (kein Username)
      if (!email.includes("@")) {
        setError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
        setIsLoading(false);
        return;
      }

      if (step === "credentials") {
        // Erste Stufe: E-Mail und Passwort (Shop-Login)
        const response = await fetch("/api/auth/shop/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          // Login erfolgreich, weiterleiten
          window.location.href = "/shop";
        } else if (data.requires2FA) {
          // 2FA erforderlich (optional für Shop)
          setStep("2fa");
        } else {
          setError(data.message || "Anmeldung fehlgeschlagen");
        }
      } else {
        // Zweite Stufe: 2FA-Code (optional für Shop)
        const response = await fetch("/api/auth/shop/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            twoFactorToken: totpCode,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // 2FA erfolgreich, weiterleiten
          window.location.href = "/shop";
        } else {
          setError(data.message || "2FA-Code ungültig");
        }
      }
    } catch (error) {
      console.error("Login-Fehler:", error);
      setError("Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Passwort-Validierung
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (data.success) {
        setError("");
        alert("Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails zur Verifikation.");
        setIsRegistering(false);
        setRegisterData({
          email: "",
          password: "",
          confirmPassword: "",
          first_name: "",
          last_name: "",
          company: "",
          phone: "",
          enable_2fa: false,
        });
      } else {
        setError(data.message || "Registrierung fehlgeschlagen");
      }
    } catch (error) {
      console.error("Registrierung-Fehler:", error);
      setError("Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo className="h-12 w-auto" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isRegistering ? "Konto erstellen" : "In den Shop einloggen"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isRegistering ? (
            <>
              Bereits ein Konto?{" "}
              <button
                onClick={() => setIsRegistering(false)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Hier anmelden
              </button>
            </>
          ) : (
            <>
              Noch kein Konto?{" "}
              <button
                onClick={() => (window.location.href = "/shop/register")}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Hier registrieren
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isRegistering ? (
            // Registrierungsformular
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vorname</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      value={registerData.first_name}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          first_name: e.target.value,
                        })
                      }
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nachname</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      value={registerData.last_name}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          last_name: e.target.value,
                        })
                      }
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">E-Mail-Adresse</label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Passwort</label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-gray-400" />
                    ) : (
                      <FaEye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Passwort bestätigen
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Firma (optional)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={registerData.company}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          company: e.target.value,
                        })
                      }
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Telefon (optional)
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          phone: e.target.value,
                        })
                      }
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="enable-2fa"
                  type="checkbox"
                  checked={registerData.enable_2fa}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      enable_2fa: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enable-2fa" className="ml-2 block text-sm text-gray-900">
                  2FA aktivieren (optional)
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? "Wird erstellt..." : "Konto erstellen"}
                </button>
              </div>
            </form>
          ) : (
            // Login-Formular
            <form className="space-y-6" onSubmit={handleLogin}>
              {step === "credentials" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      E-Mail-Adresse
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ihre@email.de"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Passwort</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ihr Passwort"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FaEye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">2FA-Code</label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaShieldAlt className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Geben Sie den 6-stelligen Code aus Ihrer Authenticator-App ein.
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    "Wird angemeldet..."
                  ) : step === "credentials" ? (
                    <>
                      <FaShoppingCart className="mr-2 h-4 w-4" />
                      In den Shop
                    </>
                  ) : (
                    "2FA bestätigen"
                  )}
                </button>
              </div>

              {step === "2fa" && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep("credentials")}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Zurück zur Anmeldung
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
