"use client";

/**
 * 📊 Portal Stats Cards
 * Dashboard-Statistik-Karten für das Admin-Portal
 * 
 * @phase 1.7
 * @author Agent-B (Shadow-Mode)
 */

import { useEffect, useState } from "react";

interface PortalStats {
  customers: {
    total: number;
    active: number;
    new_this_month: number;
    verified: number;
  };
  invoices: {
    total: number;
    pending: number;
    overdue: number;
    paid_this_month: number;
    total_revenue: number;
    revenue_this_month: number;
  };
  tickets: {
    total: number;
    open: number;
    in_progress: number;
    critical: number;
    avg_resolution_hours: number;
  };
  projects: {
    total: number;
    active: number;
    completed_this_month: number;
  };
  ai_usage: {
    total_requests: number;
    requests_this_month: number;
    avg_per_customer: number;
  };
  trends: {
    registrations_7d: number[];
    revenue_7d: number[];
  };
}

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "green" | "orange" | "red" | "purple" | "cyan";
}

const colorClasses = {
  blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  green: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
  orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  red: "from-red-500/20 to-red-600/10 border-red-500/30",
  purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
};

const iconColorClasses = {
  blue: "text-blue-400",
  green: "text-emerald-400",
  orange: "text-orange-400",
  red: "text-red-400",
  purple: "text-purple-400",
  cyan: "text-cyan-400",
};

function StatsCard({ title, value, subtitle, icon, trend, trendValue, color = "blue" }: StatsCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorClasses[color]} p-5 transition-all hover:scale-[1.02] hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#8a8a8a]">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[#f4f4f4]">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-[#6b6b6b]">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`mt-2 flex items-center gap-1 text-sm ${
              trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-[#8a8a8a]"
            }`}>
              {trend === "up" && <span>↑</span>}
              {trend === "down" && <span>↓</span>}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`rounded-lg bg-[#1a1d24] p-3 ${iconColorClasses[color]}`}>
          {icon}
        </div>
      </div>
      {/* Decorative gradient blob */}
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${colorClasses[color]} opacity-20 blur-2xl`} />
    </div>
  );
}

function MiniChart({ data, color = "blue" }: { data: number[]; color?: string }) {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((value, i) => (
        <div
          key={i}
          className={`w-2 rounded-t bg-gradient-to-t from-${color}-500 to-${color}-400 transition-all`}
          style={{ height: `${((value - min) / range) * 100}%`, minHeight: "4px" }}
        />
      ))}
    </div>
  );
}

export function PortalStatsCards() {
  const [stats, setStats] = useState<PortalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/portal-stats");
        if (!response.ok) throw new Error("Fehler beim Laden der Statistiken");
        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-[#111217] border border-[#272a33] animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl bg-red-900/20 border border-red-500/30 p-4 text-red-400">
        ⚠️ {error || "Keine Statistiken verfügbar"}
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);

  return (
    <div className="space-y-6">
      {/* Hauptstatistiken */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Portal-Kunden"
          value={stats.customers.total}
          subtitle={`${stats.customers.active} aktiv`}
          trend="up"
          trendValue={`+${stats.customers.new_this_month} diesen Monat`}
          color="blue"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Umsatz (Monat)"
          value={formatCurrency(stats.invoices.revenue_this_month)}
          subtitle={`Gesamt: ${formatCurrency(stats.invoices.total_revenue)}`}
          trend="up"
          trendValue={`${stats.invoices.paid_this_month} Zahlungen`}
          color="green"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Offene Tickets"
          value={stats.tickets.open + stats.tickets.in_progress}
          subtitle={`${stats.tickets.critical} kritisch`}
          trend={stats.tickets.critical > 0 ? "down" : "neutral"}
          trendValue={`Ø ${stats.tickets.avg_resolution_hours}h Lösung`}
          color={stats.tickets.critical > 0 ? "red" : "orange"}
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Aktive Projekte"
          value={stats.projects.active}
          subtitle={`${stats.projects.completed_this_month} abgeschlossen`}
          trend="up"
          trendValue={`${stats.projects.total} gesamt`}
          color="purple"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
        />
      </div>

      {/* Sekundäre Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Verifizierte Kunden"
          value={`${Math.round((stats.customers.verified / stats.customers.total) * 100)}%`}
          subtitle={`${stats.customers.verified} von ${stats.customers.total}`}
          color="cyan"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Offene Rechnungen"
          value={stats.invoices.pending}
          subtitle={`${stats.invoices.overdue} überfällig`}
          trend={stats.invoices.overdue > 0 ? "down" : "neutral"}
          color={stats.invoices.overdue > 0 ? "red" : "orange"}
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          }
        />
        
        <StatsCard
          title="AI-Anfragen (Monat)"
          value={stats.ai_usage.requests_this_month}
          subtitle={`Ø ${stats.ai_usage.avg_per_customer} pro Kunde`}
          color="purple"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Ticket-Lösung"
          value={`${stats.tickets.avg_resolution_hours}h`}
          subtitle="Durchschnittliche Zeit"
          trend={stats.tickets.avg_resolution_hours < 24 ? "up" : "down"}
          trendValue={stats.tickets.avg_resolution_hours < 24 ? "Unter SLA" : "Über SLA"}
          color={stats.tickets.avg_resolution_hours < 24 ? "green" : "red"}
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Trend-Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#272a33] bg-[#111217] p-5">
          <h3 className="text-sm font-medium text-[#8a8a8a] mb-4">Registrierungen (7 Tage)</h3>
          <MiniChart data={stats.trends.registrations_7d} color="blue" />
        </div>
        <div className="rounded-xl border border-[#272a33] bg-[#111217] p-5">
          <h3 className="text-sm font-medium text-[#8a8a8a] mb-4">Umsatz (7 Tage)</h3>
          <MiniChart data={stats.trends.revenue_7d} color="emerald" />
        </div>
      </div>
    </div>
  );
}

export default PortalStatsCards;







