"use client";

// =====================================================
// NEW PROJECT PAGE - LOPEZ IT WELT (ENTERPRISE++ DARK)
// =====================================================

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaSave, FaProjectDiagram } from "react-icons/fa";

interface ProjectFormData {
  customer_id: string;
  project_name: string;
  project_code: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "planned" | "open" | "in_progress" | "on_hold" | "done" | "cancelled";
}

interface Customer {
  id: number;
  company_name?: string;
  firmenname?: string;
  name?: string;
  vorname?: string;
  nachname?: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const [formData, setFormData] = useState<ProjectFormData>({
    customer_id: "",
    project_name: "",
    project_code: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "planned",
  });

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await fetch("/api/admin/customers");
        if (response.ok) {
          const data = await response.json();
          const loadedCustomers = data?.data?.customers || data?.customers || [];
          setCustomers(loadedCustomers);

          if (loadedCustomers.length > 0 && !formData.customer_id) {
            setFormData((prev) => ({
              ...prev,
              customer_id: loadedCustomers[0].id.toString(),
            }));
          }
        }
      } catch (err) {
        console.error("Fehler beim Laden der Kunden:", err);
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomers();
  }, []);

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.customer_id) {
      setError("Bitte einen Kunden auswählen");
      setLoading(false);
      return;
    }

    if (!formData.project_name) {
      setError("Bitte einen Projektnamen eingeben");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: parseInt(formData.customer_id),
          project_name: formData.project_name,
          project_code: formData.project_code || null,
          description: formData.description || null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/office/projects");
        }, 1500);
      } else {
        setError(data.message || data.error || "Fehler beim Erstellen des Projekts");
      }
    } catch (err) {
      console.error("Projekt erstellen Fehler:", err);
      setError("Fehler beim Erstellen des Projekts");
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (customer: Customer) => {
    return customer.firmenname || customer.company_name || customer.name || 
           `${customer.vorname || ""} ${customer.nachname || ""}`.trim() || 
           `Kunde ${customer.id}`;
  };

  // Input-Styles für Dark Mode
  const inputStyle = {
    backgroundColor: "#1f2329",
    border: "1px solid #272a33",
    color: "#f4f4f4",
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/office/projects"
            className="inline-flex items-center text-sm mb-4 transition-colors hover:text-[#ffd700]"
            style={{ color: "#b3b3b3" }}
          >
            <FaArrowLeft className="mr-2" />
            Zurück zur Projektliste
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#f4f4f4" }}>
                Neues Projekt anlegen
              </h1>
              <p className="mt-1" style={{ color: "#b3b3b3" }}>
                Erstellen Sie ein neues Projekt für einen Kunden
              </p>
            </div>
            <FaProjectDiagram className="text-4xl" style={{ color: "#ffd700" }} />
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div 
            className="mb-6 rounded-lg p-4"
            style={{ backgroundColor: "#24a148", color: "#fff" }}
          >
            ✅ Projekt erfolgreich erstellt! Weiterleitung zur Projektliste...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 rounded-lg p-4"
            style={{ backgroundColor: "#da1e28", color: "#fff" }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form 
          onSubmit={handleSubmit} 
          className="rounded-lg p-6"
          style={{ backgroundColor: "#111217", border: "1px solid #272a33" }}
        >
          <div className="space-y-6">
            {/* Kunde */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#b3b3b3" }}>
                Kunde <span style={{ color: "#da1e28" }}>*</span>
              </label>
              <select
                value={formData.customer_id}
                onChange={(e) => handleInputChange("customer_id", e.target.value)}
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                style={inputStyle}
                required
                disabled={loadingCustomers}
              >
                <option value="">
                  {loadingCustomers ? "Lade Kunden..." : "-- Kunde auswählen --"}
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {getCustomerName(customer)}
                  </option>
                ))}
              </select>
              {customers.length === 0 && !loadingCustomers && (
                <p className="mt-2 text-sm" style={{ color: "#ffd700" }}>
                  ⚠️ Keine Kunden vorhanden.{" "}
                  <Link
                    href="/admin/customers/new"
                    className="underline hover:text-[#fff]"
                    style={{ color: "#ffd700" }}
                  >
                    Ersten Kunden anlegen
                  </Link>
                </p>
              )}
            </div>

            {/* Projektname */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#b3b3b3" }}>
                Projektname <span style={{ color: "#da1e28" }}>*</span>
              </label>
              <input
                type="text"
                value={formData.project_name}
                onChange={(e) => handleInputChange("project_name", e.target.value)}
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                style={inputStyle}
                placeholder="z.B. Office & Finance Management 2025"
                required
              />
            </div>

            {/* Projektcode */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#b3b3b3" }}>
                Projektcode (optional)
              </label>
              <input
                type="text"
                value={formData.project_code}
                onChange={(e) => handleInputChange("project_code", e.target.value)}
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                style={inputStyle}
                placeholder="z.B. LITW-OFF-2025"
              />
            </div>

            {/* Beschreibung */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#b3b3b3" }}>
                Beschreibung (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                style={inputStyle}
                rows={4}
                placeholder="z.B. Enterprise++ Office Management mit Zeiterfassung, Rechnungen und Lohnabrechnung"
              />
            </div>

            {/* Zeitraum */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#b3b3b3" }}>
                  Startdatum (optional)
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange("start_date", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#b3b3b3" }}>
                  Enddatum (optional)
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange("end_date", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#b3b3b3" }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value as ProjectFormData["status"])}
                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                style={inputStyle}
              >
                <option value="planned">Geplant</option>
                <option value="open">Offen</option>
                <option value="in_progress">In Bearbeitung</option>
                <option value="on_hold">Pausiert</option>
                <option value="done">Abgeschlossen</option>
                <option value="cancelled">Abgebrochen</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end space-x-3 border-t pt-6" style={{ borderColor: "#272a33" }}>
            <Link
              href="/admin/office/projects"
              className="px-4 py-2 rounded-lg flex items-center transition-colors"
              style={{ backgroundColor: "#272a33", color: "#f4f4f4", border: "1px solid #3d4150" }}
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              disabled={loading || !formData.customer_id || !formData.project_name}
              className="px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#ffd700", color: "#050509" }}
            >
              <FaSave className="mr-2" />
              {loading ? "Speichere..." : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
