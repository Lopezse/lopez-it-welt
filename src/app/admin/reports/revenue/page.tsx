"use client";

import { useEffect, useState } from "react";
import { FaChartLine, FaTable, FaDownload } from "react-icons/fa";
import { RevenueChart } from "@/components/admin/reports/revenue/RevenueChart";
import { RevenueTable } from "@/components/admin/reports/revenue/RevenueTable";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface RevenueDataPoint {
  period: string;
  revenue: number;
  invoice_count: number;
  paid_revenue: number;
  pending_revenue: number;
}

interface TotalStats {
  total_revenue: number;
  total_invoices: number;
  total_paid: number;
  total_pending: number;
}

export default function RevenueReportsPage() {
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [totalStats, setTotalStats] = useState<TotalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<"month" | "week" | "day">("month");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [activeView, setActiveView] = useState<"chart" | "table">("chart");

  useEffect(() => {
    loadRevenueData();
  }, [groupBy, startDate, endDate]);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        group_by: groupBy,
      });
      const response = await fetch(`/api/admin/reports/revenue?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setRevenueData(result.data.revenue_data || []);
        setTotalStats(result.data.total_stats || null);
      } else {
        setError(result.message || "Fehler beim Laden der Umsatz-Daten");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Umsatz-Daten", err);
      setError("Fehler beim Laden der Umsatz-Daten");
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const csvContent =
      "Periode,Gesamtumsatz,Bezahlt,Offen,Rechnungen\n" +
      revenueData
        .map(
          (point) =>
            `${point.period},${point.revenue},${point.paid_revenue},${point.pending_revenue},${point.invoice_count}`,
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `umsatz-report-${startDate}-${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Umsatz-Reports</h1>
              <p className="text-gray-600 dark:text-gray-400">Umsätze 2025 - Charts & Tabellen</p>
            </div>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <FaDownload className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorBanner message={error} />}

        {/* Filter */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Startdatum
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Enddatum
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gruppierung
              </label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as "month" | "week" | "day")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="month">Monat</option>
                <option value="week">Woche</option>
                <option value="day">Tag</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ansicht
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveView("chart")}
                  className={`flex-1 px-3 py-2 rounded-md flex items-center justify-center space-x-2 ${
                    activeView === "chart"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <FaChartLine className="h-4 w-4" />
                  <span>Chart</span>
                </button>
                <button
                  onClick={() => setActiveView("table")}
                  className={`flex-1 px-3 py-2 rounded-md flex items-center justify-center space-x-2 ${
                    activeView === "table"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <FaTable className="h-4 w-4" />
                  <span>Tabelle</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistik-Karten */}
        {totalStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Gesamtumsatz</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalStats.total_revenue?.toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }) || "0,00 €"}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Gesamt Rechnungen</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalStats.total_invoices || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Bezahlt</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalStats.total_paid?.toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }) || "0,00 €"}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Offen</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {totalStats.total_pending?.toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }) || "0,00 €"}
              </p>
            </div>
          </div>
        )}

        {/* Chart oder Tabelle */}
        {activeView === "chart" ? (
          <RevenueChart data={revenueData} groupBy={groupBy} />
        ) : (
          <RevenueTable data={revenueData} />
        )}
      </main>
    </div>
  );
}


