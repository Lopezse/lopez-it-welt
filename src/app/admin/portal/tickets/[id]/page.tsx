"use client";

/**
 * 🎫 Portal Ticket - Detail
 * Admin-Seite für einzelnes Portal-Ticket
 * 
 * @phase 1.7
 * @author Agent-B (AI Center)
 * @route /admin/portal/tickets/[id]
 */

import { useEffect, useState } from "react";
import { PortalTicketChat } from "@/components/admin/portal/PortalTicketChat";
import Link from "next/link";
import { useParams } from "next/navigation";

interface TicketDetail {
  id: number;
  ticket_number: string;
  customer_id: number;
  customer_email: string;
  customer_name: string | null;
  subject: string;
  description: string;
  category: string;
  priority: "low" | "normal" | "high" | "critical";
  status: "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";
  assigned_to: number | null;
  assigned_name: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  status_history: Array<{
    status: string;
    changed_at: string;
    changed_by: string;
  }>;
}

const priorityConfig = {
  low: { label: "Niedrig", class: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  normal: { label: "Normal", class: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  high: { label: "Hoch", class: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  critical: { label: "Kritisch", class: "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" },
};

const statusConfig = {
  open: { label: "Offen", class: "bg-red-500/20 text-red-400 border-red-500/30" },
  in_progress: { label: "In Bearbeitung", class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  waiting_customer: { label: "Wartet auf Kunde", class: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  resolved: { label: "Gelöst", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  closed: { label: "Geschlossen", class: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
};

export default function PortalTicketDetailPage() {
  const params = useParams();
  const ticketId = parseInt(params.id as string, 10);
  
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const response = await fetch(`/api/admin/portal-tickets/${ticketId}`);
        if (!response.ok) throw new Error("Ticket nicht gefunden");
        const data = await response.json();
        setTicket(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    
    if (!isNaN(ticketId)) {
      fetchTicket();
    }
  }, [ticketId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;
    try {
      const response = await fetch(`/api/admin/portal-tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const data = await response.json();
        setTicket(data.data);
      }
    } catch (err) {
      console.error("Fehler beim Status-Update:", err);
    }
  };

  const handleAssign = async () => {
    if (!ticket) return;
    try {
      const response = await fetch(`/api/admin/portal-tickets/${ticketId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: 1 }), // TODO: Aktuellen Admin verwenden
      });
      if (response.ok) {
        const data = await response.json();
        setTicket(prev => prev ? { ...prev, assigned_to: data.data.assigned_to, assigned_name: data.data.assigned_name } : null);
      }
    } catch (err) {
      console.error("Fehler beim Zuweisen:", err);
    }
  };

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

  if (isNaN(ticketId)) {
    return (
      <div className="min-h-screen bg-[#050509] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">⚠️ Ungültige Ticket-ID</p>
          <Link href="/admin/portal/tickets" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
            ← Zurück zur Ticket-Liste
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050509] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-[#8a8a8a]">Lade Ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-[#050509] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">⚠️ {error || "Ticket nicht gefunden"}</p>
          <Link href="/admin/portal/tickets" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
            ← Zurück zur Ticket-Liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050509]">
      {/* Header */}
      <header className="bg-[#111217] border-b border-[#272a33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <Link 
                href="/admin/portal/tickets" 
                className="text-[#6b6b6b] hover:text-[#f4f4f4] transition-colors"
              >
                ← Tickets
              </Link>
              <span className="text-[#272a33]">/</span>
              <h1 className="text-2xl font-bold text-[#f4f4f4]">{ticket.ticket_number}</h1>
              <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${priorityConfig[ticket.priority].class}`}>
                {priorityConfig[ticket.priority].label}
              </span>
              <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${statusConfig[ticket.status].class}`}>
                {statusConfig[ticket.status].label}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ticket Info & Chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject & Description */}
            <div className="rounded-xl border border-[#272a33] bg-[#111217] p-6">
              <h2 className="text-xl font-medium text-[#f4f4f4] mb-4">{ticket.subject}</h2>
              <p className="text-[#8a8a8a] whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {/* Chat */}
            <PortalTicketChat 
              ticketId={ticketId} 
              ticketStatus={ticket.status}
              onStatusChange={(newStatus) => setTicket(prev => prev ? { ...prev, status: newStatus as TicketDetail['status'] } : null)}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-xl border border-[#272a33] bg-[#111217] p-6">
              <h3 className="text-sm font-medium text-[#8a8a8a] uppercase tracking-wider mb-4">Aktionen</h3>
              <div className="space-y-3">
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="open">🔴 Offen</option>
                  <option value="in_progress">🟡 In Bearbeitung</option>
                  <option value="waiting_customer">🔵 Wartet auf Kunde</option>
                  <option value="resolved">🟢 Gelöst</option>
                  <option value="closed">⚪ Geschlossen</option>
                </select>
                
                {!ticket.assigned_to ? (
                  <button
                    onClick={handleAssign}
                    className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    🙋 Mir zuweisen
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33]">
                    <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium">
                      {ticket.assigned_name?.[0] || "?"}
                    </div>
                    <span className="text-[#f4f4f4]">{ticket.assigned_name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Details */}
            <div className="rounded-xl border border-[#272a33] bg-[#111217] p-6">
              <h3 className="text-sm font-medium text-[#8a8a8a] uppercase tracking-wider mb-4">Details</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-[#6b6b6b]">Kategorie</dt>
                  <dd className="text-[#f4f4f4]">{ticket.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6b6b6b]">Erstellt</dt>
                  <dd className="text-[#f4f4f4]">{formatDate(ticket.created_at)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6b6b6b]">Aktualisiert</dt>
                  <dd className="text-[#f4f4f4]">{formatDate(ticket.updated_at)}</dd>
                </div>
                {ticket.resolved_at && (
                  <div className="flex justify-between">
                    <dt className="text-[#6b6b6b]">Gelöst</dt>
                    <dd className="text-emerald-400">{formatDate(ticket.resolved_at)}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Customer Info */}
            <div className="rounded-xl border border-[#272a33] bg-[#111217] p-6">
              <h3 className="text-sm font-medium text-[#8a8a8a] uppercase tracking-wider mb-4">Kunde</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {(ticket.customer_name || ticket.customer_email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-[#f4f4f4]">{ticket.customer_name || "Unbekannt"}</p>
                  <p className="text-sm text-[#6b6b6b]">{ticket.customer_email}</p>
                </div>
              </div>
              <Link
                href={`/admin/portal/customers/${ticket.customer_id}`}
                className="block w-full text-center px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-blue-400 hover:bg-[#22262e] transition-colors"
              >
                Kunden-Profil öffnen →
              </Link>
            </div>

            {/* Status History */}
            {ticket.status_history && ticket.status_history.length > 0 && (
              <div className="rounded-xl border border-[#272a33] bg-[#111217] p-6">
                <h3 className="text-sm font-medium text-[#8a8a8a] uppercase tracking-wider mb-4">Verlauf</h3>
                <div className="space-y-3">
                  {ticket.status_history.map((entry, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#272a33] mt-2" />
                      <div>
                        <p className="text-sm text-[#f4f4f4]">
                          Status: <span className="font-medium">{entry.status}</span>
                        </p>
                        <p className="text-xs text-[#6b6b6b]">
                          {formatDate(entry.changed_at)} • {entry.changed_by}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}







