/**
 * Queue Monitor - Enterprise++ Standard P8-D
 * 
 * Überwacht Queue-Performance
 */

import type { BaseMetric, QueuePerformance } from "../types";

class QueueMonitor {
  /**
   * Analysiert Queue-Status basierend auf Metriken
   */
  analyzeQueue(metrics: BaseMetric[]): QueuePerformance {
    const queueMetrics = metrics.filter((m) => m.category === "queue");

    const depth = this.findMetricValue(queueMetrics, "QUEUE-001");
    const throughput = this.findMetricValue(queueMetrics, "QUEUE-002");
    const avgWaitTime = this.findMetricValue(queueMetrics, "QUEUE-003");
    const avgProcessingTime = this.findMetricValue(queueMetrics, "QUEUE-004");
    const failedTasks = this.findMetricValue(queueMetrics, "QUEUE-005");

    // Queue ist blockiert, wenn:
    // - Depth sehr hoch (>1000) UND
    // - Throughput sehr niedrig (<5 tasks/s)
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
   * Ruft Queue-Tiefe ab
   */
  getQueueDepth(metrics: BaseMetric[]): number {
    const depthMetric = metrics.find((m) => m.metric_id === "QUEUE-001");
    return depthMetric?.value || 0;
  }

  /**
   * Ruft Queue-Durchsatz ab
   */
  getQueueThroughput(metrics: BaseMetric[]): number {
    const throughputMetric = metrics.find((m) => m.metric_id === "QUEUE-002");
    return throughputMetric?.value || 0;
  }

  /**
   * Ruft durchschnittliche Wartezeit ab
   */
  getQueueWaitTime(metrics: BaseMetric[]): number {
    const waitTimeMetric = metrics.find((m) => m.metric_id === "QUEUE-003");
    return waitTimeMetric?.value || 0;
  }

  /**
   * Findet Metrik-Wert nach metric_id
   */
  private findMetricValue(metrics: BaseMetric[], metricId: string): number | undefined {
    const metric = metrics.find((m) => m.metric_id === metricId);
    return metric?.value;
  }
}

export const queueMonitor = new QueueMonitor();





