/**
 * UOC Health Stream Hook - Enterprise++ Standard P9
 * 
 * Hook für Health-Streaming
 */

"use client";

import { useCallback } from "react";
import { useSSEStream, UseSSEStreamOptions } from "./useSSEStream";
import type { SystemHealth } from "@/lib/telemetry/types";

export interface UseUOCHealthStreamOptions {
  enabled?: boolean;
  onHealth?: (health: SystemHealth) => void;
}

export interface UseUOCHealthStreamReturn {
  isConnected: boolean;
  lastUpdate: Date | null;
  error: Error | null;
  reconnect: () => void;
  disconnect: () => void;
}

export function useUOCHealthStream(
  options: UseUOCHealthStreamOptions
): UseUOCHealthStreamReturn {
  const { onHealth, enabled = true } = options;

  // Handle message event
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

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
      } catch (err) {
        console.error("UOC Health Stream: Failed to parse message", err);
      }
    },
    [onHealth]
  );

  // SSE stream options
  const sseOptions: UseSSEStreamOptions = {
    url: "/api/orchestrator/uoc/stream/health",
    enabled,
    autoReconnect: true,
    reconnectInterval: 5000,
    onMessage: handleMessage,
  };

  return useSSEStream(sseOptions);
}




