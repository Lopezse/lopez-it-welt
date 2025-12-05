/**
 * Correlation Engine - Enterprise++ Standard P9
 * 
 * Korreliert Events aus verschiedenen Quellen (Logs, Metrics, Alerts)
 */

import type {
  CorrelationResult,
  MultiSourceCorrelation,
  Event,
} from "./types";
import { logger } from "@/lib/logger";

export class CorrelationEngine {
  private defaultTimeWindow: number = 5000; // 5 Sekunden in Millisekunden

  /**
   * Korreliere Log mit Metric
   */
  async correlateLogWithMetric(
    logId: string,
    metricId: string,
    log: Event,
    metric: Event
  ): Promise<CorrelationResult> {
    try {
      const score = this.calculateCorrelationScore(log, metric, this.defaultTimeWindow);
      const reasons = this.getCorrelationReasons(log, metric, score);

      return {
        source1: log,
        source2: metric,
        score,
        reasons,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error("CorrelationEngine.correlateLogWithMetric failed", {
        error,
        logId,
        metricId,
      });
      throw error;
    }
  }

  /**
   * Korreliere Log mit Alert
   */
  async correlateLogWithAlert(
    logId: string,
    alertId: string,
    log: Event,
    alert: Event
  ): Promise<CorrelationResult> {
    try {
      const score = this.calculateCorrelationScore(log, alert, this.defaultTimeWindow);
      const reasons = this.getCorrelationReasons(log, alert, score);

      return {
        source1: log,
        source2: alert,
        score,
        reasons,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error("CorrelationEngine.correlateLogWithAlert failed", {
        error,
        logId,
        alertId,
      });
      throw error;
    }
  }

  /**
   * Korreliere Metric mit Alert
   */
  async correlateMetricWithAlert(
    metricId: string,
    alertId: string,
    metric: Event,
    alert: Event
  ): Promise<CorrelationResult> {
    try {
      const score = this.calculateCorrelationScore(metric, alert, this.defaultTimeWindow);
      const reasons = this.getCorrelationReasons(metric, alert, score);

      return {
        source1: metric,
        source2: alert,
        score,
        reasons,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error("CorrelationEngine.correlateMetricWithAlert failed", {
        error,
        metricId,
        alertId,
      });
      throw error;
    }
  }

  /**
   * Multi-Source-Korrelation
   */
  async correlateMultiSource(
    logIds: string[],
    metricIds: string[],
    alertIds: string[],
    events: Event[]
  ): Promise<MultiSourceCorrelation> {
    try {
      const correlations: CorrelationResult[] = [];
      const logEvents = events.filter((e) => e.type === "log" && logIds.includes(e.id));
      const metricEvents = events.filter(
        (e) => e.type === "metric" && metricIds.includes(e.id)
      );
      const alertEvents = events.filter(
        (e) => e.type === "alert" && alertIds.includes(e.id)
      );

      // Korreliere Logs mit Metrics
      for (const log of logEvents) {
        for (const metric of metricEvents) {
          const correlation = await this.correlateLogWithMetric(
            log.id,
            metric.id,
            log,
            metric
          );
          if (correlation.score >= 0.5) {
            correlations.push(correlation);
          }
        }
      }

      // Korreliere Logs mit Alerts
      for (const log of logEvents) {
        for (const alert of alertEvents) {
          const correlation = await this.correlateLogWithAlert(
            log.id,
            alert.id,
            log,
            alert
          );
          if (correlation.score >= 0.5) {
            correlations.push(correlation);
          }
        }
      }

      // Korreliere Metrics mit Alerts
      for (const metric of metricEvents) {
        for (const alert of alertEvents) {
          const correlation = await this.correlateMetricWithAlert(
            metric.id,
            alert.id,
            metric,
            alert
          );
          if (correlation.score >= 0.5) {
            correlations.push(correlation);
          }
        }
      }

      // Berechne Summary
      const totalEvents = logEvents.length + metricEvents.length + alertEvents.length;
      const correlatedEvents = new Set(
        correlations.flatMap((c) => [c.source1.id, c.source2.id])
      ).size;
      const avgScore =
        correlations.length > 0
          ? correlations.reduce((sum, c) => sum + c.score, 0) / correlations.length
          : 0;

      return {
        correlations,
        summary: {
          totalEvents,
          correlatedEvents,
          avgScore,
        },
      };
    } catch (error) {
      logger.error("CorrelationEngine.correlateMultiSource failed", {
        error,
        logIds,
        metricIds,
        alertIds,
      });
      throw error;
    }
  }

  /**
   * Berechne Korrelations-Score
   * 
   * Score-Berechnung:
   * - Zeitraum: max 1.0 (1.0 - (timeDiff / timeWindow))
   * - Kategorie: max 0.5 (wenn gleich)
   * - Resource: max 0.3 (wenn gleich)
   * - Correlation-ID: max 0.2 (wenn gleich)
   * 
   * Schwellwert: Score ≥ 0.5 → Korrelation wird angezeigt
   */
  calculateCorrelationScore(
    source1: Event,
    source2: Event,
    timeWindow: number = this.defaultTimeWindow
  ): number {
    try {
      let score = 0.0;

      // Zeitraum-Bewertung (max 1.0)
      const timeDiff = Math.abs(
        source1.timestamp.getTime() - source2.timestamp.getTime()
      );
      if (timeDiff <= timeWindow) {
        const timeScore = 1.0 - timeDiff / timeWindow;
        score += timeScore;
      }

      // Kategorie-Bewertung (max 0.5)
      if (source1.category === source2.category) {
        score += 0.5;
      }

      // Resource-Bewertung (max 0.3)
      if (
        source1.resourceType &&
        source2.resourceType &&
        source1.resourceType === source2.resourceType &&
        source1.resourceId &&
        source2.resourceId &&
        source1.resourceId === source2.resourceId
      ) {
        score += 0.3;
      }

      // Correlation-ID-Bewertung (max 0.2)
      if (
        source1.correlationId &&
        source2.correlationId &&
        source1.correlationId === source2.correlationId
      ) {
        score += 0.2;
      }

      // Normalisiere auf 0.0 - 1.0
      return Math.min(1.0, Math.max(0.0, score));
    } catch (error) {
      logger.error("CorrelationEngine.calculateCorrelationScore failed", {
        error,
        source1,
        source2,
      });
      return 0.0;
    }
  }

  /**
   * Hole Korrelations-Gründe
   */
  private getCorrelationReasons(
    source1: Event,
    source2: Event,
    score: number
  ): string[] {
    const reasons: string[] = [];

    if (score >= 0.5) {
      const timeDiff = Math.abs(
        source1.timestamp.getTime() - source2.timestamp.getTime()
      );
      if (timeDiff <= this.defaultTimeWindow) {
        reasons.push(`Zeitraum: ${Math.round(timeDiff / 1000)}s`);
      }

      if (source1.category === source2.category) {
        reasons.push(`Kategorie: ${source1.category}`);
      }

      if (
        source1.resourceType &&
        source2.resourceType &&
        source1.resourceType === source2.resourceType &&
        source1.resourceId &&
        source2.resourceId &&
        source1.resourceId === source2.resourceId
      ) {
        reasons.push(`Resource: ${source1.resourceType}/${source1.resourceId}`);
      }

      if (
        source1.correlationId &&
        source2.correlationId &&
        source1.correlationId === source2.correlationId
      ) {
        reasons.push(`Correlation-ID: ${source1.correlationId}`);
      }
    }

    return reasons;
  }
}

export const correlationEngine = new CorrelationEngine();




