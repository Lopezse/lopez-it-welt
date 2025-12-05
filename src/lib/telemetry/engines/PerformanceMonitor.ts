/**
 * Performance Monitor - Enterprise++ Standard P8-D
 * 
 * Analysiert Performance-Metriken
 */

import type { BaseMetric, APIPerformance, QueuePerformance } from "../types";

class PerformanceMonitor {
  /**
   * Analysiert API-Performance basierend auf Metriken
   */
  analyzeApiPerformance(metrics: BaseMetric[]): APIPerformance {
    const apiMetrics = metrics.filter((m) => m.category === "api");

    const p50 = this.findMetricValue(apiMetrics, "API-002");
    const p95 = this.findMetricValue(apiMetrics, "API-003");
    const p99 = this.findMetricValue(apiMetrics, "API-004");
    const errorRate = this.findMetricValue(apiMetrics, "API-005");
    const requestRate = this.findMetricValue(apiMetrics, "API-001");
    const timeoutRate = this.findMetricValue(apiMetrics, "API-008");

    return {
      avgLatencyMs: p50 || 0, // P50 als Durchschnitt verwenden
      p50LatencyMs: p50 || 0,
      p95LatencyMs: p95 || 0,
      p99LatencyMs: p99 || 0,
      errorRate: errorRate || 0,
      requestRate: requestRate || 0,
      timeoutRate: timeoutRate || 0,
    };
  }

  /**
   * Analysiert Queue-Performance basierend auf Metriken
   */
  analyzeQueuePerformance(metrics: BaseMetric[]): QueuePerformance {
    const queueMetrics = metrics.filter((m) => m.category === "queue");

    const depth = this.findMetricValue(queueMetrics, "QUEUE-001");
    const throughput = this.findMetricValue(queueMetrics, "QUEUE-002");
    const avgWaitTime = this.findMetricValue(queueMetrics, "QUEUE-003");
    const avgProcessingTime = this.findMetricValue(queueMetrics, "QUEUE-004");
    const failedTasks = this.findMetricValue(queueMetrics, "QUEUE-005");

    // Queue ist blockiert, wenn Depth sehr hoch und Throughput sehr niedrig
    const blocked = (depth || 0) > 1000 && (throughput || 0) < 5;

    return {
      depth: depth || 0,
      throughput: throughput || 0,
      avgWaitTime: avgWaitTime || 0,
      avgProcessingTime: avgProcessingTime || 0,
      failedTasks: failedTasks || 0,
      blocked,
    };
  }

  /**
   * Analysiert Orchestrator-Performance
   */
  analyzeOrchestratorPerformance(metrics: BaseMetric[]): {
    load: number;
    taskRate: number;
    agentPerformance: number;
    triggerFireRate: number;
    workflowExecutionRate: number;
    p7BlockRate: number;
  } {
    const orchMetrics = metrics.filter((m) => m.category === "orchestrator");

    return {
      load: this.findMetricValue(orchMetrics, "ORCH-001") || 0,
      taskRate: this.findMetricValue(orchMetrics, "ORCH-002") || 0,
      agentPerformance: this.findMetricValue(orchMetrics, "ORCH-003") || 0,
      triggerFireRate: this.findMetricValue(orchMetrics, "ORCH-004") || 0,
      workflowExecutionRate: this.findMetricValue(orchMetrics, "ORCH-005") || 0,
      p7BlockRate: this.findMetricValue(orchMetrics, "ORCH-006") || 0,
    };
  }

  /**
   * Erkennt Anomalien in Metriken (einfache Statistik-basierte Erkennung)
   */
  detectAnomalies(metrics: BaseMetric[]): Array<{ metric: BaseMetric; reason: string }> {
    const anomalies: Array<{ metric: BaseMetric; reason: string }> = [];

    // Gruppiere Metriken nach metric_id
    const metricsById: Record<string, BaseMetric[]> = {};
    for (const metric of metrics) {
      if (!metricsById[metric.metric_id]) {
        metricsById[metric.metric_id] = [];
      }
      metricsById[metric.metric_id].push(metric);
    }

    // Für jede Metrik-Gruppe: Z-Score berechnen
    for (const [metricId, metricGroup] of Object.entries(metricsById)) {
      if (metricGroup.length < 3) {
        continue; // Zu wenige Werte für Statistik
      }

      const values = metricGroup.map((m) => m.value);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev === 0) {
        continue; // Keine Varianz
      }

      // Prüfe letzten Wert (aktuellster)
      const latestMetric = metricGroup[metricGroup.length - 1];
      const zScore = Math.abs((latestMetric.value - mean) / stdDev);

      // Z-Score > 3 gilt als Anomalie
      if (zScore > 3) {
        anomalies.push({
          metric: latestMetric,
          reason: `Z-Score ${zScore.toFixed(2)} (Mittelwert: ${mean.toFixed(2)}, StdDev: ${stdDev.toFixed(2)})`,
        });
      }
    }

    return anomalies;
  }

  /**
   * Analysiert Trends in Metriken
   */
  analyzeTrends(metrics: BaseMetric[]): Array<{ metric_id: string; trend: "increasing" | "decreasing" | "stable"; slope: number }> {
    const trends: Array<{ metric_id: string; trend: "increasing" | "decreasing" | "stable"; slope: number }> = [];

    // Gruppiere Metriken nach metric_id
    const metricsById: Record<string, BaseMetric[]> = {};
    for (const metric of metrics) {
      if (!metricsById[metric.metric_id]) {
        metricsById[metric.metric_id] = [];
      }
      metricsById[metric.metric_id].push(metric);
    }

    // Für jede Metrik-Gruppe: Linear Regression
    for (const [metricId, metricGroup] of Object.entries(metricsById)) {
      if (metricGroup.length < 3) {
        continue;
      }

      // Sortiere nach Timestamp
      const sorted = metricGroup.sort(
        (a, b) => a.metric_timestamp.getTime() - b.metric_timestamp.getTime()
      );

      // Einfache Linear Regression
      const n = sorted.length;
      const x = sorted.map((_, i) => i);
      const y = sorted.map((m) => m.value);

      const sumX = x.reduce((a, b) => a + b, 0);
      const sumY = y.reduce((a, b) => a + b, 0);
      const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
      const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

      let trend: "increasing" | "decreasing" | "stable";
      if (Math.abs(slope) < 0.01) {
        trend = "stable";
      } else if (slope > 0) {
        trend = "increasing";
      } else {
        trend = "decreasing";
      }

      trends.push({ metric_id: metricId, trend, slope });
    }

    return trends;
  }

  /**
   * Findet Metrik-Wert nach metric_id
   */
  private findMetricValue(metrics: BaseMetric[], metricId: string): number | undefined {
    const metric = metrics.find((m) => m.metric_id === metricId);
    return metric?.value;
  }
}

export const performanceMonitor = new PerformanceMonitor();





