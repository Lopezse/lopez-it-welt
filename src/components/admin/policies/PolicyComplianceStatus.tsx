/**
 * Policy Compliance Status Component - Enterprise++ Standard E.2.4
 * 
 * Compliance-Status anzeigen, Compliance-Trend-Chart und Compliance-Alerts
 */

"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBannerSimple } from "@/components/ui/WarningBannerSimple";
import { logger } from "@/lib/logger";

interface ComplianceStatusData {
  overall_compliance: number;
  policies_total: number;
  policies_compliant: number;
  policies_non_compliant: number;
  policies_pending: number;
  trend: Array<{ period: string; compliance_score: number; policies_count: number }>;
  alerts: Array<{ severity: "low" | "medium" | "high" | "critical"; message: string; policy_id: string }>;
  categories: Array<{ category: string; compliance_score: number; policies_count: number }>;
}

export function PolicyComplianceStatus() {
  const [data, setData] = useState<ComplianceStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComplianceStatus();
  }, []);

  const loadComplianceStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/policies/compliance/status");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden des Compliance-Status");
      }

      setData(result.data);
    } catch (err) {
      logger.error("Fehler beim Laden des Policy-Compliance-Status", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden des Compliance-Status");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Compliance-Status...</p>
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
      {/* Status-Übersicht */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compliance-Status</h3>
          <div className="text-center mb-6">
            <div className={`text-3xl font-bold ${
              data.overall_compliance >= 95 ? "text-green-600 dark:text-green-400" :
              data.overall_compliance >= 80 ? "text-yellow-600 dark:text-yellow-400" :
              "text-red-600 dark:text-red-400"
            } mb-2`}>
              {data.overall_compliance.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gesamt-Compliance-Score
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Konform</h4>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.policies_compliant}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                von {data.policies_total} Policies
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Nicht konform</h4>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {data.policies_non_compliant}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                von {data.policies_total} Policies
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ausstehend</h4>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {data.policies_pending}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                von {data.policies_total} Policies
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((alert, index) => (
            <WarningBannerSimple
              key={index}
              message={`[${alert.severity.toUpperCase()}] ${alert.message} (Policy: ${alert.policy_id})`}
              className={
                alert.severity === "critical" ? "bg-red-100 dark:bg-red-900/20 border-red-500" :
                alert.severity === "high" ? "bg-orange-100 dark:bg-orange-900/20 border-orange-500" :
                alert.severity === "medium" ? "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500" :
                "bg-blue-100 dark:bg-blue-900/20 border-blue-500"
              }
            />
          ))}
        </div>
      )}

      {/* Trend-Chart */}
      {data.trend && data.trend.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compliance-Trend</h3>
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
                  tickFormatter={(value) => `${value}%`}
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
                  dataKey="policies_count" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  name="Policies (Anzahl)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Kategorien */}
      {data.categories && data.categories.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compliance nach Kategorien</h3>
            <div className="space-y-3">
              {data.categories.map((category, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{category.category}</span>
                    <span className={`text-sm font-medium ${
                      category.compliance_score >= 95 ? "text-green-600 dark:text-green-400" :
                      category.compliance_score >= 80 ? "text-yellow-600 dark:text-yellow-400" :
                      "text-red-600 dark:text-red-400"
                    }`}>
                      {category.compliance_score.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        category.compliance_score >= 95 ? "bg-green-500" :
                        category.compliance_score >= 80 ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${category.compliance_score}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {category.policies_count} Policies
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}



