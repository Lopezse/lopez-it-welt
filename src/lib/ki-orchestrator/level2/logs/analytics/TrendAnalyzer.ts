/**
 * Trend Analyzer - Enterprise++ Standard P8-E
 * 
 * Trend-Analyse für Logs (Zeitreihen, Patterns, Vorhersagen)
 */

import { logger } from "@/lib/logger";
import { logStorage } from "../storage/LogStorage";
import type { Log, Trend, LogCategory, AnalysisPeriod } from "../types";
import { v4 as uuidv4 } from "uuid";

class TrendAnalyzer {
  /**
   * Analysiert Log-Trends über Zeit
   */
  async analyzeTrends(
    logs: Log[],
    period: AnalysisPeriod = "day",
    category?: LogCategory
  ): Promise<Trend[]> {
    try {
      logger.debug(`Analysiere Trends für ${logs.length} Logs, Periode: ${period}`);

      if (logs.length === 0) {
        return [];
      }

      // Filter nach Kategorie, falls angegeben
      const filteredLogs = category
        ? logs.filter((log) => log.category === category)
        : logs;

      if (filteredLogs.length === 0) {
        return [];
      }

      const trends: Trend[] = [];

      // Gruppiere Logs nach Zeitfenster
      const timeWindows = this.groupByTimeWindow(filteredLogs, period);

      // Analysiere verschiedene Metriken
      const metrics = ["error_rate", "log_volume", "critical_count", "warning_count"];

      for (const metric of metrics) {
        const values = this.extractMetricValues(timeWindows, metric);
        if (values.length < 2) {
          continue; // Mindestens 2 Datenpunkte für Trend-Analyse
        }

        const trend = this.calculateTrend(values, metric, category || filteredLogs[0].category, period);
        if (trend) {
          trends.push(trend);
        }
      }

      logger.debug(`Trend-Analyse abgeschlossen: ${trends.length} Trends gefunden`);
      return trends;
    } catch (error) {
      logger.error("Fehler bei Trend-Analyse", error);
      return [];
    }
  }

  /**
   * Gruppiert Logs nach Zeitfenster
   */
  private groupByTimeWindow(logs: Log[], period: AnalysisPeriod): Map<string, Log[]> {
    const windows = new Map<string, Log[]>();

    for (const log of logs) {
      const windowKey = this.getTimeWindowKey(log.timestamp, period);
      if (!windows.has(windowKey)) {
        windows.set(windowKey, []);
      }
      windows.get(windowKey)!.push(log);
    }

    return windows;
  }

  /**
   * Erstellt Zeitfenster-Schlüssel
   */
  private getTimeWindowKey(timestamp: Date, period: AnalysisPeriod): string {
    const date = new Date(timestamp);
    switch (period) {
      case "hour":
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}-${String(date.getHours()).padStart(2, "0")}`;
      case "day":
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      case "week":
        const week = Math.floor(date.getDate() / 7);
        return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
      case "month":
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      default:
        return date.toISOString().split("T")[0];
    }
  }

  /**
   * Extrahiert Metrik-Werte aus Zeitfenstern
   */
  private extractMetricValues(
    timeWindows: Map<string, Log[]>,
    metric: string
  ): Array<{ timestamp: Date; value: number }> {
    const values: Array<{ timestamp: Date; value: number }> = [];
    const sortedWindows = Array.from(timeWindows.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    for (const [windowKey, logs] of sortedWindows) {
      let value = 0;

      switch (metric) {
        case "error_rate":
          value = logs.filter((log) => log.log_level === "ERROR").length / logs.length;
          break;
        case "log_volume":
          value = logs.length;
          break;
        case "critical_count":
          value = logs.filter((log) => log.severity === "critical").length;
          break;
        case "warning_count":
          value = logs.filter((log) => log.severity === "warning").length;
          break;
        default:
          value = 0;
      }

      // Parse window key to Date (simplified)
      const timestamp = new Date(windowKey);
      values.push({ timestamp, value });
    }

    return values;
  }

  /**
   * Berechnet Trend (Linear Regression)
   */
  private calculateTrend(
    values: Array<{ timestamp: Date; value: number }>,
    metric: string,
    category: LogCategory,
    period: AnalysisPeriod
  ): Trend | null {
    if (values.length < 2) {
      return null;
    }

    // Linear Regression
    const n = values.length;
    const x = values.map((_, i) => i);
    const y = values.map((v) => v.value);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // R-squared
    const yMean = sumY / n;
    const ssRes = y.reduce((sum, yi, i) => {
      const predicted = slope * x[i] + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

    // Trend-Direction
    let trend: "increasing" | "decreasing" | "stable" = "stable";
    if (slope > 0.1) {
      trend = "increasing";
    } else if (slope < -0.1) {
      trend = "decreasing";
    }

    // Confidence (basierend auf R-squared)
    const confidence = Math.max(0, Math.min(1, rSquared));

    return {
      id: uuidv4(),
      metric,
      category,
      trend,
      slope,
      r_squared: rSquared,
      confidence,
      timestamp_start: values[0].timestamp,
      timestamp_end: values[values.length - 1].timestamp,
    };
  }

  /**
   * Prognostiziert zukünftige Log-Ereignisse (vereinfachte Vorhersage)
   */
  async forecast(
    logs: Log[],
    horizon: number = 7,
    period: AnalysisPeriod = "day"
  ): Promise<Array<{ timestamp: Date; value: number }>> {
    try {
      logger.debug(`Prognostiziere Log-Ereignisse für ${horizon} ${period}(e)`);

      if (logs.length === 0) {
        return [];
      }

      // Gruppiere Logs nach Zeitfenster
      const timeWindows = this.groupByTimeWindow(logs, period);
      const values = this.extractMetricValues(timeWindows, "log_volume");

      if (values.length < 2) {
        return [];
      }

      // Einfache lineare Extrapolation
      const n = values.length;
      const x = values.map((_, i) => i);
      const y = values.map((v) => v.value);

      const sumX = x.reduce((a, b) => a + b, 0);
      const sumY = y.reduce((a, b) => a + b, 0);
      const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
      const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      // Prognose
      const forecast: Array<{ timestamp: Date; value: number }> = [];
      const lastTimestamp = values[values.length - 1].timestamp;

      for (let i = 1; i <= horizon; i++) {
        const futureX = n + i - 1;
        const predictedValue = slope * futureX + intercept;
        const futureTimestamp = new Date(lastTimestamp);
        futureTimestamp.setDate(futureTimestamp.getDate() + i);

        forecast.push({
          timestamp: futureTimestamp,
          value: Math.max(0, predictedValue), // Keine negativen Werte
        });
      }

      logger.debug(`Prognose abgeschlossen: ${forecast.length} Vorhersagen`);
      return forecast;
    } catch (error) {
      logger.error("Fehler bei Prognose", error);
      return [];
    }
  }
}

export const trendAnalyzer = new TrendAnalyzer();





