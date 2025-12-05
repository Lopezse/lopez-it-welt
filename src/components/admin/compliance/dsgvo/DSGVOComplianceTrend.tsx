/**
 * DSGVO Compliance Trend Chart - Enterprise++ Standard E.2.1
 * 
 * Trend-Chart für DSGVO-Compliance (letzte 30 Tage)
 */

"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface ComplianceTrendData {
  period: string;
  compliance_score: number;
  risk_score: number;
  consent_coverage: number;
}

export function DSGVOComplianceTrend() {
  const [data, setData] = useState<ComplianceTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrendData();
  }, []);

  const loadTrendData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/dsgvo/monitoring/trend?days=30");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der Trend-Daten");
      }

      setData(result.data || []);
    } catch (err) {
      logger.error("Fehler beim Laden der DSGVO-Compliance-Trend-Daten", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Trend-Daten");
    } finally {
      setLoading(false);
    }
  };

  if (loading && data.length === 0) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Trend-Daten...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return <ErrorBanner message={error} onDismiss={() => setError(null)} />;
  }

  if (data.length === 0) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Keine Trend-Daten verfügbar.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compliance-Trend (30 Tage)</h3>
        <div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
            <XAxis 
              dataKey="period" 
              stroke="#6b7280" 
              tick={{ fill: "#6b7280" }}
              tickFormatter={(value) => new Date(value).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
            />
            <YAxis 
              stroke="#6b7280" 
              tick={{ fill: "#6b7280" }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563", borderRadius: "0.5rem" }}
              itemStyle={{ color: "#e5e7eb" }}
              labelStyle={{ color: "#9ca3af" }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="compliance_score" 
              stroke="#10b981" 
              strokeWidth={2} 
              name="Compliance-Score (%)" 
            />
            <Line 
              type="monotone" 
              dataKey="consent_coverage" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              name="Consent-Coverage (%)" 
            />
            <Line 
              type="monotone" 
              dataKey="risk_score" 
              stroke="#ef4444" 
              strokeWidth={2} 
              name="Risiko-Score (%)" 
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

