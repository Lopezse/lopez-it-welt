/**
 * Data Aggregator - Enterprise++ Standard P9
 * 
 * Aggregiert Daten aus allen Quellen (P8-C, P8-D, P8-E, Orchestrator)
 */

import type { Alert, AlertFilters, Incident, IncidentFilters } from "../types";
import type { BaseMetric, SystemHealth, MetricFilter } from "@/lib/telemetry/types";
import type { Log, LogFilters } from "../logs/types";
import type {
  AggregatedData,
  NormalizedData,
  DataSummary,
  TimeRange,
  UOCFilters,
  Event,
  TimelineEvent,
} from "./types";
import {
  alertClient,
  incidentClient,
  metricClient,
  healthClient,
  logClient,
} from "./clients";
import { logger } from "@/lib/logger";

export class DataAggregator {
  /**
   * Aggregiere alle Datenquellen
   */
  async aggregateAllSources(
    timeRange: TimeRange,
    filters?: UOCFilters
  ): Promise<AggregatedData> {
    try {
      // Parallele API-Calls für Performance
      const [alerts, incidents, metrics, logs, systemHealth] = await Promise.allSettled([
        this.aggregateAlerts({
          limit: filters?.limit || 100,
          offset: filters?.offset || 0,
          severity: filters?.severities?.[0] as any,
          category: filters?.categories?.[0] as any,
        }),
        this.aggregateIncidents({
          limit: filters?.limit || 100,
          offset: filters?.offset || 0,
          severity: filters?.severities?.[0] as any,
        }),
        this.aggregateMetrics({
          start_time: timeRange.start,
          end_time: timeRange.end,
          limit: filters?.limit || 100,
        }),
        this.aggregateLogs({
          start_time: timeRange.start,
          end_time: timeRange.end,
          limit: filters?.limit || 100,
          offset: filters?.offset || 0,
          category: filters?.categories?.[0] as any,
          severity: filters?.severities?.[0] as any,
        }),
        this.aggregateSystemHealth(),
      ]);

      // Fehlerbehandlung: Einzelne Fehler blockieren nicht alle Datenquellen
      const alertsData = alerts.status === "fulfilled" ? alerts.value : [];
      const incidentsData = incidents.status === "fulfilled" ? incidents.value : [];
      const metricsData = metrics.status === "fulfilled" ? metrics.value : [];
      const logsData = logs.status === "fulfilled" ? logs.value : [];
      const healthData =
        systemHealth.status === "fulfilled"
          ? systemHealth.value
          : ({
              status: "unhealthy" as const,
              score: 0,
              issues: ["Health-Status konnte nicht abgerufen werden"],
              metrics_summary: {},
              updated_at: new Date(),
            } as SystemHealth);

      // Logge Fehler (aber blockiere nicht)
      if (alerts.status === "rejected") {
        logger.error("DataAggregator.aggregateAllSources: Alerts failed", {
          error: alerts.reason,
        });
      }
      if (incidents.status === "rejected") {
        logger.error("DataAggregator.aggregateAllSources: Incidents failed", {
          error: incidents.reason,
        });
      }
      if (metrics.status === "rejected") {
        logger.error("DataAggregator.aggregateAllSources: Metrics failed", {
          error: metrics.reason,
        });
      }
      if (logs.status === "rejected") {
        logger.error("DataAggregator.aggregateAllSources: Logs failed", {
          error: logs.reason,
        });
      }
      if (systemHealth.status === "rejected") {
        logger.error("DataAggregator.aggregateAllSources: SystemHealth failed", {
          error: systemHealth.reason,
        });
      }

      return {
        alerts: alertsData,
        incidents: incidentsData,
        metrics: metricsData,
        logs: logsData,
        systemHealth: healthData,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error("DataAggregator.aggregateAllSources failed", { error, timeRange, filters });
      throw error;
    }
  }

  /**
   * Aggregiere Alerts
   */
  async aggregateAlerts(filters?: AlertFilters): Promise<Alert[]> {
    try {
      return await alertClient.getAlerts(filters);
    } catch (error) {
      logger.error("DataAggregator.aggregateAlerts failed", { error, filters });
      throw error;
    }
  }

  /**
   * Aggregiere Metrics
   */
  async aggregateMetrics(filters?: MetricFilter): Promise<BaseMetric[]> {
    try {
      return await metricClient.getLiveMetrics(filters);
    } catch (error) {
      logger.error("DataAggregator.aggregateMetrics failed", { error, filters });
      throw error;
    }
  }

  /**
   * Aggregiere Logs
   */
  async aggregateLogs(filters?: LogFilters): Promise<Log[]> {
    try {
      return await logClient.getLogs(filters);
    } catch (error) {
      logger.error("DataAggregator.aggregateLogs failed", { error, filters });
      throw error;
    }
  }

  /**
   * Aggregiere Incidents
   */
  async aggregateIncidents(filters?: IncidentFilters): Promise<Incident[]> {
    try {
      return await incidentClient.getIncidents(filters);
    } catch (error) {
      logger.error("DataAggregator.aggregateIncidents failed", { error, filters });
      throw error;
    }
  }

  /**
   * Aggregiere System-Health
   */
  async aggregateSystemHealth(): Promise<SystemHealth> {
    try {
      return await healthClient.getHealthStatus();
    } catch (error) {
      logger.error("DataAggregator.aggregateSystemHealth failed", { error });
      throw error;
    }
  }

  /**
   * Normalisiere Daten zu Events
   */
  normalizeData(
    alerts: Alert[],
    metrics: BaseMetric[],
    logs: Log[]
  ): NormalizedData {
    try {
      const events: Event[] = [];
      const timeline: TimelineEvent[] = [];

      // Alerts zu Events
      for (const alert of alerts) {
        const event: Event = {
          id: alert.id,
          type: "alert",
          category: alert.category,
          severity: alert.severity,
          resourceType: alert.resource_type,
          resourceId: alert.resource_id,
          correlationId: alert.payload?.correlation_id as string | undefined,
          timestamp: new Date(alert.triggered_at),
          data: alert,
        };
        events.push(event);

        timeline.push({
          id: alert.id,
          type: "alert",
          timestamp: new Date(alert.triggered_at),
          category: alert.category,
          severity: alert.severity,
          message: alert.title,
          data: alert,
        });
      }

      // Metrics zu Events
      for (const metric of metrics) {
        const event: Event = {
          id: metric.id || `${metric.metric_id}-${metric.metric_timestamp.getTime()}`,
          type: "metric",
          category: metric.category,
          severity: metric.severity,
          resourceType: metric.source,
          resourceId: metric.tags?.resource_id as string | undefined,
          correlationId: metric.tags?.correlation_id as string | undefined,
          timestamp: metric.metric_timestamp,
          data: metric,
        };
        events.push(event);

        timeline.push({
          id: event.id,
          type: "metric",
          timestamp: metric.metric_timestamp,
          category: metric.category,
          severity: metric.severity,
          message: `${metric.metric_name}: ${metric.value} ${metric.unit}`,
          data: metric,
        });
      }

      // Logs zu Events
      for (const log of logs) {
        const event: Event = {
          id: log.id,
          type: "log",
          category: log.category,
          severity: log.severity,
          resourceType: log.resource_type,
          resourceId: log.resource_id,
          correlationId: log.correlation_id,
          timestamp: log.timestamp,
          data: log,
        };
        events.push(event);

        timeline.push({
          id: log.id,
          type: "log",
          timestamp: log.timestamp,
          category: log.category,
          severity: log.severity,
          message: log.message,
          data: log,
        });
      }

      // Sortiere Timeline nach Timestamp
      timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // Berechne Summary
      const summary: DataSummary = {
        totalAlerts: alerts.length,
        totalIncidents: 0, // Wird separat berechnet
        totalMetrics: metrics.length,
        totalLogs: logs.length,
        criticalCount:
          alerts.filter((a) => a.severity === "critical").length +
          metrics.filter((m) => m.severity === "critical").length +
          logs.filter((l) => l.severity === "critical").length,
        warningCount:
          alerts.filter((a) => a.severity === "warning").length +
          metrics.filter((m) => m.severity === "warning").length +
          logs.filter((l) => l.severity === "warning").length,
        infoCount:
          alerts.filter((a) => a.severity === "info").length +
          metrics.filter((m) => m.severity === "info").length +
          logs.filter((l) => l.severity === "info").length,
      };

      return {
        events,
        timeline,
        summary,
      };
    } catch (error) {
      logger.error("DataAggregator.normalizeData failed", { error });
      throw error;
    }
  }
}

export const dataAggregator = new DataAggregator();




