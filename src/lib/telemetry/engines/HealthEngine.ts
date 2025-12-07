/**
 * Health Engine - Enterprise++ Standard P8-D
 * 
 * Berechnet System-Health-Status basierend auf Metriken
 */

import { getConnection } from "@/lib/database";
import type { BaseMetric, SystemHealth, HealthStatus, ComponentHealth } from "../types";

class HealthEngine {
  /**
   * Berechnet System-Health basierend auf Metriken
   */
  computeHealth(metrics: BaseMetric[]): SystemHealth {
    const issues: string[] = [];
    const metricsSummary: Record<string, number> = {};
    let totalScore = 100;

    // Metriken nach Kategorie gruppieren
    const metricsByCategory: Record<string, BaseMetric[]> = {};
    for (const metric of metrics) {
      if (!metricsByCategory[metric.category]) {
        metricsByCategory[metric.category] = [];
      }
      metricsByCategory[metric.category].push(metric);
      metricsSummary[metric.metric_id] = metric.value;
    }

    // System-Metriken bewerten
    const systemMetrics = metricsByCategory.system || [];
    for (const metric of systemMetrics) {
      const score = this.evaluateMetric(metric);
      totalScore -= score.penalty;
      if (score.issue) {
        issues.push(score.issue);
      }
    }

    // API-Metriken bewerten
    const apiMetrics = metricsByCategory.api || [];
    for (const metric of apiMetrics) {
      const score = this.evaluateMetric(metric);
      totalScore -= score.penalty;
      if (score.issue) {
        issues.push(score.issue);
      }
    }

    // Queue-Metriken bewerten
    const queueMetrics = metricsByCategory.queue || [];
    for (const metric of queueMetrics) {
      const score = this.evaluateMetric(metric);
      totalScore -= score.penalty;
      if (score.issue) {
        issues.push(score.issue);
      }
    }

    // Orchestrator-Metriken bewerten
    const orchestratorMetrics = metricsByCategory.orchestrator || [];
    for (const metric of orchestratorMetrics) {
      const score = this.evaluateMetric(metric);
      totalScore -= score.penalty;
      if (score.issue) {
        issues.push(score.issue);
      }
    }

    // DB-Metriken bewerten
    const dbMetrics = metricsByCategory.db || [];
    for (const metric of dbMetrics) {
      const score = this.evaluateMetric(metric);
      totalScore -= score.penalty;
      if (score.issue) {
        issues.push(score.issue);
      }
    }

    // Score auf 0-100 begrenzen
    const finalScore = Math.max(0, Math.min(100, totalScore));
    const status = this.determineHealthStatus(finalScore);

    return {
      status,
      score: finalScore,
      issues,
      metrics_summary: metricsSummary,
      updated_at: new Date(),
    };
  }

  /**
   * Bewertet eine einzelne Metrik und gibt Penalty + Issue zurück
   */
  private evaluateMetric(metric: BaseMetric): { penalty: number; issue?: string } {
    // Importiere Registry für Thresholds
    const { getMetricDefinition } = require("../TelemetryRegistry");
    const definition = getMetricDefinition(metric.metric_id);

    if (!definition) {
      return { penalty: 0 };
    }

    const { warning_threshold, critical_threshold } = definition;
    let penalty = 0;
    let issue: string | undefined;

    // Prüfe gegen Critical-Threshold
    if (critical_threshold !== undefined) {
      if (this.isMetricAboveThreshold(metric, critical_threshold)) {
        penalty = 10; // Kritische Metriken: hohe Penalty
        issue = `${metric.metric_name} kritisch: ${metric.value} ${metric.unit} (Schwellwert: ${critical_threshold})`;
      } else if (warning_threshold !== undefined && this.isMetricAboveThreshold(metric, warning_threshold)) {
        penalty = 3; // Warnung: niedrigere Penalty
        issue = `${metric.metric_name} Warnung: ${metric.value} ${metric.unit} (Schwellwert: ${warning_threshold})`;
      }
    } else if (warning_threshold !== undefined) {
      // Nur Warning-Threshold vorhanden
      if (this.isMetricAboveThreshold(metric, warning_threshold)) {
        penalty = 3;
        issue = `${metric.metric_name} Warnung: ${metric.value} ${metric.unit} (Schwellwert: ${warning_threshold})`;
      }
    }

    return { penalty, issue };
  }

  /**
   * Prüft, ob Metrik-Wert über Schwellwert liegt
   * Berücksichtigt verschiedene Metrik-Typen (je höher desto schlechter vs. je niedriger desto schlechter)
   */
  private isMetricAboveThreshold(metric: BaseMetric, threshold: number): boolean {
    // Für die meisten Metriken: je höher desto schlechter (CPU, RAM, Error-Rate, etc.)
    // Ausnahmen: Cache Hit Rate (je niedriger desto schlechter), Success Rate (je niedriger desto schlechter)
    const lowerIsWorse = ["CACHE-001", "MEDIA-002"].includes(metric.metric_id);

    if (lowerIsWorse) {
      return metric.value < threshold;
    }

    return metric.value > threshold;
  }

  /**
   * Bestimmt Health-Status basierend auf Score
   */
  determineHealthStatus(score: number): HealthStatus {
    if (score >= 90) {
      return "healthy";
    } else if (score >= 70) {
      return "degraded";
    } else if (score >= 50) {
      return "unhealthy";
    } else {
      return "critical";
    }
  }

  /**
   * Berechnet Health für eine spezifische Komponente
   */
  computeComponentHealth(component: string, metrics: BaseMetric[]): ComponentHealth {
    const componentMetrics = metrics.filter((m) => m.source === component || m.category === component);
    const health = this.computeHealth(componentMetrics);

    return {
      component,
      status: health.status,
      score: health.score,
      issues: health.issues,
      metrics_summary: health.metrics_summary,
      checked_at: new Date(),
    };
  }

  /**
   * Speichert Health-Status in der Datenbank
   */
  async saveHealthStatus(health: SystemHealth | ComponentHealth): Promise<void> {
    try {
      const connection = await getConnection();
      const healthId = this.generateId();
      const component = "component" in health ? health.component : "system";

      await connection.execute(
        `INSERT INTO orchestrator_metrics_health 
         (id, component, health_status, health_score, metrics_summary, issues, checked_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          healthId,
          component,
          health.status,
          health.score,
          JSON.stringify(health.metrics_summary),
          JSON.stringify(health.issues),
          (health as unknown as Record<string, unknown>).checked_at || new Date(),
        ]
      );
    } catch (error) {
      // Nicht werfen, da Health-Speicherung nicht kritisch sein sollte
      console.error("Fehler beim Speichern des Health-Status", error);
    }
  }

  /**
   * Generiert eine eindeutige ID
   */
  private generateId(): string {
    return `health-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const healthEngine = new HealthEngine();





