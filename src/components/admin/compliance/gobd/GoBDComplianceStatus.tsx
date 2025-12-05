/**
 * GoBD Compliance Status Component - Enterprise++ Standard E.2.2
 * 
 * GoBD-Compliance-Status-Dashboard mit Trend-Chart und Alerts
 */

"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBannerSimple } from "@/components/ui/WarningBannerSimple";
import { logger } from "@/lib/logger";

interface ComplianceStatusData {
  overall_status: "compliant" | "warning" | "critical";
  invoices_verified: number;
  invoices_total: number;
  backups_verified: number;
  backups_total: number;
  hash_verification_status: "ok" | "warning" | "error";
  last_verification: string;
  trend: Array<{ period: string; compliance_score: number; verified_count: number }>;
  alerts: Array<{ severity: "low" | "medium" | "high" | "critical"; message: string; resource: string }>;
}

export function GoBDComplianceStatus() {
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
      const response = await fetch("/api/compliance/gobd/status");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden des GoBD-Compliance-Status");
      }

      setData(result.data);
    } catch (err) {
      logger.error("Fehler beim Laden des GoBD-Compliance-Status", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden des GoBD-Compliance-Status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "compliant": return "text-green-600 dark:text-green-400";
      case "warning": return "text-yellow-600 dark:text-yellow-400";
      case "critical": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBgColor = (status: string): string => {
    switch (status) {
      case "compliant": return "bg-green-100 dark:bg-green-900/20 border-green-500";
      case "warning": return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500";
      case "critical": return "bg-red-100 dark:bg-red-900/20 border-red-500";
      default: return "bg-gray-100 dark:bg-gray-900/20 border-gray-500";
    }
  };

  if (loading && !data) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade GoBD-Compliance-Status...</p>
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

  const invoiceVerificationPercentage = data.invoices_total > 0 
    ? (data.invoices_verified / data.invoices_total) * 100 
    : 100;
  const backupVerificationPercentage = data.backups_total > 0 
    ? (data.backups_verified / data.backups_total) * 100 
    : 100;

  return (
    <div className="space-y-6">
      {/* Status-Übersicht */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">GoBD-Compliance-Status</h3>
          <div className="text-center mb-6">
            <div className={`text-3xl font-bold ${getStatusColor(data.overall_status)} mb-2`}>
              {data.overall_status === "compliant" ? "Konform" : data.overall_status === "warning" ? "Warnung" : "Kritisch"}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Letzte Verifikation: {new Date(data.last_verification).toLocaleString("de-DE")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rechnungen */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rechnungen</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Verifiziert:</span>
                  <span className="text-gray-900 dark:text-white">{data.invoices_verified} / {data.invoices_total}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      invoiceVerificationPercentage >= 95 ? "bg-green-500" :
                      invoiceVerificationPercentage >= 80 ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}
                    style={{ width: `${invoiceVerificationPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {invoiceVerificationPercentage.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Backups */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Backups</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Verifiziert:</span>
                  <span className="text-gray-900 dark:text-white">{data.backups_verified} / {data.backups_total}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      backupVerificationPercentage >= 95 ? "bg-green-500" :
                      backupVerificationPercentage >= 80 ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}
                    style={{ width: `${backupVerificationPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {backupVerificationPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Hash-Verifikation-Status */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Hash-Verifikation:</span>
              <span className={`text-sm font-semibold ${getStatusColor(data.hash_verification_status)}`}>
                {data.hash_verification_status === "ok" ? "OK" : data.hash_verification_status === "warning" ? "Warnung" : "Fehler"}
              </span>
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
              message={`[${alert.severity.toUpperCase()}] ${alert.message} (${alert.resource})`}
              className={getStatusBgColor(alert.severity === "critical" ? "critical" : alert.severity === "high" ? "warning" : "compliant")}
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
                  dataKey="verified_count" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  name="Verifiziert (Anzahl)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}



