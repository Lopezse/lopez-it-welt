"use client";

import Logo from "@/components/Logo";
import PasswordGenerator from "@/components/ui/PasswordGenerator";
import PasswordStrengthIndicator from "@/components/ui/PasswordStrengthIndicator";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ShopRegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    company: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitAttempted(true);
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Alle Felder als berührt markieren
    const allFields = ["email", "first_name", "last_name", "password", "confirmPassword"];
    const touchedFields = { ...fieldTouched };
    allFields.forEach((field) => {
      touchedFields[field] = true;
    });
    setFieldTouched(touchedFields);

    // Enterprise++ Validierung mit detaillierten Fehlermeldungen
    const validationErrors: string[] = [];

    // E-Mail-Validierung
    if (!formData.email) {
      validationErrors.push("E-Mail-Adresse ist erforderlich");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.push("Bitte geben Sie eine gültige E-Mail-Adresse ein");
    }

    // Name-Validierung
    if (!formData.first_name.trim()) {
      validationErrors.push("Vorname ist erforderlich");
    }
    if (!formData.last_name.trim()) {
      validationErrors.push("Nachname ist erforderlich");
    }

    // Passwort-Validierung
    if (!formData.password) {
      validationErrors.push("Passwort ist erforderlich");
    } else {
      if (formData.password.length < 12) {
        validationErrors.push("Passwort muss mindestens 12 Zeichen lang sein");
      }

      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumbers = /\d/.test(formData.password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

      if (!hasUpperCase) {
        validationErrors.push("Passwort muss mindestens einen Großbuchstaben (A-Z) enthalten");
      }
      if (!hasLowerCase) {
        validationErrors.push("Passwort muss mindestens einen Kleinbuchstaben (a-z) enthalten");
      }
      if (!hasNumbers) {
        validationErrors.push("Passwort muss mindestens eine Zahl (0-9) enthalten");
      }
      if (!hasSpecialChars) {
        validationErrors.push("Passwort muss mindestens ein Sonderzeichen (!@#$%^&*) enthalten");
      }
    }

    // Passwort-Bestätigung
    if (!formData.confirmPassword) {
      validationErrors.push("Passwort-Bestätigung ist erforderlich");
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.push("Passwörter stimmen nicht überein");
    }

    // Fehler anzeigen
    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sende Registrierung:", formData);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Registrierung Response:", data);

      if (data.success) {
        setSuccess("Registrierung erfolgreich! Sie können sich jetzt anmelden.");
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          first_name: "",
          last_name: "",
          company: "",
          phone: "",
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

  const handlePasswordGenerated = (password: string) => {
    setFormData((prev) => ({
      ...prev,
      password: password,
      confirmPassword: password,
    }));
    setShowPasswordGenerator(false);
  };

  // Professional Echtzeit-Validierung mit Touch-Tracking
  const validateField = (field: string, value: string, touched: boolean = true) => {
    const errors: Record<string, string> = { ...validationErrors };
    const touchedFields = { ...fieldTouched };

    if (touched) {
      touchedFields[field] = true;
      setFieldTouched(touchedFields);
    }

    // Nur validieren wenn Feld berührt wurde oder Submit versucht wurde
    if (!touchedFields[field] && !submitAttempted) {
      setValidationErrors(errors);
      return;
    }

    switch (field) {
      case "email":
        if (!value.trim()) {
          errors.email = "E-Mail-Adresse ist erforderlich";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein";
        } else if (value.length > 254) {
          errors.email = "E-Mail-Adresse ist zu lang (max. 254 Zeichen)";
        } else {
          delete errors.email;
        }
        break;

      case "first_name":
        if (!value.trim()) {
          errors.first_name = "Vorname ist erforderlich";
        } else if (value.trim().length < 2) {
          errors.first_name = "Vorname muss mindestens 2 Zeichen lang sein";
        } else if (value.trim().length > 50) {
          errors.first_name = "Vorname ist zu lang (max. 50 Zeichen)";
        } else if (!/^[a-zA-ZäöüÄÖÜß\s-']+$/.test(value.trim())) {
          errors.first_name =
            "Vorname darf nur Buchstaben, Leerzeichen, Bindestriche und Apostrophe enthalten";
        } else {
          delete errors.first_name;
        }
        break;

      case "last_name":
        if (!value.trim()) {
          errors.last_name = "Nachname ist erforderlich";
        } else if (value.trim().length < 2) {
          errors.last_name = "Nachname muss mindestens 2 Zeichen lang sein";
        } else if (value.trim().length > 50) {
          errors.last_name = "Nachname ist zu lang (max. 50 Zeichen)";
        } else if (!/^[a-zA-ZäöüÄÖÜß\s-']+$/.test(value.trim())) {
          errors.last_name =
            "Nachname darf nur Buchstaben, Leerzeichen, Bindestriche und Apostrophe enthalten";
        } else {
          delete errors.last_name;
        }
        break;

      case "password":
        if (!value) {
          errors.password = "Passwort ist erforderlich";
        } else {
          if (value.length < 12) {
            errors.password = "Passwort muss mindestens 12 Zeichen lang sein";
          } else if (value.length > 128) {
            errors.password = "Passwort ist zu lang (max. 128 Zeichen)";
          } else {
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumbers = /\d/.test(value);
            const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(value);

            const missingRequirements = [];
            if (!hasUpperCase) missingRequirements.push("Großbuchstaben");
            if (!hasLowerCase) missingRequirements.push("Kleinbuchstaben");
            if (!hasNumbers) missingRequirements.push("Zahlen");
            if (!hasSpecialChars) missingRequirements.push("Sonderzeichen");

            if (missingRequirements.length > 0) {
              errors.password = `Passwort muss ${missingRequirements.join(", ")} enthalten`;
            } else {
              delete errors.password;
            }
          }
        }
        break;

      case "confirmPassword":
        if (!value) {
          errors.confirmPassword = "Passwort-Bestätigung ist erforderlich";
        } else if (formData.password !== value) {
          errors.confirmPassword = "Passwörter stimmen nicht überein";
        } else {
          delete errors.confirmPassword;
        }
        break;
    }

    setValidationErrors(errors);
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo className="h-12 w-auto" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Konto erstellen
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Bereits ein Konto?{" "}
            <a href="/shop/login" className="font-medium text-blue-600 hover:text-blue-500">
              Hier anmelden
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vorname *</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          first_name: e.target.value,
                        });
                        validateField("first_name", e.target.value);
                      }}
                      className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.first_name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {validationErrors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.first_name}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nachname *</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      value={formData.last_name}
                      onChange={(e) => {
                        setFormData({ ...formData, last_name: e.target.value });
                        validateField("last_name", e.target.value);
                      }}
                      className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.last_name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {validationErrors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.last_name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">E-Mail-Adresse *</label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      validateField("email", e.target.value, false);
                    }}
                    onBlur={(e) => validateField("email", e.target.value, true)}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Passwort *</label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      validateField("password", e.target.value);
                    }}
                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.password ? "border-red-500" : "border-gray-300"
                    }`}
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

                {/* Passwort-Stärke-Indikator */}
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">
                    Debug: Password = "{formData.password}"
                  </div>
                  <PasswordStrengthIndicator password={formData.password} className="mt-2" />
                </div>

                {/* Passwort-Generator Button */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordGenerator(!showPasswordGenerator)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    🔐 Passwort-Generator verwenden
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Passwort bestätigen *
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      });
                      validateField("confirmPassword", e.target.value);
                    }}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                  )}
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
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm animate-fadeIn">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Registrierung fehlgeschlagen
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm animate-fadeIn">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Registrierung erfolgreich!
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>{success}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Passwort-Generator Modal */}
              {showPasswordGenerator && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Passwort-Generator</h3>
                      <button
                        onClick={() => setShowPasswordGenerator(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                    <PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]"
                  }`}
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {isSubmitting ? "Validiere..." : "Erstelle Konto..."}
                    </>
                  ) : (
                    "Konto erstellen"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
