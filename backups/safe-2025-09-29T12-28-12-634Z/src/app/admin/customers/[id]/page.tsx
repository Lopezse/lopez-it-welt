"use client";

// =====================================================
// CUSTOMER DETAILS PAGE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Kunden-Details anzeigen und bearbeiten
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBuilding,
  FaCalendarAlt,
  FaEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaShieldAlt,
  FaTag,
  FaUser,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";

interface Customer {
  id: string;
  customer_type: "privat" | "firma" | "behörde" | "partner";
  anrede: string;
  titel?: string;
  vorname: string;
  nachname: string;
  company_name?: string;
  ust_id?: string;
  contact_person_anrede?: string;
  contact_person_titel?: string;
  contact_person_vorname?: string;
  contact_person_nachname?: string;
  email: string;
  email_secondary?: string;
  phone_mobile?: string;
  phone_business?: string;
  phone_private?: string;
  strasse?: string;
  plz?: string;
  stadt?: string;
  land: string;
  land_iso: string;
  support_level: "Standard" | "Premium" | "SLA 24h" | "SLA 4h";
  account_manager?: string;
  account_manager_name?: string;
  account_manager_lastname?: string;
  status: "aktiv" | "inaktiv" | "gesperrt";
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  contact_type: string;
  contact_method: string;
  subject: string;
  description: string;
  contact_date: string;
  created_by: string;
}

interface Document {
  id: string;
  document_type: string;
  document_name: string;
  file_size_bytes: number;
  mime_type: string;
  is_confidential: boolean;
  uploaded_at: string;
}

