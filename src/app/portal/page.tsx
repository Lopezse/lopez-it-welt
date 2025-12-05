// =====================================================
// KUNDEN-PORTAL DASHBOARD
// =====================================================
// /portal
// Hauptseite für eingeloggte Kunden
// =====================================================

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FaProjectDiagram, FaBrain, FaFileInvoice, FaHeadset,
  FaArrowRight, FaSpinner, FaCheckCircle, FaClock, FaExclamationCircle
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

interface DashboardStats {
  projects: { total: number; active: number };
  invoices: { total: number; unpaid: number; total_amount: number };
  tickets: { total: number; open: number };
  ai_usage: { this_month: number; tokens_used: number };
}

interface CustomerData {
  first_name?: string;
  last_name?: string;
  company_name?: string;
  email: string;
  service_interests?: string[];
}

// =====================================================
// COMPONENT
// =====================================================

export default function PortalDashboard() {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Kundendaten laden
      const meResponse = await fetch("/api/auth/me");
      const meData = await meResponse.json();
      
      if (meData.success) {
        setCustomer(meData.data);
      }

      // Stats von echter API laden
      const statsResponse = await fetch("/api/portal/stats");
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      } else {
        // Fallback: leere Stats
        setStats({
          projects: { total: 0, active: 0 },
          invoices: { total: 0, unpaid: 0, total_amount: 0 },
          tickets: { total: 0, open: 0 },
          ai_usage: { this_month: 0, tokens_used: 0 }
        });
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="text-3xl text-blue-400 animate-spin" />
      </div>
    );
  }

  // Service-Namen mapping
  const serviceNames: Record<string, string> = {
    website: "Website & Shop",
    ai_center: "AI Center",
    it_service: "IT-Service",
    consulting: "Consulting"
  };

  return (
    <div className="space-y-8">
      
      {/* Begrüßung */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/30">
        <h1 className="text-2xl font-bold text-white mb-2">
          Willkommen zurück, {customer?.first_name || "Kunde"}!
        </h1>
        <p className="text-slate-300">
          {customer?.company_name ? (
            <>Verwalten Sie die Services für <span className="text-blue-400 font-medium">{customer.company_name}</span></>
          ) : (
            <>Hier ist Ihr persönliches Lopez IT Welt Dashboard</>
          )}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Projekte */}
        <Link href="/portal/projekte" 
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5 
                       hover:border-blue-500/50 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FaProjectDiagram className="text-blue-400" />
            </div>
            <FaArrowRight className="text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <h3 className="text-slate-400 text-sm">Projekte</h3>
          <p className="text-2xl font-bold text-white">{stats?.projects.total || 0}</p>
          <p className="text-xs text-slate-500 mt-1">
            {stats?.projects.active || 0} aktiv
          </p>
        </Link>

        {/* AI Services */}
        <Link href="/portal/ai" 
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5 
                       hover:border-purple-500/50 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <FaBrain className="text-purple-400" />
            </div>
            <FaArrowRight className="text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
          <h3 className="text-slate-400 text-sm">AI Usage</h3>
          <p className="text-2xl font-bold text-white">{stats?.ai_usage.this_month || 0}</p>
          <p className="text-xs text-slate-500 mt-1">
            Anfragen diesen Monat
          </p>
        </Link>

        {/* Rechnungen */}
        <Link href="/portal/rechnungen" 
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5 
                       hover:border-green-500/50 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <FaFileInvoice className="text-green-400" />
            </div>
            <FaArrowRight className="text-slate-500 group-hover:text-green-400 transition-colors" />
          </div>
          <h3 className="text-slate-400 text-sm">Rechnungen</h3>
          <p className="text-2xl font-bold text-white">{stats?.invoices.total || 0}</p>
          <p className="text-xs text-slate-500 mt-1">
            {stats?.invoices.unpaid || 0} offen
          </p>
        </Link>

        {/* Support */}
        <Link href="/portal/support" 
              className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5 
                       hover:border-amber-500/50 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <FaHeadset className="text-amber-400" />
            </div>
            <FaArrowRight className="text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>
          <h3 className="text-slate-400 text-sm">Support-Tickets</h3>
          <p className="text-2xl font-bold text-white">{stats?.tickets.total || 0}</p>
          <p className="text-xs text-slate-500 mt-1">
            {stats?.tickets.open || 0} offen
          </p>
        </Link>
      </div>

      {/* Service-Interessen */}
      {customer?.service_interests && customer.service_interests.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Ihre Service-Bereiche</h2>
          <div className="flex flex-wrap gap-3">
            {customer.service_interests.map((service) => (
              <span 
                key={service}
                className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300"
              >
                {serviceNames[service] || service}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <FaCheckCircle className="text-green-400" />
            <h3 className="font-medium text-white">Schnellstart</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Erstellen Sie Ihr erstes Projekt und nutzen Sie unsere AI-Services.
          </p>
          <Link 
            href="/portal/projekte/neu"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            Projekt erstellen <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <FaClock className="text-amber-400" />
            <h3 className="font-medium text-white">Letzte Aktivität</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Noch keine Aktivitäten vorhanden. Starten Sie jetzt!
          </p>
          <Link 
            href="/portal/ai"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            AI Services erkunden <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <FaExclamationCircle className="text-blue-400" />
            <h3 className="font-medium text-white">Hilfe benötigt?</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Unser Support-Team steht Ihnen zur Verfügung.
          </p>
          <Link 
            href="/portal/support/neu"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            Ticket erstellen <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
}

