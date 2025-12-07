"use client";

/**
 * 👥 Portal Kunden - Übersicht
 * Admin-Seite für Portal-Kunden-Verwaltung
 * 
 * @phase 1.7
 * @author Agent-B (AI Center)
 * @route /admin/portal/customers
 */

import { PortalCustomerList } from "@/components/admin/portal/PortalCustomerList";
import Link from "next/link";

export default function PortalCustomersPage() {
  return (
    <div className="min-h-screen bg-[#050509]">
      {/* Header */}
      <header className="bg-[#111217] border-b border-[#272a33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center gap-3">
                <Link 
                  href="/admin/portal/stats" 
                  className="text-[#6b6b6b] hover:text-[#f4f4f4] transition-colors"
                >
                  ← Portal
                </Link>
                <span className="text-[#272a33]">/</span>
                <h1 className="text-2xl font-bold text-[#f4f4f4]">Portal-Kunden</h1>
              </div>
              <p className="mt-1 text-[#8a8a8a]">
                Kunden aus dem Self-Service-Portal verwalten
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/portal/stats"
                className="px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] hover:bg-[#22262e] transition-colors"
              >
                📊 Dashboard
              </Link>
              <Link
                href="/admin/portal/tickets"
                className="px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] hover:bg-[#22262e] transition-colors"
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
              className="px-4 py-3 text-sm font-medium text-[#8a8a8a] hover:text-[#f4f4f4] transition-colors border-b-2 border-transparent"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/portal/customers"
              className="px-4 py-3 text-sm font-medium text-blue-400 border-b-2 border-blue-400"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PortalCustomerList 
          initialLimit={20}
          showFilters={true}
          showPagination={true}
        />
      </main>
    </div>
  );
}







