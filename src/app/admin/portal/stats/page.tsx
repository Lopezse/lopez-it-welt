"use client";

/**
 * 📊 Portal Dashboard
 * Admin-Dashboard für Portal-Statistiken
 * 
 * @phase 1.7
 * @author Agent-B (AI Center)
 * @route /admin/portal/stats
 */

import { PortalStatsCards } from "@/components/admin/portal/PortalStatsCards";
import { PortalCustomerList } from "@/components/admin/portal/PortalCustomerList";
import { PortalTicketList } from "@/components/admin/portal/PortalTicketList";
import Link from "next/link";

export default function PortalStatsPage() {
  return (
    <div className="min-h-screen bg-[#050509]">
      {/* Header */}
      <header className="bg-[#111217] border-b border-[#272a33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-[#f4f4f4]">Portal Dashboard</h1>
              <p className="mt-1 text-[#8a8a8a]">
                Übersicht über das Kunden-Portal
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/portal/customers"
                className="px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] hover:bg-[#22262e] transition-colors"
              >
                👥 Kunden
              </Link>
              <Link
                href="/admin/portal/tickets"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                🎫 Tickets
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-[#111217] border-b border-[#272a33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <Link
              href="/admin/portal/stats"
              className="px-4 py-3 text-sm font-medium text-blue-400 border-b-2 border-blue-400"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/portal/customers"
              className="px-4 py-3 text-sm font-medium text-[#8a8a8a] hover:text-[#f4f4f4] transition-colors border-b-2 border-transparent"
            >
              Kunden
            </Link>
            <Link
              href="/admin/portal/tickets"
              className="px-4 py-3 text-sm font-medium text-[#8a8a8a] hover:text-[#f4f4f4] transition-colors border-b-2 border-transparent"
            >
              Tickets
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <section>
          <PortalStatsCards />
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Customers */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-[#f4f4f4]">Neueste Kunden</h2>
              <Link 
                href="/admin/portal/customers" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Alle anzeigen →
              </Link>
            </div>
            <PortalCustomerList 
              initialLimit={5}
              showFilters={false}
              showPagination={false}
              compact={true}
            />
          </section>

          {/* Open Tickets */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-[#f4f4f4]">Offene Tickets</h2>
              <Link 
                href="/admin/portal/tickets" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Alle anzeigen →
              </Link>
            </div>
            <PortalTicketList 
              initialLimit={5}
              showFilters={false}
              showPagination={false}
              compact={true}
            />
          </section>
        </div>

        {/* Quick Actions */}
        <section className="rounded-xl border border-[#272a33] bg-[#111217] p-6">
          <h2 className="text-lg font-medium text-[#f4f4f4] mb-4">Schnellaktionen</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/portal/customers"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#1a1d24] border border-[#272a33] hover:border-blue-500/50 transition-colors"
            >
              <span className="text-2xl mb-2">👥</span>
              <span className="text-sm text-[#f4f4f4]">Kunden verwalten</span>
            </Link>
            <Link
              href="/admin/portal/tickets"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#1a1d24] border border-[#272a33] hover:border-blue-500/50 transition-colors"
            >
              <span className="text-2xl mb-2">🎫</span>
              <span className="text-sm text-[#f4f4f4]">Tickets bearbeiten</span>
            </Link>
            <Link
              href="/admin/office/invoices"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#1a1d24] border border-[#272a33] hover:border-blue-500/50 transition-colors"
            >
              <span className="text-2xl mb-2">📄</span>
              <span className="text-sm text-[#f4f4f4]">Rechnungen</span>
            </Link>
            <Link
              href="/admin/office/projects"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#1a1d24] border border-[#272a33] hover:border-blue-500/50 transition-colors"
            >
              <span className="text-2xl mb-2">📋</span>
              <span className="text-sm text-[#f4f4f4]">Projekte</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}







