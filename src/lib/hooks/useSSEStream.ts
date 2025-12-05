/**
 * SSE Stream Hook - Enterprise++ Standard P9
 * 
 * Wiederverwendbarer Hook für Server-Sent Events (SSE) mit Auto-Reconnect
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseSSEStreamOptions {
  url: string;
  enabled?: boolean;
  autoReconnect?: boolean;
  reconnectInterval?: number; // Standard: 5000ms
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  queryParams?: Record<string, string>;
}

export interface UseSSEStreamReturn {
  isConnected: boolean;
  lastUpdate: Date | null;
  error: Error | null;
  reconnect: () => void;
  disconnect: () => void;
}

export function useSSEStream(options: UseSSEStreamOptions): UseSSEStreamReturn {
  const {
    url,
    enabled = true,
    autoReconnect = true,
    reconnectInterval = 5000,
    onMessage,
    onError,
    onOpen,
    onClose,
    queryParams,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Build URL with query params
  const buildUrl = useCallback(() => {
    if (!queryParams || Object.keys(queryParams).length === 0) {
      return url;
    }

    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });

    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${params.toString()}`;
  }, [url, queryParams]);

  // Disconnect function
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }

    setIsConnected(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Reconnect function
  const reconnect = useCallback(() => {
    disconnect();

    if (!enabled || !isMountedRef.current) {
      return;
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && enabled) {
        // Reconnect will be handled by useEffect
        setIsConnected(false);
        setError(null);
      }
    }, reconnectInterval);
  }, [enabled, reconnectInterval, disconnect]);

  // Setup heartbeat timeout
  const setupHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }

    // Heartbeat timeout: 35 seconds (30s heartbeat + 5s buffer)
    heartbeatTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && isConnected) {
        // No heartbeat received, consider connection lost
        setError(new Error("Heartbeat timeout - connection lost"));
        setIsConnected(false);
        if (autoReconnect) {
          reconnect();
        }
      }
    }, 35000);
  }, [isConnected, autoReconnect, reconnect]);

  // Connect function
  const connect = useCallback(() => {
    if (!enabled || !isMountedRef.current) {
      return;
    }

    // Cleanup existing connection
    disconnect();

    try {
      const fullUrl = buildUrl();
      const eventSource = new EventSource(fullUrl, { withCredentials: true });

      eventSourceRef.current = eventSource;

      // Handle open
      eventSource.onopen = () => {
        if (!isMountedRef.current) {
          eventSource.close();
          return;
        }

        setIsConnected(true);
        setError(null);
        setLastUpdate(new Date());
        setupHeartbeat();

        if (onOpen) {
          onOpen();
        }
      };

      // Handle message
      eventSource.onmessage = (event: MessageEvent) => {
        if (!isMountedRef.current) {
          return;
        }

        setLastUpdate(new Date());
        setupHeartbeat();

        if (onMessage) {
          onMessage(event);
        }
      };

      // Handle custom events (alert, metric, log, health, heartbeat)
      const eventTypes = ["alert", "metric", "log", "health", "incident", "heartbeat"];
      eventTypes.forEach((eventType) => {
        eventSource.addEventListener(eventType, (event: Event) => {
          if (!isMountedRef.current) {
            return;
          }

          const messageEvent = event as MessageEvent;
          setLastUpdate(new Date());
          setupHeartbeat();

          if (onMessage) {
            onMessage(messageEvent);
          }
        });
      });

      // Handle error
      eventSource.onerror = (err: Event) => {
        if (!isMountedRef.current) {
          return;
        }

        const error = new Error("SSE connection error");
        setError(error);
        setIsConnected(false);

        if (onError) {
          onError(err);
        }

        // Auto-reconnect if enabled
        if (autoReconnect && eventSource.readyState === EventSource.CLOSED) {
          reconnect();
        }
      };
    } catch (err) {
      if (!isMountedRef.current) {
        return;
      }

      const error = err instanceof Error ? err : new Error("Failed to create SSE connection");
      setError(error);
      setIsConnected(false);

      if (autoReconnect) {
        reconnect();
      }
    }
  }, [enabled, buildUrl, disconnect, onOpen, onMessage, onError, autoReconnect, reconnect, setupHeartbeat]);

  // Effect to manage connection
  useEffect(() => {
    isMountedRef.current = true;

    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      isMountedRef.current = false;
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    isConnected,
    lastUpdate,
    error,
    reconnect,
    disconnect,
  };
}




