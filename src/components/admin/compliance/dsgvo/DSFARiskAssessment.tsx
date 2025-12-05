/**
 * DSFA Risk Assessment Component - Enterprise++ Standard E.2.1
 * 
 * DSFA-Risiko-Bewertung mit Visualisierung und Alerts
 */

"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBannerSimple } from "@/components/ui/WarningBannerSimple";
import { logger } from "@/lib/logger";

interface RiskAssessmentData {
  overall_score: number;
  trend: Array<{ period: string; score: number }>;
  categories: Array<{
    category: string;
    score: number;
    details: string;
    measures: string[];
  }>;
  alerts: Array<{
    severity: "low" | "medium" | "high" | "critical";
    message: string;
    resource: string;
  }>;
  last_updated: string;
}

export function DSFARiskAssessment() {
  const [data, setData] = useState<RiskAssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRiskAssessment();
  }, []);

  const loadRiskAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/dsgvo/monitoring/risk-assessment");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der Risiko-Bewertung");
      }

      setData(result.data);
    } catch (err) {
      logger.error("Fehler beim Laden der DSFA-Risiko-Bewertung", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Risiko-Bewertung");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number): string => {
    if (score >= 70) return "text-red-600 dark:text-red-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 20) return "text-blue-600 dark:text-blue-400";
    return "text-green-600 dark:text-green-400";
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "critical": return "bg-red-100 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200";
      case "high": return "bg-orange-100 dark:bg-orange-900/20 border-orange-500 text-orange-800 dark:text-orange-200";
      case "medium": return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200";
      default: return "bg-blue-100 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200";
    }
  };

  if (loading && !data) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Risiko-Bewertung...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return <ErrorBanner message={error} onDismiss={() => setError(null)} />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Risiko-Score */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">DSFA-Risiko-Score</h3>
          <div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${getRiskColor(data.overall_score)} mb-2`}>
              {data.overall_score}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">von 100</div>
          </div>
          </div>
        </div>
      </Card>

      {/* Risiko-Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((alert, index) => (
            <WarningBannerSimple
              key={index}
              message={`[${alert.severity.toUpperCase()}] ${alert.message} (${alert.resource})`}
              className={getSeverityColor(alert.severity)}
            />
          ))}
        </div>
      )}

      {/* Risiko-Trend */}
      {data.trend && data.trend.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risiko-Trend</h3>
            <div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.trend}>
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
                  formatter={(value: number) => `${value.toFixed(1)}/100`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  name="Risiko-Score" 
                />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}

      {/* Risiko-Kategorien */}
      {data.categories && data.categories.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risiko-Kategorien</h3>
            <div className="space-y-4">
            {data.categories.map((cat, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{cat.category}</h4>
                  <span className={`font-bold ${getRiskColor(cat.score)}`}>{cat.score}/100</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{cat.details}</p>
                {cat.measures && cat.measures.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Maßnahmen:</p>
                    <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {cat.measures.map((measure, mIndex) => (
                        <li key={mIndex}>{measure}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        </Card>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Letzte Aktualisierung: {new Date(data.last_updated).toLocaleString("de-DE")}
      </div>
    </div>
  );
}

