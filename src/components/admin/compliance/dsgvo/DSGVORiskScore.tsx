/**
 * DSGVO Risk Score Visualization - Enterprise++ Standard E.2.1
 * 
 * Risiko-Score-Visualisierung mit Kategorien
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface RiskScoreData {
  overall_score: number;
  categories: Array<{
    category: string;
    score: number;
    weight: number;
  }>;
  last_updated: string;
}

export function DSGVORiskScore() {
  const [data, setData] = useState<RiskScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRiskScore();
  }, []);

  const loadRiskScore = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/dsgvo/monitoring/risk-score");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden des Risiko-Scores");
      }

      setData(result.data);
    } catch (err) {
      logger.error("Fehler beim Laden des DSGVO-Risiko-Scores", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden des Risiko-Scores");
    } finally {
      setLoading(false);
    }
  };

  const getRiskCategory = (score: number): { label: string; color: string; bgColor: string } => {
    if (score >= 70) {
      return { label: "Kritisch", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-500" };
    }
    if (score >= 40) {
      return { label: "Hoch", color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-500" };
    }
    if (score >= 20) {
      return { label: "Mittel", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-500" };
    }
    return { label: "Niedrig", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-500" };
  };

  if (loading && !data) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Risiko-Score...</p>
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

  const riskCategory = getRiskCategory(data.overall_score);

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risiko-Score-Visualisierung</h3>
        <div className="space-y-4">
        <div className="text-center">
          <div className={`text-5xl font-bold ${riskCategory.color} mb-2`}>
            {data.overall_score}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">von 100</div>
          <div className={`inline-block px-4 py-2 rounded-full ${riskCategory.bgColor} text-white font-semibold`}>
            {riskCategory.label}
          </div>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
          <div
            className={`h-6 rounded-full ${riskCategory.bgColor} transition-all duration-500`}
            style={{ width: `${data.overall_score}%` }}
          ></div>
        </div>

        {data.categories && data.categories.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Kategorien:</h4>
            {data.categories.map((cat, index) => {
              const catRisk = getRiskCategory(cat.score);
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{cat.category}</span>
                    <span className={`font-medium ${catRisk.color}`}>{cat.score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${catRisk.bgColor}`}
                      style={{ width: `${cat.score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          Letzte Aktualisierung: {new Date(data.last_updated).toLocaleString("de-DE")}
        </div>
        </div>
      </div>
    </Card>
  );
}

