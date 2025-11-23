"use client";

import { useEffect, useState } from "react";

interface Customer {
  id?: number;
  kundennummer?: string;
  customer_type?: "privat" | "firma" | "behörde" | "partner";
  anrede?: string;
  titel?: string;
  vorname?: string;
  nachname?: string;
  firmenname?: string;
  email?: string;
  telefon?: string;
  strasse?: string;
  plz?: string;
  ort?: string;
  land?: string;
  status?: "aktiv" | "inaktiv" | "gesperrt";
  support_level?: "Standard" | "Premium" | "SLA 24h" | "SLA 4h";
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy-Felder für Kompatibilität
  type?: "firma" | "privat";
  name?: string;
  phone?: string;
  address?: string;
  projects_count?: number;
}

// Helper-Funktion: Kundennamen ermitteln
function getCustomerName(customer: Customer): string {
  if (customer.firmenname) {
    return customer.firmenname;
  }
  if (customer.vorname && customer.nachname) {
    return `${customer.vorname} ${customer.nachname}`;
  }
  if (customer.vorname) {
    return customer.vorname;
  }
  if (customer.nachname) {
    return customer.nachname;
  }
  if (customer.name) {
    return customer.name;
  }
  return "Unbekannter Kunde";
}

// Helper-Funktion: Kunden-Typ ermitteln
function getCustomerType(customer: Customer): "firma" | "privat" {
  if (customer.customer_type) {
    return customer.customer_type === "firma" || customer.customer_type === "behörde" || customer.customer_type === "partner" ? "firma" : "privat";
  }
  return customer.type || "privat";
}

// Helper-Funktion: Status ermitteln
function getCustomerStatus(customer: Customer): "active" | "inactive" {
  if (customer.status === "aktiv") {
    return "active";
  }
  if (customer.status === "inaktiv" || customer.status === "gesperrt") {
    return "inactive";
  }
  return customer.status === "active" ? "active" : "inactive";
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    type: "firma" as "firma" | "privat",
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [filter, setFilter] = useState({
    type: "",
    status: "",
  });

  // Kunden laden
  const loadCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers");
      if (response.ok) {
        const data = await response.json();
        console.log("📦 Kunden geladen:", data);
        // API gibt zurück: { success: true, data: { customers: [...] } }
        setCustomers(data?.data?.customers || data?.customers || []);
      } else {
        console.error("❌ Kunden konnten nicht geladen werden:", response.status);
        setCustomers([]);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Kunden:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Neuen Kunden hinzufügen
  const addCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        setNewCustomer({
          type: "firma",
          name: "",
          email: "",
          phone: "",
          address: "",
        });
        setShowAddForm(false);
        loadCustomers();
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error);
    }
  };

  // Kunde löschen
  const deleteCustomer = async (id: number | undefined) => {
    if (!id) {
      console.error("❌ Keine Kunden-ID angegeben");
      return;
    }

    if (!confirm("Kunde wirklich löschen?")) return;

    try {
      const response = await fetch(`/api/admin/customers/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete" }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Kunde gelöscht:", data);
        alert("✅ Kunde erfolgreich gelöscht");
        loadCustomers();
      } else {
        const error = await response.json();
        console.error("❌ Fehler beim Löschen:", error);
        alert(`❌ Fehler: ${error.message || "Kunde konnte nicht gelöscht werden"}`);
      }
    } catch (error) {
      console.error("❌ Fehler beim Löschen:", error);
      alert("❌ Fehler beim Löschen des Kunden");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Gefilterte Kunden
  const filteredCustomers = customers.filter(
    (customer) =>
      (!filter.type || getCustomerType(customer) === filter.type) &&
      (!filter.status || getCustomerStatus(customer) === filter.status),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Kunden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kundenverwaltung</h1>
              <p className="text-gray-600">Firmen- und Privatkunden verwalten</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Neuen Kunden hinzufügen
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a
              href="/admin"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Dashboard
            </a>
            <a
              href="/admin/texts"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Texte
            </a>
            <a
              href="/admin/users"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Benutzer
            </a>
            <a
              href="/admin/customers"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
            >
              Kunden
            </a>
            <a
              href="/admin/settings"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Einstellungen
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Alle</option>
                <option value="firma">Firma</option>
                <option value="privat">Privat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Alle</option>
                <option value="active">Aktiv</option>
                <option value="inactive">Inaktiv</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Customer Form */}
        {showAddForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Neuen Kunden hinzufügen</h2>
            <form onSubmit={addCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
                  <select
                    value={newCustomer.type}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        type: e.target.value as "firma" | "privat",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="firma">Firma</option>
                    <option value="privat">Privat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <textarea
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Kunde hinzufügen
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Kunden ({filteredCustomers.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projekte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Erstellt
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {getCustomerName(customer).charAt(0).toUpperCase() || "?"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{getCustomerName(customer)}</div>
                          <div className="text-sm text-gray-500">
                            {customer.kundennummer ? `KdNr: ${customer.kundennummer}` : `ID: ${customer.id || "N/A"}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getCustomerType(customer) === "firma"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {getCustomerType(customer) === "firma" ? "Firma" : "Privat"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.email || "Keine E-Mail"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.telefon || customer.phone || "Kein Telefon"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getCustomerStatus(customer) === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getCustomerStatus(customer) === "active" ? "Aktiv" : "Inaktiv"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.projects_count || 0} Projekte
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {getCustomerName(customer).charAt(0).toUpperCase() || "?"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{getCustomerName(customer)}</div>
                          <div className="text-sm text-gray-500">
                            {customer.kundennummer ? `KdNr: ${customer.kundennummer}` : `ID: ${customer.id || "N/A"}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getCustomerType(customer) === "firma"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {getCustomerType(customer) === "firma" ? "Firma" : "Privat"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.email || "Keine E-Mail"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.telefon || customer.phone || "Kein Telefon"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getCustomerStatus(customer) === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getCustomerStatus(customer) === "active" ? "Aktiv" : "Inaktiv"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.projects_count || 0} Projekte
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
