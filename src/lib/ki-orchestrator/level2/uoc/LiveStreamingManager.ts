/**
 * Live Streaming Manager - Enterprise++ Standard P9
 * 
 * Verwaltet SSE/WebSocket-Verbindungen für Live-Updates
 */

import type {
  SSEConnection,
  WebSocketConnection,
  StreamFilters,
  LiveUpdate,
} from "./types";
import { logger } from "@/lib/logger";

export class LiveStreamingManager {
  private sseConnections: Map<string, SSEConnection> = new Map();
  private wsConnections: Map<string, WebSocketConnection> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Starte Heartbeat-Intervall (alle 30 Sekunden)
    this.startHeartbeat();
  }

  /**
   * Erstelle SSE-Verbindung
   */
  createSSEConnection(
    clientId: string,
    filters?: StreamFilters
  ): SSEConnection {
    try {
      const connection: SSEConnection = {
        id: `sse-${clientId}-${Date.now()}`,
        clientId,
        filters,
        lastHeartbeat: new Date(),
        createdAt: new Date(),
      };

      this.sseConnections.set(connection.id, connection);
      logger.info("LiveStreamingManager: SSE connection created", { connectionId: connection.id });

      return connection;
    } catch (error) {
      logger.error("LiveStreamingManager.createSSEConnection failed", { error, clientId });
      throw error;
    }
  }

  /**
   * Erstelle WebSocket-Verbindung (optional)
   */
  createWebSocketConnection(
    clientId: string,
    filters?: StreamFilters
  ): WebSocketConnection {
    try {
      const connection: WebSocketConnection = {
        id: `ws-${clientId}-${Date.now()}`,
        clientId,
        filters,
        lastHeartbeat: new Date(),
        createdAt: new Date(),
      };

      this.wsConnections.set(connection.id, connection);
      logger.info("LiveStreamingManager: WebSocket connection created", {
        connectionId: connection.id,
      });

      return connection;
    } catch (error) {
      logger.error("LiveStreamingManager.createWebSocketConnection failed", {
        error,
        clientId,
      });
      throw error;
    }
  }

  /**
   * Sende Live-Update
   */
  sendLiveUpdate(
    connectionId: string,
    eventType: "alert" | "metric" | "log" | "health" | "incident",
    data: unknown
  ): void {
    try {
      // Prüfe SSE-Verbindung
      const sseConnection = this.sseConnections.get(connectionId);
      if (sseConnection) {
        // Prüfe Filter
        if (this.matchesFilters(sseConnection.filters, eventType, data)) {
          // Update wird über SSE-Response gesendet (nicht hier)
          // Diese Methode wird von API-Route aufgerufen
          logger.debug("LiveStreamingManager: Live update queued for SSE", {
            connectionId,
            eventType,
          });
        }
      }

      // Prüfe WebSocket-Verbindung
      const wsConnection = this.wsConnections.get(connectionId);
      if (wsConnection) {
        // Prüfe Filter
        if (this.matchesFilters(wsConnection.filters, eventType, data)) {
          // Update wird über WebSocket gesendet (nicht hier)
          // Diese Methode wird von API-Route aufgerufen
          logger.debug("LiveStreamingManager: Live update queued for WebSocket", {
            connectionId,
            eventType,
          });
        }
      }
    } catch (error) {
      logger.error("LiveStreamingManager.sendLiveUpdate failed", {
        error,
        connectionId,
        eventType,
      });
    }
  }

  /**
   * Sende Heartbeat
   */
  sendHeartbeat(connectionId: string): void {
    try {
      const sseConnection = this.sseConnections.get(connectionId);
      if (sseConnection) {
        sseConnection.lastHeartbeat = new Date();
      }

      const wsConnection = this.wsConnections.get(connectionId);
      if (wsConnection) {
        wsConnection.lastHeartbeat = new Date();
      }
    } catch (error) {
      logger.error("LiveStreamingManager.sendHeartbeat failed", { error, connectionId });
    }
  }

  /**
   * Schließe Verbindung
   */
  closeConnection(connectionId: string): void {
    try {
      const sseRemoved = this.sseConnections.delete(connectionId);
      const wsRemoved = this.wsConnections.delete(connectionId);

      if (sseRemoved || wsRemoved) {
        logger.info("LiveStreamingManager: Connection closed", { connectionId });
      }
    } catch (error) {
      logger.error("LiveStreamingManager.closeConnection failed", { error, connectionId });
    }
  }

  /**
   * Hole alle aktiven SSE-Verbindungen
   */
  getSSEConnections(): SSEConnection[] {
    return Array.from(this.sseConnections.values());
  }

  /**
   * Hole alle aktiven WebSocket-Verbindungen
   */
  getWebSocketConnections(): WebSocketConnection[] {
    return Array.from(this.wsConnections.values());
  }

  /**
   * Prüfe, ob Update zu Filtern passt
   */
  private matchesFilters(
    filters: StreamFilters | undefined,
    eventType: "alert" | "metric" | "log" | "health" | "incident",
    data: unknown
  ): boolean {
    if (!filters) {
      return true; // Keine Filter = alle Updates
    }

    // Prüfe Event-Typ
    if (filters.eventTypes && filters.eventTypes.length > 0) {
      if (!filters.eventTypes.includes(eventType)) {
        return false;
      }
    }

    // Prüfe Kategorien (falls vorhanden)
    if (filters.categories && filters.categories.length > 0) {
      const category = (data as any).category;
      if (!category || !filters.categories.includes(category)) {
        return false;
      }
    }

    // Prüfe Severities (falls vorhanden)
    if (filters.severities && filters.severities.length > 0) {
      const severity = (data as any).severity;
      if (!severity || !filters.severities.includes(severity)) {
        return false;
      }
    }

    // Prüfe Sources (falls vorhanden)
    if (filters.sources && filters.sources.length > 0) {
      const source = (data as any).source;
      if (!source || !filters.sources.includes(source)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Starte Heartbeat-Intervall
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      try {
        const now = new Date();
        const timeout = 60000; // 60 Sekunden Timeout

        // Prüfe SSE-Verbindungen
        for (const [id, connection] of this.sseConnections.entries()) {
          const timeSinceLastHeartbeat =
            now.getTime() - connection.lastHeartbeat.getTime();
          if (timeSinceLastHeartbeat > timeout) {
            // Verbindung ist abgelaufen
            this.closeConnection(id);
          }
        }

        // Prüfe WebSocket-Verbindungen
        for (const [id, connection] of this.wsConnections.entries()) {
          const timeSinceLastHeartbeat =
            now.getTime() - connection.lastHeartbeat.getTime();
          if (timeSinceLastHeartbeat > timeout) {
            // Verbindung ist abgelaufen
            this.closeConnection(id);
          }
        }
      } catch (error) {
        logger.error("LiveStreamingManager.heartbeat failed", { error });
      }
    }, 30000); // Alle 30 Sekunden
  }

  /**
   * Stoppe Heartbeat-Intervall
   */
  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export const liveStreamingManager = new LiveStreamingManager();




