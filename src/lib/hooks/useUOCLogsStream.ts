/**
 * UOC Logs Stream Hook - Enterprise++ Standard P9
 * 
 * Hook für Logs-Streaming
 */

"use client";

import { useCallback } from "react";
import { useSSEStream, UseSSEStreamOptions } from "./useSSEStream";
import type { Log } from "@/lib/ki-orchestrator/level2/logs/types";

export interface UseUOCLogsStreamOptions {
  enabled?: boolean;
  filters?: {
    log_level?: string;
    category?: string;
    severity?: string;
  };
  onLog?: (log: Log) => void;
}

export interface UseUOCLogsStreamReturn {
  isConnected: boolean;
  lastUpdate: Date | null;
  error: Error | null;
  reconnect: () => void;
  disconnect: () => void;
}

export function useUOCLogsStream(
  options: UseUOCLogsStreamOptions
): UseUOCLogsStreamReturn {
  const { filters, onLog, enabled = true } = options;

  // Build query params
  const queryParams: Record<string, string> = {};
  if (filters?.log_level) {
    queryParams.log_level = filters.log_level;
  }
  if (filters?.category) {
    queryParams.category = filters.category;
  }
  if (filters?.severity) {
    queryParams.severity = filters.severity;
  }

  // Handle message event
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

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
      } catch (err) {
        console.error("UOC Logs Stream: Failed to parse message", err);
      }
    },
    [onLog]
  );

  // SSE stream options
  const sseOptions: UseSSEStreamOptions = {
    url: "/api/orchestrator/uoc/stream/logs",
    enabled,
    autoReconnect: true,
    reconnectInterval: 5000,
    onMessage: handleMessage,
    queryParams,
  };

  return useSSEStream(sseOptions);
}




