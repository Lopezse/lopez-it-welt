"use client";

import { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface RevenueDataPoint {
  period: string;
  revenue: number;
  invoice_count: number;
  paid_revenue: number;
  pending_revenue: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
  groupBy: "month" | "week" | "day";
}

export function RevenueChart({ data, groupBy }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Daten verfügbar</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue || 0));

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <FaChartLine className="mr-2" />
        Umsatz-Verlauf
      </h3>
      <div className="space-y-4">
        {data.map((point, index) => {
          const revenuePercent = maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 font-medium">{point.period}</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {point.revenue.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${revenuePercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{point.invoice_count} Rechnungen</span>
                <div className="flex space-x-4">
                  <span>
                    Bezahlt:{" "}
                    {point.paid_revenue.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                  <span>
                    Offen:{" "}
                    {point.pending_revenue.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


