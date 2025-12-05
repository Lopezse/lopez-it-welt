"use client";

// =====================================================
// AI CENTER - COSTS DASHBOARD
// =====================================================
// /admin/ai/costs
// Enterprise++ Kosten-Überwachung
// =====================================================

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FaEuroSign,
  FaArrowLeft,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartBar,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

interface CostData {
  summary: {
    total_cost: number;
    total_tokens_input: number;
    total_tokens_output: number;
    today: number;
    yesterday: number;
    avg_daily: number;
    days_analyzed: number;
  };
  limits: {
    daily: number;
    monthly: number;
    warning_threshold: number;
    status: {
      allowed: boolean;
      current_daily: number;
      current_monthly: number;
      warning: boolean;
    };
  };
  by_day: { date: string; cost: number; tokens_input: number; tokens_output: number }[];
  by_provider: { provider: string; cost: number; tokens_input: number; tokens_output: number }[];
  by_endpoint: { endpoint: string; requests: number; cost: number }[];
}

// =====================================================
// KOMPONENTE
// =====================================================

export default function CostsDashboard() {
  const [data, setData] = useState<CostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/ai/costs?days=${days}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Fehler beim Laden");
      }
    } catch (err) {
      setError("Verbindungsfehler");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Trend berechnen
  const getTrend = (today: number, yesterday: number): { direction: "up" | "down" | "same"; percent: number } => {
    if (yesterday === 0) return { direction: "same", percent: 0 };
    const change = ((today - yesterday) / yesterday) * 100;
    return {
      direction: change > 0 ? "up" : change < 0 ? "down" : "same",
      percent: Math.abs(change)
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050509] flex items-center justify-center">
        <FaSpinner className="h-8 w-8 text-[#ffd700] animate-spin" />
      </div>
    );
  }

  const trend = data ? getTrend(data.summary.today, data.summary.yesterday) : null;

  return (
    <div className="min-h-screen bg-[#050509] text-[#f4f4f4]">
      {/* Header */}
      <div className="border-b border-[#272a33] bg-[#111217] px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/ai"
              className="p-2 hover:bg-[#272a33] rounded-lg transition-colors"
            >
              <FaArrowLeft className="h-4 w-4 text-[#b3b3b3]" />
            </Link>
            <div className="p-3 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] rounded-xl">
              <FaEuroSign className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#f4f4f4]">
                Kosten-Dashboard
              </h1>
              <p className="text-[#b3b3b3]">
                AI Center Kostenüberwachung
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-3 py-2 bg-[#272a33] border border-[#353840] rounded-lg text-[#f4f4f4]"
            >
              <option value={7}>Letzte 7 Tage</option>
              <option value={30}>Letzte 30 Tage</option>
              <option value={90}>Letzte 90 Tage</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* Limit-Warnung */}
            {data.limits.status.warning && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3">
                <FaExclamationTriangle className="text-yellow-400" />
                <span className="text-yellow-400">
                  Kosten-Warnung: {data.limits.warning_threshold}% des Limits erreicht!
                </span>
              </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Heute */}
              <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#b3b3b3] text-sm">Heute</span>
                  {trend && trend.direction !== "same" && (
                    <span className={`flex items-center gap-1 text-xs ${
                      trend.direction === "up" ? "text-red-400" : "text-green-400"
                    }`}>
                      {trend.direction === "up" ? <FaArrowUp /> : <FaArrowDown />}
                      {trend.percent.toFixed(0)}%
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-[#f4f4f4]">
                  {data.summary.today.toFixed(2)} €
                </div>
                <div className="text-xs text-[#71717a] mt-1">
                  Limit: {data.limits.daily}€
                </div>
                <div className="mt-2 h-1.5 bg-[#272a33] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      (data.summary.today / data.limits.daily) >= 0.8 
                        ? "bg-red-400" 
                        : (data.summary.today / data.limits.daily) >= 0.5 
                          ? "bg-yellow-400" 
                          : "bg-green-400"
                    }`}
                    style={{ width: `${Math.min(100, (data.summary.today / data.limits.daily) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Monat */}
              <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#b3b3b3] text-sm">Monat (30 Tage)</span>
                  <FaCalendarAlt className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-[#f4f4f4]">
                  {data.summary.total_cost.toFixed(2)} €
                </div>
                <div className="text-xs text-[#71717a] mt-1">
                  Limit: {data.limits.monthly}€
                </div>
                <div className="mt-2 h-1.5 bg-[#272a33] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      (data.summary.total_cost / data.limits.monthly) >= 0.8 
                        ? "bg-red-400" 
                        : (data.summary.total_cost / data.limits.monthly) >= 0.5 
                          ? "bg-yellow-400" 
                          : "bg-green-400"
                    }`}
                    style={{ width: `${Math.min(100, (data.summary.total_cost / data.limits.monthly) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Durchschnitt */}
              <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#b3b3b3] text-sm">Ø pro Tag</span>
                  <FaChartBar className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-[#f4f4f4]">
                  {data.summary.avg_daily.toFixed(2)} €
                </div>
                <div className="text-xs text-[#71717a] mt-1">
                  {data.summary.days_analyzed} Tage analysiert
                </div>
              </div>

              {/* Tokens */}
              <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#b3b3b3] text-sm">Tokens gesamt</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    data.limits.status.allowed 
                      ? "bg-green-400/10 text-green-400" 
                      : "bg-red-400/10 text-red-400"
                  }`}>
                    {data.limits.status.allowed ? "OK" : "Limit"}
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#f4f4f4]">
                  {((data.summary.total_tokens_input + data.summary.total_tokens_output) / 1000).toFixed(1)}k
                </div>
                <div className="flex justify-between text-xs text-[#71717a] mt-1">
                  <span>Input: {(data.summary.total_tokens_input / 1000).toFixed(1)}k</span>
                  <span>Output: {(data.summary.total_tokens_output / 1000).toFixed(1)}k</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Daily Chart */}
              <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
                <h3 className="font-semibold text-[#f4f4f4] mb-4">Kosten pro Tag</h3>
                <div className="h-48 flex items-end gap-1">
                  {data.by_day.slice(-14).map((day, i) => {
                    const maxCost = Math.max(...data.by_day.map(d => d.cost), 0.01);
                    const height = (day.cost / maxCost) * 100;
                    
                    return (
                      <div 
                        key={day.date}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <div 
                          className="w-full bg-[#ffd700] rounded-t transition-all hover:bg-[#ffed4a]"
                          style={{ height: `${Math.max(height, 2)}%` }}
                          title={`${day.date}: ${day.cost.toFixed(2)}€`}
                        />
                        <span className="text-[8px] text-[#71717a] rotate-45 origin-left">
                          {new Date(day.date).getDate()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Provider Breakdown */}
              <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
                <h3 className="font-semibold text-[#f4f4f4] mb-4">Nach Provider</h3>
                {data.by_provider.length === 0 ? (
                  <div className="text-center py-8 text-[#71717a]">
                    Keine Daten
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.by_provider.map((provider) => {
                      const totalCost = data.by_provider.reduce((sum, p) => sum + p.cost, 0);
                      const percent = totalCost > 0 ? (provider.cost / totalCost) * 100 : 0;
                      
                      return (
                        <div key={provider.provider}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#f4f4f4]">{provider.provider}</span>
                            <span className="text-[#b3b3b3]">{provider.cost.toFixed(2)}€</span>
                          </div>
                          <div className="h-2 bg-[#272a33] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#ffd700] to-[#ff8c00] rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Top Endpoints */}
            <div className="bg-[#111217] border border-[#272a33] rounded-xl p-4">
              <h3 className="font-semibold text-[#f4f4f4] mb-4">Top Endpoints nach Kosten</h3>
              {data.by_endpoint.length === 0 ? (
                <div className="text-center py-8 text-[#71717a]">
                  Keine Daten
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-[#71717a] border-b border-[#272a33]">
                        <th className="pb-2">Endpoint</th>
                        <th className="pb-2 text-right">Requests</th>
                        <th className="pb-2 text-right">Kosten</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.by_endpoint.map((ep) => (
                        <tr key={ep.endpoint} className="border-b border-[#272a33] last:border-0">
                          <td className="py-2 font-mono text-sm text-[#f4f4f4]">{ep.endpoint}</td>
                          <td className="py-2 text-right text-[#b3b3b3]">{ep.requests}</td>
                          <td className="py-2 text-right text-[#ffd700]">{ep.cost.toFixed(2)}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

