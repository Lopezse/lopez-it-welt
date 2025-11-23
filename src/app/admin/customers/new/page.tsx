"use client";

// =====================================================
// NEW CUSTOMER PAGE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Neuen Kunden hinzufügen
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaArrowLeft,
  FaBuilding,
  FaSave,
  FaTimes,
  FaUser,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";

interface CustomerFormData {
  customer_type: "privat" | "firma" | "behörde" | "partner";
  anrede: string;
  titel: string;
  vorname: string;
  nachname: string;
  company_name: string;
  ust_id: string;
  contact_person_anrede: string;
  contact_person_titel: string;
  contact_person_vorname: string;
  contact_person_nachname: string;
  email: string;
  email_secondary: string;
  phone_mobile: string;
  phone_business: string;
  phone_private: string;
  strasse: string;
  plz: string;
  stadt: string;
  land: string;
  land_iso: string;
  support_level: "Standard" | "Premium" | "SLA 24h" | "SLA 4h";
  account_manager: string;
  status: "aktiv" | "inaktiv" | "gesperrt";
  notes: string;
}

export default function NewCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CustomerFormData>({
    customer_type: "privat",
    anrede: "Keine Angabe",
    titel: "",
    vorname: "",
    nachname: "",
    company_name: "",
    ust_id: "",
    contact_person_anrede: "Keine Angabe",
    contact_person_titel: "",
    contact_person_vorname: "",
    contact_person_nachname: "",
    email: "",
    email_secondary: "",
    phone_mobile: "",
    phone_business: "",
    phone_private: "",
    strasse: "",
    plz: "",
    stadt: "",
    land: "Deutschland",
    land_iso: "DE",
    support_level: "Standard",
    account_manager: "",
    status: "aktiv",
    notes: "",
  });

  // =====================================================
  // FORM HANDLERS
  // =====================================================

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Prüfe HTTP Status Code und parse Response
      const responseText = await response.text();
      console.log("📦 Raw API Response:", responseText);
      console.log("📦 Response Status:", response.status, response.statusText);
      
      let data = {};
      try {
        if (responseText) {
          data = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error("❌ JSON Parse Fehler:", parseError);
        setError(`Fehler beim Verarbeiten der Server-Antwort: ${responseText.substring(0, 200)}`);
        setLoading(false);
        return;
      }
      
      console.log("📦 Parsed API Response:", data);

      // Prüfe HTTP Status Code
      if (!response.ok) {
        console.error("❌ HTTP Fehler:", response.status, data);
        setError(data.message || data.error || `Fehler ${response.status}: ${response.statusText}`);
        setLoading(false);
        return;
      }

      if (data.success) {
        console.log("✅ Kunde erfolgreich erstellt:", data);
        setSuccess(true);
        
        // Erfolgsmeldung mit Details anzeigen
        const customerName = formData.company_name || `${formData.vorname} ${formData.nachname}`;
        const kundennummer = data.data?.kundennummer || data.data?.customer_id || "N/A";
        alert(`✅ Kunde erfolgreich angelegt!\n\nName: ${customerName}\nKundennummer: ${kundennummer}`);
        
        setTimeout(() => {
          router.push("/admin/customers");
        }, 2000);
      } else {
        console.error("❌ API gab success: false zurück:", data);
        setError(data.message || "Fehler beim Erstellen des Kunden");
      }
    } catch (err) {
      console.error("❌ Kunde erstellen Fehler (Catch):", err);
      setError(err instanceof Error ? err.message : "Fehler beim Erstellen des Kunden");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI HELPER FUNCTIONS
  // =====================================================

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case "privat":
        return <FaUser className="h-4 w-4" />;
      case "firma":
        return <FaBuilding className="h-4 w-4" />;
      case "behörde":
        return <FaUserTie className="h-4 w-4" />;
      case "partner":
        return <FaUsers className="h-4 w-4" />;
      default:
        return <FaUser className="h-4 w-4" />;
    }
  };

  const isCompanyType = formData.customer_type !== "privat";

  // =====================================================
  // RENDER
  // =====================================================

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <FaSave className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ✅ Kunde erfolgreich erstellt!
            </h2>
            <p className="text-gray-600 mb-4">
              Der neue Kunde wurde erfolgreich im System angelegt und ist jetzt in der Kundenliste verfügbar.
            </p>
            <p className="text-sm text-gray-500">
              Sie werden automatisch zur Kundenliste weitergeleitet...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin/customers" className="mr-4 p-2 text-gray-400 hover:text-gray-600">
                <FaArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  {getCustomerTypeIcon(formData.customer_type)}
                  <span className="ml-3">Neuen Kunden hinzufügen</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  Neuen{" "}
                  {formData.customer_type === "privat"
                    ? "Privatkunden"
                    : formData.customer_type === "firma"
                      ? "Firmenkunden"
                      : formData.customer_type === "behörde"
                        ? "Behördenkunden"
                        : "Partnerkunden"}{" "}
                  anlegen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <FaTimes className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Fehler</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Kundentyp */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Kundentyp</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "privat", label: "Privat", icon: FaUser },
                { value: "firma", label: "Firma", icon: FaBuilding },
                { value: "behörde", label: "Behörde", icon: FaUserTie },
                { value: "partner", label: "Partner", icon: FaUsers },
              ].map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.customer_type === value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="customer_type"
                    value={value}
                    checked={formData.customer_type === value}
                    onChange={(e) => handleInputChange("customer_type", e.target.value)}
                    className="sr-only"
                  />
                  <Icon className="h-6 w-6 mb-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Personendaten */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personendaten</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anrede</label>
                <select
                  value={formData.anrede}
                  onChange={(e) => handleInputChange("anrede", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Keine Angabe">Keine Angabe</option>
                  <option value="Herr">Herr</option>
                  <option value="Frau">Frau</option>
                  <option value="Divers">Divers</option>
                  <option value="Mx">Mx</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                <input
                  type="text"
                  value={formData.titel}
                  onChange={(e) => handleInputChange("titel", e.target.value)}
                  placeholder="z.B. Dr., Prof."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vorname *</label>
                <input
                  type="text"
                  value={formData.vorname}
                  onChange={(e) => handleInputChange("vorname", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nachname *</label>
                <input
                  type="text"
                  value={formData.nachname}
                  onChange={(e) => handleInputChange("nachname", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Firmendaten (nur für Firmen/Behörden/Partner) */}
          {isCompanyType && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Firmendaten</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Firmenname *
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">USt-ID</label>
                  <input
                    type="text"
                    value={formData.ust_id}
                    onChange={(e) => handleInputChange("ust_id", e.target.value)}
                    placeholder="z.B. DE123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Kontaktdaten */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Kontaktdaten</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail (sekundär)
                </label>
                <input
                  type="email"
                  value={formData.email_secondary}
                  onChange={(e) => handleInputChange("email_secondary", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon mobil
                </label>
                <input
                  type="tel"
                  value={formData.phone_mobile}
                  onChange={(e) => handleInputChange("phone_mobile", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon geschäftlich
                </label>
                <input
                  type="tel"
                  value={formData.phone_business}
                  onChange={(e) => handleInputChange("phone_business", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Straße</label>
                <input
                  type="text"
                  value={formData.strasse}
                  onChange={(e) => handleInputChange("strasse", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PLZ</label>
                <input
                  type="text"
                  value={formData.plz}
                  onChange={(e) => handleInputChange("plz", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stadt</label>
                <input
                  type="text"
                  value={formData.stadt}
                  onChange={(e) => handleInputChange("stadt", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Land</label>
                <select
                  value={formData.land}
                  onChange={(e) => handleInputChange("land", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Deutschland">Deutschland</option>
                  <option value="Österreich">Österreich</option>
                  <option value="Schweiz">Schweiz</option>
                  <option value="Frankreich">Frankreich</option>
                  <option value="Italien">Italien</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service & Verwaltung */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Service & Verwaltung</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support-Level
                </label>
                <select
                  value={formData.support_level}
                  onChange={(e) => handleInputChange("support_level", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="SLA 24h">SLA 24h</option>
                  <option value="SLA 4h">SLA 4h</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="aktiv">Aktiv</option>
                  <option value="inaktiv">Inaktiv</option>
                  <option value="gesperrt">Gesperrt</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notizen</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Interne Notizen zum Kunden..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/customers"
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Wird erstellt...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Kunde erstellen
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/customers"
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Wird erstellt...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Kunde erstellen
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
