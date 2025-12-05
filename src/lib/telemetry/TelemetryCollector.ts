/**
 * Telemetry Collector - Enterprise++ Standard P8-D
 * 
 * Zentrale API für Metriken-Sammlung und -Speicherung
 */

import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import type { BaseMetric } from "./types";

class TelemetryCollector {
  /**
   * Speichert eine einzelne Metrik in der Datenbank
   */
  async recordMetric(metric: BaseMetric): Promise<void> {
    try {
      const connection = await getConnection();
      const metricId = metric.id || this.generateId();
      const timestamp = metric.metric_timestamp || new Date();

      await connection.execute(
        `INSERT INTO orchestrator_metrics 
         (id, metric_id, metric_name, category, value, unit, timestamp, tags, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          metricId,
          metric.metric_id,
          metric.metric_name,
          metric.category,
          metric.value,
          metric.unit,
          timestamp,
          JSON.stringify(metric.tags || {}),
          JSON.stringify(metric.metadata || {}),
        ]
      );

      logger.debug(`Metrik aufgezeichnet: ${metric.metric_id} = ${metric.value} ${metric.unit}`);
    } catch (error) {
      logger.error(`Fehler beim Aufzeichnen der Metrik ${metric.metric_id}`, error);
      // Nicht werfen, da Metriken-Sammlung nicht kritisch sein sollte
    }
  }

  /**
   * Speichert mehrere Metriken in einem Batch
   */
  async recordMetrics(metrics: BaseMetric[]): Promise<void> {
    if (metrics.length === 0) {
      return;
    }

    try {
      const connection = await getConnection();

      // Batch-Insert für bessere Performance
      const values = metrics.map((metric) => {
        const metricId = metric.id || this.generateId();
        const timestamp = metric.metric_timestamp || new Date();
        return [
          metricId,
          metric.metric_id,
          metric.metric_name,
          metric.category,
          metric.value,
          metric.unit,
          timestamp,
          JSON.stringify(metric.tags || {}),
          JSON.stringify(metric.metadata || {}),
        ];
      });

      const placeholders = values.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
      const flatValues = values.flat();

      await connection.execute(
        `INSERT INTO orchestrator_metrics 
         (id, metric_id, metric_name, category, value, unit, timestamp, tags, metadata)
         VALUES ${placeholders}`,
        flatValues
      );

      logger.debug(`${metrics.length} Metriken aufgezeichnet`);
    } catch (error) {
      logger.error(`Fehler beim Aufzeichnen von ${metrics.length} Metriken`, error);
      // Nicht werfen, da Metriken-Sammlung nicht kritisch sein sollte
    }
  }

  /**
   * Generiert eine eindeutige ID für eine Metrik
   */
  private generateId(): string {
    return `metric-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const telemetryCollector = new TelemetryCollector();





