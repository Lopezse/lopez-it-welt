/**
 * UOC Metrics Stream Hook - Enterprise++ Standard P9
 * 
 * Hook für Metrics-Streaming
 */

"use client";

import { useCallback } from "react";
import { useSSEStream, UseSSEStreamOptions } from "./useSSEStream";
import type { BaseMetric } from "@/lib/telemetry/types";

export interface UseUOCMetricsStreamOptions {
  enabled?: boolean;
  filters?: {
    category?: string;
    metric_id?: string;
  };
  onMetric?: (metric: BaseMetric) => void;
}

export interface UseUOCMetricsStreamReturn {
  isConnected: boolean;
  lastUpdate: Date | null;
  error: Error | null;
  reconnect: () => void;
  disconnect: () => void;
}

export function useUOCMetricsStream(
  options: UseUOCMetricsStreamOptions
): UseUOCMetricsStreamReturn {
  const { filters, onMetric, enabled = true } = options;

  // Build query params
  const queryParams: Record<string, string> = {};
  if (filters?.category) {
    queryParams.category = filters.category;
  }
  if (filters?.metric_id) {
    queryParams.metric_id = filters.metric_id;
  }

  // Handle message event
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

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
      } catch (err) {
        console.error("UOC Metrics Stream: Failed to parse message", err);
      }
    },
    [onMetric]
  );

  // SSE stream options
  const sseOptions: UseSSEStreamOptions = {
    url: "/api/orchestrator/uoc/stream/metrics",
    enabled,
    autoReconnect: true,
    reconnectInterval: 5000,
    onMessage: handleMessage,
    queryParams,
  };

  return useSSEStream(sseOptions);
}




