"use client";

import { Button } from "@/components/Features/Button";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";

interface Ticket {
  id: string;
  customer_id: string;
  customer_email: string;
  subject: string;
  description: string;
  type: "order" | "payment" | "shipping" | "technical" | "general";
  priority: "critical" | "high" | "normal" | "low";
  status: "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";
  order_id?: string;
  created_at: string;
  updated_at: string;
  admin_notes?: string;
  customer_notes?: string[];
}

const priorityColors = {
  critical: "bg-red-100 text-red-800 border-red-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  normal: "bg-blue-100 text-blue-800 border-blue-200",
  low: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusColors = {
  open: "bg-red-100 text-red-800 border-red-200",
  in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
  waiting_customer: "bg-blue-100 text-blue-800 border-blue-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusLabels = {
  open: "Offen",
  in_progress: "In Bearbeitung",
  waiting_customer: "Wartend auf Kunde",
  resolved: "Gelöst",
  closed: "Geschlossen",
};

const priorityLabels = {
  critical: "Kritisch",
  high: "Hoch",
  normal: "Normal",
  low: "Niedrig",
};

const typeLabels = {
  order: "Bestellung",
  payment: "Zahlung",
  shipping: "Versand",
  technical: "Technisch",
  general: "Allgemein",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState({
    status: "all",
    priority: "all",
    type: "all",
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/admin/tickets");
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: Ticket["status"]) => {
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTickets(
          tickets.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  status: newStatus,
                  updated_at: new Date().toISOString(),
                }
              : ticket,
          ),
        );
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Ticket-Status:", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter.status !== "all" && ticket.status !== filter.status) return false;
    if (filter.priority !== "all" && ticket.priority !== filter.priority) return false;
    if (filter.type !== "all" && ticket.type !== filter.type) return false;
    return true;
  });

  const getTicketStats = () => {
    const stats = {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      in_progress: tickets.filter((t) => t.status === "in_progress").length,
      critical: tickets.filter((t) => t.priority === "critical").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
    };
    return stats;
  };

  const stats = getTicketStats();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">🎫 Ticket-Verwaltung</h1>
        <p className="text-gray-600">Verwalten Sie Support-Tickets von Kunden</p>
      </div>

      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Gesamt</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.open}</div>
          <div className="text-sm text-gray-600">Offen</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.in_progress}</div>
          <div className="text-sm text-gray-600">In Bearbeitung</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-sm text-gray-600">Kritisch</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-gray-600">Gelöst</div>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle Status</option>
              <option value="open">Offen</option>
              <option value="in_progress">In Bearbeitung</option>
              <option value="waiting_customer">Wartend auf Kunde</option>
              <option value="resolved">Gelöst</option>
              <option value="closed">Geschlossen</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priorität</label>
            <select
              value={filter.priority}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle Prioritäten</option>
              <option value="critical">Kritisch</option>
              <option value="high">Hoch</option>
              <option value="normal">Normal</option>
              <option value="low">Niedrig</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Typ</label>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle Typen</option>
              <option value="order">Bestellung</option>
              <option value="payment">Zahlung</option>
              <option value="shipping">Versand</option>
              <option value="technical">Technisch</option>
              <option value="general">Allgemein</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Ticket-Liste */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-500">Keine Tickets gefunden</p>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">#{ticket.id}</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[ticket.priority]}`}
                    >
                      {priorityLabels[ticket.priority]}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[ticket.status]}`}
                    >
                      {statusLabels[ticket.status]}
                    </span>
                    <span className="text-xs text-gray-500">{typeLabels[ticket.type]}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Kunde: {ticket.customer_email}</span>
                    <span>Erstellt: {new Date(ticket.created_at).toLocaleDateString("de-DE")}</span>
                    {ticket.order_id && <span>Bestellung: #{ticket.order_id}</span>}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button
                    onClick={() => setSelectedTicket(ticket)}
                    variante="umriss"
                    groesse="klein"
                  >
                    Details
                  </Button>
                  {ticket.status === "open" && (
                    <Button
                      onClick={() => updateTicketStatus(ticket.id, "in_progress")}
                      groesse="klein"
                    >
                      Bearbeiten
                    </Button>
                  )}
                  {ticket.status === "in_progress" && (
                    <Button
                      onClick={() => updateTicketStatus(ticket.id, "resolved")}
                      variante="umriss"
                      groesse="klein"
                    >
                      Lösen
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Ticket-Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ticket #{selectedTicket.id}</h2>
              <Button onClick={() => setSelectedTicket(null)} variante="umriss" groesse="klein">
                Schließen
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Betreff</h3>
                <p className="text-gray-600">{selectedTicket.subject}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Beschreibung</h3>
                <p className="text-gray-600">{selectedTicket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">Kunde</h3>
                  <p className="text-gray-600">{selectedTicket.customer_email}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Typ</h3>
                  <p className="text-gray-600">{typeLabels[selectedTicket.type]}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Priorität</h3>
                  <p className="text-gray-600">{priorityLabels[selectedTicket.priority]}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Status</h3>
                  <p className="text-gray-600">{statusLabels[selectedTicket.status]}</p>
                </div>
              </div>

              {selectedTicket.order_id && (
                <div>
                  <h3 className="font-medium text-gray-900">Bestellung</h3>
                  <p className="text-gray-600">#{selectedTicket.order_id}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    updateTicketStatus(selectedTicket.id, "in_progress");
                    setSelectedTicket(null);
                  }}
                  disabled={selectedTicket.status !== "open"}
                >
                  Bearbeiten starten
                </Button>
                <Button
                  onClick={() => {
                    updateTicketStatus(selectedTicket.id, "resolved");
                    setSelectedTicket(null);
                  }}
                  disabled={selectedTicket.status !== "in_progress"}
                  variante="umriss"
                >
                  Als gelöst markieren
                </Button>
                <Button
                  onClick={() => {
                    updateTicketStatus(selectedTicket.id, "closed");
                    setSelectedTicket(null);
                  }}
                  variante="umriss"
                >
                  Schließen
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
