/**
 * UOC Events Stream Hook - Enterprise++ Standard P9
 * 
 * Hook für alle Event-Typen (Alerts, Metrics, Logs, Health, Incidents)
 */

"use client";

import { useCallback } from "react";
import { useSSEStream, UseSSEStreamOptions } from "./useSSEStream";
import type { Alert, Incident } from "@/lib/ki-orchestrator/level2/types";
import type { BaseMetric, SystemHealth } from "@/lib/telemetry/types";
import type { Log } from "@/lib/ki-orchestrator/level2/logs/types";

export interface UseUOCEventsStreamOptions {
  enabled?: boolean;
  filters?: {
    source?: "alerts" | "incidents" | "logs" | "metrics" | "health";
    severity?: string;
    category?: string;
  };
  onAlert?: (alert: Alert) => void;
  onMetric?: (metric: BaseMetric) => void;
  onLog?: (log: Log) => void;
  onHealth?: (health: SystemHealth) => void;
  onIncident?: (incident: Incident) => void;
}

export interface UseUOCEventsStreamReturn {
  isConnected: boolean;
  lastUpdate: Date | null;
  error: Error | null;
  reconnect: () => void;
  disconnect: () => void;
}

export function useUOCEventsStream(
  options: UseUOCEventsStreamOptions
): UseUOCEventsStreamReturn {
  const { filters, onAlert, onMetric, onLog, onHealth, onIncident, enabled = true } = options;

  // Build query params
  const queryParams: Record<string, string> = {};
  if (filters?.source) {
    queryParams.source = filters.source;
  }
  if (filters?.severity) {
    queryParams.severity = filters.severity;
  }
  if (filters?.category) {
    queryParams.category = filters.category;
  }

  // Handle message event
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        // Handle different event types
        if (event.type === "alert" || data.eventType === "alert") {
          if (onAlert) {
            const alert: Alert = {
              id: data.id,
              severity: data.severity,
              category: data.category,
              title: data.title,
              description: data.description,
              triggered_at: data.timestamp || new Date().toISOString(),
              acknowledged: false,
              acknowledged_at: null,
              acknowledged_by: null,
              resolved: false,
              resolved_at: null,
              resolved_by: null,
              metadata: data.metadata || {},
              created_at: data.timestamp || new Date().toISOString(),
              updated_at: data.timestamp || new Date().toISOString(),
            };
            onAlert(alert);
          }
        } else if (event.type === "metric" || data.eventType === "metric") {
          if (onMetric) {
            const metric: BaseMetric = {
              metric_id: data.metric_id,
              metric_name: data.metric_name,
              category: data.category,
              value: data.value,
              unit: data.unit,
              priority: data.priority || "P3",
              severity: data.severity || "info",
              source: data.source || "system",
              metric_timestamp: new Date(data.timestamp || Date.now()),
              tags: data.tags,
              metadata: data.metadata,
            };
            onMetric(metric);
          }
        } else if (event.type === "log" || data.eventType === "log") {
          if (onLog) {
            const log: Log = {
              id: data.id,
              log_rule_id: data.log_rule_id || "UNKNOWN",
              log_level: data.log_level || "INFO",
              category: data.category || "System",
              severity: data.severity || "info",
              message: data.message,
              message_normalized: data.message_normalized,
              context: data.context,
              metadata: data.metadata,
              tags: data.tags || [],
              extracted_fields: data.extracted_fields,
              correlation_id: data.correlation_id,
              user_agent: data.user_agent,
              request_id: data.request_id,
              resource_type: data.resource_type,
              resource_id: data.resource_id,
              timestamp: new Date(data.timestamp || Date.now()),
              created_at: new Date(data.timestamp || Date.now()),
            };
            onLog(log);
          }
        } else if (event.type === "health" || data.eventType === "health") {
          if (onHealth) {
            const health: SystemHealth = {
              status: data.status,
              score: data.score,
              issues: data.issues || [],
              metrics_summary: data.metrics_summary || {},
              updated_at: new Date(data.timestamp || Date.now()),
            };
            onHealth(health);
          }
        } else if (event.type === "incident" || data.eventType === "incident") {
          if (onIncident) {
            const incident: Incident = {
              id: data.id,
              title: data.title,
              severity: data.severity,
              status: data.status,
              sla_minutes: data.sla_minutes || 0,
              sla_started_at: data.sla_started_at || new Date().toISOString(),
              opened_at: data.opened_at || new Date().toISOString(),
              opened_by: data.opened_by || "system",
              escalation_level: data.escalation_level || 0,
              audit_hash: data.audit_hash || "",
              created_at: data.created_at || new Date().toISOString(),
              updated_at: data.updated_at || new Date().toISOString(),
            };
            onIncident(incident);
          }
        }
      } catch (err) {
        console.error("UOC Events Stream: Failed to parse message", err);
      }
    },
    [onAlert, onMetric, onLog, onHealth, onIncident]
  );

  // SSE stream options
  const sseOptions: UseSSEStreamOptions = {
    url: "/api/orchestrator/uoc/stream/events",
    enabled,
    autoReconnect: true,
    reconnectInterval: 5000,
    onMessage: handleMessage,
    queryParams,
  };

  return useSSEStream(sseOptions);
}




