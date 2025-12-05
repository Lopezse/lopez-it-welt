/**
 * Anomaly Detector - Enterprise++ Standard P8-E
 * 
 * Anomalie-Erkennung für Logs (statistische Ausreißer, ML-basierte Anomalien, regelbasierte Anomalien)
 */

import { logger } from "@/lib/logger";
import type { Log, Anomaly, LogCategory } from "../types";
import { v4 as uuidv4 } from "uuid";

class AnomalyDetector {
  /**
   * Erkennt Anomalien in Logs
   */
  async detectAnomalies(logs: Log[]): Promise<Anomaly[]> {
    try {
      logger.debug(`Erkenne Anomalien in ${logs.length} Logs`);

      if (logs.length === 0) {
        return [];
      }

      const anomalies: Anomaly[] = [];

      // Statistische Anomalien
      const statisticalAnomalies = await this.detectStatisticalAnomalies(logs);
      anomalies.push(...statisticalAnomalies);

      // Regelbasierte Anomalien
      const ruleBasedAnomalies = await this.detectRuleBasedAnomalies(logs);
      anomalies.push(...ruleBasedAnomalies);

      logger.debug(`Anomalie-Erkennung abgeschlossen: ${anomalies.length} Anomalien gefunden`);
      return anomalies;
    } catch (error) {
      logger.error("Fehler bei Anomalie-Erkennung", error);
      return [];
    }
  }

  /**
   * Statistische Anomalie-Erkennung (Z-Score, IQR)
   */
  async detectStatisticalAnomalies(logs: Log[]): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];

    // Gruppiere Logs nach Kategorie
    const categoryGroups = new Map<LogCategory, Log[]>();
    for (const log of logs) {
      if (!categoryGroups.has(log.category)) {
        categoryGroups.set(log.category, []);
      }
      categoryGroups.get(log.category)!.push(log);
    }

    // Analysiere jede Kategorie
    for (const [category, categoryLogs] of categoryGroups.entries()) {
      // Metrik: Log-Volume pro Zeitfenster (Stunde)
      const timeWindows = this.groupByTimeWindow(categoryLogs, "hour");
      const volumes = Array.from(timeWindows.values()).map((logs) => logs.length);

      if (volumes.length < 3) {
        continue; // Mindestens 3 Datenpunkte für statistische Analyse
      }

      // Berechne Z-Score für jedes Zeitfenster
      const mean = volumes.reduce((a, b) => a + b, 0) / volumes.length;
      const variance = volumes.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / volumes.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev === 0) {
        continue; // Keine Varianz
      }

      // Finde Anomalien (Z-Score > 2 oder < -2)
      const zScoreThreshold = 2;
      const windows = Array.from(timeWindows.entries());

      for (let i = 0; i < windows.length; i++) {
        const [windowKey, windowLogs] = windows[i];
        const volume = volumes[i];
        const zScore = (volume - mean) / stdDev;

        if (Math.abs(zScore) > zScoreThreshold) {
          const timestamp = this.parseTimeWindowKey(windowKey);
          const expectedValue = mean;

          anomalies.push({
            id: uuidv4(),
            anomaly_type: "statistical",
            metric: "log_volume",
            value: volume,
            expected_value: expectedValue,
            z_score: zScore,
            confidence: Math.min(1, Math.abs(zScore) / 3), // Normalisiert auf 0-1
            category,
            log_ids: windowLogs.map((log) => log.id!),
            timestamp,
          });
        }
      }
    }

    return anomalies;
  }

  /**
   * Regelbasierte Anomalie-Erkennung
   */
  async detectRuleBasedAnomalies(logs: Log[]): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];

    // Regel 1: Log-Volume > 3x Durchschnitt → Anomalie
    const avgVolume = logs.length / this.getTimeSpanHours(logs);
    const currentVolume = logs.filter((log) => {
      const hoursAgo = (Date.now() - log.timestamp.getTime()) / (1000 * 60 * 60);
      return hoursAgo <= 1; // Letzte Stunde
    }).length;

    if (currentVolume > avgVolume * 3) {
      const recentLogs = logs.filter((log) => {
        const hoursAgo = (Date.now() - log.timestamp.getTime()) / (1000 * 60 * 60);
        return hoursAgo <= 1;
      });

      anomalies.push({
        id: uuidv4(),
        anomaly_type: "rule_based",
        metric: "log_volume",
        value: currentVolume,
        expected_value: avgVolume,
        confidence: 0.8,
        category: "System",
        log_ids: recentLogs.map((log) => log.id!),
        timestamp: new Date(),
      });
    }

    // Regel 2: Error-Rate > 2x Durchschnitt → Anomalie
    const errorRate = logs.filter((log) => log.log_level === "ERROR").length / logs.length;
    const avgErrorRate = 0.1; // Annahme: 10% durchschnittliche Error-Rate

    if (errorRate > avgErrorRate * 2) {
      const errorLogs = logs.filter((log) => log.log_level === "ERROR");

      anomalies.push({
        id: uuidv4(),
        anomaly_type: "rule_based",
        metric: "error_rate",
        value: errorRate,
        expected_value: avgErrorRate,
        confidence: 0.8,
        category: "System",
        log_ids: errorLogs.map((log) => log.id!),
        timestamp: new Date(),
      });
    }

    // Regel 3: Security-Events > 5x Durchschnitt → Anomalie
    const securityLogs = logs.filter((log) => log.category === "Security");
    const avgSecurityEvents = securityLogs.length / this.getTimeSpanHours(logs);
    const currentSecurityEvents = securityLogs.filter((log) => {
      const hoursAgo = (Date.now() - log.timestamp.getTime()) / (1000 * 60 * 60);
      return hoursAgo <= 1;
    }).length;

    if (currentSecurityEvents > avgSecurityEvents * 5) {
      const recentSecurityLogs = securityLogs.filter((log) => {
        const hoursAgo = (Date.now() - log.timestamp.getTime()) / (1000 * 60 * 60);
        return hoursAgo <= 1;
      });

      anomalies.push({
        id: uuidv4(),
        anomaly_type: "rule_based",
        metric: "security_events",
        value: currentSecurityEvents,
        expected_value: avgSecurityEvents,
        confidence: 0.9,
        category: "Security",
        log_ids: recentSecurityLogs.map((log) => log.id!),
        timestamp: new Date(),
      });
    }

    return anomalies;
  }

  /**
   * Gruppiert Logs nach Zeitfenster
   */
  private groupByTimeWindow(logs: Log[], period: "hour" | "day"): Map<string, Log[]> {
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
  private getTimeWindowKey(timestamp: Date, period: "hour" | "day"): string {
    const date = new Date(timestamp);
    if (period === "hour") {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}-${String(date.getHours()).padStart(2, "0")}`;
    } else {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }
  }

  /**
   * Parst Zeitfenster-Schlüssel zu Date
   */
  private parseTimeWindowKey(windowKey: string): Date {
    const parts = windowKey.split("-");
    if (parts.length === 4) {
      // hour
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), parseInt(parts[3]));
    } else {
      // day
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
  }

  /**
   * Berechnet Zeitspanne in Stunden
   */
  private getTimeSpanHours(logs: Log[]): number {
    if (logs.length === 0) {
      return 1;
    }

    const sortedLogs = [...logs].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const timeSpan = sortedLogs[sortedLogs.length - 1].timestamp.getTime() - sortedLogs[0].timestamp.getTime();
    return Math.max(1, timeSpan / (1000 * 60 * 60)); // Mindestens 1 Stunde
  }
}

export const anomalyDetector = new AnomalyDetector();





