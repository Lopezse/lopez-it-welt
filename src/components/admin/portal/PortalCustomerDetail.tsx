"use client";

/**
 * 👤 Portal Customer Detail
 * Kunden-Detail-Ansicht mit Tabs für Projekte, Rechnungen, Tickets
 * 
 * @phase 1.7
 * @author Agent-B (AI Center)
 */

import { useEffect, useState } from "react";
import Link from "next/link";

interface CustomerDetail {
  id: number;
  email: string;
  display_name: string | null;
  company_name: string | null;
  phone: string | null;
  address_street: string | null;
  address_city: string | null;
  address_zip: string | null;
  address_country: string | null;
  status: "active" | "inactive" | "suspended" | "deleted";
  email_verified: boolean;
  onboarding_completed: boolean;
  created_at: string;
  last_login: string | null;
  notes: string | null;
  projects_count: number;
  invoices_count: number;
  tickets_count: number;
  total_revenue: number;
  recent_sessions: Array<{
    id: number;
    ip_address: string;
    user_agent: string;
    created_at: string;
  }>;
  ai_usage: {
    total_requests: number;
    last_request: string | null;
  };
}

interface Project {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

interface Invoice {
  id: number;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string;
  created_at: string;
}

interface Ticket {
  id: number;
  ticket_number: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
}

type TabType = "overview" | "projects" | "invoices" | "tickets" | "sessions";

const statusConfig = {
  active: { label: "Aktiv", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  inactive: { label: "Inaktiv", class: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  suspended: { label: "Gesperrt", class: "bg-red-500/20 text-red-400 border-red-500/30" },
  deleted: { label: "Gelöscht", class: "bg-red-900/20 text-red-500 border-red-900/30" },
};

interface PortalCustomerDetailProps {
  customerId: number;
}

export function PortalCustomerDetail({ customerId }: PortalCustomerDetailProps) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const response = await fetch(`/api/admin/customers/portal/${customerId}`);
        if (!response.ok) throw new Error("Kunde nicht gefunden");
        const data = await response.json();
        setCustomer(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [customerId]);

  useEffect(() => {
    if (!customer) return;
    
    async function fetchRelatedData() {
      try {
        const [projectsRes, invoicesRes, ticketsRes] = await Promise.all([
          fetch(`/api/admin/customers/portal/${customerId}/projects`),
          fetch(`/api/admin/customers/portal/${customerId}/invoices`),
          fetch(`/api/admin/customers/portal/${customerId}/tickets`),
        ]);
        
        if (projectsRes.ok) {
          const data = await projectsRes.json();
          setProjects(data.data?.projects || []);
        }
        if (invoicesRes.ok) {
          const data = await invoicesRes.json();
          setInvoices(data.data?.invoices || []);
        }
        if (ticketsRes.ok) {
          const data = await ticketsRes.json();
          setTickets(data.data?.tickets || []);
        }
      } catch (err) {
        console.error("Fehler beim Laden der Daten:", err);
      }
    }
    fetchRelatedData();
  }, [customer, customerId]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!customer) return;
    try {
      const response = await fetch(`/api/admin/customers/portal/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const data = await response.json();
        setCustomer(data.data);
      }
    } catch (err) {
      console.error("Fehler beim Status-Update:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 rounded-xl bg-[#111217] border border-[#272a33] animate-pulse" />
        <div className="h-96 rounded-xl bg-[#111217] border border-[#272a33] animate-pulse" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="rounded-xl bg-red-900/20 border border-red-500/30 p-6 text-center">
        <p className="text-red-400 text-lg">⚠️ {error || "Kunde nicht gefunden"}</p>
        <Link href="/admin/portal/customers" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
          ← Zurück zur Kundenliste
        </Link>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "overview", label: "Übersicht" },
    { id: "projects", label: "Projekte", count: customer.projects_count },
    { id: "invoices", label: "Rechnungen", count: customer.invoices_count },
    { id: "tickets", label: "Tickets", count: customer.tickets_count },
    { id: "sessions", label: "Sessions", count: customer.recent_sessions?.length || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-xl border border-[#272a33] bg-[#111217] p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Kunden-Info */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {(customer.display_name || customer.email)[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#f4f4f4]">
                  {customer.display_name || customer.email}
                </h1>
                {customer.email_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verifiziert
                  </span>
                )}
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${statusConfig[customer.status].class}`}>
                  {statusConfig[customer.status].label}
                </span>
              </div>
              {customer.company_name && (
                <p className="mt-1 text-[#8a8a8a]">{customer.company_name}</p>
              )}
              <p className="mt-1 text-sm text-[#6b6b6b]">{customer.email}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="text-center px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33]">
              <p className="text-2xl font-bold text-emerald-400">{formatCurrency(customer.total_revenue)}</p>
              <p className="text-xs text-[#6b6b6b]">Gesamtumsatz</p>
            </div>
            <div className="text-center px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33]">
              <p className="text-2xl font-bold text-blue-400">{customer.projects_count}</p>
              <p className="text-xs text-[#6b6b6b]">Projekte</p>
            </div>
            <div className="text-center px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33]">
              <p className="text-2xl font-bold text-purple-400">{customer.ai_usage?.total_requests || 0}</p>
              <p className="text-xs text-[#6b6b6b]">AI-Anfragen</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3 pt-6 border-t border-[#272a33]">
          <select
            value={customer.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="active">✅ Aktiv</option>
            <option value="inactive">⏸️ Inaktiv</option>
            <option value="suspended">🚫 Gesperrt</option>
          </select>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            📧 E-Mail senden
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] hover:bg-[#22262e] transition-colors">
            📝 Notiz hinzufügen
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#272a33]">
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-blue-400"
                  : "text-[#8a8a8a] hover:text-[#f4f4f4]"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#272a33] text-xs">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-[#272a33] bg-[#111217] p-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kontaktdaten */}
            <div>
              <h3 className="text-lg font-medium text-[#f4f4f4] mb-4">Kontaktdaten</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-[#6b6b6b]">E-Mail</dt>
                  <dd className="text-[#f4f4f4]">{customer.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6b6b6b]">Telefon</dt>
                  <dd className="text-[#f4f4f4]">{customer.phone || "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6b6b6b]">Adresse</dt>
                  <dd className="text-[#f4f4f4] text-right">
                    {customer.address_street && (
                      <>
                        {customer.address_street}<br />
                        {customer.address_zip} {customer.address_city}<br />
                        {customer.address_country}
                      </>
                    ) || "-"}
                  </dd>
                </div>
              </dl>
            </div>
            
            {/* Account-Info */}
            <div>
              <h3 className="text-lg font-medium text-[#f4f4f4] mb-4">Account</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-[#6b6b6b]">Registriert</dt>
                  <dd className="text-[#f4f4f4]">{formatDate(customer.created_at)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6b6b6b]">Letzter Login</dt>
                  <dd className="text-[#f4f4f4]">{formatDate(customer.last_login)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6b6b6b]">Onboarding</dt>
                  <dd className={customer.onboarding_completed ? "text-emerald-400" : "text-orange-400"}>
                    {customer.onboarding_completed ? "✅ Abgeschlossen" : "⏳ Ausstehend"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Notizen */}
            {customer.notes && (
              <div className="lg:col-span-2">
                <h3 className="text-lg font-medium text-[#f4f4f4] mb-4">Notizen</h3>
                <p className="text-[#8a8a8a] whitespace-pre-wrap">{customer.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-center text-[#6b6b6b] py-8">Keine Projekte vorhanden</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 rounded-lg bg-[#1a1d24] border border-[#272a33]">
                  <div>
                    <p className="font-medium text-[#f4f4f4]">{project.name}</p>
                    <p className="text-sm text-[#6b6b6b]">{formatDate(project.created_at)}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                    {project.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "invoices" && (
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <p className="text-center text-[#6b6b6b] py-8">Keine Rechnungen vorhanden</p>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg bg-[#1a1d24] border border-[#272a33]">
                  <div>
                    <p className="font-medium text-[#f4f4f4]">{invoice.invoice_number}</p>
                    <p className="text-sm text-[#6b6b6b]">Fällig: {formatDate(invoice.due_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-emerald-400">{formatCurrency(invoice.amount)}</p>
                    <span className={`text-xs ${invoice.status === 'paid' ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <p className="text-center text-[#6b6b6b] py-8">Keine Tickets vorhanden</p>
            ) : (
              tickets.map((ticket) => (
                <Link 
                  key={ticket.id} 
                  href={`/admin/portal/tickets/${ticket.id}`}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#1a1d24] border border-[#272a33] hover:border-blue-500/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-[#f4f4f4]">{ticket.subject}</p>
                    <p className="text-sm text-[#6b6b6b]">{ticket.ticket_number} • {formatDate(ticket.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      ticket.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                      ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {ticket.priority}
                    </span>
                    <span className="text-[#8a8a8a]">→</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="space-y-4">
            {(!customer.recent_sessions || customer.recent_sessions.length === 0) ? (
              <p className="text-center text-[#6b6b6b] py-8">Keine Sessions vorhanden</p>
            ) : (
              customer.recent_sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-[#1a1d24] border border-[#272a33]">
                  <div>
                    <p className="font-medium text-[#f4f4f4]">{session.ip_address}</p>
                    <p className="text-sm text-[#6b6b6b] truncate max-w-md">{session.user_agent}</p>
                  </div>
                  <p className="text-sm text-[#8a8a8a]">{formatDate(session.created_at)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PortalCustomerDetail;







