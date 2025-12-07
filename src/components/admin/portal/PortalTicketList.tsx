"use client";

/**
 * 🎫 Portal Ticket List
 * Wiederverwendbare Ticket-Tabelle mit Filter und Zuweisung
 * 
 * @phase 1.7
 * @author Agent-B (AI Center)
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface PortalTicket {
  id: number;
  ticket_number: string;
  customer_id: number;
  customer_email: string;
  customer_name: string | null;
  subject: string;
  category: string;
  priority: "low" | "normal" | "high" | "critical";
  status: "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";
  assigned_to: number | null;
  assigned_name: string | null;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
  messages_count: number;
}

interface PortalTicketListProps {
  customerId?: number;
  initialLimit?: number;
  showFilters?: boolean;
  showPagination?: boolean;
  compact?: boolean;
}

const priorityConfig = {
  low: { label: "Niedrig", class: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  normal: { label: "Normal", class: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  high: { label: "Hoch", class: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  critical: { label: "Kritisch", class: "bg-red-500/20 text-red-400 border-red-500/30", pulse: true },
};

const statusConfig = {
  open: { label: "Offen", class: "bg-red-500/20 text-red-400 border-red-500/30" },
  in_progress: { label: "In Bearbeitung", class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  waiting_customer: { label: "Wartet auf Kunde", class: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  resolved: { label: "Gelöst", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  closed: { label: "Geschlossen", class: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
};

export function PortalTicketList({
  customerId,
  initialLimit = 20,
  showFilters = true,
  showPagination = true,
  compact = false,
}: PortalTicketListProps) {
  const [tickets, setTickets] = useState<PortalTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = initialLimit;

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: ((page - 1) * limit).toString(),
      });

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (search) params.append("search", search);

      const endpoint = customerId
        ? `/api/admin/customers/portal/${customerId}/tickets?${params}`
        : `/api/admin/portal-tickets?${params}`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Fehler beim Laden der Tickets");

      const data = await response.json();
      setTickets(data.data?.tickets || []);
      setTotalCount(data.data?.pagination?.total || 0);
      setTotalPages(data.data?.pagination?.pages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }, [customerId, page, limit, statusFilter, priorityFilter, search]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

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

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `vor ${diffMins} Min.`;
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    if (diffDays < 7) return `vor ${diffDays} Tagen`;
    return formatDate(date);
  };

  if (error) {
    return (
      <div className="rounded-xl bg-red-900/20 border border-red-500/30 p-4 text-red-400">
        ⚠️ {error}
      </div>
    );
  }

  // Quick Stats
  const openCount = tickets.filter(t => t.status === "open").length;
  const criticalCount = tickets.filter(t => t.priority === "critical").length;

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      {showFilters && !compact && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#111217] border border-[#272a33]">
            <p className="text-2xl font-bold text-[#f4f4f4]">{totalCount}</p>
            <p className="text-sm text-[#6b6b6b]">Gesamt</p>
          </div>
          <div className="p-4 rounded-xl bg-[#111217] border border-red-500/30">
            <p className="text-2xl font-bold text-red-400">{openCount}</p>
            <p className="text-sm text-[#6b6b6b]">Offen</p>
          </div>
          <div className="p-4 rounded-xl bg-[#111217] border border-orange-500/30">
            <p className="text-2xl font-bold text-orange-400">{criticalCount}</p>
            <p className="text-sm text-[#6b6b6b]">Kritisch</p>
          </div>
          <div className="p-4 rounded-xl bg-[#111217] border border-emerald-500/30">
            <p className="text-2xl font-bold text-emerald-400">
              {tickets.filter(t => t.status === "resolved").length}
            </p>
            <p className="text-sm text-[#6b6b6b]">Gelöst</p>
          </div>
        </div>
      )}

      {/* Filter */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-[#111217] border border-[#272a33]">
          {/* Suche */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Suchen nach Betreff, Ticket-Nr..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] placeholder-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6b6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">Alle Status</option>
            <option value="open">Offen</option>
            <option value="in_progress">In Bearbeitung</option>
            <option value="waiting_customer">Wartet auf Kunde</option>
            <option value="resolved">Gelöst</option>
            <option value="closed">Geschlossen</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">Alle Prioritäten</option>
            <option value="critical">🔴 Kritisch</option>
            <option value="high">🟠 Hoch</option>
            <option value="normal">🔵 Normal</option>
            <option value="low">⚪ Niedrig</option>
          </select>
        </div>
      )}

      {/* Ticket-Liste */}
      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-[#111217] border border-[#272a33] animate-pulse" />
          ))
        ) : tickets.length === 0 ? (
          <div className="rounded-xl bg-[#111217] border border-[#272a33] p-12 text-center">
            <p className="text-[#6b6b6b]">Keine Tickets gefunden</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/admin/portal/tickets/${ticket.id}`}
              className={`block rounded-xl border bg-[#111217] p-4 transition-all hover:border-blue-500/50 hover:shadow-lg ${
                ticket.priority === "critical" ? "border-red-500/50" : "border-[#272a33]"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono text-[#6b6b6b]">{ticket.ticket_number}</span>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${priorityConfig[ticket.priority].class}`}>
                      {priorityConfig[ticket.priority].label}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${statusConfig[ticket.status].class}`}>
                      {statusConfig[ticket.status].label}
                    </span>
                  </div>
                  <h3 className="font-medium text-[#f4f4f4] truncate">{ticket.subject}</h3>
                  {!compact && (
                    <div className="flex items-center gap-4 mt-2 text-sm text-[#6b6b6b]">
                      <span>{ticket.customer_name || ticket.customer_email}</span>
                      <span>•</span>
                      <span>{ticket.messages_count} Nachrichten</span>
                      <span>•</span>
                      <span>{getTimeAgo(ticket.created_at)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {ticket.assigned_name ? (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium">
                        {ticket.assigned_name[0]}
                      </div>
                      <span className="text-sm text-[#8a8a8a]">{ticket.assigned_name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-[#6b6b6b]">Nicht zugewiesen</span>
                  )}
                  <svg className="h-5 w-5 text-[#6b6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#111217] border border-[#272a33]">
          <div className="text-sm text-[#6b6b6b]">
            {totalCount} Tickets
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#22262e] transition-colors"
            >
              ←
            </button>
            <span className="px-4 py-1.5 text-[#8a8a8a]">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#22262e] transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortalTicketList;







