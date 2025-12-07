"use client";

/**
 * 👥 Portal Customer List
 * Wiederverwendbare Kunden-Tabelle mit Filter und Pagination
 * 
 * @phase 1.7
 * @author Agent-B (Shadow-Mode)
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface PortalCustomer {
  id: number;
  email: string;
  display_name: string | null;
  company_name: string | null;
  status: "active" | "inactive" | "suspended" | "deleted";
  email_verified: boolean;
  onboarding_completed: boolean;
  created_at: string;
  last_login: string | null;
  projects_count: number;
  invoices_count: number;
  tickets_count: number;
  total_revenue: number;
}

interface PortalCustomerListProps {
  initialLimit?: number;
  showFilters?: boolean;
  showPagination?: boolean;
  compact?: boolean;
  onCustomerSelect?: (customer: PortalCustomer) => void;
}

const statusConfig = {
  active: { label: "Aktiv", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  inactive: { label: "Inaktiv", class: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  suspended: { label: "Gesperrt", class: "bg-red-500/20 text-red-400 border-red-500/30" },
  deleted: { label: "Gelöscht", class: "bg-red-900/20 text-red-500 border-red-900/30" },
};

export function PortalCustomerList({
  initialLimit = 20,
  showFilters = true,
  showPagination = true,
  compact = false,
  onCustomerSelect,
}: PortalCustomerListProps) {
  const [customers, setCustomers] = useState<PortalCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter & Pagination State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = initialLimit;

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: ((page - 1) * limit).toString(),
        sortBy,
        sortOrder,
      });
      
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (verifiedFilter !== "all") params.append("verified", verifiedFilter);

      const response = await fetch(`/api/admin/customers/portal?${params}`);
      if (!response.ok) throw new Error("Fehler beim Laden der Kunden");
      
      const data = await response.json();
      setCustomers(data.data.customers);
      setTotalCount(data.data.pagination.total);
      setTotalPages(data.data.pagination.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter, verifiedFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchCustomers]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  if (error) {
    return (
      <div className="rounded-xl bg-red-900/20 border border-red-500/30 p-4 text-red-400">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-[#111217] border border-[#272a33]">
          {/* Suche */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Suchen nach Name, E-Mail, Firma..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] placeholder-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
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
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
            <option value="suspended">Gesperrt</option>
          </select>

          {/* Verified Filter */}
          <select
            value={verifiedFilter}
            onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">Alle Kunden</option>
            <option value="true">Verifiziert</option>
            <option value="false">Nicht verifiziert</option>
          </select>
        </div>
      )}

      {/* Tabelle */}
      <div className="overflow-hidden rounded-xl border border-[#272a33] bg-[#111217]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#272a33]">
            <thead className="bg-[#1a1d24]">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-[#8a8a8a] uppercase tracking-wider cursor-pointer hover:text-[#f4f4f4] transition-colors"
                  onClick={() => handleSort("display_name")}
                >
                  <div className="flex items-center gap-2">
                    Kunde
                    {sortBy === "display_name" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#8a8a8a] uppercase tracking-wider">
                  Status
                </th>
                {!compact && (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#8a8a8a] uppercase tracking-wider">
                      Projekte
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#8a8a8a] uppercase tracking-wider">
                      Tickets
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-[#8a8a8a] uppercase tracking-wider cursor-pointer hover:text-[#f4f4f4] transition-colors"
                      onClick={() => handleSort("total_revenue")}
                    >
                      <div className="flex items-center gap-2">
                        Umsatz
                        {sortBy === "total_revenue" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                  </>
                )}
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-[#8a8a8a] uppercase tracking-wider cursor-pointer hover:text-[#f4f4f4] transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center gap-2">
                    Registriert
                    {sortBy === "created_at" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-[#8a8a8a] uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#272a33]">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={compact ? 4 : 7} className="px-6 py-4">
                      <div className="h-10 bg-[#1a1d24] rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={compact ? 4 : 7} className="px-6 py-12 text-center text-[#6b6b6b]">
                    Keine Kunden gefunden
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-[#1a1d24] transition-colors cursor-pointer"
                    onClick={() => onCustomerSelect?.(customer)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {(customer.display_name || customer.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link 
                              href={`/admin/portal/customers/${customer.id}`}
                              className="text-[#f4f4f4] font-medium hover:text-blue-400 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {customer.display_name || customer.email}
                            </Link>
                            {customer.email_verified && (
                              <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="text-sm text-[#6b6b6b]">
                            {customer.company_name || customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${statusConfig[customer.status].class}`}>
                        {statusConfig[customer.status].label}
                      </span>
                    </td>
                    {!compact && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[#f4f4f4]">{customer.projects_count}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[#f4f4f4]">{customer.tickets_count}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-emerald-400 font-medium">{formatCurrency(customer.total_revenue)}</span>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-[#8a8a8a]">
                      {formatDate(customer.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/portal/customers/${customer.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#111217] border border-[#272a33]">
          <div className="text-sm text-[#6b6b6b]">
            {totalCount} Kunden gefunden
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
              Seite {page} von {totalPages}
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

export default PortalCustomerList;







