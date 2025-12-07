/**
 * UOC Alerts Stream Hook - Enterprise++ Standard P9
 * 
 * Hook für Alerts-Streaming
 */

"use client";

import { useCallback } from "react";
import { useSSEStream, UseSSEStreamOptions } from "./useSSEStream";
import type { Alert } from "@/lib/ki-orchestrator/level2/types";

export interface UseUOCAlertsStreamOptions {
  enabled?: boolean;
  filters?: {
    severity?: string;
    category?: string;
  };
  onAlert?: (alert: Alert) => void;
}

export interface UseUOCAlertsStreamReturn {
  isConnected: boolean;
  lastUpdate: Date | null;
  error: Error | null;
  reconnect: () => void;
  disconnect: () => void;
}

export function useUOCAlertsStream(
  options: UseUOCAlertsStreamOptions
): UseUOCAlertsStreamReturn {
  const { filters, onAlert, enabled = true } = options;

  // Build query params
  const queryParams: Record<string, string> = {};
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

        if (onAlert) {
          const now = new Date().toISOString();
          const alert: Alert = {
            id: data.id || `alert-${Date.now()}`,
            alert_rule_id: data.alert_rule_id || "stream",
            severity: data.severity,
            category: data.category,
            status: "open",
            title: data.title,
            description: data.description,
            triggered_at: data.timestamp || now,
            acknowledged_at: null,
            acknowledged_by: null,
            escalated_at: null,
            escalated_by: null,
            closed_at: null,
            created_at: now,
            updated_at: now,
            closed_by: null,
            payload: data.metadata || {},
            audit_hash: "",
          };
          onAlert(alert);
        }
      } catch (err) {
        console.error("UOC Alerts Stream: Failed to parse message", err);
      }
    },
    [onAlert]
  );

  // SSE stream options
  const sseOptions: UseSSEStreamOptions = {
    url: "/api/orchestrator/uoc/stream/alerts",
    enabled,
    autoReconnect: true,
    reconnectInterval: 5000,
    onMessage: handleMessage,
    queryParams,
  };

  return useSSEStream(sseOptions);
}