interface Tag {
  id: number;
  tag_name: string;
  tag_color: string;
  tag_description: string;
}

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // =====================================================
  // LIFECYCLE & DATA LOADING
  // =====================================================

  useEffect(() => {
    if (customerId) {
      loadCustomerDetails();
    }
  }, [customerId]);

  const loadCustomerDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/admin/customers/${customerId}`);
      const data = await response.json();

      if (data.success) {
        setCustomer(data.data.customer);
        setContacts(data.data.contacts || []);
        setDocuments(data.data.documents || []);
        setTags(data.data.tags || []);
      } else {
        setError(data.message || "Fehler beim Laden der Kunden-Details");
      }
    } catch (err) {
      console.error("Kunden-Details laden Fehler:", err);
      setError("Fehler beim Laden der Kunden-Details");
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
        return <FaUser className="h-5 w-5" />;
      case "firma":
        return <FaBuilding className="h-5 w-5" />;
      case "behörde":
        return <FaUserTie className="h-5 w-5" />;
      case "partner":
        return <FaUsers className="h-5 w-5" />;
      default:
        return <FaUser className="h-5 w-5" />;
    }
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "privat":
        return "bg-blue-100 text-blue-800";
      case "firma":
        return "bg-green-100 text-green-800";
      case "behörde":
        return "bg-purple-100 text-purple-800";
      case "partner":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aktiv":
        return "bg-green-100 text-green-800";
      case "inaktiv":
        return "bg-gray-100 text-gray-800";
      case "gesperrt":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case "Standard":
        return "bg-gray-100 text-gray-800";
      case "Premium":
        return "bg-blue-100 text-blue-800";
      case "SLA 24h":
        return "bg-orange-100 text-orange-800";
      case "SLA 4h":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDisplayName = (customer: Customer) => {
    if (customer.customer_type === "privat") {
      return `${customer.vorname} ${customer.nachname}`;
    } else {
      return customer.company_name || `${customer.vorname} ${customer.nachname}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // RENDER
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || "Kunde nicht gefunden"}
            </h2>
            <p className="text-gray-600 mb-4">
              Der angeforderte Kunde konnte nicht geladen werden.
            </p>
            <Link
              href="/admin/customers"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaArrowLeft className="mr-2" />
              Zurück zur Kundenliste
            </Link>
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
                  {getCustomerTypeIcon(customer.customer_type)}
                  <span className="ml-3">{getDisplayName(customer)}</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  {customer.customer_type === "privat"
                    ? "Privatkunde"
                    : customer.customer_type === "firma"
                      ? "Firmenkunde"
                      : customer.customer_type === "behörde"
                        ? "Behördenkunde"
                        : "Partnerkunde"}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <FaTag className="mr-2" />
                Tags verwalten
              </button>
              <Link
                href={`/admin/customers/${customer.id}/edit`}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                <FaEdit className="mr-2" />
                Bearbeiten
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Tabs */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: "overview", name: "Übersicht", icon: FaUser },
                { id: "contacts", name: "Kontakte", icon: FaPhone },
                { id: "documents", name: "Dokumente", icon: FaBuilding },
                { id: "tags", name: "Tags", icon: FaTag },
              ].map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hauptinformationen */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personendaten */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personendaten</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Anrede</label>
                    <p className="mt-1 text-sm text-gray-900">{customer.anrede}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Titel</label>
                    <p className="mt-1 text-sm text-gray-900">{customer.titel || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Vorname</label>
                    <p className="mt-1 text-sm text-gray-900">{customer.vorname}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nachname</label>
                    <p className="mt-1 text-sm text-gray-900">{customer.nachname}</p>
                  </div>
                </div>
              </div>

              {/* Firmendaten */}
              {customer.customer_type !== "privat" && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Firmendaten</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Firmenname</label>
                      <p className="mt-1 text-sm text-gray-900">{customer.company_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">USt-ID</label>
                      <p className="mt-1 text-sm text-gray-900">{customer.ust_id || "-"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Kontaktdaten */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Kontaktdaten</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaEnvelope className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{customer.email}</p>
                      <p className="text-xs text-gray-500">Primäre E-Mail</p>
                    </div>
                  </div>
                  {customer.email_secondary && (
                    <div className="flex items-center">
                      <FaEnvelope className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {customer.email_secondary}
                        </p>
                        <p className="text-xs text-gray-500">Sekundäre E-Mail</p>
                      </div>
                    </div>
                  )}
                  {customer.phone_mobile && (
                    <div className="flex items-center">
                      <FaPhone className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.phone_mobile}</p>
                        <p className="text-xs text-gray-500">Mobil</p>
                      </div>
                    </div>
                  )}
                  {customer.phone_business && (
                    <div className="flex items-center">
                      <FaPhone className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {customer.phone_business}
                        </p>
                        <p className="text-xs text-gray-500">Geschäftlich</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Adresse */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-900">
                      {customer.strasse && customer.plz && customer.stadt ? (
                        <>
                          {customer.strasse}
                          <br />
                          {customer.plz} {customer.stadt}
                          <br />
                          {customer.land}
                        </>
                      ) : (
                        "Keine Adresse angegeben"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Service */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Service</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(customer.status)}`}
                    >
                      {customer.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Support-Level</label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getSupportLevelColor(customer.support_level)}`}
                    >
                      {customer.support_level}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Account Manager
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {customer.account_manager_name
                        ? `${customer.account_manager_name} ${customer.account_manager_lastname}`
                        : "Nicht zugewiesen"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadaten */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Metadaten</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Erstellt</p>
                      <p className="text-sm text-gray-900">{formatDate(customer.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Zuletzt geändert</p>
                      <p className="text-sm text-gray-900">{formatDate(customer.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notizen */}
              {customer.notes && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notizen</h3>
                  <p className="text-sm text-gray-900">{customer.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Kontakthistorie</h3>
            {contacts.length > 0 ? (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{contact.subject}</h4>
                        <p className="text-sm text-gray-500">{contact.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{formatDate(contact.contact_date)}</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {contact.contact_method}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Keine Kontakte vorhanden</p>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dokumente</h3>
            {documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{doc.document_name}</h4>
                        <p className="text-sm text-gray-500">
                          {(doc.file_size_bytes / 1024).toFixed(1)} KB • {doc.mime_type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{formatDate(doc.uploaded_at)}</p>
                        {doc.is_confidential && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <FaShieldAlt className="mr-1 h-3 w-3" />
                            Vertraulich
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Keine Dokumente vorhanden</p>
            )}
          </div>
        )}

        {activeTab === "tags" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: tag.tag_color + "20",
                      color: tag.tag_color,
                    }}
                  >
                    {tag.tag_name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Keine Tags zugewiesen</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
