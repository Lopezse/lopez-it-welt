"use client";

/**
 * 👤 Portal Kunden - Detail
 * Admin-Seite für einzelnen Portal-Kunden
 * 
 * @phase 1.7
 * @author Agent-B (AI Center)
 * @route /admin/portal/customers/[id]
 */

import { PortalCustomerDetail } from "@/components/admin/portal/PortalCustomerDetail";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PortalCustomerDetailPage() {
  const params = useParams();
  const customerId = parseInt(params.id as string, 10);

  if (isNaN(customerId)) {
    return (
      <div className="min-h-screen bg-[#050509] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">⚠️ Ungültige Kunden-ID</p>
          <Link href="/admin/portal/customers" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
            ← Zurück zur Kundenliste
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
                href="/admin/portal/customers" 
                className="text-[#6b6b6b] hover:text-[#f4f4f4] transition-colors"
              >
                ← Kunden
              </Link>
              <span className="text-[#272a33]">/</span>
              <h1 className="text-2xl font-bold text-[#f4f4f4]">Kunden-Details</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/portal/stats"
                className="px-4 py-2 rounded-lg bg-[#1a1d24] border border-[#272a33] text-[#f4f4f4] hover:bg-[#22262e] transition-colors"
              >
                📊 Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PortalCustomerDetail customerId={customerId} />
      </main>
    </div>
  );
}







