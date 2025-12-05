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




