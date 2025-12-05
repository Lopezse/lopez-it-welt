"use client";

import { useEffect, useState } from "react";
import { FaRobot, FaClock, FaDollarSign, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface PerformanceDataPoint {
  period: string;
  total_requests: number;
  avg_processing_time: number;
  successful_requests: number;
  failed_requests: number;
  total_cost: number;
}

interface TotalStats {
  total_requests: number;
  avg_processing_time: number;
  successful_requests: number;
  failed_requests: number;
  total_cost: number;
}

export default function MediaAIPerformancePage() {
  const [performanceData, setPerformanceData] = useState<PerformanceDataPoint[]>([]);
  const [totalStats, setTotalStats] = useState<TotalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadPerformanceData();
  }, [startDate, endDate]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      const response = await fetch(`/api/admin/reports/media-ai?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setPerformanceData(result.data.performance_data || []);
        setTotalStats(result.data.total_stats || null);
      } else {
        setError(result.message || "Fehler beim Laden der Performance-Daten");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Media AI Performance-Daten", err);
      setError("Fehler beim Laden der Performance-Daten");
    } finally {
      setLoading(false);
    }
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Media AI Performance
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Performance-Metriken für Media AI
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorBanner message={error} />}

        {/* Filter */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Statistik-Karten */}
        {totalStats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaRobot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Gesamt Requests</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalStats.total_requests || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaClock className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Ø Verarbeitungszeit</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalStats.avg_processing_time
                  ? `${Math.round(totalStats.avg_processing_time)} ms`
                  : "0 ms"}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Erfolgreich</p>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalStats.successful_requests || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaExclamationTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Fehler</p>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {totalStats.failed_requests || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaDollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Gesamtkosten</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalStats.total_cost
                  ? totalStats.total_cost.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    })
                  : "0,00 €"}
              </p>
            </div>
          </div>
        )}

        {/* Performance-Daten */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance-Verlauf
          </h3>
          {performanceData.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Keine Daten verfügbar
            </p>
          ) : (
            <div className="space-y-4">
              {performanceData.map((point, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{point.period}</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {point.total_requests} Requests
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Ø Zeit</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {Math.round(point.avg_processing_time)} ms
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Erfolgreich</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {point.successful_requests}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Fehler</p>
                      <p className="font-semibold text-red-600 dark:text-red-400">
                        {point.failed_requests}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Kosten</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {point.total_cost.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


