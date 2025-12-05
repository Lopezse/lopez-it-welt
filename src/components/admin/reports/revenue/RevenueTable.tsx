"use client";

import { FaFileInvoice } from "react-icons/fa";

interface RevenueDataPoint {
  period: string;
  revenue: number;
  invoice_count: number;
  paid_revenue: number;
  pending_revenue: number;
}

interface RevenueTableProps {
  data: RevenueDataPoint[];
}

export function RevenueTable({ data }: RevenueTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Daten verfügbar</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <FaFileInvoice className="mr-2" />
        Umsatz-Tabelle
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Periode
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Gesamtumsatz
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Bezahlt
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Offen
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Rechnungen
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((point, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{point.period}</td>
                <td className="py-3 px-4 text-sm text-right font-medium text-gray-900 dark:text-white">
                  {point.revenue.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </td>
                <td className="py-3 px-4 text-sm text-right text-green-600 dark:text-green-400">
                  {point.paid_revenue.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </td>
                <td className="py-3 px-4 text-sm text-right text-yellow-600 dark:text-yellow-400">
                  {point.pending_revenue.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                  {point.invoice_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


